#!/usr/bin/env node
// Keeps password-protected lecture notes out of the public repo.
//
//   node scripts/protected-notes.mjs lock [--prune] [--rekey]
//       encrypt the plaintext bundles into protected/<bundle>/, one .enc file per note or image
//   node scripts/protected-notes.mjs unlock [--force]
//       restore the plaintext bundles from protected/<bundle>/
//   node scripts/protected-notes.mjs publish
//       CI only: restore the bundles prepared for an encrypted build
//   node scripts/protected-notes.mjs exclude
//       add the plaintext paths to .git/info/exclude (`npm install` runs this as its prepare step)
//
// The password comes from $PROTECTED_NOTES_PASSWORD or the gitignored file .protected-notes-password.
// `publish` adds it as the `password` frontmatter field read by quartz-community/encrypted-pages,
// turns the table of contents off, and encrypts the bundle's images with a key that only appears
// inside the encrypted pages; quartz/components/scripts/protectedImages.inline.ts decrypts them.

import { execFileSync } from "node:child_process"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const BUNDLES = [
  {
    name: "infovis",
    paths: ["content/notes/lectures/infovis", "content/pictures/infovis"],
  },
]
// Where `publish` writes the encrypted images. Only CI should ever create it.
const PROTECTED_PICTURES = "content/pictures/protected"
const IMAGE_TYPES = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"])
const ITERATIONS = 600000
const MAGIC = Buffer.from("QPN2")

class ProtectedNotesError extends Error {}

function readPassword() {
  if (process.env.PROTECTED_NOTES_PASSWORD) return process.env.PROTECTED_NOTES_PASSWORD.trim()
  const file = path.join(ROOT, ".protected-notes-password")
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : ""
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    return entry.name.startsWith(".") ? [] : [full]
  })
}

function isImage(rel) {
  return IMAGE_TYPES.has(path.extname(rel).toLowerCase())
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Matches the frontmatter block, including both `---` lines.
const FRONTMATTER = /^---\r?\n(?:[\s\S]*?\r?\n)?---(?:\r?\n|$)/

function withoutFields(frontmatter, keys) {
  return keys.reduce(
    (text, key) => text.replace(new RegExp(`^${key}:.*\\n`, "gm"), ""),
    frontmatter,
  )
}

function stripPassword(text) {
  const match = FRONTMATTER.exec(text)
  if (!match) return text
  return withoutFields(match[0], ["password"]) + text.slice(match[0].length)
}

// Sets top-level frontmatter fields, replacing any lines that already set them.
function setFrontmatter(rel, text, fields) {
  const match = FRONTMATTER.exec(text)
  if (!match) throw new ProtectedNotesError(`${rel} has no frontmatter`)
  const eol = text.startsWith("---\r\n") ? "\r\n" : "\n"
  const lines = Object.entries(fields).map(
    ([key, value]) => `${key}: ${JSON.stringify(value)}${eol}`,
  )
  const frontmatter = withoutFields(match[0], Object.keys(fields))
  return (
    frontmatter.replace(/^---\r?\n/, (open) => open + lines.join("")) + text.slice(match[0].length)
  )
}

// The bundle's view of a file: notes are stored without their password field.
function normalize(rel, data) {
  return rel.endsWith(".md") ? Buffer.from(stripPassword(data.toString("utf8"))) : data
}

// Sealed layout: iv (12 bytes) | ciphertext | GCM tag (16 bytes), which is what Web Crypto expects.
function seal(key, plain, aad = "") {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv).setAAD(Buffer.from(aad))
  return Buffer.concat([iv, cipher.update(plain), cipher.final(), cipher.getAuthTag()])
}

function unseal(key, sealed, aad = "") {
  const decipher = crypto
    .createDecipheriv("aes-256-gcm", key, sealed.subarray(0, 12))
    .setAAD(Buffer.from(aad))
  decipher.setAuthTag(sealed.subarray(-16))
  return Buffer.concat([decipher.update(sealed.subarray(12, -16)), decipher.final()])
}

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256")
}

