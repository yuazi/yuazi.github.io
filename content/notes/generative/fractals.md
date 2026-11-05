---
title: "Fractals and Fractal Dimension"
tags:
  - math
  - fractals
  - generative-art
date: 2026-11-05
---

A fractal is a set with structure at every scale, and usually a dimension that is not an integer. The Mandelbrot and Julia sets come out of iterating $z^2+c$, the strange attractors of chaos have the same kind of structure, and the dimension is the number that lets you compare them. Everything here is cheap to compute and shows up directly in shader work.

![[pictures/topics/generative/fractals.png]]

<p class="image-caption">Zoom in and the edge keeps showing new detail forever. Rendered for this page.</p>

## Mental Model

- Escape-time fractals ask one question per pixel: does this orbit stay bounded, and if not, how fast does it leave?
- Mandelbrot varies $c$ with $z_0=0$. Julia fixes $c$ and varies $z_0$. Same formula, different slice.
- Smooth coloring removes the visible bands by turning the integer escape step into a continuous value.
- Dimension counts how the amount of detail grows as you shrink the ruler, $N\propto\varepsilon^{-D}$.

## 1. Escape-Time Mandelbrot and Julia

![[pictures/topics/generative/julia.png]]

<p class="image-caption">Start at a point, square it and add c, again and again. Dark points stay close forever; coloured points escape, and the colour says how fast. Rendered from the equations on this page.</p>

Iterate $z_{n+1}=z_n^2+c$. A complex number $c$ is in the Mandelbrot set if the orbit from $z_0=0$ stays bounded. Once $\lvert z_n\rvert>2$ the orbit is certain to escape, so 2 is a safe escape radius. For a Julia set you fix $c$ (for example $-0.8+0.156i$) and ask the same question for every starting $z_0$ on the grid.

A few spot checks, with a cap of 100 iterations: $c=-2$, $-1$ and $0.25$ never escape; $c=0.26$ escapes after 29 steps, $0.3$ after 11, $1$ after 2. Orbits near the boundary of the set take many steps to leave, and that is where all the detail is.

## 2. Smooth Coloring

Coloring by the integer step $n$ gives visible bands. Fix this by estimating where the orbit would have crossed the radius $R$ between steps. Once $\lvert z\rvert$ is large, squaring doubles its logarithm each step: $\ln\lvert z_{n+k}\rvert\approx 2^k\ln\lvert z_n\rvert$. Solving $2^{\,\nu-n}\ln\lvert z_n\rvert=\ln R$ gives the continuous iteration count

$$
\nu=n+1-\log_2\frac{\ln\lvert z_n\rvert}{\ln R}
$$

where $n$ is the first step with $\lvert z_n\rvert>R$ (the $+1$ only shifts the scale). Use a large radius such as $R=256$ so the approximation holds. Feed $\nu$ into a palette.

```python
import numpy as np

def mandelbrot(w=800, h=600, maxit=200, R=256.0):
    x = np.linspace(-2.2, 0.8, w); y = np.linspace(-1.1, 1.1, h)
    c = x[None, :] + 1j * y[:, None]
    z = np.zeros_like(c); nu = np.zeros(c.shape); alive = np.ones(c.shape, bool)
    for n in range(maxit):
        z[alive] = z[alive] ** 2 + c[alive]
        esc = alive & (np.abs(z) > R)
        nu[esc] = n + 1 - np.log2(np.log(np.abs(z[esc])) / np.log(R))
        alive &= ~esc
    return nu   # 0 inside the set
```

For a Julia image, start with `z = c_grid` and a constant `c`. In a fragment shader the loop is the same, one pixel per invocation.

## 3. Self-Similarity and Dimension

![[pictures/topics/generative/sierpinski.png]]

<p class="image-caption">Every corner holds a smaller copy of the whole triangle, and each copy holds even smaller ones. Rendered from the equations on this page.</p>

If a shape is made of $N$ copies of itself, each scaled by a factor $s<1$, its similarity dimension is

$$
D=\frac{\ln N}{\ln(1/s)}
$$

The Sierpinski triangle is 3 copies at half size, so

$$
D=\frac{\ln3}{\ln2}\approx1.585
$$

A line gives $N=2$, $s=1/2$, $D=1$; a filled square gives $N=4$, $s=1/2$, $D=2$. The triangle lies between them: it takes up more than a curve and has no area.

## 4. Box Counting

For shapes that are not exactly self-similar, cover the set with boxes of side $\varepsilon$, count the non-empty boxes $N(\varepsilon)$, and fit

$$
D_\text{box}=\lim_{\varepsilon\to0}\frac{\ln N(\varepsilon)}{\ln(1/\varepsilon)}
$$

In practice you plot $\ln N$ against $\ln(1/\varepsilon)$ over a range of box sizes and take the slope. I tested this on a 1024 by 1024 Sierpinski bitmask (pixel $(i,j)$ filled when `i & j == 0`). Counting boxes of side 1, 2, 4, ..., 128 pixels gave 59049, 19683, 6561, ..., 27 occupied boxes, a factor of 3 per halving, and the fitted slope is 1.585, matching $\ln3/\ln2$.

> [!warning] Common mistake
> Box counting only makes sense in the range between the pixel size and the image size, and over at least a decade or so of scales. Include the largest and smallest boxes and the slope drifts. For a point cloud from an attractor you also need enough points that small boxes are not empty by chance.

## 5. Dimensions of Things in This Garden

The boundary of the Mandelbrot set has dimension 2 (a result of Shishikura), as complicated as a curve in the plane can be. The Lorenz attractor has dimension of about 2.06, a little more than a surface, consistent with the Kaplan-Yorke estimate $2+0.9056/14.572\approx2.062$ computed in [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]. Treat 2.06 as approximate: estimates from correlation-dimension methods vary in the second decimal.

## Related

- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: fractal sets from ODEs and maps
- [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]: the Kaplan-Yorke dimension
- [[notes/generative/logistic-map-and-bifurcations|The Logistic Map and Bifurcations]]: the real slice of the Mandelbrot set
- [[notes/generative/noise-functions|Noise Functions]]: fBm gives statistical rather than exact self-similarity
- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: running the escape loop per pixel
