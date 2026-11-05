---
title: "35mm Cameras and Lenses"
tags:
  - photography
  - film
  - cameras
date: 2026-11-05
---

A 35mm film camera is a light-tight box with a lens on the front and a shutter in front of the film. Most of the choices that matter are about how you see and focus (SLR, rangefinder, point-and-shoot), how the shutter is driven (mechanical or electronic), and which focal length you use. Film cameras are old, so condition counts as much as model. A fully working cheap camera takes better pictures than a rare one with a failing shutter or rotted light seals.

## Mental Model

- The three common body types differ in how you compose and focus, not in the film they use.
- A mechanical shutter keeps working with a dead battery. An electronic one does not.
- Focal length plus the 36 × 24 mm frame gives the field of view. The numbers are computable.
- Light seals are foam. Foam ages. Check it before you shoot a roll you care about.
- Buy the lens mount you like first, then the body.

## 1. Camera Types

An SLR (single-lens reflex) has a mirror that sends the lens image up to a focusing screen and a prism, so you see through the lens. When you press the shutter, the mirror flips out of the way. You compose exactly what the lens sees, and you can change lenses. Because of the mirror box, SLRs are larger and louder. Most SLR bodies have a built-in light meter.

A rangefinder has a separate viewfinder and a coupled mechanism that shows two images of the subject, which merge when the lens is focused. There is no mirror, so bodies are smaller and quieter, and the viewfinder does not black out at exposure. The viewfinder frames the scene with lines for different focal lengths, which makes close focusing and very long lenses awkward. Leica M cameras are the well-known example, and several fixed-lens and interchangeable-lens rangefinders from other makers exist.

A point-and-shoot (compact) has a fixed lens, usually with autofocus and automatic exposure. It is the easiest to carry and use. Some, like the Olympus mju-II and Contax T2, are now collectors' items and cost much more than their simple appearance suggests, so check current prices before assuming a compact is cheap.

## 2. Shutters

The shutter in most 35mm SLRs and rangefinders is a focal-plane shutter, two curtains right in front of the film that travel across the frame and create a slit whose width sets the exposure time. Curtains are cloth or thin metal blades.

A mechanical shutter is driven by springs and gears. It needs no electricity to fire, and a battery, if present, only powers the meter. Examples of cameras with mechanical shutters include the Nikon FM2, Pentax K1000 (battery for meter only), and Olympus OM-1. An electronically controlled shutter uses electromagnets to hold the curtains, and the camera will not fire, or fires only at one fixed speed, if the battery is dead. Canon's AE-1 is the common example. Electronic cameras often offer aperture-priority or program modes. Both types can be reliable. The mechanical ones are simpler to repair, and the electronic ones offer more automation.

The flash sync speed is the fastest speed at which the whole frame is open at once, which is usually 1/60 to 1/250 depending on the camera.

## 3. Light Seals

Foam seals around the door and in the hinge and mirror area keep stray light out. Over decades the foam hardens or turns to a sticky paste. A leaking seal shows up as red or orange streaks along the edges of frames or a fogged first frame. Some of the red and orange light leaks you can see in frames on [[film|the Film page]] are the sort of effect a worn seal can produce, though leaks also come from cassettes and film handling, and I have not traced the cause of any particular frame.

Replacing seals is a common DIY job. Replacement kits and seal material are inexpensive, and tutorials exist for most popular models. Check the seals as part of any used purchase.

## 4. Focal Length and Field of View

The 35mm frame is 36 mm wide and 24 mm tall, with a diagonal of $\sqrt{36^2 + 24^2} \approx 43.3$ mm. For a lens focused at infinity with focal length $f$, the angle of view across a dimension $d$ is

$$\theta = 2\arctan\!\left(\frac{d}{2f}\right)$$

```python
import math

for f in (28, 35, 50, 85):
    angles = [2 * math.degrees(math.atan(d / (2 * f))) for d in (36, 24, math.hypot(36, 24))]
    print(f, [round(a, 1) for a in angles])
```

