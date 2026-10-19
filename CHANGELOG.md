## 0.1.21 (2026-10-19)

### 🚀 Features

- **backup:** weekly D1 export to R2 ([ffe392a](https://github.com/schreibse/koshi-web/commit/ffe392a))
- **functions:** file complaint sheets in D1 with gap-free yearly numbers ([34b4284](https://github.com/schreibse/koshi-web/commit/34b4284))
- **reclamaciones:** add the Libro de Reclamaciones form and receipt pages ([2a55c99](https://github.com/schreibse/koshi-web/commit/2a55c99))
- **reclamaciones:** show the fiscal address on the sheet ([7fcfb05](https://github.com/schreibse/koshi-web/commit/7fcfb05))
- **reclamaciones:** add the privacy notice for the complaint sheet ([5dfe4d7](https://github.com/schreibse/koshi-web/commit/5dfe4d7))
- **reclamaciones:** protect the sheet with Turnstile ([a59f9c6](https://github.com/schreibse/koshi-web/commit/a59f9c6))
- **reclamaciones:** describe the sheet and privacy pages for search ([6b11435](https://github.com/schreibse/koshi-web/commit/6b11435))
- **reclamaciones:** check document numbers by type, add CPP/PTP, RUC and Otro ([b83bc0e](https://github.com/schreibse/koshi-web/commit/b83bc0e))
- **reclamaciones:** render the Libro statically with a page-only form script ([01233fb](https://github.com/schreibse/koshi-web/commit/01233fb))
- **reclamaciones:** email the consumer and Koshi a copy of each sheet ([8862b85](https://github.com/schreibse/koshi-web/commit/8862b85))
- **reclamaciones:** name Sweego, Proton and the rights email in the privacy notice ([81a9d83](https://github.com/schreibse/koshi-web/commit/81a9d83))
- **reclamaciones:** give the registered database name and code in the privacy notice ([e00f818](https://github.com/schreibse/koshi-web/commit/e00f818))
- **web:** link the Libro de Reclamaciones from the footer ([8e753e4](https://github.com/schreibse/koshi-web/commit/8e753e4))

### 🩹 Fixes

- **backup:** start the export from a cron trigger and poll it in one step ([25348c1](https://github.com/schreibse/koshi-web/commit/25348c1))
- **reclamaciones:** print the receipt without site chrome, provider rows aligned ([181a1e8](https://github.com/schreibse/koshi-web/commit/181a1e8))
- **web:** stop Cloudflare preloading chunks from the wrong path ([eb272f1](https://github.com/schreibse/koshi-web/commit/eb272f1))
- **web:** let each page set its title so extract-i18n keeps it ([dd485fb](https://github.com/schreibse/koshi-web/commit/dd485fb))

## 0.1.20 (2026-10-14)

### 🩹 Fixes

- **home:** drop the WhatsApp button until there is a number ([b86ba64](https://github.com/schreibse/koshi-web/commit/b86ba64))

## 0.1.19 (2026-10-14)

### 🩹 Fixes

- **web:** keep Cloudflare's managed robots.txt ([b136543](https://github.com/schreibse/koshi-web/commit/b136543))

## 0.1.18 (2026-10-14)

### 🚀 Features

- **web:** link previews, a sitemap and a 960px screenshot ([ff24eab](https://github.com/schreibse/koshi-web/commit/ff24eab))

## 0.1.17 (2026-10-13)

### 🔥 Performance

- **home:** load the case study screenshot first ([7ae1e68](https://github.com/schreibse/koshi-web/commit/7ae1e68))

## 0.1.16 (2026-10-13)

### 🔥 Performance

- **web:** no router in the browser bundle ([02407e8](https://github.com/schreibse/koshi-web/commit/02407e8))

## 0.1.15 (2026-10-13)

### 🔥 Performance

- **web:** less work at startup on the home page ([cdaea26](https://github.com/schreibse/koshi-web/commit/cdaea26))

## 0.1.14 (2026-10-13)

### 🚀 Features

- **web:** interim k favicon in the wordmark style ([8cc8fe7](https://github.com/schreibse/koshi-web/commit/8cc8fe7))

## 0.1.13 (2026-10-13)

### 🚀 Features

- **empresas:** plaza de armas illustration in the example site ([9e46970](https://github.com/schreibse/koshi-web/commit/9e46970))

## 0.1.12 (2026-10-13)

### 🚀 Features

- **theme:** warmer light mode and section bands ([58034cb](https://github.com/schreibse/koshi-web/commit/58034cb))

## 0.1.11 (2026-10-12)

### 🚀 Features

- **home:** case study of this site, linked from the projects section ([424acfe](https://github.com/schreibse/koshi-web/commit/424acfe))

### 🩹 Fixes

- **home:** case study wording in Peruvian Spanish ([b3bb743](https://github.com/schreibse/koshi-web/commit/b3bb743))

## 0.1.10 (2026-10-12)

### 🩹 Fixes

- **home:** really swap the example's languages without a fade ([b4bc61b](https://github.com/schreibse/koshi-web/commit/b4bc61b))

## 0.1.9 (2026-10-12)

### 🚀 Features

- **web:** a 404 page, cross-locale redirects and slashed page URLs ([92caf7a](https://github.com/schreibse/koshi-web/commit/92caf7a))

### 🩹 Fixes

- **home:** swap the example's languages without a fade ([37cdce9](https://github.com/schreibse/koshi-web/commit/37cdce9))

## 0.1.8 (2026-10-12)

### 🚀 Features

- **home:** add the business page and sharpen the home hero ([aab4088](https://github.com/schreibse/koshi-web/commit/aab4088))
- **home:** show a Cusco guesthouse as the business page example ([d980e81](https://github.com/schreibse/koshi-web/commit/d980e81))
- **web:** give pages a slug per locale ([d2305f1](https://github.com/schreibse/koshi-web/commit/d2305f1))

### 🩹 Fixes

- **home:** fit the hero code on phones without scrolling ([6e92494](https://github.com/schreibse/koshi-web/commit/6e92494))

## 0.1.7 (2026-10-12)

### 🚀 Features

- **home:** show the process as a five-stage pipeline, hydrated on scroll ([5f185fd](https://github.com/schreibse/koshi-web/commit/5f185fd))

### 🩹 Fixes

- **web:** hydrate pages with i18n instead of rendering them twice ([bc3b8ef](https://github.com/schreibse/koshi-web/commit/bc3b8ef))

## 0.1.6 (2026-10-11)

### 🚀 Features

- **home:** show sixteen tools, four by four, with ESLint and Git ([38d2b4a](https://github.com/schreibse/koshi-web/commit/38d2b4a))

## 0.1.5 (2026-10-11)

### 🚀 Features

- **home:** add NgRx, PostgreSQL, Tailwind CSS, Storybook and Playwright to the stack ([1a4f3de](https://github.com/schreibse/koshi-web/commit/1a4f3de))

### 🩹 Fixes

- **web:** load Geist as before and keep the hero heading one height in any font ([5c36db0](https://github.com/schreibse/koshi-web/commit/5c36db0))

## 0.1.4 (2026-10-11)

### 🩹 Fixes

- **web:** preload Geist and stop it repainting the hero late ([472ea00](https://github.com/schreibse/koshi-web/commit/472ea00))

## 0.1.3 (2026-10-11)

### 🚀 Features

- **home:** group the services for development teams and show the tech stack ([aeef5d3](https://github.com/schreibse/koshi-web/commit/aeef5d3))

### 🩹 Fixes

- **web:** match the font fallback to Geist's metrics ([538183b](https://github.com/schreibse/koshi-web/commit/538183b))

## 0.1.2 (2026-10-11)

### 🚀 Features

- **web:** move the site and contact address to koshisoftware.pe ([c2a159f](https://github.com/schreibse/koshi-web/commit/c2a159f))

## 0.1.1 (2026-10-09)

### 🚀 Features

- **home:** show an editor with web and api code in the hero ([6e4092a](https://github.com/schreibse/koshi-web/commit/6e4092a))
- **home:** tint the process section in sage ([b3f4e34](https://github.com/schreibse/koshi-web/commit/b3f4e34))
- **web:** add per-locale title, description and hreflang links ([2bf5667](https://github.com/schreibse/koshi-web/commit/2bf5667))
- **web:** self-host Geist instead of Bricolage Grotesque ([457fcfc](https://github.com/schreibse/koshi-web/commit/457fcfc))
- **web:** drop the Shipibo note, add legal name, RUC and address to the footer ([830df2c](https://github.com/schreibse/koshi-web/commit/830df2c))

### 🩹 Fixes

- **functions:** redirect HEAD requests to the root ([7e971dd](https://github.com/schreibse/koshi-web/commit/7e971dd))
- **home:** keep the hero editor's height when its tabs swap ([ad25871](https://github.com/schreibse/koshi-web/commit/ad25871))

## 0.1.0 (2026-10-09)

### 🩹 Fixes

- **ci:** allow nx and swc build scripts ([9a737a0](https://github.com/schreibse/koshi-web/commit/9a737a0))
