---
title: "L07 - Classification"
tags:
  - dsbd
  - data-science
  - classification
  - confusion-matrix
  - roc-auc
  - decision-trees
  - random-forest
  - svm
  - logistic-regression
  - naive-bayes
date: 2026-11-02
---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/06-outlier-analysis|Previous: (y-06) Outlier Analysis]]

## Mental Model First

- Classification learns a model that assigns objects to known classes, so it can predict the class of new objects whose label is unknown. In practice you train several methods and variants in parallel and keep the ones with the best validation and test results.
- Every performance metric comes from the confusion matrix of true and false positives and negatives. Which metric matters depends on the use case: missing a fraud case and flagging an honest customer have different costs. The MCC uses all four cells and suits imbalanced data.
- A classifier that outputs probabilities needs a decision threshold. Sweeping the threshold from 1 to 0 traces the ROC curve, and the area under it (AUC) summarizes the classifier across all thresholds: 1 is perfect, 0.5 is guessing.
- The methods trade accuracy against interpretability. k-NN has no training phase, trees are easy to explain but overfit, forests and boosted trees are accurate but opaque, SVMs separate classes with a maximal margin and kernels, logistic regression returns interpretable probabilities and odds, and naive Bayes scales to many attributes such as words in a text.

## 1. Classification

![[pictures/datasciencebusinessdata/07/Lecture07_Pg003_Classification.png]]

<p class="image-caption">Han and Kamber's definition of classification and typical business applications.</p>

Han and Kamber (2006, p. 24) define classification as "the process of finding a model (or function) that describes and distinguishes data classes or concepts", so that the model can predict the class of objects whose class label is unknown.

Business applications include customer classification in marketing, product classification in sales, fraud detection in finance, finding the factors that affect quality in complex production processes, classifying faults and damaged parts in production, classifying process flows in process analysis, identifying image content and determining the emotional content of a text (sad, angry and so on).

### Methods

![[pictures/datasciencebusinessdata/07/Lecture07_Pg004_Classification_Methods.png]]

<p class="image-caption">The classification methods of the chapter. Several are usually trained in parallel.</p>

The chapter covers k-nearest neighbors, classification trees and forests, support vector machines, logistic regression and Bayesian classifiers. Artificial neural networks get their own chapter.

The common approach is to apply several methods and method variants in parallel, then keep the ones with the best results during validation and testing, measured by classification quality and computational performance.

## 2. Performance Metrics

### The Confusion Matrix

![[pictures/datasciencebusinessdata/07/Lecture07_Pg005_Performance_Metrics_Confusion_Matrix.png]]

<p class="image-caption">The confusion matrix of a binary classifier. False positives are type I (alpha) errors, false negatives type II (beta) errors.</p>

For a binary classifier (an object is in the class or not), the confusion matrix crosses actual and predicted classes:

|                 | Predicted positive         | Predicted negative         |
| :-------------- | :------------------------- | :------------------------- |
| Actual positive | TP                         | FN (type II or beta error) |
| Actual negative | FP (type I or alpha error) | TN                         |

$P = TP + FN$ is the number of actual positives and $N = FP + TN$ the number of actual negatives. All metrics below are built from these four cells.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg006_Performance_Metrics_Example.png]]

<p class="image-caption">Example: a classifier for high-risk customers with TP = 6, FN = 1, FP = 2 and TN = 4.</p>

The running example is a classifier that identifies high-risk customers. Of 7 actual high-risk customers it finds 6 (TP = 6, FN = 1). Of 6 customers without risk it flags 2 by mistake (FP = 2, TN = 4). Which metric is suitable depends heavily on the use case.

### Metrics from the Confusion Matrix

![[pictures/datasciencebusinessdata/07/Lecture07_Pg007_Performance_Metrics_Accuracy_Recall_Precision.png]]

<p class="image-caption">Accuracy, recall, precision, specificity and inverse precision, computed for the high-risk example.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg008_Performance_Metrics_Fallout_F_Score_Mcc.png]]

<p class="image-caption">Fallout, miss rate, F-score and the Matthews correlation coefficient for the same example.</p>

