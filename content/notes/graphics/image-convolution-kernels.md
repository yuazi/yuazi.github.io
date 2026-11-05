---
title: "Image Convolution Kernels"
tags:
  - graphics
  - image-processing
  - convolution
date: 2026-11-05
---

A convolution kernel is a small grid of weights. To filter an image you slide the grid over every pixel, multiply the weights by the pixels underneath, and add the products to get the output pixel. Blur, sharpen, and edge detection are all that operation with different weights. It is also exactly what a convolutional layer in a neural network does, with weights that are learned instead of designed.

## Mental Model

- Output pixel = weighted sum of a neighbourhood. The kernel is the recipe for the weights.
- Weights that sum to 1 preserve brightness (blurs). Weights that sum to 0 respond only to change (edge detectors).
- Some 2D kernels are an outer product of two 1D kernels. Those can be applied as two cheap passes instead of one expensive one.
- Pixels near the image border have missing neighbours, and the way you fill them in is a real design choice.
- Filter in linear light if the result will be viewed (see [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]).

## 1. The Operation

For a kernel $K$ of size $(2r+1)\times(2r+1)$,

$$O(x,y) = \sum_{i=-r}^{r}\sum_{j=-r}^{r} K(i,j)\, I(x+i,\, y+j)$$

Strictly, convolution flips the kernel and this form (no flip) is cross-correlation. Shader loops and CNN layers both compute the no-flip version, and for symmetric kernels the two are identical. The code on this page uses it, so the Sobel output has the sign you would expect from reading the weights.

## 2. Box and Gaussian Blur

A box blur averages a square: every weight is $1/k^2$. It is cheap but leaves square-ish artifacts. A Gaussian blur uses weights $\propto e^{-(i^2+j^2)/2\sigma^2}$, which falls off smoothly and blurs equally in all directions. A radius of about $3\sigma$ captures nearly all the weight.

A small discrete Gaussian comes from Pascal's triangle: the 1D kernel $[1, 4, 6, 4, 1]/16$ is the binomial row of order 4. Its variance is 1, so it approximates a Gaussian with $\sigma = 1$. Check: the weights sum to 16/16.

## 3. Separability

The 2D Gaussian is the product of two 1D Gaussians: $G(i,j) = g(i)\,g(j)$. In matrix terms the 2D kernel is a column times a row (an outer product, rank 1). Then

$$O = \text{rows pass}(\text{columns pass}(I))$$

and the result is identical to the full 2D filter. Running the check in numpy on a random 32 by 32 image, the one-pass 5 by 5 result and the two-pass 5 plus 5 result differ by $4\times10^{-16}$, which is rounding error.

The savings: a $k\times k$ filter costs $k^2$ taps per pixel, the two-pass version costs $2k$.

| Kernel size $k$ | Direct taps | Two-pass taps |
| --------------- | ----------- | ------------- |
| 5               | 25          | 10            |
| 11              | 121         | 22            |
| 21              | 441         | 42            |

On a 1920 by 1080 image (2,073,600 pixels), an 11 by 11 blur needs 250,905,600 texture fetches directly and 45,619,200 with two passes. The two-pass version needs an intermediate texture and a second draw, so it pays some memory traffic, but the tap count dominates for anything beyond a tiny kernel.

Not every kernel is separable. A kernel is separable exactly when its matrix has rank 1. The Gaussian does; the 3 by 3 Laplacian below has rank 2, so it does not.

## 4. Edge Detection

Sobel estimates the horizontal derivative while smoothing vertically. Its x kernel is the outer product of a smoothing column and a derivative row, so it is separable:

