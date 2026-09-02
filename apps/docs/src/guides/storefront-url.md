---
head:
  - - meta
    - name: og:title
      content: "Storefront URL"
  - - meta
    - name: og:description
      content: "Why the Store API needs a storefrontUrl and how devStorefrontUrl fixes local development"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Storefront%20**URL**.png?fontSize=150px"
---

# Storefront URL

In a headless setup your frontend and your Shopware instance live on different domains. Shopware still has to generate links that point back to _your_ storefront — the confirmation link in a double opt-in registration mail, the reset link in a password recovery mail, the newsletter confirmation link. The backend cannot guess where those should point, so you send it explicitly as `storefrontUrl` — required on the registration, password-recovery and newsletter-subscribe endpoints, optional on two more.

This page explains what the backend does with that value, how Shopware Frontends resolves it for you, and why you need `devStorefrontUrl` during local development.

## What `storefrontUrl` does

`storefrontUrl` is a Store API request-body parameter. The backend uses it to:

- **Resolve the sales channel domain.** The value has to match one of the domains configured in your Shopware Admin under **Sales Channel → Domains**. The schema states this for both `/account/register` and `/account/recovery-password`, and the backend rejects anything else with a constraint violation.
- **Pick the language of the transactional email.** A sales channel domain is bound to a language, so the resolved domain decides which snippet set and translations are used for the mail. This is why the composables document it as "needed to specify language of emails".
- **Build the absolute links inside that email.** The confirmation, recovery, and newsletter links are prefixed with the resolved domain, so the customer lands on your storefront rather than on the backend.

:::warning
`storefrontUrl` is not a free-form callback URL. Because it is validated against the configured sales channel domains, you cannot point it at `http://localhost:3000` unless that exact origin is registered as a domain in the Admin.
:::

## Endpoints that take it

The list below is the complete set from the Store API schema (`6.7.13.0`) — `storefrontUrl` appears in exactly five request bodies:

