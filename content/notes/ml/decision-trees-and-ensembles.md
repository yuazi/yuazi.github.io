---
title: "Decision Trees and Ensembles"
tags:
  - machine-learning
  - trees
  - ensembles
date: 2026-11-05
---

A decision tree predicts by asking a sequence of yes/no questions about the features, and a forest or boosted ensemble averages or sums many such trees. Single trees are easy to read but unstable. Ensembles fix that and, on tabular data, are still the models I try first before touching a neural net. The page walks through how a split is chosen, why trees overfit, and how bagging and boosting attack the two halves of the bias-variance tradeoff.

## Mental Model

- A tree partitions feature space into axis-aligned boxes and predicts a constant (class mix or mean) in each box.
- Training is greedy: at each node pick the single split that most reduces impurity, then recurse. There is no look-ahead.
- A deep tree has low bias and high variance. Bagging averages away variance. Boosting reduces bias by adding trees that correct the current errors.
- Random forests decorrelate their trees by also subsampling features, which makes averaging more effective.
- Gradient-boosted trees (XGBoost, LightGBM) are the strong default for tabular data.

## 1. Choosing a Split

At a node with class proportions $p_1,\dots,p_K$, two standard impurity measures are

$$
\text{Gini}=1-\sum_k p_k^2,\qquad \text{Entropy}=-\sum_k p_k\log_2 p_k.
$$

Both are 0 for a pure node and maximal for a uniform mix. A candidate split sends $n_L$ samples left and $n_R$ right, and its quality is the impurity decrease (information gain when using entropy):

$$
\Delta = I(\text{parent})-\frac{n_L}{n}I(\text{left})-\frac{n_R}{n}I(\text{right}).
$$

The algorithm (CART) scans every feature and every threshold between sorted values and takes the best $\Delta$. For regression, the impurity is the variance of the targets in the node, and the prediction is their mean.

> [!example] Worked example
> A node holds 20 samples, 10 of each class. Parent: Gini $=1-0.5^2-0.5^2=0.5$, entropy $=1$ bit.
>
> Split A sends 10 samples left (8 positive, 2 negative) and 10 right (2 positive, 8 negative). Each child has Gini $1-0.8^2-0.2^2=0.32$ and entropy $0.722$ bits. The weighted Gini is $0.32$, so $\Delta_{\text{Gini}}=0.18$, and the information gain is $1-0.722=0.278$ bits.
>
> Split B sends 16 samples left (10 positive, 6 negative) and 4 right (all negative). Left Gini is $1-0.625^2-0.375^2=0.469$ and right is $0$, so the weighted Gini is $0.8\times0.469=0.375$ and $\Delta_{\text{Gini}}=0.125$. Left entropy is $0.954$, weighted $0.764$, gain $0.236$ bits.
>
> Both criteria prefer A here. They do not always agree, but in practice the choice between Gini and entropy changes the trees very little.

A categorical feature can be split by subset or, more commonly in libraries, one-hot encoded. For continuous features with many values, histogram binning (section 5) makes the scan cheap.

## 2. Overfitting and Pruning

Grown until every leaf is pure, a tree memorizes the training set: zero training error, with leaves that hold one or two samples and predictions that swing with single points. Two families of controls:

- Pre-pruning limits growth: maximum depth, minimum samples per leaf or per split, minimum impurity decrease, maximum number of leaves.
- Post-pruning grows a large tree and then removes branches. Cost-complexity pruning minimizes $R(T)+\alpha\lvert T\rvert$, the training error plus $\alpha$ times the leaf count, and chooses $\alpha$ by cross-validation.

Even a pruned single tree is unstable: changing a few training points can change the root split and hence the whole structure. That instability is the variance that ensembles exploit. Trees also cannot extrapolate (a regression tree predicts a constant outside the training range) and they approximate diagonal boundaries with staircases.

## 3. Bagging and Random Forests

Bagging (bootstrap aggregation, Breiman) trains $B$ trees, each on a bootstrap sample of the $n$ training rows drawn with replacement, and averages the predictions (votes for classification). If each tree has variance $\sigma^2$ and trees are correlated with pairwise correlation $\rho$, the variance of the average is

$$
\rho\,\sigma^2+\frac{1-\rho}{B}\,\sigma^2 .
$$

