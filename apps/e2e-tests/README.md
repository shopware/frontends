# E2E tests

## Run tests

Copy `.env.template` to `.env` and fill in the values.

`BASE_E2E_URL` points at your local environment. `USER_EMAIL` and `PASSWORD` are the storefront account the login tests sign in with, so create that account first.

And run the following command

```sh
> pnpm run test:e2e
```

## Debug tests

To debug all tests, run

```sh
> pnpm test:e2e --debug
```

To debug only a single test, run

```sh
> pnpm test:e2e example-test -- --debug
```
