// Decrypts the images of password-protected notes (see scripts/protected-notes.mjs).
// Their files hold AES-GCM ciphertext (iv | ciphertext | tag). The key sits in a hidden
// .protected-images-key element, which only exists once encrypted-pages has decrypted the page.

const PROTECTED_SRC = /\/pictures\/protected\/[0-9a-f]{32}\.(\w+)$/
const MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
}

const keys = new Map<string, Promise<CryptoKey>>()
let objectUrls: string[] = []

function importKey(hex: string): Promise<CryptoKey> {
  let key = keys.get(hex)
  if (!key) {
    const bytes = new Uint8Array(hex.match(/../g)!.map((byte) => parseInt(byte, 16)))
    key = crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["decrypt"])
    keys.set(hex, key)
  }
  return key
}

async function decryptImage(img: HTMLImageElement, type: string, candidates: Promise<CryptoKey>[]) {
  const response = await fetch(img.src)
  if (!response.ok) return
  const data = new Uint8Array(await response.arrayBuffer())
  // Pages of different bundles can share a view (popovers), so try each key on the page.
  for (const key of candidates) {
    try {
      const plain = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: data.subarray(0, 12) },
        await key,
        data.subarray(12),
      )
      const url = URL.createObjectURL(new Blob([plain], { type }))
      objectUrls.push(url)
      img.src = url
      return
    } catch {
      // wrong key, try the next one
    }
  }
}

function decryptImages() {
  const hexes = new Set(
    [...document.querySelectorAll<HTMLElement>(".protected-images-key")]
      .map((el) => el.dataset.key ?? "")
      .filter((hex) => /^[0-9a-f]{64}$/.test(hex)),
  )
  if (hexes.size === 0) return
  const candidates = [...hexes].map(importKey)

  for (const img of document.querySelectorAll<HTMLImageElement>("img")) {
    if (img.dataset.protectedImage) continue
    const match = PROTECTED_SRC.exec(new URL(img.src).pathname)
    if (!match) continue
    img.dataset.protectedImage = "true"
    const type = MIME_TYPES[match[1].toLowerCase()] ?? "application/octet-stream"
    decryptImage(img, type, candidates).catch(() => {})
  }
}

document.addEventListener("render", decryptImages)
document.addEventListener("nav", decryptImages)
document.addEventListener("prenav", () => {
  for (const url of objectUrls) URL.revokeObjectURL(url)
  objectUrls = []
})
