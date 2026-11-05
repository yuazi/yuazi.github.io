---
title: "Generalization and Regularization"
tags:
  - machine-learning
  - generalization
  - regularization
date: 2026-11-05
---

A model is only useful if it works on data it has not seen. Generalization is the gap between performance on the training set and performance on fresh samples from the same distribution, and nearly everything in practical machine learning (splits, validation, penalties, dropout, augmentation) is about measuring that gap honestly or shrinking it. I come back to this page whenever a training curve looks too good.

## Mental Model

- Training error always flatters the model. Only data the fitting process never touched gives an honest estimate.
- Error splits into bias (the model family cannot represent the truth), variance (the fit changes a lot between training samples) and irreducible noise.
- Regularization trades a little extra bias for a large cut in variance. L2 shrinks weights, L1 zeroes some of them, dropout and early stopping act on the training process.
- Leakage, not overfitting, is the most common reason a result is wrong. Anything that lets test information into training inflates the score.
- Classical theory says a U-shaped test curve. Modern overparameterized models can break that picture in specific, well-studied ways.

## 1. Bias and Variance

For squared error at a fixed input $x$, with $y=f(x)+\varepsilon$, $\mathrm{Var}(\varepsilon)=\sigma^2$, and a predictor $\hat f$ trained on a random training set:

$$
\mathbb E\big[(y-\hat f(x))^2\big] = \underbrace{\big(\mathbb E[\hat f(x)]-f(x)\big)^2}_{\text{bias}^2} + \underbrace{\mathrm{Var}\big(\hat f(x)\big)}_{\text{variance}} + \underbrace{\sigma^2}_{\text{noise}}.
$$

The expectation is over training sets, which is why you cannot measure the pieces from a single fit. A low-degree polynomial fitted to a sine wave is stiff: every training set gives nearly the same wrong curve (high bias, low variance). A degree-12 polynomial through 15 noisy points follows each noise bump, so a new sample produces a very different curve (low bias, high variance). The noise term $\sigma^2$ is a floor no model can beat.

The decomposition is exact for squared error. For other losses, such as cross-entropy, there are analogues but no equally clean split, so treat "bias versus variance" there as a guide to intuition.

## 2. Train, Validation and Test

Hold out data in three roles. The training set fits the parameters. The validation set chooses hyperparameters, architecture and when to stop. The test set is touched once at the end to report performance. Every decision made by looking at a score turns that data into training data for the decision, so reusing the test set to pick between models quietly overfits to it.

Leakage is any path by which held-out information reaches training. Typical ones:

- Fitting a scaler, imputer, PCA or feature selector on the full dataset before splitting. Fit transforms on the training fold only, then apply them to the rest.
- Duplicates or near-duplicates across splits, for example several crops of one image, or multiple rows for one patient or one user. Split by group, not by row.
- Random splits of time series. Predicting the past from the future looks great and fails in deployment, so split by time.
- Features computed from the label or from the future, such as a "days until churn" column.

> [!warning] Common mistake
> Standardizing the whole dataset, then cross-validating. The mean and variance of the validation folds leaked into every training fold. The effect is usually small for scaling and can be huge for supervised feature selection.

## 3. Cross-Validation

With little data, a single validation split is noisy. In $k$-fold cross-validation you split into $k$ parts, train on $k-1$, validate on the remaining one, rotate, and average the $k$ scores. Common values are $k=5$ or $10$. The mean estimates expected performance and the spread across folds tells you how much to trust it. Use stratified folds for imbalanced classes, grouped folds when rows share an entity, and forward-chaining folds for time. When you also tune hyperparameters, use nested CV (an inner loop to tune, an outer loop to evaluate), otherwise the reported score is optimistic. For large neural nets a single validation split is the norm, since $k$ trainings are too expensive.

## 4. L2 and L1 Regularization

Add a penalty on the weights to the loss. For linear regression:

$$
\text{ridge: } \lVert\mathbf y-X\mathbf w\rVert^2+\lambda\lVert\mathbf w\rVert_2^2,\qquad
\text{lasso: } \lVert\mathbf y-X\mathbf w\rVert^2+\lambda\lVert\mathbf w\rVert_1.
$$

Ridge has the closed form $\mathbf w=(X^\top X+\lambda I)^{-1}X^\top\mathbf y$. The $\lambda I$ term makes the matrix invertible and damps directions of small singular value, which is exactly where the variance lives. Probabilistically, ridge is the MAP estimate with a Gaussian prior on the weights and lasso is the MAP estimate with a Laplace prior.

The geometry explains the difference. Minimizing the loss subject to $\lVert\mathbf w\rVert_p\le c$ means finding where an elliptical loss contour first touches the constraint region. For $p=2$ the region is a disk, with no preferred direction, so the touching point has generically nonzero coordinates. For $p=1$ it is a diamond with corners on the axes. Elliptical contours tend to touch a corner, where some coordinates are exactly zero. So lasso gives sparse solutions and acts as feature selection, while ridge shrinks everything smoothly. With strongly correlated features lasso picks one more or less arbitrarily, and ridge spreads weight across them.

