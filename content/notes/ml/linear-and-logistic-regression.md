---
title: "Linear and Logistic Regression"
tags:
  - machine-learning
  - regression
  - fundamentals
date: 2026-11-05
---

Linear regression fits a weighted sum of the inputs to a number. Logistic regression squashes that same weighted sum through a sigmoid and reads it as a probability. Both are small enough to derive on paper, and almost everything later in deep learning (losses, gradients, maximum likelihood, decision boundaries) shows up here first in a form you can fully check. I treat them as the model to beat before reaching for anything bigger.

![[pictures/topics/ml/linear-and-logistic-regression.png]]

<p class="image-caption">Draw the straight line that misses the dots by as little as possible. Image: Justinkunimune, CC0, via <a href="https://commons.wikimedia.org/wiki/File:Linear_regression_residuals.svg">Wikimedia Commons</a>.</p>

## Mental Model

- A linear model is a dot product $\hat y = \mathbf w^\top \mathbf x + b$. Fitting means choosing $\mathbf w$ so the predictions are close to the targets.
- Least squares has a closed form, and geometrically it is an orthogonal projection of the target vector onto the column space of the data matrix.
- Squared error is not an arbitrary choice: it is exactly what maximum likelihood gives under Gaussian noise.
- Logistic regression is linear in the log-odds. Its decision boundary is a hyperplane, and its loss (cross-entropy) is convex.
- Both models give clean gradients of the form (prediction minus target) times input.

## 1. Least Squares and the Normal Equations

Stack $n$ examples into a matrix $X \in \mathbb R^{n\times d}$ (with a column of ones for the bias) and the targets into $\mathbf y \in \mathbb R^n$. The loss is the residual sum of squares:

$$
L(\mathbf w) = \lVert \mathbf y - X\mathbf w \rVert^2 = (\mathbf y - X\mathbf w)^\top(\mathbf y - X\mathbf w).
$$

Setting the gradient $-2X^\top(\mathbf y - X\mathbf w)$ to zero gives the normal equations:

$$
X^\top X\,\mathbf w = X^\top \mathbf y \quad\Rightarrow\quad \mathbf w^\star = (X^\top X)^{-1}X^\top \mathbf y.
$$

The Hessian is $2X^\top X$, which is positive semidefinite, so any stationary point is a global minimum. If the columns of $X$ are linearly dependent (or $d > n$), $X^\top X$ is singular and the minimizer is not unique. In practice you solve with a QR or SVD routine (`np.linalg.lstsq`) instead of forming the inverse, because $X^\top X$ squares the condition number of $X$.

> [!example] Worked example
> Four points: $x = 1,2,3,4$ and $y = 2.1, 2.9, 4.2, 4.8$. With $X = [\mathbf 1, \mathbf x]$ the normal equations are
> $$\begin{pmatrix}4 & 10\\ 10 & 30\end{pmatrix}\mathbf w = \begin{pmatrix}14\\ 39.7\end{pmatrix}.$$
> Solving gives $w_0 = 1.15$, $w_1 = 0.94$, so the line is $\hat y = 1.15 + 0.94x$. The residuals are $0.01, -0.13, 0.23, -0.11$ and the RSS is $0.082$. The code below reproduces this.

## 2. The Geometric View

The vector $X\mathbf w$ lives in the column space of $X$, a $d$-dimensional subspace of $\mathbb R^n$. Least squares picks the point in that subspace closest to $\mathbf y$, which is the orthogonal projection:

$$
\hat{\mathbf y} = X(X^\top X)^{-1}X^\top \mathbf y = H\mathbf y.
$$

$H$ is the hat matrix. The residual $\mathbf r = \mathbf y - \hat{\mathbf y}$ is orthogonal to every column of $X$, which is just the normal equations rewritten as $X^\top \mathbf r = \mathbf 0$. In the example above, $X^\top\mathbf r$ comes out as zero up to rounding, and when the model has a bias column the residuals also sum to zero.

> [!tip] Intuition
> Think of the data as one arrow in $n$-dimensional space and the features as $d$ arrows spanning a flat sheet. The fit is the shadow of the target arrow on that sheet. Adding a feature enlarges the sheet, so the shadow can only get closer, which is why training error never rises when you add features.

## 3. Maximum Likelihood Under Gaussian Noise

Assume $y_i = \mathbf w^\top\mathbf x_i + \varepsilon_i$ with $\varepsilon_i \sim \mathcal N(0,\sigma^2)$ independent. The likelihood of the data is a product of Gaussians, so the log-likelihood is

