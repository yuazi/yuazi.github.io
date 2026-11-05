---
title: "Deutsch-Jozsa and Bernstein-Vazirani"
tags:
  - quantum-computing
  - algorithms
date: 2026-11-05
---

Deutsch-Jozsa and Bernstein-Vazirani are the two smallest algorithms that show a quantum computer extracting global information about a function with fewer queries than any classical method. Neither is useful as software. I keep them in the notes because they contain every ingredient that Grover, phase estimation and Shor reuse later: an oracle, phase kickback, and a Hadamard transform that turns phases into bit strings.

## Mental Model

- An oracle $U_f$ is a black box that computes a Boolean function $f$ reversibly. The algorithms are judged by how often they call it, not by their gate count.
- With the ancilla in $\lvert - \rangle$, the oracle does not change the ancilla and instead multiplies each input $\lvert x \rangle$ by the phase $(-1)^{f(x)}$ (phase kickback).
- $H^{\otimes n}$ maps between the computational basis and the "parity" basis. Phases of the form $(-1)^{s \cdot x}$ become the bit string $s$.
- One query lets all $2^n$ inputs contribute at once, and the final Hadamards make the contributions interfere so that one global property survives.
- The speedups are relative to an oracle. They say nothing about how hard it is to build the oracle in the first place.

## 1. Oracles and Phase Kickback

The standard oracle acts on $n$ input qubits and one target qubit:

$$U_f \lvert x \rangle \lvert y \rangle = \lvert x \rangle \lvert y \oplus f(x) \rangle.$$

Put the target in $\lvert - \rangle = (\lvert 0 \rangle - \lvert 1 \rangle)/\sqrt{2}$. Then $y \oplus f(x)$ either leaves the target alone ($f(x)=0$) or swaps its two components, which gives a factor $-1$ ($f(x)=1$). So

$$U_f \lvert x \rangle \lvert - \rangle = (-1)^{f(x)} \lvert x \rangle \lvert - \rangle.$$

The target is untouched and the information about $f(x)$ has moved into the phase of the input register. From here on I drop the ancilla and treat the oracle as the diagonal operator $\lvert x \rangle \mapsto (-1)^{f(x)} \lvert x \rangle$.

The Hadamard transform is needed in both algorithms:

$$H^{\otimes n} \lvert x \rangle = \frac{1}{\sqrt{2^n}} \sum_{z \in \{0,1\}^n} (-1)^{x \cdot z} \lvert z \rangle,$$

where $x \cdot z = \sum_i x_i z_i \bmod 2$.

## 2. Deutsch-Jozsa

The promise: $f:\{0,1\}^n \to \{0,1\}$ is either constant or balanced (exactly half of the inputs map to 1). Decide which.

The circuit is $H^{\otimes n}$, then the oracle, then $H^{\otimes n}$ again, then measure the input register. After the first layer and the oracle the state is

$$\frac{1}{\sqrt{2^n}} \sum_x (-1)^{f(x)} \lvert x \rangle,$$

and after the second layer the amplitude of $\lvert 0^n \rangle$ is

$$\frac{1}{2^n} \sum_x (-1)^{f(x)}.$$

For a constant $f$ this is $\pm 1$, so the measurement returns all zeros with certainty. For a balanced $f$ the sum cancels exactly to 0, so all zeros never appears. Any other outcome means balanced.

Query counts for $n$ input bits:

| Method                                            | Queries                                           |
| :------------------------------------------------ | :------------------------------------------------ |
| Classical deterministic, worst case               | $2^{n-1} + 1$                                     |
| Classical randomized, error at most $\varepsilon$ | about $\log_2(1/\varepsilon)$, independent of $n$ |
| Quantum (exact)                                   | 1                                                 |

The honest reading of this table is that the exponential gap is against deterministic classical algorithms only. A randomized classical algorithm that samples $k$ random inputs and says "constant" if all outputs agree is wrong with probability about $2^{1-k}$. So Deutsch-Jozsa is an exact-versus-deterministic separation, not a proof that quantum computers beat randomized classical ones.

