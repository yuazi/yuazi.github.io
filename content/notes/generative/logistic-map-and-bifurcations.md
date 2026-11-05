---
title: "The Logistic Map and Bifurcations"
tags:
  - math
  - chaos
  - dynamical-systems
date: 2026-11-05
---

The logistic map is one line, $x_{n+1}=rx_n(1-x_n)$, and it contains most of what is known about how order turns into chaos. As the parameter $r$ increases, a steady value splits into a 2-cycle, then 4, 8, 16 and so on, faster each time, until the behaviour stops repeating. The same sequence shows up in fluids, circuits and populations, and the ratio between successive splits is a universal constant.

![[pictures/topics/generative/logistic-map-and-bifurcations.png]]

<p class="image-caption">Turn up one knob and a single answer splits into two, then four, then chaos. Rendered for this page.</p>

## Mental Model

- For $x\in[0,1]$ and $0<r\le 4$ the map stays in $[0,1]$. Think of $r$ as a knob that stretches and folds the interval.
- A fixed point is stable when the slope of the map there has absolute value below 1.
- Period doubling happens when that slope (or the slope of the $n$-th iterate) reaches $-1$.
- Chaos is not one big event. It starts at an accumulation point, and periodic windows keep reappearing inside it.

## 1. Fixed Points and Stability

A fixed point satisfies $x=rx(1-x)$, giving $x^*=0$ and $x^*=1-1/r$. Write $f(x)=rx(1-x)$, so $f'(x)=r(1-2x)$.

At $x^*=0$ the slope is $r$, so zero is stable only for $r<1$. At $x^*=1-1/r$ the slope is $r(1-2+2/r)=2-r$. Stability needs $\lvert 2-r\rvert<1$, so the nonzero fixed point is stable for $1<r<3$. For $r=2.8$, running the map from $x_0=0.2$ settles at 0.6429, which is $1-1/2.8$.

At $r=3$ the slope is $-1$. The fixed point is still there but unstable, and trajectories alternate on either side of it.

## 2. Period Doubling

Past $r=3$ the orbit lands on a 2-cycle: $x_{n+2}=x_n$ with $x_{n+1}\neq x_n$. Solving $f(f(x))=x$ and removing the fixed points leaves

$$
x_{\pm}=\frac{(r+1)\pm\sqrt{(r-3)(r+1)}}{2r}
$$

which is real only for $r>3$. At $r=3.2$ this gives about 0.513 and 0.7995, matching a run of the map.

The slope of the 2-cycle is the product of slopes at its two points, $f'(x_+)f'(x_-)=-r^2+2r+4$. Setting it to $-1$ gives $r^2-2r-5=0$, so

$$
r=1+\sqrt{6}\approx 3.449
$$

At that value the 2-cycle goes unstable and splits into a 4-cycle (running at $r=3.5$ shows four values: 0.3828, 0.5009, 0.8269, 0.875). The 4-cycle splits into an 8-cycle, and so on. If $r_n$ is the value where the $2^n$-cycle appears, the gaps shrink geometrically:

$$
\delta=\lim_{n\to\infty}\frac{r_n-r_{n-1}}{r_{n+1}-r_n}\approx 4.669
$$

This is the Feigenbaum constant. Using the published values $r=3,\ 3.449490,\ 3.544090,\ 3.564407,\ 3.568759$, the successive ratios come out as 4.75, 4.66 and 4.67, already close. Any smooth one-hump map with a quadratic maximum gives the same $\delta$, so it is a property of the route to chaos and not of this particular formula.

## 3. Onset of Chaos and Windows

The sequence of doublings accumulates at

$$
r_\infty\approx 3.5699
$$

Beyond it the orbit never settles into a finite cycle for most values of $r$. Inside the chaotic region there are periodic windows. The widest is the period-3 window, which opens at

$$
r=1+\sqrt{8}\approx 3.8284
$$

where a pair of period-3 orbits is born in a saddle-node bifurcation. At $r=3.83$ the run shows exactly three values: 0.1561, 0.5047, 0.9574. The period-3 window then period-doubles itself (3, 6, 12, ...) and closes back into chaos. A theorem of Sharkovskii and the Li-Yorke result "period three implies chaos" say that once a continuous 1D map has a 3-cycle it has cycles of every period.

At $r=4$ the map covers $[0,1]$ completely. It is conjugate to the tent map, and the Lyapunov exponent is exactly $\ln 2$ (see [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]).

> [!tip] Intuition
> The parabola stretches the interval and folds it over itself. Stretching separates nearby points (sensitive dependence), folding keeps everything in the unit interval (boundedness). Rössler's ribbon is the same stretch-and-fold in continuous time.

## 4. Drawing the Bifurcation Diagram

Sweep $r$ across columns. For each $r$, iterate past the transient, then plot the next few hundred values of $x$. Stable cycles appear as thin branches; chaos fills in bands.

```python
import numpy as np
import matplotlib.pyplot as plt

rs = np.linspace(2.5, 4.0, 2000)
x = 0.5 * np.ones_like(rs)
for _ in range(1000):          # discard transient
    x = rs * x * (1 - x)
R, X = [], []
for _ in range(200):           # record
    x = rs * x * (1 - x)
    R.append(rs.copy()); X.append(x.copy())
plt.plot(np.concatenate(R), np.concatenate(X), ",k", alpha=0.3)
plt.xlabel("r"); plt.ylabel("x"); plt.show()
```

The vectorized update handles all 2000 values of $r$ at once. Near the bifurcations convergence is slow ("critical slowing down"), so a transient of 1000 steps still leaves a visible smear at $r=3$ and $r=1+\sqrt{6}$. Increase it to 5000 if you want clean branches there.

## 5. Why It Matters for Visuals

A bifurcation diagram is a map of behaviour: wherever the diagram is thin, the system is predictable, and wherever it is dense, it is not. Driving $r$ slowly with an LFO moves a patch through order, doubling and chaos, which is an easy modulation source for audio or TouchDesigner parameters. The Feigenbaum scaling is also what you see in flows, where a Poincaré section turns a period-doubling Rössler orbit into the same cascade.

## Related

- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: fixed points and stability in general
- [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]: quantifying chaos along the diagram
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: the continuous-time cousins
- [[notes/generative/fractals|Fractals and Fractal Dimension]]: the Mandelbrot set is the logistic map in the complex plane
- [[notes/random/lorenz-attractor|The Lorenz Attractor]]: another route to chaos, through a Hopf bifurcation
