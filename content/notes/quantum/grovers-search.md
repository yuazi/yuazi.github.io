---
title: "Grover's Search"
tags:
  - quantum-computing
  - algorithms
date: 2026-11-05
---

Grover's algorithm finds a marked item among $N$ unstructured candidates using about $\sqrt{N}$ oracle queries, where any classical method needs on the order of $N$. It is the standard example of a quadratic speedup, and the same mechanism, amplitude amplification, shows up inside quantum counting, minimum finding and many proposals for speeding up search-like subroutines. The most useful thing to understand about it is geometric: the whole algorithm is a rotation in a two-dimensional plane.

## Mental Model

- Two reflections make a rotation. The oracle reflects about the "unmarked" axis, the diffuser reflects about the uniform state, and together they rotate by $2\theta$ per iteration.
- The state never leaves a 2D plane spanned by the marked superposition and the unmarked superposition, so the success probability is $\sin^2((2k+1)\theta)$ after $k$ iterations.
- You can overshoot. More iterations are not better, and the probability oscillates.
- The speedup is quadratic, and that is provably the best possible for unstructured search in the query model.
- Each iteration calls the oracle once, so the cost of running the oracle as a circuit decides whether the speedup is worth anything in practice.

## 1. The Setup

Let $N = 2^n$ and let $M$ of the $N$ items be marked ($f(x)=1$). Define two normalized states:

$$\lvert \omega \rangle = \frac{1}{\sqrt{M}} \sum_{x:\,f(x)=1} \lvert x \rangle, \qquad \lvert \alpha \rangle = \frac{1}{\sqrt{N-M}} \sum_{x:\,f(x)=0} \lvert x \rangle.$$

They are orthogonal. The uniform superposition $\lvert s \rangle = H^{\otimes n} \lvert 0^n \rangle$ lies in their span:

$$\lvert s \rangle = \sin\theta \, \lvert \omega \rangle + \cos\theta \, \lvert \alpha \rangle, \qquad \sin\theta = \sqrt{M/N}.$$

So $\theta$ is the angle between $\lvert s \rangle$ and the unmarked axis $\lvert \alpha \rangle$. For $M=1$ and large $N$, $\theta \approx 1/\sqrt{N}$, which is tiny: the start state is almost orthogonal to the answer.

## 2. Oracle and Diffuser

The oracle is the phase oracle from the [[notes/quantum/deutsch-jozsa-and-bernstein-vazirani|Deutsch-Jozsa page]]: $O\lvert x \rangle = (-1)^{f(x)} \lvert x \rangle$. In the plane it flips the sign of the $\lvert \omega \rangle$ component, which is a reflection about the $\lvert \alpha \rangle$ axis.

The diffuser is

$$D = 2\lvert s \rangle\langle s \rvert - I = H^{\otimes n}\,(2\lvert 0^n \rangle\langle 0^n \rvert - I)\,H^{\otimes n},$$

a reflection about $\lvert s \rangle$. In a circuit it is Hadamards, a phase flip on $\lvert 0^n \rangle$ (X gates around a multi-controlled Z), and Hadamards again. One Grover iteration is $G = D\,O$.

## 3. The Rotation Angle

The composition of two reflections about lines at angle $\phi$ to each other is a rotation by $2\phi$. The two mirror lines here are $\lvert \alpha \rangle$ and $\lvert s \rangle$, and the angle between them is $\theta$. So each iteration rotates the state by $2\theta$ towards $\lvert \omega \rangle$. Starting at angle $\theta$ from $\lvert \alpha \rangle$, after $k$ iterations the angle is $(2k+1)\theta$:

$$G^k \lvert s \rangle = \sin((2k+1)\theta)\,\lvert \omega \rangle + \cos((2k+1)\theta)\,\lvert \alpha \rangle.$$

The success probability is

$$P_k = \sin^2\big((2k+1)\theta\big).$$

> [!warning] Common mistake
> Rotating by $\theta$ per step instead of $2\theta$. The single reflection moves the state by up to $2\theta$ to the other side of the axis, and it is the second reflection that completes the rotation. Check against $N=4$, $M=1$: $\theta = \pi/6$, one iteration gives $\sin^2(3\pi/6) = 1$, and Grover on two qubits indeed finds the item exactly in one step.

## 4. How Many Iterations

We want $(2k+1)\theta \approx \pi/2$, so $k \approx \pi/(4\theta) - 1/2$. For $M \ll N$, $\theta \approx \sqrt{M/N}$ and

$$k_{\text{opt}} \approx \frac{\pi}{4}\sqrt{\frac{N}{M}}.$$

Overshooting is real. The state keeps rotating past $\lvert \omega \rangle$ and the probability falls again. In the table below, the probabilities come from the formula and were cross-checked by simulating the state vector.

