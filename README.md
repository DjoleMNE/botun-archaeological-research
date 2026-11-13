# Botun — Tragovi iz podataka

Public GitHub Pages site in Montenegrin Latin for the Botun AI research project.

## Maintainer and authorization
On13November2026 the owner explicitly transferred website maintenance to the research assistant and requested direct website updates plus a dedicated laser-data page. This supersedes the former two-assistant ownership split. The current agent may implement and publish the requested routine updates. New archaeological discovery claims remain subject to professional assessment and explicit release decisions; none are made here.

Private research, target diagnostics, archives and correspondence stay in `DjoleMNE/botun-research-internal`. Never copy them into this public repository. Preserve provenance through reviewed public exports and exact source-file hashes.

## Run and verify
Static HTML/CSS/JavaScript, no build dependencies. Serve the repository root using a local static server, then run `node scripts/validate.mjs`. GitHub Pages serves `main` from the root; `.nojekyll` is retained. The validation workflow checks pages, navigation, disclaimers, baseline counts, public source records, native IDs and exact laser-data hashes.

## Pages
- `index.html`: overview
- `laserski-podaci.html`: dedicated point-only3D viewer, pass selection, accessible table, native-value downloads
- `istrazivanje.html`: research, source-exact figures and limitations
- `kap-crveni-mulj.html`: KAP imagery and documentary context
- `kolektor-botun.html`: wastewater-project imagery and primary documents
- `mapa.html`: research boundaries, not measured coverage
- `metod.html`, `o-projektu.html`, `404.html`

## Laser data contract
The new page reuses the exact public R019 GEDI/ATL08 files. It displays the quality-screened eastern example, not the complete10km AOI or unprocessed instrument telemetry. GEDI L2A lowest-mode elevation and ATL08 terrain summaries stay separate. IDs remain strings, native values remain unchanged, display coordinates are documented, empty space stays empty and no ground mesh is created. Downloads distinguish the current filtered choice from the full example of the chosen mission. Raw numerical downloads and existing provider identifiers retain their machine-readable schema.

## Editorial contract
All visitor-visible prose, labels, controls, errors and accessibility descriptions are plain Montenegrin Latin. Every page identifies AI-only authorship at Đorđe's request, public sources and lack of human verification. Source agencies do not endorse this analysis. No confirmed discoveries, unsupported confidence percentages or sensitive target coordinates. See `docs/EDITORIAL_POLICY.md` and `docs/R021_WEBSITE_UPDATE.md`.
