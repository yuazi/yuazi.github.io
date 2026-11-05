---
title: "Numerical Integration (Euler to RK4)"
tags:
  - math
  - numerics
  - simulation
date: 2026-11-05
---

An attractor visualizer does one thing over and over: take the state, ask the equations for a velocity, and move a short distance. The question is how to choose that move. Explicit Euler is the obvious choice and a poor one. Fourth-order Runge-Kutta (RK4) costs four evaluations per step and is the default in almost every attractor renderer, including [[work/attractormediapipe|my gestural attractor project]]. This page derives the usual methods, measures their error on a problem with a known answer, and ends with what I actually do when drawing.

## Mental Model

- A step of size $h$ estimates the average slope over the interval. The methods differ in how good that estimate is.
- A method of order $p$ has global error $\propto h^p$. Halving $h$ divides the error by $2^p$.
- Accuracy and stability are different limits. A method can be accurate for small $h$ and still blow up once $h$ crosses a threshold set by the fastest time scale.
- For a chaotic system the individual trajectory is wrong after a while no matter what. The question is whether the picture is still right.

## 1. The Methods

For $\dot{\mathbf{y}}=\mathbf{f}(\mathbf{y})$, step from $\mathbf{y}_n$ to $\mathbf{y}_{n+1}$ with step $h$.

**Explicit Euler** follows the slope at the start of the interval:

$$
\mathbf{y}_{n+1}=\mathbf{y}_n+h\,\mathbf{f}(\mathbf{y}_n)
$$

**Midpoint** (a second-order Runge-Kutta) takes a half step to find the slope in the middle, then uses it for the whole step:

$$
\mathbf{y}_{n+1}=\mathbf{y}_n+h\,\mathbf{f}\!\left(\mathbf{y}_n+\tfrac{h}{2}\mathbf{f}(\mathbf{y}_n)\right)
$$

**RK4** blends four slopes, with the two midpoint slopes counted twice:

$$
\begin{aligned}
\mathbf{k}_1&=\mathbf{f}(\mathbf{y}_n)\\
\mathbf{k}_2&=\mathbf{f}(\mathbf{y}_n+\tfrac{h}{2}\mathbf{k}_1)\\
\mathbf{k}_3&=\mathbf{f}(\mathbf{y}_n+\tfrac{h}{2}\mathbf{k}_2)\\
\mathbf{k}_4&=\mathbf{f}(\mathbf{y}_n+h\,\mathbf{k}_3)\\
\mathbf{y}_{n+1}&=\mathbf{y}_n+\tfrac{h}{6}\left(\mathbf{k}_1+2\mathbf{k}_2+2\mathbf{k}_3+\mathbf{k}_4\right)
\end{aligned}
$$

## 2. Local and Global Error

Comparing with the Taylor series of the true solution shows that Euler matches terms up to $h$, so its **local error** (the error made in one step from an exact start) is $O(h^2)$. Midpoint matches through $h^2$, local error $O(h^3)$. RK4 matches through $h^4$, local error $O(h^5)$.

Reaching a fixed time $T$ takes $T/h$ steps and local errors accumulate, so the **global error** loses one power: $O(h)$ for Euler, $O(h^2)$ for midpoint, $O(h^4)$ for RK4. The names "first, second and fourth order" refer to the global exponent.

## 3. Measuring the Order

The logistic ODE $\dot{y}=y(1-y)$ has the exact solution $y(t)=1/\bigl(1+(1/y_0-1)e^{-t}\bigr)$. With $y_0=0.1$ and $T=2$ the exact value is $0.450853$.

```python
import numpy as np

f = lambda y: y * (1 - y)
exact = 1 / (1 + 9 * np.exp(-2.0))

def euler(y, h):
    return y + h * f(y)

def midpoint(y, h):
    return y + h * f(y + 0.5 * h * f(y))

def rk4(y, h):
    k1 = f(y); k2 = f(y + h / 2 * k1); k3 = f(y + h / 2 * k2); k4 = f(y + h * k3)
    return y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)

for step in (euler, midpoint, rk4):
    errs = []
    for n in (4, 8, 16, 32, 64):
        y = 0.1
        for _ in range(n):
            y = step(y, 2.0 / n)
        errs.append(abs(y - exact))
    orders = np.log2(np.array(errs[:-1]) / np.array(errs[1:]))
    print(step.__name__, f"{errs[-1]:.2e}", orders.round(2))
```

Running this gives final errors at $h=2/64$ of $3.9\times10^{-3}$ for Euler, $1.7\times10^{-5}$ for midpoint and $1.1\times10^{-9}$ for RK4. The measured orders, $\log_2$ of the error ratio per halving, settle at $1.0$, $2.0$ and $4.0$ (the last row for RK4 reads $3.98$). RK4 with just 4 steps ($h=0.5$, error $6.0\times10^{-5}$) beats Euler with 64 steps, so the four evaluations per step pay for themselves.

