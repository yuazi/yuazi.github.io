---
title: "L05 - From Attention to Modern LLMs"
tags:
  - foundation-models
  - language-models
  - transformers
  - attention
  - mixture-of-experts
  - kv-cache
  - flashattention
date: 2026-11-18
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/04-data-and-tokens|Previous: (y-04) Data and Tokens]]

## Mental Model First

- Every modern LLM stacks one block many times. Inside it, attention moves information between tokens and the MLP processes each token on its own.
- Attention is a weighted average. Each token's query is compared with every key, softmax turns the scores into weights that sum to 1, and the output mixes the value vectors with those weights. Kernel regression and even ordinary least squares have the same shape.
- BERT and GPT use the same block. BERT's mask lets every token see the whole sentence and trains on filling in hidden words; GPT's causal mask only lets a token see the past and trains on predicting the next one.
- Parameters are fixed by the width $d$, the depth $L$ and the vocabulary $V$, roughly $12 L d^2$ plus embeddings. A longer context costs memory and compute, almost no parameters.
- Between 2017 and 2025 the skeleton stayed and the parts were replaced: RMSNorm before each sublayer, SwiGLU in the MLP, RoPE for positions, and GQA or MLA to shrink the key/value cache. Most of these changes made training more stable or generation cheaper.
- A mixture of experts replaces the MLP with many experts and routes each token to a few of them. Total parameters set the memory, active parameters set the compute.
- During generation the cached keys and values of all earlier tokens limit the model more than arithmetic does. For Llama 3 8B a 128k-token context needs about as much memory as the weights. FlashAttention computes exact attention in tiles that fit into on-chip memory, so the $n \times n$ matrix never reaches slow GPU memory.

## 1. Today's Lecture

This is the third Text LM lecture (Steffen Staab).

| Unit | Time   | Topic                                                    |
| :--- | :----- | :------------------------------------------------------- |
| 1    | 20 min | Attention: weighted averaging, by hand                   |
| 2    | 15 min | The block: residual stream, BERT versus GPT              |
| 3    | 15 min | Modern parts: RMSNorm, SwiGLU, RoPE, GQA, MLA            |
| 4    | 15 min | Mixture of experts: total versus active parameters       |
| 5    | 10 min | Long context: KV cache, FlashAttention                   |
| 6    | 15 min | Beyond attention: state-space models, hybrids, diffusion |

After the lecture you should be able to compute attention by hand and read it as a weighted average, draw the transformer block and contrast BERT with GPT, explain what RMSNorm, SwiGLU, RoPE, GQA and MLA each fix, tell total from active parameters in a mixture of experts, estimate the KV cache and explain what FlashAttention changes, and compare attention with state-space models.

The uploaded deck ends after Unit 5. Unit 6 (state-space models, hybrids, diffusion) has no slides, so this note covers Units 1 to 5. Most parameter counts, cache sizes and toy plots are the lecturer's own computations from published model configs.

## 2. Attention Is Weighted Averaging

### Kernel Regression

![[pictures/foundationmodels/05/Lecture05_Pg005_Kernel_Regression.png]]

<p class="image-caption">Kernel regression predicts with a similarity-weighted average of the training outcomes.</p>

The unit starts from the question of what happens if you keep attention and drop the recurrence of the RNN models from Lecture 3. The starting point is kernel regression (Nadaraya, 1964):

$$
\hat{y}(x) = \sum_i w_i(x)\, y_i
$$

The weights $w_i(x)$ come from how similar $x$ is to each training input $x_i$, and they sum to 1. Attention does the same thing with a similarity it learns. The slide points to kernel SVMs in Foundations of ML for comparison.

### A Soft Dictionary Lookup

![[pictures/foundationmodels/05/Lecture05_Pg006_A_Soft_Dictionary_Lookup.png]]

<p class="image-caption">A Python dict returns exactly one value. Attention gives every key a weight and returns a mix of values.</p>

A Python dictionary is a hard lookup: the query "klein" matches one key and returns its value. Attention is a soft lookup. Every key gets a weight, and the answer is a weighted mix of all values. For the sentence "Das Haus ist klein", the query "klein" puts 0.02 on "Das", 0.67 on "Haus", 0.01 on "ist" and 0.30 on itself. It attends more to "Haus" than to itself because dot products reward long vectors, and the "Haus" vector is longer.

In general, every token vector $x_j$ is projected three ways: $q = W_Q x$, $k_j = W_K x_j$, $v_j = W_V x_j$. Then

$$
o = \sum_j \alpha_j v_j, \qquad \alpha_j = \operatorname{softmax}_j\!\left(\frac{q \cdot k_j}{\sqrt{d}}\right)
$$

The worked example keeps it simple and sets all $W$ to the identity, so $q = k = v = x$.

### Attention by Hand

![[pictures/foundationmodels/05/Lecture05_Pg007_Step_1_Scores.png]]

<p class="image-caption">Step 1: scaled dot products between every query and every key, with the 2-dimensional toy vectors from Lecture 1.</p>

The toy vectors from Lecture 1 have $d = 2$: Das $(2.0, 0.4)$, Haus $(0.4, 3.0)$, ist $(1.6, 0.0)$, klein $(0.8, 2.4)$. Step 1 computes $s_{ij} = q_i \cdot k_j / \sqrt{d}$ for every pair.

| q \ k |  Das | Haus |  ist | klein |
| :---- | ---: | ---: | ---: | ----: |
| Das   | 2.94 | 1.41 | 2.26 |  1.81 |
| Haus  | 1.41 | 6.48 | 0.45 |  5.32 |
| ist   | 2.26 | 0.45 | 1.81 |  0.91 |
| klein | 1.81 | 5.32 | 0.91 |  4.53 |

For example, klein · Haus $= 0.8 \cdot 0.4 + 2.4 \cdot 3.0 = 7.52$, and $7.52 / \sqrt{2} = 5.32$. In the "klein" row the largest score is with "Haus" (5.32), then with itself (4.53).

![[pictures/foundationmodels/05/Lecture05_Pg008_Step_2_Softmax.png]]

<p class="image-caption">Step 2: a row-wise softmax turns scores into weights. Without the √d the weights collapse onto one key as d grows.</p>

Step 2 applies softmax to each row, so each row sums to 1:

$$
\alpha_{ij} = \operatorname{softmax}_j(s_{ij}) = \frac{\exp s_{ij}}{\sum_l \exp s_{il}}
$$