| Metric                                          | Formula                           | Example      |
| :---------------------------------------------- | :-------------------------------- | :----------- |
| Accuracy                                        | $(TP + TN) / (TP + FN + FP + TN)$ | 10/13 = 0.77 |
| Recall, sensitivity, true positive rate (TPR)   | $TP / P = TP / (TP + FN)$         | 6/7 = 0.86   |
| Precision, confidence, true positive accuracy   | $TP / (TP + FP)$                  | 6/8 = 0.75   |
| Specificity, inverse recall, true negative rate | $TN / N = TN / (FP + TN)$         | 4/6 = 0.67   |
| Inverse precision, true negative accuracy       | $TN / (TN + FN)$                  | 4/5 = 0.8    |
| Fallout, false positive rate (FPR)              | $FP / N = FP / (FP + TN)$         | 2/6 = 0.33   |
| Miss rate, false negative rate (FNR)            | $FN / P = FN / (FN + TP)$         | 1/7 = 0.14   |

The F-score (F-factor) is the harmonic mean of recall and precision:

$$
F = \frac{2}{\frac{1}{\text{Recall}} + \frac{1}{\text{Precision}}} = 2 \cdot \frac{\text{Recall} \cdot \text{Precision}}{\text{Recall} + \text{Precision}} = 2 \cdot \frac{\frac{6}{7} \cdot \frac{3}{4}}{\frac{6}{7} + \frac{3}{4}} = 0.8.
$$

The Matthews correlation coefficient (MCC) is the correlation between actual and predicted values:

$$
\text{MCC} = \frac{TP \cdot TN - FP \cdot FN}{\sqrt{(TP + FP)(TP + FN)(TN + FP)(TN + FN)}} = \frac{6 \cdot 4 - 2 \cdot 1}{\sqrt{8 \cdot 7 \cdot 6 \cdot 5}} \approx 0.54.
$$

It ranges from −1 (predictions are the exact opposite of the actual classes) through 0 (no better than random) to 1 (perfect). Because it uses all four cells, the MCC is particularly suitable for imbalanced data, where one class occurs very rarely or almost always.

### The ROC Curve

![[pictures/datasciencebusinessdata/07/Lecture07_Pg009_The_Roc_Curve.png]]

<p class="image-caption">The ROC curve plots TPR against FPR while the decision threshold moves from maximally strict to maximally permissive.</p>

The Receiver Operating Characteristic comes from friend-or-foe detection in World War II. It starts from a classifier that outputs a probability of class membership:

1. A decision threshold (cut-off point) sets the minimum probability at which a data point is assigned to the class.
2. The threshold is adjusted step by step, from maximally strict (no data point is assigned to the class) to maximally permissive (all data points are).
3. For each threshold, compute TPR and FPR and plot the pair. The points form the ROC curve.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg010_Roc_Curve_Example_Table.png]]

<p class="image-caption">Thirteen customers sorted by predicted probability of being high risk. At threshold 0.5, TPR = 0.86 and FPR = 0.33.</p>

| Customer    | P(high risk) | High risk? | At threshold 0.5 |
| :---------- | :----------- | :--------- | :--------------- |
| Darth       | 0.98         | yes        | TP               |
| Kermit      | 0.95         | yes        | TP               |
| Lola666     | 0.95         | yes        | TP               |
| Asdfasdf    | 0.90         | yes        | TP               |
| Tom         | 0.80         | no         | FP               |
| Sahra55     | 0.70         | yes        | TP               |
| Mobi12      | 0.60         | no         | FP               |
| KevinStrong | 0.50         | yes        | TP               |
| Rupert      | 0.40         | no         | TN               |
| Jonas1967   | 0.40         | yes        | FN               |
| Floh        | 0.30         | no         | TN               |
| Hans        | 0.20         | no         | TN               |
| BieneMaja   | 0.10         | no         | TN               |

At threshold 0.5 the table reproduces the confusion matrix from the example: TPR = 6/7 = 0.86 and FPR = 2/6 = 0.33. Lowering the threshold from 1 to 0 moves the cut line down the table one customer at a time.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg011_Roc_Curve_Fraud_Detection.png]]

<p class="image-caption">The resulting ROC curve, with the point for threshold 0.5 at FPR 0.33 and TPR 0.86.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg012_Area_Under_The_Roc_Curve.png]]

