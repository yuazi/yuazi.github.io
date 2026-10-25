---
title: Zsh, Oh My Zsh, and Powerlevel10k
tags:
  - cli
  - tools
  - productivity
  - terminal
  - zsh
date: 2025-03-23
---

My shell setup: Zsh, Oh My Zsh to manage plugins, and Powerlevel10k for a fast prompt that shows Git status and more at a glance.

## Components

### Zsh

Zsh is the default shell on macOS. It works as an interactive shell and as a scripting language.

### Oh My Zsh (OMZ)

[Oh My Zsh](https://ohmyz.sh/) is a community-driven framework for managing Zsh configuration. It bundles a large set of plugins, helper functions and themes.

### Powerlevel10k (P10k)

[Powerlevel10k](https://github.com/romkatv/powerlevel10k) is a Zsh theme built for speed. Its setup wizard configures the prompt for you.

---

## My Configuration

Most of the configuration lives in `~/.zshrc`.

### Instant Prompt

Powerlevel10k's instant prompt draws the prompt before the plugins finish loading, so the shell feels ready immediately. This block must stay at the top of your `.zshrc`:

```zsh
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
```

### Plugins

I use a mix of standard OMZ plugins and external tools:

```zsh
plugins=(git web-search sudo zoxide)
```

- **git**: Adds aliases and status info for Git.
- **web-search**: Search the web from the CLI (e.g., `google how to...`).
- **sudo**: Press `Esc` twice to add `sudo` to the previous command.
- **zoxide**: A smarter `cd` command.

### Essential Add-ons

These come from outside Oh My Zsh, and the order matters. zsh-completions has to be on `fpath` before `compinit` runs. zsh-syntax-highlighting has to be sourced last, after anything else that defines widgets, or it won't highlight them.

- **zsh-completions**: Adds thousands of extra completion rules.
- **zsh-autosuggestions**: Suggests commands as you type based on history.
- **zsh-syntax-highlighting**: Highlights valid/invalid commands in real-time.

---

## Key Shortcuts & Features

| Feature         | Key / Command    | Action                                                                                           |
| :-------------- | :--------------- | :----------------------------------------------------------------------------------------------- |
| **P10k Config** | `p10k configure` | Re-run the visual setup wizard                                                                   |
| **Autosuggest** | `Right Arrow`    | Accept the grey "ghost" suggestion                                                               |
| **Syntax**      | (Real-time)      | <span style="color:green">Green</span> for valid, <span style="color:red">Red</span> for invalid |
| **Sudo**        | `Esc` `Esc`      | Prepends `sudo` to the current line                                                              |

---

[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
