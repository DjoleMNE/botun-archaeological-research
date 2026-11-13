# R021 — dedicated laser-data page and maintenance transition

13 November 2026. Owner explicitly requested direct website maintenance by the research assistant and a separate page showing real laser data in3D.

## Delivered behavior
- New `laserski-podaci.html`, linked in both navigation menus and the homepage.
- Native GEDI/ATL08 values from the unchanged R019 public example, shown separately, without a mesh or interpolated ground.
- Chronologically ordered pass choices, rotation, zoom, top/side views, labelled exaggeration, default/reset×1.
- Native point selection and a20-row paginated table for keyboard-accessible selection.
- Downloads: exact current selection versus complete chosen-mission example. Native IDs remain strings. JSON preserves original numeric precision; displayed values are rounded for readability.
- Explicit distinction from raw instrument signals, complete-AOI coverage and archaeological interpretation.
- R020 documentary and UI updates incorporated;27research updates total including this page.

## Corrections
Removed the stale permit-not-read source heading; ordered the collector timeline; distinguished site update date from observation dates; replaced the failing optional remote PDF iframe with the existing direct official link and readable guidance. Full AI-only/public-source/no-human-confirmation notice and Montenegrin text retained on all main pages.

## Verification performed before release
Existing validation suite updated for9pages/7navigation links/27updates and passed. Native source-file SHA256, ID types, finite measurement fields and every original pass count checked. New JavaScript syntax checked. Actual desktop Chrome: mission selection,22-record ICESat-2 pass,×10label, keyboard record selection, table pagination, and download succeeded. The downloaded22rows exactly matched native pass index3; string IDs were preserved. A390px-wide same-origin browser frame verified narrow layout, expanded mobile menu, rotation and native GEDI point selection. An observed control-width issue was fixed and visually rechecked. This is not testing on a physical phone, a full screen-reader audit or a scientific validation.

## Preserved evidence and limits
All ten existing laser data/viewer/figure assets remain byte-identical. The public example contains2,067GEDI and1,339ATL08 quality-screened records. No new NASA acquisition, archaeological candidate, classified-photon set, KAP outline or collector boundary is introduced. No human has verified the research. Broader research gaps remain in the private project tracker.
