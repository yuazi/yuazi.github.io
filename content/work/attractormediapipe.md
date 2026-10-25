---
title: "Gestural Attractors"
tags:
  - work
  - projects
  - python
  - moderngl
  - mediapipe
  - chaos
  - generative
date: 2026-03-11
github: https://github.com/yuazi/attractormediapipe
---

[View on GitHub](https://github.com/yuazi/attractormediapipe)

![[pictures/work/attractormediapipe/demo.gif]]

Strange attractors are usually explored through static plots and parameter sliders. I wanted to steer one with my hands, so I built **AttractorMediaPipe**. It draws one of nine chaotic systems as a glowing particle trail and reads hand gestures from a webcam through MediaPipe. It also exports dense, high-resolution snapshots with Datashader.

---

## What It Demonstrates

- Nine attractors (Lorenz, Aizawa, Sprott B, Thomas, Dadras, Chen, Langford, Rossler and Halvorsen), each with a Numba-compiled RK4 stepper.
- A ModernGL renderer that keeps the trail in a ring buffer and draws the newest 100,000 points as additive point sprites, with age-based fading in the fragment shader.
- A GPU transform-feedback stepper that falls back to the Numba CPU path automatically when the OpenGL context doesn't support it.
- MediaPipe hand tracking mapped to camera and scene controls, with keyboard and mouse controls when there's no camera.
- A separate Datashader export path for multi-million-point snapshots with embedded PNG metadata.
- Unit tests for controls, snapshots, renderer behavior and GPU/CPU equivalence.

---

## Stepping the Equations

Every system is integrated with fourth-order Runge-Kutta (RK4), which stays accurate at much larger time steps than plain Euler integration. Here is the idea in NumPy, written once so it works for any of the systems:

```python
import numpy as np


def lorenz(s, sigma=10, rho=28, beta=8 / 3):
    x, y, z = s
    return np.array([sigma * (y - x), x * (rho - z) - y, x * y - beta * z])


def rk4_step(f, s, dt):
    k1 = f(s)
    k2 = f(s + dt / 2 * k1)
    k3 = f(s + dt / 2 * k2)
    k4 = f(s + dt * k3)
    return s + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
```

The project's steppers are Numba-compiled, but the math is the same.

---

## How It Works

### 1. Live View

`ModernGL` and `pygame` draw the newest 100,000 trail points over a procedural background and a separate fog layer, which keeps the attractor readable without flattening it. When the OpenGL context supports transform feedback, a shader advances the simulation on the GPU. Otherwise the app switches to the Numba CPU stepper, so it still runs on machines with modest graphics.

For the math behind these systems, see my note on [[notes/random/lorenz-attractor|The Lorenz Attractor]].

![[pictures/attractor_aizawa.png]]

<p class="image-caption">Aizawa attractor with grain-texture background</p>

![[pictures/lorenz_8k_textured.png]]

<p class="image-caption">8K Lorenz attractor export with density-based coloring</p>

### 2. Gesture Control

MediaPipe tracks both hands. The left hand sets speed and luminosity, the right hand controls yaw, pitch and zoom, and pinky touches reset the scene or switch attractors. Changes are interpolated, so the scene eases into a new state instead of jumping with every twitch of the hand. A focus mode reduces the interface to a slim bar for use on stage.

### 3. Snapshot Pipeline

Pressing `S`, or running with `--snapshot-only`, switches to the export path. It doesn't save the live framebuffer. Datashader generates 5,000,000 points by default and rasterizes them at 5120×2880. Each export writes a clean and a textured PNG in one of four presets (nebula, blueprint, void, print). It embeds the attractor, parameters and resolution as PNG text metadata, and appends an entry to a JSONL log.

---

## Project Structure

- `attractors/`: equations and the attractor manager for all nine systems.
- `hands/`: MediaPipe tracking and gesture interpretation.
- `renderer/`: the ModernGL live scene and the Datashader export path.
- `main.py`: the application loop, CLI modes and control mapping.

---

## Usage & Controls

Run the viewer with your webcam:

```bash
python main.py
```

Render snapshots in batch mode without the UI:

```bash
python main.py --snapshot-only
```

Run in keyboard and mouse mode without a camera:

```bash
python main.py --no-camera
```

---

## Getting Started

The dependencies (pygame, ModernGL, Numba, Datashader, OpenCV and MediaPipe) are pinned in `requirements.txt`.

```bash
git clone https://github.com/yuazi/attractormediapipe
cd attractormediapipe
pip install -r requirements.txt
```

---

[[notes/random/lorenz-attractor|The Lorenz Attractor]] | [[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
