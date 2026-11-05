---
title: "Convolutional Networks"
tags:
  - machine-learning
  - deep-learning
  - computer-vision
date: 2026-11-05
---

A convolutional network applies the same small filter at every position of an image, so it needs far fewer parameters than a dense network and treats a pattern the same wherever it appears. Stacking such layers builds up from edges to textures to object parts. Before vision transformers took over many benchmarks, this was the default architecture for images, and convolutions are still everywhere: in audio models, in U-Nets, in the patch embedding of a ViT. I keep this page as the arithmetic cheat sheet: sizes, parameter counts and receptive fields.

![[pictures/topics/ml/convolutional-networks.png]]

<p class="image-caption">A small window slides over the picture and looks for the same pattern everywhere. Image: Daniel Voigt Godoy, CC BY 4.0, via <a href="https://commons.wikimedia.org/wiki/File:Convolutional_neural_network,_maxpooling.png">Wikimedia Commons</a>.</p>

## Mental Model

- A convolution slides one small set of weights over the input. The weights are shared across positions, which gives translation equivariance and a tiny parameter count.
- Each output channel is one learned filter. Input channels are summed over, so a layer's weight tensor has shape `(C_out, C_in, k, k)`.
- Depth grows the receptive field: each unit sees a larger patch of the input than the layer below.
- Pooling and strides shrink the spatial size while the channel count grows, trading position for features.
- Residual connections and normalization layers are what make networks with dozens of layers trainable.

## 1. Convolution as Weight Sharing

Deep learning libraries compute cross-correlation and call it convolution (the kernel is not flipped). For a single channel, kernel size $k$ and no padding:

$$
y[i, j] = b + \sum_{u=0}^{k-1} \sum_{v=0}^{k-1} w[u, v] \, x[i + u, j + v]
$$

With several channels, the sum also runs over input channels, and each of the $C_{out}$ filters has its own bias. The parameter count of a layer is

$$
C_{out} \cdot (C_{in} \cdot k^2 + 1).
$$

> [!example] Worked example
> A 3x3 convolution from 3 channels to 64 channels has $64 \cdot (3 \cdot 9 + 1) = 1792$ parameters. A dense layer connecting a 224x224x3 image (150,528 values) to a 224x224x64 output (3,211,264 values) would need about $4.8 \times 10^{11}$ weights. Sharing and locality cut that by eight orders of magnitude.

The two assumptions behind this are locality (nearby pixels matter together) and stationarity (the same pattern means the same thing anywhere). They fit natural images well and fit a table of unrelated features badly, which is why a CNN on tabular data usually loses to a plain MLP.

A small numpy version, checked against scipy:

```python
import numpy as np
from scipy.signal import correlate2d

def conv2d(x, w, stride=1, pad=0):
    x = np.pad(x, pad)
    k = w.shape[0]
    n = (x.shape[0] - k) // stride + 1
    out = np.empty((n, n))
    for i in range(n):
        for j in range(n):
            patch = x[i*stride:i*stride+k, j*stride:j*stride+k]
            out[i, j] = (patch * w).sum()
    return out

rng = np.random.default_rng(0)
x, w = rng.normal(size=(8, 8)), rng.normal(size=(3, 3))
print(np.allclose(conv2d(x, w), correlate2d(x, w, mode="valid")))  # True
print(conv2d(x, w, stride=2, pad=1).shape)                         # (4, 4)
```

## 2. Output Size

For input size $n$, kernel $k$, padding $p$, stride $s$ (per spatial dimension):

$$
n_{out} = \left\lfloor \frac{n + 2p - k}{s} \right\rfloor + 1
$$

> [!example] Worked example
> The first layer of ResNet takes a 224x224 image through a 7x7 convolution with stride 2 and padding 3: $\lfloor (224 + 6 - 7) / 2 \rfloor + 1 = 112$. A following 3x3 max pool with stride 2 and padding 1 gives $\lfloor (112 + 2 - 3) / 2 \rfloor + 1 = 56$. Both numbers come from running the formula.

Padding $p = (k-1)/2$ with stride 1 keeps the size ("same" padding for odd $k$). The floor means that with stride 2 an odd leftover row or column is silently dropped, which is a common source of off-by-one shape errors when you try to invert a network in a decoder.

## 3. Receptive Fields

The receptive field of a unit is the patch of the input that can influence it. Walk through the layers, tracking the receptive field $r$ and the jump $j$ (the distance in input pixels between neighbouring units):

$$
r_l = r_{l-1} + (k_l - 1)\, j_{l-1}, \qquad j_l = j_{l-1}\, s_l
$$

