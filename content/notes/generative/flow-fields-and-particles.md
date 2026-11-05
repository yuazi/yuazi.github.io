---
title: "Flow Fields and Particle Systems"
tags:
  - generative-art
  - simulation
  - shaders
date: 2026-11-05
---

A flow field assigns a velocity to every point in space. Release thousands of particles into it, move each one a little per frame, and keep a faded memory of where they were: you get the silky, streaming look of wind maps and many generative posters. The three choices that matter are how to build the field, how to step the particles, and how to leave trails.

![[pictures/topics/generative/flow-fields-and-particles.png]]

<p class="image-caption">Drop particles into the arrows and let the flow carry them. Image: Twisp, Public domain, via <a href="https://commons.wikimedia.org/wiki/File:Streamlines_and_streamtube.svg">Wikimedia Commons</a>.</p>

## Mental Model

- A particle at position $\mathbf{x}$ obeys $\dot{\mathbf{x}}=\mathbf{v}(\mathbf{x},t)$. The field $\mathbf{v}$ is a function you design.
- Using noise directly as an angle gives a field with sources and sinks, so particles bunch up. Curl noise has none, so they stay spread out.
- The step method matters for orbits. Euler spirals outward in swirling fields; midpoint (RK2) holds the radius.
- Trails are free: fade the previous frame, then draw the new points on top.

## 1. Noise as a Vector Field

The simplest field maps 2D noise to an angle:

$$
\theta(x,y)=2\pi\,n(sx,sy),\qquad \mathbf{v}=(\cos\theta,\ \sin\theta)
$$

with $s$ a scale that sets the size of features. It is easy and looks good, but it has regions where streamlines converge (sinks) and diverge (sources). Particles pile up in sinks, thin out in sources, and the picture clumps over time. See [[notes/generative/noise-functions|Noise Functions]] for the $n$ used here.

## 2. Curl Noise

Take a smooth scalar noise $\psi(x,y)$ as a potential (a stream function) and define the velocity as its rotated gradient:

$$
\mathbf{v}=\Big(\frac{\partial\psi}{\partial y},\ -\frac{\partial\psi}{\partial x}\Big)
$$

The divergence is

$$
\nabla\cdot\mathbf{v}=\frac{\partial^2\psi}{\partial x\,\partial y}-\frac{\partial^2\psi}{\partial y\,\partial x}=0
$$

because mixed partial derivatives of a smooth function commute. No sources, no sinks: the flow is incompressible, so an initially uniform cloud of particles stays uniform. There is a second property: along a trajectory $\dot\psi=\psi_x\dot x+\psi_y\dot y=\psi_x\psi_y-\psi_y\psi_x=0$, so in a steady field each particle travels along a contour line of $\psi$. If $\psi$ also changes with time, particles drift across contours and you get the evolving swirls. In 3D the same construction uses a vector potential and $\mathbf{v}=\nabla\times\boldsymbol{\psi}$, and $\nabla\cdot(\nabla\times\boldsymbol\psi)=0$ always (Bridson and colleagues, 2007).

Derivatives of noise are usually taken by central differences, which is simpler than writing analytic derivatives for each noise type:

```python
def curl(psi, x, y, e=1e-3):
    dpdx = (psi(x + e, y) - psi(x - e, y)) / (2 * e)
    dpdy = (psi(x, y + e) - psi(x, y - e)) / (2 * e)
    return dpdy, -dpdx
```

I checked this on a grid with $\psi=\sin2x\cos3y+0.5\sin(5x+y)$ using central differences. The divergence of the curl field came out at about $2\times10^{-14}$ while the velocities were of order 3.5. The gradient field $\nabla\psi$ of the same potential, in contrast, had divergence up to about 26. Central differences commute exactly on a grid, which is why the first one is zero to rounding error.

> [!tip] Intuition
> Think of $\psi$ as the height of a landscape. The curl field is the flow that circulates along the contours of that landscape, never uphill or downhill, so it cannot gather anywhere.

## 3. Advection: Euler and RK2

To move particles, integrate $\dot{\mathbf{x}}=\mathbf{v}(\mathbf{x})$ numerically. Forward Euler takes one slope sample at the start of the step:

$$
\mathbf{x}\leftarrow\mathbf{x}+\Delta t\,\mathbf{v}(\mathbf{x})
$$

The midpoint method (RK2) samples again halfway:

$$
\mathbf{x}\leftarrow\mathbf{x}+\Delta t\,\mathbf{v}\big(\mathbf{x}+\tfrac{\Delta t}{2}\mathbf{v}(\mathbf{x})\big)
$$

The difference shows in rotation. For $\mathbf{v}=(-y,x)$ a particle should circle forever at constant radius. Euler multiplies the radius by $\sqrt{1+\Delta t^2}$ per step; midpoint by $\sqrt{1+\Delta t^4/4}$. With $\Delta t=0.1$ and 628 steps (ten revolutions), starting at radius 1, running both gives radius 22.7 for Euler and 1.008 for RK2, matching those formulas. Curl noise is made of swirls, so Euler particles are flung out of vortices over time; RK2 doubles the field evaluations and fixes most of it. For art at 60 frames per second with small $\Delta t$, Euler is often good enough, and one extra sample per particle is cheap on a GPU. See [[notes/generative/numerical-integration|Numerical Integration]] for RK4 and error orders.

Particles that leave the domain need a rule: wrap around, or respawn at a random position. A random lifetime that respawns each particle after some frames also hides any drift.

## 4. Trails with a Fading Buffer

Do not store trail history per particle. Keep one accumulation buffer the size of the screen. Each frame:

1. Multiply the buffer by a fade factor $f$ slightly below 1 (or draw a translucent black quad over it).
2. Draw every particle at its new position, additively.
3. Display the buffer.

A particle's contribution after $m$ frames is scaled by $f^m$. For $f=0.96$ the effective trail length is $1/(1-f)=25$ frames and the half-life $\ln0.5/\ln0.96\approx17$ frames. Higher $f$ gives longer streaks; $f=1$ never fades and saturates. Fading is done on a float buffer if you can, because an 8-bit buffer rounds small values to zero and leaves a ghost residue that never disappears at $f$ close to 1. Color by speed, by angle, or by particle age for variety. In TouchDesigner, this is a Feedback TOP with a Level TOP multiplying by $f$ and a Composite TOP adding the new points.

## 5. Particles in 3D

The same pipeline works in 3D with a curl-noise field, a position texture, and an update that reads only the position (the field supplies the velocity). Strange attractors from [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]] are flow fields with a built-in shape: seeding thousands of particles and advecting them through the Halvorsen or Lorenz equations gives the density-style images from that page, with real motion. The GPU side, with positions stored in textures and updated in a shader, is covered in [[notes/graphics/gpu-particle-systems|GPU Particle Systems]].

## Related

- [[notes/generative/noise-functions|Noise Functions]]: the potential $\psi$
- [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]: running millions of particles
- [[notes/generative/numerical-integration|Numerical Integration]]: Euler vs RK2 vs RK4
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: flows with fractal attractors
- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: divergence and phase-space volume
- [[work/attractormediapipe|Attractor and MediaPipe]]: particles driven by hand input