| Iterations $k$ | $N=8$, $M=1$ | $N=16$, $M=1$ |
| :------------: | :----------: | :-----------: |
|       0        |    0.1250    |    0.0625     |
|       1        |    0.7813    |    0.4727     |
|       2        |    0.9453    |    0.9084     |
|       3        |    0.3301    |    0.9613     |
|       4        |    0.0122    |    0.5817     |

For $N=8$, $\theta = \arcsin(1/\sqrt{8}) \approx 0.3614$ rad and $k_{\text{opt}} \approx 1.67$, so the best integer choice is $k=2$ with $P = 0.945$. Taking $k=3$ makes things much worse (0.330). For $N=16$ the best choice is $k=3$ with $P=0.961$. The success probability is never exactly 1 unless $(2k+1)\theta = \pi/2$ happens to hold.

## 5. Worked Example: N = 8

The marked item is $\lvert 101 \rangle$. Start with every amplitude $1/\sqrt{8} \approx 0.3536$.

1. Oracle: the marked amplitude becomes $-0.3536$.
2. Diffuser: it reflects each amplitude about the mean. The mean is $(7 \times 0.3536 - 0.3536)/8 = 0.2652$. A reflected amplitude is $2 \times 0.2652 - a$. Unmarked: $0.5303 - 0.3536 = 0.1768$. Marked: $0.5303 + 0.3536 = 0.8839$.

The marked probability is $0.8839^2 = 0.78125$, matching $\sin^2(3\theta)$. The circuit below runs the real thing on Qiskit's statevector simulator.

```python
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

n, target = 3, "101"                      # printed order: q2 q1 q0

def mcz(qc):                              # phase flip on |1...1>
    qc.h(n - 1); qc.mcx(list(range(n - 1)), n - 1); qc.h(n - 1)

def oracle(qc):                           # sign flip on |target>
    zeros = [i for i, b in enumerate(reversed(target)) if b == "0"]
    qc.x(zeros); mcz(qc); qc.x(zeros)

def diffuser(qc):                         # 2|s><s| - I up to a global phase
    qc.h(range(n)); qc.x(range(n)); mcz(qc); qc.x(range(n)); qc.h(range(n))

qc = QuantumCircuit(n); qc.h(range(n))
for k in range(1, 5):
    oracle(qc); diffuser(qc)
    print(k, round(Statevector(qc).probabilities_dict()[target], 4))
```

Running this prints 0.7812, 0.9453, 0.3301, 0.0122, the same numbers as the formula (the first differs from 0.78125 only by rounding).

## 6. Amplitude Amplification

Nothing in the argument needs the uniform start state. Take any circuit $A$ that prepares a state whose "good" component has amplitude $\sin\theta_a$, with $\sin\theta_a = \sqrt{p}$ for success probability $p$. Replace $D$ by $A\,(2\lvert 0 \rangle\langle 0 \rvert - I)\,A^{\dagger}$ and use an oracle that flags the good states. The same rotation analysis applies, and $O(1/\sqrt{p})$ repetitions of $A$ and $A^\dagger$ boost the success probability close to 1, compared with $O(1/p)$ repeated tries classically. This generalization is amplitude amplification (Brassard, Høyer, Mosca, Tapp). Grover's algorithm is the special case $A = H^{\otimes n}$.

When $M$ is unknown, you can estimate it with quantum counting (phase estimation applied to $G$, see [[notes/quantum/qft-and-phase-estimation|the QPE page]]) or run the algorithm with randomly chosen iteration counts of growing size, as in the Boyer-Brassard-Høyer-Tapp scheme.

## 7. Why Quadratic, and Why Not Better

Bennett, Bernstein, Brassard and Vazirani (1997) proved that any quantum algorithm that finds a marked item among $N$ with the oracle as a black box needs $\Omega(\sqrt{N})$ queries. Zalka (1999) tightened this to show that Grover's constant $\pi/4$ is optimal. So Grover is optimal in the query model for unstructured search.

Two cautions about what this does and does not say. First, it is a statement about black-box queries. It does not prove that NP-complete problems need exponential quantum time, because a problem with exploitable structure may be solvable without treating it as a black box. Second, a quadratic speedup is modest after overheads. Each oracle call is a full circuit, error-corrected quantum hardware runs far slower than classical clocks, and Babbush and coauthors (2021) argued that with these constants a quadratic speedup alone is hard to turn into a practical advantage. This is why most serious proposals for near-term advantage look for super-quadratic structure elsewhere.

## Related

- [[notes/quantum/deutsch-jozsa-and-bernstein-vazirani|Deutsch-Jozsa and Bernstein-Vazirani]]: the phase oracle used here.
- [[notes/quantum/qft-and-phase-estimation|Quantum Fourier Transform and Phase Estimation]]: quantum counting estimates $M$ from the eigenphase of $G$.
- [[notes/quantum/shors-algorithm|Shor's Algorithm]]: an exponential speedup that uses structure instead of black-box search.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]]: why $\sin^2$ of the angle is a probability.
- [[notes/lectures/qiskit/04a-quantum-advantage|QGSS Lab 4a]]: what counts as a validated quantum separation.
