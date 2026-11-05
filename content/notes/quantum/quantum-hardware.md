---
title: "Qubit Hardware Platforms"
tags:
  - quantum-computing
  - hardware
date: 2026-11-05
---

Several physical systems can serve as qubits, and none has won yet. They differ in how fast their gates run, how long their coherence lasts, which qubits can interact directly, and what stops them from scaling. I keep this page for one reason: a circuit that looks identical on paper compiles and performs very differently on each platform, so it helps to know what the machine underneath can and cannot do. All figures below are rough orders of magnitude that vary by device, vendor and year. Treat them as a way to compare platforms, not as specifications.

![[pictures/topics/quantum/quantum-hardware.png]]

<p class="image-caption">A real quantum computer: most of what you see keeps the chip colder than outer space. Image: IBM Research, CC BY 2.0, via <a href="https://commons.wikimedia.org/wiki/File:IBM_Q_system_(Fraunhofer_2).jpg">Wikimedia Commons</a>.</p>

## Mental Model

- Every platform trades gate speed against coherence and fidelity. Fast gates give many shots per second, slow gates with long coherence give high accuracy per operation.
- Connectivity decides compilation cost. Sparse nearest-neighbor layouts need SWAPs, flexible or all-to-all layouts do not.
- The headline qubit count means little without two-qubit gate error, since errors, not qubit numbers, limit circuit depth.
- Scaling problems differ per platform: wiring and cryogenics for superconducting and spin qubits, laser control and trap size for ions and atoms, photon loss for photonics.
- Software sees only a coupling graph and a native gate set (see [[notes/quantum/quantum-gates|Quantum Gates]]). The transpiler hides everything else.

## 1. What to Compare

Four numbers describe most of a platform. The gate time of a two-qubit gate sets circuit speed. The two-qubit error rate sets how many gates fit before the output is noise. The coherence times T1 and T2 (see [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]]) set how long a state survives idle. Connectivity sets how many gates the compiler needs to route.

A useful single ratio is coherence time divided by gate time, the number of operations that fit in one coherence time. It is not the only constraint (errors per gate usually bite first), but it shows why very different hardware can be competitive.

## 2. Superconducting Transmons

A transmon is a small superconducting circuit, a Josephson junction in parallel with a capacitor, cooled until it behaves as an anharmonic oscillator whose two lowest levels are the qubit. Gates are microwave pulses. The chip sits in a dilution refrigerator at roughly 10 to 20 millikelvin, with attenuated wiring from room temperature down to the chip.

Typical orders of magnitude: single-qubit gates in tens of nanoseconds, two-qubit gates in tens to hundreds of nanoseconds, coherence times in the tens to a few hundred microseconds, and two-qubit error rates around $10^{-3}$ to $10^{-2}$.

IBM's Heron processors (the QGSS labs use the 133-qubit `ibm_torino`) have a heavy-hex layout: most qubits have two neighbors and a few have three. This keeps crosstalk and frequency collisions manageable at the price of routing: two-qubit gates between non-neighbors cost SWAPs, each SWAP three CZ gates. Nighthawk moves to a square lattice with up to four neighbors per qubit, which cuts SWAP overhead for the same circuit. The native gates on Heron are $R_Z$, $\sqrt X$, $X$ and CZ, with $R_Z$ implemented virtually in software, as described in [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]].

Strengths are speed and a mature chip-fabrication process. Weaknesses are fixed nearest-neighbor wiring on a 2D chip, the large cryostat and the fact that each qubit needs its own control and readout lines. Fabrication variation also makes every qubit slightly different, which is why the calibration data used in [[notes/lectures/qiskit/02-noise-backends-and-benchmarking|QGSS: Noise, Backends and Benchmarking]] matters.

## 3. Trapped Ions

![[pictures/topics/quantum/quantum-hardware-1.png]]

<p class="image-caption">Trapped ions: single charged atoms held still by electric fields and poked with lasers. Image: National Institute of Standards and Technology, Public domain, via <a href="https://commons.wikimedia.org/wiki/File:Quantum_Computing;_Ion_Trapping_(5941055642).jpg">Wikimedia Commons</a>.</p>

Ions such as ytterbium or calcium are held in vacuum by electromagnetic fields, laser-cooled and used as qubits through two internal energy levels. Gates come from laser or microwave pulses. Two-qubit gates use the shared motion of the ion chain, with the Mølmer-Sørensen gate as the standard entangling operation.

Typical orders of magnitude: single-qubit gates in microseconds, two-qubit gates in tens to hundreds of microseconds, coherence from seconds up to much longer, and two-qubit error rates of order $10^{-3}$ or below in the best demonstrations. Within one chain any ion can in principle interact with any other, which means all-to-all connectivity for small registers and few SWAPs.

The costs are slow gates, so fewer shots per second than superconducting machines, and growth limits. Long chains get crowded with motional modes, so larger machines break up into several trap zones and shuttle ions between them, or link separate traps optically. The architecture work here is mostly in shuttling and in controlling many laser beams.

## 4. Neutral Atoms

Individual atoms, often rubidium or cesium, are held in an array of optical tweezers (tightly focused laser beams) in ultra-high vacuum. Two-qubit gates excite atoms to Rydberg states, where a nearby atom's excitation shifts the energy levels and blocks a second excitation (the Rydberg blockade).

Typical orders of magnitude: single-qubit gates in microseconds, two-qubit gates in the range of hundreds of nanoseconds to microseconds, coherence from about a second, and two-qubit error rates in the low $10^{-3}$ range in good reports. Arrays of hundreds to thousands of atoms have been demonstrated. Because tweezers can be moved, connectivity is reconfigurable during a computation, so qubits that must interact can be brought close.