<p class="image-caption">Area under the ROC curve: the ideal curve is a rectangle through (0,1), random prediction is the diagonal.</p>

- The maximally strict threshold classifies every point as negative, which gives the point (0, 0): no positives found and no negatives falsely assigned.
- The maximally permissive threshold classifies every point as positive, which gives (1, 1): all positives found, but all negatives falsely flagged.
- An ideal classifier runs through (0, 0), (0, 1) and (1, 1). The worst case is the diagonal from (0, 0) to (1, 1), which is random prediction.

The larger the area under the curve, the better. The area under the ROC curve (AUC or AROC) is therefore a performance metric between 0.5 (random) and 1 (perfect).

![[pictures/datasciencebusinessdata/07/Lecture07_Pg013_Auc_3d_Printing_Example.png]]

<p class="image-caption">Predicting defects in 3D printing (Lutz, Sultanic and Thai 2017): random forest 99.96%, SVM 94.18%, neural network 87.84% AUC.</p>

In a study on predicting defects in 3D printing processes (Lutz, Sultanic and Thai 2017), a random forest reached an AUC of 99.96%, a support vector machine 94.18% and a neural network 87.84%.

## 3. k-Nearest Neighbors

![[pictures/datasciencebusinessdata/07/Lecture07_Pg014_K_Nearest_Neighbors.png]]

<p class="image-caption">k-NN compares a data point with its k nearest neighbors and adopts their most frequent class.</p>

k-NN compares a new data point with its k nearest neighbors in the training data and assigns their most frequent class. The method is very simple and efficient. It builds no model during training, so it is not machine learning in the strict sense and is called a lazy classifier.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg015_Nearest_Neighbor_Premium_Customers.png]]

<p class="image-caption">5-NN on visit frequency and forum posts: which of four new customers are potential premium customers?</p>

The example classifies four new customers as potential premium customers based on visit frequency per week and number of forum posts, using the 5 nearest neighbors:

| New customer (visits / posts) | Neighbors: premium / not | Classified as |
| :---------------------------- | :----------------------- | :------------ |
| (20 / 18)                     | 5 / 0                    | premium       |
| (31 / 3)                      | 3 / 2                    | premium       |
| (3 / 5)                       | 2 / 2                    | not premium   |
| (0 / 15)                      | 0 / 5                    | not premium   |

The slide counts only four neighbors for (3 / 5). With five neighbors and two classes a vote cannot tie, so the fifth neighbor would decide; the slide's answer implies it is not a premium customer.

## 4. Classification Trees and Forests

![[pictures/datasciencebusinessdata/07/Lecture07_Pg016_Classification_Trees.png]]

<p class="image-caption">Classification trees: chained if-then rules from the root to a leaf, with variants for regression and outlier detection.</p>

A classification tree arranges classification rules in a tree:

- Attributes are ordered hierarchically by their relevance for the class assignment.
- Each path from the root to a leaf is a decision rule made of chained if-then statements, and each leaf is a classification decision.
- Regression trees predict values (for example a mean) or value ranges instead of a class. A model tree puts regression models in the leaves.
- Isolation trees and isolation forests use trees for outlier detection: isolated data points have short paths from the root (see [[/notes/lectures/datasciencebusinessdata/06-outlier-analysis|L06]]).
- Humans can define trees by hand, but they are usually learned from data.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg017_Classification_Tree_Motif_Example.png]]

<p class="image-caption">A tree predicting which motif customers of an online shop for nerd products choose. The bars show class proportions in each leaf.</p>

The example predicts the motif a customer of an online shop for nerd products will choose (science fiction, games, fantasy, maths, physics or superheroes) from attributes such as age, how urban the customer's area is, sex and preferred fit. The bars in each leaf show the class proportions among the training data in that leaf.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg018_Trees_And_Overfitting.png]]

<p class="image-caption">The confusion matrix of the motif tree. Reality can rarely be captured perfectly, and a model that does is often overfitted.</p>

Reality can rarely be captured perfectly in a model, and a model that seems to do so is often overfitted.

### Learning a Tree

![[pictures/datasciencebusinessdata/07/Lecture07_Pg019_Machine_Learning_Construction_Of_Trees.png]]

<p class="image-caption">A tree is grown by repeatedly choosing the split that leaves the most homogeneous parts.</p>

