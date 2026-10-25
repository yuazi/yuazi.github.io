---
title: Homebrew, the macOS Package Manager
tags:
  - cli
  - tools
  - macos
date: 2026-03-27
---

[Homebrew](https://brew.sh/) is the package manager macOS doesn't ship with (it runs on Linux too). It installs command-line tools and, through casks, regular apps.

## Installation

Install it from the terminal:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then put it on your `PATH`. On Apple silicon, Homebrew lives in `/opt/homebrew`, and the line belongs in `~/.zprofile`, which runs once per login shell instead of in every new shell:

```sh
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Basic Usage

| Action              | Command                     |
| ------------------- | --------------------------- |
| Install a package   | `brew install <formula>`    |
| Install a GUI app   | `brew install --cask <app>` |
| Update Homebrew     | `brew update`               |
| Upgrade packages    | `brew upgrade`              |
| Search for packages | `brew search <query>`       |
| List installed      | `brew list`                 |
| Uninstall           | `brew uninstall <name>`     |
| Health check        | `brew doctor`               |

## Brewfile (Infrastructure as Code)

A `Brewfile` lists everything you install, so a new Mac can be set up with one command. Export your current setup with:

```sh
brew bundle dump
```

To install everything from an existing `Brewfile`:

```sh
brew bundle
```

### Example Brewfile

```ruby
# Core Utilities
brew "git"
brew "gh"
brew "node"
brew "python"
brew "ripgrep"
brew "fd"
brew "fzf"
brew "bat"
brew "eza"
brew "zoxide"
brew "starship"

# Development Tools
brew "neovim"
brew "tmux"

# Desktop Applications (Casks)
cask "ghostty"
cask "visual-studio-code"
cask "sioyek"
cask "raycast"
cask "discord"
cask "spotify"
```

## Maintenance

Remove old versions of installed formulae and clear the download cache:

```sh
brew cleanup
```

`brew doctor` from the table above reports anything misconfigured.

---

[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
