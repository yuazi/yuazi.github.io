// Lorenz attractor background: a Lorenz system in the centre, a Halvorsen system on each side,
// and a settings panel behind the gear button. postscript.js runs once per page load, so all state
// here survives SPA navigation; the nodes are only detached while micromorph patches the body.

type Group = "lorenz" | "halvorsen"
type Deriv = (x: number, y: number, z: number) => [number, number, number]
interface Param {
  label: string
  min: number
  max: number
  step: number
  def: number
  respawn?: boolean // restart the particles when this changes
}
interface Point {
  x: number
  y: number
  z: number
}
interface Particle extends Point {
  home: Point
  trail: Point[]
}

// Keyed by localStorage key. gardenBootOverlay.inline.ts reads the lorenz.* keys too.
const defineParams = <K extends string>(p: Record<K, Param>) => p
const PARAMS = defineParams({
  "lorenz.sigma": { label: "σ (sigma)", min: 1, max: 50, step: 0.1, def: 10, respawn: true },
  "lorenz.rho": { label: "ρ (rho)", min: 1, max: 60, step: 0.5, def: 28, respawn: true },
  "lorenz.beta": { label: "β (beta)", min: 0.1, max: 10, step: 0.01, def: 8 / 3, respawn: true },
  "lorenz.dt": { label: "Speed (dt)", min: 0.001, max: 0.02, step: 0.0005, def: 0.005 },
  "lorenz.trail": { label: "Trail length", min: 100, max: 5000, step: 100, def: 2000 },
  "lorenz.particles": { label: "Particles", min: 1, max: 6, step: 1, def: 3, respawn: true },
  "halvorsen.a": { label: "a", min: 0.1, max: 3, step: 0.01, def: 1.4 },
  "halvorsen.dt": { label: "Speed (dt)", min: 0.001, max: 0.02, step: 0.0005, def: 0.005 },
  "halvorsen.trail": { label: "Trail length", min: 100, max: 5000, step: 100, def: 2000 },
  "halvorsen.particles": { label: "Particles", min: 1, max: 6, step: 1, def: 3, respawn: true },
})
type Name = keyof typeof PARAMS
const NAMES = Object.keys(PARAMS) as Name[]
const SECTIONS: Record<Group, string> = {
  lorenz: "Main Attractor (Lorenz)",
  halvorsen: "Side Attractors (Halvorsen)",
}
const COLORS = { light: ["#284b63", "#84a59d", "#6b4c63"], dark: ["#7b97aa", "#84a59d", "#a59d84"] }

const WARMUP_STEPS = 5000
const STEPS_PER_FRAME = 5
const SPIN_PER_FRAME = 0.0003
const TILT = 0.6
const TRAIL_BANDS = 16 // one stroke per alpha band instead of one per segment
const TAU = Math.PI * 2
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// ── Parameters ────────────────────────────────────────────────────────────────
const groupOf = (name: Name) => name.split(".")[0] as Group
const fmt = (n: number) => String(+n.toFixed(4))

function load(name: Name): number {
  const p = PARAMS[name]
  try {
    const n = parseFloat(localStorage.getItem(name) ?? "")
    if (Number.isFinite(n)) return Math.min(Math.max(n, p.min), p.max)
  } catch {} // storage blocked: use the default
  return p.def
}

function save(name: Name, value: number | null): void {
  try {
    if (value === null) localStorage.removeItem(name)
    else localStorage.setItem(name, String(value))
  } catch {}
}

const v = Object.fromEntries(NAMES.map((n) => [n, load(n)])) as Record<Name, number>
const val = (g: Group, k: "dt" | "trail" | "particles") => v[`${g}.${k}` as const]

// ── Simulation ────────────────────────────────────────────────────────────────
const lorenz: Deriv = (x, y, z) => [
  v["lorenz.sigma"] * (y - x),
  x * (v["lorenz.rho"] - z) - y,
  x * y - v["lorenz.beta"] * z,
]

const halvorsen: Deriv = (x, y, z) => {
  const a = v["halvorsen.a"]
  return [
    -a * x - 4 * y - 4 * z - y * y,
    -a * y - 4 * z - 4 * x - z * z,
    -a * z - 4 * x - 4 * y - x * x,
  ]
}

const particle = (x: number, y: number, z: number): Particle => ({
  x,
  y,
  z,
  home: { x, y, z },
  trail: [],
})

