---
title: (y) Machine Learning
tags:
  - machine-learning
  - notes
date: 2026-11-05
---

Reference notes on machine learning, written to be looked up rather than read front to back. The lecture notes for [[notes/lectures/mlp/index|MPL]] and [[notes/lectures/foundationmodels/index|Foundation Models]] go deeper on single architectures; these pages are the shorter versions with worked examples.

---

## Foundations

- [[notes/ml/linear-and-logistic-regression|(y-) Linear and Logistic Regression]]: least squares, maximum likelihood and the cross-entropy loss.
- [[notes/ml/gradient-descent-and-optimizers|(y-) Gradient Descent and Optimizers]]: SGD, momentum, Adam, AdamW and learning-rate schedules.
- [[notes/ml/backpropagation|(y-) Backpropagation]]: computational graphs, reverse-mode autodiff and a two-layer network by hand.
- [[notes/ml/generalization-and-regularization|(y-) Generalization and Regularization]]: bias and variance, cross-validation, L1 and L2, dropout and early stopping.
- [[notes/ml/evaluation-metrics|(y-) Evaluation Metrics]]: precision, recall, ROC and PR curves, calibration and regression metrics.

## Classical Methods

- [[notes/ml/decision-trees-and-ensembles|(y-) Decision Trees and Ensembles]]: splits, random forests and gradient boosting for tabular data.
- [[notes/ml/clustering|(y-) Clustering (k-means, GMM, DBSCAN)]]: grouping without labels and choosing the number of clusters.
- [[notes/ml/dimensionality-reduction|(y-) Dimensionality Reduction (PCA, t-SNE, UMAP)]]: projections, neighbour embeddings and how not to misread them.

## Deep Learning

- [[notes/ml/pytorch-training-loop|(y-) The PyTorch Training Loop]]: datasets, the canonical loop, devices including Apple MPS, and the usual bugs.
- [[notes/ml/convolutional-networks|(y-) Convolutional Networks]]: weight sharing, output sizes, receptive fields and residual connections.
- [[notes/ml/attention-and-transformers|(y-) Attention and Transformers]]: scaled dot-product attention, masking, positions and the transformer block.
- [[notes/ml/embeddings|(y-) Embeddings]]: dense vectors, word2vec, contrastive learning and vector search.
- [[notes/ml/graph-neural-networks|(y-) Graph Neural Networks]]: message passing, GCN, GraphSAGE, GAT and Sudoku as a graph.
- [[notes/ml/generative-models|(y-) Generative Models (VAE, GAN, Diffusion)]]: three ways to learn a data distribution and sample from it.
- [[notes/ml/reinforcement-learning|(y-) Reinforcement Learning]]: MDPs, Bellman equations, Q-learning, policy gradients and PPO.
- [[notes/ml/fine-tuning-and-lora|(y-) Fine-Tuning and LoRA]]: adapting large models with low-rank updates instead of every weight.

---

[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
