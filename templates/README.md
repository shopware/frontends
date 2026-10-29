# Template, layer or package?

How we decide the shape of new work. Most new work does not need a new template. Answer the questions below before anyone proposes a new template, layer, package or example.

The questions come from our earlier decisions: B2B ([#2657](https://github.com/shopware/frontends/issues/2657#issuecomment-5928341830)), prerendering ([#2655](https://github.com/shopware/frontends/issues/2655#issuecomment-5730660176)), the layer experiments ([#1714](https://github.com/shopware/frontends/issues/1714), [#1797](https://github.com/shopware/frontends/issues/1797#issuecomment-2804702807)) and the templates epic ([#2634](https://github.com/shopware/frontends/issues/2634)). They cover code we ship in this repo. Shop projects and partners can build on the starter however they like.

## Short answer

We build a new template only for a new kind of shop or a separate app, like B2B. We ship a Nuxt layer only for one shared add-on, like CMS rendering or design tokens. We add to an existing layer first. Shared Store API logic goes into a package, and a feature every shop wants goes into the starter. A feature only some shops want becomes an example. Anything not ready for these starts as a spike: a short proof that may be thrown away.

## The questions

Answer the questions for each part of the work, and the first yes picks its shape. A part is one piece you could ship alone, like a composable or a page. Bug fixes, docs, chores and refactors skip the questions and go where the code lives.

| #   | Question                                  | If yes                                 | If no         |
| --- | ----------------------------------------- | -------------------------------------- | ------------- |
| 1   | Store API logic, no UI, used by two apps? | Package, if the route has shipped      | Next question |
| 2   | Non-Nuxt, or backend not ready?           | Spike, then answer again               | Next question |
| 3   | Same app as the starter, only config?     | Starter change, as a documented mode   | Next question |
| 4   | New kind of shop, or separate app?        | New template, after team sign-off      | Next question |
| 5   | Shared add-on, not a shop feature?        | Published layer, an existing one first | Next question |
| 6   | Every shop wants it by default?           | Starter change                         | Example       |

"The starter" is `templates/vue-starter-template`.

`templates/manifest.json` lists the templates we ship today, with a `supportLevel` per entry. `vue-starter-template-extended` (Lumora) is not a shape these questions produce. It shows shop projects how to extend the starter as a Nuxt layer, and it cannot leave the monorepo: its entry is `scaffoldable: false`, and its `notes` field says why. Shop projects can follow that pattern. Work we ship here still answers the questions, so one brand's tokens stay a starter mode, see question 3. `astro` and `vue-vite-blank` show the API client outside Nuxt, not a storefront. `vue-blank` is an empty Nuxt app with the packages installed, and `vue-demo-store` is deprecated ([#2667](https://github.com/shopware/frontends/pull/2667)), so neither is a model for new work. If templates move to their own repository ([#2634](https://github.com/shopware/frontends/issues/2634), answer 6), the starter and Lumora move together.

### 1. Store API logic, no UI, used by two apps?

Store API logic that two apps use goes into a package: `@shopware/composables`, `@shopware/api-client` or `@shopware/helpers`. "Two apps" means two templates or examples in this repo today, or one named in an issue. Logic with one consumer stays next to its UI. The route must already be in a released Shopware version, because a package is published with semver. Logic for an unshipped route goes to question 2 instead.

Routes that only an extension adds, like SwagCommercial, answer no. Their logic stays with the example or template that uses it. Vendor logic, like tracking for one analytics tool, answers no too.

### 2. Non-Nuxt, or backend not ready?

A non-Nuxt app cannot use our Nuxt layers, so `@shopware/cms-base-layer` cannot be reused there ([#2656](https://github.com/shopware/frontends/issues/2656)). For React and Next, [#2723](https://github.com/shopware/frontends/issues/2723) decides if a template is viable at all.

"Backend not ready" means Shopware lacks the feature, or the demo backend cannot run it. Data you can seed yourself is not a blocker, see New template step 7. This matters for a template or a starter change, because every template runs against the public demo backend with no configuration. An example may need its own backend, like an installed payment plugin. Its README lists that.

After the spike, answer the questions again, and skip question 2 for the part the spike settled. A non-Nuxt app never settles it, so it stays in `templates/` with `supportLevel: example`, like `astro` or `vue-vite-blank`, or a project outside this repo, until [#2723](https://github.com/shopware/frontends/issues/2723) decides that a non-Nuxt template is viable. If it does, the decision note names the framework, the schema change in the Spike steps comes first, and New template step 3 applies to that framework instead of Nuxt.

### 3. Same app as the starter, only config?

Answer yes if only config values or the build mode change. That makes it a documented mode of the starter, not a new directory. Prerendering is planned this way: `nuxt generate` plus a config block, documented in [#2737](https://github.com/shopware/frontends/pull/2737).

One brand's theme tokens count as config. A token preset that other apps swap is reusable code, so answer no.

### 4. New kind of shop, or separate app?

Answer yes if a shop built on the starter would never turn it on. That happens when it changes who can log in, which prices they see or the checkout steps for every order. A new payment method is not one of these. A separate app with its own pages, like a sales agent app ([Discussion #522](https://github.com/shopware/frontends/discussions/522)), is also yes.

The B2B decision rests on this test: nobody extends a B2C shop with B2B. A new template goes against the epic goal of one supported starter. So it needs a decision note, a comment on the issue with the answers, and team sign-off there before any code.

### 5. Shared add-on, not a shop feature?

A published layer fits one opt-in add-on that apps add, replace or leave out. `@shopware/cms-base-layer` and `@shopware/unocss-design-tokens-layer` are the two today ([#2406](https://github.com/shopware/frontends/pull/2406)). `@shopware/composables/nuxt-layer` only wires up auto-imports. A new add-on must pass the same reuse bar as question 1.

Generic CMS elements that many shops can place go into `@shopware/cms-base-layer`. Elements for one campaign become an example. A feature tied to one vendor or one extension answers no here, even when many shops use it. Question 6 makes it an example.

A shop feature like wishlist, account pages or B2B is never a layer. We tried layers split by domain and dropped them ([#1714](https://github.com/shopware/frontends/issues/1714), [#1797](https://github.com/shopware/frontends/issues/1797#issuecomment-2804702807)). They needed each other's composables, which would lead to circular dependencies and shadowed config.

Answer no if the add-on must replace a starter page, route rule or composable. Layer precedence differs per file type and fails silently:

- The app wins on pages with the same path and on plain config values.
- Arrays like `modules` and `css` are merged ([Nuxt layers](https://nuxt.com/docs/4.x/guide/going-further/layers)).
- `routeRules` merge key by key. The app wins on every key it sets, so a layer cannot remove or change an app rule.
- Layer order decides components and auto-imported composables.

Adding any layer to the starter has a side effect. The starter pins its component dirs at `priority: 2` (`templates/vue-starter-template/nuxt.config.ts`). So an extra layer, a local `layers/*` folder or a new `extends` entry, can outrank them and replace same-named app components. A new `extends` entry can even lift `@shopware/cms-base-layer` above the app's CMS overrides.

### 6. Every shop wants it by default?

Answer yes if every starter shop should get it on day one. Then it is a starter change, like a better order history page.

Answer no if it is tied to one vendor, one extension or a few shops, like a payment provider. Then it becomes an example in `examples/`, like `adyen-dropin-component` or `commercial-quick-order`. This keeps the starter free of features only some shops want ([Discussion #38](https://github.com/shopware/frontends/discussions/38)).

## What each shape costs

A template is cheap to change but costly to keep in sync with the starter. A layer is easy to update but hard to override safely.

|                       | Starter change                    | Package                                | Published layer                                           | Example                                | New template                           |
| --------------------- | --------------------------------- | -------------------------------------- | --------------------------------------------------------- | -------------------------------------- | -------------------------------------- |
| Owner                 | Frontends team                    | Frontends team                         | Frontends team                                            | Frontends team                         | A named owner and a backup             |
| How users start       | `npx tiged` the starter           | Comes with the starter                 | `pnpm add`, plus an `extends` entry                       | Copy the code from `examples/`         | Its own scaffold command               |
| How users get updates | By hand                           | `pnpm update` (templates pin `canary`) | `pnpm update` (templates pin `canary`)                    | By hand                                | By hand                                |
| Published             | No                                | Yes, semver and changesets             | Yes, semver and changesets                                | No                                     | No                                     |
| Overriding            | The user owns every file          | An app composable shadows it           | Differs per file type, see question 5                     | The user owns every file               | The user owns every file               |
| For AI agents         | Easy: one plain app               | Medium: code sits in `node_modules`    | Hard: precedence differs per file type and fails silently | Easy: one small app                    | Easy: plain app, named feature folders |
| Main risk             | Grows with features few shops use | A breaking export needs a major        | Silent precedence bugs, like lost CMS overrides           | Users merge it into their shop by hand | Drift from the starter, bus factor     |

## Example: B2B

B2B is planned as its own template ([decision](https://github.com/shopware/frontends/issues/2657#issuecomment-5928341830)), pending sign-off in [#2634](https://github.com/shopware/frontends/issues/2634). Its bug fixes are separate parts. [#2803](https://github.com/shopware/frontends/issues/2803) and [#2804](https://github.com/shopware/frontends/issues/2804) go into `@shopware/composables`, and [#2806](https://github.com/shopware/frontends/issues/2806) goes into the starter.

B2B started as a spike because its shape was open: [#2657](https://github.com/shopware/frontends/issues/2657) asked whether B2B is a template or a Nuxt layer. The spike answered question 2 with no, because the demo backend runs the full commercial B2B suite. The second pass then answered yes to question 4. Login is required, and every page shows company prices, so the starter's shared page cache must be off everywhere. No B2B company is seeded, so the template ships a seed script, see New template step 7.

The B2B layer built in the spike showed why a layer does not fit:

- Config cannot switch off `cacheableReads`, only the `NUXT_PUBLIC_SHOPWARE_CACHEABLE_READS` env var can. A layer cannot switch off the starter's `/**` ISR rule at all: `routeRules` merge key by key, so the app's `isr` value wins. Users then silently see guest prices.
- The starter's `/account` and `/checkout` pages win over the layer's pages, with no warning.

Overriding `useUser`, from a layer or from the app, reaches every consumer, including `@shopware/cms-base-layer`. So those fixes go upstream instead. The quote logic leaves `@shopware/composables` and `@shopware/helpers` only after `examples/b2b-quote-management` and its docs move. `useB2bQuoteManagement` in composables and `canUseQuoteActions` in helpers will be deprecated first, so each package needs its own major.

## Procedure

Before any code, post the answers as a comment on the feature issue:

- **Parts:** one line per part, and the issues for any bug fixes.
- **Answers:** yes or no for each question up to the first yes, with one line why.
- **Result:** one shape per part.
- **Owner:** who builds and maintains it, and a backup.

Then follow the steps for the shape.

### Package

1. Change `packages/composables`, `api-client` or `helpers`. Never hand-edit `packages/api-client/api-types/*.d.ts`.
2. Add a Vitest test next to the source as `*.test.ts`.
3. Run `pnpm changeset`. Deprecate first and remove in the next major.
4. Scaffolded projects get the change from the next canary, which `release.yml` publishes on a main push with a pending changeset.

### Starter change

1. Edit `templates/vue-starter-template`. CMS overrides go under `app/components/cms/`, the dir registered `global: true`.
2. A config mode gets a docs page, not a new directory.
3. If a build or dev script changes, update `manifest.json` in the same PR and run `pnpm run check:templates`.
4. No npm publish. The starter ships from the repo.

### Published layer

1. If `cms-base-layer` or `unocss-design-tokens-layer` already owns the concern, add it there with a minor changeset. Stop here.
2. A new layer is a new public npm package. Post the answers and get team sign-off on the issue before you create `packages/<name>`.
3. Copy the shape of `packages/cms-base-layer`: no build step, sources shipped as-is, one concern only.
4. Put CMS elements in a `global: true` dir. Elsewhere, a new element or an override can render nothing in production.
5. Document the `extends` order users need. See the side effect in question 5.
6. Use an include-based tsconfig with `types/` shims, like `packages/cms-base-layer/tsconfig.json`.
7. Add tests, check rendering inside the starter, and ship a changeset, a README and an `AGENTS.md`.

### Example

1. Build it in `examples/<name>` as its own small app, with a docs page.
2. Name the package `example-<name>`. The `ignore` list in `.changeset/config.json` covers that prefix, so it needs no changeset.
3. `examples.yml` builds it in CI.
4. If it must sit inside a starter page, propose a slot or hook as a separate starter change.

### Spike

1. Build a proof in a branch, with no template directory and no support promise.
2. End it with a decision note on the spike issue, then answer the questions again.
3. If the answer is a template, the note also picks the `supportLevel`. The `framework` enum in `manifest.schema.json` lists the frameworks we allow, so a new one needs a schema change first.

### New template

1. Post a decision note on the issue: the answers, why the starter cannot hold it, and an owner and a backup.
2. Get sign-off in [#2634](https://github.com/shopware/frontends/issues/2634) before any code.
3. Build `templates/<id>` as a plain Nuxt app. Put feature code in `app/**/<feature>` folders, with no `layers/` folder and no hidden overrides.
4. Fix shared bugs upstream first, and install `@shopware/*` from `canary`.
5. Add the entry to `manifest.json` and run `pnpm run check:templates`.
6. Make caching correct by default: `ssr: false` for personalized routes, and no personalized data in ISR HTML.
7. Add an `AGENTS.md`, a CI build and a drift check against the starter, comparing shared `nuxt.config.ts` keys and `@shopware/*` versions. Add a seed script if the demo backend lacks data, and keep it optional: every template starts against the public demo backend with no configuration. The README says what the missing data costs, for B2B that is signing in.
8. Add a docs page under `apps/docs/src/introduction/templates/` and a section with a `<PageRef>` in `apps/docs/src/introduction/templates.md`.

A template may also live in its own repository at the same bar ([#2634](https://github.com/shopware/frontends/issues/2634), answer 6). In-repo stays the default, so package changes are tested against the template in the same PR.