In a neural network, L2 on the weights is called weight decay (with the Adam caveat in [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]).

## 5. Dropout, Early Stopping, Augmentation

Dropout zeroes each hidden activation with probability $p$ during training. With "inverted dropout" the surviving units are scaled by $1/(1-p)$ so that nothing needs to change at test time. It prevents units from co-adapting, and it can be viewed as training an ensemble of thinned networks that share weights. It is switched off at inference.

Early stopping watches validation loss during training and keeps the weights from its minimum, usually with a patience window of a few epochs. For gradient descent from a small initialization, the weights grow gradually, so stopping early limits the effective model size. For linear models this acts much like an L2 penalty.

Data augmentation adds label-preserving transformations to the training set: flips, crops and color jitter for images, noise or time-shifts for signals, back-translation for text. It injects prior knowledge about which changes should not alter the answer. It only works when the transform truly preserves the label (flipping a "6" into a "9" does not).

## 6. Double Descent

The classical story has test error forming a U as capacity grows. Belkin and colleagues (2019) described a different shape for some model families: as capacity rises, test error peaks near the interpolation threshold, where the model has just enough parameters to fit the training set exactly, then falls again as the model grows further. It has been observed in random-feature models and minimum-norm linear regression, and in some neural networks. It is not a claim that bigger is always better. The peak depends on label noise and is damped or removed by regularization, and it also depends on how you count capacity (parameters, training epochs or data size). Among interpolating solutions, the ones chosen by gradient descent tend to have small norm, which gives a reason the second descent can be benign. Treat it as a caution against reading a single U-shaped curve as law.

## 7. Polynomial-Fit Demo

```python
import numpy as np

rng = np.random.default_rng(1)
f = lambda x: np.sin(2 * np.pi * x)
xtr = rng.uniform(0, 1, 15);  ytr = f(xtr) + rng.normal(0, 0.2, 15)
xte = rng.uniform(0, 1, 500); yte = f(xte) + rng.normal(0, 0.2, 500)

def fit(deg, lam=0.0):
    V = np.vander(xtr, deg + 1, increasing=True)
    # ridge as an augmented least-squares problem (stable even for lam=0)
    A = np.vstack([V, np.sqrt(lam) * np.eye(deg + 1)])
    return np.linalg.lstsq(A, np.r_[ytr, np.zeros(deg + 1)], rcond=None)[0]

mse = lambda w, x, y: np.mean((np.vander(x, len(w), increasing=True) @ w - y) ** 2)

for deg in [1, 3, 5, 9, 12]:
    w = fit(deg)
    print(f"degree {deg:2d}  train {mse(w, xtr, ytr):.3f}  test {mse(w, xte, yte):.3f}")
for lam in [1e-6, 1e-3, 1e-1]:
    w = fit(12, lam)
    print(f"degree 12, lambda={lam:g}  train {mse(w, xtr, ytr):.3f}  test {mse(w, xte, yte):.3f}")
```

Running it (noise variance is $0.2^2=0.04$, so test MSE cannot go much below that):

| Model                        | Train MSE | Test MSE |
| ---------------------------- | --------- | -------- |
| degree 1                     | 0.298     | 0.259    |
| degree 3                     | 0.016     | 0.069    |
| degree 5                     | 0.016     | 0.068    |
| degree 9                     | 0.007     | 2.808    |
| degree 12                    | 0.003     | 5679.7   |
| degree 12, $\lambda=10^{-6}$ | 0.012     | 0.116    |
| degree 12, $\lambda=10^{-3}$ | 0.023     | 0.071    |
| degree 12, $\lambda=10^{-1}$ | 0.149     | 0.149    |

Train error falls monotonically with degree while test error is U-shaped with a violent right arm: the degree-12 curve is wild between and beyond the 15 training points. The same degree-12 model with a tiny ridge penalty lands at 0.071, close to the degree-3 fit, and an over-large penalty ($\lambda=0.1$) underfits again. The exact test numbers for the high degrees depend strongly on the random draw of training points, so read them as a pattern, not as constants.

## Related

- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the models being regularized here, and the MAP view of the penalty
- [[notes/ml/evaluation-metrics|Evaluation Metrics]]: which score to compute on the held-out set
- [[notes/ml/decision-trees-and-ensembles|Decision Trees and Ensembles]]: bagging attacks variance directly
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]: weight decay and implicit regularization from SGD
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]]: where the validation loop and early stopping live
- [[notes/lectures/mlp/13-xai|MLP L13: Explainable AI]]: checking what a model relies on, a useful test beyond the score
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: the lecture view of overfitting