// RK4: Euler at the default dt lets Halvorsen escape to infinity after ~140k steps (about 8 minutes).
function step(p: Particle, f: Deriv, h: number, trail: number): void {
  if (trail) {
    p.trail.push({ x: p.x, y: p.y, z: p.z })
    if (p.trail.length > trail) p.trail.splice(0, p.trail.length - trail)
  }
  const [ax, ay, az] = f(p.x, p.y, p.z)
  const [bx, by, bz] = f(p.x + (ax * h) / 2, p.y + (ay * h) / 2, p.z + (az * h) / 2)
  const [cx, cy, cz] = f(p.x + (bx * h) / 2, p.y + (by * h) / 2, p.z + (bz * h) / 2)
  const [dx, dy, dz] = f(p.x + cx * h, p.y + cy * h, p.z + cz * h)
  p.x += ((ax + 2 * bx + 2 * cx + dx) * h) / 6
  p.y += ((ay + 2 * by + 2 * cy + dy) * h) / 6
  p.z += ((az + 2 * bz + 2 * cz + dz) * h) / 6
  // Halvorsen with a below ~1.1 has no attractor and diverges: start that particle over.
  if (!(Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z) < 1e4))
    Object.assign(p, p.home, { trail: [] })
}

const attractors = [
  { group: "lorenz", f: lorenz, x: 0.5, zoom: 1, cz: 25, dot: 1.5, line: 0.8, seed: 0 },
  { group: "halvorsen", f: halvorsen, x: 0.12, zoom: 0.75, cz: 0, dot: 1, line: 0.55, seed: 0 },
  { group: "halvorsen", f: halvorsen, x: 0.88, zoom: 0.75, cz: 0, dot: 1, line: 0.55, seed: 3 },
].map((a) => ({ ...a, group: a.group as Group, phase: Math.random() * TAU, ps: [] as Particle[] }))

function respawn(group?: Group): void {
  for (const a of attractors) {
    if (group && a.group !== group) continue
    a.ps = Array.from({ length: val(a.group, "particles") }, (_, i) => {
      const k = i + a.seed
      return a.group === "lorenz"
        ? particle(0.1 + k * 0.3, 0.1 + k * 0.2, 0.1 + k * 0.4)
        : particle(-5 + k * 0.5, 0.1 + k * 0.3, 0.1 + k * 0.2)
    })
  }
}

function stepAll(record: boolean): void {
  for (const a of attractors) {
    const h = val(a.group, "dt")
    const trail = record ? val(a.group, "trail") : 0
    for (const p of a.ps) step(p, a.f, h, trail)
  }
}

// ── Rendering ─────────────────────────────────────────────────────────────────
const canvas = document.createElement("canvas")
canvas.id = "lorenz-canvas"
canvas.setAttribute("aria-hidden", "true")
const ctx = canvas.getContext("2d")!
let W = 0
let H = 0
let spin = 0

