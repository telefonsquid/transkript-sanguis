# Transkript Sanguis: project memory

Living memory for this repo. Read it at the start of every session and add to it whenever a decision is made. Personal notes about the owner and their data live in `CLAUDE.local.md` and `data/`, both gitignored.

## What it is

Transkript Sanguis (the repo folder is still called laborwerte) is a SvelteKit app that charts blood test results over time next to researched reference ranges. Built for people on hormone therapy (feminizing and masculinizing), works for anyone. Several profiles per browser, everything stored locally. A data scientist's tool first, pretty second. Hosted by the owner as static files, used by friends.

## Hard rules

- **Never write the owner's former name anywhere**: code, data, comments, commits, docs, chat. See `CLAUDE.local.md`.
- **No personal health data in the repo or the build.** Real results, report PDFs and exports stay in `data/` (gitignored). Demo profiles are made up.
- **Nothing leaves the browser.** No backend, no analytics, no external fonts, scripts or CDNs. The CSP (`connect-src 'self'`) enforces it. Health data only ever lives in localStorage and IndexedDB.
- **Not medical advice.** Both disclaimers (not medical advice first, then local only) are confirmed one after the other once a choice is made on the landing page (View demo, Create profile, opening a profile), never before, and stay visible in the footer and on `/about`.
- **Two languages.** Every UI string exists in `src/lib/i18n/en.ts` and `de.ts` (the German dictionary is typed against the English one, so a missing key fails `bun run check`). Catalogue texts carry both languages too. German UI uses the informal "du". `prefs.lang` is the UI language, `prefs.second` an optional second language for value names.
- **Researched references only.** Every reference range cites a `sources` entry. No guessed numbers.
- Legibility beats decoration. Every chart shows units, reference context and provenance.

## Skills and docs

Topic knowledge lives in project skills under `.claude/skills/`. Load the matching one before working in its area and record new decisions there, not here.

- `catalogue`: values, reference ranges, sources, units, value texts, derived series.
- `chart`: from measurements to series and bands, the Chart component, colours, axes.
- `ui`: logo, landing page, page loading, motion, tints, control styling.
- `docs/briefs.md`: every brief and feedback round from the owner, with the app name history. Add new rounds there.

## Decisions

- **Name and slug:** `src/lib/app.ts` holds `APP_NAME` (display, free to change), `SLUG` (`transkript-sanguis`) and `REPO_URL` (GitHub link in the top bar and on `/about`). Storage keys, file formats, the IndexedDB name and the service worker cache all derive from `SLUG`, so it must never change once people store data.
- **Demo profiles:** the four demos always exist (`withDemos` in `profiles.svelte.ts`). They can be edited and reset but not deleted, and are left out of "export all". Raising `DEMO_VERSION` in `demo.ts` replaces stored copies with the new demo data. Deleting the last own profile leads back to the landing page. Names carry no prefix, a Demo badge in the profile button and on My data marks them. Demos show off the app, so they carry a broad panel including sex hormones for the cis demos. Printed lab ranges come from `LAB` per sex (the `rangesFor` of the draw).
- **Storage:** profiles, draws, phases and consent in localStorage (`transkript-sanguis:db:v1`). UI settings in `…:settings:v1`, language, second language and theme in `…:prefs:v1`. PDFs in IndexedDB (`transkript-sanguis-files`, key `profileId/reportId`), because localStorage is too small.
- **Phases:** the medication timeline is per profile. The stretch before the first phase is an implicit baseline ("Before HRT" on HRT profiles). The first phase start is the HRT start. `afterDraw` means the change took effect after the draw on that day.
- **Agent import:** `src/lib/agent.ts` generates the instructions (served prerendered at `/agent-instructions.md`) and the JSON schema (`/import-schema.json`) from the catalogue, so they never drift. Format `transkript-sanguis/draws` v2 (`low` / `high` numbers, `rangeText` for anything else, v1 with `ref` still reads) carries no personal fields on purpose. The instructions list the accepted units per value and tell the model to copy value, unit and range as printed and never convert, because the app converts and models get it wrong. They also ask for the sampling dates per report first, one column at a time on cumulative reports, plain text without LaTeX or citation markers and a self check. The preview matches printed names to the catalogue and only takes units from a dropdown of `unitChoices`. A unit it cannot read is guessed from where value and range land against the curated ranges (`suggestUnit`) and blocks the import until confirmed. It flags value, range, unit and duplicate problems and merges into an existing draw on the same date if wanted.
- **Backups:** format `transkript-sanguis/export` v2 (v1 still reads) with profiles and optionally base64 PDFs. Importing an existing profile id asks to replace or copy.
- **Deployment:** adapter-static SPA (`fallback: 200.html`), service worker for offline use (`src/service-worker/`), PWA manifest in `static/`. Docker: bun builds, `nginx-unprivileged` serves on 8080 with SPA fallback, security headers, no access log. CSP comes from SvelteKit (`mode: 'hash'`) as a meta tag, nginx only adds `frame-ancestors`.
- **Desktop app (planned, not started):** a Tauri 2 build released through GitHub, which the README's "Download Desktop App" link (`releases/latest`) already points to. Mirror `D:\Repositories\punk-save-editor`: its `src-tauri` layout, `.github/workflows/release.yml` (OS/arch matrix, draft release, notes from `CHANGELOG.md`, tag checked against `package.json` via `bun run version:set`), naming (`productName` = slug, identifier `com.telefonsquid.<slug>`, release name "<App name> v__VERSION__"). Load `alya:tauri-deploy` before starting.
- **Git:** history was rebuilt on 2026-09-25 so no commit contains personal data. The old history is kept only as a bundle in `data/`.

