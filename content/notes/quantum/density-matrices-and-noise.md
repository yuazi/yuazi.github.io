---
title: "Density Matrices and Noise Channels"
tags:
  - quantum-computing
  - noise
  - fundamentals
date: 2026-11-05
---

A state vector describes a qubit you know everything about. Real qubits are partly unknown: they are entangled with something you cannot see, or they have been through a noisy gate. The density matrix handles both cases with one object, and quantum channels (written with Kraus operators) describe how noise acts on it. Without this page the numbers T1, T2 and gate fidelity on a hardware spec sheet stay abstract.

## Mental Model

- A density matrix $\rho$ is a probabilistic mixture of state vectors. Pure states are the special case of a single vector.
- A mixed single-qubit state is a point inside the Bloch ball, and noise moves points inward or toward a pole.
- The reduced state of half an entangled pair is mixed, even when the pair as a whole is pure. This is where mixedness comes from.
- A noise channel is a set of Kraus operators $K_k$ with $\sum_k K_k^\dagger K_k = I$. Depolarizing, bit flip, phase flip and amplitude damping are the four standard ones.
- T1 is energy relaxation, T2 is loss of phase coherence, and $T_2 \le 2T_1$ always.

## 1. Pure and Mixed States

For an ensemble where state $\lvert\psi_i\rangle$ occurs with probability $p_i$,

$$
\rho = \sum_i p_i\, \lvert\psi_i\rangle\langle\psi_i\rvert.
$$

The matrix $\rho$ is Hermitian, positive semidefinite and has trace 1. Expectation values follow $\langle O\rangle = \mathrm{Tr}(\rho O)$, and measurement probabilities are $\mathrm{Tr}(\Pi_k \rho)$, so everything on [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] carries over.

The purity $\mathrm{Tr}(\rho^2)$ equals 1 for a pure state and falls to $1/d$ for the maximally mixed state $I/d$. Different ensembles can give the same $\rho$: a 50/50 mix of $\lvert 0\rangle, \lvert 1\rangle$ and a 50/50 mix of $\lvert +\rangle, \lvert -\rangle$ are both $I/2$, and no measurement can tell them apart.

### Bloch Vector of a Mixed State

Every single-qubit density matrix can be written

$$
\rho = \tfrac12\left(I + x X + y Y + z Z\right), \qquad \vec r = (x, y, z),\ \lvert\vec r\rvert \le 1.
$$

The components are again $\langle X\rangle, \langle Y\rangle, \langle Z\rangle$. Pure states have $\lvert\vec r\rvert = 1$ (the surface of the [[notes/quantum/qubits-and-the-bloch-sphere|Bloch sphere]]), the maximally mixed state is the center, and purity is $(1 + \lvert\vec r\rvert^2)/2$. A state with $\vec r = (0.6, 0, 0.8)$ is pure; the state with $\vec r = (0.48, 0, 0.64)$ has length 0.8 and purity $0.82$.

## 2. Partial Trace

To describe one part of a joint state, trace out the rest. For $\rho_{AB}$,

$$
\rho_A = \mathrm{Tr}_B\, \rho_{AB} = \sum_j (I \otimes \langle j\rvert)\, \rho_{AB}\, (I \otimes \lvert j\rangle).
$$

> [!example] Worked example
> Take $\Phi^+ = \tfrac{1}{\sqrt2}(\lvert 00\rangle + \lvert 11\rangle)$, so
>
> $$
> \rho_{AB} = \tfrac12\bigl(\lvert 00\rangle\langle 00\rvert + \lvert 00\rangle\langle 11\rvert + \lvert 11\rangle\langle 00\rvert + \lvert 11\rangle\langle 11\rvert\bigr).
> $$
>
> Tracing out $B$ sends $\lvert 0\rangle\langle 0\rvert_B$ and $\lvert 1\rangle\langle 1\rvert_B$ to 1, but the cross terms contain $\langle 1\vert 0\rangle = 0$ and vanish. What remains is
>
> $$
> \rho_A = \tfrac12\bigl(\lvert 0\rangle\langle 0\rvert + \lvert 1\rangle\langle 1\rvert\bigr) = \tfrac{I}{2}.
> $$
>
> Qiskit's `partial_trace` gives the same matrix with purity 0.5. The whole is pure, one half is maximally mixed. The coherence is not gone, it is in correlations between $A$ and $B$ (see [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]]).

```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import DensityMatrix, Statevector, partial_trace

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
rho_a = partial_trace(DensityMatrix(Statevector(qc)), [1])   # trace out qubit 1
print(rho_a.data, rho_a.purity())    # [[.5, 0], [0, .5]], 0.5
```

## 3. Channels and Kraus Operators

Any physical operation on a system, including the effect of an environment it interacts with, can be written

$$
\mathcal{E}(\rho) = \sum_k K_k\, \rho\, K_k^\dagger, \qquad \sum_k K_k^\dagger K_k = I.
$$

