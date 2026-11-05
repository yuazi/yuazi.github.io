---
title: "Shor's Algorithm"
tags:
  - quantum-computing
  - algorithms
date: 2026-11-05
---

Shor's algorithm (1994) factors an integer $N$ in time polynomial in $\log N$, where the best known classical algorithms need super-polynomial time. It does this by turning factoring into the problem of finding the period of $a^x \bmod N$, and a quantum computer finds periods efficiently with phase estimation. It is the reason quantum computers matter for cryptography, and it is also the clearest example of a speedup that comes from structure and not from brute-force search.

![[pictures/topics/quantum/shors-algorithm.png]]

<p class="image-caption">Shor turns 'find the factors' into 'find how often a pattern repeats', which quantum computers are good at. Image: JavaFXpert, CC0, via <a href="https://commons.wikimedia.org/wiki/File:Shor%27s_algorithm_quantum_circuit.png">Wikimedia Commons</a>.</p>

## Mental Model

- Factoring is reduced, classically, to order finding: the smallest $r$ with $a^r \equiv 1 \pmod N$. Only the order-finding step is quantum.
- The quantum step is phase estimation on the unitary $U_a\lvert x \rangle = \lvert ax \bmod N \rangle$, whose eigenphases are $s/r$.
- A measurement gives a number close to $s \cdot 2^t / r$ for a random $s$. Continued fractions recover $r$ (or a divisor of it) from it.
- The gate cost is dominated by controlled modular exponentiation, not by the QFT.
- The algorithm is probabilistic, and several steps (choice of $a$, even order, shared factors in $s$ and $r$) can fail and need a retry.

## 1. From Factoring to Order Finding

Pick $a$ with $1 < a < N$ and $\gcd(a, N) = 1$ (if the gcd is not 1, you already have a factor). Let $r$ be the order of $a$ modulo $N$. If $r$ is even,

$$a^r - 1 = (a^{r/2} - 1)(a^{r/2} + 1) \equiv 0 \pmod N.$$

So $N$ divides the product without dividing either factor, provided $a^{r/2} \not\equiv -1 \pmod N$. Then $\gcd(a^{r/2} \pm 1, N)$ are nontrivial factors. For odd $N$ that is not a prime power, a random $a$ meets these conditions (even $r$, $a^{r/2} \not\equiv -1$) with probability at least $1/2$, so a few attempts suffice.

> [!example] Worked example: N = 15, a = 7
> The powers of 7 modulo 15 are $7, 4, 13, 1$, so the order is $r=4$ (checked by running `pow(7, k, 15)`). It is even, and $7^2 = 49 \equiv 4 \not\equiv -1$. Then $\gcd(7^2 - 1, 15) = \gcd(48, 15) = 3$ and $\gcd(7^2 + 1, 15) = \gcd(50, 15) = 5$. Both are nontrivial, and $15 = 3 \times 5$.

## 2. The Quantum Step

Define $U_a \lvert x \rangle = \lvert a x \bmod N \rangle$ on $\lceil \log_2 N \rceil$ qubits (and identity on values $\geq N$, to keep it unitary). Its eigenvectors are

$$\lvert u_s \rangle = \frac{1}{\sqrt{r}} \sum_{k=0}^{r-1} e^{-2\pi i sk/r} \lvert a^k \bmod N \rangle, \qquad U_a \lvert u_s \rangle = e^{2\pi i s/r} \lvert u_s \rangle,$$

for $s = 0, \dots, r-1$. You cannot prepare $\lvert u_s \rangle$ without knowing $r$, but you do not need to. The sum $\tfrac{1}{\sqrt{r}} \sum_s \lvert u_s \rangle = \lvert 1 \rangle$, so running [[notes/quantum/qft-and-phase-estimation|phase estimation]] on the easy input $\lvert 1 \rangle$ gives the same result as picking a random $s$ and estimating $s/r$.

With $t$ counting qubits, take $t \approx 2 \log_2 N$ so that $2^t \geq N^2$. The measured integer $y$ then satisfies $\lvert y/2^t - s/r \rvert \leq 1/2^{t+1}$ with good probability, and since two distinct fractions with denominators below $N$ differ by at least $1/N^2$, the fraction $s/r$ is the unique one in that window.

## 3. Continued Fractions on N = 15

Take $t = 8$, so $2^t = 256 \geq 15^2 = 225$. The phases are $s/4$, which are exact multiples of $1/256$, so the four possible outcomes are $y \in \{0, 64, 128, 192\}$, each with probability $1/4$ (phase estimation of $s/4$ is dyadic). Post-processing each one with Python's `Fraction.limit_denominator` (which is a continued-fraction expansion):

