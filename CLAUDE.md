# Transkript Sanguis: project memory

Living memory for this repo. Read it at the start of every session and add to it whenever a decision is made. Personal notes about the owner and their data live in `CLAUDE.local.md` and `data/`, both gitignored.

## What it is

Transkript Sanguis (the repo folder is still called laborwerte) is a SvelteKit app that charts blood test results over time next to researched reference ranges. Built for people on hormone therapy (feminizing and masculinizing), works for anyone. Several profiles per browser, everything stored locally. A data scientist's tool first, pretty second. Hosted by the owner as static files, used by friends.

## Hard rules

- **Never write the owner's former name anywhere**: code, data, comments, commits, docs, chat. See `CLAUDE.local.md`.
- **No personal health data in the repo or the build.** Real results, report PDFs and exports stay in `data/` (gitignored). Demo profiles are made up.
- **Nothing leaves the browser.** No backend, no analytics, no external fonts, scripts or CDNs. The CSP (`connect-src 'self'`) enforces it. Health data only ever lives in localStorage and IndexedDB.
- **Not medical advice.** Both disclaimers (not medical advice first, then local only) are confirmed one after the other during onboarding and stay visible in the footer and on `/about`.
- **Two languages.** Every UI string exists in `src/lib/i18n/en.ts` and `de.ts` (the German dictionary is typed against the English one, so a missing key fails `bun run check`). Catalogue texts carry both languages too. German UI uses the informal "du". `prefs.lang` is the UI language, `prefs.second` an optional second language for value names.
- **Researched references only.** Every reference range cites a `sources` entry. No guessed numbers.
- Legibility beats decoration. Every chart shows units, reference context and provenance.

## Briefs

- 2026-09-25, first version: extract values from the PDFs and double check them, explain every value, several researched reference contexts per value (e.g. estradiol: HRT target, monotherapy zone, cis female phases, cis male), filters for single values, groups, date range and more, x axis evenly spaced and true to time, focus view per value, memory file in the repo.
- 2026-09-25, generalisation: profiles, all data in local storage, onboarding (profile, then manual or agent import), two disclaimers, agent instructions that turn PDFs into importable JSON, manual entry UI, JSON export/import, more analytes beyond the owner's own, English and German with the second language's names toggleable, hosting on the owner's server, all personal data purged.
- Answers from the owner: audience fem + masc HRT + no HRT; extras demo profile, PDFs kept locally, installable offline app; deployment via Docker image; git history rebuilt clean.
- 2026-09-25, first feedback round: chart markers must follow x mode and date changes, one language dropdown with main and second language, About out of the top bar (footer only), "Add results" and "Data" merged into "My data", overview filters moved to the sidebar bottom and hidden on focus pages, onboarding as medical disclaimer → local disclaimer → View demo or Create profile, disclaimers with an "I understand" button instead of checkboxes, demo profiles for a cis woman and a cis man, renamable profiles, "None" as default therapy.
- 2026-09-25, second feedback round: profile menu wider with right aligned details and truncated names, language button shows only the main language next to theme and help, view tabs centred, My data and the profile menu more prominent, profile editing moved into My data, demo profiles always present and separate (reset, never deleted, no buttons that add them), browser title without "Welcome", My data redesigned, the value picker lists the whole catalogue under the suggestions, empty and unset fields muted, "Trans" in the name in trans flag colours on HRT profiles.
- App name: "Transkript Sanguis" in both languages, chosen by the owner "for now". Rejected: Drawn, Levels, HRTbeat, Bloodwork, Plasma Screen, Sanguine, Hemoglowbin. "Hemogram" names only the blood count, "He/Shemogram" echoes a slur.

## Decisions

- **Name and slug:** `src/lib/app.ts` holds `APP_NAME` (display, free to change) and `SLUG` (`transkript-sanguis`). Storage keys, file formats, the IndexedDB name and the service worker cache all derive from `SLUG`, so it must never change once people store data.
- **Demo profiles:** the four demos always exist (`withDemos` in `profiles.svelte.ts`). They can be edited and reset but not deleted, and are left out of "export all". Raising `DEMO_VERSION` in `demo.ts` replaces stored copies with the new demo data. Deleting the last own profile leads back to the start page.
- **Storage:** profiles, draws, phases and consent in localStorage (`transkript-sanguis:db:v1`). UI settings in `…:settings:v1`, language, second language and theme in `…:prefs:v1`. PDFs in IndexedDB (`transkript-sanguis-files`, key `profileId/reportId`), because localStorage is too small.
- **Values are stored exactly as printed** (`Result.value` is a string like `"<0,3"`, plus printed unit and range). Parsing and unit conversion happen at build time of the view (`src/lib/data/build.ts`), so fixing a unit table fixes old data too. Unreadable values become issues on the Data page, never errors.
- **Canonical units:** each analyte has one canonical unit, `units` lists printed alternatives with a factor to canonical, `si` is the display alternative. Lab ranges convert with the same factor. Quantities without a fixed factor (Lp(a) mg/dl vs nmol/l, HbA1c % vs mmol/mol) are separate analytes.
- **Lab ranges are stored per value**, labs switch ranges (for example from male to female) over time.
- **References:** kinds `target`, `context`, `trans` (cohorts on HRT), `clinical`, `adult`, `female`, `male`, plus the printed `lab` range. Refs can be limited to a therapy (`therapy`) and an age band (`age`). `primary` names the default reference per therapy (`feminizing`, `masculinizing`, `any`). On profiles without HRT the ref matching the sex assigned at birth, then `adult`, is used. When nothing fits and there is no lab range, only `adult`, `clinical`, `target` or `trans` refs may serve as fallback, never a cis sex range (a suppressed LH would read as a false "low").
- **Derived series** (always marked, hollow diamonds): eGFR CKD-EPI 2009 female and male from creatinine, eGFR from cystatin C (CKD-EPI 2012), non-HDL, LDL/HDL, FAI and calculated free testosterone (Vermeulen, 4.3 g/dl albumin when not measured, censored testosterone propagates), HOMA-IR, transferrin saturation, BMI. On HRT profiles both sexes' equations are computed. A value the lab printed always wins over the computed one.
- **Phases:** the medication timeline is per profile. The stretch before the first phase is an implicit baseline ("Before HRT" on HRT profiles). The first phase start is the HRT start. `afterDraw` means the change took effect after the draw on that day.
- **Agent import:** `src/lib/agent.ts` generates the instructions (served prerendered at `/agent-instructions.md`) and the JSON schema (`/import-schema.json`) from the catalogue, so they never drift. Format `transkript-sanguis/draws` v1 carries no personal fields on purpose. The preview matches printed names to the catalogue, flags value, unit and duplicate problems, and merges into an existing draw on the same date if wanted.
- **Backups:** format `transkript-sanguis/export` v1 with profiles and optionally base64 PDFs. Importing an existing profile id asks to replace or copy.
- **Deployment:** adapter-static SPA (`fallback: 200.html`), service worker for offline use (`src/service-worker/`), PWA manifest in `static/`. Docker: bun builds, `nginx-unprivileged` serves on 8080 with SPA fallback, security headers, no access log. CSP comes from SvelteKit (`mode: 'hash'`) as a meta tag, nginx only adds `frame-ancestors`.
- **Git:** history was rebuilt on 2026-09-25 so no commit contains personal data. The old history is kept only as a bundle in `data/`.

