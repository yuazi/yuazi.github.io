---
title: "Strange Attractors Beyond Lorenz"
tags:
  - math
  - chaos
  - generative-art
date: 2026-11-05
---

The Lorenz system is the famous one, but it is a single member of a large family of small equation sets whose trajectories settle onto bounded, fractal-looking sets. Each has a few lines of algebra, a handful of constants, and a recognizable shape. I use them as raw material for visualizers, so what matters is knowing which constants give a good picture and how to draw the result without it turning into a smear.

## Mental Model

- A strange attractor is a bounded set that trajectories fall onto and never leave, yet nearby trajectories on it diverge exponentially.
- Most of the shape comes from a few constants. Change one by 10 percent and the attractor can collapse into a loop or a point.
- Flows (ODEs) need an integrator, see [[notes/generative/numerical-integration|Numerical Integration]]. Maps (Clifford, De Jong) are just iterated.
- You do not draw the curve. You count how often the orbit visits each pixel and draw the counts.

## 1. Five Flows

All five are three-dimensional ODEs, $\dot{\mathbf{x}}=\mathbf{f}(\mathbf{x})$. The constants below are the standard ones; I checked each by integrating with RK4 and confirming the orbit stays bounded (section 3).

**Rössler** (a=0.2, b=0.2, c=5.7) is the simplest: one nonlinear term. It spirals outward in the $xy$ plane and gets thrown up and folded back in $z$, like a ribbon.

$$
\dot{x}=-y-z,\quad \dot{y}=x+ay,\quad \dot{z}=b+z(x-c)
$$

![[pictures/topics/generative/attractor-rossler.png]]

<p class="image-caption">A ribbon that spirals out, gets flipped up and folded back in, over and over. Rendered from the equations on this page.</p>

**Thomas** (b=0.208186) has cyclic symmetry in $x,y,z$ and divergence $-3b$ everywhere, so volume shrinks at a constant rate. At $b=0$ the system is conservative and the orbit wanders over the whole space.

$$
\dot{x}=\sin y-bx,\quad \dot{y}=\sin z-by,\quad \dot{z}=\sin x-bz
$$

![[pictures/topics/generative/attractor-thomas.png]]

<p class="image-caption">A particle bouncing around a lattice of sine-shaped hills, never settling. Rendered from the equations on this page.</p>

**Aizawa** (a=0.95, b=0.7, c=0.6, d=3.5, e=0.25, f=0.1) looks like a sphere with a tube through its axis.

$$
\begin{aligned}
\dot{x}&=(z-b)x-dy\\
\dot{y}&=dx+(z-b)y\\
\dot{z}&=c+az-\tfrac{z^3}{3}-(x^2+y^2)(1+ez)+fzx^3
\end{aligned}
$$

![[pictures/topics/generative/attractor-aizawa.png]]

<p class="image-caption">A ball wrapped in thread, with a tube punched through the middle. Rendered from the equations on this page.</p>

**Halvorsen** (a=1.4) has threefold rotational symmetry. This is the one running on the side of this site, see [[notes/random/lorenz-attractor|the Lorenz essay]].

$$
\dot{x}=-ax-4y-4z-y^2,\quad \dot{y}=-ay-4z-4x-z^2,\quad \dot{z}=-az-4x-4y-x^2
$$

![[pictures/topics/generative/attractor-halvorsen.png]]

<p class="image-caption">Three arms that look the same, like a propeller drawn by one endless pen stroke. Rendered from the equations on this page.</p>

**Chen** (a=35, b=3, c=28) has a double-scroll shape like Lorenz, with larger coordinates (see the table below).

$$
\dot{x}=a(y-x),\quad \dot{y}=(c-a)x-xz+cy,\quad \dot{z}=xy-bz
$$

![[pictures/topics/generative/attractor-chen.png]]

<p class="image-caption">Two wings like Lorenz's butterfly, flown faster and wider. Rendered from the equations on this page.</p>

## 2. Two Planar Maps

A map has no integrator and no step-size error. Each step is a function evaluation, and two sines are enough to make dense, filigree images. The Clifford and De Jong maps are

