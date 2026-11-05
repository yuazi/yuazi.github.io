---
title: "Evaluation Metrics"
tags:
  - machine-learning
  - evaluation
  - metrics
date: 2026-11-05
---

A metric turns a model's predictions into a number you can compare, and the choice of metric quietly decides what "better" means. Accuracy can look excellent on a model that never finds the rare class you care about, and a high ROC-AUC can hide a model that is useless at the precision you need. I keep this page as a checklist for matching the metric to the cost of the mistakes.

## Mental Model

- Start from the confusion matrix. Precision, recall, specificity and F1 are all ratios of its four cells.
- Threshold metrics (precision, recall, F1) describe one operating point. Ranking metrics (ROC-AUC, PR-AUC) describe the score ordering over all thresholds.
- Under heavy class imbalance, ROC-AUC is optimistic because true negatives dominate the false positive rate. PR curves track what a user of the predictions experiences.
- A model can rank well and still output badly calibrated probabilities. If you act on the probabilities, check calibration separately.
- The right metric follows from the cost of each error type, not from habit.

## 1. The Confusion Matrix

For a binary classifier with a positive class, the four outcomes are true positives (TP), false positives (FP), false negatives (FN) and true negatives (TN). The derived rates:

$$
\text{precision}=\frac{TP}{TP+FP},\quad
\text{recall (TPR)}=\frac{TP}{TP+FN},\quad
\text{FPR}=\frac{FP}{FP+TN},\quad
\text{accuracy}=\frac{TP+TN}{n}.
$$

Precision answers "of what I flagged, how much was right". Recall answers "of what was out there, how much did I find". The F1 score is their harmonic mean, $F_1=2PR/(P+R)$, which is low if either is low. The general $F_\beta$ weights recall $\beta$ times as much as precision.

> [!example] Worked example
> Screening 1000 cases, 60 of which are positive. The model finds 40 of them (TP $=40$, FN $=20$) and wrongly flags 10 of the 940 negatives (FP $=10$, TN $=930$).
> Accuracy $=970/1000=0.97$. Precision $=40/50=0.80$. Recall $=40/60=0.667$. F1 $=2(0.8)(0.667)/(0.8+0.667)=0.727$. FPR $=10/940=0.011$.
> A model that predicts "negative" for everything has accuracy $940/1000=0.94$ and recall 0, which is why 0.97 is less impressive than it sounds.

For more than two classes, compute per-class metrics and average them. Macro averaging weights every class equally and so exposes failures on rare classes. Micro averaging pools all decisions, so it follows the frequent classes (for single-label problems, micro-averaged F1 equals accuracy).

## 2. Thresholds, ROC and PR Curves

Most models output a score, and the class label comes from a threshold. Sweeping the threshold traces two curves. The ROC curve plots TPR against FPR, and the area under it (ROC-AUC) equals the probability that a random positive gets a higher score than a random negative. It is 0.5 for random scores and 1 for a perfect ranking. The PR curve plots precision against recall, and its area is estimated as average precision (AP). The baseline for PR is the positive rate, not 0.5.

### Why They Disagree Under Imbalance

FPR divides false positives by the number of negatives. When negatives outnumber positives 99 to 1, a thousand false positives can still be a tiny FPR, so the ROC curve barely moves. Precision divides by the number of flagged items, so the same thousand false positives swamp the true positives and precision collapses.

The experiment below uses the same score model both times (positives drawn from $\mathcal N(1.5,1)$, negatives from $\mathcal N(0,1)$), a threshold of 1.25, 10 000 samples, and changes only the class balance.

```python
import numpy as np

def roc_auc(y, s):                                      # rank-based (Mann-Whitney)
    r = np.argsort(np.argsort(s)) + 1
    n1 = y.sum(); n0 = len(y) - n1
    return (r[y == 1].sum() - n1 * (n1 + 1) / 2) / (n1 * n0)

def avg_precision(y, s):
    o = np.argsort(-s); y = y[o]
    tp = np.cumsum(y); prec = tp / np.arange(1, len(y) + 1)
    return (prec * y).sum() / y.sum()

rng = np.random.default_rng(0)
for n_pos in [5000, 100]:
    n_neg = 10000 - n_pos
    y = np.r_[np.ones(n_pos), np.zeros(n_neg)]
    s = np.r_[rng.normal(1.5, 1, n_pos), rng.normal(0, 1, n_neg)]   # same score model both times
    t = 1.5 / 2 + 0.5                                                # a fixed threshold
    pred = s > t
    tp = (pred & (y == 1)).sum(); fp = (pred & (y == 0)).sum()
    print(f"pos={n_pos:5d} ROC-AUC={roc_auc(y, s):.3f} AP={avg_precision(y, s):.3f} "
          f"TP={tp} FP={fp} precision={tp/(tp+fp):.3f} recall={tp/n_pos:.3f}")
```

Running it prints:

| Positives  | ROC-AUC | AP    | TP   | FP   | Precision | Recall |
| ---------- | ------- | ----- | ---- | ---- | --------- | ------ |
| 5000 (50%) | 0.853   | 0.852 | 2937 | 512  | 0.852     | 0.587  |
| 100 (1%)   | 0.841   | 0.089 | 57   | 1027 | 0.053     | 0.570  |

