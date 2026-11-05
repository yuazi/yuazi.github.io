---
title: "Noise Functions (Perlin, Simplex, fBm)"
tags:
  - graphics
  - generative-art
  - shaders
date: 2026-11-05
---

Random numbers per pixel give static. Noise functions give randomness that is smooth: nearby inputs give nearby outputs, but the pattern never repeats in an obvious way. They drive clouds, terrain, flow fields, wobble on a camera, and most of what looks organic in a TouchDesigner or GLSL patch. The ideas are few: a lattice of random values, a smooth interpolation curve, and layering at several scales.

## Mental Model

- Noise is a deterministic hash on an integer lattice plus smooth interpolation between lattice points. Same input always gives the same output.
- Value noise interpolates random values. Gradient noise interpolates random slopes, which looks less blocky.
- The interpolation curve decides how smooth the result is. The quintic fade has zero first and second derivative at the lattice points.
- fBm stacks noise at doubling frequencies and halving amplitudes. Domain warping feeds noise into noise.

## 1. Value Noise vs Gradient Noise

**Value noise** assigns a random value to each integer lattice point and blends the four (in 2D) surrounding values with a smooth weight. It is cheap, but the lattice is easy to see because the extrema always sit on lattice points, giving a boxy look.

**Gradient noise**, the family Perlin noise belongs to, assigns a random gradient vector to each lattice point. For a sample point $\mathbf{p}$, take the offset vector from each corner to $\mathbf{p}$, dot it with that corner's gradient, and blend the four dot products. The result is exactly zero at every lattice point and has its extrema between them, so the grid is much less visible.

In 2D the blend is bilinear with weights from the fade curve. With fractional position $(t_x,t_y)$:

$$
n=\mathrm{lerp}\big(\mathrm{lerp}(d_{00},d_{10},u(t_x)),\ \mathrm{lerp}(d_{01},d_{11},u(t_x)),\ u(t_y)\big)
$$

where $d_{ij}$ is the gradient dot product at corner $(i,j)$ and $u$ is the fade.

## 2. The Fade Curve

Interpolating linearly leaves creases at lattice lines. The original Perlin noise used $3t^2-2t^3$, which has zero slope at $t=0$ and $t=1$, but its second derivative is not zero there, so the second derivative of the noise jumps across cell boundaries. In bump mapping or normals this shows up as grid artifacts. The improved version (Perlin, 2002) uses

$$
u(t)=6t^5-15t^4+10t^3
$$

whose first and second derivatives both vanish at 0 and 1. A quick check: $u(0)=0$, $u(0.25)\approx0.1035$, $u(0.5)=0.5$, $u(0.75)\approx0.8965$, $u(1)=1$, and the numerical slope at $t=0.001$ is about $3\times10^{-5}$. In Horner form: `t*t*t*(t*(t*6.0 - 15.0) + 10.0)`.

## 3. Simplex Noise

Classic noise in $n$ dimensions blends $2^n$ corners of a hypercube, so cost doubles with each dimension. Simplex noise uses the simplest shape that tiles space instead: triangles in 2D, tetrahedra in 3D, with $n+1$ corners. Compared with classic gradient noise:

- Cost grows roughly with $n^2$ rather than $2^n$, which matters in 3D and 4D (time as the fourth axis).
- Fewer directional artifacts, since a simplex grid has no axis-aligned bias as strong as a square grid's.
- A contribution is a radial falloff $(r^2-d^2)^4$ per corner, so the gradient is continuous without explicit interpolation.

The input is skewed onto the simplex grid with factors $F_2=(\sqrt3-1)/2\approx0.366$ and $G_2=(3-\sqrt3)/6\approx0.211$ in 2D, then the corner offsets are un-skewed. In a shader you usually copy a tested implementation instead of rederiving it, so I only keep the factors above for reference.

## 4. Fractal Brownian Motion (fBm)

One noise octave has a single characteristic feature size. Real terrain and clouds have detail at many sizes. fBm sums octaves:

$$
f(\mathbf{p})=\sum_{i=0}^{N-1} g^{\,i}\;n(\ell^{\,i}\mathbf{p})
$$

Lacunarity $\ell$ is the frequency multiplier per octave (usually 2) and gain $g$ is the amplitude multiplier (usually 0.5). With these defaults the amplitudes are 1, 0.5, 0.25, ... and 8 octaves sum to 1.992, so you divide by that sum (or start at amplitude 0.5) to keep the output in a fixed range. The relation $g=\ell^{-H}$ defines the roughness $H$; gain 0.5 at lacunarity 2 gives $H=1$, and a larger gain (0.6 to 0.7) makes the result rougher. Beyond about 6 to 8 octaves the extra detail falls below a pixel and costs time for nothing.

```glsl
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {                       // value noise with quintic fade
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(hash(i),               hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)),  hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {                         // result in [0, 1)
    float sum = 0.0, amp = 0.5;
    for (int i = 0; i < 6; i++) { sum += amp * noise(p); p *= 2.0; amp *= 0.5; }
    return sum;
}
```

The sine hash is the usual quick choice, but its precision differs between GPUs, so patterns can change across devices. For stable results use an integer hash.

## 5. Domain Warping

Instead of sampling at $\mathbf{p}$, sample at a point displaced by another noise field:

$$
f(\mathbf{p})=\mathrm{fbm}\big(\mathbf{p}+k\cdot\mathrm{fbm}(\mathbf{p}+\mathbf{o})\big)
$$

Here $k$ controls the warp strength and $\mathbf{o}$ is an offset so the two fields differ. Nesting once more gives the swirled, marble-like images that Inigo Quilez popularized. For the displacement of a 2D point use two different offsets, one for each component. Animate by adding time to the offsets, or by using a 3D noise with time as the third coordinate.

> [!tip] Intuition
> The warp is a smooth, random distortion of the plane. Fine features of the outer fBm get dragged along it, producing folds and filaments without ever solving a fluid equation.

## Related

- [[notes/generative/flow-fields-and-particles|Flow Fields and Particle Systems]]: noise as a vector field
- [[notes/generative/fractals|Fractals and Fractal Dimension]]: fBm is statistically self-similar
- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: where this GLSL runs
- [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]]: using these functions in TouchDesigner
- [[notes/generative/reaction-diffusion|Reaction-Diffusion (Gray-Scott)]]: a different route to organic texture
