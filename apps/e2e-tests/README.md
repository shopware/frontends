# E2E tests

Playwright suite for the Shopware Frontends storefronts. It takes one URL and checks what a shopper sees there, so the same specs run against `vue-starter-template`, `react-starter-template` and the templates built on them.

All commands below run from this directory, `apps/e2e-tests`. Playwright resolves its config from there.

## Setup

Install the browsers once:

```sh
pnpm exec playwright install chromium
```

Copy `.env.template` to `.env` and fill in the values. `BASE_E2E_URL` points at the storefront you want to test. The file is looked up from the working directory upwards, so a root `.env` works too.

No account has to exist on that storefront. Tests that sign in to an existing account take the `customer` fixture from `fixtures/session.ts`, which registers a fresh one through the Store API. The other signed-in tests register through the storefront's own form. Either way, the sales channel must not require double opt-in for registration.

## Layout

Specs are grouped by shop area, one folder per area under `tests/`:

| Folder          | Covers                                          |
| --------------- | ----------------------------------------------- |
| `navigation`    | error pages, client-side routing                |
| `catalog`       | category listing, search                        |
| `product`       | variants, reviews                               |
| `cart`          | adding to the cart                              |
| `checkout`      | placing orders                                  |
| `account`       | registration, login, password recovery, profile |
| `wishlist`      | adding to and clearing the wishlist             |
| `platform`      | sitemap, personal data isolation                |
| `accessibility` | axe checks per page                             |

A new spec goes into the folder of the area it tests, named `<behaviour>.spec.ts`. Run one area with a path filter:

```sh
pnpm run test:e2e tests/checkout
```

`tooling/` holds the StackBlitz and code-example checks. They run through `examples.config.ts`, not `test:e2e`.

Fixtures live in `fixtures/`, and specs import `test` and `expect` from `fixtures/index.ts`:

| File             | Provides                                                            |
| ---------------- | ------------------------------------------------------------------- |
| `features.ts`    | feature flag skips from `e2e.config.ts`                             |
| `diagnostics.ts` | network failure log, retry cool-down                                |
| `session.ts`     | captured Store API access, the `customer` fixture, banner dismissal |
| `pages.ts`       | page-object fixtures, the visible-only `page.getByTestId`           |

### Selectors live in page objects

Specs under `tests/` never select by test id. Every `getByTestId` call and `data-testid` selector belongs in a page object under `page-objects/`, and specs use its locators and methods. The test ids are a contract shared by the starter templates, so keeping them in one place keeps a renamed id to a one-line change. `pnpm run lint` fails when either appears under `tests/`.

## Tags

| Tag                | Marks                                     |
| ------------------ | ----------------------------------------- |
| `@frontends`       | every spec `test:e2e` runs                |
| `@accessibility`   | the axe checks                            |
| `@writes-customer` | tests that register a customer or sign in |
| `@writes-order`    | tests that place an order                 |

Area is the folder, not a tag. A test that creates data on the backend carries a `@writes-*` tag, so a run against a shared backend you must not write to, such as the public demo, leaves them out:

```sh
pnpm run test:e2e --grep-invert "@writes-" --project=chromium --workers=1
```

## Feature flags

Some storefront features are optional in Shopware. `e2e.config.ts` says which ones the shop under test has, and every flag defaults to on. The committed file matches the public demo backend.

| Flag                  | Covers                                                                           | Backend needs                                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wishlist`            | `tests/wishlist`, adding to the cart from the wishlist                           | `core.cart.wishlistEnabled` on                                                                                                                        |
| `productReviews`      | writing a product review                                                         | `core.listing.showReview` on                                                                                                                          |
| `sitemap`             | `sitemap.xml` listing files on the tested host                                   | a generated sitemap (`bin/console sitemap:generate`), and `STOREFRONT_URL` on `react-starter-template`; see [Switch the backend](#switch-the-backend) |
| `companyRegistration` | registering a company account                                                    | `core.loginRegistration.showAccountTypeSelection` on                                                                                                  |
| `guestCheckout`       | ordering from the checkout's own customer form, as a guest or with a new account | `core.loginRegistration.doubleOptInGuestOrder` off                                                                                                    |

A test that needs a feature carries an `@ff:<flag>` tag. When the flag is `false`, the test is skipped with the reason `feature <flag> disabled in e2e.config.ts`. A tag naming an unknown flag fails the test, so a typo cannot skip a spec unnoticed. Flags describe the shop, never the framework: one config holds for every template in front of that backend.

## Run tests

```sh
pnpm run test:e2e
```

`test:e2e` is `playwright test --grep @frontends` and takes its target from `BASE_E2E_URL`. The specs take catalogue data from the backend instead of hardcoding it, and select on `data-testid` attributes: the test ids are a contract both starters keep, so templates that extend them, such as `vue-starter-template-extended`, run too. Next.js keeps up to three soft-navigated pages mounted but hidden, so the `page` fixture in `fixtures/pages.ts` makes `page.getByTestId` match visible elements only; a raw `[data-testid=…]` locator needs `.filter({ visible: true })` itself. The deprecated `vue-demo-store` renders different test ids and is not covered.

CI runs them against `vue-starter-template` nightly and on manual dispatch, not on pull requests. See [.github/workflows/e2e-starter-template.yml](../../.github/workflows/e2e-starter-template.yml).

The run passes against the starter. Nothing is gated on it, since it does not run on pull requests; a failing run notifies Slack through `failed-job-check.yml`. Company registration skips itself when the shop turns off account type selection.

To reproduce the CI run locally:

```sh
# Through turbo, like the workflow, so the packages the starter links are
# built first rather than picked up stale.
pnpm exec turbo run build --filter=vue-starter-template

