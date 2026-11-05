---
title: "Gradient Descent and Optimizers"
tags:
  - machine-learning
  - optimization
  - deep-learning
date: 2026-11-05
---

Training a model means minimizing a loss $L(\boldsymbol\theta)$ over parameters, and almost every method in use is some variant of "step downhill using the gradient". The variants differ in how much data goes into each gradient, how past gradients are remembered, and how the step size is chosen. I find the clearest way to understand them is a two-dimensional quadratic with a long narrow valley, where each trick has a visible job to do.

![[pictures/topics/ml/gradient-descent-and-optimizers.png]]

<p class="image-caption">Walk downhill one small step at a time until you reach the bottom of the valley. Image: Babayaga94, CC0, via <a href="https://commons.wikimedia.org/wiki/File:Gradient_descent_with_momentum.svg">Wikimedia Commons</a>.</p>

## Mental Model

- Plain gradient descent is $\boldsymbol\theta \leftarrow \boldsymbol\theta - \eta\nabla L$. Its speed is limited by the condition number $\kappa$, the ratio of the steepest to the flattest curvature.
- Stochastic and mini-batch gradients are noisy but unbiased estimates of the full gradient, and they are far cheaper per step.
- Momentum averages gradients over time, which damps oscillation across a valley and builds speed along it.
- Adaptive methods (RMSProp, Adam) rescale each coordinate by a running estimate of its gradient magnitude.
- The learning rate usually needs a schedule: a short warmup, then a decay.

## 1. Batch, Stochastic and Mini-Batch

For a loss that averages over $N$ examples, $L=\frac1N\sum_i \ell_i(\boldsymbol\theta)$, the full gradient needs a pass over all of them. Three options:

| Variant    | Gradient from                  | Cost per step                   | Gradient noise           |
| ---------- | ------------------------------ | ------------------------------- | ------------------------ |
| Batch      | all $N$ examples               | high                            | none                     |
| SGD        | 1 example                      | tiny                            | very high                |
| Mini-batch | $B$ examples (often 32 to 512) | moderate, parallelizes on a GPU | shrinks like $1/\sqrt B$ |

Each mini-batch gradient is an unbiased estimate of the full gradient, so on average you still move downhill. The noise also has a benefit: it helps the iterates leave sharp minima and saddle points, and with a constant learning rate it makes the parameters jitter in a ball around the optimum rather than settle exactly. That is why a decaying learning rate (section 5) is standard. "SGD" in a deep learning library almost always means mini-batch SGD.

## 2. Learning Rate and Conditioning

Take $f(\mathbf x)=\tfrac12\mathbf x^\top A\mathbf x$ with eigenvalues $\mu$ (smallest) and $L$ (largest) of $A$. Gradient descent gives $\mathbf x_{t+1}=(I-\eta A)\mathbf x_t$, so along each eigendirection the error is multiplied by $1-\eta\lambda$. Two constraints follow.

For the steep direction to stay stable you need $\lvert 1-\eta L\rvert<1$, i.e. $\eta<2/L$. For the flat direction to make progress you want $1-\eta\mu$ small, which asks for a large $\eta$. The best fixed step is $\eta=2/(\mu+L)$, and the per-step contraction is then

$$
\frac{\kappa-1}{\kappa+1},\qquad \kappa=\frac{L}{\mu}.
$$

With $A=\mathrm{diag}(1,100)$, $\kappa=100$: the step must stay below $0.02$, the best step is $2/101\approx0.0198$, and the error shrinks by only $99/101\approx0.98$ per iteration. Reaching a 100x smaller error takes on the order of $\kappa$ steps. Neural network losses are not quadratic, but near a minimum the Hessian eigenvalue spread plays the same role, and it is typically wide.

> [!tip] Intuition
> The loss surface is a long narrow canyon. A step size that is safe across the canyon is tiny along it. Gradient descent zigzags between the walls and creeps along the floor.

## 3. Momentum