1. Find the attribute (and value) that splits the training data into the most homogeneous parts. An impurity criterion such as the Gini index or information gain measures homogeneity: choose the partition whose summed impurity, weighted by the size of each subtree, is minimal.
2. Repeat the split for each subtree.
3. This tends to overfit (overlearning): the model follows the training data too closely and does not generalize. The remedy is pruning.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg020_Tree_Splits.png]]

<p class="image-caption">Two splits on the motif data. Split 2 on urbanization leaves one group that is mostly science fiction.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg021_Pruning.png]]

<p class="image-caption">Pruning the title split: three leaves that fit 9,105 rows become one science fiction leaf.</p>

In the pruning example, a split on academic title below "female" produces three leaves for 9,105 training rows: Dr (science fiction, correct for 14 of 16 rows), Prof (physics, correct for 2 of 2) and no title (science fiction, correct for 8,087 of 9,087). Pruning replaces the subtree with a single science fiction leaf that is correct for 8,101 of 9,105 rows. Pruning costs two correctly classified training rows and removes rules that only covered 18 rows.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg022_Tree_Method_Variants.png]]

<p class="image-caption">Tree methods differ in scales, prediction type, impurity measure, pruning, backtracking, missing values and tree shape.</p>

Tree methods come in many variants. They differ mainly in:

- the attribute scales they accept (only nominal, or metric as well),
- the type of prediction (classification only, or also regression, isolation or model trees),
- the impurity measure,
- whether and how they prune,
- backtracking (adjusting earlier splits),
- how they handle missing values,
- the shape of the trees (only binary trees with exactly two subtrees per node, or several branches per node).

### Forests

![[pictures/datasciencebusinessdata/07/Lecture07_Pg023_Forests_Bagging_Boosting.png]]

<p class="image-caption">Forests grow many trees and combine their results. Bagging and boosting are general strategies, not limited to trees.</p>

Forests grow a large number of trees and combine their results, which makes them more robust and less prone to overlearning.

- Random forests draw many samples from the training data (bagging) and pick a random subset of attributes to consider at each split. The forest's result is the majority vote of its trees.
- Boosted trees and gradient boosted trees grow many very simple trees (stumps) as base classifiers. Step by step they add the next best subtree, with previously misclassified training data weighted higher.

Bagging and boosting work for other base models as well. The downside of forests: they are more complex and less intuitive than a single decision tree.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg024_Random_Forest_Majority_Vote.png]]

<p class="image-caption">Bagging: statistical sampling, one model per sample, and a majority vote over their results (payer or non-payer).</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg025_Random_Forest_Motif_Example.png]]

<p class="image-caption">A random forest with 8 trees for the motif example. Not quite as intuitive as a single tree.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg026_Trees_And_Forests_Conclusion.png]]

<p class="image-caption">Trees and forests: advantages and disadvantages.</p>

| Advantages                                               | Disadvantages                                                 |
| :------------------------------------------------------- | :------------------------------------------------------------ |
| Established method                                       | Single trees tend to overfit and follow the training data     |
| Basic principle is clear and easy to communicate         | Forests, especially boosted trees, cost much more computation |
| Good results, very good with random forests and boosting | Forests are no longer intuitive                               |

## 5. Support Vector Machines

![[pictures/datasciencebusinessdata/07/Lecture07_Pg027_Support_Vector_Machines.png]]

<p class="image-caption">SVMs separate classes with the hyperplane that has the widest margin, allow some errors, and use kernels when no linear separation exists.</p>

An SVM separates data points geometrically. It looks for the decision line (plane, or hyperplane in higher dimensions) that maximizes the distance, the margin, to the data points of the two classes. The wider the margin, the more reliable the separation. The data points closest to the hyperplane are the support vectors.

Real data is not always cleanly separable:

- The C value allows some misclassified data points. It adjusts how sensitive the SVM is to points near the decision boundary and how the two margins are weighted.
- If the data is fundamentally not linearly separable, a kernel function maps it into a higher-dimensional space where a linear separation exists.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg028_Svm_Fake_News_Example.png]]

<p class="image-caption">An SVM for fake news, using machine-detected spelling mistakes and the number of shares within 10 minutes. A soft margin tolerates some errors.</p>

