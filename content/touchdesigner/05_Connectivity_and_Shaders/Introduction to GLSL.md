---
tags:
  - touchdesigner
  - td/connectivity
  - advanced
  - glsl
  - rendering
date: 2026-02-26
---

# Introduction to GLSL in TouchDesigner

TouchDesigner's built-in nodes (TOPs, SOPs, MATs) cover a lot, but custom **GLSL (OpenGL Shading Language)** code lets you write your own algorithms that run directly on the GPU, without the overhead of chaining many nodes.

## What is a Shader?

A shader is a small program that runs on the graphics card. In TouchDesigner you mostly deal with three types:

1.  **Vertex Shader (`.vert`):** Runs once _per vertex_ of a 3D model. Used to move, warp, or transform 3D points before drawing them.
2.  **Fragment/Pixel Shader (`.frag`):** Runs once _per pixel_ on the screen (or in a 2D texture). Used to calculate colors, lights, and 2D generative patterns.
3.  **Compute Shader (`.comp`):** The advanced one. Runs in arbitrary workgroups, outside the usual geometry pipeline. Used for large particle systems and fluid simulations.

## The GLSL TOP (2D Image Processing)

The easiest way to start learning GLSL in TouchDesigner is the **GLSL TOP**.

1. Create a GLSL TOP.
2. It automatically generates a Pixel Shader DAT containing some starter code.
3. Click "Edit" on the DAT to open it in your external text editor (like VS Code).

A basic pixel shader looks like this:

```glsl
// This tells TouchDesigner what to output
layout(location = 0) out vec4 fragColor;

void main()
{
    // A vec4 is (Red, Green, Blue, Alpha)
    // If we define it as (1.0, 0.0, 0.0, 1.0), it will output solid red.

    // We can also retrieve UV coordinates (0 to 1 across the image)
    // TD's built-in varying for texture UV is vUV
    vec2 uv = vUV.st;

    // Create a color gradient using the UV coordinates.
    // TDOutputSwizzle() fixes up channel order for TD's output formats.
    fragColor = TDOutputSwizzle(vec4(uv, 0.0, 1.0));
}
```

## The GLSL MAT (3D Materials)

When you need a custom lighting model or displacement that the Phong and PBR MATs can't do, use the **GLSL MAT**.

- It requires both a Vertex Shader and a Pixel Shader.
- The easiest way to start is to build your material with a standard PBR MAT and click the "Output Shader" button on its parameter page. It spawns the equivalent GLSL network for you to study and modify.

## Uniforms and Samplers

TD makes it easy to pass data _into_ a shader from the rest of your network:

- **Uniforms:** If you have an oscillating LFO CHOP channel, you can map it to a Uniform Variable on the "Vectors" page of the GLSL TOP/MAT. Your shader can then read that float, vec2, or vec3 directly.
- **Samplers:** You can connect up to 30 Input TOPs (images, noises, videos) to a GLSL TOP. In the shader, you reference them using standard sampler functions (like `texture(sTD2DInputs[0], uv)`).

---

> [!tip]- 📚 Learning Path · Stage 7: Connectivity & Shaders · step 37 of 44
> [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity|(y-) ← Prev: Audio Reactivity]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon|(y-) Next: NDI and Syphon →]]

---

[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Return to Connectivity & Shaders]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