```python
from fractions import Fraction
from math import gcd

def factor_from_phase(y, t, a, N):
    r = Fraction(y, 2**t).limit_denominator(N).denominator
    if r % 2 or pow(a, r, N) != 1:
        return r, None
    x = pow(a, r // 2, N)
    if x == N - 1:
        return r, None
    return r, (gcd(x - 1, N), gcd(x + 1, N))

for y in (0, 64, 128, 192):
    print(y, factor_from_phase(y, 8, 7, 15))
```

Running this prints `(1, None)` for $y=0$, `(4, (3, 5))` for $y=64$ and $y=192$, and `(2, None)` for $y=128$. The cases $s=0$ and $s=2$ share a factor with $r=4$, so they give $r=1$ and $r=2$, which are only divisors of the true order. This single run succeeds with probability $1/2$ here. In practice you rerun, or combine two results with a least common multiple.

For a case where the fractions are not exact I also computed the distribution for $N=21$, $a=2$, which has order $r=6$, with $t=9$ ($2^t = 512$). The outcome distribution has two sharp peaks at $y=0$ and $y=256$ (probability $1/6$ each, $s=0$ and $s=3$) and four peaks at $y=85, 171, 341, 427$ (about 0.114 each, plus smaller neighbours at 86, 170 and so on). Continued fractions turn $y=85$ into $1/6$, which gives $r=6$, while $y=171$ gives $1/3$ (a divisor of 6).

## 4. Why Modular Exponentiation Dominates

The counting register needs controlled-$U_a^{2^j}$ for $j = 0, \dots, t-1$. Since $U_a^{2^j} = U_{a^{2^j} \bmod N}$, each power is a controlled modular multiplication by a classically precomputed constant. That is about $2n$ controlled multiplications for an $n$-bit modulus, and each multiplication is a sequence of modular additions. With schoolbook arithmetic the total gate count is $O(n^3)$, and with asymptotically faster multiplication it drops to roughly $n^2$ times polylogarithmic factors. The QFT, by contrast, costs $O(n^2)$ gates (or fewer, with the approximate QFT). Space-saving constructions, such as Beauregard's, need only about $2n+3$ qubits. In real resource estimates the arithmetic, including the non-Clifford Toffoli or T gates it needs, is what drives the cost.

## 5. Resource Estimates, Stated Carefully

Numbers for breaking RSA-2048 depend on the assumptions about error rate, code and cycle time, and they have dropped over the years because of better algorithms. As reported by Gidney and Ekerå (2019), factoring a 2048-bit RSA integer would take roughly 20 million noisy physical qubits for about 8 hours, assuming surface-code error correction and a physical error rate near $10^{-3}$. Gidney (2025) reported a further reduction to under one million noisy qubits at the cost of running for under a week. Those are estimates, not demonstrations. The largest actual hardware factoring demonstrations are tiny (such as 15 and 21), and many of them used circuits simplified using knowledge of the answer, as Smolin, Smith and Vargo pointed out in 2013. No quantum computer today can factor a number that a laptop cannot.

## 6. RSA Implications Without Hype

Shor's algorithm breaks RSA, finite-field Diffie-Hellman, and elliptic-curve cryptography, because all three rest on factoring or discrete logarithms. It does not break symmetric ciphers or hash functions; Grover's search (see [[notes/quantum/grovers-search|Grover's Search]]) only gives a quadratic speedup against those, which is why guidance is to use 256-bit symmetric keys. The practical concern is "harvest now, decrypt later": data encrypted today with RSA may be recorded and decrypted once a large enough machine exists. NIST published its first post-quantum standards (FIPS 203, 204 and 205) in August 2024, and migration is mostly an engineering and inventory problem. When such a machine will exist is unknown; the estimates above only say what it would need.

## Related

- [[notes/quantum/qft-and-phase-estimation|Quantum Fourier Transform and Phase Estimation]]: the subroutine that does the work.
- [[notes/quantum/grovers-search|Grover's Search]]: the other famous speedup, quadratic and structure-free.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]]: why the physical qubit counts above are in the millions.
- [[notes/quantum/quantum-hardware|Qubit Hardware Platforms]]: how far today's devices are from those numbers.
- [[notes/quantum/deutsch-jozsa-and-bernstein-vazirani|Deutsch-Jozsa and Bernstein-Vazirani]]: the hidden-structure idea in its simplest form.
- [[notes/lectures/qiskit/04a-quantum-advantage|QGSS Lab 4a]]: Shor as the classic case of a separation that rests on assumptions about classical algorithms.
