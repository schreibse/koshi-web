# koshisoftware

[![CI](https://github.com/schreibse/koshi-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/schreibse/koshi-web/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/schreibse/koshi-web)](LICENSE)
[![Angular](https://img.shields.io/github/package-json/dependency-version/schreibse/koshi-web/@angular/core?logo=angular&label=angular)](https://angular.dev)
[![Nx](https://img.shields.io/github/package-json/dependency-version/schreibse/koshi-web/dev/nx?logo=nx&label=nx)](https://nx.dev)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/schreibse/koshi-web/dev/typescript?logo=typescript&label=typescript)](https://www.typescriptlang.org)

The website of Koshisoftware E.I.R.L.: senior Angular frontend and NestJS backend work for
clients in Peru and abroad. _Koshi_ means "strong" in Shipibo.

The site is bilingual (Spanish and English), prerendered to static HTML and deployed to Cloudflare Pages.

## Stack

- **Angular 22**: zoneless, signals, OnPush, built-in i18n, `outputMode: static`
- **Nx 23**: integrated monorepo, module boundaries derived from folder paths
- **Tailwind CSS 4**: utilities only, colours from brand tokens with light and dark themes
- **Vitest** for unit tests, **Playwright** with **axe** for end-to-end and accessibility checks
- **Cloudflare Pages**: static hosting, plus one Pages Function that redirects `/` by `Accept-Language`

## Layout

```
apps/web                 the Angular app (shell, routes, i18n)
apps/web-e2e             Playwright smoke and axe tests against the static build
libs/frontend/<domain>/  feature and ui libraries
libs/shared/<domain>/    framework-free code, shared with the edge function
functions/               Cloudflare Pages Functions
tools/nx/path-tags.ts    derives project tags (platform, scope, type) from the path
```

Tags are never written by hand. A project outside this layout fails the project graph, and
`@nx/enforce-module-boundaries` rejects imports that cross platform or type rules.

## Development

Node 24 and pnpm (version pinned in `packageManager`).

```sh
pnpm install
pnpm nx serve web                  # dev server, Spanish locale
pnpm nx build web                  # prerenders /es and /en into dist/apps/web/browser
pnpm nx run-many -t lint stylelint typecheck test
pnpm nx e2e web-e2e                # builds, serves on :4890, runs Playwright
pnpm nx extract-i18n web           # refresh source messages after changing copy
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (checked by commitlint).
`main` is protected: every change goes through a pull request with green CI.

## Releasing

Versions and `CHANGELOG.md` come from the Conventional Commits via Nx release. Because `main` is protected,
a release lands as a pull request first and is tagged after the merge:

```sh
git switch -c release/next
pnpm nx release --skip-publish           # bumps apps/web/package.json, writes CHANGELOG.md, commits
# open a PR, rebase-merge it, then on main:
git tag -a vX.Y.Z -m vX.Y.Z && git push origin vX.Y.Z
gh release create vX.Y.Z --verify-tag --notes-file <(awk '/^## /{n++} n==1' CHANGELOG.md | tail -n +2)
```

## License

The code is [MIT](LICENSE)-licensed. The Koshisoftware name, wordmark, site copy and images are not
covered by the license and may not be reused.
