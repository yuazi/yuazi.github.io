---
title: "Qubits and the Bloch Sphere"
tags:
  - quantum-computing
  - fundamentals
date: 2026-11-05
---

A qubit is a two-level quantum system whose state is a unit vector in $\mathbb{C}^2$. Everything else in quantum computing (gates, measurement, entanglement) is built on that one definition, so I keep this page as the place to look up conventions: how amplitudes map to angles, which phases matter, and how Qiskit orders bits. The Bloch sphere is the picture that makes single-qubit gates easy to reason about, and it stops working in exactly the place where multi-qubit physics starts.

![[pictures/topics/quantum/qubits-and-the-bloch-sphere.png]]

<p class="image-caption">A qubit is an arrow on a ball: up is 0, down is 1, and every other direction is a mix of both. Rendered for this page.</p>

## Mental Model

- A qubit state is a pair of complex amplitudes $(\alpha, \beta)$ with $\lvert\alpha\rvert^2 + \lvert\beta\rvert^2 = 1$. Squared magnitudes are measurement probabilities, phases are what interference acts on.
- Global phase has no physical effect. Relative phase between amplitudes does, and it is the $\phi$ angle on the Bloch sphere.
- Every pure single-qubit state is a point on a sphere. Every single-qubit gate is a rotation of that sphere.
- $n$ qubits need $2^n$ amplitudes, and most multi-qubit states are not a product of single-qubit states, so no list of $n$ Bloch spheres can describe them.
- Qiskit is little-endian: qubit 0 is the rightmost bit in a printed bitstring.

## 1. State Vectors and Amplitudes

The computational basis states are

$$
\lvert 0 \rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \qquad \lvert 1 \rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}.
$$

A general state is $\lvert\psi\rangle = \alpha\lvert 0\rangle + \beta\lvert 1\rangle$ with $\alpha, \beta \in \mathbb{C}$ and $\lvert\alpha\rvert^2 + \lvert\beta\rvert^2 = 1$. Measuring in the computational basis returns 0 with probability $\lvert\alpha\rvert^2$ and 1 with probability $\lvert\beta\rvert^2$ (see [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]]).

Four real numbers describe $(\alpha, \beta)$. Normalization removes one and global phase removes another, which leaves two real parameters. That is the two angles of the Bloch sphere.

## 2. Global Phase and Relative Phase

Multiplying the whole state by $e^{i\gamma}$ changes nothing observable: every probability, and every later interference pattern between the branches of this one state, is unchanged. So $\lvert\psi\rangle$ and $-\lvert\psi\rangle$ are the same physical state.

Relative phase is different. The states

$$
\lvert + \rangle = \tfrac{1}{\sqrt 2}(\lvert 0\rangle + \lvert 1\rangle), \qquad \lvert - \rangle = \tfrac{1}{\sqrt 2}(\lvert 0\rangle - \lvert 1\rangle)
$$

give identical statistics when measured in the $Z$ basis (50/50), yet they are orthogonal. A Hadamard maps them to $\lvert 0\rangle$ and $\lvert 1\rangle$, which makes the difference visible.

> [!warning] Common mistake
> Phase becomes physical when it is controlled. A global phase on a gate is invisible, but the same phase applied only when a control qubit is 1 turns into a relative phase on the control. This is phase kickback, and it is the core of phase estimation (see [[notes/quantum/qft-and-phase-estimation|QFT and Phase Estimation]]).

## 3. The Bloch Sphere

Drop the global phase by making $\alpha$ real and non-negative. Then

$$
\lvert\psi\rangle = \cos\tfrac{\theta}{2}\,\lvert 0\rangle + e^{i\phi}\sin\tfrac{\theta}{2}\,\lvert 1\rangle, \qquad \theta \in [0, \pi],\ \phi \in [0, 2\pi).
$$

The half angle is there so that $\theta = \pi$ gives $\lvert 1\rangle$ exactly. The matching point on the unit sphere is the Bloch vector

$$
\vec r = (\sin\theta\cos\phi,\ \sin\theta\sin\phi,\ \cos\theta) = (\langle X\rangle, \langle Y\rangle, \langle Z\rangle).
$$

The components are the expectation values of the three Pauli matrices. Orthogonal states sit at antipodal points, and $\theta$ controls the measurement bias: $P(0) = \cos^2(\theta/2) = (1 + z)/2$.

### The Six Cardinal States

| State                                                            | Bloch vector $(x, y, z)$ | Where      |
| ---------------------------------------------------------------- | ------------------------ | ---------- |
| $\lvert 0\rangle$                                                | $(0, 0, 1)$              | north pole |
| $\lvert 1\rangle$                                                | $(0, 0, -1)$             | south pole |
| $\lvert +\rangle$                                                | $(1, 0, 0)$              | $+x$       |
| $\lvert -\rangle$                                                | $(-1, 0, 0)$             | $-x$       |
| $\lvert +i\rangle = (\lvert 0\rangle + i\lvert 1\rangle)/\sqrt2$ | $(0, 1, 0)$              | $+y$       |
| $\lvert -i\rangle = (\lvert 0\rangle - i\lvert 1\rangle)/\sqrt2$ | $(0, -1, 0)$             | $-y$       |