## 4. Step Size and Stability

Take the test problem $\dot{y}=-50y$. Euler gives $y_{n+1}=(1-50h)\,y_n$, so it decays only when $\lvert 1-50h\rvert<1$, that is $h<0.04$. At $h=0.045$ the amplification factor is $1.25$ and the solution grows even though the true one decays. RK4 replaces $1-50h$ by the Taylor polynomial of $e^{-50h}$ up to the fourth term, which is stable up to $50h\approx 2.785$, so $h<0.0557$.

This is the constraint that matters for attractor rendering. Along the Lorenz attractor the Jacobian's largest eigenvalue magnitude reaches about $22.9$ (I sampled it along a trajectory), which puts the linear limit for RK4 near $2.785/22.9\approx 0.12$. Euler is worse than its linear limit suggests: oscillating modes (complex eigenvalues) get amplified by $\lvert 1+h\lambda\rvert>1$ for every $h$ when $\mathrm{Re}\,\lambda\ge 0$, so Euler adds energy to every spiral it passes. Integrating the standard Lorenz system from $(1,1,1)$ gave:

| Method | Step | Result                                                         |
| ------ | ---- | -------------------------------------------------------------- |
| Euler  | 0.01 | stays on the attractor, but $z$ reaches 51 instead of about 46 |
| Euler  | 0.03 | overflows to NaN (it already failed at 0.025)                  |
| RK4    | 0.03 | stays on the attractor                                         |
| RK4    | 0.12 | still bounded; 0.15 diverges                                   |

Measured against a high-accuracy reference (SciPy's `DOP853` at tolerance $10^{-13}$), the trajectory deviated by 1 unit after $t=0.17$ for Euler at $h=0.01$, $t=5.1$ for Euler at $h=0.001$, and $t=18$ for RK4 at $h=0.01$. Chaos limits that last number, as the Lyapunov page explains.

## 5. Symplectic Integrators

For conservative orbit problems, such as planets or a frictionless oscillator, even RK4 drifts. A **symplectic** integrator preserves the geometric structure of Hamiltonian flow. Energy is not conserved exactly, but it oscillates within a band instead of drifting.

For the harmonic oscillator $\dot{q}=p,\ \dot{p}=-q$ (energy $E=\tfrac12(q^2+p^2)=0.5$), compare three methods at $h=0.1$ over 1000 time units:

```python
def step_euler(q, p, h):   return q + h * p, p - h * q          # energy grows
def step_symp(q, p, h):    p -= h * q; return q + h * p, p      # symplectic Euler
# RK4 on (q, p) is the third comparison
```

The final energies I got are $8\times10^{42}$ for explicit Euler (it multiplies energy by $1+h^2$ every step), $0.4936$ for symplectic Euler and $0.49993$ for RK4. Symplectic Euler is only first-order and its energy stays between $0.476$ and $0.526$ forever, while RK4 loses energy slowly and monotonically, so over long enough runs RK4 eventually loses. Velocity Verlet, the leapfrog variant, is second-order and also symplectic, and is the usual choice for gravity simulations.

None of this applies to the Lorenz equations, which are dissipative. Symplectic methods are for systems with zero divergence.

## 6. Practical Advice for Rendering Attractors

- Use RK4 with $h\approx 0.005$ to $0.01$ for Lorenz-like systems (time scale about 1) and take several substeps per frame. Draw every substep or every few for smoother trails.
- Check the fastest rate in the Jacobian and keep $h$ well below $2.8/\lvert\lambda_{\max}\rvert$. Systems with large parameters (Chen, Dadras) need smaller steps than Thomas or Aizawa.
- Accept that the trajectory is not exact. Shadowing, the property that a numerical orbit stays near some true orbit, means the picture is faithful even when the specific path is not. This is why Euler at $h=0.01$ still draws a recognizable Lorenz butterfly.
- Do the arithmetic in float32 on the GPU only if you must. Rounding noise acts like a tiny random push, which is harmless for pictures and wrong for measuring Lyapunov exponents.
- Adaptive steppers (`scipy.integrate.solve_ivp`) are overkill for real-time drawing, but are the right tool for producing reference data.

> [!warning] Common mistake
> Making Euler more accurate by shrinking $h$ is almost always a worse trade than switching to RK4. On the test above Euler needs roughly 4000 steps to match the error RK4 reaches in 4.

## Related

- [[notes/generative/dynamical-systems|Dynamical Systems Basics]]: where the time scales come from (Jacobian eigenvalues).
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: the systems you would integrate.
- [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]: why a chaotic trajectory stops matching the reference.
- [[notes/generative/reaction-diffusion|Reaction-Diffusion (Gray-Scott)]]: explicit time stepping of a PDE with its own step limit.
- [[work/attractormediapipe|Gestural Attractors]]: RK4 steppers in Numba and on the GPU.
- [[notes/graphics/compute-shaders|Compute Shaders]]: where per-particle integration runs on the GPU.
