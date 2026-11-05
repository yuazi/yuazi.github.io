---
title: "Variational Algorithms (VQE and QAOA)"
tags:
  - quantum-computing
  - algorithms
date: 2026-11-05
---

Variational algorithms split the work between a quantum processor and a classical optimizer. The quantum side prepares a parameterized state and measures an expectation value, and the classical side adjusts the parameters to lower it. The Variational Quantum Eigensolver (VQE) targets ground-state energies, and the Quantum Approximate Optimization Algorithm (QAOA) targets combinatorial problems like MaxCut. They were designed for noisy, shallow hardware, and they come with real obstacles: measurement cost, noise and flat optimization landscapes.

![[pictures/topics/quantum/variational-algorithms.png]]

<p class="image-caption">A quantum circuit with knobs, and a normal computer turning the knobs until the energy is lowest. Rendered for this page.</p>

## Mental Model

- The variational principle guarantees that any trial state gives an energy at or above the true ground energy, so lower is always better and the result is a rigorous upper bound.
- The loop is: prepare $\lvert \psi(\theta) \rangle$, estimate $\langle H \rangle$ from many shots, update $\theta$ on a classical computer, repeat.
- The ansatz decides everything: expressive enough to contain a good state, shallow enough to run, and structured enough to train.
- QAOA is a specific ansatz, alternating a cost layer and a mixer layer, with $2p$ parameters for $p$ layers.
- Training is a statistical problem with noisy cost evaluations. Barren plateaus and shot noise are where it usually fails.

## 1. The Variational Principle

For a Hamiltonian $H$ with ground energy $E_0$, any normalized state satisfies

$$E(\theta) = \langle \psi(\theta) \rvert H \lvert \psi(\theta) \rangle \geq E_0.$$

Write $\lvert \psi \rangle$ in the eigenbasis of $H$ and the inequality is immediate, since all other eigenvalues are at least $E_0$. So VQE minimizes $E(\theta)$ and the minimum is an upper bound on $E_0$. This is also why variational results are easy to rank, a point the Quantum Advantage lab makes about scoring answers that cannot be checked directly.

Here is a minimal VQE for the two-qubit Hamiltonian $H = ZZ + 0.5\,XI + 0.5\,IX$ with a small hardware-efficient ansatz. The exact ground energy is $-\sqrt{2} \approx -1.41421$.

```python
import numpy as np
from scipy.optimize import minimize
from qiskit import QuantumCircuit
from qiskit.circuit import ParameterVector
from qiskit.quantum_info import SparsePauliOp, Statevector

H = SparsePauliOp.from_list([("ZZ", 1.0), ("XI", 0.5), ("IX", 0.5)])
t = ParameterVector("t", 4)
ansatz = QuantumCircuit(2)
ansatz.ry(t[0], 0); ansatz.ry(t[1], 1); ansatz.cx(0, 1)
ansatz.ry(t[2], 0); ansatz.ry(t[3], 1)

def energy(x):
    return Statevector(ansatz.assign_parameters(x)).expectation_value(H).real

rng = np.random.default_rng(0)
res = minimize(energy, rng.uniform(0, 2 * np.pi, 4), method="COBYLA")
print(res.fun, np.linalg.eigvalsh(H.to_matrix())[0])
```

Running this (with a few random starts, taking the best) gives $-1.41421356$ against the exact $-1.41421356$. The statevector simulator returns exact expectations. On hardware each evaluation of `energy` would be an Estimator call with finite shots.

## 2. Ansatz Choices

The hardware-efficient ansatz stacks layers of single-qubit rotations and the entangling gates the device does natively. It is shallow and problem-agnostic, but it ignores the symmetries of the problem (particle number, spin) and is the family most exposed to barren plateaus.

Chemistry-inspired ansatze build the state from physics. UCC (unitary coupled cluster) uses $e^{T - T^\dagger}$ with single and double excitations $T$. It is accurate and respects symmetries, but the circuit is deep for hardware. The LUCJ (local unitary cluster Jastrow) idea compresses this: layers of orbital rotations and Jastrow phase terms, restricted to pairs of orbitals that the hardware can couple directly, with parameters initialized from classical coupled-cluster amplitudes. The QGSS 4c lab uses a one-layer LUCJ circuit on N$_2$ (see [[notes/lectures/qiskit/04c-sample-based-quantum-diagonalization|Lab 4c]]). It then uses the hardware only to sample bitstrings and hands the energy computation to a classical diagonalization, which sidesteps the optimizer loop.

## 3. The Classical Loop and Measurement Cost

A molecular or spin Hamiltonian is a sum of Pauli strings, $H = \sum_i c_i P_i$. The energy needs every $\langle P_i \rangle$, and each is estimated from shots with standard error $\sim 1/\sqrt{\text{shots}}$. Hitting precision $\varepsilon$ costs $O(1/\varepsilon^2)$ shots per term, and the number of Pauli terms in a molecular Hamiltonian grows like $N^4$ in the number of orbitals.

