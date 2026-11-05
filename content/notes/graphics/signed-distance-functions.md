---
title: "Signed Distance Functions and Raymarching"
tags:
  - graphics
  - glsl
  - sdf
  - raymarching
date: 2026-11-05
---

A signed distance function (SDF) takes a point in space and returns how far it is from the nearest surface: negative inside, zero on the surface, positive outside. A whole 3D scene can be written as one such function, with no triangles, and rendered by marching a ray through it. This is how most fragment-shader 3D demos on Shadertoy work, and it is a good fit for TouchDesigner's GLSL TOP because the entire scene fits in one shader.

![[pictures/topics/graphics/signed-distance-functions.png]]

<p class="image-caption">March along a ray in safe steps until you bump into a shape. Rendered for this page.</p>

## Mental Model

- A scene is a function `map(p)` that returns a distance. The surface is where it equals zero.
- If `map(p)` is a safe lower bound on the true distance, then a ray can jump forward by exactly that amount without passing through anything. That is sphere tracing.
- Combining shapes is arithmetic on distances: `min` is union, `max` is intersection.
- Normals and shadows come from asking `map` more questions, not from mesh data.
- The cost is the number of `map` calls per pixel, so scene complexity and step count decide the frame time.

## 1. Primitive SDFs

Each formula below is checked against hand-computed points in a small Python test.

A sphere of radius $r$ at the origin: $d(p) = \lVert p \rVert - r$.

A box with half-extents $b$ (a vec3) at the origin. Let $q = \lvert p \rvert - b$ componentwise. Then

$$d(p) = \lVert \max(q, 0) \rVert + \min(\max(q_x, q_y, q_z), 0)$$

The first term is the distance when the point is outside; the second is the negative depth when it is inside. For a unit cube ($b = (1,1,1)$) the point $(2,0,0)$ gives 1, the point $(2,2,0)$ gives $\sqrt 2$ (distance to the edge), and $(0.5,0,0)$ gives -0.5.

A torus in the xz-plane with major radius $R$ and tube radius $r$: let $q = (\lVert p_{xz} \rVert - R,\ p_y)$, then $d(p) = \lVert q \rVert - r$. For $R=1$, $r=0.25$, the point $(1.5, 0, 0)$ gives 0.25, the tube center circle $(1,0,0)$ gives -0.25, and the origin gives 0.75.

```glsl
float sdSphere(vec3 p, float r) { return length(p) - r; }

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, float R, float r) {
    vec2 q = vec2(length(p.xz) - R, p.y);
    return length(q) - r;
}
```

Moving a shape means subtracting its position from `p` before calling the SDF: `sdSphere(p - vec3(1.0, 0.0, 0.0), 0.5)`. Rotating means rotating `p` by the inverse rotation. Uniform scaling by $s$ means `sdf(p / s) * s`.

## 2. Combining Shapes

| Operation               | Formula      | Distance exact?             |
| ----------------------- | ------------ | --------------------------- |
| Union                   | `min(a, b)`  | outside yes, inside a bound |
| Intersection            | `max(a, b)`  | a lower bound only          |
| Subtraction (a minus b) | `max(a, -b)` | a lower bound only          |

A lower bound is still safe for marching, because the ray never overshoots. It only means that effects relying on true distance (soft shadows, glow) look slightly off near such joins.

Smooth union rounds the seam between two shapes. A common polynomial version with blend width $k$:

$$h = \max(k - \lvert a - b \rvert, 0)/k,\qquad d = \min(a,b) - \tfrac{k}{4}h^2$$

```glsl
float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}
```

When the two distances differ by at least $k$ it reduces to plain `min`. When they are equal, it pulls the surface in by $k/4$: running it with $a=b=0.1$ and $k=0.5$ gives -0.025, and with $a=0.1$, $b=0.7$ it gives exactly 0.1.

## 3. Sphere Tracing

Start at the ray origin `ro` with direction `rd` (unit length). Evaluate `d = map(ro + rd * t)`. No surface is closer than `d`, so advance `t += d`. Stop when `d` falls under a small epsilon (a hit) or `t` exceeds a far limit (a miss).

