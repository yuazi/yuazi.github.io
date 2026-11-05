---
title: "Embeddings"
tags:
  - machine-learning
  - deep-learning
  - representation-learning
date: 2026-11-05
---

An embedding maps a discrete or high-dimensional thing (a word, an image, a user, a graph node) to a dense vector of a few hundred numbers, arranged so that similar things end up close together. Almost everything downstream works on these vectors: the first layer of a language model, retrieval systems, recommendation, clustering. Once a model produces good embeddings, "find similar items" turns into a geometry problem that a matrix multiplication solves.

## Mental Model

- An embedding layer is a lookup table with one learned row per token. Looking up a row is the same as multiplying a one-hot vector by the table.
- Similarity is learned from co-occurrence or from pairs the training data marks as matching. Nothing in the vector says what a coordinate means; only distances and angles are meaningful.
- Cosine similarity compares directions and ignores length. With unit-length vectors it is just a dot product.
- Contrastive training (InfoNCE, CLIP) pulls matching pairs together and pushes the rest of the batch apart.
- Searching millions of vectors exactly is a big matrix product, so large systems use approximate nearest-neighbour indexes that trade a little recall for a lot of speed.

## 1. One-Hot Versus Dense

With a vocabulary of $V = 50{,}000$ tokens, a one-hot vector has 50,000 dimensions with a single 1. Any two different tokens are orthogonal, so the representation says nothing about "cat" being closer to "dog" than to "tax". A dense embedding uses $d$ dimensions (often 256 to 4096) and puts similar tokens near each other.

The embedding layer is a matrix $E \in \mathbb{R}^{V \times d}$. For a token with index $i$, its vector is row $i$, which equals $\text{onehot}_i^\top E$. With $d = 768$ this table holds $50{,}000 \cdot 768 = 38.4$ million parameters. It is trained like any other weight, through backpropagation from the task loss, or separately as below.

## 2. word2vec and Skip-Gram

word2vec (Mikolov et al., 2013) trains embeddings by predicting words from their neighbours. In the skip-gram variant, a centre word $c$ should predict each word $o$ in a window around it. A full softmax over 50,000 words per training pair is expensive, so negative sampling replaces it with a binary problem. Each word has two vectors, $v$ as a centre word and $u$ as a context word. For an observed pair and $k$ random "negative" words $n_1, \dots, n_k$ the loss is

$$
\mathcal{L} = -\log \sigma(u_o^\top v_c) - \sum_{i=1}^{k} \log \sigma(-u_{n_i}^\top v_c).
$$

The first term pulls real pairs together, the second pushes random pairs apart. Negatives are drawn from the unigram distribution raised to the power 3/4, which samples rare words slightly more often than their raw frequency. Levy and Goldberg (2014) showed that this objective implicitly factorizes a shifted pointwise mutual information matrix, which is why a plain SVD of a PMI matrix gives similar embeddings. The numpy example below does exactly that on a 16-word toy corpus.

## 3. Cosine Similarity

$$
\cos(a, b) = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert} \in [-1, 1]
$$

It measures the angle between vectors. If you normalize all vectors to length 1, cosine equals the dot product, and Euclidean distance becomes a function of it: $\lVert a - b \rVert^2 = 2 - 2\cos(a, b)$. Ranking by cosine and ranking by Euclidean distance are then the same ranking. Many libraries normalize once at indexing time so that a search is a single matrix product.

```python
import numpy as np

corpus = """the cat drinks milk . the dog drinks water . the cat chases the mouse .
the dog chases the cat . the king rules the land . the queen rules the land .
the king loves the queen . a cat is a pet . a dog is a pet""".split(".")
sents = [s.split() for s in corpus if s.strip()]
vocab = sorted({w for s in sents for w in s})
idx = {w: i for i, w in enumerate(vocab)}

C = np.zeros((len(vocab), len(vocab)))            # co-occurrence within 2 words
for s in sents:
    for i, w in enumerate(s):
        for j in range(max(0, i - 2), min(len(s), i + 3)):
            if i != j:
                C[idx[w], idx[s[j]]] += 1

T = C.sum()
pmi = np.log((C / T + 1e-12) / (C.sum(1, keepdims=True) / T * C.sum(0, keepdims=True) / T))
U, S, _ = np.linalg.svd(np.maximum(pmi, 0))       # positive PMI, then SVD
E = U[:, :3] * S[:3]                              # 3-dimensional embeddings

cos = lambda a, b: a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
for a, b in [("cat", "dog"), ("king", "queen"), ("cat", "king")]:
    print(a, b, round(cos(E[idx[a]], E[idx[b]]), 2))
```