I confirmed these by computing $\langle X\rangle, \langle Y\rangle, \langle Z\rangle$ for each vector with numpy.

> [!example] Worked example
> Place $\lvert\psi\rangle = \tfrac{1}{\sqrt3}\lvert 0\rangle + \sqrt{\tfrac23}\,e^{i\pi/4}\lvert 1\rangle$ on the sphere.
>
> From $\cos(\theta/2) = 1/\sqrt3$ we get $\theta = 2\arccos(1/\sqrt3) \approx 109.47^\circ$, and the relative phase gives $\phi = 45^\circ$. Then $\vec r = (\sin\theta\cos\phi, \sin\theta\sin\phi, \cos\theta) \approx (0.667, 0.667, -0.333)$. Numerically computing $\langle X\rangle, \langle Y\rangle, \langle Z\rangle$ from the amplitudes gives the same vector.
>
> The state is a little below the equator, so it reads 0 with probability $1/3$ and 1 with probability $2/3$. The phase of $45^\circ$ shows up only when you rotate it into the $X$ or $Y$ basis.
>
> A second one: $\theta = \pi/3, \phi = \pi/2$ gives $\vec r = (0, 0.866, 0.5)$, a state in the $y$-$z$ plane, 30 degrees above the equator toward $+y$.

## 4. Gates as Rotations

Every single-qubit unitary is a rotation of the sphere (plus an irrelevant global phase). $X$, $Y$, $Z$ rotate by $\pi$ around their axes, $H$ swaps the $x$ and $z$ axes, and $R_P(\vartheta)$ rotates by $\vartheta$ around axis $P$. The full catalogue, with matrices and identities, is on [[notes/quantum/quantum-gates|Quantum Gates]].

> [!tip] Intuition
> Think of the sphere as a compass for a single qubit. The $z$ axis answers "0 or 1?", the $x$ axis answers "$+$ or $-$?", the $y$ axis answers "$+i$ or $-i$?". A state is the three answers at once, and they cannot all be sharp: the vector has length 1, so being sure about $z$ forces $x$ and $y$ to zero.

## 5. Several Qubits

Two qubits live in $\mathbb{C}^2 \otimes \mathbb{C}^2 = \mathbb{C}^4$. A product state is a Kronecker product, for example

$$
\lvert 0\rangle \otimes \lvert 1\rangle = \begin{pmatrix}1\\0\end{pmatrix} \otimes \begin{pmatrix}0\\1\end{pmatrix} = \begin{pmatrix}0\\1\\0\\0\end{pmatrix}.
$$

A general two-qubit state has four amplitudes, $\sum_{ab} c_{ab}\lvert ab\rangle$, and it is a product state only if the $2 \times 2$ matrix $c_{ab}$ has rank 1. A Bell state does not, which is the subject of [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]].

For $n$ qubits the state vector has $2^n$ complex amplitudes. A product of $n$ single-qubit states needs only $2n$ real numbers (two angles each), so the gap between $2^n$ and $2n$ is the room that entanglement occupies. It is also why classical state-vector simulation tops out at roughly 30 to 50 qubits on real machines: each added qubit doubles memory.

### Qiskit's Bit Order

Qiskit labels basis states $\lvert q_{n-1} \dots q_1 q_0\rangle$, with qubit 0 on the right, and the amplitude index is $\sum_i q_i 2^i$. Applying $X$ to qubit 0 of a two-qubit register gives the vector $(0, 1, 0, 0)$, printed as the label `'01'`. Tensor products in Qiskit therefore run in reverse: the circuit for $\lvert q_1\rangle \otimes \lvert q_0\rangle$ puts the later qubit first in the Kronecker product.

```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.x(0)                      # flip qubit 0 only
sv = Statevector(qc)
print(sv.data)               # [0, 1, 0, 0]
print(sv.probabilities_dict())  # {'01': 1.0}
```

Running this prints exactly those values. Textbooks usually write the first qubit on the left, so a circuit diagram that matches a textbook equation can print its bitstrings reversed. Measurement results follow the same rule: classical bit 0 is the rightmost character of the count keys.

## Related

- [[notes/quantum/quantum-gates|Quantum Gates]] for the rotations and matrices that move points on the sphere.
- [[notes/quantum/measurement-and-the-born-rule|Measurement and the Born Rule]] for what the amplitudes mean when you read them out.
- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for states that have no Bloch sphere of their own.
- [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for the filled ball, where noisy qubits live.
- [[notes/lectures/qiskit/00-qiskit-patterns-and-primitives|QGSS: Qiskit Patterns and Primitives]] for the bit-order convention in real code.
- [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]] for how circuits map onto physical qubits.