```glsl
float map(vec3 p) {
    float s = sdSphere(p, 1.0);
    float b = sdBox(p - vec3(1.2, 0.0, 0.0), vec3(0.6));
    return smin(s, b, 0.3);
}

float march(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        float d = map(ro + rd * t);
        if (d < 0.001 || t > 20.0) break;
        t += d;
    }
    return t;
}
```

I ran the same loop in Python against a unit sphere at distance 3. A ray straight at its center hits at $t = 2.0$ in two steps: the first step covers 2 units, the second sees distance 0. A ray that passes 0.86 from the center, near the silhouette, needs 9 steps and hits at $t \approx 2.365$. Rays that graze a surface take the most steps because each step is short.

> [!warning] Common mistake
> The loop has a fixed maximum. If it runs out before hitting or escaping, the pixel shows artifacts at silhouettes. Treat "ran out of steps" as a hit or a miss deliberately, not by accident.

The method needs `map` to be 1-Lipschitz: it may never overestimate the distance. Warping the space (twists, bends, noise displacement) breaks that. The usual fix is to shorten the step, `t += d * 0.7`, and accept more iterations.

## 4. Normals by Central Differences

The gradient of a distance field is the surface normal. Estimate it by sampling `map` slightly on either side along each axis:

$$n \approx \operatorname{normalize}\big(d(p + \epsilon \hat x) - d(p - \epsilon \hat x),\ \dots\big)$$

```glsl
vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)));
}
```

That is six `map` calls per pixel. For the point $(0.6, 0.8, 0)$ on a unit sphere centered at the origin, the Python check returns (0.59999981, 0.79999986, 0), matching the exact $p/\lVert p \rVert$. A four-sample tetrahedral pattern gives similar quality at two thirds of the cost.

## 5. Soft Shadows and Ambient Occlusion

A shadow ray from the hit point toward the light can also use the distance values it gets along the way. If it passes close to some surface without touching it, the point is in penumbra. Tracking the minimum of $k \cdot h/t$ along the ray, where $h$ is the `map` value at distance $t$, gives a soft shadow factor, with $k$ controlling the hardness:

```glsl
float softShadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0, t = 0.02;
    for (int i = 0; i < 64; i++) {
        float h = map(ro + rd * t);
        res = min(res, k * h / t);
        t += clamp(h, 0.01, 0.5);
        if (res < 0.001 || t > 10.0) break;
    }
    return clamp(res, 0.0, 1.0);
}
```

Ambient occlusion works from the same idea. Take four or five points along the normal at growing heights $h_i$. In open space `map` at height $h_i$ equals $h_i$; near a crevice it is smaller. The sum of the shortfalls $h_i - d(p + n h_i)$, weighted so near samples count more, is the occlusion. It costs about five `map` calls and looks like soft contact shading.

## 6. Performance Notes

Everything scales with `map` calls: pixels $\times$ (march steps + normal samples + shadow steps + AO samples). A few habits matter most.

- Bound the work. Test a cheap bounding sphere or box first and skip the loop for rays that miss it.
- Scale epsilon with distance: `d < 0.0005 * t` avoids wasting steps on distant surfaces that are sub-pixel anyway.
- Keep the step cap as low as the scene allows. Neighbouring pixels finish at different counts, and a group of pixels runs until its slowest member is done (see [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|RTG 03]]).
- Make `map` cheap. Domain repetition (`p = mod(p + 0.5 * c, c) - 0.5 * c`) gives infinite copies of an object for the price of one.
- Render at half resolution and upscale if the effect allows it.

Compared to the triangle ray tracing in [[notes/lectures/realtimegraphics/11_gpu_raytracing|RTG 11]], SDF marching has no acceleration structure: the distance field itself is the acceleration structure. That is why it handles smooth blends and soft shadows nicely, and why it struggles with scenes made of many unrelated complex shapes.

## Related

- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: the 2D circle SDF and the `mainImage` setup this builds on
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: lighting results need to be encoded before display
- [[notes/generative/fractals|Fractals and Fractal Dimension]]: distance estimators let SDF marching render fractals
- [[notes/generative/noise-functions|Noise Functions]]: displacing an SDF with noise, with the step-shortening caveat
- [[notes/lectures/realtimegraphics/11_gpu_raytracing|RTG 11 GPU Raytracing]]: the triangle-based alternative
- [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL in TouchDesigner]]: running this in a GLSL TOP
