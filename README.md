# Botun — Tragovi prošlosti

A Montenegrin-Latin-only, public-safe static website for an AI-only archaeological remote-sensing pilot. The research was requested by Đorđe Vukčević, who was born and raised in Botun.

## Publication status
This branch is for **review**. Do not merge or publish a new scientific/discovery claim without the project owner's approval. Source repository is public; keep any sensitive archaeological coordinates, access tokens, private correspondence, or candidate registers in `DjoleMNE/botun-research-internal`, never here.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000/
node scripts/validate.mjs
```

The map uses Leaflet and OpenStreetMap tiles and requires internet access. It shows **planned geographic investigation rings**, not actual continuous LiDAR coverage or archaeological candidate sites.

## Mandatory editorial contract
- ALL visitor-visible copy is Montenegrin Latin, including accessibility descriptions, charts, map labels, buttons and error messages.
- Every HTML page carries the complete AI-only / no-human-verification disclaimer, with a shortened reminder in the footer.
- Scientific dataset numbers are AI-generated research results and have **not** been independently checked by a human.
- Sources include public NASA GEDI and ICESat-2 data, NASADEM, Copernicus, USGS Landsat, and public national terrain specifications. These providers have NOT endorsed or validated our analysis.
- The only source of proposed public data updates is the research Work agent's `public-export/research.json` plus scientific handoff; the website maintainer independently reviews it before publication. Internal `_en` descriptions are never rendered.
- Never imply 98,448 GEDI measurements equal area coverage or archaeological detections. No discoveries are confirmed.

## Pages
`index.html`, `mapa.html`, `istrazivanje.html`, `metod.html`, `dnevnik.html`, `o-projektu.html`, `404.html`.

## Research coordination
Read private repository mailbox `coordination/README.md`, then letters in `coordination/to-website/`. Website assistant writes only to `coordination/to-research/`. Keep research and website repository responsibilities separate.

## Source-data synchronization
`data/research.json` uses localized `name`, `note`, `title`, and `description` only, plus technical machine-readable IDs/status values. This avoids accidentally leaking English copy onto the site. Validate before merging.

## GitHub Pages
On GitHub Free, this repository can be public and publish from `main` `/(root)`. Never auto-merge preliminary science. `main` currently is controlled by the owner, and review happens through a PR.
