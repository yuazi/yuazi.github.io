---
title: "Compute Shaders"
tags:
  - graphics
  - gpu
  - shaders
date: 2026-11-05
---

A compute shader is a GPU program that is not attached to the graphics pipeline. It has no vertices, no triangles and no pixels to write: you launch a grid of threads, and each one reads and writes buffers or textures as it likes. That freedom is what makes particle simulations, image filters, reductions and fluid solvers practical on the GPU. The ideas are the same in GLSL, Metal and HLSL, with different names.

![[pictures/topics/graphics/compute-shaders.png]]

<p class="image-caption">Lots of tiny workers, grouped into teams, each doing one small piece of the job. Image: Ilze Lucero, Public domain, via <a href="https://commons.wikimedia.org/wiki/File:Jerarquia_de_fils_d%27execuci%C3%B3_CUDA.png">Wikimedia Commons</a>.</p>

## Mental Model

- A dispatch launches a 1D, 2D or 3D grid of workgroups, and each workgroup contains a fixed number of threads set in the shader source.
- Threads in the same workgroup can share fast memory and synchronize with a barrier. Threads in different workgroups cannot, within one dispatch.
- The group size lives in the shader, the number of groups lives on the CPU side, and you have to round the group count up.
- Because the grid is rounded up, some threads fall past the end of your data, so every kernel needs a bounds check.

## 1. Threads and Groups

OpenGL and Vulkan call the unit a workgroup and declare its size in the shader. Metal calls it a threadgroup and takes its size at dispatch time. The shader sees each thread's position through built-in variables.

| Concept             | GLSL                             | Metal Shading Language                   |
| ------------------- | -------------------------------- | ---------------------------------------- |
| Group size          | `layout(local_size_x = 256) in;` | `threadsPerThreadgroup` (set on the CPU) |
| Index in whole grid | `gl_GlobalInvocationID`          | `[[thread_position_in_grid]]`            |
| Index inside group  | `gl_LocalInvocationID`           | `[[thread_position_in_threadgroup]]`     |
| Group index         | `gl_WorkGroupID`                 | `[[threadgroup_position_in_grid]]`       |

Inside a group the hardware runs threads in SIMD lockstep bundles (often 32 wide). Choose group sizes that are multiples of that width, commonly 64, 128 or 256 for 1D work and 8x8 or 16x16 for images. See [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|GPU Architecture and Parallelism]] for why.

## 2. Dispatch Counts

You dispatch groups, not threads, so the number of groups is

$$
G = \left\lceil \frac{N}{S} \right\rceil
$$

for $N$ items and group size $S$. In integer arithmetic this is `(N + S - 1) / S`.

> [!example] Worked example
> Process $N = 1\,000\,000$ floats with $S = 256$. Then $N/S = 3906.25$, so $G = 3907$ groups. The grid holds $3907 \times 256 = 1\,000\,192$ threads, so the last 192 have an index $\ge N$ and must return early. For a $1920 \times 1080$ image with $16 \times 16$ groups, $G_x = 120$ and $G_y = \lceil 67.5 \rceil = 68$.

```glsl
#version 430
layout(local_size_x = 256) in;
layout(std430, binding = 0) buffer Data { float v[]; };
uniform uint N;

void main() {
    uint i = gl_GlobalInvocationID.x;
    if (i >= N) return;          // grid is rounded up
    v[i] = v[i] * 2.0;
}
```

The CPU side calls `glDispatchCompute(3907, 1, 1)`. Metal can skip the rounding if you use `dispatchThreads`, which allows a grid size that is not a multiple of the group size ([[notes/graphics/metal-basics|Metal Basics]]), though a bounds check is still cheap insurance.

## 3. Shared Memory and Barriers

Each workgroup gets a small, fast, on-chip memory (declared `shared` in GLSL and `threadgroup` in MSL, typically tens of KB per group). It is the reason to use compute for neighborhood operations: a blur can load a tile of the image once into shared memory, and then every thread reads its neighbors from there rather than from texture memory.

Writes to shared memory are only visible to the other threads after a barrier. The rule: write, barrier, read. In GLSL the barrier is `memoryBarrierShared(); barrier();` and in MSL it is `threadgroup_barrier(mem_flags::mem_threadgroup);`. Every thread in the group must reach the barrier, so never put it inside a branch that only some threads take, or the result is undefined and can hang the GPU.

## 4. A Tree Reduction

To sum an array, each group first reduces its own slice in shared memory, halving the number of active threads every step.

```glsl
#version 430
layout(local_size_x = 256) in;
layout(std430, binding = 0) readonly  buffer In  { float x[]; };
layout(std430, binding = 1) writeonly buffer Out { float partial[]; };
uniform uint N;
shared float s[256];

void main() {
    uint i = gl_GlobalInvocationID.x, t = gl_LocalInvocationID.x;
    s[t] = (i < N) ? x[i] : 0.0;           // pad past the end with 0
    memoryBarrierShared(); barrier();
    for (uint stride = 128; stride > 0; stride >>= 1) {
        if (t < stride) s[t] += s[t + stride];
        memoryBarrierShared(); barrier();   // outside the if
    }
    if (t == 0) partial[gl_WorkGroupID.x] = s[0];
}
```

Eight values $[3,1,7,0,4,1,6,3]$ with stride 4 become $[7,2,13,3]$ (3+4, 1+1, 7+6, 0+3). Stride 2 gives $[20,5]$, and stride 1 gives $25$, the sum. A group of 256 needs $\log_2 256 = 8$ steps. The kernel writes one partial sum per group, so a million floats leave 3907 partials. A second dispatch (or a CPU sum) finishes the job. Having the active threads be the low indices (`t < stride`) keeps whole SIMD bundles together, which is better than the interleaved pattern `t % (2*stride) == 0`, where bundles run half empty. Floating point addition is not associative, so the order of the tree changes the last bits of the result.

## 5. Compute vs a Fragment Shader

Fragment shaders can do general computation by rendering a full-screen quad into a texture, and TouchDesigner's GLSL TOP works that way ([[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]], [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]). Compute is better when:

- You need to write to arbitrary locations (scatter), not just your own pixel.
- You want shared memory, as in blurs, reductions, prefix sums and histograms.
- The output is not an image: buffers of particles, counts, or indirect draw arguments.
- You want to skip the rasterizer and the blend hardware for pure arithmetic.

A fragment shader remains the simpler choice for per-pixel effects that only sample textures, since the texture units and caches are tuned for that access pattern, and it works on every GPU API without extra setup.

## Related

- [[notes/graphics/metal-basics|Metal Basics]]: how to launch a compute kernel from Swift.
- [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]: the main use case, updating state in buffers.
- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: the alternative path and where the GLSL basics are covered.
- [[notes/graphics/image-convolution-kernels|Image Convolution Kernels]]: a natural fit for shared-memory tiling.
- [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|GPU Architecture and Parallelism]]: SIMD width and occupancy.
