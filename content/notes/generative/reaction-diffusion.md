---
title: "Reaction-Diffusion (Gray-Scott)"
tags:
  - math
  - generative-art
  - simulation
date: 2026-11-05
---

Reaction-diffusion systems make spots, stripes and labyrinths out of two chemicals that react and spread at different speeds. The Gray-Scott model is the version that is easiest to put on a GPU: two fields, one Laplacian each, a few multiplications per pixel per step. Changing two numbers moves you between coral, spots that divide like cells, and moving worms.

![[pictures/topics/generative/reaction-diffusion.png]]

<p class="image-caption">Two pretend chemicals spread and react, and spots and stripes appear by themselves. Image: Jonathan Lidbeck from Eugene, USA, CC BY 2.0, via <a href="https://commons.wikimedia.org/wiki/File:Gray-Scott_Lotus_(2125994225).jpg">Wikimedia Commons</a>.</p>

## Mental Model

- Two fields $u$ and $v$ on a grid. $u$ is fed in from outside and eaten by $v$; $v$ reproduces by eating $u$ and is removed at a slow rate.
- Both spread by diffusion, but $v$ spreads slower than $u$. That speed difference is what lets patterns form (a Turing instability).
- Pattern type is set almost entirely by the feed rate $F$ and kill rate $k$. Diffusion constants stay fixed.
- The simulation is a stencil: each cell reads its 3 by 3 neighborhood. Two textures swapped every step ("ping-pong") implement it on a GPU.

## 1. The Equations

The reaction is $U+2V\to3V$ (V catalyzes its own production from U) plus $V\to P$ (V decays to an inert product). With concentrations $u$ and $v$:

$$
\frac{\partial u}{\partial t}=D_u\nabla^2u-uv^2+F(1-u)
$$

$$
\frac{\partial v}{\partial t}=D_v\nabla^2v+uv^2-(F+k)v
$$

The term $uv^2$ is the reaction rate: it removes $u$ and adds the same amount to $v$. $F(1-u)$ pulls $u$ back toward 1 at rate $F$. $(F+k)v$ removes $v$: $F$ because the whole reactor is flushed at that rate, plus $k$ for the decay. Without $v$ the system sits at $u=1$, $v=0$, which is why the standard start is a field of $(1,0)$ with a small seed of $v$.

## 2. Parameters

![[pictures/topics/generative/gray-scott-regimes.png]]

<p class="image-caption">Same two pretend chemicals, two different feed and kill rates: one grows like coral, the other splits into dots like dividing cells. Rendered from the equations on this page.</p>

Common choices on a unit grid: $D_u=1.0$, $D_v=0.5$, $\Delta t=1$. The feed and kill rates then select the regime. These are typical values from the usual parameter maps, and the exact boundaries between regimes are fuzzy:

| Regime                          | F      | k      |
| ------------------------------- | ------ | ------ |
| Coral-like, branching labyrinth | 0.055  | 0.062  |
| Mitosis-like, spots that split  | 0.0367 | 0.0649 |

Only a narrow band of $(F,k)$ gives patterns at all; outside it the seed either dies or fills the whole domain. Move by 0.002 or so at a time when exploring.

## 3. Discretization

Replace $\nabla^2$ by a 3 by 3 weighted sum. A common stencil, with weights summing to zero so a constant field has no diffusion:

$$
L=\begin{pmatrix}0.05&0.2&0.05\\0.2&-1&0.2\\0.05&0.2&0.05\end{pmatrix}
$$

The explicit (forward Euler) update is

$$
u\leftarrow u+\Delta t\big(D_u\,(L*u)-uv^2+F(1-u)\big),\qquad
v\leftarrow v+\Delta t\big(D_v\,(L*v)+uv^2-(F+k)v\big)
$$

Update $u$ and $v$ from the old values, not one after the other.

**Stability.** For explicit diffusion each Fourier mode is multiplied by $1+\Delta t\,D\,\mu$, where $\mu$ is an eigenvalue of the stencil. The most negative eigenvalue of this $L$ is at the checkerboard mode: $-1-0.8+0.2=-1.6$. Stability needs $\Delta t\,D\cdot1.6<2$, i.e. $\Delta t\,D<1.25$. With $D_u=1$ this allows $\Delta t=1$. The plain 5-point Laplacian (weights 1, 1, 1, 1, -4) has most negative eigenvalue $-8$, which would force $\Delta t<0.25$ for the same $D$. The reaction terms add their own limit, but at these parameters they are slow compared with diffusion.

## 4. A Short Simulation

```python
import numpy as np

def lap(A):
    r = lambda dy, dx: np.roll(np.roll(A, dy, 0), dx, 1)   # periodic edges
    return (0.2 * (r(1,0) + r(-1,0) + r(0,1) + r(0,-1))
            + 0.05 * (r(1,1) + r(1,-1) + r(-1,1) + r(-1,-1)) - A)

def run(F, k, steps=8000, n=128, Du=1.0, Dv=0.5):
    U = np.ones((n, n)); V = np.zeros((n, n))
    U[54:74, 54:74] = 0.5; V[54:74, 54:74] = 0.25          # seed square
    V += 0.02 * np.random.default_rng(0).random((n, n)) * (V > 0)
    for _ in range(steps):
        uvv = U * V * V
        U, V = (U + Du * lap(U) - uvv + F * (1 - U),
                V + Dv * lap(V) + uvv - (F + k) * V)
    return U, V

U, V = run(0.0367, 0.0649)     # mitosis-like
```

I ran this on a 128 by 128 grid for 8000 steps. With $(F,k)=(0.055,0.062)$ the result stayed finite and $v$ covered about half the grid ($v>0.2$ on 52% of cells) in 3 connected regions (a labyrinth). With $(0.0367,0.0649)$ it settled into 49 separate spots covering 20% of the grid. The values of $v$ stayed between 0 and about 0.4. Counts of spots depend on the seed and the number of steps; the regime is what's reproducible.

## 5. Ping-Pong on the GPU

The update only reads the previous state, so each step is a fragment shader that reads texture A and writes texture B; the next step swaps them. Pack $u$ in the red channel and $v$ in green. Three requirements: a 32-bit float pixel format (8-bit textures cannot hold the small increments), repeat or wrap addressing for periodic edges, and several steps per displayed frame, since the pattern evolves over thousands of steps. In TouchDesigner that is a GLSL TOP whose input is a Feedback TOP pointing back at the same GLSL TOP, with an initial seed injected on the first frame, and several such stages chained to get more substeps per frame. Native Metal or WebGL does the same with two textures and a swap per pass. Draw the result by mapping $v$ through a color ramp, or use the gradient of $v$ as a normal map for lighting.

> [!tip] Intuition
> A spot of $v$ keeps itself alive by consuming $u$ around it. Because $u$ spreads faster than $v$, the supply of $u$ reaches the spot from a wide area, while $v$ stays local. The balance between the two spreading lengths sets the spacing of spots and stripes.

## Related

- [[notes/graphics/image-convolution-kernels|Image Convolution Kernels]]: the 3 by 3 Laplacian is a convolution
- [[notes/graphics/compute-shaders|Compute Shaders]]: ping-pong stencils without the fragment pipeline
- [[notes/generative/noise-functions|Noise Functions]]: noise as an initial condition or a modulation for F and k
- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: the reaction term alone has fixed points
- [[notes/generative/numerical-integration|Numerical Integration]]: forward Euler and its stability limit
- [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]]: the GLSL TOP used for the feedback loop