## Architecture

- `src/lib/data/types.ts`: catalogue types (`Analyte`, `Reference`, `Text` = `{ en, de }`) and profile types (`Profile`, `Draw`, `Result`, `Phase`, `ReportMeta`).
- `src/lib/data/analytes/*.ts`: the catalogue by area (hormones, blood incl. clotting, chemistry, metabolism, nutrients). `refs.ts` holds the reference helpers.
- `src/lib/data/catalogue.ts`: analytes, groups, presets. `sources.ts`: every cited source. `parse.ts`: values, ranges, units, dates. `build.ts`: profile to measurements, phases, derived series, issues.
- `src/lib/profiles.svelte.ts`: the `db` state, profile and draw operations, `current` (everything derived from the active profile, including custom values).
- `src/lib/state.svelte.ts`: UI settings and the `filtered` view of the active profile. `prefs.svelte.ts`: language, second language, theme.
- `src/lib/analysis.ts`: reference resolution (`refsFor`, `primaryRef`, `fallbackRef`, `boundsFor`), status, formatting (locale aware), stats. `series.ts`: chart series and bands.
- `src/lib/i18n/`: `t` (proxy over the active dictionary), `tx` for catalogue texts, `nameOf` / `altNameOf`.
- `src/lib/io.ts`: export/import, agent JSON parsing, name matching, import preview. `files.ts`: IndexedDB. `checks.ts`: consistency checks.
- `src/lib/chart/Chart.svelte`: the one chart component. Views in `src/lib/components/`, the My data sections (profile card, draw list, medication timeline, checks, backup) in `src/lib/components/mydata/`.
- `src/lib/demo.ts`: four made up demo profiles ([DEMO] Raven fem HRT, Sam masc HRT, Lena cis woman, Max cis man), loaded together by `loadDemos`.
- Routes: `/` dashboard (grid, compare, matrix, table), `/analyte/[id]`, `/welcome`, `/data` (My data: profile, add results, draws, medication timeline, checks, backup; subpages `/manual`, `/agent`, `/import`), `/profiles` (own and demo profiles, new profile via `?new`), `/about` (linked from the footer only).

## Adding a value to the catalogue

1. Add it to the matching file in `src/lib/data/analytes/` with `name` and `info` in both languages, canonical `unit`, printed `units` with factors, `group`.
2. Add researched references with a `sources` id (add the source to `sources.ts` with a DOI or URL). Set `therapy` or `age` where a range only applies there, and `primary` per therapy.
3. The agent instructions, schema, search and manual entry pick it up automatically.
4. `bun run check`, `bun run lint`, look at it with `bun run dev`.

## Conventions

- Comments follow the `alya:code-comments` skill.
- Reference kind colours are a validated palette in a fixed order: target blue, context orange, trans aqua, clinical yellow, cis women magenta, cis men violet, adults sienna (added 2026-09-25, passes the adjacent pair checks in light and dark), lab grey. Data line is ink. Status colours are never reused for series.
- One y axis per chart. Different units are compared through normalisation (Compare view), never a second axis.
- Route files import from `#lib/...` with an explicit `.js` extension (`#lib/data/index.js`).
- Empty date and time inputs and unset selects get the `empty` class (muted until focused), placeholders use `--ink-3`.
- Template declaration tags need `$derived`: `{const x = $derived(expr)}`. A bare `{const x = expr}` is computed once per block and goes stale (this froze chart markers when the x axis changed).
- Files ending in `.svelte.ts` must not create `Date`, `Map` or `Set` instances that eslint's `prefer-svelte-reactivity` flags. Date helpers live in `data/parse.ts` (`nowIso`, `todayIso`).
- Tests: `CHROMIUM=<path to chrome.exe> npx playwright test` runs the e2e tests against a production build when Playwright's pinned browser is not installed. The tests fail on any console error, which catches CSP violations.
- `bash` heredocs through the agent tool can lose backslashes: edit regexes with the Edit tool.
