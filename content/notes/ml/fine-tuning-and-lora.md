---
title: "Fine-Tuning and LoRA"
tags:
  - machine-learning
  - deep-learning
  - fine-tuning
date: 2026-11-05
---

Fine-tuning takes a pretrained model and continues training it on a smaller, task-specific dataset. It is how a general language or vision model becomes a classifier, a chat assistant or a domain expert. Updating every weight works but is expensive in memory, and it produces a full copy of the model per task. Low-rank adaptation (LoRA) freezes the pretrained weights and trains a small additive update instead, which cuts the trainable parameters by two to three orders of magnitude and often matches full fine-tuning on the target task.

## Mental Model

- Pretraining learns general features; fine-tuning nudges them toward a task. The change in the weights is often small and structured, which is the bet behind low-rank updates.
- Training memory is dominated by gradients and optimizer states, and those exist only for trainable parameters. Freezing most of the model saves most of the memory.
- LoRA represents the update to a weight matrix as the product of two thin matrices, $\Delta W = BA$. Initializing $B$ to zero makes the adapted model start identical to the base model.
- After training, $BA$ can be added into $W$, so inference costs nothing extra, and the small adapter files are easy to swap.
- Narrow fine-tuning can erase general abilities (catastrophic forgetting). Low learning rates, short schedules and mixing in general data help.

## 1. Full Fine-Tuning and Its Cost

Full fine-tuning updates all $N$ parameters. With Adam, each parameter needs a gradient and two moment estimates in addition to the weight. A common accounting for mixed-precision training is 16 bytes per parameter: 2 for 16-bit weights, 2 for 16-bit gradients, 4 for an fp32 master copy of the weights, and 8 for the two fp32 Adam moments. For a 7-billion-parameter model that is $7 \times 10^9 \cdot 16 = 112$ GB before counting activations. Each fine-tuned task then also needs its own full checkpoint to store and deploy.

## 2. Parameter-Efficient Fine-Tuning

Parameter-efficient fine-tuning (PEFT) trains a small number of new or selected parameters while the base model stays frozen. The main families:

- Adapters (Houlsby et al., 2019) insert small bottleneck MLPs (down-project, nonlinearity, up-project, with a residual connection) after the attention and feed-forward sublayers. They add a little inference latency because they are extra layers.
- Prefix tuning (Li and Liang, 2021) learns a short sequence of continuous vectors that is prepended to the keys and values at every layer. Prompt tuning (Lester et al., 2021) is the simpler variant that learns soft tokens only at the input.
- LoRA (Hu et al., 2021) adds low-rank updates to existing weight matrices and can be merged back into them.

LoRA became the default largely because the merged model has the same architecture and speed as the original.

## 3. LoRA

For a frozen weight $W_0 \in \mathbb{R}^{d \times k}$, LoRA learns

$$
W = W_0 + \frac{\alpha}{r} BA, \qquad B \in \mathbb{R}^{d \times r}, \; A \in \mathbb{R}^{r \times k}, \; r \ll \min(d, k).
$$

The forward pass is $h = W_0 x + \frac{\alpha}{r} B(Ax)$. The rank $r$ limits how expressive the update is, and $\alpha$ is a scaling constant. Dividing by $r$ keeps the size of the update roughly stable when you change the rank, so that the learning rate does not need to be retuned every time.

### Initialization

$A$ gets a random initialization (Gaussian in the paper, Kaiming-uniform in common implementations) and $B$ starts at zero, so $\Delta W = 0$ at step 0 and the adapted model is exactly the base model. Only one of the two should be zero. The gradient with respect to $B$ depends on $A$, and the gradient with respect to $A$ depends on $B$. With both at zero, both gradients would be zero and nothing would train. With $B = 0$ and $A$ random, $B$ gets a nonzero gradient on the first step and $A$ follows once $B$ has moved.

### Parameter Savings

> [!example] Worked example
> A 4096 x 4096 weight matrix has $4096^2 = 16{,}777{,}216$ parameters. A rank-$r$ update trains $r(d + k) = 8192\, r$ of them:
>
> | Rank | Trainable parameters | Share of the full matrix |
> | ---- | -------------------- | ------------------------ |
> | 8    | 65,536               | 0.39%                    |
> | 16   | 131,072              | 0.78%                    |
> | 64   | 524,288              | 3.1%                     |
>
> If a model has 32 layers and you adapt the four 4096 x 4096 attention projections in each at rank 8, you train $32 \cdot 4 \cdot 65{,}536 = 8{,}388{,}608$ parameters, about 8.4 million.

