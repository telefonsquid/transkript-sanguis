# Transkript Sanguis

Your blood test results over time, next to researched reference ranges. Built for people on hormone therapy, who rarely find ranges that fit them on their lab reports, and useful for everyone else too.

- **Stays on your device.** Everything is stored in your browser (localStorage, PDFs in IndexedDB). There is no backend, no account, no tracking. The content security policy blocks any connection to other servers.
- **Not medical advice.** The explanations and ranges are collected from guidelines, studies and assay method sheets, cited on every value. Talk to your doctor before changing anything.
- **English and German**, with value names in a second language alongside if you like.

## Features

- Several profiles per browser, each with its own medication timeline. Profiles can be on feminizing HRT, masculinizing HRT or none, which decides the targets and ranges shown.
- About 100 values with explanations in both languages: sex hormones, pituitary, adrenal, thyroid, blood count, clotting, kidney, liver, lipids including ApoB and Lp(a), glucose and insulin, iron, vitamins, PSA and more.
- Several reference contexts per value: HRT targets, ranges measured in trans people on stable HRT, clinical cutoffs, cis female and cis male ranges (age banded where it matters), plus the range your lab printed.
- Computed series: eGFR with both equations, eGFR from cystatin C, calculated free testosterone, free androgen index, non-HDL, HOMA-IR, transferrin saturation, BMI.
- Views: overview grid, compare (normalised to % of range, index or z-score), matrix heatmap, sortable table with CSV and JSON export, a focus page per value.
- X axis true to time or evenly spaced per draw, log or linear, conventional or SI units, filters by date range, lab, phase, group and preset.
- Four made-up demo profiles (feminizing HRT, masculinizing HRT, a cis woman, a cis man) to look around first. They are always there and can be reset, not deleted.
- Three ways in: type results in, let an AI assistant read your PDFs and paste its JSON (instructions and schema built into the app), or import a backup. Values are stored exactly as printed and converted on the fly.
- Consistency checks that recompute printed values (red cell indices, lipids, FAI, HbA1c, eGFR) to catch typos.
- Installable and usable offline.

## Run it locally

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # static site in build/
bun run preview
```

## Host it

The build is a static single page app. With Docker:

```sh
docker compose up -d --build   # http://localhost:8080
```

The image builds with bun and serves the files with an unprivileged nginx (SPA fallback, security headers, no access log). Any other static host works too: serve `build/` and fall back to `200.html` for unknown paths.

## Data formats

- `/agent-instructions.md`: the prompt for AI assistants, generated from the catalogue.
- `/import-schema.json`: JSON schema of the draws format (`transkript-sanguis/draws`, version 1). It has no fields for names or other identifiers on purpose.
- Backups use `transkript-sanguis/export`, version 1: profiles and, optionally, the attached PDFs.

## Development

- `bun run check`, `bun run lint`
- `npx playwright test` runs the end-to-end tests against a production build. Set `CHROMIUM` to a Chrome executable if Playwright's pinned browser is not installed.
- `node scripts/icons.ts` renders the PNG app icons from `static/favicon.svg`.

Project notes, decisions and conventions: [CLAUDE.md](CLAUDE.md).
