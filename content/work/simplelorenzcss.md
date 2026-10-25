---
title: "Ambient Chaos"
tags:
  - work
  - projects
  - archive
  - quartz
  - visual
  - chaos
date: 2026-03-11
github: https://github.com/yuazi/simpleLorenzcss
---

[View on GitHub](https://github.com/yuazi/simpleLorenzcss)

Most digital gardens have a flat color or a gradient behind the text. I wanted mine to show my interest in chaotic systems, so I built **simpleLorenzcss**, a canvas background for Quartz v4. It runs a live Lorenz attractor in the center and two Halvorsen attractors at the edges, and it has a settings panel and light and dark palettes.

---

## How It Works

Nothing is pre-rendered. Every frame, the script steps each particle forward by a small `dt` and projects the 3D positions to 2D with a slow rotation. It then draws a fading trail on a `<canvas>` fixed behind the page with `pointer-events: none`, so the background never blocks a click.

The core of the Lorenz update in TypeScript:

```typescript
const dt = 0.005
const sigma = 10,
  rho = 28,
  beta = 8 / 3

// All three derivatives read the old x, y, z before any of them change
const dx = sigma * (y - x) * dt
const dy = (x * (rho - z) - y) * dt
const dz = (x * y - beta * z) * dt

x += dx
y += dy
z += dz
```

### 1. Three Attractors

The Lorenz attractor stays centered as the focal point, and the two Halvorsen attractors fill the left and right edges.

### 2. Settings and Focus Mode

A gear button in the bottom-right corner opens a panel for sigma, rho, beta, speed, trail length and particle count. Changes are saved to `localStorage`, so they survive a reload. Focus mode, toggled from the panel or with `Escape`, fades out the header, sidebars and article and leaves only the animation.

### 3. Quartz Integration

The script hooks into Quartz's single-page routing, so the animation keeps running across page transitions instead of restarting. It reads the saved theme to switch between the light and dark palettes.

---

## Project Structure

- `LorenzBackground.tsx`: the Quartz component that adds the script and styles to the layout.
- `lorenz.inline.ts`: the canvas, the attractor math and the settings UI.
- `lorenz.css`: styles for the canvas, the settings panel and focus mode.

---

## Getting Started

The repo is archived because it's finished: a standalone copy of this site's background for other Quartz v4 gardens. The README covers copying the three files in and registering the component.

```bash
git clone https://github.com/yuazi/simpleLorenzcss
```

---

[[notes/random/lorenz-attractor|The Lorenz Attractor]] | [[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