$$
\text{Clifford: } x'=\sin(ay)+c\cos(ax),\quad y'=\sin(bx)+d\cos(by)
$$

$$
\text{De Jong: } x'=\sin(ay)-\cos(bx),\quad y'=\sin(cx)-\cos(dy)
$$

![[pictures/topics/generative/maps-clifford-dejong.png]]

<p class="image-caption">Each dot jumps to a new spot by a simple rule; after millions of jumps the dots draw a lace pattern. Brighter means visited more often. Rendered from the equations on this page.</p>

Good starting constants: Clifford with $(a,b,c,d)=(-1.4,\,1.6,\,1.0,\,0.7)$ and De Jong with $(1.4,\,-2.3,\,2.4,\,-2.1)$. Sines and cosines are bounded by 1, so both maps stay inside a fixed box without any checking: De Jong inside $[-2,2]^2$, Clifford inside $\lvert x\rvert\le 1+\lvert c\rvert$ and $\lvert y\rvert\le 1+\lvert d\rvert$. Random constants in $[-3,3]$ often give a fixed point or a short cycle instead of a picture. You can reject those by checking that the orbit still covers many distinct pixels after a few thousand steps.

## 3. Boundedness Check

I integrated each flow with RK4 for 60,000 to 200,000 steps, dropped the first 10 percent as transient, and recorded the box the orbit occupies. Running this gives:

| System    | Start              | dt     | x range      | z range      |
| --------- | ------------------ | ------ | ------------ | ------------ |
| Rössler   | (1,1,1)            | 0.01   | -9.1 to 11.4 | 0 to 22.8    |
| Thomas    | (1.1,1.1,-0.01)    | 0.05   | -1.1 to 3.8  | -1.1 to 3.8  |
| Aizawa    | (0.1,0,0)          | 0.01   | -1.5 to 1.5  | -0.4 to 1.9  |
| Halvorsen | (-1.48,-1.51,2.04) | 0.005  | -13.3 to 6.4 | -13.3 to 6.4 |
| Chen      | (-3,2,20)          | 0.0005 | -23 to 24    | 7.4 to 46.5  |

All stayed finite. The Chen step is small because a=35 makes the dynamics fast. The Clifford and De Jong orbits stayed in $[-1.42,1.98]\times[-1.30,1.54]$ and $[-2,2]^2$ over 200,000 iterations. These ranges depend on the start point only through the transient, so treat them as the approximate size of the picture, and use them to set your camera.

> [!warning] Common mistake
> An orbit that looks bounded for 1,000 steps may be a long transient. Discard the first few thousand points before measuring the extent or accumulating pixels.

## 4. Rendering by Density Accumulation

Drawing a polyline through a million points yields a flat blob. Instead, project each point to a pixel and add 1 to a counter. Dense regions, where the orbit lingers or crosses itself often, get large counts and bright pixels.

The counts span many orders of magnitude, so map them through a logarithm before display:

```python
import numpy as np

def clifford(n, a=-1.4, b=1.6, c=1.0, d=0.7, size=1000):
    x = y = 0.1
    pts = np.empty((n, 2))
    for i in range(n):
        x, y = np.sin(a * y) + c * np.cos(a * x), np.sin(b * x) + d * np.cos(b * y)
        pts[i] = x, y
    H, _, _ = np.histogram2d(pts[:, 0], pts[:, 1], bins=size)
    img = np.log1p(H)
    return img / img.max()   # 0..1, ready for a colormap
```

For a 3D flow, rotate the points with a matrix before projecting to 2D, then accumulate the same way. In TouchDesigner or a shader the same idea is additive blending into a float texture, followed by a log or gamma step on read-out. Color by speed or by iteration index adds a second channel of information to the density.

## Related

- [[notes/random/lorenz-attractor|The Lorenz Attractor]]: the original, with Halvorsen and the site's controls
- [[work/attractormediapipe|Attractor and MediaPipe]]: attractors driven by hand tracking
- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: fixed points and stability for these systems
- [[notes/generative/numerical-integration|Numerical Integration]]: why RK4 and how small dt must be
- [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]: measuring how chaotic each one is
- [[notes/generative/fractals|Fractals and Fractal Dimension]]: the dimension of these sets