| q \ k |  Das | Haus |  ist | klein |
| :---- | ---: | ---: | ---: | ----: |
| Das   | 0.49 | 0.11 | 0.25 |  0.16 |
| Haus  | 0.00 | 0.76 | 0.00 |  0.24 |
| ist   | 0.49 | 0.08 | 0.31 |  0.13 |
| klein | 0.02 | 0.67 | 0.01 |  0.30 |

The division by $\sqrt{d}$ matters for large $d$. The standard deviation of $q \cdot k$ grows like $\sqrt{d}$: 2.8 for $d = 8$, 32 for $d = 1024$. The plot uses 32 random keys and tracks the mean largest weight. Without scaling it climbs towards 1 as $d$ grows, so softmax becomes nearly one-hot. With scaling it stays near the uniform value $1/32$.

![[pictures/foundationmodels/05/Lecture05_Pg009_Step_3_Weighted_Sum_Of_Values.png]]

<p class="image-caption">Step 3: the output for "klein" is a weighted sum of the value vectors. Line width shows each weight.</p>

Step 3 mixes the values:

$$
o_\text{klein} = 0.02\, v_\text{Das} + 0.67\, v_\text{Haus} + 0.01\, v_\text{ist} + 0.30\, v_\text{klein} = (0.56,\ 2.74)
$$

After this step "klein" carries information about "Haus". In matrix form, with $Q$, $K$, $V$ of shape $n \times d$:

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V
$$

The cost grows with $n^2 \cdot d$, because every token is compared with every other token.

### Least Squares Is Attention, Too

![[pictures/foundationmodels/05/Lecture05_Pg010_Least_Squares_Is_Attention_Too.png]]

<p class="image-caption">Paper spotlight (Goulet Coulombe, NeurIPS 2026): an OLS prediction has the query-key-value shape of attention.</p>

The paper spotlight is Goulet Coulombe, "Ordinary least squares as an attention mechanism" (NeurIPS 2026, arXiv 2504.09663). The OLS prediction for test inputs is

$$
\hat{y}_\text{test} = X_\text{test}\, (X^\top X)^{-1} X^\top y
$$

Read it as attention. The query is the test input, the keys are the training inputs $X$, the values are the training outcomes $y$, the similarity metric is $(X^\top X)^{-1}$, and the softmax becomes the identity. Each prediction is a similarity-weighted sum of training outcomes, so attention can be read as a modified regression computed on the fly.

![[pictures/foundationmodels/05/Lecture05_Pg011_What_Attention_Adds_To_Least_Squares.png]]

<p class="image-caption">Same pattern, three changes from least squares to self-attention.</p>

| Least squares                      | Self-attention                              |
| :--------------------------------- | :------------------------------------------ |
| Similarity fixed by the data       | Similarity learned through $W_Q$ and $W_K$  |
| Weights of any sign                | Weights $\geq 0$ that sum to 1 (softmax)    |
| "Training set" is a fixed data set | "Training set" is the tokens in the context |
| One prediction per test input      | Every token is query, key and value at once |

The outlook: "regression on the context" is one way to look at in-context learning.

### Multi-Head Attention

![[pictures/foundationmodels/05/Lecture05_Pg012_Multi_Head_Attention.png]]

<p class="image-caption">Several learned similarities run in parallel, each in a smaller space, and their outputs are concatenated.</p>

One similarity per layer is limiting. Multi-head attention (Vaswani et al., 2017) runs $h$ heads in parallel, each with its own $W_Q^i, W_K^i, W_V^i$ in a smaller space. The head outputs are concatenated and passed through a linear layer. GPT-2 small has 12 heads of size 64, which gives $12 \times 64 = 768$. Each head can track a different relation between tokens.

Unit 1 check: if all keys in a sequence are identical, every query gets the average of all value vectors (answer A). With $k_j = k$, every score in row $i$ is the same, $s_{ij} = q_i \cdot k / \sqrt{d} = s_i$. Softmax of equal scores gives $\alpha_{ij} = 1/n$, so $o_i = \frac{1}{n} \sum_j v_j = \bar{v}$ and the query has cancelled out. Attention is a learned similarity ($W_Q$, $W_K$) plus weighted averaging.

## 3. The Transformer Block: BERT and GPT

### The Block

![[pictures/foundationmodels/05/Lecture05_Pg016_The_Transformer_Block.png]]

<p class="image-caption">A decoder-only language model from bottom to top: embedding, L blocks of norm, attention, norm, MLP, then unembedding and softmax.</p>

A decoder-only language model reads "the cat sat" from the bottom up. The tokens are embedded, then pass through $L$ identical blocks, then a final norm, the unembedding and a softmax give $p(\text{next token})$. Each block has two sublayers:

- Attention, where tokens exchange information.
- The MLP, a position-wise feed-forward network that handles each token on its own.

Each sublayer is wrapped in a norm and a residual "+", which keeps deep stacks trainable. GPT-2 small has $L = 12$ blocks, Llama 3 8B has $L = 32$. The figure follows Vaswani et al. (2017) with the pre-norm placement of GPT-2 (Radford et al., 2019).

### The Residual Stream

![[pictures/foundationmodels/05/Lecture05_Pg017_The_Residual_Stream.png]]

<p class="image-caption">Each sublayer reads from one running vector per token and adds its update back.</p>

$$
x \leftarrow x + \operatorname{Attention}(\operatorname{Norm}(x)), \qquad x \leftarrow x + \operatorname{MLP}(\operatorname{Norm}(x))
$$

