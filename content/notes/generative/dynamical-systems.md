---
title: "Dynamical Systems Basics"
tags:
  - math
  - chaos
  - dynamical-systems
date: 2026-11-05
---

A dynamical system is a rule for how a state changes. Give it a starting point and the rule produces everything after: a pendulum swinging down, a population over the years, the three numbers of the Lorenz equations. The vocabulary here (phase space, fixed points, stability, attractors) is what every other page in this section assumes, so I want it in one place with a few worked numbers.

## Mental Model

- The state is a point in phase space. The rule moves that point, and the whole history is a curve through it.
- Near a fixed point the nonlinear rule looks linear, and the eigenvalues of the Jacobian decide whether nearby points fall in or fly out.
- Dissipative systems squeeze phase-space volume. An attractor is where the squeezed volume ends up.
- A flow in the plane cannot be chaotic. Chaos needs three dimensions for flows, but only one for maps.

## 1. Flows and Maps

A **flow** is an ordinary differential equation (ODE), time is continuous, and the state $\mathbf{x}\in\mathbb{R}^n$ obeys

$$
\dot{\mathbf{x}} = \mathbf{f}(\mathbf{x})
$$

The Lorenz, Rössler and Halvorsen systems are flows. A **map** steps in whole ticks:

$$
\mathbf{x}_{n+1} = \mathbf{g}(\mathbf{x}_n)
$$

The logistic map and the Clifford map are maps (see [[notes/generative/logistic-map-and-bifurcations|The Logistic Map and Bifurcations]]). The two are linked. Sampling a flow once per revolution, or each time it crosses a plane, gives a map (a Poincaré section), and that is how period doubling in a flow gets studied with one-dimensional pictures.

A system is **autonomous** when $\mathbf{f}$ has no explicit time dependence. Any non-autonomous system can be made autonomous by adding $t$ as an extra state variable, so autonomous systems lose no generality.

## 2. Phase Space and Fixed Points

The phase space is the set of all possible states. For a damped oscillator $\ddot{x}+0.4\dot{x}+x=0$, write $y=\dot{x}$ and the state is $(x,y)$:

$$
\dot{x}=y,\qquad \dot{y}=-x-0.4\,y
$$

A **fixed point** $\mathbf{x}^*$ satisfies $\mathbf{f}(\mathbf{x}^*)=\mathbf{0}$. Here that is the origin. For a map, $\mathbf{g}(\mathbf{x}^*)=\mathbf{x}^*$.

## 3. Linear Stability

Expand $\mathbf{f}$ around $\mathbf{x}^*$. With $\boldsymbol{\xi}=\mathbf{x}-\mathbf{x}^*$ small,

$$
\dot{\boldsymbol{\xi}} \approx J\,\boldsymbol{\xi},\qquad J_{ij}=\frac{\partial f_i}{\partial x_j}\Big|_{\mathbf{x}^*}
$$

and solutions are combinations of $e^{\lambda t}$ for each eigenvalue $\lambda$ of $J$. The rule for flows: if every eigenvalue has negative real part the fixed point is stable, and if any has positive real part it is unstable. For maps the threshold is $\lvert\lambda\rvert<1$.

For the damped oscillator

$$
J=\begin{pmatrix}0&1\\-1&-0.4\end{pmatrix},\qquad \lambda^2+0.4\lambda+1=0,\qquad \lambda=-0.2\pm 0.98\,i
$$

The real part is negative, so the origin is stable. The imaginary part makes trajectories spiral. Amplitude shrinks as $e^{-0.2t}$, which is a factor of $0.135$ after 10 time units.

> [!example] Worked example: the Lorenz origin
> For $\sigma=10,\ \rho=28,\ \beta=8/3$ the Jacobian at the origin is
>
> $$
> J=\begin{pmatrix}-\sigma&\sigma&0\\ \rho&-1&0\\ 0&0&-\beta\end{pmatrix}
> $$
>
> The $z$ block gives $\lambda=-\beta=-2.667$. The $(x,y)$ block gives $\lambda^2+(\sigma+1)\lambda+\sigma(1-\rho)=\lambda^2+11\lambda-270=0$, so $\lambda=11.83$ and $\lambda=-22.83$. One positive eigenvalue makes the origin a saddle: it pushes trajectories away along one direction and pulls them in along the other two. NumPy's `eigvals` returns the same three numbers.
>
> The other two fixed points are $(\pm\sqrt{\beta(\rho-1)},\ \pm\sqrt{\beta(\rho-1)},\ \rho-1)=(\pm 8.485,\ \pm 8.485,\ 27)$. Their Jacobian has a real eigenvalue $-13.85$ and a complex pair $0.094\pm 10.19\,i$. The real part is just barely positive, so each is an unstable spiral. The pair crosses zero at $\rho=\sigma(\sigma+\beta+3)/(\sigma-\beta-1)\approx 24.74$, which is the Hopf bifurcation mentioned in [[notes/random/lorenz-attractor|the Lorenz essay]].