$$S_x = \begin{pmatrix}1\\2\\1\end{pmatrix}\begin{pmatrix}-1 & 0 & 1\end{pmatrix} = \begin{pmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{pmatrix}$$

$S_y$ is the transpose. The edge strength is $\sqrt{G_x^2 + G_y^2}$ and the direction is $\operatorname{atan2}(G_y, G_x)$.

The Laplacian is a second derivative. The common 4-neighbour version is

$$L = \begin{pmatrix}0&1&0\\1&-4&1\\0&1&0\end{pmatrix}$$

It responds to blobs and corners, with a positive peak on one side of an edge and a negative on the other, and zero in flat areas. It amplifies noise, so people usually blur first (the Laplacian of Gaussian).

## 5. Sharpening

Sharpening adds the edge signal back: $I + (-L * I)$. The kernel is the identity minus the Laplacian:

$$\begin{pmatrix}0&-1&0\\-1&5&-1\\0&-1&0\end{pmatrix}$$

Applied to a step edge, it overshoots on both sides (halos). Values below 0 and above 1 show up, so clamp afterward, or sharpen less by blending with the original.

## 6. Bilateral Filter

A Gaussian blur smears across edges because it only looks at distance. The bilateral filter multiplies the spatial weight by a second weight that depends on how different the neighbour's value is:

$$w(p,q) = e^{-\lVert p-q\rVert^2/2\sigma_s^2}\; e^{-(I_p - I_q)^2/2\sigma_r^2}$$

and divides by the sum of weights. Pixels across an edge have a large intensity difference, so their weight is near zero, and the edge survives while flat regions smooth out. Because the weights depend on the image, it is not a convolution with a fixed kernel and it is not exactly separable. Approximations that split it in two passes exist and are fine for real-time use.

## 7. Border Handling

At the edge of the image, some taps fall outside. The common choices, shown by a 3-tap box filter $[1,1,1]/3$ on the row $[1,2,3,4]$ (outputs at the first and last pixel):

| Mode            | First output | Last output | Meaning                  |
| --------------- | ------------ | ----------- | ------------------------ |
| constant (zero) | 1.000        | 2.333       | outside is black         |
| edge (clamp)    | 1.333        | 3.667       | repeat the nearest pixel |
| reflect         | 1.667        | 3.333       | mirror around the edge   |
| wrap            | 2.333        | 2.667       | the image tiles          |

Zero padding darkens borders. Clamp is the usual choice for blur because it matches the GPU's clamp-to-edge sampler mode. Wrap is right for tiling textures.

## 8. A numpy Implementation

```python
import numpy as np

def filter2d(img, k, mode="edge"):
    """Cross-correlation (what GLSL loops and CNN layers compute)."""
    ph, pw = k.shape[0] // 2, k.shape[1] // 2
    p = np.pad(img, ((ph, ph), (pw, pw)), mode=mode)
    out = np.zeros(img.shape)
    for i in range(k.shape[0]):
        for j in range(k.shape[1]):
            out += k[i, j] * p[i:i + img.shape[0], j:j + img.shape[1]]
    return out

g1 = np.array([1, 4, 6, 4, 1]) / 16
g2 = np.outer(g1, g1)
sobel_x = np.outer([1, 2, 1], [-1, 0, 1])
laplace = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
sharpen = np.pad([[1]], 1) - laplace

img = np.random.default_rng(0).random((32, 32))
two_pass = filter2d(filter2d(img, g1[None, :]), g1[:, None])
print("2D vs two 1D passes:", np.abs(filter2d(img, g2) - two_pass).max())

step = np.zeros((6, 8)); step[:, 4:] = 1       # edge between x=3 and x=4
for name, k in [("sobel_x", sobel_x), ("laplace", laplace), ("sharpen", sharpen)]:
    print(name, filter2d(step, k)[2])
```

Running it prints a separability difference of about $4\times10^{-16}$ and, for row 2 of the step image:

```text
sobel_x [0. 0. 0. 4. 4. 0. 0. 0.]
laplace [ 0.  0.  0.  1. -1.  0.  0.  0.]
sharpen [ 0.  0.  0. -1.  2.  1.  1.  1.]
```

Sobel gives a clean response of 4 on the two pixels next to the edge. The Laplacian flips sign across it. Sharpen overshoots to -1 and 2 where the original only had 0 and 1, which is the halo.

## 9. GPU Notes

In a fragment shader each output pixel does its own taps with `texture()` calls. Sampler clamp-to-edge gives the clamp border mode for free. One pass of a separable blur takes the direction as a uniform (`vec2(1,0)` or `vec2(0,1)` in texels). Hardware bilinear filtering lets two neighbouring taps merge into one fetch: for the 5-tap kernel above, the taps at offsets 1 and 2 with weights 0.25 and 0.0625 combine into one fetch at offset $(1\cdot0.25 + 2\cdot0.0625)/0.3125 = 1.2$ texels with weight 0.3125. That makes five fetches into three. For large kernels, a compute shader that loads a tile of the image into shared memory first avoids refetching the same texels (see [[notes/graphics/compute-shaders|Compute Shaders]]).

## Related

- [[notes/lectures/mlp/02-cnn|MPL 02 CNN]]: learned kernels, receptive fields, and the neuroscience behind them
- [[notes/ml/convolutional-networks|Convolutional Networks]]: stacking and learning the filters designed here
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: why blur should run on linear values
- [[notes/graphics/compute-shaders|Compute Shaders]]: tiling with shared memory for big kernels
- [[notes/lectures/realtimegraphics/08_special_effects|RTG 08 Special Effects]]: post-processing effects that use these filters
- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: the shader setting for a per-pixel tap loop
