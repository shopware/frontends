# Studio - Composable Frontends (CMS)

Standalone [Sanity Studio](https://www.sanity.io/) for the
[`sanity-cms`](../sanity-cms) example. This is the **content editor (CMS)** where
you compose pages with a Page Builder; the Nuxt app reads what you publish here.

- **Project:** `0celbjjf`
- **Dataset:** `production`

## Content model

A `page` document has a **Page Builder** (`pageBuilder[]`) - an ordered list of
section blocks the editor arranges freely:

| Block | Renders as | Notes |
|-------|------------|-------|
| `hero` | Gradient hero | eyebrow, heading, subheading, CTA, optional image |
| `featuredProducts` | Product grid | stores **Shopware product IDs only**; the storefront resolves live data |
| `richText` | Portable Text | rich content |
| `banner` | Gradient CTA band | heading, text, CTA |
| `gallery` | Image grid | Sanity images |

Each block has a matching Vue component in [`../sanity-cms/app/components/sections`](../sanity-cms/app/components/sections).

## Run it

```bash
pnpm install
pnpm dev          # open http://localhost:3333
```

## Deploy schema & seed sample content

These commands need a token with write access. Put it in your environment as
`SANITY_AUTH_TOKEN` (create one at
https://www.sanity.io/manage/project/0celbjjf → API → Tokens, "Editor"):

```bash
pnpm schema:deploy   # upload the schema to the Content Lake
pnpm seed            # import seed.ndjson (a sample "home" page)
```

## Connect a frontend

Allow your storefront's dev origin to read drafts / use Presentation:

```bash
npx sanity cors add http://localhost:3000 --credentials
```
