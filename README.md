# vahor.fr

My portfolio and writing, built with Astro.

[![Code quality](https://github.com/vahor-labs/vahor.fr/actions/workflows/quality.yaml/badge.svg)](https://github.com/vahor-labs/vahor.fr/actions/workflows/quality.yaml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Visit vahor.fr](https://vahor.fr) · [Quick start](#quick-start) · [Container](#container) · [Contributing](CONTRIBUTING.md)

![Homepage of vahor.fr](docs/assets/homepage.png)

- **Writing in MDX** with tags, RSS, Markdown exports and generated social images.
- **Lightweight by default** with on-demand search and no React runtime.
- **Server-rendered listening activity** with optional Spotify and Redis integration.

## Quick start

Use Node 26 and Bun:

```sh
bun install --frozen-lockfile
bun dev
```

Local builds require no secrets. Spotify is optional; without it, the listening
block is omitted. See [CONTRIBUTING.md](CONTRIBUTING.md) for development checks.

## How it works

| Area | Implementation |
| --- | --- |
| Pages and articles | Astro + MDX; static output except the homepage and legacy redirects |
| Search | Fuse and its index load only when search opens |
| Feeds | RSS at `/rss.xml`, sitemap at `/sitemap-index.xml` |
| Images | Astro image processing and build-time social cards |
| Runtime | Node standalone container; Spotify fetched on the server |

<details>
<summary>Rendering, accessibility and published-URL compatibility</summary>

Static Astro portfolio and MDX blog, deployed as a Node container. Pages, tags, RSS,
Markdown exports and social images are generated at build time. No React runtime
is shipped. Search loads Fuse and its index only when opened; comments load near
the bottom of articles. The homepage is server-rendered with Spotify embedded in
the initial HTML. There is no Spotify browser
fetch or generic fallback. Other pages and social-image PNGs remain static;
legacy social-image redirects are server endpoints.

Search deliberately uses native result links: arrow keys move focus to a link,
Enter follows it, and Escape closes the dialog and restores focus to its opener.
To refine the query after navigating results, focus the search field again
(Shift+Tab from the first result, past the close button, or click the field).
This avoids an incomplete active-descendant combobox implementation.

Sitemaps use `@astrojs/sitemap` at `/sitemap-index.xml`; the previous
`/sitemap.xml` URL redirects there. The server-rendered homepage is explicitly
included alongside discovered static pages. RSS uses `@astrojs/rss` at the
unchanged `/rss.xml` URL, retaining article GUIDs and feed metadata.

Article image sources live in `src/assets` and use Astro's `Image` component
with intrinsic dimensions and lossless WebP encoding. SVGs stay vector images.
The original `public/` images are retained for published URLs and Markdown
exports; keep these compatibility copies when updating existing images.
RSS channel metadata is serialized from an object with `fast-xml-builder`.

</details>

## Container

Build and run the production image:

```sh
docker build -t vahor-fr .
docker run --rm -p 4321:4321 --env-file .env.production.local vahor-fr
```

The container stores the Astro standalone server in `dist/`. Pass the Spotify
and Upstash variables at runtime; they are not needed during the image build.

Biome's unused-import/variable rules are disabled for `.astro` files because
template references are not counted as frontmatter usage. `astro check` validates
those references instead; do not auto-remove imports used by templates.

## Integrations

> [!NOTE]
> Credentials belong in the server environment, never in `PUBLIC_` variables,
> committed files or issue reports.

<details>
<summary>Spotify, Redis, URL previews and comments</summary>

Local builds require no secrets. Configure `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
(or the Vercel KV aliases `KV_REST_API_URL` and `KV_REST_API_TOKEN`) in the hosting
environment to enable Spotify. Redis must already contain the private
`spotify:refreshToken` value from the existing integration. Do not put secrets in
`PUBLIC_` variables. The homepage fetches the top track on the server and embeds
it directly in the HTML, so it works without JavaScript. If Spotify is
unavailable or has no top track, the whole listening block is omitted; there is
no generic fallback or client-side Spotify request.
The refresh token must belong to the same Spotify app and authorize `user-top-read`.
`scripts/spotify.sh` starts that authorization flow and requires macOS's `open`,
`curl` and `jq`, with the Spotify client ID and secret exported in the shell.
On other platforms, open the authorization URL manually or adapt the browser
launcher before running the script. Its redirect URI must match
the URI registered in the Spotify app. Store the returned refresh token in Redis
under `spotify:refreshToken`, without expiry. An access token is refreshed and
cached automatically. Reuse the existing app and Redis database if already set up.
Configure the four variables in the container environment and restart it after
changing them. For local runs, export them into the server process environment.
Never commit credentials or paste tokens into logs.
URL-preview metadata is fetched at build time and optionally cached in Redis.
Network access is needed for remote preview metadata; unavailable preview images
can use the transparent fallback. Giscus retains the original repository/category
and pathname mapping; no authenticated comment posting is part of local checks.

</details>

## Compatibility notes

<details>
<summary>Dependency pins and upgrade constraints</summary>

Dependencies were reviewed and upgraded where compatible, including major
versions. Some retained packages already satisfied the review or remain on their
existing release; this is not a claim that every package changed or is the latest
registry release. Explicit compatibility pins are:

- TypeScript stays on `~6.0.3`: TypeScript 7 removes compiler APIs needed by
  Twoslash and is rejected by the installed Astro checker.
- D2 stays on `0.1.23`: tested published versions 0.1.27–0.1.33 reject the
  existing article's wildcard style rule. Retaining the pin preserves diagrams
  without rewriting historical content.

</details>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, checks and pull requests.
Found a bug or have an idea? Use the [issue forms](https://github.com/vahor-labs/vahor.fr/issues/new/choose).

## License

[MIT](LICENSE).
