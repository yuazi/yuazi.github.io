---
title: "Audio Reactive Geometry"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - instancing
  - recipes
date: 2026-03-02
---

This recipe builds a classic 3D equalizer. You split a sound into frequency bands and use each band to drive the height of a box.

> [!important] Key Concept: Instancing
> **Instancing** is a way to render hundreds or thousands of copies of a single shape (like a box) very efficiently. Instead of creating 100 separate nodes, we create _one_ box and tell TouchDesigner: "Put a copy of this box at every point in this list of numbers."

---

## 1. The Audio Analysis

1.  **Audio In:** Create an **Audio File In CHOP**. It comes with a default song.
2.  **Break it down:** Connect it to an **Audio Spectrum CHOP**.
    - _What it does:_ It runs an FFT (Fast Fourier Transform), which turns the sound wave into a graph with the bass on the left and the treble on the right.
3.  **Smooth it out:** Connect the spectrum to a **Resample CHOP**. Set the "Method" to `New Rate, New Interval` and "End" to `40`.
    - _Why?_ This reduces the hundreds of frequency bars down to just 40, which is easier to see.
4.  **Finalize:** Connect to a **Null CHOP** and name it `OUT_AUDIO`.

---

## 2. The 3D Scene

1.  **The Shape:** Create a **Box SOP**.
2.  **The Container:** Connect the Box SOP to a **Geometry COMP**.
3.  **The View:** Add a **Camera COMP**, a **Light COMP**, and a **Render TOP**.
    - Now you should see a single box in your `render1` viewer.

---

## 3. Instancing

Now the Geometry COMP needs to copy that box.

1.  Select the **Geometry COMP**. Go to the **Instance** tab in the parameters.
2.  Turn **Instancing** → `On`.
3.  **Define the Data:** Drag your `OUT_AUDIO` Null CHOP into the **Instance CHOP/DAT** field.
    - The box may disappear or look wrong at this point. TD doesn't know _where_ to put the copies yet.

---

## 4. Layout (The Grid)

We want the boxes to sit in a row, but our audio data only has "Height" (Y) values. We need "Position" (X) values.

1.  **Generate X positions:** Add a **Pattern CHOP**. It is a generator, so it needs no input.
    - Set **Type** to `Ramp`.
    - Set **Number of Samples** to `40` (to match our audio).
    - Set **Amplitude** to `20` and **Offset** to `-10`. This spreads the values from -10 to +10.
    - Set **Channel Names** to `ramp1` so it doesn't clash with the audio's `chan1`.
2.  **Merge them:** Insert a **Merge CHOP** between the Resample CHOP and the `OUT_AUDIO` Null, and wire the Pattern CHOP into its second input. `OUT_AUDIO` now carries both the audio channel (`chan1`) and the ramp (`ramp1`).
3.  **Map the Channels:**
    - On the Geometry COMP **Instance** page, find **Translate X**. Select `ramp1` from the dropdown.
    - Find **Scale Y** (to make them grow tall). Select `chan1` from the dropdown.

> [!tip] Visualizing the Result
> Look at your **Render TOP**. You should now see a row of 40 bars jumping up and down with the music!

---

## Troubleshooting

- **"The bars are too small/too big"** Use a **Math CHOP** before the Null to multiply the audio values.
- **"The bars are jittery"** Add a **Lag CHOP** or **Filter CHOP** before the Null to smooth the movement.
- **"I only see one bar"** Check that your **Pattern CHOP** has the same "Number of Samples" as your audio spectrum.

---

## Next Steps

- **Add Color:** Use the audio data to drive the `Instance Color` parameters.
- **Change the Shape:** Replace the **Box SOP** with a **Sphere SOP** or **Tube SOP**.
- **3D Grid:** Use a **Noise TOP** to generate a 2D grid of boxes instead of a 1D row.

---

## Parameter Tuning & Behavior

| Parameter              | Behavior                                                                             |
| :--------------------- | :----------------------------------------------------------------------------------- |
| **Resample (Samples)** | Higher = more 3D bars (finer frequency detail); Lower = fewer, thicker bars.         |
| **Pattern Amplitude**  | Higher = bars spread further apart across the screen; Lower = bars cluster together. |
| **Math (Multiply)**    | Higher = bars grow taller/more reactive to sound; Lower = subtler, shorter movement. |
| **Lag/Filter**         | Higher = smoother, "liquid" motion; Lower = raw, "jittery" real-time data response.  |

## Network Architecture

```text
[ AUDIO PROCESSING ]                 [ 3D SCENE ]
Audio File In CHOP                   Box SOP
       │                                │
       ▼                                ▼
Audio Spectrum CHOP (FFT)            Geometry COMP (Instancing On)
       │                                ▲  chan1 → Scale Y
       ▼                                │  ramp1 → Translate X
Resample CHOP (40 pts) ──┐              │
                         ▼              │
Pattern CHOP (ramp1) ──▶ Merge CHOP ──▶ Null (OUT_AUDIO)
```

> [!tip]- 📚 Learning Path · Stage 2: Your First Visuals · step 10 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-1/Basic VJ Mixer|(y-) ← Prev: Basic VJ Mixer]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-1/Waveform Oscilloscope|(y-) Next: Waveform Oscilloscope →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