> [!example] Worked example: n = 2
> Take the balanced function $f(x_1 x_0) = x_1 \oplus x_0$. After $H^{\otimes 2}$ the state is $\tfrac12(\lvert 00 \rangle + \lvert 01 \rangle + \lvert 10 \rangle + \lvert 11 \rangle)$. The oracle gives the signs $(+,-,-,+)$, which is $\lvert - \rangle \lvert - \rangle$. The final Hadamards map $\lvert - \rangle \lvert - \rangle$ to $\lvert 11 \rangle$, a non-zero result, so $f$ is balanced. The same computation with $f \equiv 1$ gives $-\lvert 00 \rangle$ up to a global phase.

## 3. Bernstein-Vazirani

The promise: $f(x) = s \cdot x \bmod 2$ for a hidden string $s \in \{0,1\}^n$. Find $s$.

The circuit is identical to Deutsch-Jozsa. After the first Hadamard layer and the oracle the register holds

$$\frac{1}{\sqrt{2^n}} \sum_x (-1)^{s \cdot x} \lvert x \rangle = H^{\otimes n} \lvert s \rangle,$$

by the Hadamard formula above. The second Hadamard layer undoes the first, because $H^{\otimes n}$ is its own inverse, so the register is exactly $\lvert s \rangle$ and one measurement reveals every bit.

Classically you need $n$ queries: ask for $f(e_i)$ on each unit vector $e_i$ to read off $s_i$. Even randomization does not help, since each query returns one bit and $s$ has $n$ unknown bits. That is an honest linear-versus-one separation, and a bounded-error one. Bernstein and Vazirani's paper also has a recursive version of the problem that gives a super-polynomial gap, which is the more interesting result, though it is not what the single-level algorithm shows.

## 4. A Qiskit Circuit for BV

The oracle for $s = 1011$ is a CNOT from input qubit $i$ to the target for each $s_i = 1$. Qiskit orders bits right to left, so qubit $i$ corresponds to the character `s[n-1-i]`.

```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

s = "1011"; n = len(s)
qc = QuantumCircuit(n + 1)
qc.x(n); qc.h(range(n + 1))              # target in |->, inputs in |+>^n
for i, bit in enumerate(reversed(s)):
    if bit == "1":
        qc.cx(i, n)                      # phase kickback of s_i * x_i
qc.h(range(n))

probs = Statevector(qc).probabilities_dict(qargs=list(range(n)))
print({k: round(float(v), 6) for k, v in probs.items() if v > 1e-9})
```

Running this prints `{'1011': 1.0}` on the statevector simulator. The oracle has three CNOTs, one per 1 in $s$, and the whole algorithm calls it once.

> [!warning] Common mistake
> Reading the output string in the wrong order. Qiskit prints qubit $n-1$ on the left, so if you build the oracle with `cx(i, n)` for `s[i]` instead of `s[n-1-i]`, you get $s$ reversed, and a palindromic test string like `101` hides the bug.

## 5. What These Algorithms Teach

Both problems are contrived, but the pattern is general. Build a superposition over all inputs, imprint information as phases, and use a Fourier-type transform so that the answer sits in a single basis state. Simon's problem replaces the linear function by a two-to-one function with a hidden XOR period, and Shor's algorithm replaces the Hadamard transform by the QFT to find a hidden period over the integers. The query advantage always lives inside the oracle model. Whether it survives into a real task depends on whether the oracle can be built cheaply, which is exactly the hard part for Shor.

## Related

- [[notes/quantum/quantum-gates|Quantum Gates]]: Hadamard, CNOT and why $H^{\otimes n}$ is its own inverse.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]]: why certain outcomes follow from amplitudes of modulus 1.
- [[notes/quantum/grovers-search|Grover's Search]]: reuses the phase oracle in the unstructured setting.
- [[notes/quantum/qft-and-phase-estimation|Quantum Fourier Transform and Phase Estimation]]: the same idea with a finer-grained transform.
- [[notes/quantum/shors-algorithm|Shor's Algorithm]]: hidden period instead of hidden string.
- [[notes/lectures/qiskit/00-qiskit-patterns-and-primitives|QGSS Lab 0]]: the Sampler and statevector workflow used above.