More trees drive the second term to zero but cannot touch the first, so the remaining lever is lowering $\rho$. A random forest does that by considering only a random subset of features at each split, commonly about $\sqrt d$ for classification and $d/3$ for regression as starting points. Some trees are then forced to use weaker features, which makes them less alike.

Each bootstrap sample leaves out about $(1-1/n)^n\to1/e\approx36.8\%$ of the rows. Predicting each row using only the trees that did not see it gives the out-of-bag (OOB) error, a built-in validation estimate with no separate hold-out and no extra training. Forests rarely overfit by adding trees, since more trees only reduce variance, though individual deep trees still can be noisy.

## 4. Boosting

Boosting builds trees sequentially, each concentrating on what the ensemble so far gets wrong. The learners are weak (shallow) so bias is the main enemy.

AdaBoost (Freund and Schapire) keeps a weight on every training sample. After fitting a weak learner such as a depth-1 stump, it computes the weighted error $\varepsilon_m$, gives the learner a vote $\alpha_m=\tfrac12\ln\frac{1-\varepsilon_m}{\varepsilon_m}$, and multiplies the weights of misclassified samples up so the next learner focuses on them. The final prediction is the sign of the weighted vote.

Gradient boosting (Friedman) generalizes this to any differentiable loss. Start from a constant $F_0$. At step $m$, compute the negative gradient of the loss at each sample's current prediction, fit a small tree $h_m$ to those values, and update

$$
F_m(\mathbf x)=F_{m-1}(\mathbf x)+\nu\,h_m(\mathbf x),
$$

with a learning rate (shrinkage) $\nu$ around 0.01 to 0.3. For squared error the negative gradient is exactly the residual $y-F_{m-1}(\mathbf x)$, so each tree is fit to the current mistakes. For log-loss it is $y-p$. This is gradient descent in function space, with trees as the steps. Boosting can overfit if you add too many trees, so the number of rounds is tuned with a validation set and early stopping.

XGBoost (Chen and Guestrin, 2016) adds a second-order Taylor expansion of the loss, explicit regularization on leaf weights and tree size, and handling of missing values and sparse data. LightGBM (Ke et al., 2017) bins features into histograms, which makes split finding fast, and grows trees leaf-wise (always splitting the leaf with the largest gain) instead of level by level, which is faster but can overfit on small data unless the leaf count is limited. CatBoost handles categorical features specially. All three expose the same knobs: learning rate, number of trees, depth or leaves, row and column subsampling, and L1/L2 on leaf values.

## 5. Trees Versus Neural Nets on Tabular Data

On tabular data (mixed numeric and categorical columns, no spatial or sequential structure), well-tuned gradient-boosted trees remain a hard baseline to beat. Grinsztajn and colleagues (2022) benchmarked tree ensembles against neural networks on medium-sized tabular datasets and reported that trees stayed ahead, and attributed it to three properties: tabular targets are often irregular, many columns are uninformative, and the data is not rotation invariant (each column has its own meaning, while a standard MLP treats rotated feature axes as equivalent and trees do not). Trees also need little preprocessing, tolerate unscaled and heavy-tailed features, handle missing values, train in seconds on a CPU, and give feature importances.

Neural nets win when the data has structure to exploit, such as images, audio, text or graphs ([[notes/ml/convolutional-networks|Convolutional Networks]], [[notes/ml/attention-and-transformers|Attention and Transformers]]), when there is a very large amount of data, or when you need end-to-end learning of embeddings. A common practical pattern is to feed learned embeddings, or a few engineered features, into a gradient-boosted model.

> [!warning] Common mistake
> Reading impurity-based feature importance as causal or unbiased. It favors high-cardinality and continuous features and is computed on training data. Permutation importance on a held-out set is a safer default.

## Related

- [[notes/ml/generalization-and-regularization|Generalization and Regularization]]: the bias-variance view behind bagging versus boosting
- [[notes/ml/evaluation-metrics|Evaluation Metrics]]: choosing the score for imbalanced tabular problems
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]]: gradient boosting is the same descent, taken in function space
- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the baseline to compare against before using trees
- [[notes/lectures/mlp/13-xai|MLP L13: Explainable AI]]: interpreting tree models with importances and attributions
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: where classic models fit among neural ones