Each sublayer writes a small update and nothing gets overwritten. Gradients flow straight down the "+" path (see Niepert's lecture on residuals), and later layers can read what earlier layers wrote. Interpretability work reads this stream with the idea that "a direction is a feature" (Elhage et al., 2021). That comes back in Lecture 7.

### Attention Mixes, the MLP Computes

![[pictures/foundationmodels/05/Lecture05_Pg018_Attention_Mixes_The_MLP_Computes.png]]

<p class="image-caption">Attention works across tokens and the MLP per token. Most block parameters sit in the MLP.</p>

| Attention                           | MLP (feed-forward)                             |
| :---------------------------------- | :--------------------------------------------- |
| Moves information between positions | Applies the same function at every position    |
| Weights depend on the input         | $\operatorname{MLP}(x) = W_2\, \varphi(W_1 x)$ |
| $4 d^2$ parameters per layer        | $8 d^2$ parameters (hidden width $4d$)         |

The MLP holds 67% of the block parameters in GPT-2 small and in OLMo 2 7B, and 81% in Llama 3 8B. In a dense LLM, two thirds or more of the block parameters are MLP weights.

### Attention Ignores Word Order

![[pictures/foundationmodels/05/Lecture05_Pg019_Attention_Ignores_Word_Order.png]]

<p class="image-caption">Shuffle the input and the outputs shuffle the same way.</p>

Attention is a weighted sum over a set, so it has no idea of order. "dog bites man" and "man bites dog" give the same output vectors, only reordered. The fix is to add position information to each token, $x_i = e_{w_i} + p_i$. The 2017 transformer used fixed sinusoids and GPT-2 learned one vector $p_i$ per position. Current models rotate $q$ and $k$ instead (RoPE, Unit 3).

### Masks: Who May Look at Whom

![[pictures/foundationmodels/05/Lecture05_Pg020_Masks.png]]

<p class="image-caption">Rows are query positions, columns are key positions, blue is allowed. BERT sees everything, GPT only the past.</p>

The attention is the same in both models and the mask decides which keys a query may see. In BERT's bidirectional encoder mask every position sees every other. In GPT's causal decoder mask, position $t$ only sees positions $\leq t$, a lower-triangular pattern.

### BERT Versus GPT

![[pictures/foundationmodels/05/Lecture05_Pg021_BERT_Vs_GPT.png]]

<p class="image-caption">Same block, different mask and objective.</p>

|           | BERT (Google, 2018)         | GPT-1/2 (OpenAI, 2018/19) |
| :-------- | :-------------------------- | :------------------------ |
| Block     | Encoder, bidirectional mask | Decoder, causal mask      |
| Objective | Fill in masked tokens       | Predict the next token    |
| Size      | 110 M / 340 M               | 117 M / 1.5 B             |
| Use       | Classify, tag, embed text   | Generate text             |

Decoder-only models won for three reasons given on the slide: one model both reads and writes, every token is a training signal, and generation is cheap with a KV cache (Unit 5). Encoder-decoder models such as T5 (2019) survive in translation and speech, and for applications that only need an embedding and no prediction. The objectives get more detail in Lecture 4 of the Text LM block.

![[pictures/foundationmodels/05/Lecture05_Pg022_BERT_Cloze_Task.png]]

<p class="image-caption">BERT hides about 15% of the tokens and predicts them from both sides.</p>

BERT's main task is a cloze test. About 15% of the tokens are replaced by [MASK], and the loss only counts those hidden positions $M$:

$$
\mathcal{L} = -\sum_{i \in M} \log p(x_i \mid \tilde{x})
$$

where $\tilde{x}$ is the sentence with [MASK] tokens. A hidden position can look left and right. BERT had a second task, next sentence prediction.

![[pictures/foundationmodels/05/Lecture05_Pg023_GPT_Next_Token.png]]

<p class="image-caption">GPT: every position sees only the past and predicts the next token.</p>

GPT makes every position a target:

$$
\mathcal{L} = -\sum_{t=1}^{n} \log p(x_{t+1} \mid x_{\leq t})
$$

A sentence of $n$ tokens is $n$ exercises, all trained in parallel. "sat" can look at "the cat sat" and never at the words it has to predict. To generate, append the predicted token and repeat.

### Counting Parameters

![[pictures/foundationmodels/05/Lecture05_Pg024_Counting_Parameters.png]]

<p class="image-caption">Rule of thumb: 12 L d² in the blocks, plus the embeddings, worked through for GPT-2 small.</p>

Here $d$ is the length of each token vector (not the context length), $L$ the number of layers and $V$ the vocabulary size. The context length $n$ only sizes the $n \times n$ attention matrix. For GPT-2 small, $L = 12$, $d = 768$, $V = 50{,}257$:

| Part                                                                    |  Parameters |
| :---------------------------------------------------------------------- | ----------: |
| Attention per layer: $W_Q, W_K, W_V, W_O$, each $d \times d$, so $4d^2$ |   2,359,296 |
| MLP per layer: $d \times 4d$ and $4d \times d$, so $8d^2$               |   4,718,592 |
| All $L$ blocks: $L (4 + 8) d^2 = 12 L d^2$                              |  84,934,656 |
| Embeddings: $V \cdot d$ plus learned positions $1{,}024 \cdot d$        |  39,383,808 |
| Exact total, with biases and norms                                      | 124,439,808 |

The same rule works for Llama 3 8B ($d = 4{,}096$, $L = 32$, $V = 128{,}256$): the exact count is 8.03 B, of which 13% are embeddings.

![[pictures/foundationmodels/05/Lecture05_Pg026_Parameters_Vs_Context.png]]

<p class="image-caption">Doubling the context adds 0.6% parameters to GPT-2 small and none to a RoPE model.</p>

Unit 2 check: extending GPT-2 small from $n = 1{,}024$ to $n = 2{,}048$ grows the parameter count by less than 1% (answer C). Only the learned position table grows, by $1{,}024 \cdot 768 = 786{,}432$ parameters, about 0.6% of 124.4 M. The attention matrix is an activation and holds no parameters. With RoPE, as in Llama 3, there is no position table and the count does not change at all.

| Doubling $n$ changes ...                | GPT-2 small     |
| :-------------------------------------- | :-------------- |
| Parameters ($d$, $L$, $V$ unchanged)    | +0.6% (RoPE: 0) |
| Attention matrix per head, $n \times n$ | ×4              |
| KV cache during generation              | ×2              |

$d$, $L$ and $V$ fix the parameters. A longer context costs compute and memory.

## 4. The Modern Block

### 2017 to 2025 in One Table

![[pictures/foundationmodels/05/Lecture05_Pg028_2017_To_2025_In_One_Table.png]]

<p class="image-caption">The skeleton stayed, and almost every part was replaced between 2017 and 2024.</p>

|           | Transformer 2017 | GPT-2 2019        | Llama 3 2024    | OLMo 2 2024          | DeepSeek-V3 2024 |
| :-------- | :--------------- | :---------------- | :-------------- | :------------------- | :--------------- |
| Norm      | LayerNorm, after | LayerNorm, before | RMSNorm, before | RMSNorm, on outputs  | RMSNorm, before  |
| Position  | Sinusoids        | Learned           | RoPE            | RoPE                 | RoPE (decoupled) |
| MLP       | ReLU             | GELU              | SwiGLU          | SwiGLU               | SwiGLU           |
| Attention | Multi-head       | Multi-head        | GQA (8 KV)      | Multi-head + QK-norm | MLA              |
| Experts   | none             | none              | none            | none                 | 256 + 1, top 8   |

Stability, memory and speed drove these changes.

### Pre-Norm and RMSNorm

![[pictures/foundationmodels/05/Lecture05_Pg029_Pre_Norm_And_RMSNorm.png]]

<p class="image-caption">Normalize before each sublayer, and drop the parts of LayerNorm that are not needed.</p>

$$
\operatorname{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum_j x_j^2 + \epsilon}} \odot g
$$

