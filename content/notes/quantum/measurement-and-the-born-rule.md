---
title: "Measurement and the Born Rule"
tags:
  - quantum-computing
  - fundamentals
date: 2026-11-05
---

A quantum computer computes with amplitudes and reads out probabilities. The Born rule is the bridge: it says how a state vector turns into the bitstrings you get from a device, and what the state looks like afterwards. Almost every practical question in a quantum workflow (how many shots, which basis, how noisy is this estimate) goes back to this page.

## Mental Model

- The probability of an outcome is the squared magnitude of its amplitude. Phases do not appear in a single measurement, only in what interferes before it.
- Measurement is destructive: the state jumps to the part consistent with the outcome, renormalized.
- Measuring "in another basis" means applying a gate that rotates that basis to the computational one, then measuring as usual.
- You never see an amplitude or an expectation value directly. You estimate them from repeated shots, with error that shrinks as $1/\sqrt{N}$.
- Measuring one qubit of an entangled register changes your description of the others, but not their statistics (see [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]]).

## 1. The Born Rule

For a state $\lvert\psi\rangle$ and an orthonormal basis $\{\lvert i\rangle\}$, the outcome $i$ occurs with probability

$$
P(i) = \lvert \langle i \vert \psi \rangle \rvert^2.
$$

For $\lvert\psi\rangle = \alpha\lvert 0\rangle + \beta\lvert 1\rangle$ this gives $P(0) = \lvert\alpha\rvert^2$ and $P(1) = \lvert\beta\rvert^2$. In Bloch terms, $P(0) = \cos^2(\theta/2) = (1+z)/2$ (see [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]]).

The more general form uses projectors. A projective measurement is a set of orthogonal projectors $\{\Pi_k\}$ with $\sum_k \Pi_k = I$. Outcome $k$ has probability $p_k = \langle\psi\rvert \Pi_k \lvert\psi\rangle$, and the state afterwards is

$$
\lvert\psi_k\rangle = \frac{\Pi_k \lvert\psi\rangle}{\sqrt{p_k}}.
$$

Measure again immediately in the same basis and you get the same outcome with probability 1. That repeatability is what separates a projective measurement from just sampling a probability distribution.

## 2. Measuring in Other Bases

Hardware measures in the $Z$ basis only. To measure in the eigenbasis of another Pauli, rotate first.

| Measure | Apply before the $Z$ readout | Why                                                                            |
| ------- | ---------------------------- | ------------------------------------------------------------------------------ |
| $X$     | $H$                          | $H$ maps $\lvert\pm\rangle$ to $\lvert 0\rangle, \lvert 1\rangle$              |
| $Y$     | $S^\dagger$, then $H$        | $S^\dagger$ maps $\lvert\pm i\rangle$ to $\lvert\pm\rangle$, then $H$ finishes |
| $Z$     | nothing                      | native                                                                         |

For a general direction $\hat n$ on the sphere, apply the rotation that takes $\hat n$ to $\hat z$. The same trick covers the optimal CHSH angles (see [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]]), and the gates are catalogued on [[notes/quantum/quantum-gates|Quantum Gates]].

> [!warning] Common mistake
> Measurements in different bases do not commute. Measuring $Z$ and then $X$ on the same qubit gives a random $X$ result no matter what the original state was, because the $Z$ outcome left the qubit on the north or south pole. If you want both $\langle Z\rangle$ and $\langle X\rangle$ of a state, you need two separate circuits, each prepared from scratch.

## 3. Expectation Values of Pauli Observables

An observable $O$ with eigenvalues $\lambda_k$ and projectors $\Pi_k$ has expectation value

$$
\langle O \rangle = \langle\psi\rvert O \lvert\psi\rangle = \sum_k \lambda_k\, p_k.
$$

For a Pauli, the eigenvalues are $\pm 1$, so $\langle Z \rangle = P(0) - P(1)$. For the state $\lvert\psi\rangle = R_Y(\pi/3)\lvert 0\rangle$, which has $\theta = \pi/3$ and $\phi = 0$, the three expectations are

$$
\langle X \rangle = \sin\tfrac{\pi}{3} \approx 0.866, \qquad \langle Y \rangle = 0, \qquad \langle Z \rangle = \cos\tfrac{\pi}{3} = 0.5,
$$

and computing them with Qiskit's `Statevector.expectation_value` returns the same numbers. A multi-qubit Pauli string like $Z \otimes Z$ is measured the same way: take the parity of the two bits, $+1$ for 00 and 11, $-1$ for 01 and 10. Hamiltonians in variational algorithms are sums of such strings, which is why [[notes/quantum/variational-algorithms|Variational Algorithms]] spend most of their shots on many different bases.

## 4. Shots and the Standard Error