A unitary is the one-operator case. The channels below are the models behind most noise simulations, including those in [[notes/lectures/qiskit/02-noise-backends-and-benchmarking|QGSS: Noise, Backends and Benchmarking]].

### Depolarizing

$$
\mathcal{E}(\rho) = (1 - p)\,\rho + p\,\tfrac{I}{2}.
$$

With probability $p$ the state is replaced by the maximally mixed state. The Bloch vector shrinks uniformly by $(1 - p)$, so $\vec r = (0.6, 0, 0.8)$ with $p = 0.2$ becomes $(0.48, 0, 0.64)$, which I confirmed numerically. Software packages differ on whether $p$ multiplies $I/2$ or a set of three Pauli errors, so check the convention before comparing numbers.

### Bit Flip and Phase Flip

Bit flip applies $X$ with probability $p$: $\mathcal{E}(\rho) = (1-p)\rho + p X\rho X$. The $x$ component is untouched and $y, z$ shrink by $1 - 2p$. Phase flip applies $Z$ instead: $x$ and $y$ shrink by $1 - 2p$ and $z$ is untouched. For $\lvert +\rangle$ and $p = 0.1$, the off-diagonal entries drop from 0.5 to 0.4.

### Amplitude Damping

This models energy loss from $\lvert 1\rangle$ to $\lvert 0\rangle$ with probability $\gamma$:

$$
K_0 = \begin{pmatrix}1&0\\0&\sqrt{1-\gamma}\end{pmatrix}, \qquad K_1 = \begin{pmatrix}0&\sqrt{\gamma}\\0&0\end{pmatrix}.
$$

With $\gamma = 0.36$, $\lvert 1\rangle\langle 1\rvert$ becomes $\mathrm{diag}(0.36, 0.64)$, and $\lvert +\rangle$ ends with populations $(0.68, 0.32)$ and off-diagonals reduced by $\sqrt{1 - \gamma} = 0.8$. Note the asymmetry: unlike depolarizing noise, this channel has a preferred end state, $\lvert 0\rangle$.

## 4. T1 and T2

On hardware, noise is characterized by two times.

T1 is the energy relaxation time. Amplitude damping with $\gamma(t) = 1 - e^{-t/T_1}$ gives population in $\lvert 1\rangle$ decaying as $e^{-t/T_1}$. The same process shrinks coherences by $e^{-t/(2T_1)}$.

T2 is the coherence time. Pure dephasing, with rate $1/T_\phi$, adds to the relaxation contribution:

$$
\frac{1}{T_2} = \frac{1}{2T_1} + \frac{1}{T_\phi}.
$$

Because $1/T_\phi \ge 0$, we get $T_2 \le 2T_1$. A qubit whose coherence decays as fast as relaxation allows has $T_2 = 2T_1$, and any extra dephasing pulls $T_2$ below that. If a spec sheet or a calibration table ever shows $T_2$ above $2T_1$, the measurement is off.

> [!example] Worked example
> Illustrative numbers: $T_1 = 100\,\mu\text{s}$ and a circuit of duration $t = 50\,\mu\text{s}$. Then $\gamma = 1 - e^{-0.5} \approx 0.393$ and amplitude damping alone shrinks coherences by $e^{-0.25} \approx 0.78$. Real devices have two-qubit gates of order tens to hundreds of nanoseconds, which is why a circuit of hundreds of gates can still fit well inside these times, and why idle time during slow readout matters.

## 5. Fidelity

Fidelity measures how close two states are. For general states,

$$
F(\rho, \sigma) = \left(\mathrm{Tr}\sqrt{\sqrt\rho\,\sigma\sqrt\rho}\right)^2,
$$

and when one of them is pure, $F = \langle\psi\rvert \sigma \lvert\psi\rangle$. It is 1 for identical states. Two quick values: $\lvert 0\rangle$ against $\lvert +\rangle$ has $F = 0.5$, and $\lvert +\rangle$ after depolarizing with $p = 0.2$ has $F = 1 - p/2 = 0.9$.

Gate fidelity applies the same idea to a channel versus its ideal unitary. Randomized benchmarking reports an average error per gate, and noise-aware mitigation (see [[notes/lectures/qiskit/03-error-mitigation-with-samplomatic|QGSS: Error Mitigation with Samplomatic]]) learns channels like those above to undo their average effect.

## Related

- [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]] for the pure-state picture that the ball extends.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] for averaging over unknown outcomes.
- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for where reduced mixed states come from.
- [[notes/quantum/quantum-hardware|Qubit Hardware Platforms]] for typical T1 and T2 scales per platform.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]] for protecting against exactly these channels.
- [[notes/lectures/qiskit/02-noise-backends-and-benchmarking|QGSS: Noise, Backends and Benchmarking]] for noise models built from real calibration data.
