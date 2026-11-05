---
title: "Entanglement and Bell States"
tags:
  - quantum-computing
  - fundamentals
  - entanglement
date: 2026-11-05
---

Entanglement is the property of a multi-qubit state that cannot be written as a product of single-qubit states. It is the resource behind teleportation, superdense coding and most of the speedups in the algorithm pages, and the CHSH inequality is the cleanest way to show that it is more than classical correlation. This page covers how to tell whether a pure state is entangled, the standard families of entangled states, and the CHSH computation with numbers.

## Mental Model

- A pure two-qubit state is a product state exactly when its $2 \times 2$ coefficient matrix has rank 1. Otherwise it is entangled.
- An entangled pair has a definite joint state and no definite individual states: each half on its own is maximally mixed in the Bell case.
- The four Bell states are an orthonormal basis of entangled states, and one H plus one CX makes any of them from a computational basis state.
- Correlations between the halves are real but cannot carry a message. Local statistics never change with what the other party does.
- CHSH puts a number on it: classical (local hidden variable) models cap out at 2, quantum mechanics reaches $2\sqrt2$.

## 1. Product versus Entangled States

A general pure two-qubit state is $\lvert\psi\rangle = \sum_{a,b} c_{ab}\lvert a b\rangle$. Arrange the amplitudes as the matrix $C = (c_{ab})$. A product state $\lvert\phi\rangle \otimes \lvert\chi\rangle$ has $c_{ab} = u_a v_b$, which is a rank-1 matrix.

The Schmidt decomposition is the singular value decomposition of $C$:

$$
\lvert\psi\rangle = \sum_k s_k\, \lvert e_k\rangle \lvert f_k\rangle, \qquad s_k \ge 0,\ \sum_k s_k^2 = 1.
$$

The number of nonzero $s_k$ is the Schmidt rank. Rank 1 means product, rank 2 means entangled. For two qubits there is a one-line test: $\det C = 0$ for a product state. The quantity $2\lvert\det C\rvert$ is the concurrence, which runs from 0 (product) to 1 (maximally entangled).

> [!example] Worked example
> $\tfrac12(\lvert 00\rangle + \lvert 01\rangle + \lvert 10\rangle + \lvert 11\rangle)$ has $C = \tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$, determinant 0, so it is $\lvert +\rangle\lvert +\rangle$.
>
> The Bell state $\tfrac{1}{\sqrt2}(\lvert 00\rangle + \lvert 11\rangle)$ has $C = \tfrac{1}{\sqrt2} I$, determinant $\tfrac12$, concurrence 1 and Schmidt coefficients $(\tfrac{1}{\sqrt2}, \tfrac{1}{\sqrt2})$. Running SVD in numpy on all four Bell states gives singular values $(0.7071, 0.7071)$ every time.
>
> The earlier state $\tfrac{1}{\sqrt3}(\lvert 00\rangle + \lvert 01\rangle + \lvert 11\rangle)$ from [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] has $\det C = \tfrac13$, so it is entangled, with concurrence $\tfrac23$.

## 2. The Bell States

$$
\lvert\Phi^\pm\rangle = \tfrac{1}{\sqrt2}(\lvert 00\rangle \pm \lvert 11\rangle), \qquad \lvert\Psi^\pm\rangle = \tfrac{1}{\sqrt2}(\lvert 01\rangle \pm \lvert 10\rangle).
$$

The circuit is H on the first qubit followed by CX with the first qubit as control. Feeding in $\lvert a b\rangle$ with $a$ on the control gives

$$
\lvert a b\rangle \longmapsto \tfrac{1}{\sqrt2}\bigl(\lvert 0, b\rangle + (-1)^a \lvert 1, \bar b\rangle\bigr),
$$

so $\lvert 00\rangle \to \Phi^+$, $\lvert 10\rangle \to \Phi^-$, $\lvert 01\rangle \to \Psi^+$, $\lvert 11\rangle \to \Psi^-$. I checked all four by simulating the circuit in Qiskit. Run the circuit backwards and you have a Bell-basis measurement, which is the first half of [[notes/quantum/teleportation-and-superdense-coding|teleportation]].

Measure both qubits of $\Phi^+$ in the $Z$ basis and you get 00 or 11 with probability $\tfrac12$ each. Measure in the $X$ basis and the two results still always agree. The correlation holds in every basis where both parties pick the same one. A pre-agreed classical answer sheet struggles to match that across all angles, and CHSH below makes the gap quantitative.

