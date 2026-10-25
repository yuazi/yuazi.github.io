---
title: "Particle System with POPs"
tags:
  - touchdesigner
  - td/recipes
  - particles
  - pop
  - recipes
date: 2026-03-01
---

**POPs (Point Operators)** run entirely on the GPU, so a particle system built from them can push hundreds of thousands of particles, with forces and color, while the CPU stays mostly idle.

> [!info] Operator Families in this Recipe
>
> - **SOPs (Surface Operators):** 3D shapes like spheres and boxes.
> - **POPs (Point Operators):** Particles and points on the GPU.
> - **CHOPs (Channel Operators):** Numbers and audio signals.
> - **COMPs (Components):** The 3D "world" container.

---

## How POPs fit into a network

POPs work on **point clouds**: big sets of 3D points where each point has "attributes" like position, velocity, and color.

They live inside a **POP SOP**, the bridge node. It takes regular 3D shapes (SOPs), turns them into particles (POPs), and then brings them back into your 3D scene.

---

## Part 1: Basic Emitter

1.  **The Container:** Create a **Geo COMP** in your root network and double-click to enter it.
2.  **The Bridge:** Delete the default torus. Place a **POP SOP**.
3.  **The Network:** Double-click into the POP SOP node to enter the "POP world."
4.  **The Source:** Add a **Source POP**.
    - **Source Type** → `Point`
    - **Emit Rate** → `1000` (this creates 1,000 particles every second)
    - **Life Expectancy** → `3` (particles disappear after 3 seconds)
5.  **The Engine:** Add a **Solver POP** after the source. Without a Solver, the particles won't move.

```text
Source POP → Solver POP → [output]
```

---

## Part 2: Adding Forces

Forces go between the Source and the Solver:

| Node              | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| **Force POP**     | A constant push. Set **Force Y** to `-9.8` for gravity. |
| **Wind POP**      | Adds "Noise" or turbulence to make it look like smoke.  |
| **Attractor POP** | Pulls particles toward a specific point.                |
| **Collision POP** | Makes particles bounce off another 3D shape (SOP).      |

---

## Part 3: Colour Over Lifetime

Particles can change color as they age.

1.  Add a **Color POP** before the Solver.
2.  **Color Source** → `Ramp`.
3.  **Design your Gradient:** Click the Ramp parameter to design a color scheme (e.g., White at birth → Blue → Transparent at death).
4.  **Life Source** → `Normalized Life`. The color ramp then spans the particle's whole life (0.0 to 1.0).

---

## Part 4: Rendering (Seeing the Result)

The POP SOP outputs points, and TouchDesigner still needs to know _how_ to draw them.

- **Option A: Sprites (Easiest)**
  - Connect the POP SOP output to a **Sprite SOP**.
  - Back in the main network, assign a **Point Sprite MAT** to the Geo COMP.
  - Each particle becomes a 2D dot facing the camera.

- **Option B: Instanced Geometry (Advanced)**
  - Follow the [[touchdesigner/06_Recipes_and_Projects/y-1/Audio Reactive Geometry|Instancing Recipe]] but use the POP SOP as your data source.
  - Each particle becomes a full 3D shape (like a small box or sphere).

---

## Part 5: Audio Reactivity

1.  Create an **Audio File In CHOP** and an **Analyze CHOP** (set to RMS Power).
2.  Use a **Math CHOP** to remap the volume (e.g., 0 to 0.1) to a high particle count (e.g., 100 to 5000).
3.  **Bind** this value to the **Emit Rate** on your **Source POP**. Loud hits now release bursts of particles.

---

## Troubleshooting

- **"I don't see anything!"** Make sure the **Solver POP** is connected and the **Display Flag** (the circle icon in the bottom right) is on.
- **"Particles fly away too fast"** Lower the **Initial Velocity** on the Source POP.
- **"The colors aren't changing"** Check that **Life Source** is set to `Normalized Life`.

---

## Parameter Tuning & Behavior

| Parameter             | Behavior                                                                           |
| :-------------------- | :--------------------------------------------------------------------------------- |
| **Emit Rate**         | Higher = denser clouds of particles; Lower = sparse, individual points.            |
| **Life Expectancy**   | Higher = particles stay on screen longer; Lower = quick "bursts" that vanish fast. |
| **Force Y (Gravity)** | Positive = particles float up; Negative = particles fall down like rain/snow.      |
| **Wind Turbulence**   | Higher = more chaotic, organic movement; Lower = straight, mechanical motion.      |
| **Color Ramp**        | Sets the colors a particle passes through from birth to death.                     |

## Network Architecture

```text
[ POP NETWORK (Inside POP SOP) ]
Source POP (1000/sec) ──┐
                        ▼
[ FORCES ]          [ Force POP ] (Gravity)
                        │
                        ▼
                    [ Wind POP ] (Turbulence)
                        │
                        ▼
[ ATTRIBUTES ]      [ Color POP ] (Ramp by Life)
                        │
                        ▼
[ SIMULATION ]      [ Solver POP ] (The Engine)
                        │
      ┌─────────────────┘
      ▼
[ POP SOP (Bridge) ] ──▶ [ Sprite SOP ] ──▶ [ Geo COMP ] ◀── [ Point Sprite MAT ]
                                               │
                                               ▼
                                          [ Render TOP ]

[ AUDIO DRIVE ]
Audio File In CHOP ──▶ Analyze CHOP (RMS) ──▶ Math CHOP ──▶ bound to Source POP Emit Rate
```

> [!tip]- 📚 Learning Path · Stage 2 - Your First Visuals · step 13 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-1/Chromatic Aberration Feedback|(y-) ← Prev: Chromatic Aberration Feedback]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/02_The_Operators/TOPs/TOP - Texture Operators|(y-) Next: TOPs →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
