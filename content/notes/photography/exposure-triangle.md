---
title: "The Exposure Triangle on Film"
tags:
  - photography
  - film
  - exposure
date: 2026-11-05
---

Exposure is the amount of light that reaches the film during one frame. Three settings control it: the aperture (how wide the lens opens), the shutter speed (how long it stays open), and the film speed (how sensitive the emulsion is). On a digital camera all three can change from shot to shot. On film the third one is locked in when you load the roll, which changes how you plan. I keep coming back to the arithmetic here because every other photography note in this garden, from [[notes/photography/metering-and-sunny-16|Sunny 16]] to [[notes/photography/push-and-pull-processing|pushing]], is built on it.

![[pictures/topics/photography/exposure-triangle.png]]

<p class="image-caption">Hole size, open time and film sensitivity together decide how bright the picture is. Image: WClarke and Samsara, CC BY-SA 4.0, via <a href="https://commons.wikimedia.org/wiki/File:Exposure_triangle_-_aperture,_shutter_speed_and_ISO.svg">Wikimedia Commons</a>.</p>

## Mental Model

- Light is counted in stops. One stop is a doubling or halving of the light, whichever setting you change.
- Aperture sets the amount of light and the depth of field. Shutter speed sets the amount of light and the motion blur. Film speed sets the amount of light you need.
- Many combinations give the same total exposure. You choose among them for the look you want.
- A roll of film has one speed. Changing it mid-roll is possible only by lying to your meter and accepting the consequences.

## 1. Aperture and F-Stops

The f-number is the focal length divided by the diameter of the opening: $N = f / D$. A 50 mm lens with a 25 mm opening is at f/2. The light collected scales with the opening's area, which goes with $D^2$, so $N$ must grow by $\sqrt{2}$ to halve the light. That gives the familiar full-stop sequence:

$$1,\ 1.4,\ 2,\ 2.8,\ 4,\ 5.6,\ 8,\ 11,\ 16,\ 22$$

These are rounded powers of $\sqrt{2}$ ($1.41$, $2$, $2.83$, $4$, $5.66$, $8$, $11.3$, $16$, $22.6$). Going from f/4 to f/5.6 halves the light. Going from f/4 to f/2.8 doubles it. A small number means a wide opening.

Aperture also controls depth of field, the range of distances that look acceptably sharp. A wide opening gives a shallow range, a small one gives a deep range. Focal length and subject distance matter as well. For a given format, the hyperfocal distance is

$$H = \frac{f^2}{N\,c} + f$$

where $c$ is the circle of confusion, conventionally about 0.03 mm for 35mm film. The value of $c$ is a convention about what counts as sharp in a normal-size print, so treat all depth-of-field figures as approximate.

> [!example] Worked example
> A 50 mm lens focused at 5 m with $c = 0.03$ mm. At f/2, $H \approx 41.7$ m and the sharp zone runs from about 4.5 m to 5.7 m. At f/8, $H \approx 10.5$ m and it runs from about 3.4 m to 9.5 m. Closing down by two stops made the sharp zone about five times deeper. (These numbers come from running the snippet below.)

## 2. Shutter Speed

Shutter speed is the exposure time $t$ in seconds, written as a fraction on the dial: 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, and so on. Each step is about a factor of two (the real values are rounded, 1/60 stands for 1/64, for example). Halving the time halves the light.

Two things limit how slow you can go. The first is camera shake. The classic rule of thumb is to use a speed of at least $1/f$ seconds for a lens of focal length $f$ mm: 1/50 or faster for a 50 mm, 1/125 for an 85 mm. It is a guideline for sharp enlargements, and steady hands or a tripod move it. The second is subject motion. A walking person is usually frozen around 1/125. A moving car or a splashing fountain needs 1/500 or more, and slower speeds give the streaks and blurred water you see in the night frames on the [[film|Film]] page.

For exposures longer than about a second, film loses sensitivity (reciprocity failure). The correction depends on the stock, so look it up in the manufacturer's datasheet instead of trusting a general number.

## 3. Film Speed

The ISO number (the "box speed") says how much light the emulsion needs. ISO 400 needs half the light of ISO 200 and a quarter of ISO 100, so doubling the number is one stop. Faster film usually shows more grain, which is covered in [[notes/photography/film-stocks|Film Stocks]].