There is no dilution refrigerator, only vacuum and lasers. The open issues are atom loss during a run, reloading and rearranging atoms between shots (which makes each cycle slow compared to a chip), and keeping laser control precise across thousands of sites.

## 5. Photonics

![[pictures/topics/quantum/quantum-hardware-3.png]]

<p class="image-caption">Photonic qubits: particles of light guided through tiny channels on a chip. Image: FMNLab, CC BY 4.0, via <a href="https://commons.wikimedia.org/wiki/File:FMN_Lab_electro-optical_integrated_modulator.jpg">Wikimedia Commons</a>.</p>

Here the qubit is a photon, encoded in polarization, path or time bin. Photons travel long distances with little decoherence, they work at room temperature along the path, and they are the natural carrier for quantum networks. Single-qubit operations are easy with waveplates and beam splitters. Two-qubit gates are the problem, since photons barely interact. Linear-optics schemes make entangling gates probabilistic and heralded by detection, which leads to measurement-based and fusion-based architectures that consume large entangled resource states.

The main obstacle is loss: every component loses a fraction of photons, and large computations need very low loss. Efficient single-photon sources and detectors, some of which require cryogenic cooling, are part of the engineering burden. "Gate time" is less meaningful here, since the clock rate is set by sources, detectors and the optical path.

## 6. Spin Qubits

A spin qubit stores information in the spin of an electron or hole in a semiconductor quantum dot, most often in silicon. Control comes from microwave or electrical pulses. The attraction is size and manufacturing: a dot is tens of nanometers across, and silicon spin devices can be built with processes close to those of the chip industry.

Typical orders of magnitude: gates of tens to hundreds of nanoseconds, coherence from microseconds to milliseconds depending on material purity, and two-qubit fidelities around 99% to 99.9% in small laboratory devices. Devices are cooled well below one kelvin in most experiments. The hard parts today are uniformity across many dots, which differ from each other at the atomic scale, and wiring: control lines must reach densely packed dots, and many proposals integrate cryogenic control electronics next to the qubits.

## 7. Side by Side

All entries are approximate orders of magnitude, not vendor numbers.

| Platform        | Two-qubit gate time          | Two-qubit error                   | Coherence             | Connectivity         | Cooling                                      |
| --------------- | ---------------------------- | --------------------------------- | --------------------- | -------------------- | -------------------------------------------- |
| Superconducting | 10s to 100s of ns            | about $10^{-3}$ to $10^{-2}$      | 10s to 100s of $\mu$s | fixed, 2D neighbors  | about 10 to 20 mK                            |
| Trapped ions    | 10s to 100s of $\mu$s        | $10^{-3}$ or below                | seconds or more       | all-to-all in a zone | laser-cooled ions in vacuum                  |
| Neutral atoms   | about 100 ns to $\mu$s       | low $10^{-3}$                     | about a second        | reconfigurable       | laser-cooled atoms in vacuum                 |
| Photonics       | set by sources and detectors | probabilistic gates, loss limited | long in flight        | by routing           | mostly room temperature, some detectors cold |
| Spin qubits     | 10s to 100s of ns            | about $10^{-2}$ to $10^{-3}$      | $\mu$s to ms          | local neighbors      | below 1 K, usually mK                        |

Dividing coherence by gate time gives very roughly a thousand operations for superconducting chips and ten thousand or more for ions. Neutral atoms and spin qubits sit in similar or better regimes. These ratios say nothing about error rates per gate, which is why they are only a hint.

## 8. Scaling

Each platform needs a different thing to reach the millions of physical qubits that many error-corrected algorithms would use (see [[notes/quantum/quantum-error-correction|Quantum Error Correction]] and [[notes/quantum/shors-algorithm|Shor's Algorithm]] for why those numbers appear). For superconducting chips it is cryogenic wiring, control electronics and modular links between chips. For ions and atoms it is parallel optical control and, for ions, shuttling between zones. For photonics it is loss. For spin qubits it is uniformity and dense control. Error rates matter in every case: gate fidelity has to cross the threshold of the chosen error-correcting code, and what a given platform's noise looks like decides which code suits it.

For the algorithm pages in this section, assume an abstract device with a gate set and a coupling graph. For [[notes/quantum/variational-algorithms|Variational Algorithms]] and the QGSS SQD and QAOA labs, what actually limits results is the two-qubit gate count after routing and the error per gate, both set by the platform.

## Related

- [[notes/quantum/quantum-gates|Quantum Gates]] for native gate sets and decomposition.
- [[notes/quantum/density-matrices-and-noise|Density Matrices and Noise Channels]] for T1, T2 and what they do to a state.
- [[notes/quantum/quantum-error-correction|Quantum Error Correction]] for why fidelity thresholds, not qubit counts, set the target.
- [[notes/quantum/entanglement-and-bell-states|Entanglement and Bell States]] for GHZ-state size as a hardware benchmark.
- [[notes/lectures/qiskit/01-circuits-for-real-hardware|QGSS: Circuits for Real Hardware]] for heavy-hex routing on Heron.
- [[notes/lectures/qiskit/02-noise-backends-and-benchmarking|QGSS: Noise, Backends and Benchmarking]] for reading calibration data of a real backend.
- [[notes/lectures/qiskit/04a-quantum-advantage|QGSS: Quantum Advantage]] for what current devices have been used to attempt.