Heavy-ball momentum keeps a velocity that accumulates gradients:

$$
\mathbf v_{t}=\beta\mathbf v_{t-1}+\nabla L(\boldsymbol\theta_{t-1}),\qquad
\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta\mathbf v_t.
$$

Across the canyon the gradient flips sign every step, so the contributions cancel in $\mathbf v$. Along the canyon they all point the same way and add up, so the effective step grows toward $\eta/(1-\beta)$. On quadratics, tuned momentum improves the rate from about $\kappa$ to about $\sqrt\kappa$ steps. With $\beta=0.9$ the velocity averages over roughly the last 10 gradients. Nesterov momentum evaluates the gradient at the look-ahead point $\boldsymbol\theta-\eta\beta\mathbf v$ and is a small, usually beneficial change.

## 4. RMSProp and Adam

RMSProp divides each coordinate's gradient by a running root-mean-square of its recent values:

$$
\mathbf s_t=\rho\,\mathbf s_{t-1}+(1-\rho)\,\mathbf g_t^{2},\qquad
\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta\,\frac{\mathbf g_t}{\sqrt{\mathbf s_t}+\epsilon}.
$$

Coordinates with consistently large gradients get smaller steps and coordinates with small gradients get larger ones, which partly undoes bad scaling between parameters. Adam (Kingma and Ba, 2015) combines this with momentum on the gradient itself:

$$
\mathbf m_t=\beta_1\mathbf m_{t-1}+(1-\beta_1)\mathbf g_t,\qquad
\mathbf v_t=\beta_2\mathbf v_{t-1}+(1-\beta_2)\mathbf g_t^{2},
$$

$$
\hat{\mathbf m}_t=\frac{\mathbf m_t}{1-\beta_1^{\,t}},\qquad
\hat{\mathbf v}_t=\frac{\mathbf v_t}{1-\beta_2^{\,t}},\qquad
\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta\,\frac{\hat{\mathbf m}_t}{\sqrt{\hat{\mathbf v}_t}+\epsilon}.
$$

The usual defaults are $\beta_1=0.9$, $\beta_2=0.999$, $\epsilon=10^{-8}$. The bias correction exists because $\mathbf m_0=\mathbf v_0=\mathbf 0$. At $t=1$, $\mathbf m_1=0.1\,\mathbf g_1$ is ten times too small, while dividing by $1-\beta_1=0.1$ restores $\hat{\mathbf m}_1=\mathbf g_1$. For $\mathbf v$ the effect is bigger ($1-\beta_2^1=0.001$). Without the correction the first steps would be badly scaled. As $t$ grows the denominators approach 1 and the correction disappears.

Since $\hat{\mathbf m}/\sqrt{\hat{\mathbf v}}$ is roughly of size 1, each parameter moves by about $\eta$ per step regardless of gradient scale. That makes $\eta$ easy to reason about (values near $10^{-3}$ to $10^{-4}$ are common) and makes Adam forgiving of badly scaled gradients.

### AdamW Versus L2

L2 regularization adds $\lambda\boldsymbol\theta$ to the gradient. Inside Adam that term is divided by $\sqrt{\hat{\mathbf v}}$ along with everything else, so parameters with a large gradient history are regularized less, and the penalty no longer behaves like weight decay. AdamW (Loshchilov and Hutter, 2019) decouples them and applies the decay directly:

$$
\boldsymbol\theta_t=\boldsymbol\theta_{t-1}-\eta\left(\frac{\hat{\mathbf m}_t}{\sqrt{\hat{\mathbf v}_t}+\epsilon}+\lambda\boldsymbol\theta_{t-1}\right).
$$

For plain SGD the two forms are equivalent up to rescaling $\lambda$. For Adam they are different, and AdamW is the standard choice for training transformers.

## 5. Learning-Rate Schedules

A constant rate is rarely best. Two pieces recur.

