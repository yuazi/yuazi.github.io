---
title: "Quantum Machine Learning"
tags:
  - quantum-computing
  - machine-learning
date: 2026-11-05
---

Quantum machine learning (QML) asks whether a quantum computer can learn from data faster or better than a classical one. The honest answer today is mixed. A few clean constructions exist, most promised speedups depend on assumptions about data access that rarely hold, and several have been matched by classical algorithms. I keep this page as a checklist of the ideas and of the places where each one breaks, so that I can read QML papers critically.

## Mental Model

- Classical data has to be loaded into a quantum state first, and that step can cost as much as the learning it enables.
- A quantum feature map $x \mapsto \lvert\phi(x)\rangle$ is a kernel method with an exponentially large feature space, and the kernel is an overlap between two states.
- Variational classifiers are small parameterized circuits trained with a classical optimizer, the same loop as in [[notes/quantum/variational-algorithms|Variational Algorithms]].
- Trainability and expressivity pull against each other: circuits rich enough to be hard to simulate tend to have flat loss landscapes.
- Claimed exponential speedups for classical data have repeatedly been reduced to polynomial ones by classical "dequantized" algorithms.

## 1. Getting Data In

**Angle encoding** puts one feature on one rotation, for example $x_i$ into $R_Y(x_i)\lvert 0\rangle = \cos(x_i/2)\lvert 0\rangle + \sin(x_i/2)\lvert 1\rangle$. It uses $n$ qubits for $n$ features and constant depth, so it is cheap, and the encoded state is a nonlinear (trigonometric) function of the input.

**Amplitude encoding** stores a normalized vector of length $2^n$ in the amplitudes of $n$ qubits. The vector $(1, 2, 2, 0)/3$ becomes $\tfrac13(\lvert 00\rangle + 2\lvert 01\rangle + 2\lvert 10\rangle)$ on two qubits. It is very compact: a million features fit into 20 qubits. The catch is state preparation. For a generic vector it needs on the order of $2^n$ gates, which gives back the exponential saving. Fast preparation exists only when the data has structure or sits in a QRAM-like memory, and no such memory has been built at scale.

> [!note]
> Amplitude encoding also normalizes the vector, so the length of $x$ is lost unless you store it separately.

## 2. Feature Maps and Quantum Kernels

A feature map is a circuit $U(x)$ that prepares $\lvert\phi(x)\rangle = U(x)\lvert 0\rangle$. The fidelity kernel is

$$
k(x, x') = \lvert\langle\phi(x)\vert\phi(x')\rangle\rvert^2 .
$$

You estimate it by running $U(x')^\dagger U(x)$ on $\lvert 0\ldots 0\rangle$ and counting how often you read all zeros. The resulting Gram matrix goes to an ordinary classical SVM or kernel ridge regression. For one qubit with $R_Y$ encoding the overlap is $\cos\frac{x-x'}{2}$, so $k(x,x') = \cos^2\frac{x-x'}{2}$. For $x = 0.5$ and $x' = 1.7$ that is $\cos^2(0.6) \approx 0.681$. That kernel is easy to compute classically. The hope is for feature maps with entangling gates whose kernels are hard to compute classically, as proposed by Havlicek et al. (2019). A hard kernel is necessary for an advantage, but it does not suffice: the kernel must also match structure in the data.

A kernel costs $N^2/2$ circuit evaluations for $N$ training points, each repeated for many shots. This is a practical limit before any asymptotic one.

## 3. Variational Classifiers

The model is $f_\theta(x) = \langle\phi(x)\vert\, U(\theta)^\dagger\, O\, U(\theta)\, \lvert\phi(x)\rangle$: encode, apply a trainable circuit, measure an observable $O$ such as $Z$ on one qubit. The loss is a normal classification loss, and the gradients come from the parameter-shift rule on hardware. Compared with a neural network ([[notes/ml/pytorch-training-loop|The PyTorch Training Loop]], [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]), the model has far fewer parameters, a fixed output range ($[-1, 1]$ for a Pauli observable), and every gradient costs two circuit runs per parameter. A model of this form is, mathematically, a linear model in a Fourier-like feature space determined by the encoding, which explains both what it can express and where it struggles.

## 4. Barren Plateaus and Kernel Concentration

For deep, random-like parameterized circuits, the variance of a gradient component shrinks exponentially with the number of qubits (the barren plateau, McClean et al., 2018). With a plateau, the loss looks flat everywhere, and resolving a gradient above shot noise needs exponentially many measurements. Mitigations include shallow circuits, local cost functions, structured ansatzes, and smart initialization, and they all limit expressivity.

Kernels have a matching problem. If the feature map is too expressive or too entangling, the overlaps $k(x, x')$ for different inputs all cluster near the same tiny value (exponential concentration). The Gram matrix then approaches the identity, the model can only memorize, and distinguishing the entries again needs exponentially many shots. A feature map that generalizes has to be matched to the data, which is why bandwidth tuning matters here as much as the kernel width in a classical RBF kernel ([[notes/ml/generalization-and-regularization|Generalization and Regularization]]).

## 5. Dequantization

Quantum algorithms for linear algebra and recommendation (Kerenidis and Prakash, 2016) promised exponential speedups, but only given fast QRAM-style access to the data. Tang (2018) showed that a classical algorithm with an analogous input model, sampling entries with probability proportional to their squared magnitude, can solve the recommendation problem in time polylogarithmic in the matrix dimensions. The classical algorithm is polynomially slower in the other parameters such as the rank and error, so it is not always faster in practice. The lesson to carry over: a speedup that holds only under a data-access assumption, compared with a classical algorithm that gets no similar access, is not a fair comparison. Further results in the same spirit dequantized a number of related low-rank algorithms.

## 6. Where Advantage Is Unlikely

My working view, with the uncertainty it deserves:

- Standard tabular and image tasks. Classical models, trained on GPUs, are cheap and good, and the loading cost removes theoretical gains.
- Low-rank, sampleable data: dequantization applies, so any speedup is at most polynomial.
- Small variational models on noisy hardware: few parameters, noise, and flat landscapes make them hard to train, and the results so far are on small datasets where classical baselines are competitive.

More plausible targets are tasks where the data is itself quantum (states from a simulation or sensor, learning properties of quantum systems) or where the classical difficulty comes from the structure of the problem and not from the dataset size. For now, treat advantage claims in QML as hypotheses that need a strong classical baseline.

## Related

- [[notes/quantum/variational-algorithms|Variational Algorithms]]: the same hybrid training loop and the same plateau problem.
- [[notes/quantum/qubits-and-the-bloch-sphere|Qubits and the Bloch Sphere]]: what the $R_Y$ encoding does geometrically.
- [[notes/ml/embeddings|Embeddings]]: the classical counterpart of a feature map.
- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the linear-in-features view of both kernels and variational models.
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]]: why too much expressivity hurts.
- [[notes/lectures/qiskit/04a-quantum-advantage|Quantum Advantage (QGSS lab)]]: how advantage is argued for hardware experiments.