ROC-AUC moves from 0.853 to 0.841, barely changed, because the score distributions are identical. AP falls from 0.852 to 0.089, and at the fixed threshold the precision drops from 0.85 to 0.05: roughly 19 of every 20 flagged cases are false alarms. The model did not get worse; the base rate changed. Analytic check: with these Gaussians TPR at 1.25 is $\Phi(0.25)\approx0.60$ and FPR is $1-\Phi(1.25)\approx0.106$, which at 1% prevalence gives precision near $0.006/(0.006+0.105)\approx0.054$.

So ROC-AUC is a fair summary of ranking quality independent of prevalence, and PR-AUC is the better view of usefulness when positives are rare and you care about the positive class.

## 3. Calibration

A model is calibrated if, among predictions of "0.7", about 70% are actually positive. Ranking metrics ignore this, since any monotone transform of the score leaves AUC unchanged. If you use probabilities for decisions (expected cost, risk thresholds, combining models), you need calibration.

A reliability diagram bins predictions and plots the observed positive rate in each bin against the mean predicted probability, with the diagonal being perfect. Expected calibration error (ECE) summarizes the gap as a weighted average over bins. The Brier score, the mean of $(p_i-y_i)^2$, is a proper scoring rule that rewards both calibration and sharpness. Log-loss is another. Fixes use a held-out set: Platt scaling (a logistic fit on the scores), isotonic regression, or temperature scaling for neural networks (Guo and colleagues, 2017, found modern deep nets are often overconfident, and a single temperature parameter repairs much of it). Logistic regression is often reasonably calibrated out of the box ([[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]). Random forests and boosted trees often are not.

## 4. Regression Metrics

For targets $y_i$ and predictions $\hat y_i$:

$$
\text{MAE}=\frac1n\sum\lvert y_i-\hat y_i\rvert,\quad
\text{RMSE}=\sqrt{\frac1n\sum(y_i-\hat y_i)^2},\quad
R^2=1-\frac{\sum(y_i-\hat y_i)^2}{\sum(y_i-\bar y)^2}.
$$

MAE is in the target's units, less sensitive to outliers, and corresponds to predicting the median. RMSE is also in target units but squares errors first, so large misses count much more, and it corresponds to predicting the mean. $R^2$ compares against the trivial model that always predicts $\bar y$: 1 is perfect, 0 matches the mean, and it can go negative on held-out data.

> [!example] Worked example
> Targets $(3,5,2,8)$, predictions $(2.5,5,4,7)$. Errors: $-0.5,0,2,-1$. MAE $=3.5/4=0.875$. MSE $=(0.25+0+4+1)/4=1.3125$, RMSE $=1.146$. The mean target is 4.5, so the total sum of squares is $2.25+0.25+6.25+12.25=21$ and the residual sum is $5.25$, giving $R^2=1-5.25/21=0.75$. One miss of 2 contributes 76% of the squared error but only 57% of the absolute error, which shows how RMSE punishes outliers.

Percentage errors (MAPE) explode near zero targets. For skewed positive targets, consider errors on the log scale.

## 5. Ranking Metrics

When the output is an ordered list (search, recommendation), the unit of evaluation is the list. Precision@$k$ and recall@$k$ look at the top $k$. Mean reciprocal rank (MRR) averages $1/\text{rank}$ of the first relevant item. Mean average precision averages AP across queries. NDCG handles graded relevance by discounting gains with a logarithm of the position, $\text{DCG}=\sum_i \text{rel}_i/\log_2(i+1)$, and normalizing by the best possible ordering so scores lie in $[0,1]$.

## 6. Choosing a Metric

| Problem                                  | Reasonable primary metric                | Watch out for                              |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| Balanced multi-class                     | accuracy or macro-F1                     | classes that are balanced only on paper    |
| Rare event, a human reviews alerts       | PR-AUC, precision at a fixed recall      | ROC-AUC looking great                      |
| Missing a positive is costly (screening) | recall at an acceptable precision, $F_2$ | threshold chosen on the test set           |
| Probabilities drive decisions            | log-loss, Brier, ECE                     | good AUC with poor calibration             |
| Regression, outliers matter              | RMSE                                     | one bad point dominating                   |
| Regression, outlier-tolerant summary     | MAE or median absolute error             | hiding rare big misses                     |
| Search and recommendation                | NDCG, MRR, recall@k                      | metric on a biased click log               |
| Clustering with no labels                | silhouette, stability                    | scores that favor the algorithm's own bias |

Pick the metric before training, compute it on held-out data ([[notes/ml/generalization-and-regularization|Generalization and Regularization]]), and report a spread (cross-validation or bootstrap), not a single decimal.

## Related

- [[notes/ml/linear-and-logistic-regression|Linear and Logistic Regression]]: the probabilities and thresholds being evaluated
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]]: how to hold out data so the metric is honest
- [[notes/ml/decision-trees-and-ensembles|Decision Trees and Ensembles]]: models whose probabilities often need calibration
- [[notes/ml/clustering|Clustering (k-means, GMM, DBSCAN)]]: silhouette and other unsupervised scores
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]]: computing validation metrics inside the loop
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models L02: ML Basics]]: cross-entropy as both a loss and a metric
