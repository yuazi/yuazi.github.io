---
title: (y) Quantum Computing
tags:
  - quantum-computing
  - notes
date: 2026-11-05
---

Reference notes on quantum computing, from a single qubit up to the algorithms people hope will beat classical computers. They go together with my [[notes/lectures/qiskit/index|QGSS 2026 lab notes]], which are the hands-on Qiskit side.

---

## Foundations

- [[notes/quantum/qubits-and-the-bloch-sphere|(y-) Qubits and the Bloch Sphere]]: amplitudes, phases, the Bloch sphere and how $n$ qubits become $2^n$ numbers.
- [[notes/quantum/quantum-gates|(y-) Quantum Gates]]: Paulis, Hadamard, rotations, controlled gates and what a universal gate set needs.
- [[notes/quantum/measurement-and-the-born-rule|(y-) Measurement and the Born Rule]]: probabilities, measuring in other bases, expectation values and shot noise.
- [[notes/quantum/entanglement-and-bell-states|(y-) Entanglement and Bell States]]: product versus entangled states, the four Bell states, GHZ and the CHSH game.
- [[notes/quantum/density-matrices-and-noise|(y-) Density Matrices and Noise Channels]]: mixed states, partial traces, Kraus operators, $T_1$ and $T_2$.
- [[notes/quantum/teleportation-and-superdense-coding|(y-) Teleportation and Superdense Coding]]: moving a qubit with an ebit and two classical bits, and the reverse trick.
- [[notes/quantum/quantum-hardware|(y-) Qubit Hardware Platforms]]: superconducting circuits, trapped ions, neutral atoms, photons and spins compared.

## Algorithms

- [[notes/quantum/deutsch-jozsa-and-bernstein-vazirani|(y-) Deutsch-Jozsa and Bernstein-Vazirani]]: oracles, phase kickback and the first query-complexity separations.
- [[notes/quantum/grovers-search|(y-) Grover's Search]]: amplitude amplification as a rotation and the quadratic speedup for unstructured search.
- [[notes/quantum/qft-and-phase-estimation|(y-) Quantum Fourier Transform and Phase Estimation]]: the QFT circuit and how phase estimation reads out eigenvalues.
- [[notes/quantum/shors-algorithm|(y-) Shor's Algorithm]]: factoring via order finding, worked through for 15.
- [[notes/quantum/variational-algorithms|(y-) Variational Algorithms (VQE and QAOA)]]: parametrized circuits with a classical optimizer in the loop.
- [[notes/quantum/quantum-error-correction|(y-) Quantum Error Correction]]: repetition codes, stabilizers, the surface code and the overhead of logical qubits.
- [[notes/quantum/quantum-machine-learning|(y-) Quantum Machine Learning]]: feature maps, quantum kernels, variational classifiers and where advantage is unlikely.

---

[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