Two things reduce the bill. Grouping puts qubit-wise commuting Pauli strings into one measurement setting, so a single basis rotation measures several terms. Shot allocation gives more shots to terms with large coefficients and variance. The optimizer must also cope with noise: gradient-free methods such as SPSA tolerate it fairly well, and gradient methods use the parameter-shift rule, $\partial_\theta E = \tfrac12\big(E(\theta + \tfrac{\pi}{2}) - E(\theta - \tfrac{\pi}{2})\big)$ for gates of the form $e^{-i\theta P/2}$, which needs two circuit runs per parameter.

## 4. Barren Plateaus

McClean and coauthors (2018) showed that for sufficiently random, deep parameterized circuits, the variance of the cost gradient shrinks exponentially with the number of qubits. The landscape is then flat nearly everywhere, and resolving a gradient needs exponentially many shots. Related findings: global cost functions on shallow circuits can have the same problem, while local cost functions with shallow circuits avoid it (Cerezo et al., 2021), and hardware noise can itself flatten the landscape. Practical countermeasures are problem-inspired ansatze, warm starts from classical solutions, and layer-wise training. None of them removes the issue in general.

## 5. QAOA

QAOA encodes the problem in a cost Hamiltonian $C$ (for MaxCut, the number of cut edges) and prepares

$$\lvert \gamma, \beta \rangle = \prod_{l=1}^{p} e^{-i\beta_l B}\, e^{-i\gamma_l C} \lvert + \rangle^{\otimes n}, \qquad B = \sum_i X_i.$$

The cost layer $e^{-i\gamma C}$ puts a phase on each bitstring proportional to its cut value, and the mixer $e^{-i\beta B}$ moves amplitude between bitstrings. As $p \to \infty$ it can approximate adiabatic evolution; $p=1$ is the shallowest nontrivial circuit.

> [!example] Worked example: p = 1 MaxCut on a 4-cycle
> The graph has 4 nodes in a ring, edges (0,1), (1,2), (2,3), (3,0), and the maximum cut is 4 (alternate the colors). A random bitstring cuts 2 edges on average. For this graph, $p=1$ gives the closed form $\langle C \rangle(\gamma, \beta) = 2 + \sin 4\beta \,\sin 2\gamma$, which I confirmed numerically against a state-vector simulation on a grid (maximum deviation about $10^{-15}$). The maximum is 3, at $\gamma = \pi/4$, $\beta = \pi/8$, an approximation ratio of $3/4$. The minimum is 1, and $\gamma = 0$ returns 2 for any $\beta$.

```python
import numpy as np
n, edges = 4, [(0, 1), (1, 2), (2, 3), (3, 0)]
bits = (np.arange(2**n)[:, None] >> np.arange(n)) & 1
cut = sum(bits[:, i] != bits[:, j] for i, j in edges)     # cut value of each bitstring

def rx(b):                                                # exp(-i b X)
    return np.array([[np.cos(b), -1j*np.sin(b)], [-1j*np.sin(b), np.cos(b)]])

def expect(g, b):
    mixer = np.eye(1)
    for _ in range(n):
        mixer = np.kron(mixer, rx(b))
    psi = mixer @ (np.exp(-1j*g*cut) / np.sqrt(2**n))     # cost layer on |+>^n, then mixer
    return float(np.sum(abs(psi)**2 * cut))

print(expect(np.pi/4, np.pi/8), expect(np.pi/4, 3*np.pi/8))   # 3.0 and 1.0
print(expect(0.7, 0.2), 2 + np.sin(0.8) * np.sin(1.4))        # both 2.7069
```

The landscape is a regular grid of peaks and valleys in $(\gamma, \beta)$ over $[0, \pi]^2$. The peaks of $\sin 4\beta\sin 2\gamma$ include $(\pi/4, \pi/8)$ and $(3\pi/4, 3\pi/8)$ (both give 3), and the valleys of value 1 include $(\pi/4, 3\pi/8)$. Going beyond 3/4 on this graph requires $p > 1$. Larger $p$ improves the best reachable value but adds parameters and noise.

The QGSS 4b lab runs QAOA on the number-partition problem on real hardware (see [[notes/lectures/qiskit/04b-qaoa-partition-problem|Lab 4b]]), starting from pretrained angles to save QPU time, which sidesteps the optimization cost and is a practical answer to the landscape problem.

## 6. What To Expect

VQE and QAOA are heuristics. They have no proven advantage over the best classical methods, and a large part of their appeal is that they fit noisy devices. Benchmarks against classical solvers (DMRG, tensor networks, Gurobi) are the honest test, which is the theme of [[notes/lectures/qiskit/04a-quantum-advantage|the quantum advantage lab]]. Quantum phase estimation offers a cleaner route to ground-state energies but needs fault tolerance.

## Related

- [[notes/quantum/qft-and-phase-estimation|Quantum Fourier Transform and Phase Estimation]]: the fault-tolerant alternative to VQE.
- [[notes/quantum/quantum-machine-learning|Quantum Machine Learning]]: variational classifiers share the ansatz-and-optimizer loop and the trainability problems.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]]: why noise limits circuit depth for these algorithms.
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]: the classical half of the loop.
- [[notes/lectures/qiskit/04b-qaoa-partition-problem|QGSS Lab 4b]]: QAOA for the partition problem on hardware.
- [[notes/lectures/qiskit/04c-sample-based-quantum-diagonalization|QGSS Lab 4c]]: LUCJ plus sample-based diagonalization.
