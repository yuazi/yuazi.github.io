---
title: "Quantum Fourier Transform and Phase Estimation"
tags:
  - quantum-computing
  - algorithms
date: 2026-11-05
---

The quantum Fourier transform (QFT) is the discrete Fourier transform applied to the amplitudes of a quantum state, and it can be built from $O(n^2)$ gates on $n$ qubits. Quantum phase estimation (QPE) uses it to read out the eigenphase of a unitary as a binary fraction. These two pieces are the engine of Shor's algorithm, quantum counting, and the phase-estimation approach to chemistry, so it is worth being able to derive the circuit from scratch.

## Mental Model

- The QFT does not speed up the classical FFT task, because you cannot read out all $2^n$ amplitudes. It is useful when the answer is a peak that a few measurements can find.
- Phase kickback from controlled-$U^{2^j}$ gates writes the eigenphase into the relative phases of the counting register. The inverse QFT converts those phases into a bit string.
- With $t$ counting qubits the grid of outcomes has spacing $2^{-t}$. A dyadic phase lands exactly on the grid, and anything else leaks into neighbouring outcomes.
- More counting qubits mean more precision and more controlled-$U^{2^j}$ cost, and the cost of the largest power usually dominates.

## 1. Definition

On $N = 2^n$ basis states the QFT is

$$\mathrm{QFT}\,\lvert j \rangle = \frac{1}{\sqrt{N}} \sum_{k=0}^{N-1} e^{2\pi i jk/N} \lvert k \rangle.$$

As a matrix this is $F_{jk} = \omega^{jk}/\sqrt{N}$ with $\omega = e^{2\pi i/N}$, the unitary DFT matrix. It is the same transform as `numpy.fft.ifft` up to the factor $\sqrt{N}$ (numpy uses the positive exponent for the inverse). A state with period 4 on 16 amplitudes maps to peaks at multiples of $16/4 = 4$; I checked this with numpy and the output is 0.25 at positions 0, 4, 8, 12 and zero elsewhere.

## 2. The Circuit

Write $j = j_1 j_2 \dots j_n$ in binary, with $j_1$ the most significant bit. The output factorizes into a product state:

$$\mathrm{QFT}\,\lvert j \rangle = \frac{1}{\sqrt{2^n}} \bigotimes_{l=1}^{n} \big(\lvert 0 \rangle + e^{2\pi i\, 0.j_{n-l+1}\dots j_n} \lvert 1 \rangle\big),$$

where $0.j_a j_{a+1} \dots j_n$ is a binary fraction. Each factor is produced by a Hadamard followed by controlled phase rotations $R_m = \mathrm{diag}(1, e^{2\pi i/2^m})$ from the lower-order bits. The recipe for each qubit, going from the most significant down:

1. Apply $H$ to the qubit. This gives phase $e^{2\pi i\, j_k/2}$ from its own bit.
2. For every less significant qubit $q$, apply a controlled-$R_m$ with $m = $ distance + 1, which adds the fractional bits one by one.
3. After all qubits are done, reverse the qubit order with swaps.

The gate count for $n$ qubits is $n$ Hadamards, $n(n-1)/2$ controlled phases and $\lfloor n/2 \rfloor$ swaps, so $O(n^2)$ in total. For comparison, the classical FFT on $2^n$ points takes $O(n 2^n)$ operations. Rotations by tiny angles can be dropped with little error, which gives an approximate QFT with $O(n \log n)$ gates, and hardware implementations usually do this.

```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Operator

def qft(n):
    qc = QuantumCircuit(n)
    for j in reversed(range(n)):
        qc.h(j)
        for k in range(j):
            qc.cp(np.pi / 2 ** (j - k), k, j)
    for i in range(n // 2):
        qc.swap(i, n - 1 - i)
    return qc

n = 3; N = 2 ** n; w = np.exp(2j * np.pi / N)
F = np.array([[w ** (j * k) for k in range(N)] for j in range(N)]) / np.sqrt(N)
print(np.allclose(Operator(qft(n)).data, F), dict(qft(n).count_ops()))
```