Each shot of a $\pm1$ observable is a random variable with mean $\langle O\rangle$ and variance $1 - \langle O\rangle^2$. After $N$ shots the sample mean has standard error

$$
\sigma_N = \sqrt{\frac{1 - \langle O\rangle^2}{N}} \le \frac{1}{\sqrt N}.
$$

For a probability $p$ estimated as a fraction of counts, the standard error is $\sqrt{p(1-p)/N}$, at most $0.5/\sqrt N$ when $p = 0.5$.

> [!example] Worked example
> Take $\langle Z\rangle = 0.5$ from the state above. The single-shot variance is $1 - 0.25 = 0.75$, so:
>
> | Shots $N$ | Standard error of $\langle Z\rangle$ |
> | --------- | ------------------------------------ |
> | 100       | 0.087                                |
> | 1,000     | 0.027                                |
> | 10,000    | 0.0087                               |
>
> Sampling this circuit with a fixed seed gave estimates of 0.52, 0.494 and 0.4926 for those three sizes, each within one standard error of 0.5. To pin $\langle Z\rangle$ down to $\pm 0.01$ you need $N = 0.75/0.01^2 = 7500$ shots. Halving the error always costs four times the shots.
>
> For a 50/50 outcome with 4096 shots, the standard error on $p$ is $\sqrt{0.25/4096} \approx 0.0078$, so an observed 0.51 or 0.49 is ordinary noise and not evidence of a biased device.

The $1/\sqrt N$ scaling is a statistical floor that applies even on perfect hardware. Real devices add readout error and gate noise on top (see [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]]), and error mitigation methods usually pay for their bias reduction with more shots.

```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

q = QuantumCircuit(1)
q.ry(np.pi / 3, 0)
q.h(0)                       # measure X: rotate X basis to Z
q.measure_all()
counts = StatevectorSampler(seed=11).run([q], shots=4096).result()[0].data.meas.get_counts()
print(counts, 2 * counts["0"] / 4096 - 1)   # estimate of <X>, true 0.866
```

Running it returned `{'0': 3838, '1': 258}` and an estimate of 0.874, against a standard error of 0.0078 for $\langle X\rangle = 0.866$.

## 5. Partial Measurement

Measuring one qubit of a register keeps the rest. Write the state as $\lvert\psi\rangle = \lvert 0\rangle_A \lvert u_0\rangle + \lvert 1\rangle_A \lvert u_1\rangle$ with unnormalized $\lvert u_k\rangle$ on the other qubits. Outcome $k$ on $A$ has probability $\lVert u_k\rVert^2$ and leaves the rest in $\lvert u_k\rangle / \lVert u_k\rVert$.

> [!example] Worked example
> Let $\lvert\psi\rangle = \tfrac{1}{\sqrt3}(\lvert 00\rangle + \lvert 01\rangle + \lvert 11\rangle)$, qubit $A$ written first. Group by $A$: $\lvert\psi\rangle = \lvert 0\rangle\tfrac{1}{\sqrt3}(\lvert 0\rangle + \lvert 1\rangle) + \lvert 1\rangle\tfrac{1}{\sqrt3}\lvert 1\rangle$.
>
> Outcome 0 has probability $2/3$ and leaves $B$ in $\lvert +\rangle$. Outcome 1 has probability $1/3$ and leaves $B$ in $\lvert 1\rangle$. So the statistics of $B$ depend on what $A$ read, which is the signature of correlation. The coefficient matrix has determinant $1/3 \ne 0$, so this state is entangled (see the Schmidt test on the entanglement page).

Averaging over the unknown outcome gives the reduced state of $B$ described in [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]]. If nobody tells $B$'s owner the result of $A$, they see $\tfrac23\lvert +\rangle\langle +\rvert + \tfrac13\lvert 1\rangle\langle 1\rvert$, and nothing they do locally reveals whether $A$ was measured at all.

Mid-circuit measurement, with classical bits feeding later gates, is what makes [[notes/quantum/teleportation-and-superdense-coding|teleportation]] work as a dynamic circuit. In the opposite direction, the principle of deferred measurement says any mid-circuit measurement used only as a classical control can be replaced by a controlled gate and a final measurement.

## Related

- [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]] for what the amplitudes are before they are read.
- [[notes/quantum/quantum-gates|Quantum Gates]] for the basis-change gates used above.
- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for correlations that survive measurement in any basis.
- [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for averaging over unknown outcomes.
- [[notes/quantum/variational-algorithms|Variational Algorithms]] for expectation values of Hamiltonians estimated by shots.
- [[notes/lectures/qiskit/00-qiskit-patterns-and-primitives|QGSS: Qiskit Patterns and Primitives]] for the Sampler and Estimator primitives that wrap these ideas.