The fake news example separates messages by two criteria: the number of machine-detected spelling mistakes and the number of people the message was shared with within 10 minutes. The SVM tolerates a few modeling errors to keep the margin wide (soft margin).

![[pictures/datasciencebusinessdata/07/Lecture07_Pg029_Svm_Radial_Kernel.png]]

<p class="image-caption">Without linear separability: a radial kernel separates a compact cluster from the points around it.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg030_Svm_Marathon_Example.png]]

<p class="image-caption">The marathon example in scikit-learn with a radial kernel: buyers and non-buyers by age and marathon time.</p>

The marathon example, computed with scikit-learn, uses a radial kernel to separate buyers from non-buyers by age and marathon performance in minutes. The plot marks training data, correctly classified test data and misclassified test points.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg031_Svm_Kernel_Selection.png]]

<p class="image-caption">Kernel selection in RapidMiner: dot, radial, polynomial, neural, anova, Epanechnikov and others.</p>

Which kernel works best is found by trying them out. RapidMiner, for example, offers dot, radial, polynomial, neural, anova, Epanechnikov, Gaussian combination and multiquadric kernels.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg032_Svm_Conclusion.png]]

<p class="image-caption">SVMs: advantages and disadvantages.</p>

| Advantages                         | Disadvantages                          |
| :--------------------------------- | :------------------------------------- |
| Well established in many use cases | Computationally intensive              |
| Very robust, even with noise       | Hard to interpret with many dimensions |
| Not prone to overlearning          |                                        |

## 6. Logistic Regression

![[pictures/datasciencebusinessdata/07/Lecture07_Pg033_Logistic_Regression.png]]

<p class="image-caption">Logistic regression predicts the probability of class membership with the sigmoid function.</p>

Logistic regression uses a regression method for classification. Linear regression does not fit class labels (0 or 1): several of its mathematical assumptions are violated, and its predictions can become arbitrarily large or small. Logistic regression predicts the probability of class membership instead, using the logistic (sigmoid) function

$$
y = \frac{1}{1 + e^{-x}},
$$

where $x$ is a linear combination of the independent attributes. Depending on the parameters, the function rises from 0 to 1 more or less abruptly. The parameters are estimated with a regression procedure such as maximum likelihood.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg034_Logistic_Regression_Maintenance_Example.png]]

<p class="image-caption">Maintenance need against machine hours, with the fitted logistic curve and a threshold at p = 0.5.</p>

The example predicts whether a machine needs maintenance from its runtime in hours:

$$
y = \frac{1}{1 + e^{8.87 - 0.003 \cdot \text{machine runtime}}}.
$$

A threshold such as $p = 0.5$ turns the probability into a class.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg035_Logistic_Regression_Multiple_Attributes.png]]

<p class="image-caption">Logistic regression with two attributes is a surface. From three attributes on it becomes hard to visualize.</p>

The method works with more than one attribute as well. With two attributes the result is a surface; with three or more it becomes hard to visualize.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg036_Logistic_Regression_Parameter_Interpretation.png]]

<p class="image-caption">Interpreting the parameters through log-odds: each machine hour multiplies the odds by e^0.003.</p>

The logistic function is the inverse of the logit, the natural logarithm of the odds (the probability divided by its complementary probability). In the example:

- The parameter 0.003 is positive, so the probability of belonging to the failure class rises with machine runtime.
- $e^{0.003} \approx 1.003$: the odds grow by a factor of 1.003 for each additional machine hour.
- For each additional 500 machine hours, the odds grow by a factor of $e^{0.003 \cdot 500} = e^{1.5} \approx 4.48$.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg037_Logistic_Regression_Conclusion.png]]

<p class="image-caption">Logistic regression: advantages and disadvantages.</p>

| Advantages                                                            | Disadvantages                                                                                   |
| :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| Commonly used                                                         | Needs extensive preprocessing: cleaning outliers, adjusting for dependencies between attributes |
| Good interpretability of the result (a probability)                   |                                                                                                 |
| The approach reappears in standard building blocks of neural networks |                                                                                                 |

## 7. Bayes Classifiers

![[pictures/datasciencebusinessdata/07/Lecture07_Pg038_Bayes_Classifiers.png]]

<p class="image-caption">Bayes classifiers compute the probability of class membership from prior knowledge with Bayes' theorem.</p>

