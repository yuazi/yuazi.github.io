---
title: "HDR and EDR on macOS"
tags:
  - graphics
  - hdr
  - macos
  - metal
date: 2026-11-05
---

On macOS, Apple's name for high dynamic range output is Extended Dynamic Range (EDR). The idea is that 1.0 stays "SDR white", and a display that has spare brightness can show values above 1.0 as brighter than white. An app opts in with a few layer settings, picks a floating-point pixel format, and renders values above 1.0 in linear light. I ran into this while building [[work/lumadisplay|LumaDisplay]], which uses the headroom macOS reports to push the whole desktop past 100 percent brightness.

![[pictures/topics/graphics/hdr-and-edr-on-macos.png]]

<p class="image-caption">HDR keeps detail in both the bright sky and the dark shadows at once. Image: HDRI_Sample_Scene_Window_(JPEG-HDR).jpg: Axel Jacobs (Photographer) derivative w, CC BY-SA 2.0, via <a href="https://commons.wikimedia.org/wiki/File:Tone_Mapping_Methods.jpg">Wikimedia Commons</a>.</p>

## Mental Model

- The scale is relative. 1.0 means "SDR white at the current brightness setting", not a fixed number of nits.
- Headroom is how far above 1.0 the display can go right now. It varies with the panel, the brightness setting, and system conditions, so it is a runtime value, not a constant.
- The pixel buffer has to be able to hold values above 1.0 (half-float) and the color space has to be one that allows them (an extended linear space).
- Do not count on the system to roll highlights off gracefully. Compressing toward the available headroom is best planned as the app's job.
- The course side of this, the why and the tone-mapping operators, is in [[notes/lectures/realtimegraphics/12_hdr|RTG 12 HDR]]. This page is the API side.

## 1. The EDR Model

Standard SDR content is encoded to 0 to 1 and the display maps 1.0 to its SDR white level. HDR-capable displays can emit more light than that for small highlights. EDR exposes that capacity by allowing component values above 1.0: a pixel value of 2.0 asks for twice the light of SDR white, if the display can supply it.

The scale being relative is what makes the model practical. If the user turns the brightness slider down, SDR white gets dimmer and the ratio of available peak to SDR white goes up, so there is more headroom. With the slider near the top of the SDR range, headroom is typically smaller. SDR content keeps its normal look either way, because SDR white stays where the user set it.

## 2. Requesting EDR from a Metal Layer

A Metal view draws into a `CAMetalLayer`. Three properties matter:

```swift
import AppKit
import Metal
import QuartzCore

let layer = CAMetalLayer()
layer.device = MTLCreateSystemDefaultDevice()
layer.pixelFormat = .rgba16Float
layer.wantsExtendedDynamicRangeContent = true
layer.colorspace = CGColorSpace(name: CGColorSpace.extendedLinearDisplayP3)
```

The pixel format `.rgba16Float` stores each channel as a half-float, which holds values far above 1.0 and negative values for colors outside the gamut. `wantsExtendedDynamicRangeContent` tells the compositor that this layer carries values above 1.0 and should not be clamped to the SDR range. The color space `extendedLinearDisplayP3` says what the numbers mean: Display P3 primaries, no transfer curve (linear), range not limited to 0 to 1. There is a matching `extendedLinearSRGB` if you would rather keep sRGB primaries.

Linear means the shader writes light, not encoded values. A fragment shader that returns `vec3(2.0)` here asks for twice SDR white. If your shader still ends with an sRGB encode from [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]], remove it for this layer or the image will come out wrong. This is the single most common mistake when moving an SDR renderer to EDR.

I compiled and ran this snippet against AppKit and Metal on my Mac. LumaDisplay's HDR overlay uses the same ingredients, an `rgba16Float` layer with `wantsExtendedDynamicRangeContent` (see [[work/lumadisplay|the project page]]).

There is also an `edrMetadata` property on the layer for describing PQ or HLG content with mastering luminance values. I have not used it, so I leave it as a pointer. A plain app drawing its own linear scene does not need it.

## 3. Querying Headroom

`NSScreen` reports the range as a floating-point multiple of SDR white:

```swift
if let screen = NSScreen.main {
    let now = screen.maximumExtendedDynamicRangeColorComponentValue
    let potential = screen.maximumPotentialExtendedDynamicRangeColorComponentValue
    print(now, potential)
}
```

`maximumExtendedDynamicRangeColorComponentValue` is the headroom available right now. `maximumPotentialExtendedDynamicRangeColorComponentValue` is the most the display could provide under favorable conditions. On the Mac I ran this on, the pair printed 1.2 and 16.0 at the moment of the test, so the current value can be far under the potential one. A value of 1.0 means no headroom at all, and you should render plain SDR.

Because the current value moves, read it each frame (or at least on a timer) instead of caching it at launch. I did not rely on a change notification for it. LumaDisplay's project page notes that its gain adapts as the reported headroom changes, which fits this approach.

## 4. Tone Mapping for the Headroom You Have

Suppose the scene produces linear values up to 10 but the screen reports headroom 3. Sending the raw numbers asks for more than the display can deliver, and you cannot count on a graceful result. The app should compress values toward the reported maximum $H$. A simple shoulder keeps everything below a knee $k$ unchanged and rolls off the rest exponentially:

$$f(x) = \begin{cases} x & x \le k \\ k + (H - k)\left(1 - e^{-(x-k)/(H-k)}\right) & x > k \end{cases}$$

The slope at the knee is exactly 1, so there is no visible kink, and the output approaches $H$ from below. With $H=3$ and $k=1$, evaluating it gives: 0.5 stays 0.5, 1.5 becomes 1.44, 2.0 becomes 1.79, 4.0 becomes 2.55, 10 becomes 2.98, and 100 becomes 3.0.

```glsl
float rollOff(float x, float H, float k) {
    return x <= k ? x : k + (H - k) * (1.0 - exp(-(x - k) / (H - k)));
}
```

Apply it to luminance or to max channel, not blindly per channel, or saturated colors shift hue as one channel clips earlier than the others. The operators in the lecture (Reinhard and friends) are alternatives with the same job. What changes here is that the target white point is not fixed at 1.0 any more: it follows `H`.

> [!tip] Intuition
> SDR tone mapping squeezes the scene into 0 to 1. EDR tone mapping squeezes it into 0 to H, where H is a number the OS hands you, and leaves 0 to 1 alone so SDR-looking content stays put.

## 5. Practical Notes

- Half-float buffers cost twice the memory and bandwidth of 8-bit RGBA. For a full-screen overlay that matters.
- Additive effects such as glow and particles (see [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]) pile up above 1.0 by design. On an EDR display that becomes real extra brightness instead of a clamp, so tone map it on purpose.
- Test the headroom 1.0 case too, for example on an SDR external monitor. The render should degrade to a normal SDR picture.
- Values above 1.0 do not make colors out of gamut. A saturated Display P3 color at 2.0 is the same chromaticity, just brighter.
- Percentages like 150 percent in an app describe a software gain, not a measured luminance. LumaDisplay says the same about its slider.

## Related

- [[work/lumadisplay|LumaDisplay]]: the app that applies this to the whole desktop
- [[notes/lectures/realtimegraphics/12_hdr|RTG 12 HDR]]: dynamic range, tone mapping operators, HDR display bandwidth
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: linear versus encoded values and gamuts
- [[notes/graphics/metal-basics|Metal Basics]]: the device, queue and pipeline objects the layer sits on top of
- [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]: additive accumulation that exceeds 1.0
