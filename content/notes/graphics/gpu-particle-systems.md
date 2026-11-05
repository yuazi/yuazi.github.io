---
title: "GPU Particle Systems"
tags:
  - graphics
  - gpu
  - particles
date: 2026-11-05
---

A particle system on the GPU keeps every particle's state in video memory and updates it in parallel, so the CPU only issues a couple of commands per frame. That is how you get from thousands of particles to millions at 60 fps. The design questions are where the state lives, how an update pass reads and writes it, how the particles get drawn, and whether the memory traffic fits the bandwidth budget. Strange attractors and flow fields are natural fits, since each particle follows a simple rule that does not depend on the others.

## Mental Model

- One particle is a few floats (position, velocity, age, maybe size or color), stored in a buffer or in texels of a float texture.
- One update thread or fragment per particle: read state, integrate one step, write new state.
- A pass that reads one buffer and writes another is ping-pong. Swap the two roles every frame.
- Drawing is separate from updating. The draw call reads the state buffer and expands each particle into a point or a quad.
- Additive blending is order independent, so no sorting is needed. Alpha blending needs a depth sort.

## 1. Where the State Lives

In a compute design the state is a structured buffer. A common layout packs two `float4` values per particle: position plus age in the first, velocity plus a per-particle random seed in the second. That is 32 bytes per particle, and the arrays are indexed by thread id ([[notes/graphics/compute-shaders|Compute Shaders]], [[notes/graphics/metal-basics|Metal Basics]]).

In a fragment-shader design the state is a float texture, with one texel per particle. A $1024 \times 1024$ RGBA32F texture holds $1\,048\,576$ particles, and a second texture holds velocity. The update is a full-screen pass writing into the next texture, with multiple render targets if state spans several textures. This is the classic approach where compute is unavailable, and it is how GLSL-based tools such as TouchDesigner usually do it ([[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]]).

## 2. Ping-Pong Updates

A fragment pass cannot read and write the same texture, so it uses two: read from A, write to B, then swap. Compute shaders are looser. If each particle's update depends only on its own state, a thread can read and write the same slot of one buffer, with no race since no other thread touches it. Ping-pong is still needed when particles read their neighbors' old state (flocking, collisions, pressure), because a neighbor may already have been overwritten during the same pass.

## 3. Integration

Each step advances state by $\Delta t$. Semi-implicit (symplectic) Euler is cheap and well behaved for particles:

$$
\mathbf v \leftarrow \mathbf v + \mathbf a(\mathbf x)\,\Delta t, \qquad \mathbf x \leftarrow \mathbf x + \mathbf v\,\Delta t .
$$

The acceleration $\mathbf a$ can be gravity, drag $-c\mathbf v$, a force from a noise-based vector field, or a texture lookup of a flow field ([[notes/generative/flow-fields-and-particles|Flow Fields and Particle Systems]]). For a particle that traces a differential equation directly, such as a strange attractor, you skip the velocity and set $\mathbf x \leftarrow \mathbf x + F(\mathbf x)\,\Delta t$ or use an RK4 step ([[notes/generative/numerical-integration|Numerical Integration]], [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]). Millions of independent trajectories of the same attractor started from slightly different points make a convincing picture of divergence.

Dead or escaped particles need respawning: when age exceeds a lifetime, or the position leaves a bounding region, reset the slot from a hash of the particle id and frame number. A GPU has no `rand()`, so a small integer hash gives each thread a random number.

## 4. Drawing Particles

**Point sprites** draw one vertex per particle as a screen-aligned square (`GL_POINTS`, or `[[point_size]]` output from a Metal vertex function). It is the cheapest option: one vertex per particle and no geometry setup. The limits are a maximum point size on some hardware, only axis-aligned squares, and no easy per-particle rotation or stretching.

**Instanced quads** draw one instance per particle with a shared 4-vertex quad. The vertex shader reads the particle's state from the buffer by instance id (vertex pulling) and offsets the quad corners in view space, giving billboards of any size, with rotation, or stretched along velocity for motion trails. It costs more vertex work, but it is the general solution. Neither needs the CPU to know the particle positions, which is the point of the design.

## 5. Blending and Sorting

Additive blending computes $C_{\text{dst}} \leftarrow C_{\text{dst}} + \alpha\,C_{\text{src}}$. Addition is commutative, so the pixel is the same whatever order the particles arrive in, and the GPU can process them in any order with no sorting. This suits fire, sparks, glow, and the dense point clouds of attractors, where brightness stands for density. The drawbacks are that overlap only brightens, never occludes, and a dense region saturates to white unless you render into a float (HDR) target and tone-map afterwards.

Alpha blending, $C_{\text{dst}} \leftarrow (1-\alpha)\,C_{\text{dst}} + \alpha\,C_{\text{src}}$, depends on order, so particles must be drawn back to front. That means a GPU sort each frame, usually a bitonic or radix sort on a key buffer of view depth, costing roughly $O(N \log^2 N)$ work for a bitonic sort. Use it only for smoke or dust where occlusion matters, or fall back to weighted order-independent transparency.

## 6. Budget Reasoning

Memory traffic usually limits a particle system before arithmetic does. Take 32 bytes of state per particle and a ping-pong update that reads the old state and writes the new state:

> [!example] Worked example
> 1 million particles: $32\ \text{B} \times 10^6 = 32$ MB of state. One update reads 32 MB and writes 32 MB, so 64 MB per frame. At 60 fps that is $64 \times 60 = 3.84$ GB/s. The draw pass reads the state once more, adding 32 MB, for 96 MB per frame, or 5.76 GB/s.
>
> 10 million particles: ten times that, 960 MB per frame and 57.6 GB/s for update plus draw at 60 fps.

Compare the second figure with the memory bandwidth in your chip's specification. It is a large fraction of what a laptop-class unified memory system provides, and the rest of the frame also needs bandwidth, so 10 million at 60 fps is near the limit and 1 million is comfortable. Ways to reduce it: store positions as half floats (16 bytes per particle), drop the separate velocity for attractor-style particles, update in place when there are no neighbor reads, and fix the particle count rather than allocating dynamically. Arithmetic stays small: a few dozen floating point operations per particle is cheap beside the memory cost. Fill rate for the draw pass also grows with particle size, since a large additive sprite touches many pixels many times.

## Related

- [[notes/generative/flow-fields-and-particles|Flow Fields and Particle Systems]]: the force fields that drive the particles.
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: a state-only particle rule that suits additive rendering.
- [[notes/graphics/compute-shaders|Compute Shaders]]: dispatch sizes and the kernel structure used here.
- [[notes/graphics/metal-basics|Metal Basics]]: buffers and storage modes for the state arrays.
- [[notes/random/lorenz-attractor|Lorenz Attractor]]: the system many of these particles integrate.
- [[notes/lectures/realtimegraphics/08_special_effects|Special Effects]]: blending and particle effects in the lecture.