RMSNorm only divides by the root mean square. After it, every component has a size of about 1, and the learned vector $g$ rescales each dimension. Pre-norm puts the norm in front of each sublayer, so the residual path stays an identity and deep stacks train without warm-up tricks. OLMo 2 normalizes the sublayer outputs instead and adds QK-norm (a norm on queries and keys) against loss spikes. Most of these changes were made to stabilize training. Accuracy was a smaller concern.

### GELU and SiLU

![[pictures/foundationmodels/05/Lecture05_Pg030_GELU.png]]

<p class="image-caption">ReLU, GELU and SiLU all multiply the input by a gate between 0 and 1.</p>

Each activation multiplies its input by a gate:

$$
\operatorname{ReLU}(x) = x \cdot \mathbf{1}[x > 0], \qquad \operatorname{GELU}(x) = x \cdot \Phi(x), \qquad \operatorname{SiLU}(x) = x \cdot \sigma(x)
$$

$\Phi$ is the standard normal CDF, roughly $\sigma(1.7x)$. GELU is smooth with slope $\Phi(0) = 0.5$ at 0, it dips below zero so small negative inputs keep a gradient, and far from 0 it behaves like ReLU. The sigmoid saturates on both sides, so today it only appears as a gate. BERT and GPT-2 use GELU; Llama, Qwen and OLMo use SiLU as the gate inside SwiGLU.

### SwiGLU: A Gated MLP

![[pictures/foundationmodels/05/Lecture05_Pg031_SwiGLU.png]]

<p class="image-caption">SwiGLU multiplies two projections of the input, one of them passed through SiLU.</p>

$$
\operatorname{MLP}(x) = W_2 \big(\operatorname{SiLU}(W_1 x) \odot W_3 x\big), \qquad \operatorname{SiLU}(z) = z \cdot \sigma(z) = \frac{z}{1 + e^{-z}}
$$

For positive inputs $\operatorname{MLP}(x) \approx W_2 (W_1 x \odot W_3 x)$: products of features, a soft AND, which gives degree-2 interactions within one layer. With three matrices instead of two, a hidden width of about $\frac{8}{3} d$ keeps the parameter count of the old $4d$ MLP. Llama 3 8B uses $d = 4{,}096$ and a hidden width of 14,336 ($3.5\, d$). SwiGLU gives a better loss at equal compute and has been standard since PaLM and Llama. Shazeer (2020) on why it works: "We offer no explanation as to why these architectures seem to work; we attribute their success, as all else, to divine benevolence."

### RoPE: Position as Rotation

![[pictures/foundationmodels/05/Lecture05_Pg032_RoPE.png]]

<p class="image-caption">RoPE rotates q and k by their positions, so the score only sees the distance between them.</p>

RoPE (Su et al., 2024) rotates the query and key by angles that depend on their positions:

$$
q_m = R_{m\theta}\, q, \quad k_n = R_{n\theta}\, k \quad \Rightarrow \quad q_m^\top k_n = q^\top R_{(n-m)\theta}\, k
$$

The score only depends on the offset $n - m$. In the example, positions (2, 1) and (6, 5) have the same offset and the same score, $q \cdot k = 0.413$. The rotation works on pairs of dimensions, each pair with its own frequency $\theta_j$, and it is applied in every layer. The 2017 sinusoids were added once, to the embedding. RoPE adds no position vector at all.

### Grouped-Query Attention

![[pictures/foundationmodels/05/Lecture05_Pg033_Grouped_Queries.png]]

<p class="image-caption">Query heads either keep their own keys and values or share them in groups. Only key/value heads are cached.</p>

During generation the keys and values of every past token are cached (Unit 5), and that cache grows with the number of key/value heads. Multi-query attention (Shazeer, 2019) lets all query heads share one K/V head. Grouped-query attention (Ainslie et al., 2023) sits in between: with 8 query heads and 2 K/V heads, each K/V head serves 4 query heads. GQA stays close to the quality of full multi-head attention.

![[pictures/foundationmodels/05/Lecture05_Pg034_MHA_GQA_MQA_In_Formulas.png]]

<p class="image-caption">MHA, GQA and MQA are the same attention with a different number g of key/value heads.</p>

For each query head $i$ and position $t$, with $g$ K/V heads indexed by $j$:

$$
q_t^i = W_Q^i x_t, \quad k_s^j = W_K^j x_s, \quad v_s^j = W_V^j x_s
$$

$$
\text{head}_t^i = \sum_{s \leq t} \operatorname{softmax}_s\!\left(\frac{q_t^i \cdot k_s^{\gamma_i}}{\sqrt{d_h}}\right) v_s^{\gamma_i}
$$

$\gamma_i$ is the K/V head that query head $i$ uses. Only $k_s$ and $v_s$ of past tokens are cached.

|                           | MHA            | GQA                                | MQA            |
| :------------------------ | :------------- | :--------------------------------- | :------------- |
| K/V heads $g$             | $g = h$        | $1 < g < h$                        | $g = 1$        |
| Query head $i$ uses       | $\gamma_i = i$ | $\gamma_i = \lceil i g / h \rceil$ | $\gamma_i = 1$ |
| Cache per token and layer | $2 h d_h$      | $2 g d_h$                          | $2 d_h$        |

Llama 3 8B has $h = 32$ and $g = 8$, so each K/V head serves 4 query heads and the cache shrinks by a factor of 4.

### Multi-Head Latent Attention

![[pictures/foundationmodels/05/Lecture05_Pg035_Multi_Head_Latent_Attention.png]]