The update matrix $BA$ has rank at most $r$, so LoRA can only represent updates in a low-dimensional subspace. The original paper found that this was enough for the tasks it tried, and later work adapts all linear layers (attention and MLP) rather than only the query and value projections.

A layer in PyTorch:

```python
import math
import torch
import torch.nn as nn

class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r: int = 8, alpha: int = 16):
        super().__init__()
        self.base = base
        for p in self.base.parameters():
            p.requires_grad_(False)                       # freeze W0 and bias
        self.A = nn.Parameter(torch.empty(r, base.in_features))
        self.B = nn.Parameter(torch.zeros(base.out_features, r))
        nn.init.kaiming_uniform_(self.A, a=math.sqrt(5))
        self.scale = alpha / r

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale
```

Only `A` and `B` receive gradients, so the optimizer should be built from `[p for p in model.parameters() if p.requires_grad]`. The Hugging Face `peft` library wraps this pattern: `LoraConfig(r=16, lora_alpha=32, target_modules=[...], lora_dropout=0.05)` and `get_peft_model(model, config)`, with module names that differ per architecture. A numpy version of the same math, which I ran, confirms two properties: the output equals the base output when $B = 0$, and $W_0 + \frac{\alpha}{r} BA$ gives the same outputs as the two-path form.

## 4. QLoRA

QLoRA (Dettmers et al., 2023) makes LoRA fit on a single GPU for large models. The frozen base weights are stored in 4-bit NormalFloat (NF4), a data type suited to normally distributed weights, with the quantization constants themselves quantized (double quantization) and paged optimizers to absorb memory spikes. The weights are dequantized on the fly to a higher-precision compute type, and the LoRA matrices stay in higher precision and get the gradients. For a 7-billion-parameter model the 4-bit base is about $7 \times 10^9 \cdot 0.5 = 3.5$ GB. That is a lower bound on the footprint, since activations, adapters, optimizer states and quantization constants come on top.

## 5. Catastrophic Forgetting

Training only on a narrow dataset can overwrite capabilities that the pretrained model had: a model tuned on legal text may lose arithmetic or instruction-following. Things that reduce it:

- A small learning rate and one to three epochs, not a long schedule.
- Mixing a share of general data into the fine-tuning set (replay).
- LoRA or other adapter methods, which restrict how far the weights can move, and which can be switched off to recover the base model.
- Evaluating on a general benchmark before and after, not only on the target task.

## 6. Practical Defaults

These are common starting points seen in tutorials and papers, not rules, and the right values depend on the model and the data.

| Setting                          | Common starting point                                           |
| -------------------------------- | --------------------------------------------------------------- |
| LoRA rank $r$                    | 8 to 64, 16 is a frequent pick                                  |
| LoRA $\alpha$                    | equal to $r$ or $2r$                                            |
| LoRA dropout                     | 0.05 to 0.1                                                     |
| Target modules                   | all linear layers, or at least the attention projections        |
| Learning rate (LoRA)             | around $10^{-4}$ to $3 \times 10^{-4}$                          |
| Learning rate (full fine-tuning) | around $10^{-5}$ to $5 \times 10^{-5}$, lower for bigger models |
| Epochs                           | 1 to 3                                                          |
| Schedule                         | short linear warmup, then cosine or linear decay                |
| Effective batch size             | 16 to 128, using gradient accumulation if memory is tight       |

If a run underfits, raise the rank or add target modules before touching anything else. If it overfits or forgets, lower the learning rate, shorten training, or add data.

## Related

- [[notes/ml/attention-and-transformers|Attention and Transformers]], for the projection matrices LoRA usually targets
- [[notes/ml/pytorch-training-loop|The PyTorch Training Loop]], including mixed precision and checkpointing
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]], for why Adam's two moments cost so much memory
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]], for overfitting on small fine-tuning sets
- [[notes/ml/reinforcement-learning|Reinforcement Learning]], where RLHF is the usual last tuning stage
- [[notes/lectures/foundationmodels/02-ml-basics|Foundation Models 02: ML Basics]], background on pretraining and transfer