Bayes classifiers also determine the probability of class membership. They use prior knowledge of relative probabilities, which can be estimated from the class distribution of the training data, and compute the result with Bayes' theorem. Naive Bayes classifiers are the most common variant: they assume that each explanatory attribute influences the class independently. That makes them suitable for problems with very many attributes, such as text analysis.

Typical applications are classifying help-desk tickets, complaints, damage reports or customer feedback, spam detection, and identifying hate speech or misinformation on social networks.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg039_Bayes_Theorem.png]]

<p class="image-caption">Bayes' theorem: posterior, likelihood, prior and evidence.</p>

$$
P(K \mid F) = \frac{P(F \mid K) \cdot P(K)}{P(F)}
$$

| Term          | Meaning                                                     | Name                     |
| :------------ | :---------------------------------------------------------- | :----------------------- |
| $P(K \mid F)$ | Probability of class $K$ given that feature $F$ is observed | a posteriori probability |
| $P(F \mid K)$ | Probability of observing feature $F$ given class $K$        | likelihood               |
| $P(K)$        | Probability of class $K$                                    | prior                    |
| $P(F)$        | Probability of feature $F$                                  | evidence                 |

![[pictures/datasciencebusinessdata/07/Lecture07_Pg040_Bayes_Classifiers_Example.png]]

<p class="image-caption">Spam example: 8% of all mails are spam, 20% of spam and 0.43% of non-spam mentions weight loss.</p>

![[pictures/datasciencebusinessdata/07/Lecture07_Pg041_Bayes_Spam_Example.png]]

<p class="image-caption">From P(weight loss | spam) to P(spam | weight loss): a new mail with "weight loss" in the subject is spam with probability 80%.</p>

The spam example starts from what is known:

- 8% of all mails are spam: $P(\text{spam}) = 0.08$, so $P(\text{no spam}) = 0.92$.
- 20% of spam mails have "weight loss" in the subject: $P(\text{wl} \mid \text{spam}) = 0.2$.
- 0.43% of non-spam mails do: $P(\text{wl} \mid \text{no spam}) = 0.0043$.

Bayes' theorem gives the probability that a new mail with "weight loss" in the subject is spam:

$$
P(\text{spam} \mid \text{wl}) = \frac{0.2 \cdot 0.08}{0.2 \cdot 0.08 + 0.0043 \cdot 0.92} = \frac{0.016}{0.019956} \approx 0.80.
$$

So $P(\text{no spam} \mid \text{wl}) \approx 0.20$, and the new mail is four times more likely to be spam than not.

![[pictures/datasciencebusinessdata/07/Lecture07_Pg042_Bayes_Classifiers_Evaluation.png]]

<p class="image-caption">Naive Bayes scales well and often works surprisingly well, but fails with strong dependencies between features.</p>

- Naive Bayes scales very well and often works surprisingly well, even when the independence assumption only roughly holds.
- It fails when features really are strongly dependent.
- It does not understand semantics. Large language models do, but at much higher computational cost.
- It is therefore unsuitable for strong processual dependencies: it can analyze process outcomes, but not process structures.

## Summary

Classification predicts known class labels for new objects. Evaluate classifiers through the confusion matrix and pick the metric the use case needs: recall when misses are expensive, precision when false alarms are, MCC for imbalanced classes, and ROC and AUC when you want to compare classifiers across all thresholds. k-NN needs no training, trees are transparent but overfit until pruned, forests and boosting are accurate but opaque, SVMs maximize the margin and use kernels for non-linear boundaries, logistic regression gives probabilities with interpretable odds, and naive Bayes scales to many independent features such as words.

## Self-Check

1. For TP = 6, FN = 1, FP = 2 and TN = 4, compute accuracy, recall, precision and specificity.

> [!success]- Answer
> Accuracy = (6 + 4) / 13 = 0.77. Recall = 6 / 7 = 0.86. Precision = 6 / (6 + 2) = 0.75. Specificity = 4 / (2 + 4) = 0.67.

2. Compute the F-score and the MCC for the same matrix.

> [!success]- Answer
> F = 2 · (0.857 · 0.75) / (0.857 + 0.75) = 0.8. MCC = (6 · 4 − 2 · 1) / √(8 · 7 · 6 · 5) = 22 / √1680 ≈ 0.54.