function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = Math.round(W * dpr)
  canvas.height = Math.round(H * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function render(): void {
  const dark = document.documentElement.getAttribute("saved-theme") === "dark"
  const colors = dark ? COLORS.dark : COLORS.light
  const scale = Math.min(W, H) / 55
  const cosT = Math.cos(TILT)
  const sinT = Math.sin(TILT)

  for (const a of attractors) {
    const cos = Math.cos(a.phase + spin)
    const sin = Math.sin(a.phase + spin)
    const s = scale * a.zoom
    const cx = W * a.x
    const cy = H / 2
    const project = (q: Point): [number, number] => [
      cx + (q.x * cos - q.y * sin) * s,
      cy + ((q.x * sin + q.y * cos) * cosT - (q.z - a.cz) * sinT) * s,
    ]
    ctx.lineWidth = a.line

    a.ps.forEach((p, i) => {
      ctx.fillStyle = ctx.strokeStyle = colors[i % colors.length]
      ctx.globalAlpha = 1
      const [hx, hy] = project(p)
      ctx.beginPath()
      ctx.arc(hx, hy, a.dot, 0, TAU)
      ctx.fill()

      // Every 2nd trail point; alpha rises from 0 at the tail to 0.6 at the head.
      const t = p.trail
      if (t.length < 3) return
      let [x, y] = project(t[0])
      let j = 2
      for (let band = 1; band <= TRAIL_BANDS; band++) {
        const end = (t.length * band) / TRAIL_BANDS
        ctx.beginPath()
        ctx.moveTo(x, y)
        for (; j < t.length && j <= end; j += 2) {
          ;[x, y] = project(t[j])
          ctx.lineTo(x, y)
        }
        ctx.globalAlpha = (0.6 * (band - 0.5)) / TRAIL_BANDS
        ctx.stroke()
      }
    })
  }
  ctx.globalAlpha = 1
}

let last = 0
function frame(now: number): void {
  requestAnimationFrame(frame)
  // shortcut: caps at ~60 fps by skipping frames (90 Hz screens get 45), use time-based steps if that shows.
  if (now - last < 15) return
  last = now
  spin += SPIN_PER_FRAME
  for (let s = 0; s < STEPS_PER_FRAME; s++) stepAll(true)
  // Fade the previous frames toward transparent, so a theme switch leaves no old background behind.
  ctx.globalCompositeOperation = "destination-out"
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
  ctx.fillRect(0, 0, W, H)
  ctx.globalCompositeOperation = "source-over"
  render()
}

// prefers-reduced-motion: one settled frame with full trails, redrawn when something changes.
function paintStill(): void {
  respawn()
  for (let i = 0; i < WARMUP_STEPS; i++) stepAll(false)
  const trail = Math.max(v["lorenz.trail"], v["halvorsen.trail"])
  for (let i = 0; i < trail; i++) stepAll(true)
  ctx.clearRect(0, 0, W, H)
  render()
}

// ── Settings panel ────────────────────────────────────────────────────────────
const btn = document.createElement("button")
btn.id = "lorenz-settings-btn"
btn.type = "button"
btn.title = "Attractor settings"
btn.setAttribute("aria-controls", "lorenz-settings-panel")
btn.setAttribute("aria-expanded", "false")
btn.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`

const panel = document.createElement("div")
panel.id = "lorenz-settings-panel"
panel.inert = true // keeps the hidden sliders out of the tab order
let html = `<div class="lorenz-focus-row"><span>Focus mode</span><span class="lorenz-focus-hint">esc to exit</span><button type="button" class="lorenz-toggle" aria-pressed="false" aria-label="Focus mode"></button></div>`
let section = ""
for (const n of NAMES) {
  const p = PARAMS[n]
  if (groupOf(n) !== section) {
    section = groupOf(n)
    html += `<h4 class="lorenz-section">${SECTIONS[groupOf(n)]}</h4>`
  }
  html += `<label class="lorenz-row"><span class="lorenz-row-header"><span>${p.label}</span><span class="lorenz-val">${fmt(v[n])}</span></span><input type="range" name="${n}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v[n]}"></label>`
}
panel.innerHTML = html + `<button type="button" class="lorenz-reset-btn">Reset to defaults</button>`
const focusToggle = panel.querySelector<HTMLButtonElement>(".lorenz-toggle")!
let focusOn = false

function setOpen(open: boolean): void {
  if (!open && panel.contains(document.activeElement)) btn.focus()
  panel.classList.toggle("open", open)
  panel.inert = !open
  btn.classList.toggle("active", open)
  btn.setAttribute("aria-expanded", String(open))
}

function setFocus(on: boolean): void {
  focusOn = on
  document.body.classList.toggle("lorenz-focus", on)
  focusToggle.setAttribute("aria-pressed", String(on))
}

// Sets a parameter and its slider without saving it.
function set(name: Name, value: number): void {
  v[name] = value
  const input = panel.querySelector<HTMLInputElement>(`input[name="${name}"]`)!
  input.value = String(value)
  input.parentElement!.querySelector(".lorenz-val")!.textContent = fmt(value)
}

function changed(group?: Group): void {
  if (reduceMotion) paintStill()
  else respawn(group)
}

btn.addEventListener("click", () => setOpen(!panel.classList.contains("open")))
focusToggle.addEventListener("click", () => setFocus(!focusOn))

panel.addEventListener("input", (e) => {
  const name = (e.target as HTMLInputElement).name as Name
  set(name, parseFloat((e.target as HTMLInputElement).value))
  save(name, v[name])
  if (reduceMotion || PARAMS[name].respawn) changed(groupOf(name))
})

panel.querySelector(".lorenz-reset-btn")!.addEventListener("click", () => {
  for (const n of NAMES) {
    set(n, PARAMS[n].def)
    save(n, null)
  }
  changed()
})

document.addEventListener("click", (e) => {
  const target = e.target as Node
  if (!panel.contains(target) && !btn.contains(target)) setOpen(false)
})

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return
  if (focusOn) setFocus(false)
  else if (panel.classList.contains("open")) setOpen(false)
})

// Triggered by the button in content/notes/random/lorenz-attractor.md. Not saved.
document.addEventListener("lorenz-chaos", () => {
  set("lorenz.sigma", 10 + Math.random() * 20)
  set("lorenz.rho", 28 + Math.random() * 20)
  set("lorenz.beta", 8 / 3 + Math.random() * 2)
  set("lorenz.dt", 0.015)
  changed("lorenz")
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────
// micromorph diffs body children by position, so our nodes leave before the patch and come back after.
document.addEventListener("prenav", () => {
  canvas.remove()
  btn.remove()
  panel.remove()
})
document.addEventListener("nav", () => {
  document.body.append(canvas, btn, panel)
  document.body.classList.toggle("lorenz-focus", focusOn) // the patch resets body's class
})

let resizeTimer: ReturnType<typeof setTimeout> | undefined
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resize()
    if (reduceMotion) paintStill()
  }, 150)
})
document.addEventListener("themechange", () => {
  if (reduceMotion) paintStill()
})

document.body.append(canvas, btn, panel)
resize()
if (reduceMotion) {
  paintStill()
} else {
  respawn()
  for (let i = 0; i < WARMUP_STEPS; i++) stepAll(false)
  requestAnimationFrame(frame)
}
