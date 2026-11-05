---
title: "Graph Neural Networks"
tags:
  - machine-learning
  - deep-learning
  - graphs
date: 2026-11-05
---

A graph neural network (GNN) learns on data that comes as nodes and edges: molecules, road networks, citation graphs, constraint puzzles. Images and text have a fixed grid or sequence layout, but a graph has no ordering and each node can have a different number of neighbours, so a GNN has to give the same answer for any relabelling of the nodes. The recipe that achieves this is message passing, and almost every GNN variant is a choice of how to build and combine the messages. I built one for Sudoku, so this page is also the theory behind that project.

![[pictures/topics/ml/graph-neural-networks.png]]

<p class="image-caption">Each dot listens to its neighbours and updates what it believes. Rendered for this page.</p>

## Mental Model

- Each node holds a feature vector. In every layer it collects messages from its neighbours, combines them with an order-independent function (sum, mean, max), and updates its own vector.
- After $L$ layers a node's vector depends on its $L$-hop neighbourhood. Stacking layers is how information travels across the graph.
- Aggregation must be permutation invariant, because a node's neighbours have no order.
- Too many layers smooth all node vectors toward each other (over-smoothing). Standard message passing also cannot tell apart some graphs that differ structurally (the WL limit).
- The same layer works on any graph size, so a trained GNN can run on graphs it never saw.

## 1. The Message Passing Framework

For node $v$ with neighbours $\mathcal{N}(v)$, one layer computes

$$
m_v = \bigoplus_{u \in \mathcal{N}(v)} \psi\big(h_u^{(l)}, h_v^{(l)}, e_{uv}\big), \qquad h_v^{(l+1)} = \phi\big(h_v^{(l)}, m_v\big)
$$

where $\psi$ builds a message (often a small MLP), $\bigoplus$ is sum, mean or max, and $\phi$ updates the node (an MLP, or a GRU). $e_{uv}$ is an optional edge feature. Gilmer et al. (2017) gave this framework its name; GCN, GraphSAGE and GAT are special cases.

## 2. GCN

The graph convolutional network (Kipf and Welling, 2017) uses a fixed, degree-normalized average:

$$
H^{(l+1)} = \sigma\!\left(\tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} \, H^{(l)} W^{(l)}\right), \qquad \tilde{A} = A + I
$$

$A$ is the adjacency matrix, $\tilde{A}$ adds a self-loop to each node so it keeps its own features, and $\tilde{D}$ is the diagonal degree matrix of $\tilde{A}$. Entry $(i, j)$ of the normalized matrix is $1 / \sqrt{\tilde{d}_i \tilde{d}_j}$ for connected nodes. The symmetric normalization stops high-degree nodes from dominating the sum.

> [!example] Worked example
> Take the path graph $0 - 1 - 2 - 3$. With self-loops the degrees are 2, 3, 3, 2. The normalized matrix has $0.5$ at $(0,0)$, $1/\sqrt{6} = 0.408$ at $(0,1)$, and $1/3$ at $(1,1)$. For node 0 with $X = [[1,0],[0,1],[1,1],[0,0]]$ and $W = [[1,-1],[0.5,1]]$: $XW$ has rows $[1,-1]$, $[0.5,1]$, $[1.5,0]$, $[0,0]$, and node 0 gets $0.5 \cdot [1,-1] + 0.408 \cdot [0.5,1] = [0.704, -0.092]$, which is $[0.704, 0]$ after ReLU.

```python
import numpy as np, networkx as nx

G = nx.path_graph(4)
A = nx.to_numpy_array(G) + np.eye(4)             # add self-loops
d = A.sum(1)
A_hat = A / np.sqrt(np.outer(d, d))              # D^-1/2 (A+I) D^-1/2
X = np.array([[1., 0], [0, 1], [1, 1], [0, 0]])
W = np.array([[1., -1], [0.5, 1]])
print(np.round(np.maximum(A_hat @ X @ W, 0), 3))
```

It prints the rows `[0.704 0]`, `[1.075 0]`, `[0.667 0.333]`, `[0.612 0]`, and the first matches the hand calculation.

## 3. GraphSAGE and GAT

GraphSAGE (Hamilton et al., 2017) concatenates a node's own vector with an aggregate of its neighbours and applies a shared weight matrix:

$$
h_v' = \sigma\!\big(W \cdot [\, h_v \,\Vert\, \text{AGG}(\{h_u : u \in \mathcal{N}(v)\}) \,]\big).
$$