<p class="image-caption">MLA caches one low-rank latent per token and rebuilds keys and values from it.</p>

DeepSeek's multi-head latent attention (MLA) keeps all heads and stores fewer bytes per token. GQA caches K and V of each remaining K/V head. MLA caches one low-rank latent vector per token and re-expands K and V from it when needed.

| Model                                         | KV cache per token (bf16) |
| :-------------------------------------------- | ------------------------: |
| OLMo 2 7B, MHA with 32 KV heads               |                   512 KiB |
| Llama 3 8B, GQA with 8 KV heads               |                   128 KiB |
| DeepSeek-V3 (671 B), MLA with latent 512 + 64 |                    69 KiB |
| DeepSeek-V3 if it used MHA                    |                   4.8 MiB |

A 671 B model ends up with a smaller cache per token than an 8 B model.

![[pictures/foundationmodels/05/Lecture05_Pg036_MLA_In_One_Picture.png]]

<p class="image-caption">Compress each token into a short latent, cache it with a small RoPE key, and rebuild full keys and values per head.</p>

The picture has three steps. $W_D$ compresses each token $x_s$ into a short latent $c_s$ (512 numbers), and $W_R$ plus RoPE gives a small position key $k_s^R$ (64 numbers). Only these 576 numbers per token and layer are cached. When a head needs keys and values, $W_{UK}^i$ and $W_{UV}^i$ expand $c_s$ back into $k_s^i$ and $v_s^i$. Full MHA in DeepSeek-V3 would cache 40,960 numbers per token and layer.

![[pictures/foundationmodels/05/Lecture05_Pg037_MLA_In_Formulas.png]]

<p class="image-caption">MLA in formulas: compress, rebuild per head, attend as usual.</p>

1. Compress (cached): $c_s = W_D x_s$, $k_s^R = \operatorname{RoPE}(W_R x_s)$
2. Rebuild per head: $k_s^i = [W_{UK}^i c_s;\ k_s^R]$, $v_s^i = W_{UV}^i c_s$
3. Attend as usual: $\text{head}_t^i = \sum_{s \leq t} \operatorname{softmax}_s\!\left(\frac{q_t^i \cdot k_s^i}{\sqrt{d_h + d_R}}\right) v_s^i$

The small RoPE key $k_s^R$ is shared by all heads.

| Cache per token | Formula               | DeepSeek-V3                        |
| :-------------- | :-------------------- | :--------------------------------- |
| Full MHA        | $h d_h + d_R + h d_h$ | $128 \cdot (192 + 128) = 40{,}960$ |
| MLA             | $d_c + d_R$           | $512 + 64 = 576$ (about 70× less)  |

The trick that makes it cheap: $q \cdot (W_{UK} c_s) = (W_{UK}^\top q) \cdot c_s$. The keys are never formed and attention runs directly on the latents.

Unit 3 check: Llama 3 8B has 32 query heads and 8 KV heads, so its KV cache is 4 times smaller than with full multi-head attention (answer B). Full MHA would cache 32 K/V heads per layer, 512 KiB per token; GQA caches 8, 128 KiB per token. Query vectors are not cached. Each new token computes its 32 query vectors and compares them with the cached keys of all earlier tokens. During generation, memory per token limits the model more than FLOPs do.

## 5. Mixture of Experts

### A Mixture-of-Experts Layer

![[pictures/foundationmodels/05/Lecture05_Pg042_A_Mixture_Of_Experts_Layer.png]]

<p class="image-caption">The MLP becomes E experts, and a router sends each token to its top k.</p>

The question after the break: does every token need every parameter? A mixture-of-experts (MoE) layer (Shazeer et al., 2017) replaces the MLP with $E$ experts and a router:

$$
y = \sum_{i \in \text{top}_k} g_i(x)\, E_i(x), \qquad g(x) = \operatorname{softmax}(W_r x)
$$

In the picture $E = 8$ and $k = 2$; the token goes to expert 2 with weight 0.62 and expert 5 with weight 0.38. Only the MLP is replaced. Attention stays shared by all tokens.

### Total Versus Active Parameters

![[pictures/foundationmodels/05/Lecture05_Pg043_Total_Vs_Active_Parameters.png]]

<p class="image-caption">Per token, an MoE model uses only a few percent of its weights (log scale).</p>

| Model                     | Total | Active per token |
| :------------------------ | ----: | ---------------: |
| DeepSeek-V3 (2024)        | 671 B |        37 B (6%) |
| Qwen3-235B-A22B (2025)    | 235 B |        22 B (9%) |
| gpt-oss-120b (2025)       | 117 B |       5.1 B (4%) |
| Qwen3-Next-80B-A3B (2025) |  80 B |         3 B (4%) |
| Mixtral 8×7B (2024)       |  47 B |       13 B (28%) |
| OLMoE-1B-7B (2024)        | 6.9 B |      1.3 B (19%) |

### Keeping All Experts Busy

![[pictures/foundationmodels/05/Lecture05_Pg044_Keeping_All_Experts_Busy.png]]

<p class="image-caption">Left alone, the router sends almost everything to a few favourites.</p>

Routing can collapse: popular experts get more training, which makes them more popular. The Switch Transformer (Fedus et al., 2022) adds an auxiliary loss that rewards an even load. DeepSeek-V3 uses no extra loss and nudges a bias per expert up or down instead. DeepSeekMoE uses many small, fine-grained experts plus a shared expert that is always on. Balance is also an engineering need: experts live on different GPUs, and an overloaded one stalls the whole step.

### Do Experts Become Topic Specialists?

![[pictures/foundationmodels/05/Lecture05_Pg045_Do_Experts_Specialise.png]]

<p class="image-caption">Paper spotlight: Mixtral and OLMoE give two different answers.</p>

Mixtral 8×7B (Jiang et al., 2024, §5): "Surprisingly, we do not observe obvious patterns in the assignment of experts based on the topic." OLMoE-1B-7B (Muennighoff et al., 2024) finds "high specialization": routing settles early in training and follows tokens and domains. Experts mostly specialize on token-level patterns, so "expert" is a misleading name for them.

### The Trade-Off

![[pictures/foundationmodels/05/Lecture05_Pg046_The_Trade_Off.png]]

<p class="image-caption">Compute per token goes down; memory and plumbing go up.</p>

