---
title: "Object Tracking Particle Trails"
tags:
  - touchdesigner
  - td/recipes
  - mediapipe
  - objecttracking
  - particles
  - webcam
  - recipes
date: 2026-05-26
---

MediaPipe detects everyday objects (cups, phones, bottles, people) and reports their bounding boxes each frame. This recipe extracts the centroid of each detected object and leaves a glowing comet trail behind it as it moves.

> [!info] Operator Families in this Recipe
>
> - **COMPs:** MediaPipe plugin for object detection.
> - **DATs / Script CHOP:** Extracting centroid coordinates from detection results.
> - **TOPs:** Particle trails as a texture feedback loop.

---

## Before You Start

You need the free MediaPipe plugin (`mediapipe.tox`) from [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner).

A small Python Script CHOP computes the centroid.

---

## Part 1: MediaPipe Object Detection

1. Add a **Video Device In TOP** (webcam) → **Null TOP** named `CAM`.
2. Drag `mediapipe.tox` into the network.
3. Connect `CAM` to the first input of `mediapipe1`.
4. Set **Model** → `ObjectDetection` and enable detection.

Click the **Detections** table output. With an object in frame, rows appear with columns: `label`, `confidence`, `x_min`, `y_min`, `x_max`, `y_max`. Row 0 (below header) is the highest-confidence detection.

---

## Part 2: Extract Object Centroid

1. Add a **Script CHOP**. Set its **DAT** to a new **Text DAT** and paste:

```python
def onCook(scriptOp):
    scriptOp.clear()
    scriptOp.numSamples = 1
    cx, cy, detected = 0.5, 0.5, 0.0  # fallback: centre of frame, nothing found

    det = op('mediapipe1').op('Detections')
    if det is not None and det.numRows > 1:
        try:
            x0, x1, y0, y1 = [float(det[1, c]) for c in ('x_min', 'x_max', 'y_min', 'y_max')]
            cx, cy, detected = (x0 + x1) / 2, (y0 + y1) / 2, 1.0
        except (TypeError, ValueError):  # missing column or non-numeric cell
            pass

    for name, val in (('cx', cx), ('cy', cy), ('detected', detected)):
        scriptOp.appendChan(name)[0] = val
```

The callback must be named `onCook`, because a Script CHOP doesn't call a function under any other name. The `td` module is auto-imported, so the script needs no imports.

2. Connect to a **Null CHOP** named `OBJ_POS`.

> [!info] Finding the Detections path
> `op('mediapipe1').op('Detections')` navigates inside the MediaPipe COMP. If your plugin version names this DAT differently, click inside `mediapipe1` and find the output DAT name, then update the path.

---

## Part 3: Build the Trail Canvas

1. Add a **Circle TOP** at your webcam resolution (`1280 x 720`).
   - **Radius** → `0.03`, **Fill Color** `1, 1, 1`, **Background** `0, 0, 0`.
   - Right-click **Center X** → Expression → `op('OBJ_POS')['cx'] - 0.5`.
   - Right-click **Center Y** → Expression → `-(op('OBJ_POS')['cy'] - 0.5)`.
   - Right-click **Radius** → Expression → `op('OBJ_POS')['detected'] * 0.03`. The circle vanishes when nothing is detected.

2. Build the feedback trail:
   - **Feedback TOP** (Target set at the end).
   - **Add TOP**: Input 0 = Feedback, Input 1 = Circle TOP.
   - **Blur TOP** (Filter Size: `3`).
   - **Level TOP** (Brightness 1: `0.93`).
   - **Null TOP** named `TRAIL_OUT`.
   - Set **Feedback TOP Target** → `TRAIL_OUT`.

---

## Part 4: Colorize the Trails

1. **HSV Adjust TOP** on `TRAIL_OUT` → **Saturation Multiplier** `1.5`, **Hue Offset** `absTime.seconds * 20`.
2. **Bloom TOP** (Threshold: `0.3`, Intensity: `0.9`).
3. **Null TOP** named `TRAILS_COLOR`.

---

## Part 5: Composite Over Webcam

Add the trails directly onto the webcam with an **Add TOP**: Input 0 = `TRAILS_COLOR`, Input 1 = `CAM`. The trail layer is already black outside the glowing marks, so no mask is needed.

> [!tip] Over vs. Add
> `Add TOP` works cleanly here because `TRAILS_COLOR` is black outside the trails. Switch to an `Over TOP` if you want proper alpha blending and the trail to be semi-transparent.

---

## Part 6: Detection Label Overlay

1. Add a **Script DAT**:

```python
def onCook(scriptOp):
    scriptOp.clear()
    det = op('mediapipe1').op('Detections')
    found = det is not None and det.numRows > 1
    scriptOp.appendRow([str(det[1, 'label']) if found else 'No detection'])
```

2. Connect to a **Text TOP** (Font Size `24`, Color white) positioned at the bottom of frame.
3. **Over TOP** to layer the label onto the composite.
4. **Null TOP** named `OUT`.

---

## Troubleshooting

- **"Detections table is always empty."** Hold a clear object (phone, bottle, cup) in good light. The COCO model covers 80 classes. Confirm ObjectDetection is selected and enabled in `mediapipe1`.
- **"Trails sit in center at (0.5, 0.5)."** That's the fallback when nothing is detected. Get an object in front of the camera.
- **"NoneType error in Script CHOP."** The path `op('mediapipe1').op('Detections')` doesn't match your plugin version. Click inside `mediapipe1` to find the correct DAT name.
- **"Trails too faint."** Raise Level TOP Brightness 1 to `0.98` or reduce Blur filter size to `1`.

---

## Next Steps

- **Multi-object tracking:** Loop through all rows in the Detections table and paint a differently-colored circle per object using a `Script TOP`.
- **Bounding box outline:** Extract all four corners and drive a `Rectangle TOP` for a live bounding box overlay.
- **Object-specific effects:** Check `det[1, 'label']` in the Script CHOP and branch into different visuals per class, e.g. a phone triggers a burst and a cup triggers a ripple.

---

## Parameter Tuning & Behavior

| Parameter                    | Behavior                                                          |
| :--------------------------- | :---------------------------------------------------------------- |
| **Circle Radius**            | Larger = fat trail head; Smaller = pinpoint comet tip.            |
| **Level Brightness (decay)** | Closer to 1.0 = long persistent trail; Lower (0.88) = rapid fade. |
| **Blur Filter Size**         | Higher = soft cloud trail; Lower = crisp streak.                  |
| **Hue Offset Speed**         | Higher = fast color cycle; Lower = slow ambient shift.            |

## Network Architecture

```text
Video Device In ──▶ CAM ──▶ mediapipe1 (ObjectDetection)
                                 │
                         Detections DAT
                                 │
                          Script CHOP → OBJ_POS (cx, cy, detected)
                                 │
                           Circle TOP (positioned at centroid)
                                 │
                                 ▼
                     Add TOP ◀── Feedback TOP (target: TRAIL_OUT)
                                 │
                             Blur TOP ──▶ Level TOP ──▶ TRAIL_OUT
                                 │
                    HSV Adjust ──▶ Bloom ──▶ TRAILS_COLOR
                                 │
                         Add TOP (+ CAM) ──▶ Text label ──▶ OUT
```

---

Sources:

- [Object Tracking in TouchDesigner with MediaPipe - Derivative](https://derivative.ca/community-post/tutorial/object-tracking-touchdesigner-mediapipe-audio-ableton/72299)
- [MediaPipe TouchDesigner Plugin - GitHub](https://github.com/torinmb/mediapipe-touchdesigner)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
