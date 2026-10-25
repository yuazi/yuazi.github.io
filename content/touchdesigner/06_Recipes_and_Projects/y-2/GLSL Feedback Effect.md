---
title: "GLSL Feedback Effect"
tags:
  - touchdesigner
  - td/recipes
  - feedback
  - glsl
  - recipes
  - shader
date: 2026-03-02
---

A Feedback TOP hands a GLSL TOP its own previous frame, so the shader can transform last frame's image and draw new content on top of it. Loops like this produce trails, recursive diffusion patterns and slowly evolving textures, all on the GPU.

The shader in this recipe zooms, rotates, shifts and fades the previous frame on every pass. Most feedback effects are variations on those four moves.

---

## Part 1: The Feedback Loop

A feedback loop in TouchDesigner is built with a **Feedback TOP**:

```text
[Source TOP]
     ↓
  GLSL TOP  ←──────────────┐
     ↓                     │
 Feedback TOP ─────────────┘
     ↓
  Null TOP (OUT_FEEDBACK)
```

Step by step:

1. Create a **`Noise TOP`** as your seed texture (or any visual source).
2. Create a **`GLSL TOP`**. The effect lives in its shader.
3. Create a **`Feedback TOP`**.
   - Set its **Target TOP** parameter to the path of the **GLSL TOP** (e.g. `glsl1`).
   - This makes the Feedback TOP read from the GLSL TOP's _previous_ frame.
4. Connect: `Noise TOP → input[0] of GLSL TOP`, `Feedback TOP → input[1] of GLSL TOP`.
5. Connect the `GLSL TOP` output to a `Null TOP`.

Now the shader receives both fresh input (slot 0) and last frame's output (slot 1).

---

## Part 2: The GLSL Shader

Open the `GLSL TOP`, go to its DAT and replace the pixel shader with:

```glsl
uniform sampler2D sTD2DInputs[TD_NUM_2D_INPUTS];  // [0] = fresh source, [1] = feedback

// Uniforms (set these on the GLSL TOP's Vectors page)
uniform float uZoom;       // e.g. 1.002
uniform float uRotation;   // e.g. 0.001 (radians per frame)
uniform float uDecay;      // e.g. 0.97 (how fast trails fade)
uniform vec2  uOffset;     // e.g. 0.0, 0.0 (translate each frame)

layout(location = 0) out vec4 fragColor;

void main()
{
    vec2 uv = vUV.st;

    // Rotate and zoom around the centre, shift, then return to 0-1 UV space
    float c = cos(uRotation);
    float s = sin(uRotation);
    vec2 feedbackUV = mat2(c, s, -s, c) * (uv - 0.5) / uZoom + uOffset + 0.5;

    // Last frame's output, faded so trails die out
    vec4 feedback = texture(sTD2DInputs[1], feedbackUV) * uDecay;
    vec4 fresh = texture(sTD2DInputs[0], uv);

    // Keep whichever is brighter: new content or decayed history
    fragColor = TDOutputSwizzle(max(fresh, feedback));
}
```

---

## Part 3: Setting the Uniforms

The GLSL TOP passes values to the shader from its **Vectors** page. Add one entry per uniform, with the **Uniform Name** spelled exactly as in the shader:

- `uZoom`: `1.002` (useful range `0.99–1.05`)
- `uRotation`: `0.001` (range `-0.05–0.05`)
- `uDecay`: `0.97` (range `0.5–1.0`)
- `uOffset`: x `0`, y `0`

Each value field takes an expression or a CHOP reference. For sliders you can tweak during a performance, wrap the GLSL TOP in a Base COMP, give the Base custom parameters, and reference them from the Vectors values (e.g. `parent().par.Zoom`). Custom parameters live on COMPs, not on the GLSL TOP itself.

---

## Part 4: Driving with Audio

```text
Audio Device In CHOP → Audio Spectrum CHOP → Analyze CHOP (RMS)
  → Math CHOP (remap: e.g. 0→1 becomes 1.000→1.008)
  → [CHOP reference in the uZoom value on the Vectors page]
```

Loud hits push the zoom, the classic zoom-on-the-beat VJ effect.

---

## Visual Variations

| Change                                  | Effect                                          |
| --------------------------------------- | ----------------------------------------------- |
| `uZoom > 1`                             | Content zooms in and expands outward            |
| `uZoom < 1`                             | Content shrinks inward like an imploding tunnel |
| `uRotation != 0`                        | Trails spiral                                   |
| `uDecay` close to 1                     | Long, persistent trails                         |
| `uDecay` close to 0.5                   | Short, quickly fading traces                    |
| Add `sin(absTime.seconds)` to `uOffset` | Drifting, oscillating trails                    |

---

## Common Gotchas

- **Trails never fade** → `uDecay` is at or above `1.0`. Drop it to `0.97`.
- **Nothing feeds back** → confirm the Feedback TOP's **Target TOP** path is exactly the GLSL TOP's name.
- **Green/uniform shader errors** → check the GLSL TOP's Info DAT for compile errors. The usual cause is a uniform name that doesn't match the Vectors page.
- **1-frame latency** in the loop is unavoidable. The Feedback TOP always serves the _previous_ frame, which is what makes feedback work.
- For **reaction-diffusion** (Turing patterns), replace the zoom/rotate with a two-channel diffusion equation in the shader. See [[touchdesigner/06_Recipes_and_Projects/y-3/Reaction-Diffusion|Reaction-Diffusion]].

## Related Topics

- [[Feedback Loops]]: pure TOP-based feedback without GLSL
- [[Introduction to GLSL]]: GLSL fundamentals in TouchDesigner

---

## Parameter Tuning & Behavior

| Parameter     | Behavior                                                                                    |
| :------------ | :------------------------------------------------------------------------------------------ |
| **uZoom**     | >1.0 = trails expand outward (tunnel effect); <1.0 = trails shrink toward center.           |
| **uRotation** | Higher = trails spiral rapidly; Zero = trails move in straight lines from the center.       |
| **uDecay**    | Higher (0.99) = trails stay on screen for a long time; Lower (0.8) = trails vanish quickly. |
| **uOffset**   | Adds a directional drift to the feedback (e.g., trails always float upward).                |

## Network Architecture

```text
[ SOURCE ]
Noise TOP (Seed) ──┐
                   │ (Input 0)
                   ▼
[ FEEDBACK LOOP ] ──▶ [ GLSL TOP ] ──▶ [ Null TOP (OUT) ]
       ▲           (Input 1)  │
       │                      │
       └──── [ Feedback TOP ] ◄┘
                   ▲
                   │ (Target: glsl1)
[ CONTROL ]        │
Audio In ──▶ Analyze ──▶ Math ──▶ [ uZoom Parameter ]
```

> [!tip]- 📚 Learning Path · Stage 5: Intermediate Recipes · step 26 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-2/Real-time Audio Visualizer|(y-) ← Prev: Real-time Audio Visualizer]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-2/Instanced 3D Models with PBR|(y-) Next: Instanced 3D Models with PBR →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