## Architecture

- `src/lib/data/types.ts`: catalogue types (`Analyte`, `Reference`, `Text` = `{ en, de }`) and profile types (`Profile`, `Draw`, `Result`, `Phase`, `ReportMeta`, `Measurement` with the `inputs` of computed values).
- `src/lib/data/analytes/*.ts`: the catalogue by area (hormones, blood incl. clotting, chemistry, metabolism, nutrients). `refs.ts` holds the reference helpers.
- `src/lib/data/info/*.ts`: the value texts by the same areas, joined into the catalogue in `catalogue.ts`.
- `src/lib/data/catalogue.ts`: analytes, groups, presets. `sources.ts`: every cited source. `parse.ts`: values, ranges, dates. `units.ts`: unit reading, conversion, accepted units, guesses. `formulas.ts`: the equations of derived series. `judge.ts`: reference resolution and status against a `Subject`. `build.ts`: profile to measurements, phases, derived series, issues. Everything in `data/` is pure and unit tested.
- `src/lib/profiles.svelte.ts`: the `db` state, profile and draw operations, `current` (everything derived from the active profile: `subject`, `hrtStart`, `phase(id)`, custom values).
- `src/lib/state.svelte.ts`: UI settings and the `filtered` view of the active profile, with every measurement judged once (`judged`). `prefs.svelte.ts`: language, second language, theme.
- `src/lib/analysis.ts`: formatting (locale aware) and stats, re-exports `judge.ts`. `series.ts`: chart points and bands. `view.svelte.ts`: joins both with the active profile and settings (`seriesFor`, `bandsFor`, `chartProps`, `judge`). See the chart skill.
- `src/lib/rows.ts`: the editable result row shared by manual entry and the import preview (`rowProblem`, `toResult`, `fromResult`).
- `src/lib/motion.svelte.ts`: reduced motion state, transition wrappers, view transitions (page, card to focus chart, theme circle) and the `glide` attachment that slides the pill of tabs and segmented controls.
- `src/lib/i18n/`: `t` (proxy over the active dictionary), `tx` for catalogue texts, `nameOf` / `altNameOf`.
- `src/lib/io.ts`: export/import, agent JSON parsing, name matching, import preview. `files.ts`: IndexedDB. `checks.ts`: consistency checks.
- `src/lib/chart/`: `Chart.svelte` (the one chart component), `types.ts`, `xscale.ts`, `hover.svelte.ts`. Views in `src/lib/components/`, the My data sections (profile card, draw list, medication timeline, checks, backup) in `src/lib/components/mydata/`.
- `src/lib/demo.ts`: four made up demo profiles (Lena cis woman, Max cis man, Raven fem HRT, Sam masc HRT), in `DEMO_IDS` order everywhere (`lists.demos`).
- Routes: `/` dashboard (grid, compare, matrix, table), `/analyte/[id]`, `/welcome` (landing page, disclaimers, demo picker, first profile), `/data` (My data: profile, add results, draws, medication timeline, checks, backup; subpages `/manual`, `/agent`, `/import`), `/profiles` (own and demo profiles, new profile via `?new`), `/about` (linked from the footer as About and as Sources, next to Source code and the keyboard shortcuts button).

## Conventions

- Comments follow the `alya:code-comments` skill.
- Tests: `bun run test:unit` runs the bun unit tests next to the code (`*.test.ts`, each starts with `/// <reference types="bun" />` because TypeScript 6 no longer loads `@types` on its own). `CHROMIUM=<path to chrome.exe> npx playwright test` runs the e2e tests (`src/**/*.e2e.ts`) against a production build when Playwright's pinned browser is not installed. They fail on any console error, which catches CSP violations. `bun run test` runs both.
- Route files import from `#lib/...` with an explicit `.js` extension (`#lib/data/index.js`).
- Template declaration tags need `$derived`: `{const x = $derived(expr)}`. A bare `{const x = expr}` is computed once per block and goes stale (this froze chart markers when the x axis changed).
- Files ending in `.svelte.ts` must not create `Date`, `Map` or `Set` instances that eslint's `prefer-svelte-reactivity` flags. Date helpers live in `data/parse.ts` (`nowIso`, `todayIso`).
- `bash` heredocs through the agent tool can lose backslashes: edit regexes with the Edit tool.