The aggregator can be mean, max pooling or an LSTM. The main contribution is scalability and inductive learning: it samples a fixed number of neighbours per node, so the cost of a minibatch does not explode, and the learned function applies to new nodes and new graphs.

The graph attention network (Velickovic et al., 2018) learns the neighbour weights instead of fixing them by degree:

$$
\alpha_{vu} = \underset{u \in \mathcal{N}(v)}{\text{softmax}} \; \text{LeakyReLU}\big(a^\top [\, W h_v \,\Vert\, W h_u \,]\big), \qquad h_v' = \sigma\Big(\sum_{u} \alpha_{vu} W h_u\Big).
$$

This is attention restricted to the edges of the graph. A transformer is the special case where every token is a neighbour of every other.

## 4. Over-Smoothing

Applying the GCN propagation matrix repeatedly pulls node vectors together. Starting from random 2-dimensional features on the 4-node path, the per-column standard deviation across nodes was 0.68 and 0.40. After 200 propagations (no weights or nonlinearity, just $\hat{A}^{200} Z$) it was 0.035 and 0.031, and every row had become a multiple of the same vector, scaled by $\sqrt{\text{degree} + 1}$. At that point the only thing left to distinguish nodes is their degree.

Practical GNNs are therefore shallow (2 to 4 layers for GCN-style models on citation graphs). Remedies include residual connections, skip connections that concatenate the outputs of all layers, normalization, and dropping edges during training. Tasks where distant nodes must interact, like Sudoku, use more rounds with gated updates and residuals instead.

## 5. What a GNN Can Tell Apart

The Weisfeiler-Leman (1-WL) test colors nodes iteratively: a node's new color is a hash of its old color and the multiset of its neighbours' colors. Two graphs whose color histograms differ are not isomorphic; if they never differ, the test is inconclusive. Xu et al. (2019, the GIN paper) and Morris et al. (2019) showed that a message-passing GNN is at most as discriminating as 1-WL, and that it reaches that bound only if aggregation is injective on multisets. Sum can be injective, whereas mean and max lose information (mean cannot tell $\{1, 1\}$ from $\{1\}$).

A classic failure: a 6-cycle and two disjoint triangles. Every node has degree 2 in both, so 1-WL colors them identically forever, and no message-passing GNN with plain features can separate the graphs. networkx's `weisfeiler_lehman_graph_hash` gives the same hash for the two, while `is_isomorphic` returns false. Higher-order GNNs, positional or structural node features, and random features all go beyond 1-WL at some cost.

## 6. Tasks

- Node level: classify or regress each node, such as the paper topic in a citation graph or a digit in a Sudoku cell.
- Edge level: predict whether an edge exists (link prediction) or its type, usually from the two endpoint vectors, for example by their dot product or an MLP on their concatenation.
- Graph level: classify a whole graph, such as a molecule property. A readout step pools node vectors (sum or mean) into one graph vector.

## 7. A Sudoku Board as a Graph

Make each of the 81 cells a node. Connect two cells when they may not hold the same digit, meaning they share a row, a column, or a 3x3 box. A cell has 8 row-mates and 8 column-mates. Its box holds 8 other cells, but 2 of them are in its row and 2 in its column and are already counted, which leaves 4 new ones. That gives $8 + 8 + 4 = 20$ neighbours per cell. Building this graph in networkx confirms it: 81 nodes, 810 undirected edges, every degree equal to 20. Counted as directed edges, one per direction, that is $81 \cdot 20 = 1620$.

Node features encode the given digit (or "blank") as a one-hot vector, and the task is node classification into digits 1 to 9. Because a constraint like "all different" has to propagate, a single round of message passing is not enough. In my [[work/sudokusolver|Sudoku solver]], 7 rounds of sum-aggregated messages with a GRU update reach 99.4% fully solved puzzles on the held-out set, while the same model run for only 1 round solves none. This is the opposite end of the depth trade-off from the over-smoothing problem above: the graph is small and rigid, and the model needs enough rounds to cover it.

## Related

- [[work/sudokusolver|Solving Sudoku with GNNs]], the project built on the Sudoku graph above
- [[notes/ml/attention-and-transformers|Attention and Transformers]], since GAT is attention over graph neighbours
- [[notes/ml/embeddings|Embeddings]], where node embeddings and link prediction connect to similarity search
- [[notes/ml/backpropagation|Backpropagation]], which trains the shared message and update weights
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]], for the surrounding training code
- [[notes/ml/convolutional-networks|Convolutional Networks]], the grid-shaped special case of local aggregation with shared weights
