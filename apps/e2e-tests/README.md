# E2E tests

## Run tests

Prepare a `.env` file with the `BASE_E2E_URL` of your local environment (please see the `.env.template` file).
Before running tests, create an account on storefront and put the login `USER_EMAIL` and password `PASSWORD` in the `.env` file. Login and password will be used in the login tests.

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

## gitlabCi configuration

In case of a problem with launching e2e tests stage pipeline, check the version of playwright in `pnpm-lock.yaml` and `gitlab-ci.yml` file (it should be the same version)