$$
\log p(\mathbf y\mid X,\mathbf w) = -\frac n2\log(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_i (y_i - \mathbf w^\top \mathbf x_i)^2.
$$

Only the second term depends on $\mathbf w$, and it is a negative constant times the RSS. Maximizing the likelihood therefore equals minimizing squared error. The same derivation tells you what goes wrong when the noise is not Gaussian: heavy-tailed noise makes squared error chase outliers, and a Laplace noise model would lead to absolute error instead. Adding a Gaussian prior on $\mathbf w$ turns the MAP estimate into ridge regression, which is picked up in [[notes/ml/generalization-and-regularization|Generalization and Regularization]].

## 4. Logistic Regression

For binary labels $y\in\{0,1\}$, model the probability of class 1 as

$$
p = \sigma(z) = \frac{1}{1+e^{-z}}, \qquad z = \mathbf w^\top\mathbf x + b.
$$

Equivalently, the log-odds are linear: $\log\frac{p}{1-p} = z$. Each label is a Bernoulli draw, so the negative log-likelihood is the binary cross-entropy:

$$
L(\mathbf w) = -\frac1n\sum_i \big[y_i\log p_i + (1-y_i)\log(1-p_i)\big].
$$

The sigmoid has the convenient derivative $\sigma'(z) = \sigma(z)(1-\sigma(z))$. Chain rule on $L$ makes the $p(1-p)$ factors cancel, leaving

$$
\nabla_{\mathbf w} L = \frac1n X^\top(\mathbf p - \mathbf y).
$$

That is the same "error times input" shape as linear regression, with $\mathbf p$ in place of $\hat{\mathbf y}$. The loss is convex (the Hessian is $\frac1n X^\top S X$ with $S=\mathrm{diag}(p_i(1-p_i))$), but there is no closed-form solution, so you use gradient descent or Newton's method (iteratively reweighted least squares). If the classes are perfectly separable, the weights grow without bound, since pushing $\lVert\mathbf w\rVert$ up always lowers the loss. A small L2 penalty fixes that.

The multi-class version replaces the sigmoid with softmax and the loss with categorical cross-entropy, the same pair used at the output of nearly every classifier network (see [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]).

## 5. The Decision Boundary

Predicting class 1 when $p>0.5$ is the same as predicting it when $z>0$. The boundary is the hyperplane $\mathbf w^\top\mathbf x + b = 0$, and $\mathbf w$ is its normal vector. The distance of a point from the boundary is $z/\lVert\mathbf w\rVert$, so $z$ is a signed, scaled distance and $\sigma(z)$ turns it into a confidence. A threshold other than 0.5 just shifts the boundary parallel to itself, which matters when the costs of errors differ (see [[notes/ml/evaluation-metrics|Evaluation Metrics]]).

The boundary is linear in the features you give it. Add $x_1^2$, $x_1x_2$ and so on and the boundary becomes a conic in the original space while the model stays linear in its parameters.

## 6. Running It

```python
import numpy as np

# --- least squares: four points, line y = w0 + w1 x ---
x = np.array([1.0, 2, 3, 4]); y = np.array([2.1, 2.9, 4.2, 4.8])
X = np.c_[np.ones(4), x]
w = np.linalg.solve(X.T @ X, X.T @ y)
r = y - X @ w
print("w =", w, " RSS =", round(r @ r, 3), " X^T r =", np.round(X.T @ r, 10))

# --- logistic regression by gradient descent on two Gaussian blobs ---
rng = np.random.default_rng(0)
Xd = np.r_[rng.normal(-1, 1, (200, 2)), rng.normal(1, 1, (200, 2))]
yd = np.r_[np.zeros(200), np.ones(200)]
A = np.c_[np.ones(400), Xd]
sigmoid = lambda z: 1 / (1 + np.exp(-z))
w = np.zeros(3)
for _ in range(2000):
    p = sigmoid(A @ w)
    g = A.T @ (p - yd) / len(yd)          # gradient of mean cross-entropy
    w -= 0.5 * g
p = sigmoid(A @ w)
loss = -np.mean(yd * np.log(p) + (1 - yd) * np.log(1 - p))
print("w =", w.round(3), " loss =", round(loss, 3), " acc =", np.mean((p > 0.5) == yd))
```

Running this prints `w = [1.15 0.94]`, `RSS = 0.082` for the line fit. For the classifier it prints `w = [0.09 1.877 1.775]`, a loss of `0.204` and an accuracy of `0.9`. The boundary is $0.09 + 1.877x_1 + 1.775x_2 = 0$, nearly the anti-diagonal $x_1 + x_2 \approx 0$ that separates the two blobs, tilted a hair by the bias. The blobs overlap (their centers are $2\sqrt2 \approx 2.83$ standard deviations apart), so 90% training accuracy is close to what any classifier can reach on this data.

> [!warning] Common mistake
> Do not read logistic regression coefficients as effects on probability. A one-unit increase in $x_j$ adds $w_j$ to the log-odds, i.e. multiplies the odds by $e^{w_j}$. The change in probability depends on where you start.

## Related

- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]: how the iterative fit in section 6 is made faster and more stable
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]]: ridge and lasso are this model plus a penalty
- [[notes/ml/evaluation-metrics|Evaluation Metrics]]: accuracy, precision, recall and calibration of the probabilities logistic regression outputs
- [[notes/ml/backpropagation|Backpropagation]]: a neural net is a stack of logistic-regression-like units trained with the same gradient shape
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: cross-entropy and gradient descent from the lecture side
- [[notes/lectures/mlp/01-introduction|MLP L01: Introduction]]: where these baselines sit in the course