starting at $r_0 = 1$, $j_0 = 1$. Take conv3, conv3, maxpool2 (stride 2), conv3. After the first two convolutions $r = 5$, the pool gives $r = 6$ and $j = 2$, and the last convolution gives $r = 6 + 2 \cdot 2 = 10$. Plain stacks of 3x3 stride-1 convolutions grow the receptive field only by 2 per layer, so $L$ layers give $2L + 1$. Strides and pooling make it grow much faster.

This is the argument behind VGG: two 3x3 layers cover the same 5x5 window as one 5x5 layer but use $2 \cdot 9 = 18$ weights per channel pair instead of 25, and they put an extra nonlinearity in between. In practice the effective receptive field is smaller than the theoretical one, because central pixels contribute much more than the edges.

## 4. Pooling and Strides

Max pooling takes the maximum of each window, usually 2x2 with stride 2, which halves height and width and keeps the strongest activation. It adds a small amount of local translation invariance and has no parameters. Average pooling takes the mean instead. Many modern networks replace early max pooling with a strided convolution and finish with global average pooling, which collapses each channel to one number before the classifier. That removes the huge flatten-then-dense layers that older networks carried (most of AlexNet's parameters sit in its dense layers).

## 5. Residual Connections

A residual block outputs $y = x + F(x)$, where $F$ is a few convolutions. During backpropagation the gradient through the block is

$$
\frac{\partial y}{\partial x} = I + \frac{\partial F}{\partial x}.
$$

The identity term gives the gradient a direct path to earlier layers, so it does not have to pass through every nonlinearity. The block also only has to learn a correction to its input, and "do nothing" is easy to represent (set $F$ close to zero). He et al. (2015) observed that plain networks got worse as depth increased even on the training set, which is an optimization failure rather than overfitting, and that residual connections fixed it. When $F$ changes the shape, the shortcut uses a 1x1 convolution to match channels and stride.

> [!tip] Intuition
> Without the skip, a 100-layer network is a product of 100 Jacobians, and products of many matrices tend to blow up or vanish. With skips, the Jacobian of each block is $I + $ something small, so the product stays close to the identity.

## 6. Normalization Layers

Batch normalization (Ioffe and Szegedy, 2015) normalizes each channel over the batch and the spatial positions, then rescales with learned $\gamma$ and $\beta$:

$$
\hat{x} = \frac{x - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \qquad y = \gamma \hat{x} + \beta
$$

At evaluation time it uses running averages of $\mu$ and $\sigma^2$ collected during training, which is why `model.eval()` matters. It works poorly with tiny batches because the batch statistics get noisy. Layer normalization computes statistics per sample across features and does not depend on batch size, so it became the standard in transformers. Group normalization splits the channels into groups and normalizes within each, and is a common choice for small-batch vision work such as detection.

## 7. A Short History

| Year | Network                                 | What it added                                                                                                           |
| ---- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1998 | LeNet-5 (LeCun et al.)                  | Convolution, subsampling and dense layers trained end to end for handwritten digits, about 60 thousand parameters       |
| 2012 | AlexNet (Krizhevsky, Sutskever, Hinton) | Won ImageNet 2012 by a wide margin: 5 conv and 3 dense layers, ReLU, dropout, GPU training, about 60 million parameters |
| 2014 | VGG (Simonyan and Zisserman)            | Uniform stacks of 3x3 convolutions, 16 or 19 weight layers                                                              |
| 2015 | ResNet (He et al.)                      | Skip connections, which allowed networks with 50, 101 and 152 layers on ImageNet                                        |

Later work moved along other axes: depthwise-separable convolutions for efficiency, compound scaling of width, depth and resolution, and eventually attention. See [[notes/lectures/mlp/06-vit|the ViT lecture]] for the transformer take on the same task.

## Related

- [[notes/lectures/mlp/02-cnn|MPL 02: CNNs]] and [[notes/lectures/mlp/03-vision-cnn|MPL 03: Vision with CNNs]], the lecture notes this page condenses
- [[notes/graphics/image-convolution-kernels|Image Convolution Kernels]], the hand-designed filters that learned kernels replace
- [[notes/ml/backpropagation|Backpropagation]], where the gradient through a convolution comes from
- [[notes/ml/attention-and-transformers|Attention and Transformers]], the architecture that replaced convolutions in many vision models
- [[notes/ml/generalization-and-regularization|Generalization and Regularization]], for dropout, weight decay and augmentation
- [[notes/random/neural-style-transfer|Neural Style Transfer]], which reads style from the feature maps of a pretrained CNN
