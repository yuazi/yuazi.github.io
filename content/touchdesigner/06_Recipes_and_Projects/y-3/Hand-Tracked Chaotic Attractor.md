---
title: "Hand-Tracked Chaotic Attractor"
tags:
  - touchdesigner
  - td/tutorials
  - td/tracking
  - td/interaction
  - td/mediapipe
  - td/generative
  - td/sop
  - td/chop
  - td/chaos
date: 2026-03-08
---

**Related:** [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] · [[Hand Tracking|(y-) Hand Tracking]] · [[Sierpinski Tetrahedron with Hand Tracking|(y-) Sierpinski with Hand Tracking]]

> Tested on an M1 Pro with TD 2023+. The performance numbers in Part 7 come from that machine, so yours will vary.

---

## Overview

This tutorial drives a Lorenz attractor, the butterfly-shaped chaotic system, with your hand. A webcam feeds MediaPipe inside a Script CHOP, and a Script SOP draws the attractor. There is no TouchDesigner plugin to install, only two pip packages.

```text
Webcam → Script CHOP (MediaPipe) → Filter/Lag CHOPs → Math CHOPs
  → Script SOP (Lorenz) → Geo COMP → Render TOP → Post FX → Output
```

See also: [[notes/random/lorenz-attractor|(y-) The Lorenz Attractor]] for the maths behind the system.

---

## Part 1 - Node layout

Create these inside `/project1`:

### Tracking

| Node          | Type        | Notes                         |
| ------------- | ----------- | ----------------------------- |
| `script_hand` | Script CHOP | MediaPipe code lives here     |
| `filter_hand` | Filter CHOP | Smooth jitter, width ~5       |
| `lag_hand`    | Lag CHOP    | Lag In: 0.08, Lag Out: 0.15   |
| `null_ctrl`   | Null CHOP   | Tap point for downstream refs |

### Geometry

| Node            | Type        | Notes                  |
| --------------- | ----------- | ---------------------- |
| `script_lorenz` | Script SOP  | Lorenz code lives here |
| `geo_attractor` | Geo COMP    | Object Merge → lorenz  |
| `cam1`          | Camera COMP | Translate Z = 8        |
| `light1`        | Light COMP  | Default is fine        |
| `render1`       | Render TOP  | 1920×1080              |

### Post FX

```text
render1 → level1 → bloom1 ──────────────┐
                     │                  ↓
                     └→ feedback1 → fade1 → composite1 → null_out
                            ↑ Target TOP: composite1
```

In `composite1`: Operation → **Over**, with `bloom1` in input 0 and `fade1` in input 1. Wire `bloom1` into `feedback1` and set the Feedback TOP's **Target TOP** to `composite1`. A Feedback TOP doesn't fade anything by itself, so `fade1` is a **Level TOP** with Opacity **0.92–0.96** for trails.

### Output

| Node      | Type        | Notes                 |
| --------- | ----------- | --------------------- |
| `window1` | Window COMP | Operator → `null_out` |

---

## Part 2 - MediaPipe Script CHOP

Install outside TD first:

```bash
pip install mediapipe opencv-python
```

Create `script_hand` (Script CHOP) and paste this into its DAT:

