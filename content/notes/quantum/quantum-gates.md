---
title: "Quantum Gates"
tags:
  - quantum-computing
  - fundamentals
date: 2026-11-05
---

A quantum gate is a unitary matrix acting on the state vector of one or more qubits. A circuit is a product of such matrices, followed by measurement. I use this page as a lookup table: the standard matrices, the identities that let you rewrite circuits, and how the textbook gates turn into the handful of operations a real chip implements.

## Mental Model

- Gates are unitary: $U^\dagger U = I$. That makes them reversible and norm-preserving, and it is why no gate can copy an unknown state or erase information.
- On a single qubit, a gate is a rotation of the [[notes/quantum/qubits-and-the-bloch-sphere|Bloch sphere]]. The Paulis are half-turns, $R_P(\vartheta)$ is a turn by any angle.
- A small set of gates is enough for everything: single-qubit rotations plus one entangling gate, or Clifford plus T if you want a finite set.
- Clifford gates (H, S, CX) are cheap to simulate and, on error-corrected machines, cheap to run. T is the expensive one.
- Hardware has its own native gates. Everything else is compiled into them.

## 1. Single-Qubit Gates

| Gate      | Matrix                                                   | Action                                                      |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| $X$       | $\begin{pmatrix}0&1\\1&0\end{pmatrix}$                   | bit flip, $\lvert 0\rangle \leftrightarrow \lvert 1\rangle$ |
| $Y$       | $\begin{pmatrix}0&-i\\i&0\end{pmatrix}$                  | bit and phase flip                                          |
| $Z$       | $\begin{pmatrix}1&0\\0&-1\end{pmatrix}$                  | phase flip, $\lvert 1\rangle \to -\lvert 1\rangle$          |
| $H$       | $\tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ | $Z$ basis to $X$ basis                                      |
| $S$       | $\begin{pmatrix}1&0\\0&i\end{pmatrix}$                   | quarter turn about $z$, $S^2 = Z$                           |
| $T$       | $\begin{pmatrix}1&0\\0&e^{i\pi/4}\end{pmatrix}$          | eighth turn about $z$, $T^2 = S$                            |
| $\sqrt X$ | $\tfrac12\begin{pmatrix}1+i&1-i\\1-i&1+i\end{pmatrix}$   | half of an $X$, $(\sqrt X)^2 = X$                           |

The Paulis square to the identity and anticommute: $XY = iZ$ and cyclic permutations. Each Pauli has eigenvalues $\pm 1$, which is why they double as measurement observables (see [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]]).

### Rotations

The continuous family is $R_P(\vartheta) = e^{-i\vartheta P/2} = \cos\tfrac{\vartheta}{2}\, I - i \sin\tfrac{\vartheta}{2}\, P$ for $P \in \{X, Y, Z\}$. It rotates the Bloch vector by $\vartheta$ around the $P$ axis. In matrix form,

$$
R_Z(\vartheta) = \begin{pmatrix} e^{-i\vartheta/2} & 0 \\ 0 & e^{i\vartheta/2} \end{pmatrix}.
$$

So $R_X(\pi) = -iX$, which is $X$ up to a global phase. The phase gate $P(\varphi) = \mathrm{diag}(1, e^{i\varphi})$ equals $R_Z(\varphi)$ up to global phase, and $S = P(\pi/2)$, $T = P(\pi/4)$. Any single-qubit unitary can be written as $R_Z(\alpha) R_Y(\beta) R_Z(\gamma)$ times a global phase, so three angles suffice.

### Identities Worth Remembering

Conjugating by $H$ swaps the $X$ and $Z$ axes:

$$
HZH = X, \qquad HXH = Z, \qquad HYH = -Y.
$$

These are all verified numerically. They explain basis changes: to measure $X$, apply $H$ and measure $Z$. A related one is $S^2 = Z$ and $T^2 = S$, which again checks out in numpy.

## 2. Two-Qubit and Controlled Gates

Controlled-$U$ applies $U$ to the target when the control is $\lvert 1\rangle$:

$$
CU = \lvert 0\rangle\langle 0\rvert \otimes I + \lvert 1\rangle\langle 1\rvert \otimes U.
$$

CX (CNOT) is the case $U = X$, and CZ is $U = Z$. CZ is symmetric in its two qubits, since it only puts a $-1$ on $\lvert 11\rangle$. SWAP exchanges two qubits and equals three CX gates with alternating control and target. I checked in Qiskit that the three-CX circuit gives the same unitary as the SWAP gate.

