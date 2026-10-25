---
title: "LumaDisplay: Display Control for macOS"
description: "Native macOS app for resolution, brightness, warmth and presets, with Metal HDR brightness above 100% and automatic rollback of display changes."
tags:
  - tools
  - swift
  - macos
  - hdr
date: 2026-10-21
github: https://github.com/yuazi/LumaDisplay
---

![[pictures/work/lumadisplay/lumadisplay-icon.png|112]]

[View on GitHub](https://github.com/yuazi/LumaDisplay) · [Download the v1.1.1 preview](https://github.com/yuazi/LumaDisplay/releases/tag/v1.1.1)

**LumaDisplay** is a native macOS app for controlling displays from a dashboard or the menu bar. It changes resolution and refresh rate, brightness and warmth, saves the whole setup as a preset, and can push brightness past 100% on displays with HDR headroom. It has no analytics, network access, account, or background service, and no external Swift packages.

---

## What It Demonstrates

- A native SwiftUI dashboard and `MenuBarExtra`, with AppKit panels for the visual effects.
- Rendering with extended dynamic range (EDR) through Metal.
- Display configuration through CoreGraphics, with a timed preview and automatic rollback.
- Optional private frameworks loaded at runtime with `dlopen`, so the app still works when an API is missing.
- Changes treated as transactions: snapshot first, apply, and restore on failure, sleep, quit, or after a crash.
- A testable core module covered by 14 XCTest tests.

---

## Features

- Lists connected displays with resolution, refresh rate, pixel size and HiDPI information.
- Switches between the modes macOS offers, with a 15-second preview before the change sticks.
- Hardware brightness on supported displays, plus software dimming down to 20%.
- Warmth adjustable per display.
- One brightness slider that goes up to 200% on supported displays.
- Presets for resolution, brightness, dimming and warmth across all connected displays, matched by display UUID.

---

## Brightness Above 100%

macOS keeps some brightness in reserve on HDR-capable displays for HDR highlights. LumaDisplay has two ways of using that headroom for the whole desktop.

### HDR Overlay

A click-through, full-screen panel holds a Metal layer that asks for extended dynamic range (`rgba16Float` with `wantsExtendedDynamicRangeContent`). It amplifies the desktop within the EDR headroom macOS reports for that screen, and the gain adapts as the headroom changes. While it runs, supported hardware brightness goes to its normal maximum. Turning the overlay off puts it back where it was, unless you changed it somewhere else in the meantime. This rendering technique is adapted from [BrightIntosh](https://github.com/niklasr22/BrightIntosh).

### Direct XDR

On supported built-in Apple displays, Direct XDR changes the display's own brightness properties instead of drawing an overlay. It temporarily selects the XDR preset and pauses automatic brightness. The requested level is capped at the lower of two limits: the panel's original physical ceiling and twice its normal brightness cap. Before changing anything it saves a recovery record, so disabling it, sleeping, quitting, or relaunching after a crash all restore the original settings.

Both methods start off and switch off when the app quits or the display sleeps. The percentages describe software gain or a requested driver target, not measured nits.

---

## Preview and Rollback

A new display mode starts as a 15-second preview. The preview is applied with `.forAppOnly` scope, which means macOS reverts it by itself if the app exits. Only after you choose **Keep changes** is the mode applied again for the whole login session. If nobody confirms, the timer rolls it back.

Brightness changes work the same way and take a snapshot before they apply anything. A failed restore keeps its recovery record and blocks a normal quit until it succeeds. **⌘⇧0** stops upscaling and removes every overlay at once.

---

## Overlays in Full-Screen Apps

Dimming, warmth and the HDR overlay are borderless panels that never take focus and let clicks pass through. They join every Space and follow apps into full screen. Version 1.0.1 fixed a bug where the HDR boost vanished as soon as Netflix in Comet went full screen, and only returned after leaving it.

---

## Architecture

The Swift package has two targets. `DisplayCore` holds the plain-Swift logic: the mode-preview timer, reversible changes, preset storage, and the gain and brightness-unit math. Because it doesn't touch the display, it can be unit-tested. The 14 tests cover mode rollback, HDR limits, direct brightness units, partial-write recovery, checkpoint failures, and preset persistence.

The `LumaDisplay` target is the app itself: the SwiftUI views, the AppKit overlay panels, the Metal surfaces, CoreGraphics display configuration, and the private DisplayServices and SkyLight calls. Together the two targets come to about 2,000 lines of Swift.

---

## Limits

LumaDisplay is still a preview, so far tested on an M1 Pro Mac with a built-in Retina display. External monitors and display hot-plugging haven't been tested yet. The download is an Apple silicon build for macOS 13 or later, ad-hoc signed and not notarized, so macOS may refuse to open it; building from source gets around that. This release doesn't implement DDC/CI, virtual displays, custom modes, rotation or mirroring.

---

## Getting Started

```sh
git clone https://github.com/yuazi/LumaDisplay.git
cd LumaDisplay
./Scripts/build-app.sh
./Scripts/install-app.sh
open /Applications/LumaDisplay.app
```

It needs Xcode or the Command Line Tools with Swift 5.9 or later. Run `swift test` for the test suite, or start the built binary with `--diagnose` to print what it sees on your displays.

LumaDisplay is licensed under the GNU GPL v3.

---

[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
