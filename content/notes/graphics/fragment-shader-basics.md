---
title: "Fragment Shader Basics"
tags:
  - graphics
  - glsl
  - shaders
date: 2026-11-05
---

A fragment shader is a small function that the GPU runs once for every pixel it has to color. You give it a position and some inputs, it returns a color, and thousands of copies run at the same time without knowing about each other. Almost every generative visual in TouchDesigner, every Shadertoy demo, and the last stage of every raster pipeline is built on that one idea. I keep returning to it because a handful of functions (`mix`, `step`, `smoothstep`, `fract`) cover most of what you draw with it.

## Mental Model

- The shader is a pure function from pixel position (plus uniforms) to color. It cannot read its neighbours' output, so all coordination happens through the inputs.
- Uniforms are the same for every pixel in a draw. Varyings (inputs in newer GLSL) are interpolated per pixel from the vertex stage, or generated from the pixel position in a full-screen pass.
- Work in normalized, centered, aspect-corrected coordinates, and keep the pixel size around so edges can be anti-aliased.
- Shapes come from a distance value shaped by `smoothstep`, and repetition comes from `fract`.
- Time is just another uniform: a float that the host increments.

## 1. What Runs Per Pixel

In the pipeline from [[notes/lectures/realtimegraphics/02_graphics_pipeline|the RTG graphics pipeline lecture]], rasterization turns triangles into fragments, and the fragment shader decides each fragment's color. A full-screen effect is the degenerate case: two triangles cover the screen, and the shader runs once per output pixel. The same code runs in a Shadertoy tab, in a TouchDesigner GLSL TOP (see [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]]), and as a Metal fragment function with different spelling.

Because pixels run in lockstep groups (see [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|GPU Architecture and Parallelism]]), a branch that splits a group makes the group execute both sides. Small `if` blocks are fine. Loops with data-dependent length are where it starts to cost.

## 2. Coordinates

The raw inputs differ by environment. Shadertoy gives `fragCoord` in pixels with the origin at the bottom left, measured at the pixel center, so the first pixel is at (0.5, 0.5). TouchDesigner gives `vUV.st` in 0 to 1 across the image, and the output size in pixels as `uTDOutputInfo.res.zw`.

For drawing you usually want origin at the center, and a unit that does not stretch with the aspect ratio. Dividing by the height does both:

$$p = \frac{\text{fragCoord} - 0.5\,\text{res}}{\text{res}_y}$$

With this, $p_y$ runs from -0.5 to 0.5 and $p_x$ runs from $-0.5\,\text{res}_x/\text{res}_y$ to the same value positive. A circle of radius 0.25 is round on any window shape. If you skip the aspect correction and use plain 0-to-1 UVs, the circle becomes an ellipse on a 16:9 image.

> [!warning] Common mistake
> Dividing both axes by the width and the height separately (`fragCoord / res`) is the usual way to get stretched shapes. Divide both by one number.

## 3. The Four Workhorse Functions

`step(edge, x)` returns 0 when `x < edge` and 1 otherwise. It is a hard threshold and aliases badly on screen.

`smoothstep(a, b, x)` returns 0 below `a`, 1 above `b`, and a smooth cubic in between: with $t = \operatorname{clamp}((x-a)/(b-a), 0, 1)$ it computes $3t^2 - 2t^3$. Setting `a` and `b` one pixel apart on either side of an edge gives anti-aliasing for free. The result is undefined in GLSL if `a >= b`, so pass them in increasing order.

`mix(x, y, t)` is linear interpolation, $x(1-t) + yt$. With a mask from `smoothstep` as `t`, it is the standard way to composite one color over another.

`fract(x)` is $x - \lfloor x \rfloor$, a sawtooth in 0 to 1. Multiplying the coordinate before `fract` tiles the plane.

## 4. A Circle and a Grid

