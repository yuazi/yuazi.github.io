---
title: (y) Graphics and Shaders
tags:
  - graphics
  - shaders
  - notes
date: 2026-11-05
---

Practical notes on writing shaders and talking to the GPU, from a first fragment shader to Metal and HDR on macOS. The [[notes/lectures/realtimegraphics/index|Real-Time Graphics]] lecture notes cover the theory and the [[touchdesigner/index|TouchDesigner wiki]] covers the node-based side; these pages sit in between.

---

## Shaders

- [[notes/graphics/fragment-shader-basics|(y-) Fragment Shader Basics]]: per-pixel programs, coordinates, smoothstep and the first circle.
- [[notes/graphics/signed-distance-functions|(y-) Signed Distance Functions and Raymarching]]: shapes as distance functions and the sphere-tracing loop.
- [[notes/graphics/image-convolution-kernels|(y-) Image Convolution Kernels]]: blur, edge detection, sharpening and separable filters.
- [[notes/graphics/compute-shaders|(y-) Compute Shaders]]: threads, workgroups, shared memory and a parallel reduction.
- [[notes/graphics/gpu-particle-systems|(y-) GPU Particle Systems]]: particle state on the GPU, ping-pong updates and drawing millions of points.

## Color and Apple Platforms

- [[notes/graphics/color-spaces-and-gamma|(y-) Color Spaces and Gamma]]: sRGB, linear light, Display P3 and premultiplied alpha.
- [[notes/graphics/hdr-and-edr-on-macos|(y-) HDR and EDR on macOS]]: extended dynamic range, headroom and how a Metal app asks for it.
- [[notes/graphics/metal-basics|(y-) Metal Basics]]: devices, command buffers, pipelines and a minimal compute dispatch in Swift.

---

[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
