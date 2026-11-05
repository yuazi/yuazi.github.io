---
title: "Teleportation and Superdense Coding"
tags:
  - quantum-computing
  - protocols
  - entanglement
date: 2026-11-05
---

Teleportation moves an unknown qubit state from Alice to Bob using one shared Bell pair and two classical bits. Superdense coding runs the same resources in the other direction: one shared Bell pair and one transmitted qubit carry two classical bits. Together they show what entanglement is worth as a communication resource, and teleportation is also the standard first example of a circuit with mid-circuit measurement and classical feed-forward.

![[pictures/topics/quantum/teleportation-and-superdense-coding.png]]

<p class="image-caption">Teleportation moves a qubit's state, not the qubit itself, using a shared entangled pair and a phone call. Rendered with Qiskit; the last two gates stand in for the corrections controlled by Alice's two measured bits.</p>

## Mental Model

- Teleportation does not send the qubit. It sends two classical bits that tell Bob which of four Pauli corrections turns his half of the Bell pair into the original state.
- Before the classical bits arrive, Bob's qubit is maximally mixed, so nothing travels faster than light.
- The original state is destroyed by Alice's measurement, which is consistent with the no-cloning theorem.
- Superdense coding is the dual: Alice picks one of four Paulis to apply to her half, and Bob decodes with a Bell measurement.
- Resource accounting: 1 ebit + 2 cbits $\ge$ 1 qubit (teleportation), and 1 ebit + 1 qubit $\ge$ 2 cbits (superdense coding).

## 1. Teleportation, Step by Step

Alice holds the unknown $\lvert\psi\rangle = \alpha\lvert 0\rangle + \beta\lvert 1\rangle$ on qubit 1. Alice and Bob share $\Phi^+ = \tfrac{1}{\sqrt2}(\lvert 00\rangle + \lvert 11\rangle)$ on qubits 2 (Alice) and 3 (Bob). The joint state is

$$
\lvert\psi\rangle \lvert\Phi^+\rangle = \tfrac{1}{\sqrt2}\bigl(\alpha\lvert 000\rangle + \alpha\lvert 011\rangle + \beta\lvert 100\rangle + \beta\lvert 111\rangle\bigr).
$$

Alice will measure qubits 1 and 2 in the Bell basis (see [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]]). Substitute $\lvert 00\rangle = (\Phi^+ + \Phi^-)/\sqrt2$, $\lvert 11\rangle = (\Phi^+ - \Phi^-)/\sqrt2$, $\lvert 01\rangle = (\Psi^+ + \Psi^-)/\sqrt2$ and $\lvert 10\rangle = (\Psi^+ - \Psi^-)/\sqrt2$ on qubits 1 and 2 and collect terms:

$$
\tfrac12\Bigl[\Phi^+ (\alpha\lvert 0\rangle + \beta\lvert 1\rangle) + \Phi^- (\alpha\lvert 0\rangle - \beta\lvert 1\rangle) + \Psi^+ (\alpha\lvert 1\rangle + \beta\lvert 0\rangle) + \Psi^- (\alpha\lvert 1\rangle - \beta\lvert 0\rangle)\Bigr].
$$

Each Bell outcome has probability $\tfrac14$, whatever $\alpha$ and $\beta$ are, and leaves Bob's qubit in a Pauli-rotated copy of $\lvert\psi\rangle$:

| Alice's outcome | Bob's state                                    | Bob applies  |
| --------------- | ---------------------------------------------- | ------------ |
| $\Phi^+$        | $\alpha\lvert 0\rangle + \beta\lvert 1\rangle$ | nothing      |
| $\Phi^-$        | $\alpha\lvert 0\rangle - \beta\lvert 1\rangle$ | $Z$          |
| $\Psi^+$        | $\alpha\lvert 1\rangle + \beta\lvert 0\rangle$ | $X$          |
| $\Psi^-$        | $\alpha\lvert 1\rangle - \beta\lvert 0\rangle$ | $X$ then $Z$ |

For the last row, $X$ gives $\alpha\lvert 0\rangle - \beta\lvert 1\rangle$ and $Z$ finishes the job. I verified numerically with a random $\lvert\psi\rangle$ that every one of the four outcomes has probability 0.25 and that the corrected fidelity with $\lvert\psi\rangle$ is exactly 1.

### The Circuit

The Bell-basis measurement is a CX from qubit 1 to qubit 2, an H on qubit 1, and a $Z$-basis readout of both: this is the Bell-state circuit run backwards. Read the bits as $m_z$ from qubit 1 (the one that went through H) and $m_x$ from qubit 2. Bob applies $X^{m_x}$ and then $Z^{m_z}$. The mapping from outcomes to bits is $\Phi^+ \to 00$, $\Phi^- \to m_z = 1, m_x = 0$, $\Psi^+ \to m_z = 0, m_x = 1$, $\Psi^- \to 11$.

