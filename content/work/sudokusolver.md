---
title: "Solving Sudoku with GNNs"
tags:
  - work
  - projects
  - python
  - pytorch
  - gnn
  - ai
date: 2026-03-11
github: https://github.com/yuazi/sudoku_solver
---

[View on GitHub](https://github.com/yuazi/sudoku_solver)

**Sudoku Solver** is a PyTorch experiment that models Sudoku boards as graphs and trains a graph neural network to predict digits through message passing. A command-line solver wraps the model. It validates the puzzle, can plot the board step by step, and falls back to exact backtracking when the network's answer isn't a valid solution.

---

## What It Demonstrates

- Graph construction for 9x9 Sudoku boards with 81 nodes and 1,620 directed constraint edges.
- A message-passing GNN with shared MLP messages, summed aggregation, GRU updates, and per-cell digit logits.
- A loss on every message-passing iteration, so the intermediate predictions are trained along with the final one.
- CLI validation before model loading, including length checks, invalid characters, contradictory givens, and clue preservation.
- Matplotlib views of the predicted solution and of each iteration (`--plot`, `--steps`).
- Unit tests for validation behavior, clue preservation, solution checking, and CLI errors, run in GitHub Actions CI.

---

## Graph Representation

Each Sudoku cell is a node. Two nodes are connected when they share a row, column, or 3x3 box. That lets the model propagate constraints between related cells through message passing.

| Concept | Value                              |
| ------- | ---------------------------------- |
| Nodes   | `81` cells                         |
| Edges   | `1,620` directed constraint edges  |
| Input   | digit index, where `0` means empty |
| Output  | logits for digits `1` through `9`  |

---

## Solver Flow

1. Normalize the puzzle string so `.` becomes `0`.
2. Reject invalid puzzles before loading model weights.
3. Run the trained GNN for `n_iters` message-passing steps.
4. Preserve all fixed givens in the final prediction.
5. Validate rows, columns, boxes, and givens.
6. If the neural output is invalid, attempt exact backtracking fallback.

---

## Getting Started

```bash
git clone https://github.com/yuazi/sudoku_solver
cd sudoku_solver
python3 -m pip install -r requirements.txt
python3 -m unittest discover -s tests -v
```

Train a checkpoint. The first run downloads the SATNet Sudoku dataset, trains for 30 epochs, and saves the best checkpoint to `gnn_sudoku.pth`:

```bash
python3 train.py
```

Solve a puzzle:

```bash
python3 solve.py "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
```

---

[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
