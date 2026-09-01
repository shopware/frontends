# E2E tests

Playwright suite for the templates in this repository.

All commands below run from this directory, `apps/e2e-tests`. Playwright resolves its config from there.

## Setup

Install the browsers once:

```sh
pnpm exec playwright install chromium
```

Copy `.env.template` to `.env` and fill in the values. `BASE_E2E_URL` points at the storefront you want to test. The file is looked up from the working directory upwards, so a root `.env` works too.

The login tests need an account on that storefront. Put its `USER_EMAIL` and `PASSWORD` in the same file.

## Run tests

```sh
pnpm run test:e2e
```

`test:e2e` is `playwright test --grep @frontends` and takes its target from `BASE_E2E_URL`. The specs navigate generically, so they run against any storefront rather than one template.

CI runs them against `vue-starter-template`: on pull requests that touch `templates/vue-starter-template/**`, `apps/e2e-tests/**` or the workflow itself, nightly, and on manual dispatch. See [.github/workflows/e2e-starter-template.yml](../../.github/workflows/e2e-starter-template.yml).

The run passes against the starter. It still reports rather than gates, because a few specs need a retry against the shared demo backend. Two scenarios stay skipped for features the starter does not have: a clear-wishlist action ([#2679](https://github.com/shopware/frontends/issues/2679)) and product reviews ([#2680](https://github.com/shopware/frontends/issues/2680)).

To reproduce the CI run locally:

```sh
pnpm --filter vue-starter-template build

# The starter's sales channel accepts only this storefront URL, and
# nuxt.config.ts defaults to the wrong one. See #2585.
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=https://demo-frontends.shopware.store/figma \
  pnpm --filter vue-starter-template preview &

# preview does not listen straight away. Starting the suite before it does
# fails every spec on ERR_CONNECTION_REFUSED.
until curl -sf -o /dev/null http://localhost:3000/; do sleep 2; done

BASE_E2E_URL=http://localhost:3000/ pnpm run test:e2e --project=chromium
```

## Run the accessibility check

The `@accessibility` specs do not select on template specific content, so they run against any storefront. CI runs them against the supported starter template:

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
