---
title: TouchDesigner Glossary
tags:
  - touchdesigner
  - reference
  - glossary
date: 2026-03-19
---

A quick reference for TouchDesigner jargon. Each term links to the wiki page that covers it in depth.

---

## (y-) Operators and networks

| Term          | Meaning                                                                                                                                                       | More                                                                      |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------ |
| OP (Operator) | A node, the building block of every network. Operators come in seven families, each with a three-letter name.                                                 | [[touchdesigner/02_The_Operators/index\|The Operators]]                   |
| COMP          | Component. Structural containers that hold networks of their own, and the bases for 3D geometry, cameras and lights.                                          | [[touchdesigner/02_The_Operators/COMPs/COMP - Components\|COMPs]]         |
| TOP           | Texture Operator. 2D images and video, processed on the GPU.                                                                                                  | [[touchdesigner/02_The_Operators/TOPs/TOP - Texture Operators\|TOPs]]     |
| CHOP          | Channel Operator. Numbers over time: animation curves, logic and audio, computed on the CPU.                                                                  | [[touchdesigner/02_The_Operators/CHOPs/CHOP - Channel Operators\|CHOPs]]  |
| SOP           | Surface Operator. 3D points, polygons and meshes, computed on the CPU.                                                                                        | [[touchdesigner/02_The_Operators/SOPs/SOP - Surface Operators\|SOPs]]     |
| DAT           | Data Operator. Text, Python scripts, tables, and raw data from network protocols.                                                                             | [[touchdesigner/02_The_Operators/DATs/DAT - Data Operators\|DATs]]        |
| MAT           | Material Operator. Shaders and materials (Phong, PBR, GLSL) applied to geometry.                                                                              | [[touchdesigner/02_The_Operators/MATs/MAT - Material Operators\|MATs]]    |
| POP           | Point Operator. Point clouds and particles, processed on the GPU.                                                                                             | [[touchdesigner/02_The_Operators/POPs/POP - Point Operators\|POPs]]       |
| Null          | A do-nothing operator at the end of a chain. Reference the Null instead of the node before it, and you can add or swap nodes upstream without breaking links. | [[touchdesigner/04_Scripting_and_Architecture/Cooking\|Cooking]]          |
| Network Path  | Where an operator lives in the project hierarchy, e.g. `/project1/geo1/transform1`. The bar at the top of each pane shows it.                                 | [[touchdesigner/01_Core_Concepts/Interface Overview\|Interface Overview]] |

## (y-) Cooking and time

| Term       | Meaning                                                                                                                                                            | More                                                                     |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| Cooking    | An operator recalculating its output. TD only cooks a node when its inputs have changed and something (another node or a viewer) is asking for its output.         | [[touchdesigner/04_Scripting_and_Architecture/Cooking\|Cooking]]         |
| Dirty      | The state of an operator whose inputs changed but which hasn't cooked yet. It re-cooks the next time its output is requested.                                      | [[touchdesigner/04_Scripting_and_Architecture/Cooking\|Cooking]]         |
| Time Slice | The time from the last cook frame to the current one. Most CHOPs compute only the samples inside it, so a slow frame widens the slice instead of dropping samples. | [[touchdesigner/02_The_Operators/CHOPs/CHOP - Channel Operators\|CHOPs]] |

## (y-) Linking parameters

From one-way to two-way:

| Term        | Meaning                                                                                                                                          | More                                                                                      |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| Referencing | One-way. A parameter reads another value through a Python expression, e.g. `op('null1')['chan1']`.                                               | [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|Expressions and Parameters]] |
| Export      | One-way. A CHOP channel drives a parameter directly, overriding its constant value. Faster than expressions when you're driving many parameters. | [[touchdesigner/01_Core_Concepts/Parameters\|Parameters]]                                 |
| Binding     | Two-way. Two parameters are linked so that changing either one updates the other.                                                                | [[touchdesigner/01_Core_Concepts/Parameters\|Parameters]]                                 |

## (y-) Shortcuts to operators

Ways to reach an operator by name instead of by path, so expressions keep working when you move things around.

| Term               | Meaning                                                                                                                                                                                         | More                                                                                         |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| Global OP Shortcut | A name set on a COMP's Common page that makes it reachable from anywhere in the project as `op.Name`.                                                                                           | [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|The op and me objects]] |
| Parent Shortcut    | A name set on a COMP that lets anything inside it reach it as `parent.Name`, however deeply nested. `/project1` ships with the Parent Shortcut `Project`.                                       | [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|The op and me objects]] |
| iop / ipar         | Internal Operator and Internal Parameter Shortcuts, set on a COMP's Common page. Code inside the COMP reaches a named internal operator as `iop.Name`, and `ipar` does the same for parameters. | [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|The op and me objects]] |

## (y-) Components and reuse

| Term    | Meaning                                                                                                                                                                               | More                                                                                               |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| Clone   | One master COMP's internal network is copied automatically into any number of clone COMPs, so editing the master updates them all. Nodes flagged Clone Immune keep their own version. | [[touchdesigner/01_Core_Concepts/Network Editor\|Network Editor]]                                  |
| Palette | The built-in browser of ready-made components and example `.tox` files, opened with `Alt+L`.                                                                                          | [[touchdesigner/01_Core_Concepts/Interface Overview\|Interface Overview]]                          |
| TOX     | A component saved to a `.tox` file. The unit of modular design in TD: drag one into any project to reuse it.                                                                          | [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes\|Modular Design and Toxes]] |

## (y-) Rendering and output

| Term          | Meaning                                                                                                                                                                   | More                                                                     |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------- |
| Feedback Loop | Routing an operator's output back into its own input through a Feedback TOP, so trails, blur and motion build up over time.                                               | [[touchdesigner/03_Rendering_and_Output/Feedback Loops\|Feedback Loops]] |
| Instancing    | Drawing many copies of one piece of geometry in a single GPU draw call, each positioned and colored from CHOP, SOP or POP data. It's how you render thousands of objects. | [[touchdesigner/03_Rendering_and_Output/Instancing\|Instancing]]         |

## (y-) Working in the editor

| Term          | Meaning                                                                                                                              | More                                                                      |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| Perform Mode  | Toggled with `F1`. Hides the network editor and shows only the designated Window COMP, for running a finished project at full speed. | [[touchdesigner/01_Core_Concepts/Common Shortcuts\|Common Shortcuts]]     |
| Viewer Active | A mode where you interact with a node's viewer directly, for example rotating 3D geometry or clicking buttons.                       | [[touchdesigner/01_Core_Concepts/Viewer Active Mode\|Viewer Active Mode]] |

---

[[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
