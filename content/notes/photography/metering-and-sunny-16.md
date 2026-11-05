---
title: "Metering and Sunny 16"
tags:
  - photography
  - film
  - exposure
date: 2026-11-05
---

Metering is the step where you decide how much light the film should get. A camera's built-in meter, a handheld meter, or your own eye plus the Sunny 16 rule can all do it. They agree on most scenes and disagree on the interesting ones: snow, backlight, a dark figure in front of a bright window. Understanding what a meter assumes tells you when to trust it and when to correct it. This is also the one skill that does not need batteries, which matters if you shoot a mechanical camera.

![[pictures/topics/photography/metering-and-sunny-16.png]]

<p class="image-caption">A light meter tells you how bright the scene is so you can set the camera. Image: Kecko, CC BY 2.0, via <a href="https://commons.wikimedia.org/wiki/File:Revue_S110_Exposure_Meter.jpg">Wikimedia Commons</a>.</p>

## Mental Model

- A reflected-light meter measures the light bouncing off the scene and assumes the scene averages out to middle gray.
- An incident meter measures the light falling on the subject, so the subject's own brightness does not fool it.
- On negative film, expose for the shadows. Underexposed shadows are lost for good, and highlights tend to survive extra light.
- Sunny 16 is a metering table in your head: at f/16 in direct sun, the shutter speed is one over the ISO.
- Once the meter says "middle gray", you can decide how many stops away from gray each thing in the scene should be. That is the zone system in short.

## 1. Reflected and Incident Metering

A reflected meter points at the scene from the camera position. Built-in through-the-lens (TTL) meters work this way. They see how bright the scene looks and pick an exposure that renders it as a mid tone. That works when the scene has a typical mix of light and dark. It fails when most of the frame is bright, since the meter darkens it toward gray, or when most is dark, since the meter lightens it.

An incident meter reads the light arriving at the subject, using a white dome pointed back at the camera. A white wall and a black cat in the same light get the same reading, so the meter avoids the bias. It needs you to stand where the subject is, which makes it impractical for distant scenes. A grey card and a reflected meter give much the same result: meter the card in the subject's light.

The standard corrections for a reflected meter are:

| Scene                                    | Meter tends to          | Correction                                     |
| ---------------------------------------- | ----------------------- | ---------------------------------------------- |
| Snow, sand, bright sky filling the frame | Underexpose             | Give about +1 to +2 stops                      |
| Dark subject on a dark background        | Overexpose              | Give about -1 stop                             |
| Backlit subject, bright background       | Underexpose the subject | Meter the subject or give about +1 to +2 stops |

These are starting points. Pick the one that matches the scene and note the result on your next roll.

## 2. The 18 Percent Gray Idea

Reflected meters are calibrated so that a surface that reflects a "typical" fraction of light is rendered as a mid tone. The conventional figure is 18 percent, which is why photographers sell 18 percent gray cards. Manufacturers' calibration constants differ, and the effective reflectance of the target is often quoted a little lower, so treat 18 percent as the working convention and not a precise physical constant.

Why does 18 percent count as the middle? Human lightness perception is strongly nonlinear. In the CIE lightness scale $L^*$ (0 to 100), a gray with 18 percent relative luminance lands almost exactly at 50:

$$L^* = 116\,Y^{1/3} - 16 \quad\Rightarrow\quad L^*(0.18) \approx 49.5$$

(Running the formula gives 49.5.) So a surface reflecting 18 percent of the light looks about halfway between black and white to a person, even though it reflects far less than half of it. The same effect is behind gamma encoding on screens, covered in [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]].

## 3. The Sunny 16 Rule

Sunny 16 gives you a starting exposure without a meter. On a sunny day with distinct shadows, set the aperture to f/16 and the shutter speed to one over the film's ISO (or the nearest speed on the dial).

| Film speed | Shutter at f/16, sunny |
| ---------- | ---------------------- |
| ISO 100    | 1/125                  |
| ISO 200    | 1/250                  |
| ISO 400    | 1/500                  |
| ISO 800    | 1/1000                 |

The speed 1/100 would be exact for ISO 100, but the dial has no 1/100, so 1/125 is used, giving a slight underexposure of about a third of a stop that negative film handles easily. With the exposure value from [[notes/photography/exposure-triangle|The Exposure Triangle on Film]], Sunny 16 at ISO 100 is about EV 15.

