---
title: "Push and Pull Processing"
tags:
  - photography
  - film
  - processing
date: 2026-11-05
---

Pushing and pulling change the effective speed of a roll after the fact. You set your meter to a different number than the box says, then ask for development that compensates. Pushing buys you speed in dim light at the cost of contrast and grain. Pulling does the opposite, which tames a high-contrast scene. Both only work cleanly when the whole roll is shot at the same rating, which is the main thing to plan around.

## Mental Model

- Push means rating the film faster than its box speed (underexposing on purpose) and developing longer. Pull means rating it slower and developing shorter.
- The extra development time rescues the mid-tones and highlights. Shadow detail that was never exposed does not come back.
- Pushing raises contrast and grain. Pulling lowers contrast.
- The whole roll gets one development, so every frame needs the same rating.
- Black-and-white pushes most predictably. Color negative and slide push less predictably and may shift color.

## 1. What Happens in the Emulsion

Film records light as a latent image on silver halide crystals. Development converts the exposed crystals to metallic silver, and the longer the developer works, the more density builds up. Dense areas (bright scene parts) build faster than thin ones, so extra development time raises the highlights much more than the shadows. That is a contrast increase.

When you underexpose a roll by two stops, say ISO 400 film shot at EI 1600 (exposure index, the number you set on the meter), the shadows receive a quarter of the light they needed. Normal development would give a thin, dark negative. Pushing by two stops lengthens development to bring mid-tones and highlights up to a printable density. The deepest shadows, which got too little light to form a latent image at all, stay empty. So a push does not make the film more sensitive. It lets you use the exposures you already made.

Pulling is the reverse. You give extra exposure (ISO 400 film shot at EI 200) and shorten development to keep highlights from getting too dense. The result has lower contrast, a longer apparent tonal range, and slightly finer grain. It suits a bright, contrasty day when you want to hold detail in the sky and the shadows together.

## 2. The Arithmetic of Stops

Pushing by $n$ stops raises the rated speed by $2^n$:

$$\text{EI} = \text{ISO}_{\text{box}} \times 2^{n}$$

| Film    | Push | Rate at | Pull | Rate at |
| ------- | ---- | ------- | ---- | ------- |
| ISO 400 | +1   | EI 800  | -1   | EI 200  |
| ISO 400 | +2   | EI 1600 | -2   | EI 100  |
| ISO 400 | +3   | EI 3200 |      |         |
| ISO 100 | +2   | EI 400  | -1   | EI 50   |

What does pushing buy you in practice? Take a hallway where ISO 400 film needs f/2 at 1/15. At EI 1600, the same scene needs f/2 at 1/60, which is the difference between a blurry frame and a sharp one. In shutter terms, each push stop doubles the speed. The EV bookkeeping from [[notes/photography/exposure-triangle|The Exposure Triangle on Film]] still holds: you are setting your meter to a higher ISO and metering as usual.

## 3. Effects on the Image

Pushing generally does four things.

1. Contrast rises, since the highlights gain density more than the shadows.
2. Grain gets more obvious, partly from the extra development and partly because the underexposed areas rely on a sparse latent image.
3. Shadow detail is thinner than the same scene shot at box speed, because the shadows were underexposed and development cannot add information.
4. Color negative and slide may shift color and show a cross-over between layers, since the three dye layers do not respond identically to extended development.

Pulling gives lower contrast, finer grain and a smoother tonal scale. It can look flat and muted, and color films may shift slightly.

> [!warning] Common mistake
> Pushing is not a fix for badly underexposed film. If you shoot a normal roll at box speed in dim light and then ask for a push, the lab cannot recover shadow detail that was never recorded. The push must be a plan made before the roll is shot.

## 4. Which Stocks Push Well

Black-and-white films that were designed with a flexible response are the classic choice. Ilford HP5 Plus 400 and Kodak Tri-X 400 are the standard examples: both are commonly shot at EI 800, 1600 and 3200 and processed with extended times, and the results are widely documented. Their look at those speeds is a deliberate grainy, contrasty one that many photographers like. Finer-grained tabular films, such as Kodak T-Max 400, can also be pushed, though the character differs.

Color negative stocks can be pushed one or two stops, and many labs offer it, but the result depends on the stock, with the usual effects of higher contrast and color shift. Kodak's Portra 800 is built as a faster film and is a natural choice when you want speed. Slide film can be pushed by changing the first developer time in E-6, which shifts exposure and also color, so slide pushing is a more specialized request. For a table of stocks see [[notes/photography/film-stocks|Film Stocks]].

Not every film responds well. Low-speed films (ISO 50 to 100) are poor candidates, because the grain and contrast increase is large for a modest gain in speed.

## 5. Rating a Whole Roll Consistently

A roll gets one development, so one EI for the whole roll. There are two ways to handle this.

For a planned push, load the roll, set the camera meter or your Sunny 16 estimate to the pushed EI, and shoot the entire roll at it. A bit of tape on the camera or a note on the cassette helps you remember. This is straightforward with a meter that has an ISO dial. If your camera sets the ISO from the cassette's DX code (common on newer SLRs and point-and-shoots), you may need to override it with the exposure compensation dial. At EI 1600 on ISO 400 film, set the compensation to -2. Check the camera manual for how the override works.

A roll with mixed ratings has no good fix, because the lab or tank gives it one development. If you did shoot some frames at the wrong rating, tell the lab the rating most frames need and accept the others as they come.

## 6. Telling the Lab, or Doing It at Home

Tell the lab explicitly and put it on the order form: the film name, the box speed, the rating you shot at, and the number of stops to push or pull. For example, "Tri-X 400, shot at 1600, push 2 stops." A lab that does not offer pushing will say so, and it is better to know in advance. Pushed color negative may cost extra and take longer, since the roll is run separately.

At home with black-and-white film, you look up a development time for the chosen developer, film and EI in a chart (see [[notes/photography/developing-black-and-white|Developing Black-and-White Film]]). The chart gives a longer time per push stop. As a rough pattern, each stop adds on the order of a quarter to a half of the normal development time, but the actual figures vary with the developer, and the chart is the reference. Pushed development is more sensitive to temperature and agitation, so keep both consistent.

## Related

- [[notes/photography/exposure-triangle|The Exposure Triangle on Film]]: why film speed is fixed per roll
- [[notes/photography/film-stocks|Film Stocks]]: grain and latitude of the stocks mentioned here
- [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]]: setting the meter to an EI
- [[notes/photography/developing-black-and-white|Developing Black-and-White Film]]: time and temperature for a push
- [[notes/photography/c41-color-developing|C-41 Color Developing]]: pushing at home in color, with its limits
- [[film|Film]]: frames from rolls shot in different light