The difference to digital is that the speed belongs to the roll. You cannot switch from ISO 100 to ISO 800 between frames. Faster speeds mean shorter shutter times or smaller apertures in the same light, so choosing a roll is choosing the range of conditions you will shoot in. You can still rate the film at a different number than the box says, as long as you process for it, and that is the subject of [[notes/photography/push-and-pull-processing|Push and Pull Processing]].

## 4. Stops as Doublings, and Exposure Value

Because everything is a power of two, exposure is naturally measured in $\log_2$. The exposure value for an aperture $N$ and time $t$, defined at ISO 100, is

$$EV = \log_2\!\left(\frac{N^2}{t}\right)$$

One EV step is one stop. Higher EV means brighter light (or less exposure given). A setting pair that has the same EV gives the same exposure. For a different film speed $S$, the EV you need to meter is shifted by $\log_2(S/100)$.

| Aperture | Shutter | EV at ISO 100 | Typical light           |
| -------- | ------- | ------------- | ----------------------- |
| f/16     | 1/125   | 15.0          | Sunny, distinct shadows |
| f/11     | 1/125   | 13.9          | Slight overcast         |
| f/8      | 1/125   | 13.0          | Overcast                |
| f/5.6    | 1/125   | 11.9          | Heavy overcast          |
| f/4      | 1/125   | 11.0          | Open shade              |
| f/2      | 1/60    | 7.9           | Dim interior            |

The values drift by about 0.1 because the dial speeds and f-numbers are rounded (f/11 at 1/125 is 13.9, not 14). The weather labels are the Sunny 16 conventions, covered in [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]].

## 5. Equivalent Exposures

A single EV can be reached many ways. Take EV 13 at ISO 100. All of these give the same exposure:

| Aperture | Shutter | What changes                  |
| -------- | ------- | ----------------------------- |
| f/2.8    | 1/1000  | Shallow focus, frozen motion  |
| f/4      | 1/500   |                               |
| f/5.6    | 1/250   |                               |
| f/8      | 1/125   | Moderate depth, hand-holdable |
| f/11     | 1/60    |                               |
| f/16     | 1/30    | Deep focus, some blur risk    |

Moving one row down closes the aperture one stop and doubles the time, so the product is unchanged. Changing film speed adds a third axis: if you load ISO 400 instead of ISO 100, the same scene is two stops brighter relative to the film's needs, so f/8 at 1/125 becomes f/8 at 1/500 or f/16 at 1/125. The film needs two stops less light, and you can spend that saving on aperture or time.

> [!warning] Common mistake
> Stop numbers count in different directions for the three settings. A larger f-number lets in less light, a larger shutter denominator (1/500 vs 1/250) lets in less light, but a larger ISO number needs less light. When you think "one stop more exposure", write down what each dial does before turning it.

## 6. Checking the Numbers

This small script reproduces the EV table values and the depth-of-field example above.

```python
import math

def ev(N, t, iso=100):
    return math.log2(N * N / t) - math.log2(iso / 100)

def dof(f, N, s, c=0.03):  # all lengths in mm
    H = f * f / (N * c) + f
    near = s * (H - f) / (H + s - 2 * f)
    far = s * (H - f) / (H - s) if s < H else math.inf
    return H, near, far

print(round(ev(16, 1/125), 2), round(ev(11, 1/125), 2))     # 14.97 13.88
print(round(ev(16, 1/400, iso=400), 2))                      # 14.64
for N in (2, 8):
    H, n, f_ = dof(50, N, 5000)
    print(N, round(H / 1000, 1), round(n / 1000, 1), round(f_ / 1000, 1))
```

## Related

- [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]]: turning a scene into an EV without a meter
- [[notes/photography/film-stocks|Film Stocks]]: how film speed relates to grain and latitude
- [[notes/photography/push-and-pull-processing|Push and Pull Processing]]: changing the speed of a roll on purpose
- [[notes/photography/35mm-cameras-and-lenses|35mm Cameras and Lenses]]: focal length and the reciprocal rule
- [[notes/graphics/color-spaces-and-gamma|Color Spaces and Gamma]]: why stops are logarithmic and screens are not
- [[film|Film]]: frames shot at these settings
