---
title: Modern CLI Tools (eza, bat, fzf, thefuck)
tags:
  - cli
  - tools
  - productivity
  - terminal
date: 2025-03-23
---

The command-line tools I use in place of `ls` and `cat`, plus fuzzy history search and a fixer for mistyped commands.

## Tools Overview

### [eza](https://github.com/eza-community/eza)

A replacement for `ls`, written in Rust, with better defaults.

- **Key Features**: Icons, colors by file type, git integration, and tree view.
- **Aliased as**: `ls`, `ll`, `la`, `lla`, `lt`.

### [bat](https://github.com/sharkdp/bat)

A `cat` clone with syntax highlighting and Git integration.

- **Key Features**: Syntax highlighting for most languages, line numbers, and automatic paging for long files.
- **Aliased as**: `cat`.

### [fzf](https://github.com/junegunn/fzf)

A general-purpose command-line fuzzy finder.

- **Key Features**: Filters command history, files or any list as you type.
- **Shortcuts**: `Ctrl + R` for history search, `Ctrl + T` for file search.

### [thefuck](https://github.com/nvbn/thefuck)

Corrects your previous console command.

- **Key Features**: Corrects typos, missing `sudo`, and other common CLI mistakes.
- **Usage**: Type `fuck` after a failed command.

---

## Configuration in `.zshrc`

The aliases and hooks in my `.zshrc`:

```zsh
# eza in place of ls; ll/la/lla expand through the ls alias, so the flags live in one place
alias ls='eza --icons --group-directories-first'
alias ll='ls -l'
alias la='ls -a'
alias lla='ls -la'
alias lt='eza --tree --icons'

alias cat='bat'

eval "$(thefuck --alias)"

# fzf 0.48+ generates its own zsh key bindings and completion
source <(fzf --zsh)
```

---

## Shortcuts Summary

| Tool        | Shortcut / Alias | Action                               |
| :---------- | :--------------- | :----------------------------------- |
| **eza**     | `lt`             | Show the current directory as a tree |
| **fzf**     | `Ctrl + R`       | Fuzzy-search your command history    |
| **fzf**     | `Ctrl + T`       | Find any file and paste its path     |
| **thefuck** | `fuck`           | Fix the last misspelled command      |
| **bat**     | `cat <file>`     | View a file with syntax highlighting |

---

[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