function hmac(key, text) {
  return crypto.createHmac("sha256", key).update(text).digest()
}

// Resolves a path inside this checkout's git directory, or returns null outside a git checkout.
function gitPath(name) {
  try {
    const out = execFileSync("git", ["rev-parse", "--git-path", name], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return path.resolve(ROOT, out.trim())
  } catch {
    return null
  }
}

// Keeps plaintext out of commits. .gitignore cannot be used for this, because Quartz drops every
// content file that .gitignore matches from the build. info/exclude is shared by every worktree of
// a clone, and the prepare script writes it on `npm install`.
function excludeLocally() {
  const exclude = gitPath("info/exclude")
  if (!exclude) {
    console.warn("not a git checkout, so .git/info/exclude was not updated")
    return
  }
  const current = fs.existsSync(exclude) ? fs.readFileSync(exclude, "utf8") : ""
  const missing = [...BUNDLES.flatMap((bundle) => bundle.paths), PROTECTED_PICTURES]
    .map((dir) => `/${dir}/`)
    .filter((line) => !current.split("\n").includes(line))
  if (missing.length === 0) return
  const prefix = current === "" || current.endsWith("\n") ? "" : "\n"
  fs.mkdirSync(path.dirname(exclude), { recursive: true })
  fs.appendFileSync(exclude, prefix + missing.join("\n") + "\n")
  console.log(`excluded from git: ${missing.join(" ")}`)
}

// Hashes of each bundle's files as of the last lock or unlock in this worktree, so unlock can
// tell stale files (safe to replace) from local edits (kept unless --force).
const STATE_FILE = gitPath("protected-notes-state.json")

function readState() {
  return STATE_FILE && fs.existsSync(STATE_FILE)
    ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
    : {}
}

function saveState(bundle, files) {
  if (!STATE_FILE) return
  const state = readState()
  state[bundle.name] = Object.fromEntries(Object.entries(files).map(([rel, f]) => [rel, f.sha256]))
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n")
}

function bundleDir(bundle) {
  return path.join(ROOT, "protected", bundle.name)
}

function manifestFile(bundle) {
  return path.join(bundleDir(bundle), "manifest.enc")
}

function blobFile(bundle, id) {
  return path.join(bundleDir(bundle), `${id}.enc`)
}

// manifest.enc is MAGIC | salt | sealed JSON { version, files: { rel: { id, sha256 } } }.
// Returns null when the bundle has never been locked.
function openBundle(bundle, password) {
  const file = manifestFile(bundle)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file)
  if (!raw.subarray(0, 4).equals(MAGIC)) {
    throw new ProtectedNotesError(`${path.relative(ROOT, file)} is not a protected-notes manifest`)
  }
  const salt = raw.subarray(4, 20)
  const key = deriveKey(password, salt)
  let manifest
  try {
    manifest = JSON.parse(unseal(key, raw.subarray(20), bundle.name))
  } catch {
    const error = new ProtectedNotesError(`the password does not decrypt protected/${bundle.name}`)
    error.wrongPassword = true
    throw error
  }
  return {
    salt,
    key,
    files: manifest.files,
    read: (rel) => unseal(key, fs.readFileSync(blobFile(bundle, manifest.files[rel].id)), rel),
  }
}

function readPlaintext(bundle) {
  const files = new Map()
  for (const dir of bundle.paths) {
    for (const file of listFiles(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, file)
      files.set(rel, normalize(rel, fs.readFileSync(file)))
    }
  }
  return new Map([...files].sort(([a], [b]) => a.localeCompare(b)))
}

