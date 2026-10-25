---
title: Ghostty, a Terminal Emulator
tags:
  - cli
  - tools
  - terminal
date: 2026-03-02
---

[Ghostty](https://ghostty.org/) is a native terminal emulator written in Zig, with GPU rendering and platform-native UI. It works well with almost no configuration.

## Installation

On macOS, download the app from [ghostty.org](https://ghostty.org/) or install via Homebrew:

```sh
brew install --cask ghostty
```

## Configuration

Ghostty reads a plain text config file at:

```text
~/.config/ghostty/config
```

Example configuration:

```ini
font-family = "JetBrains Mono"
font-size = 14
theme = catppuccin-mocha
window-padding-x = 8
window-padding-y = 8
```

## Key Features

- GPU rendering through Metal on macOS and OpenGL on Linux
- Native window decorations, menus and tabs on each platform
- Built-in split panes
- Font ligatures, true color and undercurl
- Shell integration: prompt marking, cursor shape and working-directory tracking

## Splits & Tabs

| Action             | Keybind (macOS)    |
| ------------------ | ------------------ |
| New window         | `Cmd+N`            |
| New tab            | `Cmd+T`            |
| Close surface      | `Cmd+W`            |
| Previous tab       | `Cmd+Shift+[`      |
| Next tab           | `Cmd+Shift+]`      |
| Split right        | `Cmd+D`            |
| Split down         | `Cmd+Shift+D`      |
| Focus split left   | `Cmd+Option+Left`  |
| Focus split right  | `Cmd+Option+Right` |
| Focus split up     | `Cmd+Option+Up`    |
| Focus split down   | `Cmd+Option+Down`  |
| Increase font size | `Cmd++`            |
| Decrease font size | `Cmd+-`            |
| Reset font size    | `Cmd+0`            |

## Themes

Ghostty ships with many built-in themes. List them with:

```sh
ghostty +list-themes
```

Set a theme in config:

```ini
theme = nord
```

## Shell Integration

Ghostty integrates with bash, zsh and fish automatically. It tracks the current working directory, marks prompt zones and reports exit codes, and the supported shells need no manual setup.

---

[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
