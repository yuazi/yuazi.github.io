# Yusuf's Thoughts

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Source for [yuazi.github.io](https://yuazi.github.io/), a digital garden of lecture notes, a TouchDesigner wiki, generative art and project logs. It runs on a customized fork of Quartz v5.

## What's here

| Path                      | Contents                                                                        |
| ------------------------- | ------------------------------------------------------------------------------- |
| `content/`                | The Markdown vault (Obsidian-compatible). Everything on the site starts here.   |
| `content/notes/lectures/` | Lecture notes, one folder per course. Slide images live in `content/pictures/`. |
| `content/touchdesigner/`  | The TouchDesigner wiki and its learning path.                                   |
| `quartz/`                 | Quartz framework code plus this site's custom components.                       |
| `quartz.config.yaml`      | Site config: title, theme, community plugins, layout.                           |
| `protected/`              | Encrypted bundles of notes that must not be published in plaintext.             |

Custom components, registered in `quartz.ts`:

- **LorenzBackground**: Lorenz and Halvorsen attractors drawn behind every page, with a settings panel (gear, bottom right) and a focus mode. Respects `prefers-reduced-motion`.
- **GardenBootOverlay**: a BIOS-style boot screen, shown once per session.
- **ProtectedImages**: decrypts the images of password-protected notes after the page is unlocked.

## Run it locally

Needs Node.js 22 or newer.

```bash
npm ci
npx quartz plugin install   # community plugins, pinned by quartz.lock.json
npx quartz build --serve    # http://localhost:8080 with hot reload
```

Before committing, run `npm run check` (TypeScript and Prettier) and `npm test`.

## Password-protected notes

Some courses forbid publishing their material, so their notes are stored encrypted in `protected/`. The password lives in the gitignored `.protected-notes-password`.

```bash
node scripts/protected-notes.mjs unlock   # after cloning or pulling
node scripts/protected-notes.mjs lock     # after editing, then commit protected/
```

Never commit the plaintext folders. CI decrypts them with the `PROTECTED_NOTES_PASSWORD` secret and publishes them behind a page password.

## Deployment

Every push to `v5` runs `.github/workflows/deploy.yml`, which builds the site and publishes `public/` to GitHub Pages. There is no staging branch. `.github/workflows/ci.yaml` runs the checks and tests on the same pushes and on pull requests.

## Built with Quartz v5

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

### Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>

## License

Quartz is MIT licensed, see [LICENSE.txt](LICENSE.txt). The notes in `content/` are my own unless a page says otherwise.