CX and CZ are related by a basis change on the target:

$$
CZ = (I \otimes H)\, CX\, (I \otimes H).
$$

I checked this with `Operator.equiv`, and it holds exactly, with no phase to ignore. It matters on hardware: a device whose native entangler is CZ implements CX by wrapping CZ in two Hadamards on the target.

The Toffoli (CCX) flips the target when both controls are 1. It can be built from 6 CX gates together with $H$, $T$ and $T^\dagger$ gates (Qiskit's transpiler produces 6 CX, 4 T and 3 $T^\dagger$ with 2 H). It is the quantum version of a reversible AND, and the standard building block for classical logic inside algorithms like [[notes/quantum/grovers-search|Grover's Search]].

> [!tip] Intuition
> A controlled gate is where the control stops being a switch and becomes a participant. With the control in superposition, $CU$ produces a state in which the target has done two things at once, and the amplitudes of the two branches interfere later. Entanglement (see [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]]) and phase kickback both come from this.

## 3. Universality

Two results, one exact and one approximate:

- Any unitary on $n$ qubits can be written exactly as a circuit of single-qubit gates and CX (Barenco et al., 1995). The count can be exponential in $n$, but the gate set is finite in kind.
- A finite set such as $\{H, T, CX\}$ approximates any unitary to accuracy $\varepsilon$. The Solovay-Kitaev theorem says that for single-qubit gates the sequence length grows only polylogarithmically in $1/\varepsilon$, so approximating is cheap.

The Clifford group is the set of unitaries that map Pauli operators to Pauli operators under conjugation, and it is generated by $H$, $S$ and CX. Adding $T$ breaks out of it. The Gottesman-Knill theorem says circuits made only of Clifford gates, stabilizer-state inputs and Pauli measurements can be simulated efficiently on a classical computer. So the T gate is where the potential quantum advantage in this gate set comes from, and on error-corrected hardware it is the costly gate (see [[notes/quantum/quantum-error-correction|Quantum Error Correction]]).

## 4. Native Gates and Decomposition

Real chips run a short list of operations. On IBM Heron the native set used in the QGSS labs is $\{R_Z, \sqrt X, X, \mathrm{CZ}\}$. $R_Z$ is a "virtual" gate, a change of reference frame done in software at zero duration, so it costs no time and adds no error. Everything else is compiled:

$$
H = e^{i\pi/4}\, R_Z(\tfrac{\pi}{2})\, \sqrt X\, R_Z(\tfrac{\pi}{2}).
$$

Running Qiskit's transpiler with `basis_gates=["rz", "sx", "x", "cz"]` on a Bell circuit gives 6 `rz`, 3 `sx` and 1 `cz`, and the unitary still matches the original:

```python
from qiskit import QuantumCircuit, transpile
from qiskit.quantum_info import Operator

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
t = transpile(qc, basis_gates=["rz", "sx", "x", "cz"], optimization_level=1)
print(t.count_ops())                    # rz: 6, sx: 3, cz: 1
print(Operator(t).equiv(Operator(qc)))  # True
```

The three Hadamards are one for the explicit H and two wrapped around the CZ that replaces the CX, each expanded into $R_Z \sqrt X R_Z$. A SWAP, three CX, becomes three CZ plus single-qubit gates, which is the "SWAP costs 3 CZ" figure in [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]]. Two-qubit gates dominate the error budget on real devices, so counting CZ gates after transpilation is the number to watch (see [[notes/quantum/quantum-hardware|Qubit Hardware Platforms]]).

## 5. A Short Worked Example

Start with $\lvert 0\rangle$ and apply $H$, then $S$, then $H$. After $H$ the state is $\lvert +\rangle$ at $+x$. $S$ is a quarter turn about $z$ and takes it to $\lvert +i\rangle$ at $+y$. The final $H$ swaps $x$ and $z$ and flips $y$, so $\lvert +i\rangle$ at $(0, 1, 0)$ maps to $(0, -1, 0)$, which is $\lvert -i\rangle$. Equivalently, $HSH$ is a $\sqrt X$ up to phase, a quarter turn about $x$, applied to $\lvert 0\rangle$ at the north pole.

## Related

- [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]] for the geometric picture behind rotations.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] for basis changes using H and S.
- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for the H plus CX circuit.
- [[notes/quantum/quantum-hardware|Qubit Hardware Platforms]] for why native sets differ between platforms.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]] for why T counts matter.
- [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]] for transpilation to Heron in a real lab.
