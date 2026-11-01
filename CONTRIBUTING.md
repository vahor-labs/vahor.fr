# Contributing

Small fixes are welcome without an issue first. For larger changes, open an
issue to agree on the scope before starting.

## Local development

Fork and clone this repository, then create a branch for your change. Use
Node.js 26 and Bun:

```sh
bun install --frozen-lockfile
bun dev
```

Local builds do not require secrets. Optional integrations may be unavailable;
do not add credentials or put secrets in `PUBLIC_` variables.

## Checks

Run from the repository root:

```sh
bun run typecheck
bunx biome ci .
bun run build
```

There is currently no test script in `package.json`. For UI changes, also check
the affected pages in a browser, including narrow layouts and keyboard access.
For a production preview, run `bun run start --port 4321` after building.

## Pull requests and reports

Keep changes focused. Describe the problem, the approach, and the checks you ran
(including anything you could not verify). Include before/after screenshots for
visual changes. Preserve existing published URLs and third-party notices.

Use the issue forms for bugs and feature requests. Reports and pull requests
are public: never include credentials, private configurations, private URLs,
or unsanitized logs. Use minimal examples with placeholder values instead.