| Store API operation                                             | Required | How to send it                                                                                                 |
| --------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `register post /account/register`                               | yes      | [`useUser().register()`](../packages/composables/useUser.html) — injected                                      |
| `sendRecoveryMail post /account/recovery-password`              | yes      | [`useCustomerPassword().resetPassword()`](../packages/composables/useCustomerPassword.html) — pass it yourself |
| `subscribeToNewsletter post /newsletter/subscribe`              | yes      | [`useNewsletter().newsletterSubscribe()`](../packages/composables/useNewsletter.html) — injected               |
| `reinviteEmployee post /employee/reinvite/{id}`                 | no       | no composable — see [below](#endpoints-without-a-composable)                                                   |
| `dsrGenerateLoginToken post /dsr/customer/generate-login-token` | no       | Digital Sales Rooms, see the note below                                                                        |

The schema descriptions confirm the behaviour above, for example on `/account/register`:

> URL of the storefront for that registration. Used in confirmation emails. Has to be one of the configured domains of the sales channel.

:::warning Digital Sales Rooms endpoint is not typed
In the upstream Store API schema, `/dsr/customer/generate-login-token` declares its payload under a non-standard `body` key instead of `requestBody`. The type generator therefore drops it, and the generated operation `"dsrGenerateLoginToken post /dsr/customer/generate-login-token"` has no `body` at all. If you need to send `storefrontUrl` there, you have to work around the missing type.
:::

## How Shopware Frontends resolves it

[`useInternationalization`](../packages/composables/useInternationalization.html) exposes `getStorefrontUrl()`, which is the single source of truth for the value:

```ts
function getStorefrontUrl() {
  return devStorefrontUrl ?? window.location.origin ?? "";
}
```

So: **if `devStorefrontUrl` is configured it wins, otherwise the browser origin is used.**

Two composables inject the result for you, which is why `storefrontUrl` is omitted from their parameter types:

```ts
// useUser.ts — storefrontUrl is added internally
register(
  params: Omit<
    operations["register post /account/register"]["body"],
    "storefrontUrl"
  >,
);
```

`useNewsletter().newsletterSubscribe()` works the same way. `useCustomerPassword().resetPassword()` does **not** — it forwards the payload as-is, so you have to pass `storefrontUrl` yourself.

Resolve it inside the submit handler, not in the component body:

```vue
<script setup lang="ts">
const { resetPassword } = useCustomerPassword();
const { getStorefrontUrl } = useInternationalization();

const formData = ref({ email: "" });

async function onSubmit() {
  await resetPassword({
    ...formData.value,
    // resolved on the client, where window.location.origin exists
    storefrontUrl: getStorefrontUrl(),
  });
}
</script>
```

:::warning Do not call `getStorefrontUrl()` during setup
`<script setup>` also runs on the server. With no `devStorefrontUrl` configured — the default, since the Nuxt plugin falls back to `null` — `getStorefrontUrl()` reaches for `window.location.origin` and the render fails with `window is not defined`. A submit handler only ever runs in the browser, so resolving the value there is safe whether or not `devStorefrontUrl` is set.
:::

### Endpoints without a composable

The two optional endpoints have no composable wrapper, so you call the API client directly and add `storefrontUrl` to the body yourself:

```ts
const { apiClient } = useShopwareContext();
const { getStorefrontUrl } = useInternationalization();

await apiClient.invoke("reinviteEmployee post /employee/reinvite/{id}", {
  pathParams: { id: employeeId },
  body: { storefrontUrl: getStorefrontUrl() },
});
```

:::info Omitting it fails silently
On both endpoints the field is optional, so the call succeeds without it and there is nothing in the response to tell you it was missing. Send it when you need the link in the invitation mail to point at a specific domain.

The [B2B employee management example](https://github.com/shopware/frontends/tree/main/examples/b2b-employee-management) shows the endpoint call, but without `storefrontUrl` — it passes an empty body, so treat it as a reference for the endpoint itself rather than for this parameter.
:::

## `devStorefrontUrl`

`devStorefrontUrl` is a Shopware Frontends configuration option — it does not exist in the Store API. Its only job is to override the value that `getStorefrontUrl()` would otherwise take from `window.location.origin`.

### Why the browser origin is not enough

The default works in production, where your frontend is served from a domain that is registered in the sales channel. It breaks whenever the browser origin is not a configured domain:

- **Local development** — the origin is `http://localhost:3000`, which matches no sales channel domain, so registration and newsletter subscription fail validation.
- **Frontend on a separate domain** — a preview deployment, a staging URL, or any host you have not registered in the Admin.
- **Server-side rendering** — `window` does not exist on the server, so the fallback throws `window is not defined` instead of returning an origin. Either resolve the value in client-only code or configure `devStorefrontUrl`.

### Configuration

For the Nuxt templates, set it in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://your-shop.shopware.store/store-api",
        accessToken: "your-access-token",
        // must match a domain in Sales Channel → Domains
        devStorefrontUrl: "https://your-shop.shopware.store",
      },
    },
  },
});
```

To keep the actual value per-environment, declare the key in `nuxt.config.ts` anyway — with an empty default — and override it with an environment variable:

```ts
// nuxt.config.ts — the key has to be present for the env override to apply
shopware: {
  devStorefrontUrl: "",
},
```

```bash
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=https://your-shop.shopware.store
```

:::warning The env variable alone is not enough
Nuxt applies `NUXT_*` overrides by walking the keys that already exist in the runtime config — `applyEnv()` iterates with `for (const key in obj)`, so a key that is absent is never visited and its environment variable is never read. The Nuxt module does not seed a default for `devStorefrontUrl`, it only merges what you pass in. Omit the key from `nuxt.config.ts` and `NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL` is silently ignored — no warning, no error. This is why the templates commit the key: `vue-starter-template` ships `devStorefrontUrl: "https://frontends-demo.vercel.app"` and `vue-demo-store` ships `devStorefrontUrl: ""`.
:::

Outside of the Nuxt module — a plain Vue or Astro app — pass it to `createShopwareContext()`:

```ts
const shopwareContext = createShopwareContext(app, {
  devStorefrontUrl: "https://your-shop.shopware.store",
});
```

:::tip
If customer registration works in production but fails locally, `devStorefrontUrl` is almost always the answer. Point it at your production (or staging) storefront domain while developing.
:::

### Effect on emails during development

Because the value also selects the domain used to build the links in the mail, a locally triggered registration sends a confirmation link pointing at the domain you configured — not at `localhost`. That is expected: the link is valid, it just opens the deployed storefront. To finish the flow locally, copy the token from the link into your local URL.

## `replaceToDevStorefront()` and language switching

`devStorefrontUrl` has a second use, in the opposite direction. `changeLanguage()` returns a `redirectUrl` built by the backend from the target language's sales channel domain. Following it blindly during local development throws you out of `localhost`.

`useInternationalization().replaceToDevStorefront()` rewrites the origin of such a URL to `devStorefrontUrl` when it is set, and returns the URL untouched otherwise:

```vue
<script setup lang="ts">
const { changeLanguage, replaceToDevStorefront } = useInternationalization();