| You gain                                           | You pay                          |
| :------------------------------------------------- | :------------------------------- |
| Quality of a big model at the FLOPs of a small one | All experts must sit in memory   |
| Cheaper training per token                         | Communication between GPUs       |
| Fast generation when serving many users            | Harder fine-tuning and local use |

Experts can also be merged or mixed for different goals; the lecturer's group's MOMoE work comes up in Lecture 5.

Unit 4 check: Mixtral "8×7B" has 47 B parameters in total, not $8 \times 7 = 56$ B, because attention and embeddings are shared and only the MLP is copied 8 times (answer A). "7B" counts a whole dense model. Eight MLP copies plus one shared rest give about 47 B; two experts per token plus the shared rest give about 13 B active. Total parameters set the memory, active parameters set the compute.

## 6. Long Context and FlashAttention

### Attention Cost Grows With Context

![[pictures/foundationmodels/05/Lecture05_Pg050_Attention_Cost_Grows_With_Context.png]]

<p class="image-caption">Llama 3 8B: KV-cache memory (left, log scale) and the share of compute spent in attention (right).</p>

What does it cost to read a whole book? For Llama 3 8B in bf16, the KV cache grows linearly with the prompt length, from about 0.5 GiB at 4k tokens to about 128 GiB at 1M. At 128k tokens it reaches 16 GiB, about the size of the weights. The share of FLOPs spent in attention rises from about 6% at 4k to 68% at 128k and over 90% at 1M.

### Lost in the Middle

![[pictures/foundationmodels/05/Lecture05_Pg051_Lost_In_The_Middle.png]]

<p class="image-caption">A toy computation with 8 layers: the start and the end of the context get the most weight, the middle the least.</p>

Models use information at the beginning and the end of the context best (Liu et al., 2024). The lecture gives three reasons, illustrated with a toy computation over 50 positions and 8 layers:

1. Causal mask times depth. Token 1 is visible to every later token in every layer, so its influence compounds.
2. Distance decay from RoPE plus the residual stream. Recent tokens, and the token's own position, stay strong.
3. Attention sinks (Xiao et al., 2024). Spare softmax weight has to go somewhere, and it lands on the first tokens.

### GPU Memory: SRAM and HBM

![[pictures/foundationmodels/05/Lecture05_Pg052_GPU_Memory_SRAM_And_HBM.png]]

<p class="image-caption">NVIDIA A100: arithmetic happens on the die, the data lives in HBM stacks beside it.</p>

On an NVIDIA A100 the arithmetic happens on the die, which has 108 compute units with 192 KB of SRAM each, about 20 MB in total at about 19 TB/s. The data lives in HBM (High Bandwidth Memory), stacks of DRAM chips beside the die connected through a silicon interposer: 40 to 80 GB at 1.5 to 2.0 TB/s, about 10 times slower than SRAM. Every weight and every cached key and value has to cross this link.

### Why Keys and Values Can Be Cached

![[pictures/foundationmodels/05/Lecture05_Pg053_Why_Keys_And_Values_Can_Be_Cached.png]]

<p class="image-caption">One attention head: keys and values of earlier tokens never change, so they are computed once.</p>

For one head, query token $t$ and earlier tokens $s \leq t$:

1. Project, linear and per token: $k_s = W_K x_s$, $v_s = W_V x_s$
2. Score: $e_{ts} = q_t \cdot k_s / \sqrt{d_h}$ with $q_t = W_Q x_t$
3. Softmax, the only nonlinearity: $\alpha_{ts} = \exp(e_{ts}) / \sum_{s' \leq t} \exp(e_{ts'})$
4. Weighted sum: $o_t = \sum_{s \leq t} \alpha_{ts} v_s = W_V \big(\sum_{s \leq t} \alpha_{ts} x_s\big)$

When token $t + 1$ arrives, $k_s$ and $v_s$ for all $s \leq t$ are reused, and only $q_{t+1}$ and the new weights $\alpha_{t+1, s}$ are computed. This works because of the causal mask: position $s$ only ever saw tokens up to $s$, so its vector $x_s$ in every layer stays fixed. In BERT, every new token changes all the $x_s$, so nothing can be cached.

### KV-Cache Arithmetic

![[pictures/foundationmodels/05/Lecture05_Pg054_KV_Cache_Arithmetic.png]]

<p class="image-caption">Every generated token re-reads the keys and values of all previous tokens.</p>

$$
\text{cache size in bytes} = 2 \cdot L \cdot n_\text{kv} \cdot d_h \cdot b \cdot n
$$

The 2 counts key and value, $L$ is the number of layers, $n_\text{kv}$ the key/value heads per layer, $d_h$ the length of a key or value vector, $b$ the bytes per number and $n$ the tokens in the context. For Llama 3 8B in bf16 ($L = 32$, $n_\text{kv} = 8$, $d_h = 128$, $b = 2$):

| Quantity                                                |   Value |
| :------------------------------------------------------ | ------: |
| $2 \cdot 32 \cdot 8 \cdot 128 \cdot 2$ bytes per token  | 128 KiB |
| × 131,072 tokens (128k context)                         |  16 GiB |
| Weights for comparison, $8.03 \cdot 10^9 \cdot 2$ bytes |  15 GiB |

One long conversation can need as much memory as the model, and that is per user.

### FlashAttention

![[pictures/foundationmodels/05/Lecture05_Pg055_FlashAttention.png]]

<p class="image-caption">FlashAttention computes attention tile by tile in fast on-chip memory.</p>

FlashAttention (Dao et al., 2022) does the same math with less memory traffic. It loads tiles of $Q$, $K$ and $V$ into SRAM, computes a partial softmax and output for each tile, and never writes an $n \times n$ matrix to HBM. An online softmax rescales the running sums from tile to tile. The result is exact attention with memory linear in $n$, several times faster. The quadratic FLOPs remain.

![[pictures/foundationmodels/05/Lecture05_Pg056_FlashAttention_Memory_Bottleneck.png]]

<p class="image-caption">Standard attention moves two n × n matrices through slow GPU memory.</p>

Standard attention takes three trips through HBM:

| Step                               | HBM traffic              |
| :--------------------------------- | :----------------------- |
| 1. $S = Q K^\top / \sqrt{d_h}$     | Write $S$ ($n \times n$) |
| 2. $P = \operatorname{softmax}(S)$ | Read $S$, write $P$      |
| 3. $O = P V$                       | Read $P$ and $V$         |

