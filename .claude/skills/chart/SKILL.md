---
name: chart
description: How charts are built in Transkript Sanguis, from measurements to series and reference bands to the one Chart component, plus colours, axes and the SVG motion rules. Use when touching src/lib/chart, series.ts, view.svelte.ts, analysis.ts formatting or any view that draws a chart (Card, Focus, Compare, Matrix, Table).
---

# Charts

## Layers

Pure helpers never read the stores, one module composes them with the active profile and settings.

- `src/lib/data/judge.ts`: bounds and status of a measurement (see the catalogue skill).
- `src/lib/analysis.ts`: locale aware formatting and conversion (`convert`, `unitOf`, `fmtValue(a, m, units)`, `fmtBounds`, `fmtLabRef`, `fmtHrt(time, start)`, `phaseName(p, therapy)`, `fmtInputs`, `stats`). Re-exports the judge helpers.
- `src/lib/series.ts`: pure chart shaping. `toPoints` turns measurements into points, `refBands` curated references into bands, `labBand` the printed lab ranges into one stepped band.
- `src/lib/view.svelte.ts`: the composition layer. `judge`, `fmtMeasured`, `phaseLabel`, `hrtLabel`, `seriesFor`, `bandsFor`, `useLog` and `chartProps(series)`, everything a chart takes from the profile and the display settings. Views spread `{...chartProps(series)}` into `<Chart>` and add their own props.
- `src/lib/chart/Chart.svelte`: the one chart component. It never reads the profile. Units, phases, HRT start and therapy come in as props.
- `src/lib/chart/hover.svelte.ts`: the shared crosshair, so every chart highlights the same blood draw.
- `src/lib/chart/xscale.ts`: the x axis modes (`time` true to time, `draws` every draw of the profile evenly spaced, `points` only the draws the chart shows) and the months on HRT labels.

## Bands

- A `ChartBand` is either flat (`low` / `high`) or stepped (`steps`, one per draw, each owning the span halfway to its neighbours). The printed lab range is an ordinary stepped band with id `lab`, so it shows, hides, highlights and fades like the curated ones. Stepped bands sit behind the flat ones with softer edges.
- `bandsFor(id)` returns the lab band first, then the curated references the settings show. The one the status is judged against is filled, the rest stay rails and legend rows. Rails only list flat bands.
- A band carries `kind` for its reference colour, or its own `color` when it stands for no reference kind (the neutral 0 to 100 band in Compare).
- Compare normalises every value to its judged range in percent. Small charts there fill the curated bands, or the printed lab range when no curated one exists.

## Rules

- Reference kind colours are a validated palette in a fixed order: target blue, context orange, trans aqua, clinical yellow, cis women magenta, cis men violet, adults sienna (added 2026-09-25, passes the adjacent pair checks in light and dark), lab grey. Data line is ink. Status colours are never reused for series.
- One y axis per chart. Different units are compared through normalisation (Compare view), never a second axis.
- Therapy tints (flag pink and blue) never appear in charts, colours there carry reference kinds.
- SVG parts that must glide on scale changes carry the `glide` class and are placed by `transform` or drawn as thin rects, because `x1` / `y1` do not transition. Chart lines use `draw` with `pathLength="1"`, markers `dot` (see the ui skill for the other motion classes).
- Markers and bands depend on the x mode and the date range, so every template declaration in a chart is `{const x = $derived(expr)}`. A bare `{const}` froze markers once.
- Every chart shows units, reference context and provenance. Computed values are hollow diamonds and the tooltip names their inputs.
