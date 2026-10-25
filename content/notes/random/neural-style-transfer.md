---
title: "Real-time Neural Style Transfer"
tags:
  - touchdesigner
  - td/recipes
  - deep-learning
  - mlp
  - onnx
date: 2026-03-12
---

> **Inspired by:** [Gatys et al. (A Neural Algorithm of Artistic Style)](https://arxiv.org/abs/1508.06576)

I’ve been looking for a way to actually "see" the concepts from my [[/notes/lectures/mlp/02-cnn|CNN theory]] notes in a live environment. Neural Style Transfer (NST) turned out to be the answer: a pre-trained network repaints your camera feed in the style of one specific artwork. The original method optimizes every image from scratch, which is far too slow for live video, so I use **feed-forward style transfer**, where one pass through a trained network does the job, to keep things running at a steady 60fps.

> [!info] Operator Families in this Recipe
>
> - **Script TOP (Texture Operators):** Used as the Python bridge to run OpenCV’s DNN module.

---

## Part 1: Setup & Models

1.  **Video Device In TOP:** Pulls the feed from your MacBook's webcam.
2.  **Script TOP:** Create a **Script TOP** and connect your camera to its input. Its Python callbacks run the network.
3.  **Model Selection:** You'll need a pre-trained `.onnx` file. You can grab these from the [ONNX Model Zoo](https://github.com/onnx/models) under the **Vision > Image Manipulation** section (look for "Fast Neural Style Transfer").

> [!tip] Hugging Face
> Many models from the ONNX Zoo have moved to [Hugging Face](https://huggingface.co/onnxmodelzoo). If the GitHub link is down, check there for the latest `.onnx` versions.

### Recommended Models

Each model has its own look. These work best in real time:

- **`mosaic`**: strong, geometric textures. Good for high-contrast scenes.
- **`udnie`**: sharp lines and muted colors, the most painterly of the five.
- **`rain-princess`**: bright blues and yellows with loose brushwork.
- **`candy`**: saturated colors and smooth shapes. Good under colorful lighting.
- **`pointilism`**: soft, dotted textures for a subtle, dreamy look.

4.  **Custom Page:** Open the script callbacks and add a file parameter in the `onSetupParameters` function.
    ```python
    def onSetupParameters(scriptOp):
        page = scriptOp.appendCustomPage('Style')
        page.appendFile('Modelpath', label='ONNX Model Path')
    ```
5.  **Assign Model:** Point the new **Model Path** parameter to your downloaded `.onnx` file.

---

## Part 1.5: How Model Paths Work

**Model Path** is the full path to the `.onnx` file on disk, something like `/Users/yourname/Downloads/mosaic.onnx`. Instead of typing it, click the **folder icon** next to the parameter, or drag the file from Finder onto the parameter field.

The script reads it with `scriptOp.par.Modelpath.eval()` and passes it to OpenCV. If the path is wrong, the network won't load and you'll get a black screen.

> [!tip] Troubleshooting Paths
> If it's not working, open the **Textport** (`Alt+T`). An error like `cv2.error: ... can't open file` means the path points to a file that doesn't exist, or to a folder TouchDesigner can't access.

---

## Part 2: The Inference Loop

The `onCook` callback handles the data flow: taking pixels from the input, running them through the neural net, and copying them back to the TOP.

1.  **Initialize the Net:** Cache the loaded model so it isn't reloaded every frame, and load it again only when **Model Path** changes.
2.  **Prepare the Image:** Scale the incoming TOP data (RGBA floats in 0-1) to 0-255 RGB.
3.  **Run Inference:** Use `cv2.dnn.blobFromImage` to format the data and `net.forward()` to get the result.

```python
import functools

import cv2
import numpy as np


@functools.lru_cache(maxsize=1)  # reload only when Model Path changes
def load(path):
    return cv2.dnn.readNetFromONNX(path)


def onCook(scriptOp):
    path = scriptOp.par.Modelpath.eval()
    if not path or not scriptOp.inputs:
        return
    net = load(path)

    # 1. Grab pixels: TD gives RGBA floats in 0-1
    img = scriptOp.inputs[0].numpyArray(delayed=True)
    if img is None:  # delayed download: nothing is ready on the first cook
        return
    rgb = img[:, :, :3] * 255

    # 2. Predict. The ONNX Model Zoo style models take raw 0-255 RGB, with no mean subtraction
    net.setInput(cv2.dnn.blobFromImage(rgb, 1.0, (640, 480), swapRB=False))
    out = net.forward()[0].transpose(1, 2, 0)  # (1, 3, H, W) -> (H, W, 3)

    # 3. Back to 0-1 RGBA for TD, with opaque alpha
    out = np.clip(out, 0, 255) / 255
    scriptOp.copyNumpyArray(np.dstack([out, np.ones(out.shape[:2])]).astype(np.float32))
```

---

## Part 3: Mac Optimization

Running a neural network inside TouchDesigner's Python can stall the whole UI. Two things keep it smooth on my M1 Pro:

1.  **Delayed Arrays:** Setting `delayed=True` in the `numpyArray` call prevents the CPU from waiting for the GPU to finish, which stops the UI from stuttering. The price is one frame of latency, and the very first call returns `None`, which the script skips.
2.  **Resolution Scaling:** I usually run the inference at `640x480` or even `320x240`. Style transfer is forgiving: scale it back up with a **Resolution TOP** and the painterly textures hide most of the low-res artifacts.

---

## Troubleshooting

- **"The UI is lagging!"** Lower the resolution in `blobFromImage`. Python is single-threaded, so heavy inference will eat your frame time.
- **"It's just a black screen."** Ensure your input image isn't empty and that the `Modelpath` parameter is pointing to a valid ONNX file.
- **"The colors look weird."** Toggle `swapRB` in the `blobFromImage` function; some models expect BGR instead of RGB.

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                             |
| :------------------- | :----------------------------------------------------------------------------------- |
| **Model Resolution** | Higher = more detail but slower FPS; Lower = faster but "blockier" textures.         |
| **Delayed Array**    | `True` keeps the UI responsive; `False` can cause micro-stutters during heavy loads. |
| **Backend Target**   | OpenCV's default CPU target, which the script leaves as is, runs well on an M1 Pro.  |

---

## Network Architecture

```text
[ VIDEO INPUT ] ──▶ [ Script TOP ] ──▶ [ Resolution TOP ] ──▶ [ OUT ]
                        │
                        ▼
                [ onCook Callback ]
                        │
                ( Numpy Array Conversion )
                        │
                ( OpenCV DNN Inference )
                        │
                ( Normalize & Copy Back )
```

### Data Flow Explanation

1.  **Input:** A live camera feed or pre-recorded video enters the `Script TOP`.
2.  **Conversion:** We pull the texture data into Python as a Numpy array.
3.  **Inference:** OpenCV runs one forward pass of a network whose weights were trained on a single artwork's style.
4.  **Upscaling:** Since we run the heavy math at low res, the `Resolution TOP` brings it back to full screen for display.

---

## See Also

- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TouchDesigner]]: more on using external libraries like OpenCV.
- [[/notes/lectures/mlp/01-introduction|(y-) Introduction to Machine Learning]]: background on how networks learn features.
- [[work/index|(y) The Workshop]]: other creative coding experiments and finished projects.

---

[[notes/index|(y) Return to Notes]] | [[notes/random/index|(y) Return to Random Hub]] | [[/index|(y) Return to Home]]
