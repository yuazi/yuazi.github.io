---
title: "Basic A/B VJ Mixer"
tags:
  - touchdesigner
  - td/recipes
  - mixing
  - recipes
  - vj
date: 2026-03-02
---

This recipe builds an **A/B crossfader**, the control most live VJ setups are built around: two video sources and a slider that blends between them.

> [!info] New to TouchDesigner?
> This recipe uses three operator families:
>
> - **TOPs (Texture Operators):** These handle images and video.
> - **CHOPs (Channel Operators):** These handle numbers and signals (like sliders and audio).
> - **COMPs (Components):** These are "containers" that hold UIs or 3D scenes.

---

## 1. Prepare Your Sources (TOPs)

1.  **Source A:** Press **Tab**, select the **TOP** tab, and find the **Noise TOP**. This generates a procedural cloudy pattern.
    - _Tip:_ Rename it to `source_a` by clicking the name below the node.
2.  **Source B:** Press **Tab** and find the **Movie File In TOP**. By default, it loads a banana or a nature scene.
    - _Tip:_ Rename it to `source_b`.
3.  **The Mixer:** Add a **Cross TOP**. It blends its two inputs.
4.  **Connect them:**
    - Click the output connector (right side) of `source_a` and drag the wire to the _first_ input of the `Cross TOP`.
    - Click the output of `source_b` and drag it to the _second_ input of the `Cross TOP`.

---

## 2. Create the Controller (COMPs & CHOPs)

The Cross TOP's blend amount will come from a slider.

1.  **Add a Slider:** Press **Tab**, go to the **COMP** tab, and select **Slider**.
2.  **Understand what it outputs:** The Slider COMP automatically produces a CHOP channel called `v1` with a value from 0 to 1 as you drag the handle.
3.  **Activate the viewer:** Click the small **plus (+) icon** in the bottom-right corner of the Slider COMP node. This makes the node active, so you can drag the slider handle right there in the network.

---

## 3. Bind the Slider to the Cross

The slider's number (a CHOP channel) now has to drive the Cross TOP's blend value (a parameter).

1.  Select your **Cross TOP**. Look at the **Parameters** window in the top-right of your screen.
2.  Find the **Cross** slider (it probably says `0.5`).
3.  **The Drag-and-Drop:**
    - Make sure your Slider COMP is "Active" (the + icon is clicked).
    - Click and drag the "v1" channel (the line) from the slider directly onto the word **Cross** in the Cross TOP's parameters.
    - A menu will pop up. Select **CHOP Bind**.
4.  **Test it:** Drag your slider left and right. The image should crossfade between the noise and the movie.

---

## 4. Final Output

1.  Connect the output of your **Cross TOP** to a **Null TOP**.
2.  Rename the Null to `OUT`.
3.  Click the **Display Flag** (the circle icon in the bottom-right) of the `OUT` node. Your visual will now appear in the background of your workspace.

---

## Adding Effects

You can insert effects between the `Cross TOP` and your `OUT` node:

- **Level TOP:** Adjust brightness, contrast, and gamma.
- **Edge TOP:** Turn your visuals into glowing outlines.
- **Blur TOP:** Soften the image for a dreamy look.

> [!tip] Inserting Between Nodes
> To quickly insert a node between two others, right-click on the wire connecting them and select **Insert Operator**.

---

## Troubleshooting

- **"I don't see the parameters!"** Press **P** to toggle the parameter window on/off.
- **"The slider isn't moving."** Make sure the "Viewer Active" flag (the little plus icon in the bottom right of the node) is turned ON.
- **"The blend is jumpy."** Add a **Lag CHOP** between the slider and the Cross TOP to smooth out your hand movements.

---

## Next Steps

- **Add smoothing:** Insert a **Lag CHOP** between the Slider COMP and the Cross TOP to soften abrupt crossfades. Try a Lag value of `0.1`.
- **Try a third source:** Add a **Switch TOP** before the Cross TOP to cycle through more than two video sources.
- **Make it audio-reactive:** Replace the Slider COMP with an **Audio Device In CHOP** and an **Analyze CHOP** so the crossfade follows live sound. See [[Audio Reactive Geometry]].

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                         |
| :------------------- | :------------------------------------------------------------------------------- |
| **Cross (Mixer)**    | 0 = Source A only; 1 = Source B only; 0.5 = Equal blend of both sources.         |
| **Level Brightness** | Higher = brighter image; Lower = darker, moodier visuals.                        |
| **Edge Strength**    | Higher = thicker, more visible outlines; Lower = subtler, thinner lines.         |
| **Blur Size**        | Higher = dreamier, softer focus; Lower = sharp, clear details.                   |
| **Lag (Smoothing)**  | Higher = slower, more "weighted" transition; Lower = instant, "snappy" response. |

## Network Architecture

```text
[ VIDEO SOURCES ]                  [ CONTROL ]
Noise TOP (source_a) ─────────┐    Slider COMP
Movie File In TOP (source_b) ─┤        │
                              ▼        ▼
                         Cross TOP ◀── CHOP Bind
                              │
                              ▼
                         Null TOP (OUT) ──▶ Display Flag
```

> [!tip]- 📚 Learning Path · Stage 2 - Your First Visuals · step 9 of 44
> [[touchdesigner/01_Core_Concepts/Common Shortcuts|(y-) ← Prev: Common Shortcuts]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-1/Audio Reactive Geometry|(y-) Next: Audio Reactive Geometry →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