Warmup raises the rate linearly from near zero to $\eta_{\max}$ over the first $T_w$ steps. Early in training the second-moment estimate is built from few, noisy gradients and activations are far from a sensible regime, so large steps can blow up. Warmup is usually a few hundred to a few thousand steps for large models.

Cosine decay then lowers the rate smoothly:

$$
\eta_t=\eta_{\min}+\tfrac12(\eta_{\max}-\eta_{\min})\left(1+\cos\frac{\pi\,(t-T_w)}{T-T_w}\right),\qquad t\ge T_w.
$$

It decays slowly at first, fastest in the middle and slowly at the end, ending near $\eta_{\min}$. Step decay (divide by 10 at fixed epochs) and linear decay are the main alternatives. The decay lets the noisy iterates settle into a minimum instead of orbiting it.

## 6. Experiment: An Ill-Conditioned Quadratic

```python
import numpy as np

lam = np.array([1.0, 100.0])            # Hessian eigenvalues, kappa = 100
grad = lambda x: lam * x
f = lambda x: 0.5 * np.sum(lam * x**2)

def run(update, steps=200):
    x, state = np.array([1.0, 1.0]), {}
    for t in range(1, steps + 1):
        x = update(x, grad(x), state, t)
    return f(x)

def gd(lr):
    return lambda x, g, s, t: x - lr * g

def momentum(lr, b=0.9):
    def u(x, g, s, t):
        s["v"] = b * s.get("v", 0) + g
        return x - lr * s["v"]
    return u

def adam(lr, b1=0.9, b2=0.999, eps=1e-8):
    def u(x, g, s, t):
        s["m"] = b1 * s.get("m", 0) + (1 - b1) * g
        s["v"] = b2 * s.get("v", 0) + (1 - b2) * g * g
        mh, vh = s["m"] / (1 - b1**t), s["v"] / (1 - b2**t)
        return x - lr * mh / (np.sqrt(vh) + eps)
    return u

for name, u in [("GD lr=0.0198", gd(0.0198)), ("GD lr=0.021", gd(0.021)),
                ("momentum lr=0.01", momentum(0.01)), ("Adam lr=0.1", adam(0.1))]:
    print(f"{name:18s} f after 200 steps = {run(u):.2e}")
```

Running this from the start point $(1,1)$, where $f=50.5$, gives these values of $f$ after 200 steps:

| Method                                       | $f$ after 200 steps           |
| -------------------------------------------- | ----------------------------- |
| GD, $\eta=0.0198$ (near the best fixed step) | $1.6\times10^{-2}$            |
| GD, $\eta=0.021$ (just above $2/L$)          | $1.8\times10^{18}$ (diverged) |
| Momentum, $\eta=0.01$, $\beta=0.9$           | $1.5\times10^{-8}$            |
| Adam, $\eta=0.1$                             | $2.6\times10^{-9}$            |

The first two rows are the stability limit in action: a 6% larger step turns convergence into explosion. Momentum gets about six orders of magnitude further than tuned plain GD, matching the $\kappa$ versus $\sqrt\kappa$ picture. Adam does well here partly because the problem is axis-aligned, so per-coordinate scaling removes the ill-conditioning entirely. Rotate the quadratic so its valley lies along a diagonal and the diagonal preconditioner helps much less. Adam with a constant step also does not converge exactly in noisy settings, which brings back the schedules from section 5.

> [!warning] Common mistake
> Comparing optimizers at one shared learning rate says almost nothing, because each has a different good range. Tune $\eta$ per method, and report the best of each.

## Related

- [[notes/ml/backpropagation|Backpropagation]]: where the gradients being descended come from
- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the simplest losses to practice these updates on
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]]: weight decay, early stopping and what optimizers do to generalization
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]]: where `optimizer.step()` and the scheduler sit in practice
- [[notes/generative/numerical-integration|Numerical Integration (Euler to RK4)]]: gradient descent is Euler's method on the gradient flow, and $\eta<2/L$ is its stability limit
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: gradient descent from the lecture
