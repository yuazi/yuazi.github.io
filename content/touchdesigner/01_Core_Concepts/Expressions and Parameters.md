---
title: "Expressions and Parameters"
tags:
  - touchdesigner
  - td/core
  - expressions
  - scripting
date: 2026-02-06
---

Every parameter in TouchDesigner has **four modes**, switchable by clicking the small mode indicator to the left of the parameter field:

| Mode           | Colour | Description                                                          |
| -------------- | ------ | -------------------------------------------------------------------- |
| **Constant**   | Grey   | A plain, unchanging value you type in.                               |
| **Expression** | Blue   | A Python expression evaluated every cook.                            |
| **Export**     | Green  | A CHOP export drives this value externally. Think _green for CHOPs_. |
| **Bind**       | Purple | Two-way sync with another parameter.                                 |

Right-click any parameter → **Set to Expression** (or press `=` in the field) to enter expression mode.

---

## Time References

The time variables you'll use most in expressions:

| Expression        | Returns                                            |
| ----------------- | -------------------------------------------------- |
| `absTime.seconds` | Seconds elapsed since the application started      |
| `absTime.frame`   | Absolute frame count since the application started |
| `me.time.seconds` | Seconds within the local component's timeline      |
| `me.time.frame`   | Frame within the local timeline                    |
| `me.time.rate`    | The cook rate (FPS) of the local timeline          |

**Example:** Make a node's X-translate oscillate at 0.5 Hz:

```python
math.sin(absTime.seconds * math.pi) * 5
```

---

## Referencing Other Operators

```python
# Get a CHOP channel value
op('lfo1')['chan1']

# Get a CHOP channel by index
op('noise1')[0]

# Get a DAT cell
op('table1')[1, 2]        # row 1, column 2
op('table1')['Name', 1]  # row with label 'Name', column 1

# Get another node's parameter value (evaluated, so expressions resolve)
op('geo1').par.tx.eval()

# Names resolve relative to the current network, so a sibling is just its name
op('sibling')[0]
```

---

## The `me` Object

`me` always refers to the **operator the script is running inside**. Code that uses it keeps working wherever you copy the node, which hardcoded paths don't.

```python
me.parent()          # The parent COMP
me.parent().par.w    # A parameter of the parent
me.inputs[0]         # First connected input
me.outputs           # List of all connected outputs
me.digits            # The trailing number in a node's name (e.g. 3 in 'lfo3')
me.name              # Node name as a string
me.path              # Full path e.g. /project1/base1/lfo1
```

---

## The `parent()` Shortcut

Instead of `op('..')`, you can write:

```python
parent()         # One level up
parent(2)        # Two levels up
parent().par.Inputtex  # A custom parameter on the parent
```

---

## Useful Expression Tricks

**Map a range (e.g. LFO -1→1 to 0→1):**

```python
(op('lfo1')['chan1'] + 1) / 2
```

**Conditional expression:**

```python
1 if op('button1')['chan1'] > 0.5 else 0
```

**Smoothstep (LFO remapped to 0→1, then eased):**

```python
(x := (op('lfo1')['chan1'].eval() + 1) / 2) * x * (3 - 2 * x)
```

A parameter expression has to be a single expression, so the walrus (`:=`) stores the remapped value without a separate assignment line.

---

## Common Gotchas

- **A blue parameter field** means expression mode is active. It isn't an error.
- Division by zero in an expression raises a Python error on the op. Guard it with `a / b if b else 0`.
- `absTime.seconds` keeps counting when a timeline is paused, because it ignores the timeline entirely. Use `me.time.seconds` for timeline-relative time.
- Using `op('path')` with an absolute path is fragile. Prefer relative references or `me` / `parent()`.

---

> [!tip]- 📚 Learning Path · Stage 1: Foundations · step 6 of 44
> [[touchdesigner/01_Core_Concepts/Parameters|(y-) ← Prev: Parameters]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/01_Core_Concepts/Viewer Active Mode|(y-) Next: Viewer Active Mode →]]

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
