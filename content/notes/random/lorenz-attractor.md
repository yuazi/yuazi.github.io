---
title: "The Lorenz Attractor"
tags:
  - math
  - chaos
  - simulation
  - visual
date: 2026-03-04
---

![[pictures/lorenz_8k_textured.png]]

<p class="image-caption">8K Lorenz attractor export with density-based coloring</p>

The Lorenz attractor is one of those mathematical objects that stops me in the middle of a thought. It fits on a napkin, three coupled differential equations, and still no two trajectories ever quite repeat.

$$
\dot{x} = \sigma(y - x)
$$

$$
\dot{y} = x(\rho - z) - y
$$

$$
\dot{z} = xy - \beta z
$$

With $\sigma = 10$, $\rho = 28$, $\beta = \frac{8}{3}$, the system never settles. It orbits one lobe, flips to the other, and keeps doing that forever. You can write down every rule, and you still can't say where it will be later.

## Why I find it fascinating

What gets me is how a tiny difference in starting position, almost too small to measure, sends the system down a completely different path. There is no randomness anywhere in it. Still, the only way to find out where a trajectory ends up is to run the whole simulation. That gap between _deterministic_ and _predictable_ hits different when you watch it play out on screen.

Plenty of things in life work like that: knowing the rules doesn't put you in control.

The other reason is honestly just that it looks great. The trail keeps folding back on itself, always tracing the same winged shape and never landing on the same point twice, and it feels almost alive, like it has intention. That's a lot to get out of three equations running in a loop.

That's why it's in the background of this site.

> Hands-on version: I built [[work/attractormediapipe|AttractorMediaPipe]], a gestural instrument that lets you "touch" and rotate these attractors with real-time hand tracking.

## The Halvorsen attractor

The side attractors on this site use the Halvorsen system, a cousin of the Lorenz system with threefold rotational symmetry:

$$
\dot{x} = -ax - 4y - 4z - y^2
$$

$$
\dot{y} = -ay - 4z - 4x - z^2
$$

$$
\dot{z} = -az - 4x - 4y - x^2
$$

The single parameter $a$ controls the overall shape. Around $a = 1.4$ it forms a tight, coiling knot, more compact than the Lorenz butterfly and just as restless.

## Tuning it

The gear button in the bottom right corner of this site adjusts both attractors in real time: σ, ρ and β for Lorenz, $a$ for Halvorsen, plus trail length, speed and particle count. Drag ρ below 24 and the system collapses to a fixed point. Bring it back above 24.74 and the chaos returns. That threshold is a Hopf bifurcation.

<button class="chaos-trigger" onclick="document.dispatchEvent(new CustomEvent('lorenz-chaos'))">Trigger Chaos Mode 🌀</button>

<style>
.chaos-trigger {
  background: var(--secondary);
  color: var(--light);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  margin-top: 1rem;
  transition: transform 0.1s ease;
}
.chaos-trigger:active {
  transform: scale(0.95);
}
</style>

---

[[notes/index|(y) Return to Notes]] | [[notes/random/index|(y) Return to Random Hub]] | [[/index|(y) Return to Home]]
