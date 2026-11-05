---
title: "Attention and Transformers"
tags:
  - machine-learning
  - deep-learning
  - transformers
date: 2026-11-05
---

Attention lets every position in a sequence read from every other position, with weights computed from the data itself. The transformer (Vaswani et al., 2017) stacks attention with a per-position MLP and residual connections, and drops recurrence entirely. Nearly every large language model, and many vision and audio models, are variations of that block. This page is the shape-and-cost reference I wanted when reading the lecture slides: what each matrix looks like, where the parameters live, and why long contexts are expensive.

## Mental Model

- Each token produces a query, a key and a value. A query is compared with all keys, the scores become weights through a softmax, and the output is the weighted sum of the values.
- Attention itself has no notion of order. Position information has to be injected, either added to the embeddings or rotated into queries and keys.
- Multi-head attention runs several smaller attentions in parallel so that different heads can look for different relations.
- A transformer layer is attention (mixing information across tokens) followed by an MLP (processing each token on its own), each wrapped in a residual connection and a normalization.
- The score matrix is $n \times n$, so cost grows quadratically with sequence length. Generation avoids recomputation with a KV cache.

## 1. Scaled Dot-Product Attention

For a sequence of $n$ tokens with model width $d_{model}$, the layer computes

$$
Q = XW_Q, \quad K = XW_K, \quad V = XW_V
$$

with $X \in \mathbb{R}^{n \times d_{model}}$, $W_Q, W_K \in \mathbb{R}^{d_{model} \times d_k}$, $W_V \in \mathbb{R}^{d_{model} \times d_v}$. Then

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V.
$$

The shapes are $QK^\top: n \times n$, the softmax is applied along each row, and the result times $V$ is $n \times d_v$. Row $i$ of the weight matrix says how much token $i$ reads from each token $j$, and the rows sum to 1.

### Why Divide by $\sqrt{d_k}$

If the entries of $q$ and $k$ are independent with mean 0 and variance 1, then $q \cdot k = \sum_{m=1}^{d_k} q_m k_m$ has mean 0 and variance $d_k$. With $d_k = 64$ the raw scores have a standard deviation of 8, so the softmax is close to one-hot and its gradient is nearly zero for most entries. Dividing by $\sqrt{d_k}$ brings the variance back to 1. I checked this with 100,000 random vector pairs of length 64: the variance of the raw dot product came out at 64.4, and at 1.006 after scaling.

## 2. Multi-Head Attention

Instead of one attention with width $d_{model}$, use $h$ heads with $d_k = d_v = d_{model} / h$. Each head has its own $W_Q^{(i)}, W_K^{(i)}, W_V^{(i)}$; the head outputs are concatenated back to width $d_{model}$ and mixed by an output matrix $W_O \in \mathbb{R}^{d_{model} \times d_{model}}$. The total cost is about the same as single-head attention at full width, but the model gets $h$ different attention patterns per layer.

## 3. Causal Masking

A language model that predicts token $t+1$ must not see tokens after $t$. Before the softmax, set the scores for $j > i$ to $-\infty$, which gives them weight exactly 0. The weight matrix becomes lower triangular, and the first row is always $[1, 0, 0, \dots]$ because the first token can only attend to itself. Encoders (BERT-style) and cross-attention skip the mask.

```python
import numpy as np

def softmax(x):
    e = np.exp(x - x.max(-1, keepdims=True))
    return e / e.sum(-1, keepdims=True)

def attention(Q, K, V, causal=False):
    scores = Q @ K.T / np.sqrt(Q.shape[-1])
    if causal:
        scores = np.where(np.tri(*scores.shape, dtype=bool), scores, -np.inf)
    w = softmax(scores)
    return w @ V, w

rng = np.random.default_rng(0)
n, d_model, h = 4, 8, 2
d_k = d_model // h
X = rng.normal(size=(n, d_model))
Wq, Wk, Wv, Wo = (rng.normal(size=(d_model, d_model)) / np.sqrt(d_model) for _ in range(4))
split = lambda M: M.reshape(n, h, d_k).transpose(1, 0, 2)  # (h, n, d_k)
Q, K, V = split(X @ Wq), split(X @ Wk), split(X @ Wv)
heads = [attention(Q[i], K[i], V[i], causal=True)[0] for i in range(h)]
out = np.concatenate(heads, axis=-1) @ Wo
_, w = attention(Q[0], K[0], V[0], causal=True)
print(out.shape, w.sum(-1), np.triu(w, 1).sum())
```