```python
# script_hand callbacks DAT
# Dependencies: mediapipe, opencv-python (installed outside TD)

import cv2
import mediapipe as mp
import math
import time

PALM = (0, 5, 9, 13, 17)  # wrist + 4 MCP joints

def _state(owner):
    """Webcam, model and last values, kept in the op's storage between cooks."""
    st = owner.fetch('state', None, search=False)
    if st is None:
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        st = {
            'cap': cap,
            'hands': mp.solutions.hands.Hands(
                static_image_mode=False,
                max_num_hands=1,
                model_complexity=0,
                min_detection_confidence=0.6,
                min_tracking_confidence=0.6,
            ),
            'last_t': time.time(),
            'last_x': 0.5,
            'last_y': 0.5,
        }
        owner.store('state', st)
    return st

def onSetupParameters(scriptOp):
    pass  # no custom params needed on this CHOP

def onCook(scriptOp):
    st = _state(scriptOp)
    # Fallback for no frame or no hand: hold the last position, zero the rest
    vals = {'hand_present': 0.0, 'x': st['last_x'], 'y': st['last_y'], 'pinch': 0.0, 'vel': 0.0}

    ok, frame = st['cap'].read()
    if ok:
        results = st['hands'].process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        now = time.time()
        dt = max(1e-4, now - st['last_t'])
        st['last_t'] = now

        if results.multi_hand_landmarks:
            lm = results.multi_hand_landmarks[0].landmark
            cx = sum(lm[i].x for i in PALM) / len(PALM)
            cy = 1.0 - sum(lm[i].y for i in PALM) / len(PALM)  # flip Y

            # Pinch: thumb tip (4) to index tip (8); ~0.25 = open, ~0.05 = closed
            pinch_dist = math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y)
            speed = math.hypot(cx - st['last_x'], cy - st['last_y']) / dt

            vals = {
                'hand_present': 1.0,
                'x': cx,
                'y': cy,
                'pinch': max(0.0, min(1.0, (0.25 - pinch_dist) / 0.20)),
                'vel': min(1.0, speed * 0.015),
            }
            st['last_x'], st['last_y'] = cx, cy

    scriptOp.clear()
    scriptOp.numSamples = 1
    for name, val in vals.items():
        scriptOp.appendChan(name)[0] = val
```

> `store()` and `fetch()` keep the state in the op's storage. It survives the callbacks DAT being re-parsed after an edit, where module globals would reset and open a second webcam handle. `search=False` stops `fetch()` from picking up a `state` key stored on a parent COMP.

```text
script_hand → filter_hand → lag_hand → null_ctrl
```

---

## Part 3 - Control mapping

> One Math CHOP can't remap different channels to different ranges, so you need one per channel.

### Option A: Separate Math CHOPs

**`math_sigma`**: channel `x`, From 0→1, To 8→20, rename output to `sigma`

**`math_rho`**: channel `y`, From 0→1, To 20→45, rename output to `rho`

**`math_beta`**: channel `pinch`, From 0→1, To 1.8→3.5, rename output to `beta`

Merge them: `math_sigma + math_rho + math_beta → merge_params`

### Option B: Expressions directly in Script SOP parameters

Skip the Math CHOPs. Type into the parameter fields of `script_lorenz`:

- **Sigma**: `tdu.remap(op('null_ctrl')['x'][0], 0, 1, 8, 20)`
- **Rho**: `tdu.remap(op('null_ctrl')['y'][0], 0, 1, 20, 45)`
- **Beta**: `tdu.remap(op('null_ctrl')['pinch'][0], 0, 1, 1.8, 3.5)`

Start with Option B, since it's less to set up.

---

## Part 4 - Lorenz Script SOP

Create a **Script SOP** named `script_lorenz`.

### Custom parameters (Gear icon → Custom Parameters)

| Name     | Type  | Default |
| -------- | ----- | ------- |
| `Sigma`  | Float | 10.0    |
| `Rho`    | Float | 28.0    |
| `Beta`   | Float | 2.667   |
| `Points` | Int   | 6000    |
| `Dt`     | Float | 0.005   |
| `Scale`  | Float | 0.08    |

### DAT code

```python
def onCook(scriptOp):
    scriptOp.clear()

    sigma = float(scriptOp.par.Sigma)
    rho   = float(scriptOp.par.Rho)
    beta  = float(scriptOp.par.Beta)
    dt    = float(scriptOp.par.Dt)
    s     = float(scriptOp.par.Scale)

    x, y, z = 0.1, 0.0, 0.0
    scriptOp.appendPoly(int(scriptOp.par.Points), closed=False, addPoints=True)

    # One Euler step per point; the right side uses the old x, y, z
    for pt in scriptOp.points:
        x, y, z = (x + sigma * (y - x) * dt,
                   y + (x * (rho - z) - y) * dt,
                   z + (x * y - beta * z) * dt)
        pt.x, pt.y, pt.z = x * s, y * s, z * s
```

Inside `geo_attractor`, delete the default torus and add an **Object Merge SOP** pointing at `../script_lorenz`, with its render and display flags on. A Geo COMP draws the flagged SOP inside it and has no SOP path parameter.

---

## Part 5 - Render setup