The reduced state of either qubit alone is $I/2$, a coin flip with no direction. All information is in the joint state (see [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for the partial trace).

## 3. Three Qubits: GHZ and W

With three qubits there are two inequivalent kinds of entanglement that cannot be converted into each other by local operations and classical communication (SLOCC):

$$
\lvert\mathrm{GHZ}\rangle = \tfrac{1}{\sqrt2}(\lvert 000\rangle + \lvert 111\rangle), \qquad \lvert W\rangle = \tfrac{1}{\sqrt3}(\lvert 001\rangle + \lvert 010\rangle + \lvert 100\rangle).
$$

They behave differently when a qubit is lost. Tracing out one qubit of GHZ leaves $\tfrac12(\lvert 00\rangle\langle 00\rvert + \lvert 11\rangle\langle 11\rvert)$, a classical mixture with no entanglement left. Tracing out one qubit of W leaves a two-qubit state that is still entangled; I computed its concurrence numerically and got $\tfrac23$. GHZ is the more fragile resource and the usual benchmark for "how many qubits can I entangle on this chip". W is more robust to loss. The single-qubit reduced states are $I/2$ for GHZ and $\mathrm{diag}(\tfrac23, \tfrac13)$ for W.

## 4. No Signalling

Suppose Alice and Bob share $\Phi^+$. Whatever Alice does locally (any measurement, any unitary), Bob's reduced state remains $I/2$. His outcome distribution in any basis is uniform until he sees a classical message from Alice, so the shared pair transmits no information on its own. This is the no-signalling property and it is why teleportation and superdense coding still need a classical or physical channel.

## 5. The CHSH Inequality

Alice picks one of two $\pm1$ observables $A_0, A_1$ and Bob one of $B_0, B_1$. Define

$$
S = \langle A_0 B_0\rangle + \langle A_0 B_1\rangle + \langle A_1 B_0\rangle - \langle A_1 B_1\rangle.
$$

In a local hidden-variable model every outcome is predetermined, so each run has $A_0(B_0 + B_1) + A_1(B_0 - B_1)$ with one bracket equal to $\pm 2$ and the other 0, giving $\lvert S\rvert \le 2$. Brute-forcing all 16 assignments of $\pm 1$ confirms the maximum is 2.

Quantum mechanics exceeds it. Take $\Phi^+$ and observables in the $x$-$z$ plane, $A(\alpha) = \cos\alpha\, Z + \sin\alpha\, X$. Then

$$
\langle A(\alpha)\otimes A(\beta)\rangle_{\Phi^+} = \cos(\alpha - \beta),
$$

because $\langle ZZ\rangle = \langle XX\rangle = 1$ and $\langle ZX\rangle = 0$ on $\Phi^+$. The optimal settings are

$$
\alpha_0 = 0,\quad \alpha_1 = \tfrac{\pi}{2},\quad \beta_0 = \tfrac{\pi}{4},\quad \beta_1 = -\tfrac{\pi}{4}.
$$

> [!example] Worked example
> The four correlators are $\cos(-\tfrac\pi4) = \tfrac{1}{\sqrt2}$, $\cos(\tfrac\pi4) = \tfrac{1}{\sqrt2}$, $\cos(\tfrac\pi4) = \tfrac{1}{\sqrt2}$ and $\cos(\tfrac{3\pi}{4}) = -\tfrac{1}{\sqrt2}$. So
>
> $$
> S = \tfrac{1}{\sqrt2} + \tfrac{1}{\sqrt2} + \tfrac{1}{\sqrt2} - \left(-\tfrac{1}{\sqrt2}\right) = 2\sqrt2 \approx 2.828.
> $$
>
> Qiskit's `expectation_value` on the Bell statevector returns 0.7071, 0.7071, 0.7071, -0.7071 and $S = 2.8284$. On a real device you run four circuits, one per pair of settings, rotating each qubit with an $R_Y$ before the $Z$ readout, and you will see something below 2.83 because of noise. Any value above 2 beyond statistical error rules out the local model.

The bound $2\sqrt2$ is Tsirelson's bound. A short argument: for observables squaring to the identity, $S^2 = 4I - [A_0, A_1]\otimes[B_0, B_1]$, and each commutator has operator norm at most 2, so $S^2 \le 4 + 4 = 8$. No quantum state or measurement can beat $2\sqrt2$, yet no-signalling alone would allow up to 4 (the Popescu-Rohrlich box), so quantum theory sits strictly between the two. CHSH violations were what the 2022 Nobel Prize in Physics (Aspect, Clauser, Zeilinger) recognised.

```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, SparsePauliOp

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
bell = Statevector(qc)

def obs(t):                           # cos(t) Z + sin(t) X
    return SparsePauliOp(["Z", "X"], [np.cos(t), np.sin(t)])

a, b = [0, np.pi / 2], [np.pi / 4, -np.pi / 4]
E = lambda i, j: bell.expectation_value(obs(a[i]).tensor(obs(b[j]))).real
print(E(0, 0) + E(0, 1) + E(1, 0) - E(1, 1))   # 2.828...
```

## Related

- [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]] for why entangled qubits have no sphere of their own.
- [[notes/quantum/quantum-gates|Quantum Gates]] for H and CX, the entangling pair.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] for correlators and basis changes.
- [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for the reduced state of half a Bell pair.
- [[notes/quantum/teleportation-and-superdense-coding|Teleportation and Superdense Coding]] for what a Bell pair buys you.
- [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]] for the GHZ circuits that hardware has to route.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]] for entanglement spread across many qubits on purpose.
