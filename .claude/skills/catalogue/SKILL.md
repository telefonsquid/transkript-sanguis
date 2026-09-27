---
name: catalogue
description: Adding or changing values in the Transkript Sanguis catalogue, their reference ranges, units, unit conversion, value texts, sources and derived (computed) series. Use when touching src/lib/data/analytes, src/lib/data/info, sources.ts, units.ts, formulas.ts, judge.ts or the reference logic.
---

# Catalogue

The catalogue is every value the app knows: names, units, researched reference ranges, texts and sources. The hard rule from `CLAUDE.md` applies everywhere here: every reference range cites a `sources` entry, no guessed numbers.

## Adding a value

1. Add it to the matching file in `src/lib/data/analytes/` with `name` in both languages, canonical `unit`, printed `units` with factors, `group`.
2. Add researched references with a `sources` id (add the source to `sources.ts` with a DOI or URL). Set `therapy` or `age` where a range only applies there, and `primary` per therapy.
3. Add its texts to the matching file in `src/lib/data/info/` in both languages with the same fields, plus `cites` (see Value texts under Decisions). The build fails without them.
4. The agent instructions, schema, search and manual entry pick it up automatically.
5. `bun run check`, `bun run lint`, look at it with `bun run dev`.

## Decisions

- **Value texts:** `src/lib/data/info/<area>.ts` holds the explanations apart from the ranges. `what`, `why`, `high`, `low` are general and must make sense without HRT. HRT specifics go only into `fem` / `masc`, shown in a box tinted in the flag colours (`hrt-note` in `Focus.svelte`) on profiles with that therapy. `more` is the longer background behind "Show more" (paragraphs split by a blank line), `note` covers units and sampling. `cites` lists `sources` ids shown under the text, and a text that names a study in brackets cites it. `catalogue.ts` throws on a value without text, on English and German texts with different fields and on unknown source ids.
- **Values are stored exactly as printed** (`Result.value` is a string like `"<0,3"`). `unit` is left out when it is the canonical one. The printed range is `low` / `high`, numbers in the printed unit, either may be missing for one sided ranges, text that is no plain range goes to `rangeNote`. Old results with a `ref` string are migrated on load and on backup import (`migrateRange` in `profiles.svelte.ts`). Parsing and unit conversion happen at build time of the view (`src/lib/data/build.ts`), so fixing a unit table fixes old data too. Unreadable values become issues on the Data page, never errors.
- **Canonical units:** each analyte has one canonical unit, `units` lists printed alternatives with a factor to canonical, `si` is the display alternative. Lab ranges convert with the same factor. Quantities without a fixed factor (Lp(a) mg/dl vs nmol/l, HbA1c % vs mmol/mol) are separate analytes.
- **Unit conversion** (`src/lib/data/units.ts`): units are read as amount per volume (mass, molar, U, eq, cell counts) with SI prefixes, so any spelling of the same quantity converts by its scale, and across quantities through a unit the catalogue lists with its factor (no molar masses in the code). `cleanUnit` undoes what OCR and chat models do (LaTeX, spaces, 1 or I for l, o1 for ol). Units outside that grammar (%, ratios, ml/min/1.73 m²) match by spelling only. `unitChoices` is what the app accepts per value (listed units plus common spellings within a factor of about 300). The catalogue refuses to build when a listed factor disagrees with the one its spelling implies (`unitConflicts`).
- **Lab ranges are stored per value**, labs switch ranges (for example from male to female) over time.
- **References:** kinds `target`, `context`, `trans` (cohorts on HRT), `clinical`, `adult`, `female`, `male`, plus the printed `lab` range. Refs can be limited to a therapy (`therapy`) and an age band (`age`). `primary` names the default reference per therapy (`feminizing`, `masculinizing`, `any`). On profiles without HRT the ref matching the sex assigned at birth, then `adult`, is used. Without a default, "Best fit" (`bestRef`) falls back to a curated ref before the printed lab range: `trans` of the same therapy, then `adult`, `clinical`, `target`, never a cis sex range (a suppressed LH would read as a false "low"). Values with only cis sex ranges name their default per therapy: the affirmed gender for free testosterone, DHT, LDH, ESR and homocysteine (estradiol lowers and testosterone raises homocysteine), the male range for AMH on feminizing HRT (it comes from the testes). Only PSA for people assigned female at birth has none. Overview cards always draw the printed lab range next to the judged band and name both in the footer. In the focus view the printed lab range switches on and off like the curated ones (`shown.lab` overrides the References setting). LH and FSH on HRT default to the Greene 2021 trans cohort ranges, lower limit left open because the printed one is the assay floor.
- **Reference sources for general chemistry:** Roche method sheets first (most German labs run Roche cobas), then the CDC NHANES 2017–2018 procedure manuals (Roche cobas 6000), open access population studies (Sysmex XN blood counts, ELSA-Brasil MCHC, NHANES III homocysteine, NHANES I magnesium), university lab directories (Ulm, Düsseldorf) for clotting. Blood count values on stable HRT follow the affirmed gender (Greene 2019), so trans refs repeat the cis range of that gender and say so. Every value carries at least one range that is not trans specific (`adult`, `female`, `male` or `clinical`). Sodium, potassium and the NCEP cholesterol cutoff come from the NHANES biochemistry manual, PSA (age bands, men) and AMH (age bands, women) from Roche Elecsys method sheets, measured free testosterone and DHT from Mayo Clinic's mass spectrometry ranges (immunoassays read differently, the notes say so), absolute NRBC from Meredith 2024. Weight uses the WHO BMI range with `perHeight`: the bounds are BMI values that `refsFor` multiplies by the profile height squared, without a height the ref is dropped, and unit guesses ignore it.
- **Derived series** (always marked, hollow diamonds, formulas in `src/lib/data/formulas.ts` with unit tests next to them): eGFR CKD-EPI 2009 female and male from creatinine, eGFR from cystatin C (CKD-EPI 2012), non-HDL, LDL/HDL, FAI and calculated free testosterone (Vermeulen, 4.3 g/dl albumin when not measured, censored testosterone propagates), HOMA-IR, transferrin saturation, BMI. On HRT profiles both sexes' equations are computed. A value the lab printed always wins over the computed one. Each computed measurement lists its `inputs` (analyte, value, unit, derived or not) so the tooltip can name what it was computed from in the current units (`fmtInputs`).

## Where the logic lives

- `src/lib/data/judge.ts`: pure reference resolution and judging (`refsFor`, `primaryRef`, `fallbackRef`, `bestRef`, `basisRef`, `boundsFor`, `labBounds`, `statusOf`, `position`). It takes a `Subject` (therapy, sex, age, height) instead of reading the active profile, so tests build one by hand.
- `src/lib/data/formulas.ts`: the equations behind derived series, plain numbers in and out.
- `src/lib/data/build.ts`: profile to measurements, applies the formulas, records `inputs`.
- `src/lib/data/units.ts`: unit reading, conversion, accepted units, guesses.
- Every measurement is judged once per settings change in `Filtered.judged` (`state.svelte.ts`), views ask `judge(m)` from `view.svelte.ts` instead of recomputing bounds.

## Checks

- `bun run test:unit` covers parsing, units, formulas and judging. A catalogue change that breaks a listed unit factor fails `units.test.ts`.
- `bun run check` fails on a value without texts or with an unknown source id.