The weather variants simply open the aperture one stop per step, keeping the shutter at $1/\text{ISO}$:

| Condition                   | Shadows        | Aperture |
| --------------------------- | -------------- | -------- |
| Snow or bright sand, in sun | Very sharp     | f/22     |
| Sunny                       | Distinct       | f/16     |
| Slight overcast             | Soft edges     | f/11     |
| Overcast                    | Barely visible | f/8      |
| Heavy overcast              | None           | f/5.6    |
| Open shade, or sunset       | None           | f/4      |

You can trade across equivalent pairs. For ISO 400 on an overcast day (f/8 at 1/400, so 1/500 on the dial), you could also use f/11 at 1/250 or f/5.6 at 1/1000.

> [!example] Worked example
> A friend stands in open shade by a white wall at noon. You load ISO 400 and want a fast shutter to avoid blur. Open shade is f/4 at $1/400$, so 1/500 on the dial. To stop down to f/8 for more depth, you need two stops more time: f/8 at 1/125. Each stop closed on the aperture is one stop slower on the shutter.

## 4. Metering for Shadows on Negative Film

The curve of negative film (see [[notes/photography/film-stocks|Film Stocks]]) is forgiving above and unforgiving below. A frame whose shadows are underexposed shows empty, grainy, flat darks that cannot be recovered. A frame that is over by a stop or two keeps shadow detail and usually finds a place for the highlights too. So the working habit is to find the darkest area where you want detail, meter that, and then let the highlights fall where they fall.

Many photographers also rate color negative film at half its box speed (ISO 400 at 200, for example) to build in a stop of safety. That only changes how you set the meter, and the lab processes the roll normally. Rating the roll lower is the opposite of pushing; for pushing see [[notes/photography/push-and-pull-processing|Push and Pull Processing]].

Slide film reverses the logic: meter for the highlights and let the shadows fall, since slide film clips highlights hard.

## 5. Zone System Basics

Ansel Adams and Fred Archer developed the zone system around 1940 as a way to link what you see to what ends up on the print. It divides the tonal range into eleven zones from 0 (pure black) to X (pure white), one stop apart. The zone numbers you use most:

| Zone | Meaning                                        |
| ---- | ---------------------------------------------- |
| III  | Dark with some texture                         |
| V    | Middle gray, the tone a meter aims for         |
| VII  | Light with texture, such as pale skin in sun   |
| VIII | Bright, highlights with only a hint of texture |

Because zones are one stop apart, the exposure change is simple: to move a tone from V to III, give two stops less. The system's rule is "expose for the shadows, develop for the highlights". You place the shadow where you want it and then use development time to control how bright the highlights end up, which is the idea behind pushing and pulling black-and-white film.

> [!example] Worked example
> You meter a shaded doorway and the reading is f/4 at 1/125. The meter wants this to be Zone V. You want the doorway to be Zone III, with texture but dark, so you give two stops less: f/4 at 1/500, or f/8 at 1/125. If the sunlit wall beside the doorway meters f/16 at 1/125, it is four stops brighter than the doorway reading (EV 15 against EV 11), so with the doorway on Zone III the wall lands on Zone VII, still with texture.

If you are using a camera with only a center-weighted or averaging meter, you can do the same by metering a patch and then moving the dial by the number of zones you want.

## 6. Putting It Together

A routine that works across most rolls:

1. Guess with Sunny 16 first, to know what the meter should say.
2. Meter. If the two disagree by more than a stop, look at the scene to see why (backlight, snow, a big dark region).
3. Pick the shadow you care about, and expose so it stays above black.
4. On color negative, lean toward more light. On slide, lean toward less.
5. Keep notes for your first few rolls, so you can match what you did to what came back.

## Related

- [[notes/photography/exposure-triangle|The Exposure Triangle on Film]]: EV and equivalent exposures
- [[notes/photography/film-stocks|Film Stocks]]: latitude of negative and slide film
- [[notes/photography/push-and-pull-processing|Push and Pull Processing]]: changing development to control contrast
- [[notes/photography/35mm-cameras-and-lenses|35mm Cameras and Lenses]]: what meters are built into old cameras
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: why 18 percent looks like the middle
- [[film|Film]]: results from daylight to night
