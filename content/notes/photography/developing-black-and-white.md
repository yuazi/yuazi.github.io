---
title: "Developing Black-and-White Film"
tags:
  - photography
  - film
  - processing
date: 2026-11-05
---

Black-and-white film is the easiest film to develop at home. The process is a chain of liquids at room temperature, a light-tight tank, and about thirty minutes of work, with no darkroom needed after the film is on the reel. Developing it yourself gives you control over contrast and speed (see [[notes/photography/push-and-pull-processing|Push and Pull Processing]]), and the roll is in your hands the same day. The risks are practical: a badly loaded reel or a temperature mistake ruins a roll that cannot be reshot, so it pays to practice the loading step first.

## Mental Model

- Developer turns exposed silver halide into metallic silver. Stop bath halts it. Fixer removes the unexposed halide. Wash removes the chemicals.
- Development is a rate process: time, temperature, dilution and agitation together set the contrast of the negative.
- Only the first step, loading the film onto the reel, needs total darkness. After the tank lid is on you can turn the lights on.
- Charts give starting times, not guarantees. You calibrate against your own results.
- Fixer holds dissolved silver and is not a household waste product.

## 1. Equipment

For a first roll you need:

- A developing tank with one or more reels. Plastic reels (Paterson style) load by ratcheting the film in. Stainless steel reels load by spiralling the film into a wire track and are reusable but less forgiving for beginners.
- A changing bag (a light-tight bag with sleeved openings) for loading the reel without a darkroom.
- A bottle opener or special cassette opener to pop the end of a 35mm cassette, and scissors.
- A thermometer, measuring cylinders, a timer, film clips for hanging, and clean bottles.
- Chemicals: developer, stop bath (or plain water), fixer, and a wetting agent.

The tank size decides how much liquid you need. A single-reel tank holds on the order of 300 ml, so the examples below use 300 ml.

## 2. Loading the Reel

Do the first practice loading in daylight with a sacrificial roll, then with your eyes closed, then in the bag. The steps are:

1. Put the cassette, the opened cassette tool, scissors, the reel and the tank body in the changing bag and close it.
2. Open the cassette, take out the spool, and cut the leader flat just behind the tongue.
3. Feed the film onto the reel. On a plastic ratchet reel, slide the end into the entry slot and twist the two halves back and forth to draw the film in. On a stainless reel, clip the end to the spring at the center and wind the film outward into the spiral.
4. Cut the film from the spool, place the reel in the tank and put the lid on tight.

If the film touches itself in the spiral the developer cannot reach the touching area, which leaves a pale, undeveloped patch. Check that the reel is clean and dry, and never load a wet reel.

## 3. The Steps

1. Pre-wash (optional, with water at the same temperature) to wet the film evenly.
2. Developer for the chart time, with agitation (below).
3. Stop bath for about a minute, or a water rinse. Stop bath is acidic and halts development sharply. Water works but is less precise.
4. Fixer for the time on the bottle. A common rule is twice the time it takes an unexposed scrap to turn clear, but follow the manufacturer's datasheet.
5. Wash with water. Ilford's method is to fill the tank and invert it 5 times, drain, refill and invert 10 times, drain, then refill and invert 20 times, using water at the same temperature as the other chemicals.
6. Wetting agent (such as Photo-Flo or Ilfotol) diluted according to its label, for a short bath, to reduce water spots.
7. Hang the film to dry in a dust-free place. Do not wipe it with a squeegee, which can scratch the emulsion.

## 4. Time, Temperature and Agitation

Chemical reactions run faster in warmer solutions, so the same developer at 24 °C acts faster than at 20 °C. Published times assume a reference temperature, usually 20 °C (68 °F). If your room is at a different temperature, use a time-temperature compensation chart (many development charts include one) or warm the solutions in a water bath. Whatever you do, keep developer, stop and fixer within about a degree of each other, since large jumps have traditionally been blamed for crinkled emulsion (reticulation).

Agitation brings fresh developer to the film surface. A common pattern is continuous inversion for the first 30 seconds, then a few inversions every minute: about 10 seconds of agitation at the start of each minute. Less agitation gives lower contrast and uneven development risks. More agitation raises contrast and can leave streaks, especially at the sprocket holes. Pick one scheme and stick to it, because a change in agitation changes the negative as much as a change in time.

## 5. Dilutions and Volumes

Developers are sold as concentrates and diluted to a ratio. A "1+50" dilution means one part concentrate to 50 parts water, for a total of 51 parts. Rodinal at 1+50 and HC-110 in dilution B (1+31, from the syrup) are two examples you will see on charts.

```python
def parts(total_ml, concentrate, water):
    c = total_ml * concentrate / (concentrate + water)
    return round(c, 1), round(total_ml - c, 1)

print(parts(300, 1, 50))  # Rodinal 1+50  -> (5.9, 294.1)
print(parts(300, 1, 31))  # HC-110 dil. B -> (9.4, 290.6)
```

Running this gives 5.9 ml of Rodinal in 294.1 ml of water, and 9.4 ml of HC-110 syrup in 290.6 ml of water, for a 300 ml tank. Measure the concentrate with a syringe, because a small error in a tiny volume is a large percent error. A high dilution also means a small amount of active developer, so check the developer's datasheet for a minimum quantity of concentrate per roll.

Developers differ in character. Rodinal is a concentrate with a long shelf life and a sharp, grainy look. HC-110 is a thick syrup that dilutes into several stock strengths and is easy to keep. The choice affects grain and contrast, not the procedure.

## 6. Development Charts

You do not need to invent times. The Massive Dev Chart (digitaltruth.com) is a large community database of times by film, developer, dilution, temperature and speed. Manufacturers also publish datasheets for their own films, such as Ilford's. Treat any chart as a starting point:

- Check the temperature and agitation the time assumes.
- Compare more than one source if you can.
- Write down what you did on your first roll, look at the negatives, and adjust. Thin, pale negatives with weak highlights call for a longer time. Very dense, contrasty negatives call for shorter.

The chart also holds the push and pull times for a chosen EI.

## 7. Safety and Disposal

Wear nitrile gloves and eye protection, and keep the room ventilated. Developers can irritate skin. Stop bath is an acid, and fixer smells sharp.

Used fixer contains dissolved silver from the film, which is toxic to aquatic life, so it should not go down the drain in quantities. Many places require it to be collected as hazardous waste. In Germany this usually means taking it to a municipal hazardous waste collection point, but the rules vary by city, so check locally. Photo chemicals from hobby use are small in volume, and keeping the used fixer in a labelled bottle until you have a collection point lined up is common practice. Silver recovery methods exist for people who process more.

Developer can usually be diluted and disposed of according to local rules, but check, because some developers contain compounds with their own restrictions. Store chemicals in labelled bottles away from food and children.

## Related

- [[notes/photography/push-and-pull-processing|Push and Pull Processing]]: extended and shortened development
- [[notes/photography/c41-color-developing|C-41 Color Developing]]: the color counterpart, with tighter temperature control
- [[notes/photography/film-stocks|Film Stocks]]: which B&W films are common
- [[notes/photography/scanning-film|Scanning Film]]: the step after drying
- [[notes/photography/metering-and-sunny-16|Metering and Sunny 16]]: exposure choices that decide how the negative looks
- [[film|Film]]: finished frames
