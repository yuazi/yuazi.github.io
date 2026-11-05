---
title: "Color Spaces and Gamma"
tags:
  - graphics
  - color
  - gamma
date: 2026-11-05
---

An RGB triple means nothing until you know two things about it: which primaries it refers to (the gamut) and how its numbers map to light intensity (the transfer function). Mixing those up is behind most color bugs in shaders: blends that look muddy, gradients with a dark band in the middle, and blurs that darken edges. This page fixes the vocabulary and works through the sRGB curve with real numbers.

## Mental Model

- Light adds linearly. Pixel values stored for display are not linear: they are encoded with a curve that spends more codes on dark values.
- Do math (blending, blurring, lighting) on linear values, then encode once at the end.
- The gamut says which colors can be represented. The transfer function says how intensity is spaced. They are independent choices, and the same transfer function can sit on top of different primaries.
- Alpha is not color. It is always linear, and whether RGB is multiplied by it (premultiplied) changes what filtering and blending do.

## 1. Why Encode at All

Human vision is roughly logarithmic in intensity (the lecture on this is in [[notes/lectures/realtimegraphics/12_hdr|RTG 12 HDR]]). With only 256 codes per channel, spacing them evenly in linear light would waste codes on bright values where steps are invisible, and leave visible banding in the darks. The encoding gives dark values finer steps. The decoded value is proportional to emitted light, which is what physical operations need.

## 2. The sRGB Transfer Function

For an encoded value $C$ and linear value $L$, both in 0 to 1:

$$L = \begin{cases} C / 12.92 & C \le 0.04045 \\ \left(\dfrac{C + 0.055}{1.055}\right)^{2.4} & C > 0.04045 \end{cases}$$

$$C = \begin{cases} 12.92\,L & L \le 0.0031308 \\ 1.055\,L^{1/2.4} - 0.055 & L > 0.0031308 \end{cases}$$

There is a short linear segment near black so the slope stays finite at zero. The overall curve is close to a pure power of 2.2, but it is not one. The pieces meet at the thresholds (the two branches agree to the digits shown), and a round trip through both functions over 1001 sample values returns the input to within $10^{-16}$ in a numpy test.

Some reference points computed from the formulas:

| Encoded $C$ | Linear $L$                   |
| ----------- | ---------------------------- |
| 0.5         | 0.2140                       |
| 0.4614      | 0.18 (photographic mid grey) |

An encoded 0.5 is only 21.4 percent as much light as white, and a linear 0.5 encodes as 0.7354.

```glsl
vec3 srgbToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linearToSrgb(vec3 l) {
    return mix(l * 12.92, 1.055 * pow(l, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, l));
}
```

Writing `pow(c, vec3(2.2))` is a common shortcut. It is cheaper and close to the above for most colors, with the largest relative error in the darkest tones.

## 3. Why Linear-Light Blending Matters

A 50 percent mix of black and white should emit half the light of white. Interpolating the encoded numbers gives 0.5, which decodes to 0.214 of the light: too dark. The correct result is to decode, average, and encode again, which gives 0.7354.

The same effect shows in color. Mixing pure red (1, 0, 0) and pure green (0, 1, 0) at 50 percent in encoded space gives (0.5, 0.5, 0), a dull olive. In linear space the result encodes to (0.7354, 0.7354, 0), a visibly brighter yellow. Both numbers come from running the formulas above.