Running it prints 0.99 for cat and dog, 1.0 for king and queen, and 0.21 for cat and king. The words appear in the same slots ("the **_ drinks", "the _** rules the land"), and that is all the model sees. The corpus is tiny and the numbers are noisy, but the pattern is the same one word2vec finds at scale.

## 4. Contrastive Learning

Instead of predicting words, contrastive methods learn from pairs: two views of the same image, a caption and its image, a question and its answer passage. For a batch of $N$ pairs $(x_i, y_i)$ with normalized embeddings, the InfoNCE loss (van den Oord et al., 2018) is

$$
\mathcal{L}_i = -\log \frac{\exp(x_i \cdot y_i / \tau)}{\sum_{j=1}^{N} \exp(x_i \cdot y_j / \tau)}.
$$

This is a softmax cross-entropy over the $N \times N$ similarity matrix where the correct "class" for row $i$ is column $i$. The other $N - 1$ items in the batch serve as negatives for free, which is why large batches help. The temperature $\tau$ controls how sharply the loss focuses on the hardest negatives.

CLIP (Radford et al., 2021) applies this to 400 million image-text pairs with an image encoder and a text encoder, using the loss in both directions (image to text and text to image) and a learned temperature. The shared space makes zero-shot classification possible: embed the class names as text prompts, embed the image, and pick the closest prompt.

## 5. Sentence Embeddings

word2vec gives one fixed vector per word. Transformers produce a vector per token that depends on context, and a sentence embedding collapses these into one vector, usually by mean pooling or by taking a special token. Pooling the outputs of a model that was only trained for next-token or masked-token prediction gives mediocre sentence vectors. Models such as Sentence-BERT (Reimers and Gurevych, 2019) are fine-tuned with a contrastive or pairwise objective so that cosine similarity tracks semantic similarity. The model that embeds the query must be the same one that embedded the documents, with the same normalization.

## 6. Vector Search

Exact search is a matrix product between the query and every stored vector. For 1 million documents with 384 dimensions that is $1\text{M} \cdot 384 = 384$ million multiply-adds per query, and the index takes about 1.5 GB in float32. That is fine for thousands or tens of thousands of vectors and slow for hundreds of millions.

Approximate nearest-neighbour (ANN) indexes avoid scanning everything:

- Graph indexes such as HNSW link each vector to nearby ones across several layers and walk greedily from a coarse layer down to the fine one.
- Inverted-file indexes (IVF) cluster the vectors with k-means and search only the few clusters closest to the query.
- Product quantization compresses each vector into a short code of per-subspace centroid ids, which cuts memory and speeds up distance computation.

Each trades recall against speed and memory. The usual way to tune one is to measure recall@k against exact search on a sample of queries, then pick the cheapest setting that is good enough.

> [!warning] Common mistake
> Mixing embeddings from different models, or from the same model with and without normalization, in one index. The vector spaces are unrelated, so the similarities are meaningless even though the shapes match.

## Related

- [[notes/ml/attention-and-transformers|Attention and Transformers]], which turns the embedding rows into contextual vectors
- [[notes/ml/dimensionality-reduction|Dimensionality Reduction]], including PCA and the SVD used above, and t-SNE and UMAP for plotting embeddings
- [[notes/ml/clustering|Clustering]], the k-means step behind IVF indexes
- [[notes/lectures/foundationmodels/03-from-counting-to-predicting|Foundation Models 03]], from co-occurrence counts to learned representations
- [[notes/lectures/mlp/07-multimodal|MPL 07: Multimodal Models]], the lecture covering CLIP-style joint embeddings
- [[notes/ml/graph-neural-networks|Graph Neural Networks]], which learn embeddings for nodes
