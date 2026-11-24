---
title: "L06 - Pretraining and Scaling"
tags:
  - foundation-models
  - language-models
  - pretraining
  - scaling-laws
  - chinchilla
  - emergence
  - in-context-learning
date: 2026-11-24
---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/05-from-attention-to-modern-llms|Previous: (y-05) From Attention to Modern LLMs]]

## Mental Model First

- Lecture 5 built the transformer block. This lecture trains it. Pretraining turns compute and data into lower loss, and it does so predictably. Abilities follow the loss, though not always in the way the loss curve suggests.
- The text supplies its own exercises. GPT predicts every next token, so one sequence of $n$ tokens gives $n$ targets. BERT predicts the roughly 15% of tokens it masked. The causal mask also makes generation cheap, which is a large part of why decoder-only models took over.
- Training costs about $C \approx 6ND$ FLOPs for $N$ parameters and $D$ tokens: 2 FLOPs per parameter and token forward, 4 backward. Generation costs about $2N$ per token.
- A real run is more than the objective: an optimizer (AdamW, increasingly Muon), a learning-rate schedule with warm-up and decay, low-precision arithmetic with fp32 master weights, fixes against loss spikes, and four ways of splitting the model across thousands of GPUs.
- Mid-training puts the best data last, while the learning rate decays to zero. Long context is trained in afterwards: adjust RoPE, then continue on long documents.
- Loss falls as a power law in compute. For a fixed budget, Chinchilla says to grow parameters and tokens together, about 20 tokens per parameter, so $N \propto \sqrt{C}$. Models that will serve many tokens should be smaller and trained longer.
- Sudden "emergent" abilities often come from the metric. If each step succeeds with probability $p$, a task of $k$ steps succeeds with $p^k$, which stays near zero and then jumps. Small gains per step mean large gains per task.
- A base model continues text. Given a few examples in its prompt it performs a new task without any weight update (in-context learning). Evaluate it in that format, and treat every benchmark score as depending on how it was measured.

## 1. Today's Lecture

The deck calls this Text LMs Lecture 4 (Steffen Staab); in these notes it is lecture 6, and references to other lectures below use the note numbers. It runs about 90 minutes with a short break after Unit 3, and each unit ends with a check question.

| Unit | Time   | Topic                                                  |
| :--- | :----- | :----------------------------------------------------- |
| 1    | 15 min | Objectives: next token versus masked token             |
| 2    | 15 min | Training recipe: compute, optimizers, schedules        |
| 3    | 10 min | Mid-training: annealing, long context                  |
| 4    | 20 min | Scaling laws: bigger model or more data?               |
| 5    | 15 min | Long horizons: emergence, execution                    |
| 6    | 15 min | In-context learning: prompting and testing base models |

After the lecture you should be able to contrast next-token and masked-token training and say what each learns, estimate training compute with $6ND$, explain mid-training, annealing and context extension, use scaling laws to size a model and its data, explain why small gains per step mean large gains per task, and prompt and evaluate a base model in context.

Units 1 to 4 are standard material. The group's own work appears twice: the ICLR 2025 lattice paper in Unit 1 and the ICLR 2026 long-horizon paper in Unit 5. Many of the numbers (compute estimates, the Muon toy, the Chinchilla sizing, the serving trade-off) are the lecturer's own arithmetic from published configs and fits.

## 2. Objectives: What the Model Learns From

### Next Token Versus Masked Token

![[pictures/foundationmodels/06/Lecture06_Pg005_Next_Token_Vs_Masked_Token.png]]

<p class="image-caption">The same transformer block trained with two different targets and masks.</p>

Both objectives are maximum likelihood on raw text, so no labels are needed and the text provides the exercises (self-supervision).

|         | GPT: causal LM ("decoder only")                         | BERT: masked LM ("encoder only")                                 |
| :------ | :------------------------------------------------------ | :--------------------------------------------------------------- |
| Loss    | $\mathcal{L} = -\sum_{t=1}^{n} \log p(x_t \mid x_{<t})$ | $\mathcal{L} = -\sum_{i \in M} \log p(x_i \mid x_{\setminus M})$ |
| Targets | Every position                                          | Only the masked set $M$, about 15%                               |
| Context | Left side only                                          | Both sides of the gap                                            |
| Use     | Generates text left to right                            | Encodes text                                                     |

$x_{\setminus M}$ is the sequence with the positions in $M$ masked. The two masks are the mask matrices from Lecture 5.

### One Sentence, Two Sets of Exercises

![[pictures/foundationmodels/06/Lecture06_Pg006_One_Sentence_Two_Sets_Of_Exercises.png]]

<p class="image-caption">GPT turns "the cat sat on the mat" into six exercises. BERT hides one word and asks for it.</p>

For "the cat sat on the mat", GPT gets six exercises: ⟨start⟩ → the, the → cat, the cat → sat, and so on up to "the cat sat on the → mat". All six come out of one forward pass thanks to the causal mask. BERT masks about 15%, here one of six positions: "the cat [MASK] on the mat → sat".

BERT's masking rule (Devlin et al., 2019, §3.1): of the 15% chosen positions, 80% become [MASK], 10% a random token and 10% stay unchanged. Without the last two cases the model could learn to act only where it sees [MASK], and [MASK] never appears when the model is used.

### Our Work: From Tokens to Lattices

![[pictures/foundationmodels/06/Lecture06_Pg007_From_Tokens_To_Lattices.png]]

<p class="image-caption">Paper spotlight (Xiong and Staab, ICLR 2025): read a concept lattice out of BERT's cloze probabilities.</p>

The group's own paper, "Emergent lattice structures in language models" (Bo Xiong and Steffen Staab, ICLR 2025), asks what masked prediction learns about concepts. A cloze pattern such as "The [MASK]$_g$ is an animal that can [MASK]$_m$" makes BERT score $p(\text{attribute} \mid \text{object, pattern})$ for every pair. That table is a formal context (objects × attributes), and formal concept analysis (FCA) turns it into a concept lattice without any training. It finds concepts nobody named, for example "regions where German and French are spoken".

![[pictures/foundationmodels/06/Lecture06_Pg008_Lattice_Pipeline.png]]

<p class="image-caption">Three steps: ask BERT, threshold the scores into a formal context, build the lattice.</p>

The worked example (illustrative scores) uses six animals and three behaviors:

|       |  fly | hunt | swim |
| :---- | ---: | ---: | ---: |
| eagle | 0.92 | 0.71 | 0.12 |
| dove  | 0.88 | 0.08 | 0.15 |
| wolf  | 0.10 | 0.83 | 0.21 |
| snake | 0.05 | 0.64 | 0.58 |
| frog  | 0.09 | 0.30 | 0.77 |
| fish  | 0.03 | 0.18 | 0.95 |