This prints `True {'h': 3, 'cp': 3, 'swap': 1}`: the circuit equals the DFT matrix exactly (in Qiskit's little-endian convention) and has the predicted gate counts.

## 3. Phase Estimation

Given a unitary $U$ with $U \lvert u \rangle = e^{2\pi i \varphi} \lvert u \rangle$, find $\varphi \in [0,1)$. You need the ability to apply controlled-$U^{2^j}$ and a copy of the eigenstate $\lvert u \rangle$ (or something with overlap on it).

The circuit has $t$ counting qubits and a target register holding $\lvert u \rangle$:

1. Hadamard on every counting qubit.
2. For $j = 0, \dots, t-1$, apply controlled-$U^{2^j}$ with counting qubit $j$ as control.
3. Apply the inverse QFT to the counting register and measure it.

After step 2, phase kickback leaves the counting register in

$$\frac{1}{\sqrt{2^t}} \sum_{k=0}^{2^t - 1} e^{2\pi i \varphi k} \lvert k \rangle.$$

If $\varphi = y/2^t$ for an integer $y$, this is exactly $\mathrm{QFT}\,\lvert y \rangle$, so the inverse QFT returns $\lvert y \rangle$ and you read $\varphi$ with no error. In general the probability of outcome $y$ is

$$P(y) = \left\lvert \frac{1}{2^t} \sum_{k=0}^{2^t-1} e^{2\pi i k(\varphi - y/2^t)} \right\rvert^2 = \frac{\sin^2(\pi 2^t \delta)}{2^{2t} \sin^2(\pi \delta)}, \quad \delta = \varphi - \frac{y}{2^t}.$$

The nearest grid point always has probability at least $4/\pi^2 \approx 0.405$. To get $\varphi$ accurate to $n$ bits with success probability at least $1 - \varepsilon$, Nielsen and Chuang give $t = n + \lceil \log_2(2 + 1/(2\varepsilon)) \rceil$ counting qubits.

## 4. Worked Example: The T Gate

$T = \mathrm{diag}(1, e^{i\pi/4})$ has eigenstate $\lvert 1 \rangle$ with eigenvalue $e^{i\pi/4} = e^{2\pi i/8}$, so $\varphi = 1/8 = 0.001_2$. With $t=3$ counting qubits, $\varphi$ is on the grid ($y=1$). Controlled-$T^{2^j}$ is just a controlled phase gate with angle $2\pi \cdot 2^j / 8$.

```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit.library import QFTGate
from qiskit.quantum_info import Statevector

def qpe(phi, t):
    qc = QuantumCircuit(t + 1)
    qc.x(t)                                       # eigenstate |1> of the phase gate
    qc.h(range(t))
    for j in range(t):
        qc.cp(2 * np.pi * phi * 2 ** j, j, t)     # controlled-U^(2^j)
    qc.append(QFTGate(t).inverse(), range(t))
    probs = Statevector(qc).probabilities_dict(qargs=list(range(t)))
    return sorted(probs.items(), key=lambda kv: -kv[1])[:3]

print(qpe(1 / 8, 3))
print(qpe(1 / 3, 3))
```

For $\varphi = 1/8$ the output is the string `001` with probability 1.0, i.e. $y=1$ and $\varphi = 1/8$ exactly.

## 5. A Non-Dyadic Phase

Take $\varphi = 1/3 = 0.0101\ldots_2$, which no finite binary fraction represents. With $t=3$ the grid is multiples of $1/8$, and the true value $1/3 = 2.67/8$ sits between $y=2$ and $y=3$. Running the code above gives

| Outcome $y$ | Estimate $y/8$ | Probability |
| :---------: | :------------: | :---------: |
|      3      |     0.375      |   0.6878    |
|      2      |     0.250      |   0.1749    |
|      4      |     0.500      |   0.0469    |
|      1      |     0.125      |   0.0316    |

The remaining probability (about 0.06) is spread over the other four outcomes. The best outcome has probability 0.69, above the $4/\pi^2$ floor, because $1/3$ is fairly close to a grid point. Increasing $t$ shrinks the grid spacing but not the leakage: for $t=5$ the best outcome $y=11$ (11/32 = 0.344) has probability 0.6842, and for $t=8$ the best outcome $y=85$ (85/256 = 0.332) has probability 0.6839. So extra qubits improve the resolution of the answer while the probability of landing at the single closest outcome stays near 0.68 for this $\varphi$. To concentrate the probability on a window around the true value, you add a few extra counting qubits beyond the precision you want, and the formula in section 3 says how many.

## 6. Cost and Caveats

The controlled-$U^{2^j}$ gates are the expensive part. If $U$ is a Trotterized time evolution, $U^{2^j}$ costs $2^j$ times as much as $U$, so the last counting qubit pays the price of the whole run. Total query cost scales as $2^t \sim 1/\epsilon$ in the target precision $\epsilon$, the Heisenberg limit, compared with $1/\epsilon^2$ samples when you estimate an expectation value by repeated measurement. That is the advantage of QPE over variational methods, and it comes with fault-tolerant depth. For modular exponentiation in Shor's algorithm the powers $a^{2^j} \bmod N$ can be computed classically, so the cost does not grow with $2^j$ there.

## Related

- [[notes/quantum/quantum-gates|Quantum Gates]]: controlled phase gates, Hadamard and the T gate.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]]: how the distribution $P(y)$ turns into samples.
- [[notes/quantum/shors-algorithm|Shor's Algorithm]]: QPE applied to modular multiplication.
- [[notes/quantum/grovers-search|Grover's Search]]: quantum counting runs QPE on the Grover iterate.
- [[notes/quantum/variational-algorithms|Variational Algorithms (VQE and QAOA)]]: the near-term alternative to QPE for ground-state energies.
- [[notes/lectures/qiskit/04c-sample-based-quantum-diagonalization|QGSS Lab 4c]]: a hybrid route to ground-state energies that avoids deep QPE circuits.