## 2. Why Nothing Travels Faster Than Light

Bob's state before he hears anything is the average over the four equally likely outcomes:

$$
\tfrac14\bigl(\rho + Z\rho Z + X\rho X + XZ\rho Z X\bigr) = \tfrac{I}{2}
$$

for any $\rho = \lvert\psi\rangle\langle\psi\rvert$. The Pauli twirl wipes out all information about $\alpha$ and $\beta$ (see [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]]). Only after the two classical bits arrive over an ordinary channel can Bob undo the rotation. Alice's measurement also leaves her with no copy of $\lvert\psi\rangle$, so the protocol moves the state and does not clone it.

Note what is not transmitted: neither $\alpha$ nor $\beta$ (continuous parameters that would take infinitely many bits to write down) ever crosses the classical channel. Two bits are enough because the entangled pair already carries the rest of the structure.

## 3. Dynamic-Circuit Version in Qiskit

Qiskit 2 supports classical control flow with `if_test`, so Bob's correction can sit inside the circuit rather than being applied by hand after the fact.

```python
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit_aer import AerSimulator

q = QuantumRegister(3, "q")
mz, mx, out = (ClassicalRegister(1, n) for n in ("mz", "mx", "out"))
qc = QuantumCircuit(q, mz, mx, out)

qc.ry(0.8, 0); qc.rz(0.6, 0)           # q0: the unknown state to teleport
qc.h(1); qc.cx(1, 2)                   # Bell pair shared by Alice (q1) and Bob (q2)
qc.cx(0, 1); qc.h(0)                   # Alice's Bell-basis rotation
qc.measure(0, mz[0]); qc.measure(1, mx[0])

with qc.if_test((mx, 1)):
    qc.x(2)                            # X^{m_x}
with qc.if_test((mz, 1)):
    qc.z(2)                            # then Z^{m_z}

# check: undo the preparation on Bob's qubit, which must now read 0
qc.rz(-0.6, 2); qc.ry(-0.8, 2)
qc.measure(2, out[0])

sim = AerSimulator()
print(sim.run(transpile(qc, sim), shots=2000).result().get_counts())
```

Running this on Aer gives all four $(m_z, m_x)$ combinations in roughly equal shares (about 430 to 540 of 2000 each) and `out = 0` in every shot, which is the success criterion. Dropping the two `if_test` blocks makes `out` read 1 in a large share of shots (I got 1 in about half of 2000 shots), exactly the shots where a correction was skipped. On real hardware the feed-forward needs a backend with dynamic-circuit support, and the idle time while the measurement result is processed adds decoherence to Bob's qubit (see [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]]). Without the classically controlled gates, the principle of deferred measurement lets you replace them with a controlled-X from qubit 1 and a controlled-Z from qubit 0 to qubit 2, and measure at the end.

## 4. Superdense Coding

Superdense coding sends two classical bits $(z, x)$ by transmitting one qubit.

1. Alice and Bob share $\Phi^+$, qubit $A$ with Alice and $B$ with Bob.
2. Alice applies $Z^z X^x$ to $A$ and sends it to Bob. The four choices turn $\Phi^+$ into the four Bell states: identity gives $\Phi^+$, $X$ gives $\Psi^+$, $Z$ gives $\Phi^-$, and $ZX$ gives $\Psi^-$ (up to a global phase).
3. Bob now has both qubits and runs the Bell circuit backwards: CX from $A$ to $B$, then H on $A$, then measures. $A$ reads $z$ and $B$ reads $x$.

I simulated all four cases and Bob decoded each of the four two-bit messages with probability 1.

Alice's single qubit has reduced state $I/2$ whatever she applies, so a third party intercepting it learns nothing. Only the pair, together, holds the message. This is a mirror image of the teleportation twirl.

## 5. Resource Accounting

The two protocols bound each other:

| Protocol          | Consumes             | Produces            |
| ----------------- | -------------------- | ------------------- |
| Teleportation     | 1 ebit, 2 cbits      | 1 qubit transferred |
| Superdense coding | 1 ebit, 1 qubit sent | 2 cbits transferred |

One qubit sent cannot carry more than one classical bit without help (the Holevo bound), so the second bit in superdense coding is paid for by the entanglement already shared. In the other direction, two classical bits per teleported qubit is the known minimum, so the entangled pair does not replace the classical channel. An ebit is the unit of entanglement in one maximally entangled pair, and once consumed it is gone.

## Related

- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for the Bell basis both protocols depend on.
- [[notes/quantum/quantum-gates|Quantum Gates]] for the H, CX and Pauli gates in the circuits.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] for mid-circuit measurement and deferred measurement.
- [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for why Bob's pre-correction state is $I/2$.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]] for gate teleportation in fault-tolerant schemes.
- [[notes/lectures/qiskit/00-qiskit-patterns-and-primitives|QGSS: Qiskit Patterns and Primitives]] for dynamic circuits and the primitives that run them.