**Geo COMP (`geo_attractor`):** Render on, Primitive Type → Line (or Point for a dot cloud), Constant MAT with a bright colour.

**Camera (`cam1`):** Translate Z = 8.

**Render TOP (`render1`):** 1920×1080, Camera `../cam1`, background black.

**Post FX:**

```text
render1
  → level1       (Brightness 1: 1.2, Gamma: 0.9)
  → bloom1       (Threshold: 0.3, Size: 0.015)
  → composite1   (input 0 = bloom1, input 1 = fade1, Op = Over)

feedback1 (input: bloom1, Target TOP: composite1)
  → fade1        (Level TOP, Opacity: 0.93)

composite1 → null_out
```

See [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]] for how the feedback chain works.

---

## Part 6 - Output

In `window1`: Operator → `../null_out`, match render resolution. Open Window or Perform Mode (F1).

---

## Part 7 - Performance (M1 Pro)

| Setting              | Value                      |
| -------------------- | -------------------------- |
| Starting point count | 4,000–6,000                |
| Safe target          | 20,000–40,000              |
| MediaPipe resolution | 640×480                    |
| Cook mode            | Realtime                   |
| Turn off             | All viewers during perform |
| TD build             | 2023+ recommended          |

If CPU spikes, reduce Points first, then lower dt a little. Add a Timer CHOP to run the Script CHOP at 30fps if you want to decouple tracking from render framerate. Keep `model_complexity=0` in MediaPipe.

---

## Where to go from here

- **Gesture switching:** detect open hand vs fist to swap between Lorenz, Rössler, and Thomas attractors
- **Colour reaction:** map `vel` to hue shift in a GLSL MAT, see [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Introduction to GLSL]]
- **GPU particles:** replace the Script SOP with a feedback TOP based solver for 500k+ particles, see [[5 Ways To Make Particles]]

---

## Related

- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]]
- [[Hand Tracking|(y-) Hand Tracking]]
- [[Sierpinski Tetrahedron with Hand Tracking|(y-) Sierpinski with Hand Tracking]]
- [[notes/random/lorenz-attractor|(y-) The Lorenz Attractor]]

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                                     |
| :------------------- | :------------------------------------------------------------------------------------------- |
| **Sigma (X-Hand)**   | Controls the "butterfly" wing spread; Higher = more chaotic horizontal oscillation.          |
| **Rho (Y-Hand)**     | Controls the vertical "height" of the loops; Higher = more complex, layered patterns.        |
| **Beta (Pinch)**     | Controls the "tightness" of the attractor core; Higher = more elongated, thinner loops.      |
| **Point Count**      | Higher = longer, more complete trails; Lower = shorter, faster-moving "comet" effect.        |
| **Feedback Opacity** | Higher = persistent, "ghostly" history of the attractor; Lower = focus on the leading point. |

## Network Architecture

```text
[ COMPUTER VISION ]              [ PARAMETER MAPPING ]
Webcam ──────────────────────▶ [ Script CHOP ] (MediaPipe Python)
                                      │
                                      ▼
[ SMOOTHING ]                  [ Filter / Lag CHOPs ]
                                      │
                                      ▼
[ DATA EXPORT ]                [ Null CHOP (null_ctrl) ]
                                      │
      ┌───────────────────────────────┴──────────────────────────────┐
      ▼ (Sigma)                       ▼ (Rho)                        ▼ (Beta)
[ Math CHOP X ]                [ Math CHOP Y ]                [ Math CHOP Pinch ]
      │                               │                              │
      └───────────────────────────────┼──────────────────────────────┘
                                      ▼
[ CHAOS ENGINE ]               [ Script SOP (Lorenz) ]
                                      │ (Loops & Math)
                                      ▼
[ RENDERING ]                  [ Geo COMP ] ──▶ [ Render TOP ]
                                      │
                                      ▼
[ POST FX ]                    [ Feedback TOP Loop ] ──▶ [ Bloom TOP ]
```

> [!tip]- 📚 Learning Path · Stage 8 - Advanced Projects · step 44 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-3/Vector Field Instancing|(y-) ← Prev: Vector Field Instancing]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/08_Trending_2026/index|(y-) Next: Gallery-Grade 2026 →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