function lock(password, flags) {
  for (const bundle of BUNDLES) {
    const plaintext = readPlaintext(bundle)
    if (plaintext.size === 0)
      throw new ProtectedNotesError(`bundle ${bundle.name} has no files to lock`)
    const unsupported = [...plaintext.keys()].filter((rel) => !rel.endsWith(".md") && !isImage(rel))
    if (unsupported.length > 0) {
      throw new ProtectedNotesError(
        `only notes and images can be published encrypted; move these out of ${bundle.name}:\n  ` +
          unsupported.join("\n  "),
      )
    }

    let previous = null
    try {
      previous = openBundle(bundle, password)
    } catch (error) {
      if (!error.wrongPassword) throw error
      if (!flags.has("--rekey")) {
        throw new ProtectedNotesError(
          `${error.message}. Fix .protected-notes-password (or unset PROTECTED_NOTES_PASSWORD), or ` +
            `if you changed the password on purpose, unlock with the old one first, then run ` +
            `\`lock --rekey\` and update the PROTECTED_NOTES_PASSWORD repository secret.`,
        )
      }
      console.warn(
        `re-encrypting ${bundle.name} with a new password; missing files can't be checked`,
      )
    }

    const missing = Object.keys(previous?.files ?? {}).filter((rel) => !plaintext.has(rel))
    if (missing.length > 0 && !flags.has("--prune")) {
      throw new ProtectedNotesError(
        `${missing.length} files in ${bundle.name} are missing on disk. Run \`unlock\` first, or ` +
          `\`lock --prune\` to drop them from the bundle:\n  ${missing.join("\n  ")}`,
      )
    }

    const salt = previous?.salt ?? crypto.randomBytes(16)
    const key = previous?.key ?? deriveKey(password, salt)
    const files = {}
    let written = 0
    fs.mkdirSync(bundleDir(bundle), { recursive: true })
    for (const [rel, data] of plaintext) {
      const entry = { id: hmac(key, rel).toString("hex").slice(0, 32), sha256: sha256(data) }
      const old = previous?.files[rel]
      if (old?.sha256 !== entry.sha256 || !fs.existsSync(blobFile(bundle, entry.id))) {
        fs.writeFileSync(blobFile(bundle, entry.id), seal(key, data, rel))
        written++
      }
      files[rel] = entry
    }

    const blobs = new Set(Object.values(files).map((entry) => `${entry.id}.enc`))
    const stale = fs
      .readdirSync(bundleDir(bundle))
      .filter((name) => name.endsWith(".enc") && name !== "manifest.enc" && !blobs.has(name))
    for (const name of stale) fs.rmSync(path.join(bundleDir(bundle), name))

    if (JSON.stringify(previous?.files) !== JSON.stringify(files)) {
      const sealed = seal(key, JSON.stringify({ version: 2, files }), bundle.name)
      fs.writeFileSync(manifestFile(bundle), Buffer.concat([MAGIC, salt, sealed]))
    }
    saveState(bundle, files)

    const count = plaintext.size
    if (written === 0 && stale.length === 0) console.log(`unchanged ${bundle.name}: ${count} files`)
    else {
      console.log(
        `locked ${bundle.name}: ${count} files, ${written} written, ${stale.length} removed -> ` +
          path.relative(ROOT, bundleDir(bundle)),
      )
    }
  }
}

function unlock(password, flags) {
  for (const bundle of BUNDLES) {
    const opened = openBundle(bundle, password)
    if (!opened) throw new ProtectedNotesError(`protected/${bundle.name} has not been locked yet`)
    const synced = readState()[bundle.name] ?? {}
    const local = readPlaintext(bundle)

    const updates = []
    const edited = []
    for (const [rel, entry] of Object.entries(opened.files)) {
      if (!local.has(rel)) updates.push(rel)
      else {
        const localHash = sha256(local.get(rel))
        if (localHash === entry.sha256) continue
        if (localHash === synced[rel]) updates.push(rel)
        else edited.push(rel)
      }
    }
    // Files that were dropped from the bundle elsewhere and are untouched here.
    const removed = [...local].filter(
      ([rel, data]) => !(rel in opened.files) && synced[rel] === sha256(data),
    )
    if (edited.length > 0 && !flags.has("--force")) {
      throw new ProtectedNotesError(
        `local edits that are not in protected/${bundle.name}. Run \`lock\` to keep them, or ` +
          `\`unlock --force\` to replace them:\n  ${edited.join("\n  ")}`,
      )
    }

    for (const rel of [...updates, ...edited]) {
      const target = path.join(ROOT, rel)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, opened.read(rel))
    }
    for (const [rel] of removed) fs.rmSync(path.join(ROOT, rel))
    saveState(bundle, opened.files)
    console.log(
      `unlocked ${bundle.name}: ${Object.keys(opened.files).length} files, ` +
        `${updates.length + edited.length} updated, ${removed.length} removed`,
    )
  }
}

