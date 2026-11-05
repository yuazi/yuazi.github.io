---
title: "Backpropagation"
tags:
  - machine-learning
  - deep-learning
  - autodiff
date: 2026-11-05
---

Backpropagation is the algorithm that computes the gradient of a scalar loss with respect to every parameter of a network, in time comparable to one forward pass. It is the chain rule applied in a clever order, and it is reverse-mode automatic differentiation specialized to neural nets. Once you have done one by hand with numbers, `loss.backward()` stops being magic and starts being bookkeeping.

## Mental Model

- A model is a computational graph: nodes are operations, edges carry tensors. Each node knows its own local derivative.
- The chain rule multiplies local derivatives along paths. Backprop organizes those products so shared work is done once.
- Reverse mode costs about one extra pass for a scalar output, no matter how many parameters there are. Forward mode would need one pass per parameter.
- Memory is the price: reverse mode stores forward activations until the backward pass uses them.
- Deep stacks multiply many Jacobians, so gradients tend to shrink or grow exponentially with depth.

## 1. Computational Graphs and the Chain Rule

Write the loss as a composition $L = f_k(f_{k-1}(\cdots f_1(\mathbf x)))$. With intermediate values $\mathbf a_i = f_i(\mathbf a_{i-1})$, the chain rule gives

$$
\frac{\partial L}{\partial \mathbf a_{i-1}} = \left(\frac{\partial \mathbf a_i}{\partial \mathbf a_{i-1}}\right)^{\!\top}\frac{\partial L}{\partial \mathbf a_i}.
$$

So if you know the gradient arriving from above ($\partial L/\partial\mathbf a_i$, often called the upstream gradient), multiplying by the transpose of the node's local Jacobian passes it down. Each node needs only two things: how to compute its output, and how to turn an upstream gradient into gradients for its inputs and parameters. When a value is used in several places, the gradients from each use are summed.

For a linear layer $\mathbf z = W\mathbf a + \mathbf b$ with upstream gradient $\boldsymbol\delta=\partial L/\partial\mathbf z$:

$$
\frac{\partial L}{\partial W} = \boldsymbol\delta\,\mathbf a^\top,\qquad
\frac{\partial L}{\partial \mathbf b} = \boldsymbol\delta,\qquad
\frac{\partial L}{\partial \mathbf a} = W^\top\boldsymbol\delta.
$$

For an elementwise activation $\mathbf h=\phi(\mathbf z)$ the Jacobian is diagonal, so the backward step is the elementwise product $\boldsymbol\delta_z = \boldsymbol\delta_h\odot\phi'(\mathbf z)$.

## 2. Forward Mode Versus Reverse Mode

Take a function $F:\mathbb R^n\to\mathbb R^m$ with Jacobian $J\in\mathbb R^{m\times n}$ factored as a product of per-node Jacobians, $J = J_k\cdots J_1$. The order of multiplication is up to you.

Forward mode pushes a tangent vector from the input side. One sweep yields one column of $J$ (the effect of one input direction on all outputs), so a full Jacobian costs $n$ sweeps. Reverse mode pulls a cotangent from the output side. One sweep yields one row of $J$ (the sensitivity of one output to all inputs), so a full Jacobian costs $m$ sweeps.

A training loss has $m=1$ and $n$ in the millions or billions. Reverse mode gets the full gradient in one backward sweep, at a cost of a small constant multiple of the forward pass. Forward mode would need $n$ sweeps. This asymmetry is the whole reason deep learning is practical. Forward mode wins in the opposite regime, few inputs and many outputs, and it also lets you compute Jacobian-vector products without storing activations.

## 3. A Two-Layer MLP by Hand

Network: input $\mathbf x=(1,2)$, hidden layer of two ReLU units, one linear output, squared-error loss with target $t=1$.

$$
\mathbf z_1 = W_1\mathbf x,\quad \mathbf h=\max(\mathbf z_1,0),\quad \hat y=\mathbf w_2^\top\mathbf h + b_2,\quad L=\tfrac12(\hat y-t)^2,
$$

with $W_1=\begin{pmatrix}0.1&0.2\\0.3&-0.1\end{pmatrix}$, $\mathbf w_2=(0.5,-0.4)$, $b_2=0.1$ (hidden biases left at zero).

> [!example] Forward pass
> $\mathbf z_1 = (0.1\cdot1+0.2\cdot2,\;0.3\cdot1-0.1\cdot2) = (0.5,\,0.1)$. Both are positive, so $\mathbf h=(0.5,0.1)$.
> $\hat y = 0.5\cdot0.5 + (-0.4)\cdot0.1 + 0.1 = 0.31$.
> $L=\tfrac12(0.31-1)^2 = 0.23805$.

> [!example] Backward pass
> Start at the loss: $\delta_y = \partial L/\partial\hat y = \hat y - t = -0.69$.
> Output layer: $\partial L/\partial\mathbf w_2 = \delta_y\,\mathbf h = (-0.345,\,-0.069)$ and $\partial L/\partial b_2=-0.69$.
> Into the hidden layer: $\partial L/\partial\mathbf h = \delta_y\,\mathbf w_2 = (-0.345,\;0.276)$.
> Through the ReLU, both units were active, so the mask is $(1,1)$ and $\boldsymbol\delta_z=(-0.345,\,0.276)$.
> First layer: $\partial L/\partial W_1 = \boldsymbol\delta_z\mathbf x^\top = \begin{pmatrix}-0.345&-0.69\\0.276&0.552\end{pmatrix}$.

