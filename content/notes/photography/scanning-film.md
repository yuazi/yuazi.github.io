---
title: "Scanning Film"
tags:
  - photography
  - film
  - scanning
date: 2026-11-05
---

A developed negative is a physical object with a very wide tonal range and a lot of fine detail. Scanning turns it into a file, and the choices made there (the scanner, the light, the inversion) shape the final image as much as the film itself. A lab scan is the easiest route. A flatbed or a camera setup gives you more control and costs less per roll over time. Knowing what each path does helps you judge scans you receive as well as scans you make.

![[pictures/topics/photography/scanning-film.png]]

<p class="image-caption">Scanning turns each little negative into a digital photo. Image: Спасимир (Spasimir Pilev), CC BY-SA 4.0, via <a href="https://commons.wikimedia.org/wiki/File:BASA_scanner_for_negatives_and_microfilms.jpg">Wikimedia Commons</a>.</p>

## Mental Model

- A scan is a measurement of how much light passes through each point of the film. The software turns that measurement into a picture.
- Color negatives are inverted and carry an orange mask. Getting neutral color back is a per-channel problem.
- Resolution is limited by the film's grain and the optics as much as by the scanner's sticker number.
- Dust and scratches are easier to avoid than to remove.
- Keep a high-bit-depth master and make small JPEGs from it.

## 1. Three Ways to Scan

Lab scans come from a fast machine such as a Frontier or Noritsu, run by the lab when it develops your roll. They are cheap and convenient and consistent from roll to roll. The lab's software applies its own color and contrast, and the default resolution is often modest. Many labs offer a higher-resolution scan for more money, and some will return the raw scan on request.

Flatbed scanners with a transparency unit (the Epson V-series is a common example) hold the film in a holder and scan with a moving light. They are affordable and flexible. Their real optical resolution is well below the sticker number: a scanner advertised at 6400 dpi typically resolves much less in practice, which is fine for a screen or small print but limiting for large ones. Dedicated film scanners, such as the Nikon Coolscan and Plustek OpticFilm lines, give sharper results from 35mm and are slower.

Camera scanning photographs the negative with a digital camera, a macro lens and a flat light source. It is fast (a roll takes minutes), it uses a camera you may already own, and it can capture a raw file with high bit depth. It needs a setup that holds the film flat and parallel to the sensor, a light with good color rendering (a high CRI), and care about stray light.

## 2. How Much Resolution

A 35mm frame is 36 × 24 mm. The pixel count at a given scan resolution follows from the frame size in inches ($36 / 25.4 = 1.417$ inch wide).

| Scan resolution | Pixels (W × H) | Megapixels |
| --------------- | -------------- | ---------- |
| 2400 dpi        | 3402 × 2268    | 7.7        |
| 3000 dpi        | 4252 × 2835    | 12.1       |
| 4000 dpi        | 5669 × 3780    | 21.4       |
| 6400 dpi        | 9071 × 6047    | 54.9       |

(The table comes from running the arithmetic in Python.) At 4000 dpi a frame is 21 megapixels, which prints about 19 × 12.6 inches at 300 pixels per inch. That is plenty for almost all uses. How much real detail a frame holds depends on the lens, the focus, the film and its grain. As a rule of thumb, fine-grained film does not contain useful detail much beyond roughly 4000 dpi, so scanning at 6400 dpi mainly resolves grain. For screens and Instagram, 2400 to 3000 dpi is usually enough.

For camera scanning, the equivalent question is magnification. A full-frame sensor with a 1:1 macro lens images the 36 mm frame across the 36 mm sensor. On a 6000 pixel wide sensor that is 6 µm per pixel, or about 4233 dpi, matching a good film scanner. An APS-C sensor is only about 23.5 mm wide, so a 1:1 setup would crop the frame. A macro lens set to about 0.65:1 fits the whole frame on it, and with the same 6000 pixel width you again get about 4233 dpi.

## 3. Inverting a Color Negative

A color negative inverts both brightness and color. In addition, the orange mask means the film base is not clear. Three effects stack up.

1. Brightness is inverted: dense areas (bright in the scene) are dark on the film.
2. Each channel has a different base level because of the mask: the blue channel sees very little light through the film base, the green some, the red most.
3. Density relates to scene brightness on a log scale. A negative's density rises with the logarithm of exposure, so the data are closer to a power law than to a straight flip.

The method in outline: sample the unexposed film base (the rebate between frames), divide each channel by it so that the base reads as 1, then raise the result to a negative power to undo the density curve, and set a white point per channel. Dividing by the base removes the orange cast. The per-channel white point fixes the remaining balance.

```python
import numpy as np

def invert_negative(scan, base, gamma=0.6, white_pct=99.5):
    """scan: linear RGB floats (H, W, 3); base: RGB of the unexposed film base."""
    t = np.clip(scan / base, 1e-4, 1.0)   # transmittance relative to the film base
    pos = t ** (-1.0 / gamma)             # density rises with log exposure, so undo that power
    pos /= np.percentile(pos, white_pct, axis=(0, 1))  # per-channel white point
    return np.clip(pos, 0.0, 1.0)
```

I checked it on a synthetic negative: a neutral exposure ramp is turned into a negative with an orange base, and the function returns equal red, green and blue values, a neutral ramp. The `gamma` value of 0.6 is an assumption for the test. Real films differ, so treat it as a knob to match what looks right.

Commercial tools do this with more care. Negative Lab Pro, a Lightroom plug-in, is one example, and other converters exist, including free ones. They add film-specific profiles and tone controls. Doing it by hand in an editor by inverting and then adjusting levels per channel, so that the histogram of each channel spans the same range, gets you most of the way. Use the scan in linear light if you can, and see [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]] for why the order of operations (invert, encode) matters.

Black-and-white negatives skip the color step: invert, set black and white points, and adjust the curve.

## 4. Dust, Scratches and Newton Rings

Dust on the film becomes white specks on a positive. Prevent it more than you fix it: handle film by the edges, blow it off with a bulb blower, wipe with a lint-free cloth only if needed, and scan in a clean, low-draft area. Flatbeds and film scanners may have infrared cleaning (often called ICE), which uses an infrared channel to find dust and remove it. It works on dye-based color negatives and slides. It does not work well on traditional silver black-and-white film, because the silver blocks infrared too.

Newton rings are the rainbow-colored ripples that form where the film touches glass and the gap is very small. They appear mostly on flatbed scans. To avoid them, scan the film in a holder that keeps it clear of the glass, use anti-Newton glass, or adjust the film's height. Camera scanning avoids the problem because there is no glass touching the film, though you then need a way to keep the film flat.

## 5. File Formats and Workflow

Save the master as a 16-bit TIFF, or as a raw file (DNG) for camera scans. A TIFF keeps the tone data without lossy compression, and 16-bit gives enough room for adjustments. Make JPEGs for sharing and web use. Keep the original scan unmodified, and keep edits as a recipe or in a separate file. Tag files with the roll, film stock and date so you can find them later.

The file's color space matters for how colors appear on other people's screens. Export for the web in sRGB.

## Related

- [[notes/photography/c41-color-developing|C-41 Color Developing]]: where the orange mask comes from
- [[notes/photography/developing-black-and-white|Developing Black-and-White Film]]: the black-and-white path to a scannable negative
- [[notes/photography/film-stocks|Film Stocks]]: grain and the limit of useful resolution
- [[notes/photography/35mm-cameras-and-lenses|35mm Cameras and Lenses]]: macro lenses for camera scanning
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: linear light, gamma and sRGB
- [[film|Film]]: lab-scanned results