Running this gives:

| Focal length | Horizontal | Vertical | Diagonal |
| ------------ | ---------- | -------- | -------- |
| 28 mm        | 65.5°      | 46.4°    | 75.4°    |
| 35 mm        | 54.4°      | 37.8°    | 63.4°    |
| 50 mm        | 39.6°      | 27.0°    | 46.8°    |
| 85 mm        | 23.9°      | 16.1°    | 28.6°    |

Lenses near the frame diagonal (the 50 mm is a bit longer than 43 mm) are called normal lenses, because they approximate the way things look when viewed. A 28 mm is a moderate wide angle, handy for street and interiors, but it exaggerates perspective at the edges. A 35 mm is a classic documentary focal length, a little wider than a normal lens. An 85 mm is a short telephoto, flattering for portraits with a shallow depth of field when used wide open. Remember the shake rule from [[notes/photography/exposure-triangle|The Exposure Triangle on Film]]: about $1/f$ seconds as the slowest handheld speed, so 1/125 for the 85 mm.

The same angle on a smaller sensor needs a shorter lens. An APS-C digital sensor has a crop factor of about 1.5, so a 50 mm on 35mm film covers the same angle as roughly a 33 mm on that sensor, and a 35 mm lens on APS-C resembles a 52 mm on film. Focusing close makes the effective focal length longer, so the values above hold best at distance.

## 5. Lens Mounts

A body only accepts lenses of its mount. Common 35mm mounts include Nikon F, Pentax K, M42 (a screw mount many makers used), Olympus OM, Minolta MD, Canon FD and Leica M. Adapters exist between some mounts and digital cameras, but not all mounts adapt to each other, and Canon FD, for example, does not fit the later EF mount. Choose a lens mount with good lenses at prices you like, and then buy a body for it.

Fast lenses (f/1.4 to f/2) let in more light and give a shallower depth of field, but they cost more. A 50 mm f/1.8 is typically the cheapest way into low-light shooting. A macro lens that reaches 1:1 is also what camera scanning needs, as described in [[notes/photography/scanning-film|Scanning Film]].

## 6. Buying Used: What to Check

Test what you can in the shop, and ask for a return period if you buy online. Things to check:

1. Shutter speeds. Fire at every speed and listen. Slow speeds that sound uneven or sticky point to old lubricant. A shutter tester gives real numbers, and some camera shops will check speeds for you.
2. Light seals and mirror foam. Look at the door and hinge for crumbling foam, and look in the mirror box.
3. The meter. Compare its reading to a phone app or a handheld meter. Corrosion in the battery compartment is a warning.
4. The viewfinder. Look for dark spots or haze in the prism and screen, and for a rangefinder, check that the double image aligns at infinity and close up.
5. The lens. Hold it up to the light and look for fungus (web-like filaments), haze, scratches, and separated elements (cloudy rings). Check the aperture blades open and close crisply and that there is no oil on them. The focus ring should turn smoothly.
6. The mechanics. Film advance, rewind, frame counter and back latch should work without grinding.
7. Test roll. Run a cheap roll through and look for light leaks, uneven exposure across the frame, and sharpness.

Once the camera is working, the exposure choices follow [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]], and the film is chosen using [[notes/photography/film-stocks|Film Stocks]].

## Related

- [[notes/photography/exposure-triangle|The Exposure Triangle on Film]]: aperture, shutter and the reciprocal rule
- [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]]: when the built-in meter is wrong or dead
- [[notes/photography/film-stocks|Film Stocks]]: what to load once the camera works
- [[notes/photography/scanning-film|Scanning Film]]: macro lenses for camera scanning
- [[notes/photography/c41-color-developing|C-41 Color Developing]]: what happens to the roll after the camera
- [[film|Film]]: pictures from the camera side