Linear stability tells you nothing when an eigenvalue has real part exactly zero. It also says nothing about how far the linear picture holds.

## 4. Limit Cycles and Attractors

Not every long-term behavior is a point. The van der Pol oscillator

$$
\ddot{x}-\mu(1-x^2)\dot{x}+x=0
$$

has an unstable origin for $\mu>0$ (the trace of its Jacobian is $\mu$), yet trajectories do not blow up. Large amplitudes get damped, small ones get amplified, and everything converges to a closed loop. For $\mu=1$ integrating from two very different starts gives the same loop with amplitude $x_{\max}\approx 2.009$ and period $\approx 6.66$. That loop is a **limit cycle**.

An **attractor** is a set that trajectories from a whole neighborhood (its basin of attraction) approach, and that cannot be split into smaller attracting pieces. The standard list is a fixed point, a limit cycle, a torus (quasi-periodic motion), and a strange attractor. A strange attractor has a fractal structure and sensitive dependence on initial conditions (see [[notes/generative/fractals|Fractals and Fractal Dimension]] and [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]).

## 5. Conservative vs Dissipative

How does a small blob of initial conditions change volume? Liouville's formula says the volume rate of change is the divergence of the field:

$$
\frac{1}{V}\frac{dV}{dt}=\nabla\cdot\mathbf{f}=\sum_i\frac{\partial f_i}{\partial x_i}
$$

A system with $\nabla\cdot\mathbf{f}=0$ is **conservative** (Hamiltonian systems are the main example). A system with $\nabla\cdot\mathbf{f}<0$ is **dissipative**. The damped oscillator has divergence $-0.4$. Lorenz has

$$
\nabla\cdot\mathbf{f}=-\sigma-1-\beta=-13.67
$$

at every point, so a blob's volume shrinks by $e^{-13.67}\approx 1.2\times 10^{-6}$ per time unit. Phase-space volume goes to zero while individual trajectories keep diverging from each other. That is why the Lorenz attractor can have zero volume and still be unpredictable: it is a thin object with dimension just above 2. The numbers are made precise on the Lyapunov page.

## 6. Why Chaos Needs Three Dimensions

The Poincaré-Bendixson theorem says a bounded trajectory of a smooth flow in the plane either approaches a fixed point or approaches a closed orbit. Trajectories cannot cross, and in the plane a curve that cannot cross itself has nowhere complicated to go.

In three dimensions a curve can wind around another curve without touching it, and the squeeze from dissipation can combine with stretching along one direction and folding back to produce a strange attractor. A non-autonomous system with periodic forcing can be chaotic with two state variables because the clock supplies the third dimension.

Maps escape the restriction because a map can jump over its own history. The logistic map is chaotic in one dimension.

> [!warning] Common mistake
> Chaos is not randomness, and it is not instability of a single trajectory alone. A flow can have exponentially diverging trajectories (an unstable saddle) while no strange attractor exists. The recipe is a bounded set, a positive Lyapunov exponent, and no stable fixed point or cycle absorbing everything.

## Related

- [[notes/generative/numerical-integration|Numerical Integration (Euler to RK4)]]: how to actually step $\dot{\mathbf{x}}=\mathbf{f}(\mathbf{x})$ on a computer.
- [[notes/generative/strange-attractors|Strange Attractors Beyond Lorenz]]: more flows with fixed points and Jacobians to work out.
- [[notes/generative/logistic-map-and-bifurcations|The Logistic Map and Bifurcations]]: stability for maps and what a bifurcation looks like.
- [[notes/generative/lyapunov-exponents|Lyapunov Exponents]]: the divergence of nearby trajectories measured.
- [[notes/random/lorenz-attractor|The Lorenz Attractor]]: the essay behind this site's background.
- [[work/attractormediapipe|Gestural Attractors]]: nine of these flows integrated live.