Blur, downscaling, mipmapping, anti-aliasing, glow and lighting all do weighted sums. Done on encoded values, they darken high-contrast edges. The standard fix on GPUs is to let the hardware do the conversion: sRGB texture formats (`GL_SRGB8_ALPHA8`, `VK_FORMAT_R8G8B8A8_SRGB`, Metal's `.rgba8Unorm_srgb`) decode on sampling, and sRGB render targets encode on write, with blending happening in between on linear values. That takes no shader code.

> [!example] Worked example
> Blur a black and white checkerboard with a box filter over a 2 by 2 area. Each output pixel averages two white and two black texels. In encoded space it is 0.5. Linearly it is 0.5 light, which displays as 0.7354. The two blurs differ by 0.235 in code value, and the encoded one looks darker than the squares it came from.

## 4. Gamut Versus Transfer Function

The gamut is the triangle of chromaticities that the three primaries span. Common ones, with D65 white:

| Space          | Red xy         | Green xy       | Blue xy        | Triangle area vs sRGB |
| -------------- | -------------- | -------------- | -------------- | --------------------- |
| sRGB / Rec.709 | (0.640, 0.330) | (0.300, 0.600) | (0.150, 0.060) | 1.00                  |
| Display P3     | (0.680, 0.320) | (0.265, 0.690) | (0.150, 0.060) | 1.36                  |
| Rec.2020       | (0.708, 0.292) | (0.170, 0.797) | (0.131, 0.046) | 1.89                  |

The area ratios are my computation from those coordinates in the xy diagram, so read them as a rough size comparison, not a perceptual measure.

Display P3 uses the sRGB transfer function with wider primaries. Rec.2020 is a wide gamut that HDR video pairs with a different transfer function (PQ or HLG), which is a separate story from the sRGB curve and ties into [[notes/graphics/hdr-and-edr-on-macos|HDR and EDR on macOS]].

Converting between gamuts is a 3 by 3 matrix applied to linear values. Building it from the primaries above, Display P3 red $(1,0,0)$ in linear sRGB coordinates becomes

$$(1.2249,\ -0.0421,\ -0.0196)$$

The blue and green components go negative and one exceeds 1, which is exactly what "outside the sRGB gamut" means. If you clamp to 0 to 1 after converting, you lose that color. Formats that allow values outside 0 to 1 (extended sRGB, float render targets) keep it, which is also how EDR content works.

## 5. Premultiplied Alpha

Straight alpha stores color and coverage separately. Premultiplied alpha stores $(\alpha r, \alpha g, \alpha b, \alpha)$. The over operator with a premultiplied source is one multiply-add:

$$C_{out} = C_{src} + (1 - \alpha_{src})\,C_{dst}$$

The reason premultiplied is preferred for filtering: interpolating a transparent texel with arbitrary RGB against an opaque one drags that RGB into the result. Take a fully transparent black texel $(0,0,0,0)$ and an opaque red texel $(1,0,0,1)$ and average them. With straight alpha the result is $(0.5, 0, 0, 0.5)$, which over white gives $(0.75, 0.5, 0.5)$, a darker pink with a dirty fringe. With premultiplied storage the same average is $(0.5, 0, 0, 0.5)$ but it means something different: over white it gives $(1.0, 0.5, 0.5)$, which is exactly 50 percent red on white.

Premultiplication belongs on linear values. Decode first, then multiply by alpha. Alpha itself is never gamma encoded.

## 6. Common Bugs

- Lighting computed on texture values that were never decoded, so everything looks washed out or too contrasty.
- Encoding twice: writing `pow(c, 1/2.2)` to a render target that is already an sRGB format brightens the image.
- Treating data textures (normal maps, roughness, masks) as color. They should be sampled as linear data with no sRGB decode.
- Doing `mix` between two palette colors and wondering why the middle looks dark. Convert both to linear, mix, then encode.
- Premultiplication mismatch: sending straight-alpha pixels to a compositor that expects premultiplied gives bright halos around edges.
- Clamping to 0 to 1 too early and losing wide-gamut or HDR values.
- Assuming a tool tags its output. In a TouchDesigner GLSL TOP the numbers you write go out as written into the TOP's pixel format, so conversion is your job (see [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]]).

## Related

- [[notes/lectures/realtimegraphics/12_hdr|RTG 12 HDR]]: linear-light rendering and tone mapping from the course
- [[notes/graphics/hdr-and-edr-on-macos|HDR and EDR on macOS]]: extended linear spaces and values above 1.0
- [[notes/graphics/fragment-shader-basics|Fragment Shader Basics]]: where these colors get produced
- [[notes/graphics/image-convolution-kernels|Image Convolution Kernels]]: blur in linear light
- [[notes/lectures/realtimegraphics/06_textures|RTG 06 Textures]]: sampling, filtering and mipmaps
- [[work/lumadisplay|LumaDisplay]]: a project that renders EDR content through Metal
