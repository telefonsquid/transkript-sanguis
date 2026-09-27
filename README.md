<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.png">
  <img src="docs/assets/logo-light.png" alt="Transkript Sanguis" width="420">
</picture>

**An open source app for tracking and analyzing blood tests, with hormone therapy support.**

<a href="https://transkript-sanguis.henkys.dev"><b>Open in Browser</b></a>
&nbsp;&nbsp;&bull;&nbsp;&nbsp;
<a href="https://github.com/telefonsquid/transkript-sanguis/releases/latest"><b>Download Desktop App</b></a>

[![License: MIT](https://img.shields.io/badge/license-MIT-a8172b?style=flat-square)](LICENSE)
![Languages](https://img.shields.io/badge/lang-EN%20%7C%20DE-a8172b?style=flat-square)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/overview-dark.png">
  <img src="docs/assets/overview-light.png" alt="Overview of a demo profile on feminizing HRT: a grid of charts with reference bands and the medication timeline on top" width="80%">
</picture>

</div>

Transkript Sanguis is an open source application for tracking and analyzing blood tests. It charts every value over time against reference ranges from published research, each with its source, and explains what the value measures and what a shift up or down can mean.

It comes with extensive support for hormone therapy: feminizing and masculinizing profiles, ranges from trans cohorts and treatment targets, a medication timeline laid over the charts and notes on how the therapy affects each value. Everything you enter stays in your browser.

> [!IMPORTANT]
> **Not medical advice.** The ranges and texts are collected from guidelines, studies and assay method sheets and cited on every value. They do not replace your doctor.


## Features

- Collects and charts blood test results over time
- Reference ranges for cis women, cis men, feminizing and masculinizing HRT, trans cohorts, clinical cutoffs and the lab's printed range. Each range cites its source.
- All data is stored in the browser. Nothing is sent to a server
- 100+ values and reference ranges
- Customizable medication timeline
- Consistency checks for typing and parsing errors
- Enter values by hand or let your AI Agent handle it
- Multiple profiles support
- Installable as a PWA
- Conversion between conventional and SI units
- Computed values: eGFR, calculated free testosterone, free androgen index, HOMA-IR and others

## Screenshots

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/focus-dark.png">
    <img src="docs/assets/focus-light.png" alt="Focus page of estradiol with the HRT target band, the timeline and the explanation" width="49%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/compare-dark.png">
    <img src="docs/assets/compare-light.png" alt="Compare view with four sex hormones as percent of their reference range" width="49%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/matrix-dark.png">
    <img src="docs/assets/matrix-light.png" alt="Matrix heatmap of every value per blood draw, coloured by distance from the range" width="49%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/data-dark.png">
    <img src="docs/assets/data-light.png" alt="My data with the profile, the blood draws and the medication timeline" width="49%">
  </picture>
</p>

## Host it yourself

The build is a static single page app. With Docker:

```sh
docker compose up -d --build   # http://localhost:8080
```

The image builds with bun and serves the files from an unprivileged nginx with SPA fallback, security headers and no access log. Any other static host works too: serve `build/` and fall back to `200.html` for unknown paths.

## AI disclosure

> This project was supported by AI-assisted coding tools. In fact, about ~90% of the code was generated using Claude Opus 5.5. I am a full stack developer and have been working with SvelteKit for years, so there was a lot of direction and code review involved. I'm all too aware and concerned about the negative effects of AI on society, the environment, and the world as a whole and in no way endorse it. Yet, while I had a project like this planned for years now, I would've never found the required time to see it through. So take it with a grain of salt but AI allowed this project to exist in the first place.

## Development

SvelteKit with Svelte 5, Tailwind 4 and TypeScript, [bun](https://bun.sh) as package manager and test runner.

```sh
bun install
bun run dev          # http://localhost:5173
bun run check        # types
bun run lint
bun run test:unit    # catalogue, units, formulas, parsing
npx playwright test  # end to end against a production build
bun run build        # static site in build/
```

- Set `CHROMIUM` to a Chrome executable if Playwright's pinned browser is not installed. The e2e tests fail on any console error, which catches CSP violations.
- `node scripts/icons.ts` renders the PNG app icons from `static/favicon.svg`.
- `node scripts/readme.ts` renders the images in this README from the demo profiles against a running app (`BASE`, default `http://localhost:5173`).

Decisions and conventions live in [CLAUDE.md](CLAUDE.md) and the project skills under `.claude/skills/`.

## License

MIT. See [LICENSE](LICENSE).
