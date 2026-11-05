---
title: "Metal Basics"
tags:
  - graphics
  - metal
  - swift
date: 2026-11-05
---

Metal is Apple's low-level GPU API. Compared with OpenGL it makes you build the objects once (device, queue, pipeline) and then record work into command buffers that the GPU executes later. The same objects serve rendering and compute. This page covers the shortest path from nothing to a Swift program that runs a kernel on the GPU, which is also the skeleton behind LumaDisplay's Metal work.

## Mental Model

- A `MTLDevice` is the GPU. A `MTLCommandQueue` belongs to a device, and you take command buffers from the queue.
- Work is recorded, not executed: you create a command buffer, open an encoder, set state and resources, issue a dispatch, end the encoder, and `commit()`.
- A pipeline state object is compiled once from a shader function and reused every frame. Creating one per frame is a classic performance bug.
- On Apple silicon the CPU and GPU share memory, so a `.storageModeShared` buffer is one allocation that both sides see.

## 1. The Object Chain

| Object                     | Created by                                   | Role                                    |
| -------------------------- | -------------------------------------------- | --------------------------------------- |
| `MTLDevice`                | `MTLCreateSystemDefaultDevice()`             | the GPU, factory for everything else    |
| `MTLCommandQueue`          | `device.makeCommandQueue()`                  | ordered stream of command buffers       |
| `MTLLibrary`               | `device.makeDefaultLibrary()`                | compiled shader functions               |
| `MTLFunction`              | `library.makeFunction(name:)`                | one kernel, vertex or fragment function |
| `MTLComputePipelineState`  | `device.makeComputePipelineState(function:)` | the compiled kernel, ready to dispatch  |
| `MTLBuffer`                | `device.makeBuffer(length:options:)`         | linear memory                           |
| `MTLCommandBuffer`         | `queue.makeCommandBuffer()`                  | one batch of recorded work              |
| `MTLComputeCommandEncoder` | `commandBuffer.makeComputeCommandEncoder()`  | records compute state and dispatches    |

`makeDefaultLibrary()` finds the `default.metallib` that Xcode builds from every `.metal` file in the target. In a command-line tool or a script without Xcode's build step, compile from a string instead with `device.makeLibrary(source:options:)`, which is what the example below does.

## 2. The Kernel in MSL

Metal Shading Language is C++14 with address-space qualifiers and attributes in double brackets. The attributes tell the compiler where each argument comes from.

```metal
#include <metal_stdlib>
using namespace metal;

kernel void scale(device float *data   [[buffer(0)]],
                  constant float &k    [[buffer(1)]],
                  uint gid             [[thread_position_in_grid]])
{
    data[gid] *= k;
}
```

`device` marks read-write GPU memory, `constant` marks small read-only data, `[[buffer(n)]]` binds an argument slot, and `[[thread_position_in_grid]]` gives each thread its global index (the same value as `gl_GlobalInvocationID.x` in GLSL, see [[notes/graphics/compute-shaders|Compute Shaders]]).

## 3. The Swift Side

This program doubles a million floats. With `dispatchThreads` Metal handles a grid that is not a multiple of the group size, so the kernel needs no bounds check.

```swift
import Metal

let src = """
#include <metal_stdlib>
using namespace metal;
kernel void scale(device float *data [[buffer(0)]],
                  constant float &k  [[buffer(1)]],
                  uint gid [[thread_position_in_grid]]) { data[gid] *= k; }
"""

let device = MTLCreateSystemDefaultDevice()!
let queue = device.makeCommandQueue()!
let library = try device.makeLibrary(source: src, options: nil)
let pso = try device.makeComputePipelineState(function: library.makeFunction(name: "scale")!)

let n = 1_000_000
let buffer = device.makeBuffer(length: n * MemoryLayout<Float>.stride,
                               options: .storageModeShared)!
let p = buffer.contents().bindMemory(to: Float.self, capacity: n)
for i in 0..<n { p[i] = Float(i) }

var k: Float = 2
let cb = queue.makeCommandBuffer()!
let enc = cb.makeComputeCommandEncoder()!
enc.setComputePipelineState(pso)
enc.setBuffer(buffer, offset: 0, index: 0)
enc.setBytes(&k, length: MemoryLayout<Float>.stride, index: 1)
let group = MTLSize(width: min(pso.maxTotalThreadsPerThreadgroup, 256), height: 1, depth: 1)
enc.dispatchThreads(MTLSize(width: n, height: 1, depth: 1), threadsPerThreadgroup: group)
enc.endEncoding()
cb.commit()
cb.waitUntilCompleted()
print(p[10])   // 20.0
```

Save it as `scale.swift` and run `swiftc scale.swift -o scale && ./scale`. Compiled and run on this machine, it prints 20.0.

The older call `dispatchThreadgroups(_:threadsPerThreadgroup:)` takes a group count instead, so you compute $\lceil N / S \rceil$ yourself and keep the `if (gid >= n) return;` check in the kernel. `threadExecutionWidth` on the pipeline state reports the SIMD width, and a group size that is a multiple of it runs efficiently.

> [!warning] Common mistake
> Reading `buffer.contents()` on the CPU before `waitUntilCompleted()` (or a completion handler) returns before the GPU is done. In a real-time app, never block like this per frame. Use `addCompletedHandler` or triple-buffer instead.

## 4. Storage Modes and Unified Memory

`.storageModeShared` allocates memory both CPU and GPU can access, and on Apple silicon that is a single physical copy in unified memory, so uploading data means writing to `contents()`. `.storageModePrivate` is GPU only, which lets the driver pick the fastest layout, and it is the right choice for data that only the GPU touches, such as the ping-pong particle buffers in [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]. On Intel Macs with a discrete GPU there is also `.storageModeManaged`, which keeps two copies and needs `didModifyRange` after CPU writes.

A struct shared between Swift and MSL must have matching layout. The usual trap is `float3`: MSL aligns it to 16 bytes, like `float4`. Use `float4` (`SIMD4<Float>` in Swift) or three separate floats.

## 5. Where This Shows Up

A rendering app adds a `MTKView`/`CAMetalLayer`, a render pipeline with vertex and fragment functions, and a draw call per frame, but the queue, buffers and pipeline objects are the same ones as above. Extended dynamic range output goes through the layer's configuration, covered in [[notes/graphics/hdr-and-edr-on-macos|HDR and EDR on macOS]] and used in [[work/lumadisplay|LumaDisplay]].

## Related

- [[notes/graphics/compute-shaders|Compute Shaders]]: threads, groups and shared memory in detail.
- [[notes/graphics/gpu-particle-systems|GPU Particle Systems]]: a worked use of compute with private buffers.
- [[notes/graphics/hdr-and-edr-on-macos|HDR and EDR on macOS]]: the display side of Metal on a Mac.
- [[work/lumadisplay|LumaDisplay]]: the Swift/Metal project this API knowledge feeds.
- [[notes/lectures/realtimegraphics/02_graphics_pipeline|The Graphics Pipeline]]: what the render pipeline stages do.
