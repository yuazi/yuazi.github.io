#!/usr/bin/env node
// Keeps password-protected lecture notes out of the public repo.
//
//   node scripts/protected-notes.mjs lock      encrypt the plaintext bundles into protected/*.enc
//   node scripts/protected-notes.mjs unlock    restore the plaintext bundles from protected/*.enc
//   node scripts/protected-notes.mjs publish   unlock, then prepare the bundles for an encrypted build (CI)
//
// The password comes from $PROTECTED_NOTES_PASSWORD or the gitignored file .protected-notes-password.
// `publish` adds it as the `password` frontmatter field read by quartz-community/encrypted-pages and
// moves the bundle's images to names derived from the password, so they are only reachable through
// links inside the encrypted pages.

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import zlib from "node:zlib"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const BUNDLES = [
  {
    name: "infovis",
    paths: ["content/notes/lectures/infovis", "content/pictures/infovis"],
  },
]
const ITERATIONS = 600000
const MAGIC = Buffer.from("QPN1")

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
    return entry.name === ".DS_Store" ? [] : [full]
  })
}

function stripPassword(text) {
  return text.replace(/^(---\n[\s\S]*?)^password:.*\n/m, "$1")
}

function encrypt(plain, password) {
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256")
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const body = Buffer.concat([cipher.update(plain), cipher.final()])
  return Buffer.concat([MAGIC, salt, iv, cipher.getAuthTag(), body])
}

function decrypt(blob, password) {
  if (!blob.subarray(0, 4).equals(MAGIC)) throw new Error("not a protected-notes bundle")
  const salt = blob.subarray(4, 20)
  const iv = blob.subarray(20, 32)
  const tag = blob.subarray(32, 48)
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256")
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(blob.subarray(48)), decipher.final()])
}

// Keeps plaintext bundles out of commits on this machine. .gitignore cannot be used for this,
// because Quartz drops every content file that .gitignore matches from the build.
function excludeLocally() {
  const exclude = path.join(ROOT, ".git", "info", "exclude")
  if (!fs.existsSync(path.dirname(exclude))) return
  const current = fs.existsSync(exclude) ? fs.readFileSync(exclude, "utf8") : ""
  const missing = BUNDLES.flatMap((bundle) => bundle.paths.map((dir) => `/${dir}/`)).filter(
    (line) => !current.split("\n").includes(line),
  )
  if (missing.length === 0) return
  const prefix = current === "" || current.endsWith("\n") ? "" : "\n"
  fs.appendFileSync(exclude, prefix + missing.join("\n") + "\n")
}

function bundleFile(bundle) {
  return path.join(ROOT, "protected", `${bundle.name}.enc`)
}

function lock(password) {
  for (const bundle of BUNDLES) {
    const files = {}
    for (const dir of bundle.paths) {
      for (const file of listFiles(path.join(ROOT, dir))) {
        const rel = path.relative(ROOT, file)
        let data = fs.readFileSync(file)
        if (rel.endsWith(".md")) data = Buffer.from(stripPassword(data.toString("utf8")))
        files[rel] = data.toString("base64")
      }
    }
    const count = Object.keys(files).length
    if (count === 0) throw new Error(`bundle ${bundle.name} has no files to lock`)
    const json = JSON.stringify({ version: 1, files })
    if (fs.existsSync(bundleFile(bundle))) {
      let previous = null
      try {
        previous = zlib.gunzipSync(decrypt(fs.readFileSync(bundleFile(bundle)), password))
      } catch {
        // The bundle was locked with a different password, so re-encrypt it.
      }
      if (previous?.toString("utf8") === json) {
        console.log(`unchanged ${bundle.name}: ${count} files`)
        continue
      }
    }
    const packed = zlib.gzipSync(json)
    fs.mkdirSync(path.dirname(bundleFile(bundle)), { recursive: true })
    fs.writeFileSync(bundleFile(bundle), encrypt(packed, password))
    console.log(
      `locked ${bundle.name}: ${count} files -> ${path.relative(ROOT, bundleFile(bundle))}`,
    )
  }
}

function unlock(password) {
  const restored = []
  for (const bundle of BUNDLES) {
    const { files } = JSON.parse(
      zlib.gunzipSync(decrypt(fs.readFileSync(bundleFile(bundle)), password)),
    )
    for (const [rel, data] of Object.entries(files)) {
      const target = path.join(ROOT, rel)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, Buffer.from(data, "base64"))
    }
    console.log(`unlocked ${bundle.name}: ${Object.keys(files).length} files`)
    restored.push({ bundle, files: Object.keys(files) })
  }
  return restored
}

function publish(password) {
  for (const { bundle, files } of unlock(password)) {
    const pictureDirs = bundle.paths.filter((dir) => dir.startsWith("content/pictures/"))
    const renames = new Map()
    for (const rel of files.filter((f) => pictureDirs.some((dir) => f.startsWith(dir + "/")))) {
      const vaultPath = rel.slice("content/".length)
      const digest = crypto.createHmac("sha256", password).update(vaultPath).digest("hex")
      renames.set(vaultPath, `pictures/protected/${digest.slice(0, 32)}${path.extname(rel)}`)
    }
    for (const [from, to] of renames) {
      fs.mkdirSync(path.dirname(path.join(ROOT, "content", to)), { recursive: true })
      fs.renameSync(path.join(ROOT, "content", from), path.join(ROOT, "content", to))
    }
    for (const dir of pictureDirs) fs.rmSync(path.join(ROOT, dir), { recursive: true, force: true })

    for (const rel of files.filter((f) => f.endsWith(".md"))) {
      const file = path.join(ROOT, rel)
      let text = fs.readFileSync(file, "utf8")
      for (const [from, to] of renames) text = text.split(from).join(to)
      if (!text.startsWith("---\n")) throw new Error(`${rel} has no frontmatter`)
      text = text.replace(/^---\n/, `---\npassword: ${JSON.stringify(password)}\n`)
      fs.writeFileSync(file, text)
    }
    console.log(`prepared ${bundle.name}: ${renames.size} images renamed, pages password-protected`)
  }
}

const command = process.argv[2]
const password = readPassword()
if (!["lock", "unlock", "publish"].includes(command)) {
  console.error("usage: node scripts/protected-notes.mjs lock|unlock|publish")
  process.exit(2)
}
if (!password) {
  if (command === "publish") {
    console.warn("PROTECTED_NOTES_PASSWORD is not set; building without the protected notes")
    process.exit(0)
  }
  console.error("set PROTECTED_NOTES_PASSWORD or create .protected-notes-password")
  process.exit(1)
}
if (command === "lock") {
  excludeLocally()
  lock(password)
} else if (command === "unlock") {
  excludeLocally()
  unlock(password)
} else publish(password)
