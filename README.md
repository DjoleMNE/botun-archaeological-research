# Botun Heritage Explorer

A bilingual (English / Montenegrin) static website for an evidence-led archaeological landscape research pilot around Botun, Zeta, Montenegro.

**Status (11 November 2026): website prototype only; no archaeological discoveries claimed.**

- **Proposed GitHub repository:** `DjoleMNE/botun-archaeological-research` (start private).
- **Proposed published address, only after explicit launch approval:** `https://djolemne.github.io/botun-archaeological-research/`
- **Research-only repository:** `DjoleMNE/botun-research-internal` (keep private, separate from the website).
- **Hosting:** GitHub Pages; suitable for a static public repository on GitHub Free. Do **not** enable Pages for a private repository without considering that Pages content is public on the internet even if the source repo is private.

## What's included

- `index.html`: website structure, navigation and semantic content.
- `assets/style.css`: responsive styles.
- `assets/app.js`: English/Montenegrin UI, accessible interactive map, public research register and update journal.
- `assets/favicon.svg`: project mark.
- `data/study-area.geojson`: the three **planned** distance rings (3, 5, 10 km), centered on 42.3850 N, 19.2000 E. Does NOT describe actual sensor coverage or archaeological findings.
- `data/research.json`: the only file used to populate the public dataset status and dated updates.
- `scripts/validate.js`: lightweight gate checking required fields and selected dangerous location/claim patterns.
- `.github/workflows/validate.yml`: run the check on pushes / PRs. **This is not sufficient as an archaeological review.**
- `docs/WORK_AGENT_HANDOFF.md`: exact instructions to the separate research Work agent.
- `docs/UPDATE_PROTOCOL.md`: agreed structure, safety checks and handoff.

## Local preview

Install nothing beyond Python. In this folder, run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. The map requires an internet connection to load Leaflet, OSM or Esri tiles; text and site structure work without the map.

To validate public data (requires Node.js):

```bash
node scripts/validate.js
```

## First-time GitHub setup (user action)

1. At `https://github.com/new`, create `botun-archaeological-research` under `DjoleMNE`, set **Private**, and leave it empty (no auto README). This will hold the website source, but is **not** yet published.
2. At `https://github.com/new`, create `botun-research-internal` under `DjoleMNE`, set **Private**, and initialize with a README if desired. This is where the separate Work agent will store source analyses.
3. Tell the website assistant that both repositories exist; the assistant can populate the website repository if the GitHub connector has write access. If the repository isn't visible, review the GitHub app's repository permissions.
4. Give the Work agent `docs/WORK_AGENT_HANDOFF.md` and repository name `DjoleMNE/botun-research-internal`.
5. Do not turn GitHub Pages on until you explicitly approve the public release. At that point use **Settings → Pages → Deploy from a branch → main / (root)**. On GitHub Free, a repository generally needs to be public for Pages. The launched URL will be `https://djolemne.github.io/botun-archaeological-research/`.

**Important:** GitHub Pages is a public website. Do not put sensitive research-site coordinates, private datasets, names of informants, excavation plans, credentials, or files governed by restricted licenses into this repository even while it is private: its entire git history may become public if the repository is later switched to Public. Prefer separate private repositories from day one.

## Where results go

1. The **Work agent** produces, commits and cites validated underlying evidence in `DjoleMNE/botun-research-internal`.
2. The Work agent proposes a *redacted and reviewed* `public-export/research.json` **inside the private research repo** and updates `handoff/LATEST.md`.
3. The user asks the **website assistant**: "Sync the Botun site from `DjoleMNE/botun-research-internal` at commit `<SHA>`".
4. The website assistant retrieves that commit, checks sources and safety, and updates the website repo's `data/research.json` only after the user approves the public-facing wording. Avoid direct automated publishing of unreviewed findings.

No direct chat-to-chat synchronization is assumed. The shared GitHub repository is the versioned source of truth.

## Archaeology and scientific limitations

- A GEDI granule intersecting the area does not prove the laser footprints do. Count actual quality-filtered shots clipped to the AOI.
- GEDI and ICESat-2 provide sparse measurements. Neither is a continuous 1 m bare-earth terrain surface.
- NASADEM / SRTM-class DEMs are too coarse to confirm small walls or burial mounds.
- Published site coordinates are omitted until qualified heritage specialists approve their release.
- Never claim an archaeological discovery based only on AI pattern detection.

## Map attribution

The website loads Leaflet from `unpkg.com`, OpenStreetMap standard map tiles, and optional Esri World Imagery tiles. Their providers' attributions appear in the map UI. Verify provider usage policies before a high-traffic public launch. No external analytics or tracker is embedded.