async function onChangeHandler(id: string) {
  const data = await changeLanguage(id);

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
}
</script>
```

Note that this keeps you on the configured `devStorefrontUrl`, so it does not by itself let you test the language switch on `localhost`. For that, see the local `hosts` override and the dev resolver in [Work with languages](./languages.html#switching-language-locally).

## Troubleshooting

**`[Constraint violation error][/storefrontUrl] This value should not be blank.`**

An empty value was sent. This happens when the form reads the runtime config directly instead of going through the composable:

```ts
// reads runtimeConfig, where the value really is "" — `??` does not catch an empty string
storefrontUrl: config.public.shopware.devStorefrontUrl ?? "",
```

Use `getStorefrontUrl()` instead. The Nuxt plugin normalises the option with `devStorefrontUrl || null`, so an empty string becomes `null` in the context and the composable falls back to `window.location.origin`. Reading `runtimeConfig` yourself skips that normalisation and forwards the empty string.

:::warning The deprecated demo store still uses the old pattern
[`AccountRecoverPassword.vue`](https://github.com/shopware/frontends/blob/main/templates/vue-demo-store/app/components/account/AccountRecoverPassword.vue) in `vue-demo-store` reads the runtime config directly, and that template ships `devStorefrontUrl: ""`, so password recovery hits this error out of the box. Follow this guide rather than that component. The supported templates are unaffected — they do not implement a recovery flow.
:::

**`[Constraint violation error][/storefrontUrl] The value you selected is not a valid choice.`**

A value was sent, but it is not a registered sales channel domain. This is the typical `http://localhost:3000` case. Set `devStorefrontUrl` to a domain from **Sales Channel → Domains**, and check it matches exactly — protocol and trailing slash included.

**`window is not defined` / `ReferenceError` during SSR**

`getStorefrontUrl()` was called on the server with no `devStorefrontUrl` configured. Move the call into an event handler or other client-only code, or configure `devStorefrontUrl` so the `window` fallback is never reached.

**Registration works in production, fails locally.** Same cause as above; set `devStorefrontUrl` for your dev environment only.

**Emails arrive in the wrong language.** The resolved domain decides the mail language. Verify that the domain you configured in `devStorefrontUrl` is the one bound to the language you expect.

## Production

You normally leave `devStorefrontUrl` unset in production, so `window.location.origin` is used and each domain a customer visits generates matching links. Set it in production only when the browser origin genuinely differs from the domain registered in Shopware — for example when a proxy or CDN serves the storefront under a host the sales channel does not know about.

<PageRef title="Work with languages" sub="Multi-language stores, domain strategies and switching language locally." page="languages.html" />