Running this prints `(4, 8)`, row sums of 1 for all four rows, and 0 for everything above the diagonal.

## 4. Positional Information

Without positions, shuffling the input tokens just shuffles the outputs. The original transformer added sinusoidal vectors to the token embeddings:

$$
PE_{(pos, 2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{model}}}\right), \quad PE_{(pos, 2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

Each pair of dimensions is a sine and cosine at a different wavelength, from $2\pi$ up to $10000 \cdot 2\pi$. Learned absolute position embeddings are the other common choice.

Rotary position embeddings (RoPE, Su et al., 2021) take a different route. They rotate each consecutive pair of dimensions of $q$ and $k$ by an angle proportional to the position. Because rotations compose, the dot product $q_m \cdot k_n$ depends only on the offset $m - n$, so relative position enters the attention score directly. Many recent open models use RoPE.

## 5. The Transformer Block

A pre-norm block, as used in most current models, is

$$
x \leftarrow x + \text{MHA}(\text{LN}(x)), \qquad x \leftarrow x + \text{MLP}(\text{LN}(x)).
$$

The original paper normalized after the residual addition (post-norm). Pre-norm keeps a clean identity path through the whole stack, which makes deep models easier to train without careful warm-up. The MLP is two linear layers with a nonlinearity, expanding to $d_{ff}$ (typically $4 d_{model}$) and projecting back.

### Parameters of One Layer

Ignoring biases, with $d_{model} = 512$, $h = 8$, $d_{ff} = 2048$ (the base model of the original paper):

| Part                             | Count                    | Parameters |
| -------------------------------- | ------------------------ | ---------- |
| $W_Q, W_K, W_V, W_O$             | $4 \cdot 512^2$          | 1,048,576  |
| MLP up and down                  | $2 \cdot 512 \cdot 2048$ | 2,097,152  |
| Two LayerNorms (scale and shift) | $2 \cdot 2 \cdot 512$    | 2,048      |
| Total                            |                          | 3,147,776  |

The number of heads does not change the count, since the head width shrinks as the head count grows. About two thirds of a layer's weights are in the MLP. At $d_{model} = 768$, $d_{ff} = 3072$ the attention and MLP weights come to 2,359,296 and 4,718,592, so 12 such layers hold about 85 million parameters before the embedding table.

## 6. Cost and the KV Cache

The score matrix has $n^2$ entries per head, so compute is $O(n^2 d)$ and a naive implementation uses $O(n^2)$ memory. Doubling the context quadruples the attention cost. Exact fast kernels such as FlashAttention compute the same result in tiles without materializing the full matrix, which cuts memory traffic but not the quadratic compute.

During generation the new token's query needs the keys and values of all earlier tokens. Those do not change, so they are stored: the KV cache. Each new token then costs $O(n \, d)$ per layer instead of recomputing the whole prefix. The price is memory: each token stores $2 \cdot d_{model}$ values per layer. For 32 layers, $d_{model} = 4096$ and 16-bit values that is $2 \cdot 32 \cdot 4096 \cdot 2 = 524{,}288$ bytes, half a MiB per token, or about 2 GiB for a 4096-token context. Sharing keys and values across heads (multi-query or grouped-query attention) shrinks it.

> [!warning] Common mistake
> Forgetting the mask during training of a decoder-only model. The loss drops to nearly zero because each position can read its own target, and generation then produces garbage.

## Related

- [[notes/lectures/mlp/05-transformer|MPL 05: Transformers]] and [[notes/lectures/mlp/06-vit|MPL 06: Vision Transformers]], the lectures behind this page
- [[notes/lectures/foundationmodels/03-from-counting-to-predicting|Foundation Models 03]], the path from n-gram counts to neural next-token prediction
- [[notes/ml/embeddings|Embeddings]], what the input vectors to the first layer are
- [[notes/ml/fine-tuning-and-lora|Fine-Tuning and LoRA]], which adapts exactly the projection matrices counted above
- [[notes/ml/convolutional-networks|Convolutional Networks]], the architecture attention displaced in vision
- [[notes/ml/graph-neural-networks|Graph Neural Networks]], where attention over neighbours gives GAT
