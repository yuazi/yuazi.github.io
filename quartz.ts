import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import LorenzBackground from "./quartz/components/LorenzBackground"
import GardenBootOverlay from "./quartz/components/GardenBootOverlay"
import ProtectedImages from "./quartz/components/ProtectedImages"

// Register custom components so their CSS/JS is injected into every page.
// They render nothing (empty fragments) but inject the Lorenz canvas and
// BIOS-style boot overlay via their afterDOMLoaded scripts. ProtectedImages decrypts the
// images of password-protected notes once encrypted-pages has unlocked the page.
componentRegistry.register("LorenzBackground", LorenzBackground, "local")
componentRegistry.register("GardenBootOverlay", GardenBootOverlay, "local")
componentRegistry.register("ProtectedImages", ProtectedImages, "local")

// Explorer ordering and labels. The explorer serializes these functions with toString() and
// runs them in the browser, so they must be self-contained: no outer variables, and no named
// helpers inside them (esbuild's keepNames would wrap those in __name, which the browser lacks).
// The client always runs filter, then map, then sort, so mapFn ranks each folder's children
// and sortFn applies the rank.
componentRegistry.setOptionOverrides("explorer", {
  mapFn: (node: any) => {
    // A folder holding nothing but its own index page shows as a plain link, not an empty folder.
    if (node.isFolder && node.children.length === 0 && node.data) node.isFolder = false

    // Drop qualifiers the parent folder already states, and the (y-) page-link prefix.
    const path = node.slugSegments.join("/")
    let name = node.displayName
    if (!node.isFolder) name = name.replace(/^\(y-\) /, "")
    if (path.startsWith("notes/sports/fencing/"))
      name = name.replace(/^Épée /, "").replace(/ \(Épée\)$/, "")
    if (path.startsWith("notes/sports/taekwondo/")) name = name.replace(/^Taekwondo /, "")
    if (node.slugSegments.length === 2 && node.slugSegments[0] === "touchdesigner") {
      name = name.replace(/^(\(y\) )?TouchDesigner /, "$1")
    }
    node.displayName = name

    // Rank children in the order the folder's hub page first links them (Quartz keeps only the
    // first mention of each link), falling back to the first link into a subfolder. The
    // Taekwondo and Fencing hubs mention a few pages early in shortcut tables, so their full
    // "every page" order is listed here; pages missing from a list sort after it, in hub order.
    const pageOrder: Record<string, string[]> = {
      "notes/sports/taekwondo": [
        "stances",
        "front-kick",
        "side-kick",
        "roundhouse-kick",
        "axe-kick",
        "combinations",
        "taeguk",
        "philosophy",
        "warmup-routine",
        "stretching",
        "splits-progression",
        "front-splits",
        "side-splits",
        "flexibility-plateaus",
        "spinning-kicks",
        "spinning-back-kick",
        "spinning-hook-kick",
        "spin-drills",
        "sparring",
        "footwork",
        "cut-kick",
        "defense",
        "conditioning",
        "rules",
        "2026-season",
      ],
      "notes/sports/fencing": [
        "stances",
        "footwork",
        "parries",
        "bladework",
        "point-control",
        "toe-touch",
        "distance-drills",
        "tactics",
        "score-and-clock",
        "bout-analysis",
        "competition-day",
        "left-handers",
        "equipment",
        "2026-season",
        "workout",
        "stretching",
        "glossary",
      ],
    }
    const listed = pageOrder[path] || []
    const links = (node.data && node.data.links) || []
    for (const child of node.children) {
      const childPath = child.slugSegments.join("/").toLowerCase()
      let rank = links.findIndex(
        (link: string) =>
          link.toLowerCase() === childPath || link.toLowerCase() === childPath + "/",
      )
      if (rank === -1) {
        rank = links.findIndex((link: string) => link.toLowerCase().startsWith(childPath + "/"))
      }
      const listedAt = listed.indexOf(child.slugSegment)
      if (listedAt !== -1) rank = listedAt
      else if (listed.length > 0 && rank !== -1) rank += listed.length
      child.explorerRank = rank === -1 ? undefined : rank
    }
  },
  sortFn: (a: any, b: any) => {
    // Top level: sections before standalone pages.
    if (a.slugSegments.length === 1 && a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    const ra = a.explorerRank
    const rb = b.explorerRank
    if (ra !== undefined && rb !== undefined) return ra - rb
    if (ra !== undefined) return -1
    if (rb !== undefined) return 1
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
