---
title: "Chromatic Aberration Feedback"
tags:
  - touchdesigner
  - td/recipes
  - feedback
  - top
  - okamirufu
date: 2026-03-18
---

> **Inspired by:** [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV)

A post-processing trick [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV) uses to make generative visuals look rendered. Each color channel comes from a different frame, so anything that moves splits into red, green and blue.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Time-based caching and feedback loops.

---

## Part 1: Movement-Based RGB Split

A lens-style aberration offsets the channels in space. This one offsets them in time, so still areas stay clean and fast-moving objects leave colored ghosts.

1.  **Three Cache TOPs:** Connect your final **Render TOP** to three **Cache TOP** nodes in parallel (connect the same output to all three).
    - Cache 1: **Index** → `0`, **Cache Size** → `2` (current frame).
    - Cache 2: **Index** → `-5`, **Cache Size** → `10` (5 frames back).
    - Cache 3: **Index** → `-10`, **Cache Size** → `15` (10 frames back).
    - _Note:_ Each Cache TOP must have a Size larger than the absolute value of its Index, or the indexed frame won't exist yet.

> [!tip] Lighter version
> The three caches above hold 27 frames between them, and Cache 3 alone covers what the other two store. You can use one **Cache TOP** (**Cache Size** → `11`) and read it with three **Cache Select TOPs** set to **Cache Index** `0`, `-5` and `-10`. The look is identical and it uses less GPU memory. 2. **Reorder TOP:** Connect all three Cache TOPs to a **Reorder TOP**.

    - **Output Red** → `Input 1` (current frame, Red).
    - **Output Green** → `Input 2` (5 frames ago, Green).
    - **Output Blue** → `Input 3` (10 frames ago, Blue).

3.  **The Result:** The RGB split now only appears where something moves.

---

## Part 2: Growth Feedback Loop

This loop makes the image bloom outward over time.

1.  **Feedback TOP:** Connect your Reorder TOP to a **Feedback TOP**.
2.  **Transform TOP:** Add a **Transform TOP** after the feedback.
    - **Scale** → `1.005`.
    - **Rotate** → `0.1`.
3.  **Level TOP:** Add a **Level TOP** after the transform.
    - **Opacity** → `0.98`.
4.  **Blur TOP:** Add a **Blur TOP** after the level.
    - **Filter Size** → `2` (Small).
5.  **Composite TOP:** Connect your Reorder TOP and the Blur TOP to a **Composite TOP**.
    - **Operation** → `Screen` or `Add`.
6.  **Close the Loop:** Drag the Composite TOP back onto the **Feedback TOP**.

---

## Part 3: Final Polishing

1.  **Luma Blur TOP:** Connect your composite to a **Luma Blur TOP** for a final soft glow.
2.  **HSV Adjust TOP:** Use this to boost **Saturation Multiplier** and slightly shift the **Hue** for a more psychedelic feel.

---

## Troubleshooting

- **"It's getting too bright!"** Lower the **Opacity** or **Brightness 1** on the Level TOP inside the loop.
- **"The trails aren't moving."** Make sure the **Transform TOP** has a non-zero **Scale** or **Rotate**.

---

## Parameter Tuning & Behavior

| Parameter              | Behavior                                                                                        |
| :--------------------- | :---------------------------------------------------------------------------------------------- |
| **Cache Index offset** | More negative values (e.g. -10 vs -2) = more pronounced time-based color separation (ghosting). |
| **Feedback Scale**     | Higher = trails expand faster; Lower = tighter, more concentrated trails.                       |
| **Feedback Rotation**  | Higher = more spiral-like motion in trails; Zero = straight expansion.                          |
| **Level Opacity**      | Higher = trails persist longer (more "ghosting"); Lower = trails fade out quickly.              |
| **Blur Filter Size**   | Higher = softer, glowier feedback; Lower = sharper, more defined trail edges.                   |

## Network Architecture

```text
[ INPUT ]
Render TOP
    │
    ├─▶ Cache TOP (Index   0, Size  2) ──┐
    ├─▶ Cache TOP (Index  -5, Size 10) ──┼─▶ Reorder TOP (R, G, B split)
    └─▶ Cache TOP (Index -10, Size 15) ──┘          │
                                                    ▼
[ FEEDBACK LOOP ]                              Feedback TOP ◀── Target: Composite TOP
                                                    │                    ▲
                                                    ▼                    │
                         Transform TOP ──▶ Level TOP ──▶ Blur TOP ──▶ Composite TOP (+ Reorder TOP)
                                                                         │
[ POLISH ]                                                               ▼
                                                    Luma Blur TOP ──▶ HSV Adjust TOP
```

> [!tip]- 📚 Learning Path · Stage 2 - Your First Visuals · step 12 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-1/Waveform Oscilloscope|(y-) ← Prev: Waveform Oscilloscope]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-1/Particle System with POPs|(y-) Next: Particle System with POPs →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
