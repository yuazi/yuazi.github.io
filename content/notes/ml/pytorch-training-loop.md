---
title: "The PyTorch Training Loop"
tags:
  - machine-learning
  - pytorch
  - python
date: 2026-11-05
---

PyTorch does not give you a `fit()` method. You write the loop yourself: fetch a batch, run the model, compute the loss, backpropagate, update the weights. That is more typing than a high-level API, but it also means every step is visible and every bug is findable. Almost every PyTorch project I have written, including the [[work/sudokusolver|Sudoku GNN]], is a variation of the same twenty lines, so this page collects them together with the details that cause the usual problems: devices, evaluation mode, mixed precision, checkpoints and seeds.

## Mental Model

- Four objects drive training: a `Dataset` wrapped in a `DataLoader`, a model (`nn.Module`), a loss function and an optimizer.
- The order inside a step is fixed: clear old gradients, forward pass, loss, backward pass, optimizer step.
- Gradients accumulate into `.grad` by default, so forgetting to clear them silently adds each batch's gradient to the previous one.
- Training and evaluation behave differently. `model.eval()` switches dropout and batch norm, and `torch.no_grad()` stops graph building. They do different things and you usually want both.
- Model and data have to be on the same device, and checkpoints should hold everything needed to resume, not just the weights.

## 1. Dataset and DataLoader

A map-style `Dataset` needs `__len__` and `__getitem__`. The `DataLoader` batches items, shuffles them each epoch and can load in parallel worker processes.

```python
import random

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset, random_split

class ToyDataset(Dataset):
    def __init__(self, n=1000):
        g = torch.Generator().manual_seed(0)
        self.x = torch.randn(n, 20, generator=g)
        self.y = (self.x[:, 0] + self.x[:, 1] > 0).long()    # int64 class ids

    def __len__(self):
        return len(self.x)

    def __getitem__(self, i):
        return self.x[i], self.y[i]

def seed_everything(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)

seed_everything(42)
split_gen = torch.Generator().manual_seed(42)
train_set, val_set = random_split(ToyDataset(), [800, 200], generator=split_gen)
train_loader = DataLoader(train_set, batch_size=64, shuffle=True)
val_loader = DataLoader(val_set, batch_size=256)
```

With `num_workers > 0` on macOS (which starts workers with `spawn`), the dataset must be picklable and the script body needs an `if __name__ == "__main__":` guard, otherwise every worker re-runs your script.

## 2. Model, Loss and Optimizer

```python
device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)
model = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 2)).to(device)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
```

`nn.CrossEntropyLoss` takes raw logits of shape `(N, C)` and integer class ids of shape `(N,)` and dtype `int64`. It applies log-softmax itself, so do not put a softmax in the model. For binary or multi-label targets use `nn.BCEWithLogitsLoss`, which also takes raw logits and float targets. `AdamW` applies weight decay in the decoupled way that is usually wanted; the right values depend on the model.

## 3. The Canonical Loop

```python
for epoch in range(10):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad(set_to_none=True)
        loss = loss_fn(model(x), y)
        loss.backward()
        optimizer.step()

    model.eval()
    correct = 0
    with torch.no_grad():
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            correct += (model(x).argmax(dim=1) == y).sum().item()
    print(f"epoch {epoch}: val acc {correct / len(val_set):.3f}")
```

What each line does:

- `zero_grad` clears the `.grad` of every parameter. `set_to_none=True` frees them instead of filling them with zeros, which is slightly faster and is the default in PyTorch 2.x.
- `loss.backward()` computes the gradient of the loss with respect to every parameter that requires one and adds it to `.grad`.
- `optimizer.step()` applies the update rule using those gradients.
- `model.eval()` makes dropout pass values through and makes batch norm use its running statistics. `torch.no_grad()` skips building the autograd graph, which saves memory and time. `torch.inference_mode()` is a stricter, slightly faster variant for pure inference.

Call `model.train()` again at the start of each epoch, or the model stays in eval mode after the first validation pass. A learning-rate scheduler is stepped after `optimizer.step()`, per batch for schedules defined in steps and per epoch for schedules defined in epochs.

## 4. Devices and Apple MPS

Tensors and the model must be on the same device, or PyTorch raises an error about mixed devices. Move the model once with `.to(device)` and each batch inside the loop. The `mps` backend runs on the GPU of Apple Silicon Macs. Things to know:

- It does not support `float64`. Convert NumPy arrays with `torch.from_numpy(a).float()`, since NumPy defaults to 64-bit.
- Some operators are not implemented for MPS. Setting the environment variable `PYTORCH_ENABLE_MPS_FALLBACK=1` before starting Python makes those run on the CPU instead of raising an error.
- GPU work is asynchronous. To time a step, call `torch.mps.synchronize()` (or `torch.cuda.synchronize()`) before reading the clock.
- For small models the overhead of moving data can make the CPU as fast as the GPU. Measure instead of assuming.

## 5. Mixed Precision, Clipping and a Scheduler

Mixed precision runs most operations in 16 bits to save memory and time. On CUDA, `torch.autocast` picks the precision per operation. With `bfloat16` no loss scaling is needed. With `float16` gradients can underflow, so a `GradScaler` multiplies the loss up before the backward pass. Gradient clipping caps the global gradient norm, which stops one bad batch from throwing the weights far away. With a scaler, call `unscale_` first so the clip threshold applies to the true gradients.