At $n = 8{,}192$, $S$ has 67 M entries, 128 MiB per head and layer, far more than the 20 MB of SRAM. The idea of FlashAttention is to never write $S$ or $P$ to HBM and compute attention block by block in SRAM instead.

![[pictures/foundationmodels/05/Lecture05_Pg057_FlashAttention_Tiles.png]]

<p class="image-caption">Blocks of K and V pass through SRAM while each output row is updated on the fly.</p>

For each query block $Q_i$, every row keeps three things: the running maximum $m$, the running denominator $\ell$, and the unnormalized output $O_i$. For $j = 1, \dots, T$, load $K_j, V_j$ into SRAM and compute

$$
S_{ij} = Q_i K_j^\top / \sqrt{d_h}, \qquad m' = \max(m, \operatorname{rowmax} S_{ij})
$$

$$
\ell \leftarrow e^{m - m'} \ell + \operatorname{rowsum} e^{S_{ij} - m'}, \qquad O_i \leftarrow e^{m - m'} O_i + e^{S_{ij} - m'} V_j, \qquad m \leftarrow m'
$$

At the end, $O_i \leftarrow O_i / \ell$ is written to HBM. The rescaling is needed because a larger score in a later block changes the maximum, and the factor $e^{m - m'}$ corrects everything summed so far. The extra memory is two numbers per row, which is linear in $n$ (Dao et al., 2022, Alg. 1; online softmax from Milakov and Gimelshein, 2018).

![[pictures/foundationmodels/05/Lecture05_Pg058_FlashAttention_Exact.png]]

<p class="image-caption">A worked example: two key blocks give exactly the weights of a single softmax.</p>

One query row with scores (1, 2) in key block 1 and (3, 0) in key block 2:

| Step             | $m$ | $\ell$                                      | $o$ (not yet divided)                           |
| :--------------- | --: | :------------------------------------------ | :---------------------------------------------- |
| Block 1: (1, 2)  |   2 | $e^{-1} + e^0 = 1.368$                      | $e^{-1} v_1 + v_2$                              |
| Block 2: (3, 0)  |   3 | $e^{-1} \cdot 1.368 + e^0 + e^{-3} = 1.553$ | $e^{-1}(e^{-1} v_1 + v_2) + v_3 + e^{-3} v_4$   |
| Divide by $\ell$ |     |                                             | $0.087 v_1 + 0.237 v_2 + 0.644 v_3 + 0.032 v_4$ |

These weights are exactly $\operatorname{softmax}(1, 2, 3, 0)$, the result of standard attention. FlashAttention is exact and uses memory linear in $n$, but still needs $n^2$ FLOPs. The speed-ups:

- FlashAttention (2022): GPT-2 training 3× faster at $n = 1$k.
- FlashAttention-2 (Dao, 2024): about 2× faster again, 50 to 73% of the A100 peak.
- FlashAttention-3 (Shah et al., 2024, H100): 1.5 to 2× faster, 740 TFLOP/s in FP16.

### Local and Global Attention

![[pictures/foundationmodels/05/Lecture05_Pg059_Local_And_Global_Attention.png]]

<p class="image-caption">Most layers look at a window, a few layers look at everything.</p>

With a sliding window, each token only sees the last $w$ tokens; Mistral 7B uses $w = 4{,}096$. Gemma 3 has 5 local layers with a window of 1,024 for every global layer, and gpt-oss alternates dense and banded layers with a 128-token band. Attention sinks keep the first tokens in view, because softmax needs somewhere to put its weight. Local layers have a fixed-size cache, and the few global layers keep long-range access.

### Long Context Is Not Used Context

![[pictures/foundationmodels/05/Lecture05_Pg061_Long_Context_Is_Not_Used_Context.png]]

<p class="image-caption">The nominal window says how much fits. How much the model uses has to be measured.</p>

Unit 5 check: "Our model has a 1-million-token context window, so it uses everything in the document." The error is that fitting into the window is different from using it: recall drops, especially in the middle (answer B). Facts in the middle of a long prompt are found less often (Liu et al., 2024). On RULER (Hsieh et al., 2024), only half of the models that claim at least 32k tokens work well at 32k. Measure the effective context length for your own task.

## 7. Recap

1. Attention is a learned similarity plus a weighted average; kernel regression and OLS share its shape.
2. A transformer block is attention (across tokens) plus an MLP (per token) on a residual stream. BERT and GPT differ in mask and objective.
3. Parameters are about $12 L d^2$ plus embeddings, and the MLP holds most of them. Context length barely changes the count.
4. Modern blocks use pre-norm RMSNorm, SwiGLU, RoPE, and GQA or MLA.
5. A mixture of experts keeps the total large and the active parameters small.
6. During generation, the KV cache and memory traffic are the limit. FlashAttention removes the $n \times n$ traffic but keeps the $n^2$ FLOPs, and a long window is no guarantee the model uses it.

The next lecture covers pretraining and scaling: how the block learns.

## Self-Check

1. Compute the attention scores of "klein" $(0.8, 2.4)$ against "Haus" $(0.4, 3.0)$ and against itself, with $d = 2$ and $q = k = v = x$. Why does "klein" attend more to "Haus"?

> [!success]- Answer
> klein · Haus $= 0.32 + 7.2 = 7.52$, divided by $\sqrt{2}$ gives 5.32. klein · klein $= 0.64 + 5.76 = 6.4$, divided by $\sqrt{2}$ gives 4.53. "Haus" is the longer vector, and dot products reward length, so after softmax "klein" puts 0.67 on "Haus" and 0.30 on itself.

2. Why does attention divide the scores by $\sqrt{d}$?

> [!success]- Answer
> The standard deviation of $q \cdot k$ grows like $\sqrt{d}$ (2.8 at $d = 8$, 32 at $d = 1024$). Without scaling, softmax over such large scores becomes nearly one-hot and puts almost all weight on a single key. Dividing by $\sqrt{d}$ keeps the weights spread out.

3. All keys in a sequence are identical. What does attention return for each query?

> [!success]- Answer
> The plain average of all value vectors. Every score in a row is equal, so softmax gives each key the weight $1/n$, and the query cancels out.

4. In what sense is ordinary least squares an attention mechanism, and what does self-attention change?

> [!success]- Answer
> $\hat{y}_\text{test} = X_\text{test} (X^\top X)^{-1} X^\top y$: the test input is the query, the training inputs are the keys, the outcomes are the values, and $(X^\top X)^{-1}$ is the similarity, with no softmax. Self-attention learns the similarity through $W_Q$ and $W_K$, forces weights to be non-negative and sum to 1, uses the tokens in the context as its "training set", and makes every token query, key and value at once.

5. What does a transformer block consist of, and what does the residual stream do?

> [!success]- Answer
> Norm, attention, residual add, then norm, MLP, residual add. Attention exchanges information between tokens and the MLP processes each token on its own. The residual stream is one running vector per token: each sublayer adds a small update, nothing is overwritten, gradients flow straight down the "+" path, and later layers can read what earlier ones wrote.

6. Why does a transformer need position information, and how do learned positions differ from RoPE?

> [!success]- Answer
> Attention is a weighted sum over a set, so shuffling the input just shuffles the output; "dog bites man" and "man bites dog" would give the same vectors. GPT-2 adds a learned vector $p_i$ to each embedding. RoPE adds nothing: it rotates $q$ and $k$ by their positions in every layer, so the score $q^\top R_{(n-m)\theta} k$ depends only on the distance.

7. Contrast BERT and GPT in mask, objective and use, and give the slide's reasons why decoder-only models won.

> [!success]- Answer
> BERT uses a bidirectional mask, predicts about 15% masked tokens, and is used to classify, tag and embed text. GPT uses a causal mask, predicts the next token at every position, and generates text. Decoder-only won because one model reads and writes, every token is a training signal, and generation is cheap with a KV cache.

8. Use the rule $12 L d^2$ to estimate the block parameters of GPT-2 small. Where do the other 39 M parameters come from?

> [!success]- Answer
> $12 \cdot 12 \cdot 768^2 = 84{,}934{,}656$, about 85 M ($4d^2$ attention plus $8d^2$ MLP per layer). The rest is embeddings: $50{,}257 \cdot 768$ for the vocabulary plus $1{,}024 \cdot 768$ for learned positions, together 39.4 M. With biases and norms the exact total is 124.4 M.

9. GPT-2 small is extended from 1,024 to 2,048 tokens of context. What happens to the parameters, the attention matrix and the KV cache?

> [!success]- Answer
> Parameters grow by $1{,}024 \cdot 768 = 786{,}432$, about 0.6%, because only the position table grows (with RoPE, by 0). The $n \times n$ attention matrix per head grows 4 times and the KV cache 2 times. Context costs compute and memory, not parameters.

10. What does SwiGLU compute, and why is its hidden width about $\frac{8}{3} d$?

> [!success]- Answer
> $W_2(\operatorname{SiLU}(W_1 x) \odot W_3 x)$: a gated MLP whose elementwise product gives degree-2 interactions between features, a soft AND. It has three matrices instead of two, so a hidden width of $\frac{8}{3} d$ keeps the parameter count of a classic $4d$ MLP.

11. Llama 3 8B has 32 query heads and 8 KV heads. How large is its KV cache per token compared with full MHA, and why are queries not cached?

> [!success]- Answer
> 128 KiB instead of 512 KiB per token, 4 times smaller, because the cache scales with the K/V heads. Queries are only needed once: each new token computes its own query vectors and compares them with the cached keys of all earlier tokens.

12. How does MLA give DeepSeek-V3 (671 B) a smaller cache per token than Llama 3 8B?

> [!success]- Answer
> It caches one compressed latent $c_s$ (512 numbers) plus a small shared RoPE key (64 numbers) per token and layer, 576 numbers instead of 40,960 for full MHA. Keys and values are rebuilt per head from the latent, and with $q \cdot (W_{UK} c_s) = (W_{UK}^\top q) \cdot c_s$ attention can even run on the latents directly. That comes to about 69 KiB per token, against 128 KiB for Llama 3 8B.

13. Why does Mixtral 8×7B have 47 B parameters instead of 56 B, and about how many are active per token?

> [!success]- Answer
> Only the MLP is copied 8 times; attention and embeddings are shared. Eight MLPs plus the shared rest give about 47 B. Each token uses 2 experts plus the shared rest, about 13 B. Total parameters set the memory, active parameters the compute.

14. What is router collapse, and how do the Switch Transformer and DeepSeek-V3 prevent it?

> [!success]- Answer
> Popular experts get more training and become more popular until a few experts take almost all tokens. The Switch Transformer adds an auxiliary loss that rewards an even load. DeepSeek-V3 adds no loss and nudges a bias per expert up or down. Balance also matters for hardware, since an overloaded expert's GPU stalls the step.

15. Estimate the KV cache of Llama 3 8B at a 128k context in bf16 and compare it with the weights.

> [!success]- Answer
> $2 \cdot 32 \cdot 8 \cdot 128 \cdot 2 = 131{,}072$ bytes = 128 KiB per token. Times 131,072 tokens gives 16 GiB. The weights are $8.03 \cdot 10^9 \cdot 2$ bytes, about 15 GiB, so one long conversation needs about as much memory as the model.

16. Why can GPT cache keys and values during generation, while BERT cannot?

> [!success]- Answer
> With a causal mask, position $s$ only ever sees tokens up to $s$, so its hidden vectors, and therefore $k_s$ and $v_s$, never change when new tokens arrive. In BERT every token attends to every other, so a new token changes all hidden vectors and everything would have to be recomputed.

17. What does FlashAttention change and what does it leave as it was? Why is the rescaling factor $e^{m - m'}$ needed?

> [!success]- Answer
> It computes attention tile by tile in SRAM and never writes the $n \times n$ matrices $S$ and $P$ to HBM, so memory becomes linear in $n$ and it runs several times faster. The result is exact and the FLOPs stay quadratic. When a later block contains a larger score, the running maximum changes, and $e^{m - m'}$ corrects the sums accumulated under the old maximum.

18. A vendor says its 1-million-token context window means the model uses the whole document. What is wrong with that, and what are the reasons the lecture gives?

> [!success]- Answer
> Fitting into the window does not mean the model uses it: recall drops, especially in the middle, and on RULER only half of the models claiming 32k work well at 32k. The start wins because token 1 is seen by every later token in every layer and attention sinks collect spare weight there; the end wins through RoPE distance decay and the residual stream. Measure the effective context length for your task.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/04-data-and-tokens|Previous: (y-04) Data and Tokens]]