A ReLU unit with $z\le0$ would have blocked its gradient entirely, contributing a zero row to $\partial L/\partial W_1$. A gradient step with $\eta=0.1$ then moves $\hat y$ toward the target, because every update is $-\eta\,\partial L/\partial\theta$.

## 4. Gradient Checking

Hand-written backward passes are easy to get subtly wrong. The standard test compares the analytic gradient with a central finite difference,

$$
\frac{\partial L}{\partial\theta_j}\approx\frac{L(\theta_j+\varepsilon)-L(\theta_j-\varepsilon)}{2\varepsilon},
$$

whose error is $O(\varepsilon^2)$ (a forward difference is only $O(\varepsilon)$). Compare with a relative error $\lVert g_a-g_n\rVert/(\lVert g_a\rVert+\lVert g_n\rVert)$. As a rule of thumb, in float64 with $\varepsilon=10^{-5}$ a correct implementation lands around $10^{-7}$ or below, and an error near $10^{-2}$ or more points to a bug. Use float64, because float32 round-off swamps the difference. Avoid checking exactly at ReLU kinks, where the numeric derivative is not defined.

```python
import numpy as np

x, t = np.array([1.0, 2.0]), 1.0
W1 = np.array([[0.1, 0.2], [0.3, -0.1]]); w2 = np.array([0.5, -0.4]); b2 = 0.1

def loss(W1, w2, b2):
    h = np.maximum(W1 @ x, 0)
    return 0.5 * (w2 @ h + b2 - t) ** 2

# analytic gradients (the hand calculation)
z1 = W1 @ x; h = np.maximum(z1, 0); dy = w2 @ h + b2 - t
dw2 = dy * h
dW1 = np.outer(dy * w2 * (z1 > 0), x)

def numeric(P, f, eps=1e-5):
    G = np.zeros_like(P)
    for i in np.ndindex(P.shape):
        old = P[i]
        P[i] = old + eps; up = f()
        P[i] = old - eps; dn = f()
        P[i] = old
        G[i] = (up - dn) / (2 * eps)
    return G

rel = lambda a, b: np.linalg.norm(a - b) / (np.linalg.norm(a) + np.linalg.norm(b))
print("dW1 rel err:", rel(dW1, numeric(W1, lambda: loss(W1, w2, b2))))
print("dw2 rel err:", rel(dw2, numeric(w2, lambda: loss(W1, w2, b2))))
```

Running this gives relative errors of about $1.3\times10^{-12}$ for $W_1$ and $5.6\times10^{-12}$ for $\mathbf w_2$, and the numeric $\partial L/\partial W_1$ matches the matrix computed by hand in section 3. The loop makes two forward passes per parameter, so gradient checking is for tests on tiny models, never for training.

## 5. Vanishing and Exploding Gradients

Back through $k$ layers, the gradient is a product of $k$ factors of the form $W^\top\mathrm{diag}(\phi'(\mathbf z))$. If the typical singular value of each factor is below 1 the product shrinks exponentially, and above 1 it grows exponentially. Sigmoid is a bad case: $\sigma'(z)\le0.25$, so even with unit-scale weights each layer cuts the gradient by 4x or more.

A quick experiment (random 50-wide layers, weights drawn from $\mathcal N(0, s^2/50)$, 20 layers, gradient of the sum of the top activations with respect to the input) shows the effect:

| Activation | Weight scale $s$ | Input gradient norm after 20 layers |
| ---------- | ---------------- | ----------------------------------- |
| sigmoid    | 1.0              | $1.0\times10^{-12}$                 |
| ReLU       | 0.5              | $2.1\times10^{-8}$                  |
| ReLU       | 1.0              | $2.2\times10^{-2}$                  |
| ReLU       | 2.0              | $2.4\times10^{4}$                   |

The ReLU rows show both failure modes from one knob. The balance point for ReLU is $s=\sqrt2$ (He initialization), which keeps activation variance roughly constant from layer to layer and sits between the last two rows. The standard defenses are sensible initialization (Xavier or He), non-saturating activations, normalization layers, residual connections (they give the gradient an identity path), and gradient clipping for the exploding case. Recurrent nets suffer worst because the same matrix is multiplied once per time step.

> [!warning] Common mistake
> Forgetting to zero gradients between steps in PyTorch silently accumulates them, because backward adds into `.grad` instead of overwriting it. Gradient accumulation is deliberate in some setups, but in a plain loop call `zero_grad()` every step.

## Related

- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]: what to do with the gradients once you have them
- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the one-layer case, where $\boldsymbol\delta = \mathbf p-\mathbf y$
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]]: `backward()`, `zero_grad()` and `step()` in context
- [[notes/ml/convolutional-networks|Convolutional Networks]]: backprop through weight-shared layers
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: backpropagation as presented in the lecture
- [[notes/lectures/mlp/04-rnn|MLP L04: RNNs]]: backpropagation through time, where the vanishing gradient problem is sharpest