Everything combines in a short Shadertoy program. The circle is a signed distance (negative inside, positive outside), the grid line is the distance to the nearest integer in scaled coordinates, and `px` is the size of one pixel in `p` units so every edge is about two pixels wide.

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float px = 1.0 / iResolution.y;

    float r = 0.2 + 0.05 * sin(iTime * 2.0);           // animated radius
    float d = length(p) - r;                            // distance to the circle edge
    float disc = 1.0 - smoothstep(-px, px, d);          // 1 inside, 0 outside

    vec2 e = abs(fract(p * 8.0 + 0.5) - 0.5);           // distance to nearest grid line, in cells
    float w = 8.0 * px;                                 // one pixel, in cell units
    float line = 1.0 - smoothstep(0.0, 2.0 * w, min(e.x, e.y));

    vec3 col = vec3(0.08) + 0.12 * line;
    col = mix(col, vec3(1.0, 0.45, 0.2), disc);
    fragColor = vec4(col, 1.0);
}
```

The expression `fract(p * 8.0 + 0.5) - 0.5` maps each cell to the range -0.5 to 0.5 with the grid lines at the cell boundaries, so `abs` gives the distance to the nearest line. For per-cell effects, take `fract(p * 8.0) - 0.5` as the local coordinate inside the cell and `floor(p * 8.0)` as the cell index, then hash the index to vary each cell.

## 5. Time-Based Animation

Animation means feeding a number that changes. Shadertoy provides `iTime` in seconds. In TouchDesigner you declare `uniform float uTime;` in the shader and set it on the GLSL TOP's Vectors page, with the expression `absTime.seconds`. Use `sin(t)` for oscillation, `fract(t)` for a repeating ramp, and `p + vec2(t, 0.0)` for scrolling. Because the shader has no memory, anything that has to persist between frames (trails, simulation state) needs a feedback texture instead of a variable.

## 6. Shadertoy Versus TouchDesigner

The math is identical. The wrapper differs.

| Concern        | Shadertoy                                               | TouchDesigner GLSL TOP                                              |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Entry point    | `void mainImage(out vec4 fragColor, in vec2 fragCoord)` | `void main()` writing to `layout(location = 0) out vec4 fragColor;` |
| Pixel position | `fragCoord` in pixels                                   | `vUV.st` in 0 to 1, times `uTDOutputInfo.res.zw` for pixels         |
| Resolution     | `iResolution.xy`                                        | `uTDOutputInfo.res.zw`                                              |
| Time           | `iTime`                                                 | your own `uniform`, driven from a CHOP or expression                |
| Input image    | `iChannel0` and `texture(iChannel0, uv)`                | `sTD2DInputs[0]` and `texture(sTD2DInputs[0], uv)`                  |
| Output         | assign `fragColor`                                      | assign `TDOutputSwizzle(color)` to `fragColor`                      |

The same scene in TouchDesigner replaces only the first two lines:

```glsl
uniform float uTime;
layout(location = 0) out vec4 fragColor;

void main()
{
    vec2 res = uTDOutputInfo.res.zw;
    vec2 p = (vUV.st - 0.5) * res / res.y;     // same p as the Shadertoy version
    float px = 1.0 / res.y;
    // ... same circle and grid code, with uTime instead of iTime ...
    fragColor = TDOutputSwizzle(vec4(col, 1.0));
}
```

> [!tip] Intuition
> Think of `p` as a coordinate system you build once at the top of the shader. Everything after that line is portable between tools.

## 7. Color Values Are Display Values by Default

The colors above are written straight to the output, so they land on screen as sRGB-ish code values. A `mix` between two colors then interpolates encoded values, which is slightly wrong for lighting math and for blends. [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]] covers when to decode to linear and re-encode at the end. For shapes with flat colors, ignoring it is fine.

## Related

- [[notes/graphics/signed-distance-functions|Signed Distance Functions and Raymarching]]: the circle distance here generalizes to 3D scenes
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: what the numbers you output mean
- [[notes/generative/noise-functions|Noise Functions]]: the next step after `fract` and `sin` for organic patterns
- [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL in TouchDesigner]]: the TD wrapper, uniforms and samplers
- [[notes/lectures/realtimegraphics/02_graphics_pipeline|RTG 02 Graphics Pipeline]]: where fragments come from
- [[notes/graphics/compute-shaders|Compute Shaders]]: when a pixel-shaped problem stops fitting