3. Only 1% of transactions are fraud. A model always predicts "no fraud". What are its accuracy, recall and MCC, and what does this show?

> [!success]- Answer
> Accuracy is 99%, but recall is 0 because the model finds no fraud case. TP and FP are both 0, so the MCC's denominator is 0 and the MCC is set to 0 by convention: no better than random. On imbalanced data, accuracy looks good for a useless model, which is why the lecture recommends the MCC for such cases.

4. Which points does every ROC curve pass through, and what AUC does random guessing give?

> [!success]- Answer
> The maximally strict threshold gives (0, 0), since nothing is classified as positive, and the maximally permissive threshold gives (1, 1), since everything is. Random guessing lies on the diagonal between them, with an AUC of 0.5. A perfect classifier passes through (0, 1) and has an AUC of 1.

5. Why is k-NN called a lazy classifier?

> [!success]- Answer
> It builds no model in a training phase. It stores the training data and only computes distances when a new point has to be classified, then adopts the most frequent class among the k nearest neighbors. For that reason it is not machine learning in the strict sense.

6. How is a classification tree grown, and why does it need pruning?

> [!success]- Answer
> At each node, choose the attribute and split value that leave the most homogeneous parts, measured by an impurity criterion such as the Gini index or information gain, weighted by subtree size. Repeat for each subtree. Grown fully, the tree follows the training data too closely and overfits. Pruning cuts back subtrees whose rules only fit a few rows, like the title split in the example, whose Dr and Prof leaves covered 18 of its 9,105 rows.

7. In the pruning example, how many training rows were classified correctly before and after pruning?

> [!success]- Answer
> Before: 14 (Dr) + 2 (Prof) + 8,087 (no title) = 8,103 of 9,105. After, with one science fiction leaf: 14 + 0 + 8,087 = 8,101 of 9,105. Pruning gives up two correct training rows for a simpler tree that should generalize better.

8. What is the difference between bagging and boosting?

> [!success]- Answer
> Bagging trains many models on random samples of the training data in parallel and combines them by majority vote. Random forests add a random choice of attributes at each split. Boosting builds models one after another from very simple base classifiers (stumps), weighting the training points the previous models misclassified more heavily.

9. What are support vectors, and what do the C value and a kernel do?

> [!success]- Answer
> Support vectors are the data points closest to the separating hyperplane; they define the margin. The C value controls how many misclassifications the SVM tolerates to keep a wide margin (soft margin). A kernel maps data that is not linearly separable into a higher-dimensional space where a linear separation exists, for example a radial kernel for a compact cluster surrounded by the other class.

10. In the maintenance model $y = 1 / (1 + e^{8.87 - 0.003 t})$, at what runtime $t$ is the probability 0.5, and by how much do the odds change per 500 hours?

> [!success]- Answer
> $y = 0.5$ when the exponent is 0: $t = 8.87 / 0.003 \approx 2{,}957$ machine hours. The odds grow by $e^{0.003 \cdot 500} = e^{1.5} \approx 4.48$ per 500 hours.

11. With $P(\text{spam}) = 0.08$, $P(\text{wl} \mid \text{spam}) = 0.2$ and $P(\text{wl} \mid \text{no spam}) = 0.0043$, how likely is a mail with "weight loss" in the subject to be spam?

> [!success]- Answer
> $P(\text{spam} \mid \text{wl}) = (0.2 \cdot 0.08) / (0.2 \cdot 0.08 + 0.0043 \cdot 0.92) = 0.016 / 0.019956 \approx 0.80$. The mail is spam with probability 80%, four times as likely as not.

12. Why is naive Bayes good for text classification but unsuitable for analyzing process structures?

> [!success]- Answer
> It assumes each feature influences the class independently, which keeps it cheap with thousands of word features and often works well even when the assumption only roughly holds. Process structures consist of strong dependencies between steps, which the assumption ignores, so naive Bayes can classify process outcomes but not the structure of a process.

---

[[/notes/lectures/datasciencebusinessdata/index|Back to DSfBD Index]] | [[/notes/lectures/datasciencebusinessdata/06-outlier-analysis|Previous: (y-06) Outlier Analysis]]
