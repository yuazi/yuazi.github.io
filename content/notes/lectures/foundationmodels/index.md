---
title: (y) Foundation Models
tags:
  - notes
  - foundation-models
  - llm
  - master
date: 2026-10-20
---

> [!abstract] Course Summary
> Foundation Models (Niepert, Staab and Mualem, University of Stuttgart) covers models trained once on broad data and reused for many tasks: how pretraining and adaptation produce reusable capabilities, how architectures and objectives fit text, images and actions, how to evaluate such systems honestly, and what their reliability, safety and cost look like in practice.

The material overlaps with the [[/notes/lectures/mlp/index|MPL course]] on transformers, CLIP, VAEs, GANs and diffusion; those notes go deeper on the architectures.

## Lecture Notes

- [[/notes/lectures/foundationmodels/01-introduction|(y-01) Introduction and Course Organization]]  
   What a foundation model is, pretraining signals (next token, masked, contrastive), adaptation, LLM versus VLM versus VLA, current systems, reasoning at inference time, tool-using agents, CLIP, DINOv3 and SAM 3, image and video generation, robot foundation models, applications with evidence of outcomes, societal challenges and prompt injection, plus exercises, presentations and exam eligibility.

- [[/notes/lectures/foundationmodels/02-ml-basics|(y-02) Machine Learning Basics]]  
   Training versus inference, learning signals, tensors, losses, population versus empirical risk, data splits and leakage, bias and variance, regularization, linear and logistic regression, gradient descent by hand, cross-entropy and softmax, MLPs and backpropagation, residuals and layer norm, CNNs (stride, padding, pooling, receptive fields), embeddings, a first look at self-attention, and pretraining versus adaptation.

## Assessment Map

| Component       | Weight / Gate          | Notes                                                                                                         |
| :-------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------ |
| Exercise sheets | 8 of 11 valid attempts | A genuine, clearly labeled attempt at two or more subtasks per sheet, submitted individually by Sunday 23:59. |
| Presentation    | At least 1 successful  | Random selection among submitters in your tutorial group; two strikes make you ineligible.                    |
| Final exam      | 100% of the grade      | Details on ILIAS.                                                                                             |

---

[[notes/index|(y) Back to Notes]]