Scores above $\alpha = 0.5$ count as "has the attribute". FCA then builds the lattice: "fly" holds dove, "hunt" wolf, "swim" frog and fish, "fly ∧ hunt" eagle, "hunt ∧ swim" snake. A concept is a set of objects that share a set of attributes. BERT already holds this structure, and the method only reads it out.

The evaluation uses three domains: 165 regions × 45 languages, 354 animals × 25 behaviors and 122 diseases × 33 symptoms, with BERT-base, three cloze patterns and no training. The first test asks, for each true pair such as Switzerland and German, how high BERT ranks it (Hit@k, the share of true pairs in BERT's top $k$). The baseline uses the closeness of the two words' embeddings instead of BERT's probabilities.

![[pictures/foundationmodels/06/Lecture06_Pg010_Lattice_Results_FCA.png]]

<p class="image-caption">FCA groups, orders and tests concepts. On concept classification it beats the embedding baseline by a wide margin.</p>

The formal context is only a table of pairs. FCA adds three things:

1. Groups: every set of objects that shares a set of attributes becomes a concept, named or not.
2. Order: concepts form a hierarchy. "German ∧ French" (Switzerland, Luxembourg, Belgium, ...) lies below "German" and below "French", and "German, French + more" (European Union) lies below that. The "German ∧ French" concept appears in no ontology.
3. A test: an object belongs to a concept if and only if it has all of its attributes.

| Concept classification, F1      | BERT embeddings | BERT probabilities + FCA |
| :------------------------------ | --------------: | -----------------------: |
| Region and language (BERT-base) |            0.21 |                     0.70 |
| Animal and behavior (BERT-base) |            0.27 |                     0.62 |
| Disease and symptom (BioBERT)   |            0.35 |                     0.61 |

Masked prediction implicitly learns which objects share which attributes.

### Multi-Token Prediction

![[pictures/foundationmodels/06/Lecture06_Pg011_Multi_Token_Prediction.png]]

<p class="image-caption">Predict several future tokens from each position for a denser training signal.</p>

$$
\mathcal{L} = -\sum_t \sum_{k=1}^{K} \log p_k(x_{t+k} \mid x_{\leq t})
$$

One shared trunk feeds $K$ small output heads; Gloeckle et al. (ICML 2024) use $K = 4$. Code models get better on the same data, and generation can become up to 3× faster. DeepSeek-V3 predicts one extra token during training. The gains show up for larger models and for code; small models can get worse.

A group member, Lluis Pastor Perez, works on the generation side of this: how to produce several $x_{t+k}$ in parallel well. The slide's example shows the problem. If "I heard the **\_ \_**" has the continuations "cat meow" and "dog bark", two heads that predict independently can also produce "cat bark" or "dog meow".

### Why Next-Token Prediction Won

![[pictures/foundationmodels/06/Lecture06_Pg013_Next_Token_Prediction_Won.png]]

<p class="image-caption">The causal mask makes both training and generation cheap. Both gaps grow with the text length n.</p>

An encoder can generate text: append [MASK], predict it, append the prediction, repeat. Wang and Cho (2019) sampled text from BERT this way. The comparison is about cost:

|                     | Decoder (GPT)             | Encoder (BERT)                        |
| :------------------ | :------------------------ | :------------------------------------ |
| Lessons per pass    | $n$ (every position)      | 1 (the masked last token)             |
| Cost per new token  | $\sim n$ (past is cached) | $\sim n^2$ (all tokens recomputed)    |
| Trained on its use? | Yes                       | No (trained on masks inside the text) |

In training, one causal pass over $n$ tokens trains all $n$ next-token predictions in parallel. An encoder trained to predict a masked last token gets one target per pass. In generation, earlier tokens never change under causal attention, so their keys and values are cached and each new token costs about $n$. With bidirectional attention every appended token changes all earlier representations, so each step recomputes everything, $n^2$ per token and $n^3$ for the whole text. And a decoder is trained on exactly what it does at inference, while BERT is trained on gaps inside text and would always be asked about the end.

Because a decoder writes text, every task can be posed as text: prompting, in-context learning, instruction tuning and RLHF all build on this. Encoders remain the better and cheaper choice for embeddings, retrieval and classification.

Unit 1 check: one sequence of 1,000 tokens gives GPT 1,000 prediction targets and BERT about 150 (answer B). The other 85% of BERT's tokens only provide context. Per token of data the decoder gets more training signal, which is one reason decoder-only models took over.

## 3. The Training Recipe

### Anatomy of a Pretraining Run

![[pictures/foundationmodels/06/Lecture06_Pg017_Anatomy_Of_A_Pretraining_Run.png]]

<p class="image-caption">Three published runs. Frontier runs use 10²⁴ to 10²⁵ FLOPs over weeks on thousands of GPUs.</p>

|                 | Llama 3 405B        | DeepSeek-V3         | OLMo 2 7B           |
| :-------------- | :------------------ | :------------------ | :------------------ |
| Params (active) | 405 B               | 671 B (37 B)        | 7.3 B               |
| Tokens          | 15.6 T              | 14.8 T              | about 4 T + 50 B    |
| Hardware        | ≤ 16,384 H100       | 2.79 M H800-hours   | H100 cluster        |
| Compute $6ND$   | $3.8 \cdot 10^{25}$ | $3.3 \cdot 10^{24}$ | $1.8 \cdot 10^{23}$ |
| Open            | Weights             | Weights             | Weights, data, code |

DeepSeek-V3's compute uses the 37 B active parameters. OLMo 2 is the running example because everything about it is published.

### Compute ≈ 6 · N · D

![[pictures/foundationmodels/06/Lecture06_Pg018_Compute_6ND.png]]

<p class="image-caption">Two FLOPs per parameter and token forward, four backward.</p>

$$
C \approx 6\, N D, \qquad N = \text{parameters}, \quad D = \text{training tokens}
$$

Worked example, Llama 3 8B on 15 T tokens:

| Quantity                                          |                            Value |
| :------------------------------------------------ | -------------------------------: |
| $6 \times 8.0 \cdot 10^9 \times 15 \cdot 10^{12}$ |        $7.2 \cdot 10^{23}$ FLOPs |
| One H100: 989 TFLOP/s peak × 40% utilization      | $\approx 4 \cdot 10^{14}$ FLOP/s |
| GPU-days                                          |                           21,144 |
| On 16,384 GPUs                                    |                   about 1.3 days |

Check for Llama 3 405B: $6 \times 405\,\text{B} \times 15.6\,\text{T} = 3.8 \cdot 10^{25}$.

Unit 2 check: training costs about 6 FLOPs per parameter and token, generation about 2, because the backward pass needs two gradients per weight matrix (answer A). For one matrix $y = xW$:

| Pass       | Product                                                        | FLOPs per weight and token |
| :--------- | :------------------------------------------------------------- | -------------------------: |
| Forward    | $y = xW$                                                       |                          2 |
| Backward 1 | $\partial L / \partial x = (\partial L / \partial y)\, W^\top$ |                          2 |
| Backward 2 | $\partial L / \partial W = x^\top (\partial L / \partial y)$   |                          2 |

Backward 1 passes the error to the layer below and backward 2 gives the weight gradient. A product with a weight matrix costs 2 FLOPs per weight (multiply and add), so training costs $2 + 2 + 2 = 6$ and generation, forward only, costs 2. The distractors fail for clear reasons. The optimizer runs once per step, and a step covers millions of tokens, so its cost per token is negligible (B). Precision only changes how fast each FLOP runs, so the count stays the same (C). Training reads the true text and scores every position in one pass (teacher forcing), so nothing is generated (D). With a fixed budget $C = 6ND$, doubling $N$ halves $D$, which is the trade-off of Unit 4.

### Optimizers: AdamW and Muon

![[pictures/foundationmodels/06/Lecture06_Pg019_Optimisers_AdamW_And_Muon.png]]

<p class="image-caption">AdamW gives each number its own step size. Muon updates each weight matrix as a whole.</p>

An optimizer decides how a gradient becomes an update.

AdamW (Loshchilov and Hutter, 2019) keeps running means $m_i$ of the gradient and $v_i$ of its square for every parameter, two extra numbers per parameter in memory, and steps

$$
\Delta\theta_i = -\eta\, \frac{m_i}{\sqrt{v_i} + \epsilon}
$$

Parameters with consistently large gradients take smaller steps. The "W" means weight decay is applied directly to the weights, separately from the adaptive step. AdamW has been the standard for LLM pretraining since about 2019.

Muon (Jordan et al., 2024) takes the gradient momentum $M$ of a weight matrix, writes it as $M = U \Sigma V^\top$ and sets all singular values to 1:

$$
\Delta W = -\eta\, U V^\top
$$

The update moves the matrix by the same amount in every direction. In practice $U V^\top$ is approximated with a few Newton-Schulz iterations (a few matrix multiplications) and no SVD is computed. Muon is used for the 2-D weight matrices; embeddings, the output layer and norms keep AdamW.

| Study             | Setting                           | Speed-up over AdamW             |
| :---------------- | :-------------------------------- | :------------------------------ |
| Jordan (2024)     | 124 M to 1.5 B, speed runs        | about 1.3×                      |
| Liu et al. (2025) | 0.4 to 1.5 B, AdamW grid-searched | about 1.9× (52% compute)        |
| Wen et al. (2025) | 0.1 to 1.2 B, all tuned per size  | 1.4×, falling to 1.1× with size |

The more carefully AdamW is tuned and the larger the model, the smaller Muon's gain. Wen et al. compared 11 optimizers, each tuned at each scale, and found that tuning only the learning rate of the standard GPT-3 AdamW recipe already gives up to 2× for a 100 M model, so weakly tuned baselines inflate claims. Muon is consistently faster at the sizes studied, by a modest factor. Whether that holds at 100 B and above is open. Kimi K2 (1.04 T total, 32 B active parameters, 15.5 T tokens) trained with MuonClip, Muon plus QK-Clip, without a loss spike, but there was no AdamW control run, and plain Muon was not stable enough at that scale. Optimizer gains measured at small scale often shrink at large scale, so test at the target size.

### Why Muon Learns Faster

![[pictures/foundationmodels/06/Lecture06_Pg020_Why_Muon_Learns_Faster.png]]

<p class="image-caption">Toy 64 × 64 update with 3 strong directions. Share of the step spent on them: SGD momentum 99%, AdamW-like 75%, Muon 7%.</p>

Updates of transformer weight matrices are often close to low rank: a few directions dominate. In the toy (the lecturer's own computation), a 64 × 64 matrix has three strong singular directions (10, 6, 4) and weak ones up to 0.4. The share of the squared update spent on the top 3 directions:

| Update            | Top-3 share |
| :---------------- | ----------: |
| SGD momentum      |         99% |
| AdamW-like (sign) |         75% |
| Muon              |          7% |

An equal split would be $3/64 \approx 5\%$. With its running averages switched off, Adam is sign descent (Bernstein and Newhouse, 2024). It equalizes the size of each entry, so it rescales numbers, and the strong directions still dominate. Muon gives every direction the same step, so weak directions get learned too. Five Newton-Schulz steps bring all singular values to roughly 0.7 to 1.3. The extra cost is below 1% in typical LM training (Jordan: 0.7% for NanoGPT).

In theory terms, $U V^\top$ is steepest descent when the size of a step is measured by its spectral norm, which bounds how much the step can change a layer's output for any input. The lecture calls this explanation a well-supported intuition. Follow-up work finds that spectral normalization alone does not explain all of the gains of related optimizers such as SOAP.

### Learning-Rate Schedules

![[pictures/foundationmodels/06/Lecture06_Pg021_Learning_Rate_Schedules.png]]

<p class="image-caption">Warm up, hold, cool down. The cool-down is the "annealing" from Lecture 4.</p>

- Warm-up ramps the learning rate up over the first steps to avoid early blow-ups.
- A cosine schedule decays smoothly to zero and fixes the end date in advance.
- Warm-up, stable, decay (WSD; Hu et al., 2024, MiniCPM) holds the maximum and decays over the last stretch, so you can stop and decay at any time.

Annealing means the learning rate goes to zero while the model sees the best data.

### Precision: Fewer Bits per Number

![[pictures/foundationmodels/06/Lecture06_Pg022_Precision.png]]

<p class="image-caption">Half the bits means half the memory traffic and faster matrix products.</p>

| Format     | Sign / exponent / mantissa | Max               | Significant digits |
| :--------- | :------------------------- | :---------------- | -----------------: |
| fp32       | 1 / 8 / 23                 | $3 \cdot 10^{38}$ |            about 7 |
| bf16       | 1 / 8 / 7                  | $3 \cdot 10^{38}$ |            about 3 |
| fp16       | 1 / 5 / 10                 | 65,504            |            about 3 |
| FP8 (E4M3) | 1 / 4 / 3                  | 448               |            about 1 |

The exponent sets the range and the mantissa the number of digits. Adding 0.001 to a weight of 1 shows why the master weights stay in fp32. In bf16 the spacing of numbers near 1 is $2^{-7} = 0.0078$, so $1 + 0.001$ rounds back to 1 and the update is lost; fp32 gives 1.001. Mixed precision therefore does the matrix products in bf16 or FP8 and keeps the sums, the master weights and the optimizer state in fp32 (Micikevicius et al., 2018). bf16 is preferred over fp16 because it has the range of fp32, so nothing overflows; fp16 overflows above 65,504 and needs loss scaling.

DeepSeek-V3 (§3.3) was the first FP8 training at this scale. It uses FP8 only for the big products, with a scale factor per block of 128 (activations per 1 × 128 tile, weights per 128 × 128 block), because a single outlier would otherwise ruin the scale of a whole tensor. Embedding, output head, MoE gating, normalization and attention stay in bf16 or fp32. On H100 tensor cores FP8 products run about twice as fast as bf16.

### Stability: Why Loss Spikes Happen

![[pictures/foundationmodels/06/Lecture06_Pg023_Loss_Spikes.png]]

<p class="image-caption">Growing query and key weights make the softmax one-hot, and the loss spikes.</p>

Most loss spikes in LLM training come from logits that grow too large, in attention or in the output layer. The chain: $W_Q$ and $W_K$ grow, the scores $q \cdot k$ grow, one key takes all the weight, the loss spikes. The order of the scores can stay the same while the weights collapse:

$$
\operatorname{softmax}(1, 2, 3) = (0.09,\ 0.24,\ 0.67), \qquad \operatorname{softmax}(10, 20, 30) = (0.00,\ 0.00,\ 1.00)
$$

A one-hot softmax has near-zero gradients for most entries and very large, unstable gradients for the rest, so small changes flip which key wins. Dehghani et al. (2023, ViT-22B) describe this "attention logit growth".

| Fix                | What it does to the cause                                         |
| :----------------- | :---------------------------------------------------------------- |
| QK-norm (OLMo 2)   | Normalizes $q$ and $k$, so scores stay bounded                    |
| QK-Clip (Kimi K2)  | Shrinks $W_Q$ and $W_K$ when the top score passes a threshold     |
| z-loss (PaLM)      | Adds $10^{-4} (\log Z)^2$ so the output logits stay small as well |
| Last resort (PaLM) | Restart from before the spike and skip those batches              |

PaLM 540B had about 20 spikes. The team restarted about 100 steps before each spike and skipped about 200 to 500 batches. The same batches caused no spikes at other points of training, so bad data alone was not the cause.

### Splitting a Model Across GPUs

![[pictures/foundationmodels/06/Lecture06_Pg024_Splitting_A_Model_Across_GPUs.png]]

<p class="image-caption">Four ways to share the work. Every large run combines them.</p>

| Parallelism | Each GPU holds                              |
| :---------- | :------------------------------------------ |
| Data        | The full model, part of the batch           |
| Tensor      | A slice of every matrix (¼ W on 4 GPUs)     |
| Pipeline    | Consecutive layers (L1 to 8, L9 to 16, ...) |
| Expert      | Some of the experts of an MoE               |

On top of that, ZeRO (2020) shards the optimizer states across GPUs so that no GPU stores all of them. Megatron-LM (2021) combines tensor, pipeline and data parallelism.

## 4. Mid-Training and Long Context

### Mid-Training: The Best Data Comes Last

![[pictures/foundationmodels/06/Lecture06_Pg028_Mid_Training.png]]

<p class="image-caption">A short phase between pretraining and post-training, 1 to 5% of the tokens.</p>

Pretraining uses trillions of tokens, mostly web text. Mid-training is a short phase after it, 1 to 5% of the tokens, and post-training follows in the next lectures. Annealing means the learning rate decays towards 0 while the best data is up-sampled.

- OLMo 2 7B: 50 B tokens of the Dolmino mix after about 4 T tokens.
- Llama 3: learning rate to 0 over the final 40 M tokens.

Late updates are not overwritten by later training, so the best data goes last.

### Why the Context Cannot Simply Be Extended

![[pictures/foundationmodels/06/Lecture06_Pg029_Why_Context_Cannot_Simply_Be_Extended.png]]

<p class="image-caption">With RoPE, positions beyond the trained length produce rotation angles the model never saw.</p>

RoPE rotates dimension pair $j$ by $m \theta_j$ at position $m$, with $\theta_j = b^{-2j/d}$. The slow dimensions never completed a full turn during training, so longer inputs produce angles the model has never seen. The fixes:

1. A larger base $b$ (Llama 3: 500,000) slows the rotation.
2. Squeeze positions into the trained range (position interpolation, Chen et al. 2023; YaRN, Peng et al. 2024).
3. Then train briefly on long documents.

### Long-Context Training in Practice

![[pictures/foundationmodels/06/Lecture06_Pg030_Long_Context_Training_In_Practice.png]]

<p class="image-caption">Llama 3 went from 8k to 128k tokens in six stages.</p>

| Step           | What happens                               |
| :------------- | :----------------------------------------- |
| Pretrain at 8k | Most of the 15.6 T tokens                  |
| 6 stages       | 8k to 128k, about 800 B tokens in total    |
| Gate per stage | Short tasks recovered, long look-up solved |
| Anneal         | Best data, learning rate to 0              |

A 128k window says how much text fits, and recall still drops in the middle (Lecture 5, Unit 5). Long-context data are scarce: books, code repositories, long reports.

Unit 3 check: a model trained on 8k tokens gets a 32k prompt with no other change, and quality collapses because positions beyond 8k produce unseen angles (answer B). Attention itself has no length limit, the position encoding does (A). Nothing truncates the input (C) and the vocabulary is unaffected (D). The fix is to adjust RoPE and train briefly on long documents.

## 5. Scaling Laws

### Loss Falls as a Power Law in Compute

![[pictures/foundationmodels/06/Lecture06_Pg035_Loss_Power_Law_In_Compute.png]]

<p class="image-caption">A straight line on log-log axes over eight orders of magnitude, from the published fit of Kaplan et al. (2020).</p>

$$
L(C) = \left(\frac{C_c}{C}\right)^{0.050}
$$

The same kind of law holds in model size and in data size. Every 10× more compute lowers the loss by the same factor, about 11% ($10^{-0.05} \approx 0.89$).

### What a Power Law Means

![[pictures/foundationmodels/06/Lecture06_Pg036_What_A_Power_Law_Means.png]]

<p class="image-caption">Predictable, and diminishing in the loss.</p>

- Predictable: fit on small runs and extrapolate to the big one. The final loss of GPT-4 was predicted from models trained with up to 10,000× less compute (OpenAI, 2023, §3).
- Diminishing: each equal step down in loss costs 10× more.
- Smooth: there is no sign of a ceiling within the measured range.

Unit 5 asks whether diminishing loss means diminishing usefulness.

### Paper Spotlight: Chinchilla

![[pictures/foundationmodels/06/Lecture06_Pg037_Chinchilla.png]]

<p class="image-caption">Hoffmann et al. (NeurIPS 2022): most large models were undertrained.</p>

"Training compute-optimal large language models" (Hoffmann, Borgeaud, Mensch et al., DeepMind, NeurIPS 2022):

- For a fixed compute budget, grow parameters and tokens in equal proportion.
- Rule of thumb: about 20 training tokens per parameter.
- Chinchilla (70 B on 1.4 T tokens) beats Gopher (280 B on 300 B tokens) with the same compute.
- Kaplan et al. (2020) had favored much larger models on less data.

For a fixed budget, data matters as much as parameters.

### Iso-FLOP Curves

![[pictures/foundationmodels/06/Lecture06_Pg038_Iso_FLOP_Curves.png]]

<p class="image-caption">At fixed compute, a model that is too small underfits and one that is too large sees too little data. The dots mark the best N per budget.</p>

The Chinchilla fit (Approach 3) models the loss as

$$
L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}, \qquad D = \frac{C}{6N}
$$

$E$ is the irreducible loss of the text, the second term the penalty for too few parameters and the third the penalty for too little data. Along one budget $C$, more parameters means fewer tokens, so each curve has a minimum. From $10^{20}$ to $10^{24}$ FLOPs the minimum moves right, from below $10^9$ to a few times $10^{10}$ parameters, and down, from a loss of about 2.6 to about 1.9.

### Compute-Optimal Sizing by Hand

![[pictures/foundationmodels/06/Lecture06_Pg039_Compute_Optimal_Sizing_By_Hand.png]]

<p class="image-caption">A budget of 10²⁴ FLOPs gives about 91 B parameters on 1.8 T tokens.</p>

$$
C = 6ND, \quad D = 20N \quad \Rightarrow \quad C = 120\, N^2 \quad \Rightarrow \quad N = \sqrt{C / 120}
$$

| Budget $C = 10^{24}$ FLOPs | Value                 |
| :------------------------- | :-------------------- |
| $N = \sqrt{10^{24} / 120}$ | about 91 B parameters |
| $D = 20 N$                 | about 1.8 T tokens    |
| Check $6 \cdot N \cdot D$  | $10^{24}$             |

So $N \propto \sqrt{C}$ and $D \propto \sqrt{C}$: 10× more compute gives a model about 3.2× bigger trained on about 3.2× more tokens.

### Compute-Optimal Versus Cheap to Run

![[pictures/foundationmodels/06/Lecture06_Pg040_Compute_Optimal_Vs_Cheap_To_Run.png]]

<p class="image-caption">Three models with the same loss. The red dots mark where the smaller model becomes cheaper in total.</p>

Chinchilla minimizes the cost of training. Once a model is served, every generated token costs about $2N$ FLOPs, so the total cost over $T$ served tokens is

$$
C = 6ND + 2NT
$$

A smaller model needs more training tokens to reach the same quality, which costs more training compute, and it is cheaper per served token. Past a crossover point it is cheaper overall (Sardana et al., 2024). The worked example, with the loss law refitted in 2024 (Besiroglu et al.), targets the loss of a 13 B model trained on 260 B tokens, $L = 2.10$:

| Model | Tokens per parameter | Training compute | Cost per served token | Cheaper in total than 13 B after |
| :---- | -------------------: | ---------------: | --------------------: | :------------------------------- |
| 13 B  |                   20 |               1× |                    1× | (reference)                      |
| 7 B   |                   82 |            1.19× |                 0.54× | 0.33 T served tokens             |
| 3 B   |                2,320 |             6.2× |                 0.23× | 5.3 T served tokens              |

The 3 B model also becomes cheaper than the 7 B after 12.6 T served tokens. For scale, 1 billion requests of 1,000 tokens are 1 T tokens. Heavily used models should be smaller and trained longer.

Practice matches this. Llama 3 8B was trained on about 15 T tokens, about 1,900 per parameter. Llama 3 405B (15.6 T tokens, about 39 per parameter) was chosen as roughly compute-optimal by Meta's own fit for its $3.8 \cdot 10^{25}$ FLOP budget. The small models are the ones trained "too long", on purpose.

The speaker notes add caveats. The fit is extrapolated to 2,320 tokens per parameter. Sardana et al. trained 47 models up to 10,000 tokens per parameter and found quality kept improving, but laws fitted at typical ratios overestimate what extra tokens buy at extreme ratios. Inference cost here counts FLOPs only, with no memory, latency or batching. The example only works with the 2024 refit ($E = 1.8172$, $A = 482.01$, $B = 2085.43$, $\alpha = 0.3478$, $\beta = 0.3658$), which implies about 20 tokens per parameter. Hoffmann et al.'s published constants imply about 70 and disagree with their own other methods.

### What Scaling Laws Are Used For

![[pictures/foundationmodels/06/Lecture06_Pg041_What_Scaling_Laws_Are_Used_For.png]]

<p class="image-caption">Planning instruments for training runs.</p>

- Choose model size and token budget before the big run.
- Compare architectures and data by their curves instead of by one point.
- Transfer hyperparameters from small to large models (μP; Yang et al., 2021).
- Decide when to stop: what does the next 10× buy?

A lower loss does not guarantee a new ability: a 1% lower loss can mean nothing, or a new skill (Unit 5). Fits also depend on the data, the tokenizer and the schedule.

### When Data Runs Out

![[pictures/foundationmodels/06/Lecture06_Pg042_When_Data_Runs_Out.png]]

<p class="image-caption">Repeating data works up to a point.</p>

Public high-quality text is finite, about 300 T tokens (Lecture 4). Muennighoff et al. (NeurIPS 2023): "Up to 4 epochs of repeated data yields negligible changes to loss compared to having unique data." Beyond about 16 epochs, extra compute is nearly wasted. Other ways out are synthetic data (Lecture 4), code and other modalities.

Unit 4 check: if the compute budget grows 10×, the compute-optimal model grows by about $\sqrt{10} \approx 3.2$ (answer B). $N \propto \sqrt{C}$ and $D \propto \sqrt{C}$, and $3.2 \times 3.2 \approx 10$. Growing the model 10× (C) was Kaplan et al.'s advice and produced undertrained models. In practice, if inference matters, go smaller and train longer.

## 6. Emergence and Long Horizons

### Emergent, or a Mirage?

![[pictures/foundationmodels/06/Lecture06_Pg046_Emergent_Or_A_Mirage.png]]

<p class="image-caption">Exact match jumps with scale while the number of wrong digits falls steadily.</p>

The task from Schaeffer, Miranda and Koyejo (2023, §3) is 2-shot addition of two 4-digit numbers with the GPT-3 family from 350 M to 175 B parameters. For $4{,}738 + 5{,}286 = 10{,}024$ the slide constructs three answers:

| Answer | Exact match | Digits wrong |
| :----- | ----------: | -----------: |
| 11,134 |           0 |            3 |
| 10,034 |           0 |            1 |
| 10,024 |           1 |            0 |

Exact match cannot tell 3 wrong digits from 1, and the error count can. Scored by exact match (Wei et al., 2022), small models are near 0% and then accuracy rises sharply, so an ability seems to "emerge" with scale. Scored by the number of wrong digits (Schaeffer et al. used token edit distance), the errors fall steadily with every size step, so the model was improving all along. Both readings are right. For a user a sum is right or wrong, and the skill underneath grows smoothly. With a larger test set all models are above chance, so even the "zero" region is not really zero. The metric explains many reported emergent abilities, not all of them.

### Why Exact Match Jumps

![[pictures/foundationmodels/06/Lecture06_Pg047_Why_Exact_Match_Jumps.png]]

<p class="image-caption">If each of 5 digits is right with probability p, the whole sum is right with p⁵.</p>

The sum 10,024 has 5 digits. If each digit is right independently with probability $p$:

| One digit right, $p$   |  0.3 |  0.5 | 0.7 | 0.8 | 0.9 | 0.99 |
| :--------------------- | ---: | ---: | --: | --: | --: | ---: |
| Whole sum right, $p^5$ | 0.2% | 3.1% | 17% | 33% | 59% |  95% |
| Digits wrong, $5(1-p)$ |  3.5 |  2.5 | 1.5 |   1 | 0.5 | 0.05 |

The error count falls linearly as $p$ rises, while $p^5$ stays tiny and then climbs steeply. Between $p = 0.3$ and $0.5$ a whole wrong digit disappears, and exact match only moves from 0.2% to 3%. The plot assumes $p$ grows linearly in log model size from 0.3 at 350 M to 0.99 at 175 B; these are illustrative values. The longer the answer, the later and steeper the jump: for 10 digits a 50% success rate needs $p \approx 0.93$, for 20 digits $p \approx 0.97$.

### Our Work: The Illusion of Diminishing Returns

![[pictures/foundationmodels/06/Lecture06_Pg049_Illusion_Of_Diminishing_Returns.png]]

<p class="image-caption">Paper spotlight (Sinha, Arun, Goel, Staab and Geiping, ICLR 2026): measuring long-horizon execution in LLMs.</p>

If the step accuracy $p$ is constant and the model never corrects itself, the task length that succeeds with probability $s$ is

$$
H_s(p) = \frac{\ln s}{\ln p}
$$

(Prop. 1 of the paper). Benchmarks of short tasks show diminishing gains in $p$, while the length of tasks that succeed grows hyperbolically in $p$.

### Horizon Length Versus Step Accuracy

![[pictures/foundationmodels/06/Lecture06_Pg050_Horizon_Length_Vs_Step_Accuracy.png]]

<p class="image-caption">Task length that succeeds half the time, H = ln 0.5 / ln p.</p>

| Step accuracy $p$ | Horizon $H_{0.5}$ |
| :---------------- | ----------------: |
| 90%               |           7 steps |
| 99%               |          69 steps |
| 99.9%             |         693 steps |

Each extra "9" of step accuracy multiplies the horizon by ten.

### Long Tasks Fail in Execution

![[pictures/foundationmodels/06/Lecture06_Pg051_Execution_Fails_Not_Knowledge.png]]

<p class="image-caption">Key-value addition gives the model the plan and the dictionary, so only execution is tested.</p>

The task: a dictionary such as apple = −82, grape = 56 is given, and each turn names a key whose value the model adds to a running sum (turn 1 "apple" → −82, turn 2 "grape" → −26, ...). The plan and the knowledge are in the prompt, so only execution is tested. The paper's findings:

- The first step is near-perfect, yet Qwen3-32B drops below 50% accuracy within 15 turns.
- Larger models execute many more turns.
- Self-conditioning: the model's own past errors in the context cause new ones, and scale does not fix this.
- Thinking helps (a later lecture covers it). In a single turn, GPT-5 executes 2,176 steps and Gemini 2.5 Pro 120.

Long tasks fail through compounding execution errors. Because of self-conditioning, real steps are not independent, so long-task success can fall even faster than $p^k$.

Unit 5 check: on 30-step tasks scored all-or-nothing, a new model solves 30% and its predecessor 2%. Probably no new ability emerged; a small gain per step was compounded 30 times (answer A).

|             | Per step right | Whole task right ($p^{30}$) | Wrong steps |
| :---------- | -------------: | --------------------------: | ----------: |
| Predecessor |     $p = 0.88$ |                          2% |         3.6 |
| New model   |     $p = 0.96$ |                         29% |         1.2 |

Eight points better per step gives 13× more solved tasks. To check, measure accuracy per step across models: smooth growth means no new ability, only multiplication. The end-to-end jump alone cannot show that something new appeared, because $p^{30}$ predicts it (B, C). D gets it backwards: all-or-nothing scoring gives no partial credit, which is why it hides progress and then jumps.

## 7. In-Context Learning

### Paper Spotlight: GPT-3

![[pictures/foundationmodels/06/Lecture06_Pg055_GPT3_Few_Shot_Learners.png]]

<p class="image-caption">Brown et al. (NeurIPS 2020): learning from the prompt without weight updates.</p>

"Language models are few-shot learners" (Brown, Mann, Ryder, Subbiah et al., OpenAI, NeurIPS 2020):

- 175 B parameters, trained only on next-token prediction.
- Zero-shot gives the model a task description; one-shot and few-shot add examples to the prompt.
- Few-shot gains grow with model size.
- There is no gradient step. The "learning" happens in the forward pass.

A large base model can be programmed by examples in its context.

### Few-Shot Prompting a Base Model

![[pictures/foundationmodels/06/Lecture06_Pg056_Few_Shot_Prompting_A_Base_Model.png]]

<p class="image-caption">The base model copies format and task from the examples. Shown live with Qwen2.5-0.5B (base).</p>

```text
Translate English to German:
sea otter => Seeotter
peppermint => Pfefferminze
plush giraffe => Plüschgiraffe
cheese =>
```

The base model continues with "Käse". Zero-shot, without examples, it often rambles. With a few examples it copies the format and the task. The prompt format follows Brown et al. (2020), Fig. 2.1.

### Why Does In-Context Learning Work?

![[pictures/foundationmodels/06/Lecture06_Pg057_Why_In_Context_Learning_Works.png]]

<p class="image-caption">Three complementary views.</p>

- Task inference: the examples tell the model which of its known tasks is meant (Xie et al., ICLR 2022).
- An algorithm in the forward pass: attention can perform regression steps on the examples (von Oswald et al., ICML 2023).
- Lecture 5: least squares is attention, and the context plays the "training set" (Goulet Coulombe, 2026).

The flip side from Unit 5 is that the model also conditions on its own errors. Pretraining on next tokens produces a model that adapts to its prompt, and the lectures to come build on that.

### Base Model Versus Chat Model

![[pictures/foundationmodels/06/Lecture06_Pg058_Base_Vs_Chat_Model.png]]

<p class="image-caption">A base model continues text. It does not answer questions.</p>

| Base model (after pretraining)     | Chat model (after post-training)     |
| :--------------------------------- | :----------------------------------- |
| Continues any text                 | Follows instructions                 |
| Frame the task as text to complete | Answers in a chat template           |
| Few-shot examples set the format   | Refuses some requests (next lecture) |

To evaluate a base model, score each answer option by its log-likelihood under the model, with no generation needed. This is the same probability that gives the perplexity (Lecture 3).

### Benchmarks for Base Models

![[pictures/foundationmodels/06/Lecture06_Pg059_Benchmarks_For_Base_Models.png]]

<p class="image-caption">What common benchmarks test, and in which format.</p>

| Benchmark | Tests                        | Format                |
| :-------- | :--------------------------- | :-------------------- |
| MMLU      | Knowledge in 57 subjects     | 4 options, A to D     |
| HellaSwag | Commonsense sentence endings | 4 endings             |
| ARC       | Grade-school science         | Multiple choice       |
| GSM8K     | Grade-school math            | Free answer, a number |

The same model on the same benchmark gets different scores depending on the prompt, the number of shots, and cloze versus A-to-D scoring. OLMES (Gu et al., 2024) fixes these choices so that results become comparable.

### The Score Depends on the Setup

![[pictures/foundationmodels/06/Lecture06_Pg060_Score_Depends_On_Setup.png]]

<p class="image-caption">Four questions to ask before trusting a number.</p>

1. Format: cloze or A to D? How many examples?
2. Prompt: does a small rewording change the score?
3. Contamination: was the test set in the training data (Lecture 4)?
4. Data bias: did the quality filter favor benchmark-like text (FineWeb-Edu)?

The slide's advice is to report this setup along with every score.

Unit 6 check: a base model scores 25% on 4-option MMLU when asked zero-shot, chat style. That is chance level and possibly a format problem (answer B). A base model may not answer with a letter at all. Try few-shot examples or score the options by log-likelihood, and only then compare with other models. A base model should be tested as text continuation, the format it was trained on.

## 8. Recap

1. Objectives: with next-token prediction every position is a lesson, and the causal mask makes training and generation cheap.
2. Compute: $C \approx 6ND$.
3. Mid-training: anneal on the best data, then extend the context.
4. Scaling laws: loss follows power laws; about 20 tokens per parameter for training cost, more if the model will be served a lot.
5. Long horizons: small gains per step become large gains per task.
6. In context: base models learn from the prompt.

The next lecture is post-training I: instruction tuning (SFT), LoRA and model merging, RLHF (InstructGPT), DPO, safety and jailbreaks, and evaluating assistants (BLEU and why it fails, win rates, LLM-as-judge).

## Self-Check

1. One sequence of 1,000 tokens. How many prediction targets does a training pass give GPT, and how many BERT?

> [!success]- Answer
> GPT gets 1,000, one next-token prediction per position from a single forward pass. BERT gets about 150, the 15% masked positions; the rest only provide context.

2. Why does BERT replace only 80% of the chosen positions with [MASK]?

> [!success]- Answer
> [MASK] never appears when the model is used. If every chosen position showed [MASK], the model could learn to work only there. So 10% of the chosen positions get a random token and 10% stay unchanged, and the model has to build a good representation for every token.

3. BERT can generate text by appending [MASK] and predicting it. Why did decoders win anyway?

> [!success]- Answer
> A causal pass trains all $n$ next-token predictions at once, while an encoder predicting the masked last token gets one target per pass. During generation the decoder caches keys and values, about $n$ work per token; the encoder must recompute every earlier token, about $n^2$ per token. And the decoder is trained on exactly what it does at inference, while BERT is trained on gaps inside text.

4. In Xiong and Staab (ICLR 2025), how is a concept lattice obtained from BERT without training, and what does FCA add to the table of pairs?

> [!success]- Answer
> A cloze pattern such as "The [MASK] is an animal that can [MASK]" gives $p(\text{attribute} \mid \text{object})$ for every pair. Thresholding the scores gives a formal context, and formal concept analysis builds the lattice. FCA adds groups (every set of objects sharing a set of attributes becomes a concept, named or not), an order (German ∧ French lies below German and French) and a membership test (an object belongs to a concept iff it has all its attributes). F1 on concept classification rises from 0.21 to 0.70 for regions and languages.

5. Estimate the training compute of Llama 3 8B on 15 T tokens and the time on 16,384 H100s at 40% utilization.

> [!success]- Answer
> $6 \cdot 8 \cdot 10^9 \cdot 15 \cdot 10^{12} = 7.2 \cdot 10^{23}$ FLOPs. One H100 delivers about $989 \cdot 10^{12} \cdot 0.4 \approx 4 \cdot 10^{14}$ FLOP/s, which gives about 21,000 GPU-days, or about 1.3 days on 16,384 GPUs.

6. Why does training cost about 6 FLOPs per parameter and token, and generation about 2?

> [!success]- Answer
> For each weight matrix the forward product $y = xW$ costs 2 FLOPs per weight and token. Backpropagation needs two products of the same size: $\partial L / \partial x$ to pass the error down and $\partial L / \partial W$ for the update, 2 FLOPs each. Generation only runs the forward pass. The optimizer runs once per step, which is negligible per token.

7. How do AdamW and Muon turn a gradient into an update, and why does Muon learn weak directions faster?

> [!success]- Answer
> AdamW divides each parameter's gradient mean by the root of its squared-gradient mean, so it rescales single numbers. Muon takes the momentum matrix $M = U \Sigma V^\top$ and updates by $-\eta U V^\top$, setting every singular value to 1 (approximated by Newton-Schulz iterations). Weight updates are dominated by a few directions; AdamW leaves them dominant (75% of the step in the toy), while Muon gives every direction the same step (7%), so weak directions get learned too.

8. How large is Muon's speed-up over AdamW, and why should claims be read carefully?

> [!success]- Answer
> About 1.3× (Jordan), 1.9× (Liu et al., AdamW grid-searched) and 1.4× falling to 1.1× with size (Wen et al., all optimizers tuned per size). The better AdamW is tuned and the larger the model, the smaller the gain. Tuning only AdamW's learning rate already gives up to 2× at 100 M, so weak baselines inflate claims, and no 100 B+ comparison with an AdamW control exists.

9. Why are master weights kept in fp32 when products run in bf16, and why bf16 instead of fp16?

> [!success]- Answer
> bf16 has only about 3 significant digits; near 1 its spacing is $2^{-7} \approx 0.008$, so adding an update of 0.001 rounds back to 1 and the update is lost. fp32 keeps 1.001. So products run in bf16 or FP8 and sums, weights and optimizer state stay in fp32. bf16 has the same exponent range as fp32, so nothing overflows, while fp16 overflows above 65,504 and needs loss scaling.

10. Explain the chain behind attention-related loss spikes and two fixes.

> [!success]- Answer
> $W_Q$ and $W_K$ grow, the scores $q \cdot k$ grow, and the softmax becomes one-hot: softmax(10, 20, 30) puts all weight on one key, even though the order matches softmax(1, 2, 3). Gradients become unstable and the loss spikes. QK-norm normalizes $q$ and $k$ so scores stay bounded; QK-Clip shrinks $W_Q$ and $W_K$ when the top score passes a threshold. z-loss does the same for the output logits.

11. What is annealing, and why does the best data go last?

> [!success]- Answer
> The learning rate decays towards 0 while the best data is up-sampled, in mid-training, 1 to 5% of the tokens (OLMo 2 7B: 50 B Dolmino tokens after about 4 T). Updates made late are not overwritten by further training, so the highest-quality data has the most lasting effect when it comes last.

12. A model trained on 8k tokens gets a 32k prompt. What happens, and how is context extended properly?

> [!success]- Answer
> Quality collapses. RoPE's slow dimensions never completed a turn during training, so positions beyond 8k produce rotation angles the model never saw. The fix is to adjust the positions, with a larger RoPE base (Llama 3: 500,000) or by squeezing positions into the trained range (interpolation, YaRN), and then train on long documents. Llama 3 did this in six stages from 8k to 128k with about 800 B tokens.

13. With a budget of $10^{24}$ FLOPs, how big should a compute-optimal model be, and on how many tokens?

> [!success]- Answer
> With $C = 6ND$ and $D = 20N$, $C = 120 N^2$, so $N = \sqrt{10^{24} / 120} \approx 91$ B parameters and $D = 20N \approx 1.8$ T tokens.

14. The compute budget grows 10×. How should model size and data grow, and what did Kaplan et al. (2020) recommend instead?

> [!success]- Answer
> Both grow with $\sqrt{C}$, so about 3.2× each, and $3.2 \times 3.2 \approx 10$. Kaplan et al. favored putting most of the extra compute into a bigger model, which produced undertrained models; Chinchilla 70 B on 1.4 T tokens beat Gopher 280 B on 300 B tokens at the same compute.

15. Why was Llama 3 8B trained on about 1,900 tokens per parameter, far beyond Chinchilla's 20?

> [!success]- Answer
> Chinchilla minimizes training compute only. Serving costs about $2N$ FLOPs per generated token, so the total is $6ND + 2NT$. A smaller model trained longer reaches the same quality with more training compute and a lower cost per served token, and past a crossover it is cheaper overall. In the lecture's example a 7 B model matching a 13 B Chinchilla model is cheaper in total after 0.33 T served tokens, a 3 B model after 5.3 T.

16. Exact match on 4-digit addition jumps sharply with model size. Why is that often called a mirage?

> [!success]- Answer
> If each of the 5 answer digits is right with probability $p$, the whole sum is right with $p^5$, which stays near zero and then climbs steeply, while the expected number of wrong digits $5(1-p)$ falls steadily. Schaeffer et al. showed that a continuous metric gives smooth, predictable improvement. The threshold is real for the user, since a sum with one wrong digit is useless, but the skill underneath grows smoothly.

17. Using $H_s = \ln s / \ln p$, how long a task succeeds half the time at step accuracies of 90%, 99% and 99.9%?

> [!success]- Answer
> About 7, 69 and 693 steps. Each extra 9 of step accuracy multiplies the horizon by ten, so small gains per step mean large gains on long tasks.

18. On 30-step all-or-nothing tasks a new model solves 30% and its predecessor 2%. Has a new ability emerged?

> [!success]- Answer
> Probably not. $0.88^{30} \approx 2\%$ and $0.96^{30} \approx 29\%$: eight points per step give 13× more solved tasks. To check, measure per-step accuracy across models; smooth growth means no new ability. Self-conditioning on own errors can make long tasks fail even faster than $p^{30}$.

19. What does the key-value addition task test, and what did Sinha et al. find?

> [!success]- Answer
> The dictionary and the plan are given, so only execution is tested. The first step is near-perfect, yet Qwen3-32B falls below 50% within 15 turns. Larger models execute more turns, but self-conditioning (own past errors cause new ones) is not fixed by scale. Thinking helps: GPT-5 executes 2,176 steps in one turn, Gemini 2.5 Pro 120.

20. A base model scores 25% on 4-option MMLU, asked zero-shot chat style. What does that show, and what should you do?

> [!success]- Answer
> 25% is chance with four options, which may be a format problem: a base model may not answer with a letter at all. Use few-shot examples or score each option by its log-likelihood, and only then compare. Also ask about format, prompt sensitivity, contamination and data bias before trusting any benchmark number.

---

[[/notes/lectures/foundationmodels/index|Back to Foundation Models Index]] | [[/notes/lectures/foundationmodels/05-from-attention-to-modern-llms|Previous: (y-05) From Attention to Modern LLMs]]