# The starter's sales channel accepts only this storefront URL, and
# nuxt.config.ts defaults to the wrong one. See #2585.
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=https://demo-frontends.shopware.store/figma \
  pnpm --filter vue-starter-template preview &

# preview does not listen straight away. Starting the suite before it does
# fails every spec on ERR_CONNECTION_REFUSED.
until curl -sf -o /dev/null http://localhost:3000/; do sleep 2; done

BASE_E2E_URL=http://localhost:3000/ pnpm run test:e2e --project=chromium
```

## Run against any storefront

Only `BASE_E2E_URL` changes between storefronts; the command is the same for every one of them:

```sh
BASE_E2E_URL=http://localhost:3000/ pnpm run test:e2e --project=chromium --workers=1
```

The suite never knows which template serves the URL. It waits for rendered state, such as the URL, visible content, a notification or a counter, never for the Store API requests a template happens to send from the browser. A listing that Next.js renders on the server sends none, and still passes the same way as one Nuxt fetches on the client. The listing pages expose what they rendered on `data-testid="listing-results"` (`data-sorting`, `data-manufacturer`, `data-properties`), and the listing page objects wait on those.

## Switch the backend

Every template runs against the public demo backend with no configuration. To test against your own Shopware instance, such as a local one at `http://localhost:8000`, start the storefront with its environment variables set instead of editing the template's config. The names differ per framework, and [templates/manifest.json](../../templates/manifest.json) lists them in each template's `env`. For the two starters:

| Template                 | Store API endpoint              | Access token                        | Storefront URL registered in the sales channel |
| ------------------------ | ------------------------------- | ----------------------------------- | ---------------------------------------------- |
| `vue-starter-template`   | `NUXT_PUBLIC_SHOPWARE_ENDPOINT` | `NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN` | `NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL`      |
| `react-starter-template` | `SHOPWARE_ENDPOINT`             | `SHOPWARE_ACCESS_TOKEN`             | `SHOPWARE_DEV_STOREFRONT_URL`                  |

Both read them at run time, not at build time, so a built storefront needs no rebuild to switch backends. Only a backend you own may take the `@writes-*` tests.

The sitemap specs depend on setup outside the suite. The backend must have generated a sitemap for the sales channel (`bin/console sitemap:generate`), which a fresh local backend has not. `react-starter-template` serves no sitemap until `STOREFRONT_URL` is set; `vue-starter-template` builds its links from the request host unless `NUXT_PUBLIC_SITE_URL` is set. Either variable must name the origin of `BASE_E2E_URL`, since the specs expect every listed file on the host they test.

## Run the accessibility check

The `@accessibility` specs use the same page objects, so the same targets apply. CI runs them against the supported starter template:

```sh
BASE_E2E_URL=https://frontends-starter-template.vercel.app/ \
  pnpm exec playwright test --grep @accessibility --project=chromium
```

That is the same command as the `Accessibility Check` workflow, which is manual dispatch only. See [.github/workflows/accessibility-check.yml](../../.github/workflows/accessibility-check.yml).

### Check a pull request

Every pull request gets a Vercel preview of the starter. Find its URL:

```sh
gh api repos/shopware/frontends/issues/<pr-number>/comments \
  --jq '.[] | select(.user.login | test("vercel")) | .body' \
  | grep -oE 'https://frontends-vue-starter-template[^ )]*'
```

Then dispatch the workflow against it:

```sh
gh workflow run accessibility-check.yml --ref <branch> -f base_url=<preview-url>
```

Without `-f base_url` the workflow checks the deployed starter, so a plain dispatch tells you nothing about the branch. The same URL works locally through `BASE_E2E_URL`.

To check a local build instead, build and serve the template first:

```sh
pnpm --filter vue-starter-template build
pnpm --filter vue-starter-template preview
```

then point the run at it:

```sh
BASE_E2E_URL=http://localhost:3000/ \
  pnpm exec playwright test --grep @accessibility --project=chromium
```

A failing run means axe found a real violation. Open the report to see which rule and which element:

```sh
pnpm exec playwright show-report
```

## Lighthouse

Lighthouse is not part of this suite. It runs in the `Lighthouse CI` workflow on manual dispatch, against the URLs listed in [lighthouserc.js](../../lighthouserc.js) at the repository root. That file is the only place the list lives.

## Debug tests

To debug all tests, run

```sh
pnpm run test:e2e --debug
```

To debug only a single test, run

```sh
pnpm run test:e2e example-test --debug
```