function publish(password) {
  if (!process.env.CI) {
    throw new ProtectedNotesError(
      "publish rewrites content/ for a throwaway CI checkout. To try an encrypted build locally, " +
        "run it with CI=1 in a separate `git worktree`.",
    )
  }
  for (const bundle of BUNDLES) {
    let opened
    try {
      opened = openBundle(bundle, password)
    } catch (error) {
      if (!error.wrongPassword) throw error
      throw new ProtectedNotesError(
        `PROTECTED_NOTES_PASSWORD does not decrypt protected/${bundle.name}; update the repository ` +
          `secret to the password the bundle was locked with`,
      )
    }
    if (!opened) throw new ProtectedNotesError(`protected/${bundle.name} has not been locked yet`)

    // Images are served as ciphertext. Their key goes into every page of the bundle, which
    // encrypted-pages encrypts, so it is only visible to readers who know the password.
    const imageKey = hmac(opened.key, "images")
    const renames = new Map()
    const notes = []
    fs.mkdirSync(path.join(ROOT, PROTECTED_PICTURES), { recursive: true })
    for (const rel of Object.keys(opened.files)) {
      if (rel.endsWith(".md")) {
        notes.push(rel)
        continue
      }
      if (!isImage(rel)) throw new ProtectedNotesError(`${rel} cannot be published encrypted`)
      const vaultPath = rel.slice("content/".length)
      const id = hmac(imageKey, vaultPath).toString("hex").slice(0, 32)
      const target = `${PROTECTED_PICTURES}/${id}${path.extname(rel)}`
      fs.writeFileSync(path.join(ROOT, target), seal(imageKey, opened.read(rel)))
      renames.set(vaultPath, target.slice("content/".length))
    }

    const keyTag =
      renames.size > 0
        ? `\n\n<div class="protected-images-key" data-key="${imageKey.toString("hex")}" hidden></div>\n`
        : ""
    // Longest paths first, so no path is rewritten inside a longer one.
    const ordered = [...renames].sort(([a], [b]) => b.length - a.length)
    for (const rel of notes) {
      let text = opened.read(rel).toString("utf8")
      for (const [from, to] of ordered) text = text.split(from).join(to)
      text = setFrontmatter(rel, text, { password, enableToc: false }) + keyTag
      const target = path.join(ROOT, rel)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, text)
    }
    console.log(
      `prepared ${bundle.name}: ${notes.length} pages and ${renames.size} images encrypted`,
    )
  }
}

const USAGE = {
  lock: ["--prune", "--rekey"],
  unlock: ["--force"],
  publish: [],
  exclude: [],
}
const [command, ...args] = process.argv.slice(2)
const flags = new Set(args)
if (!(command in USAGE) || args.some((flag) => !USAGE[command].includes(flag))) {
  console.error(
    "usage: node scripts/protected-notes.mjs lock [--prune] [--rekey] | unlock [--force] | publish | exclude",
  )
  process.exit(2)
}

try {
  if (command !== "publish") excludeLocally()
  if (command !== "exclude") {
    const password = readPassword()
    if (!password) {
      throw new ProtectedNotesError(
        command === "publish"
          ? "PROTECTED_NOTES_PASSWORD is not set; add it as a repository secret"
          : "set PROTECTED_NOTES_PASSWORD or create .protected-notes-password",
      )
    }
    if (command === "lock") lock(password, flags)
    else if (command === "unlock") unlock(password, flags)
    else publish(password)
  }
} catch (error) {
  if (!(error instanceof ProtectedNotesError)) throw error
  console.error(`${process.env.GITHUB_ACTIONS ? "::error::" : ""}${error.message}`)
  process.exit(1)
}