```python
import contextlib

epochs = 10
use_amp = device.type == "cuda"
scaler = torch.amp.GradScaler("cuda", enabled=use_amp)      # torch.amp.GradScaler needs PyTorch 2.3+
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
    optimizer, T_max=epochs * len(train_loader)
)

model.train()
for x, y in train_loader:
    x, y = x.to(device), y.to(device)
    optimizer.zero_grad(set_to_none=True)
    ctx = torch.autocast("cuda", dtype=torch.float16) if use_amp else contextlib.nullcontext()
    with ctx:
        loss = loss_fn(model(x), y)
    scaler.scale(loss).backward()
    scaler.unscale_(optimizer)
    grad_norm = nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    scaler.step(optimizer)
    scaler.update()
    scheduler.step()
```

When the scaler is disabled, `scale`, `unscale_` and `update` do nothing and `step` just calls `optimizer.step()`, so the same loop runs on CPU and MPS in full precision. `clip_grad_norm_` returns the total norm before clipping, which is worth logging: a norm that is far above 1.0 at every step means clipping is doing real work, and sudden spikes point to a bad batch or a learning rate that is too high. Autocast support on MPS has changed between PyTorch releases, so check the documentation for your version before relying on it there.

## 6. Checkpointing

Save the optimizer and scheduler state as well as the model, otherwise resuming restarts Adam's moment estimates and the learning-rate schedule from scratch.

```python
import os

ckpt = {
    "epoch": epoch,
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),
    "scheduler": scheduler.state_dict(),
}
torch.save(ckpt, "ckpt.tmp")
os.replace("ckpt.tmp", "ckpt.pt")            # atomic, so a crash never leaves half a file

ckpt = torch.load("ckpt.pt", map_location=device, weights_only=True)
model.load_state_dict(ckpt["model"])
optimizer.load_state_dict(ckpt["optimizer"])
scheduler.load_state_dict(ckpt["scheduler"])
start_epoch = ckpt["epoch"] + 1
```

Prefer `state_dict()` over pickling the whole model object, which breaks when the class definition moves. `weights_only=True` restricts unpickling to tensors and plain Python containers, which is the safe way to load a file you did not create (newer releases make it the default). For the best-so-far model, keep a separate file written whenever the validation metric improves.

## 7. Seeding and Reproducibility

`seed_everything` above covers Python, NumPy and PyTorch. Data loading with workers needs its own care: give the loader a generator for shuffling and seed the other libraries inside each worker from PyTorch's per-worker seed.

```python
def seed_worker(worker_id):
    s = torch.initial_seed() % 2**32
    np.random.seed(s)
    random.seed(s)

loader = DataLoader(train_set, batch_size=64, shuffle=True, num_workers=4,
                    worker_init_fn=seed_worker, generator=torch.Generator().manual_seed(42))
```

For GPU runs, `torch.use_deterministic_algorithms(True)` makes PyTorch raise an error when an operation has no deterministic implementation, and `torch.backends.cudnn.benchmark = False` avoids autotuned kernel choices that vary between runs. Even then, results are only reproducible on the same hardware and software versions. Do not expect a CUDA run to match an MPS run bit for bit, and treat small differences between seeds as normal when you compare models: run several seeds before claiming one setup beats another.

## 8. Common Bugs Checklist

- Forgot `optimizer.zero_grad()`: the loss behaves oddly and gradients grow from batch to batch.
- Forgot `model.eval()` for validation: dropout stays active and batch-norm statistics come from the validation batch.
- Forgot `torch.no_grad()` in evaluation: memory use climbs because every forward pass builds a graph.
- Accumulating `total_loss += loss` instead of `loss.item()`: it keeps every graph alive and memory grows.
- Softmax before `CrossEntropyLoss`, or sigmoid before `BCEWithLogitsLoss`: the loss is applied twice and training is poor.
- Labels with the wrong dtype or shape: `CrossEntropyLoss` wants `int64` of shape `(N,)`.
- Model on the GPU, batch on the CPU (or the reverse).
- Scheduler stepped before the optimizer.
- Validation data used for fitting anything, including normalization statistics.
- A `.item()` or `.cpu()` call on every step, which forces a synchronization. Log every N steps instead.

Before a long run, check that the pipeline can overfit a single batch of 8 to 32 examples to near-zero loss. If it cannot, the problem is in the code, the labels or the learning rate, not in the amount of data.

## Related

- [[notes/ml/backpropagation|Backpropagation]], which is what `loss.backward()` runs
- [[notes/ml/gradient-descent-and-optimizers|Gradient Descent and Optimizers]], for what `optimizer.step()` computes
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]], for weight decay, validation splits and early stopping
- [[notes/ml/evaluation-metrics|Evaluation Metrics]], for what to compute in the validation loop beyond accuracy
- [[notes/ml/fine-tuning-and-lora|Fine-Tuning and LoRA]], which reuses this loop with most parameters frozen
- [[work/sudokusolver|Solving Sudoku with GNNs]], a PyTorch project built on this loop
