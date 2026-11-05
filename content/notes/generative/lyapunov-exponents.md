---
title: "Lyapunov Exponents"
tags:
  - math
  - chaos
  - dynamical-systems
date: 2026-11-05
---

A Lyapunov exponent measures how fast two nearby trajectories separate. A positive exponent means they separate exponentially, which is the working definition of chaos, and its inverse tells you how long a prediction stays useful. It is the number I reach for to answer "is this parameter set actually chaotic, or just wiggly?"

## Mental Model

- Two states a distance $\delta_0$ apart drift to a distance $\delta(t)\approx\delta_0 e^{\lambda t}$. The exponent $\lambda$ is the growth rate.
- $\lambda>0$ means chaos, $\lambda=0$ a neutral direction (a flow always has one along its own trajectory), $\lambda<0$ contraction.
- An $n$-dimensional system has $n$ exponents, called the spectrum. The largest one sets predictability.
- The sum of all exponents is the average rate at which phase-space volume shrinks.

## 1. Definition

For a one-dimensional map $x_{n+1}=f(x_n)$, a small error $\epsilon_n$ is multiplied by $f'(x_n)$ each step. After $N$ steps it is multiplied by $\prod\lvert f'(x_i)\rvert$, and the average log growth per step is

$$
\lambda=\lim_{N\to\infty}\frac1N\sum_{i=0}^{N-1}\ln\lvert f'(x_i)\rvert
$$

For a flow, compare two trajectories directly:

$$
\lambda=\lim_{t\to\infty}\lim_{\delta_0\to0}\frac1t\ln\frac{\lVert\delta(t)\rVert}{\lVert\delta_0\rVert}
$$

In higher dimensions the derivative becomes the Jacobian, and the exponents come from the growth of its product along the orbit. For the largest exponent it is enough to follow one perturbation.

## 2. Worked Example: Logistic Map at r=4

With $f(x)=4x(1-x)$ we have $f'(x)=4-8x$. Averaging $\ln\lvert4-8x_i\rvert$ along an orbit of 200,000 points (after dropping 100) gives

$$
\lambda\approx 0.69314\quad\text{vs}\quad\ln 2=0.693147
$$

which agrees to four digits. At $r=4$ the invariant density is known in closed form and the integral gives exactly $\ln2$: each step doubles errors on average, losing one bit per iteration. A double has 53 bits of mantissa, so a logistic-map orbit at $r=4$ computed in floating point is meaningful for roughly 50 iterations before the rounding error has grown to order one.

The same average at $r=3.2$ (a stable 2-cycle) is negative, and at $r=3.83$ (the period-3 window) it is also negative. The sign of $\lambda$ along $r$ traces the bifurcation diagram, see [[notes/generative/logistic-map-and-bifurcations|The Logistic Map and Bifurcations]].

## 3. Lorenz by Two-Trajectory Renormalization

![[pictures/topics/generative/lorenz-divergence.png]]

<p class="image-caption">Two runs that start a hundred-millionth apart look identical, then suddenly don't. On a log scale the gap grows along a straight line, and its slope is the Lyapunov exponent. Rendered from the equations on this page.</p>

You cannot let two chaotic trajectories run apart for long: the separation saturates at the size of the attractor, and the exponential law stops. The fix is renormalization. Advance both for a short time, record the log growth, and pull the second trajectory back to distance $\delta_0$ along the line to the first.

```python
import numpy as np

def f(s, sg=10, r=28, b=8/3):
    return np.array([sg*(s[1]-s[0]), s[0]*(r-s[2])-s[1], s[0]*s[1]-b*s[2]])

def rk4(s, dt):
    k1 = f(s); k2 = f(s+dt/2*k1); k3 = f(s+dt/2*k2); k4 = f(s+dt*k3)
    return s + dt/6*(k1 + 2*k2 + 2*k3 + k4)

dt, d0, n = 0.01, 1e-8, 300_000
a = np.array([1.0, 1.0, 1.0])
for _ in range(5000): a = rk4(a, dt)        # settle onto the attractor
b = a + np.array([d0, 0, 0])
total = 0.0
for _ in range(n):
    a, b = rk4(a, dt), rk4(b, dt)
    d = np.linalg.norm(b - a)
    total += np.log(d / d0)
    b = a + (b - a) * d0 / d                # renormalize
print(total / (n * dt))
```

For the classic constants ($\sigma=10$, $\rho=28$, $\beta=8/3$) this prints about 0.907 over 3000 time units. The accepted value is 0.9056. Both numbers are per unit of model time, which depends on your integration scale, not seconds.

## 4. Lyapunov Time and the Prediction Horizon

The Lyapunov time is $T_\lambda=1/\lambda$. For Lorenz it is about $1/0.9056\approx1.1$ model time units, the time in which an error grows by a factor of $e$.

If the initial error is $\delta_0$ and you tolerate an error $\Delta$, the prediction horizon is

$$
t_\text{hor}\approx\frac1\lambda\ln\frac{\Delta}{\delta_0}
$$

With $\delta_0=10^{-8}$ and $\Delta=1$ (the size of the attractor features) this is $\ln(10^8)/0.9056\approx 20$ time units. The dependence on $\delta_0$ is only logarithmic, which is the practical punchline: making a measurement a million times more precise buys you $\ln(10^6)/\lambda\approx15$ more units, about 14 Lyapunov times, not a million times longer.

> [!warning] Common mistake
> The horizon formula uses the average exponent. Locally, errors can shrink for a while (where the attractor folds) and then grow quickly, so individual forecasts beat or miss the estimate.

## 5. The Spectrum and Kaplan-Yorke Dimension

The three Lorenz exponents are about $(0.9056,\ 0,\ -14.572)$. The zero is the direction along the flow. The sum equals the average divergence of the vector field, which for Lorenz is constant:

$$
\sum\lambda_i=-(\sigma+1+\beta)=-13.667
$$

so the third exponent follows from the first two: $-13.667-0.9056\approx-14.572$. That constraint is what makes the attractor thin: volumes contract by $e^{-13.667}$ per time unit while one direction stretches.

The **Kaplan-Yorke dimension** turns the spectrum into a fractal dimension. Sort the exponents from largest to smallest, let $j$ be the largest index for which $\lambda_1+\dots+\lambda_j\ge0$, and set

$$
D_{KY}=j+\frac{\lambda_1+\dots+\lambda_j}{\lvert\lambda_{j+1}\rvert}
$$

For Lorenz, $j=2$ and $D_{KY}=2+0.9056/14.572\approx2.062$, in line with the direct estimates of the attractor's dimension (see [[notes/generative/fractals|Fractals and Fractal Dimension]]).

## Related

- [[notes/random/lorenz-attractor|The Lorenz Attractor]]: the system measured above
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: more systems to compute exponents for
- [[notes/generative/logistic-map-and-bifurcations|The Logistic Map and Bifurcations]]: where the sign of $\lambda$ changes
- [[notes/generative/numerical-integration|Numerical Integration]]: why RK4 and small steps matter for these runs
- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: Jacobians and divergence
