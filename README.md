# She Owns the World

A Chinese-language branching narrative game spanning six lives, with five rounds of choices in each. Make decisions in different circumstances, earn relics, and unlock an additional option in the life that follows.

[Play online](https://edwinaaaw.github.io/she-owns-the-world/)

## Features

- Six chapters exploring the imperial examinations, practicing medicine, textile machinery, returning home after war, ghost marriage, and personal safety in modern life.
- Relics earned from actual endings. Using a relic does not consume it or guarantee a happy ending.
- Local autosave, a review of past lives, and a separate chapter preview that does not overwrite your main progress.
- Illustrated story scenes and relics.

## Run locally

Requires Node.js 22.12 or later and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL shown in the terminal. Progress is stored in your current browser's `localStorage` and does not automatically sync across domains, browsers, or devices.

## Test and build

```sh
pnpm test
pnpm build
```

The web build is written to `dist/client` and can be served by a static hosting service. The source repository itself is not the playable website.

## GitHub Pages

When `main` is updated, GitHub Actions runs the tests, then builds and deploys all six chapters and their illustrations. In the repository settings, set **Settings > Pages > Source** to **GitHub Actions**.

```sh
pnpm exec tsc -b
pnpm exec vite build --mode github-pages
```

The deployment directory is `dist/client`. Pages, scripts, and illustrations use the `/she-owns-the-world/` project path. Local development and the default build use the root path.

Browser saves from a previous demo domain do not automatically transfer to a new domain. This migration does not delete those existing saves.

## License

No open-source license has been specified for this repository. Public availability does not grant permission for unrestricted use.
