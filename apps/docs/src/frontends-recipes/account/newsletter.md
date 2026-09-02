---
nav:
  position: 30
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useNewsletter
    - useInternationalization
    - useShopwareContext
    - useUser
  helpers: []
  operations:
    - subscribeToNewsletter post /newsletter/subscribe
    - unsubscribeToNewsletter post /newsletter/unsubscribe
    - confirmNewsletter post /newsletter/confirm
    - readNewsletterRecipient post /account/newsletter-recipient
  schemas:
    - AccountNewsletterRecipient
    - SuccessResponse
    - Criteria
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Submit an email address",
    detail:
      "A footer box or an account toggle collects the email address and the option value. The component owns the input and the pending flag, nothing else.",
    code: "newsletterSubscribe({ email, option: SUBSCRIBE_KEY })",
    state: "local form state",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Add storefrontUrl",
    detail:
      "useNewsletter merges storefrontUrl into the body from useInternationalization().getStorefrontUrl(). The parameter type omits storefrontUrl, so the form never sends it.",
    code: "body = { ...params, storefrontUrl: getStorefrontUrl() }",
    state: "storefront origin",
    typeKeys: [
      'operations["subscribeToNewsletter post /newsletter/subscribe"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Create the recipient",
    detail:
      "The subscribe route acts on the option value. With subscribe, Shopware sends a confirmation email whose link points back at the storefrontUrl you sent.",
    code: 'apiClient.invoke("subscribeToNewsletter post /newsletter/subscribe")',
    state: "newsletter recipient",
    typeKeys: [
      'operations["subscribeToNewsletter post /newsletter/subscribe"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Store the returned status",
    detail:
      "newsletterSubscribe writes result.data.status into newsletterStatus, so isNewsletterSubscriber and confirmationNeeded are correct without a second request.",
    code: "newsletterStatus.value = result.data.status",
    state: "newsletterStatus, per composable instance",
    typeKeys: [],
  },
  {
    title: "Confirmation",
    action: "Open the link from the email",
    detail:
      "The double opt-in link carries em and hash as query parameters. No composable covers this step, so the page invokes the confirm operation through the API client.",
    code: 'apiClient.invoke("confirmNewsletter post /newsletter/confirm")',
    state: "em + hash from the URL",
    typeKeys: [
      'operations["confirmNewsletter post /newsletter/confirm"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Read the customer status",
    detail:
      "getNewsletterStatus posts to the account route, which the schema secures with the context token, so it answers for the logged-in customer and not for an arbitrary address.",
    code: "getNewsletterStatus()",
    state: "sw-context-token",
    typeKeys: [
      'operations["readNewsletterRecipient post /account/newsletter-recipient"]["response"]',
    ],
  },
  {
    title: "UI",
    action: "Render the subscription state",
    detail:
      "The UI reads isNewsletterSubscriber and confirmationNeeded from the composable instead of storing a subscribed flag of its own.",
    code: "isNewsletterSubscriber + confirmationNeeded",
    state: "reactive UI",
    typeKeys: ['Schemas["AccountNewsletterRecipient"]'],
  },
];
</script>

# Newsletter

## Goal

Build a newsletter subscription: a form for any visitor and a subscription toggle on the account page. The important part is not the form, but the double opt-in lifecycle behind `status`, and the fact that `useNewsletter` fills in `storefrontUrl` for you because that value decides which domain the confirmation email links back to.

## Shopware Flow

`subscribeToNewsletter post /newsletter/subscribe` creates the recipient and returns `success` and `status`. It does not complete the subscription on its own: with `option` set to `subscribe`, the Store API sends a confirmation email, and the subscription only becomes active once `confirmNewsletter post /newsletter/confirm` is called with the `em` and `hash` values from that email.

The subscribe and unsubscribe routes are secured with the sales channel access token alone, so a guest can subscribe. `readNewsletterRecipient post /account/newsletter-recipient` is an account route secured with the context token, which is why `getNewsletterStatus()` belongs behind the login and the other two calls do not.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Newsletter flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A visitor submits an email address with `option` set to `SUBSCRIBE_KEY`.
2. `useNewsletter` adds `storefrontUrl` from `useInternationalization().getStorefrontUrl()` to the body.
3. The Store API creates the recipient and, for the `subscribe` option, sends the confirmation email.
4. `newsletterSubscribe` writes the returned `status` into `newsletterStatus`, so no extra status request is needed after subscribing.
5. The link in the email opens your app with `em` and `hash`, and that page calls `confirmNewsletter post /newsletter/confirm`.
6. `getNewsletterStatus()` reads the status of the logged-in customer from the account route.
7. The UI reads `isNewsletterSubscriber` and `confirmationNeeded` from the composable instead of keeping its own copy.

You do not build the subscribe body yourself. `useNewsletter` types its parameter as the operation body with `storefrontUrl` omitted and injects that field, so passing it from a component is neither needed nor possible without casting.

## Request Flow

| Step                      | Code                                                             | Store API                            | Type                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Subscribe an address      | `newsletterSubscribe({ email, option: SUBSCRIBE_KEY })`          | `POST /newsletter/subscribe`         | <SchemaTypeTooltip type-key='operations["subscribeToNewsletter post /newsletter/subscribe"]["body"]' />               |
| Read the returned status  | `newsletterStatus`                                               | `POST /newsletter/subscribe`         | <SchemaTypeTooltip type-key='operations["subscribeToNewsletter post /newsletter/subscribe"]["response"]' />           |
| Confirm the double opt-in | `apiClient.invoke("confirmNewsletter post /newsletter/confirm")` | `POST /newsletter/confirm`           | <SchemaTypeTooltip type-key='operations["confirmNewsletter post /newsletter/confirm"]["body"]' />                     |
| Unsubscribe an address    | `newsletterUnsubscribe(email)`                                   | `POST /newsletter/unsubscribe`       | <SchemaTypeTooltip type-key='operations["unsubscribeToNewsletter post /newsletter/unsubscribe"]["body"]' />           |
| Read the customer status  | `getNewsletterStatus()`                                          | `POST /account/newsletter-recipient` | <SchemaTypeTooltip type-key='operations["readNewsletterRecipient post /account/newsletter-recipient"]["response"]' /> |

## Composables

- `useNewsletter`: the whole feature except the confirmation call. Exposes `newsletterSubscribe`, `newsletterUnsubscribe`, `getNewsletterStatus`, `newsletterStatus`, `isNewsletterSubscriber`, `confirmationNeeded`, `SUBSCRIBE_KEY`, and `UNSUBSCRIBE_KEY`. `SUBSCRIBE_KEY` is `"subscribe"` and `UNSUBSCRIBE_KEY` is `"unsubscribe"`, the two `option` values the composable ships; the Store API also documents `direct` and `confirmSubscribe`.
- `useInternationalization`: provides `getStorefrontUrl()`, which `useNewsletter` calls internally for every subscribe request. It returns the configured `devStorefrontUrl` and otherwise `window.location.origin`.
- `useShopwareContext`: provides `apiClient` for `confirmNewsletter post /newsletter/confirm`, the one step of this flow that no composable wraps.
- `useUser`: provides `isLoggedIn` and `user`, which decide whether you may call `getNewsletterStatus()` and which email address the account toggle submits.

## Types

Use generated Store API types when you type the subscribe body, the confirmation parameters, or the recipient status:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["subscribeToNewsletter post /newsletter/subscribe"]["body"]' />
  <SchemaTypeTooltip type-key='operations["subscribeToNewsletter post /newsletter/subscribe"]["response"]' />
  <SchemaTypeTooltip type-key='operations["unsubscribeToNewsletter post /newsletter/unsubscribe"]["body"]' />
  <SchemaTypeTooltip type-key='operations["confirmNewsletter post /newsletter/confirm"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readNewsletterRecipient post /account/newsletter-recipient"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["AccountNewsletterRecipient"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type NewsletterSubscribeBody =
  operations["subscribeToNewsletter post /newsletter/subscribe"]["body"];
type NewsletterSubscribeResponse =
  operations["subscribeToNewsletter post /newsletter/subscribe"]["response"];
type NewsletterConfirmBody =
  operations["confirmNewsletter post /newsletter/confirm"]["body"];
type NewsletterRecipient = Schemas["AccountNewsletterRecipient"];
type NewsletterStatus = Schemas["NewsletterStatus"];
```

`newsletterSubscribe` accepts `Omit<NewsletterSubscribeBody, "storefrontUrl">`, and `NewsletterStatus` is the union `"notSet" | "optIn" | "optOut" | "direct" | "undefined"`.

## Minimal Vue Example

```vue
<script setup lang="ts">
const { user, isLoggedIn } = useUser();
const {
  newsletterSubscribe,
  newsletterUnsubscribe,
  getNewsletterStatus,
  isNewsletterSubscriber,
  confirmationNeeded,
  SUBSCRIBE_KEY,
} = useNewsletter();

const email = ref("");
const isSubmitting = ref(false);
const isLoadingStatus = ref(false);
const newsletterError = ref("");

const loadStatus = async () => {
  // The account route answers for the logged-in customer only.
  if (!isLoggedIn.value) return;

  isLoadingStatus.value = true;

  try {
    await getNewsletterStatus();
  } catch {
    newsletterError.value = "The newsletter status could not be loaded.";
  } finally {
    isLoadingStatus.value = false;
  }
};

const subscribe = async () => {
  newsletterError.value = "";
  isSubmitting.value = true;

  try {
    // storefrontUrl is added by the composable, never by the form.
    // The response status is written to newsletterStatus, so no reload here.
    await newsletterSubscribe({
      email: user.value?.email ?? email.value,
      option: SUBSCRIBE_KEY,
    });
  } catch {
    newsletterError.value = "The subscription could not be saved.";
  } finally {
    isSubmitting.value = false;
  }
};

const unsubscribe = async () => {
  newsletterError.value = "";
  isSubmitting.value = true;

  try {
    await newsletterUnsubscribe(user.value?.email ?? email.value);
    // newsletterUnsubscribe resolves with void and leaves newsletterStatus
    // untouched, so read the status again for a logged-in customer.
    await loadStatus();
  } catch {
    newsletterError.value = "The subscription could not be removed.";
  } finally {
    isSubmitting.value = false;
  }
};

// Immediate watcher instead of onMounted: it also runs when the customer
// signs in without a page change, for example through the login modal.
watch(isLoggedIn, () => loadStatus(), { immediate: true });
</script>

<template>
  <section>
    <h2>Newsletter</h2>

    <p v-if="newsletterError">{{ newsletterError }}</p>

    <form v-if="!isLoggedIn" @submit.prevent="subscribe">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Sending..." : "Subscribe" }}
      </button>

      <p v-if="confirmationNeeded">
        Check your inbox and confirm the subscription through the link we sent.
      </p>
    </form>

    <template v-else>
      <p v-if="isLoadingStatus">Loading subscription status...</p>

      <template v-else>
        <p v-if="confirmationNeeded">
          Your subscription is waiting for the confirmation link sent to
          {{ user?.email }}.
        </p>

        <button
          v-if="isNewsletterSubscriber"
          type="button"
          :disabled="isSubmitting"
          @click="unsubscribe()"
        >
          Unsubscribe
        </button>

        <button
          v-else
          type="button"
          :disabled="isSubmitting"
          @click="subscribe()"
        >
          Subscribe
        </button>
      </template>
    </template>
  </section>
</template>
```

## State And Session

Subscribing changes nothing about the sales channel session. The recipient is identified by the email address in the body, not by `sw-context-token`, and `useNewsletter` calls neither `refreshSessionContext()` nor `refreshCart()` because no context value, price, or cart line depends on a newsletter subscription.

`getNewsletterStatus()` is the exception. `readNewsletterRecipient post /account/newsletter-recipient` is declared with the context token in the schema and returns an `AccountNewsletterRecipient`, the status of the customer behind the current session. Call it after login, as both starter templates do on the account overview.

`newsletterStatus` is a `ref` created inside the `useNewsletter()` function body. There is no `useContext` key and no shared module state behind it, so every component that calls `useNewsletter()` gets its own status ref. A footer subscribe box and an account toggle do not see each other's updates; each component that renders subscription state has to fill its own instance with `newsletterSubscribe()` or `getNewsletterStatus()`.

Both derived values read that ref. `isNewsletterSubscriber` is true for every status except `optOut` and `undefined`, where `undefined` is the initial value before any request. `confirmationNeeded` is true only for `notSet`. A recipient in the `notSet` state is therefore reported as a subscriber and as awaiting confirmation at the same time.

## Edge Cases

- `getStorefrontUrl()` reads `window.location.origin` unless `devStorefrontUrl` is configured, so trigger `newsletterSubscribe` from a client-side handler and set `devStorefrontUrl` for local development, where the origin is `localhost` and matches no sales channel domain.
- In a multi-domain or multi-language sales channel, `storefrontUrl` decides which domain the confirmation link points at. Subscribing from the wrong origin sends the customer to a domain that may not serve your confirmation route.
- No composable wraps `confirmNewsletter post /newsletter/confirm`. The templates handle it in `app/pages/newsletter-subscribe.vue` by reading `em` and `hash` from the query and calling `apiClient.invoke` directly. Without such a page, double opt-in subscriptions never activate.
- `newsletterUnsubscribe` resolves with `void`. It does not touch `newsletterStatus`, so the UI keeps showing the previous state until you call `getNewsletterStatus()` again, which is only possible for a logged-in customer.
- A guest has no way to read a status. After a guest subscribe, the only status you have is the one returned by that single request.
- `useNewsletter` does not check the session before `getNewsletterStatus()`. The route resolves the recipient from the customer behind the context token, so guard the call with `isLoggedIn` and keep it out of pages a guest can open.
- Neither `useNewsletter` nor the shipped form components send a captcha, honeypot, or any other bot-protection field. The subscribe route is reachable with the sales channel access token alone, so rate limiting and bot protection belong in front of the Store API.

## Common Mistakes

- Do not pass `storefrontUrl` in the subscribe parameters. The composable injects it, and the parameter type omits it.
- Do not assume two components share `newsletterStatus`. The ref is created per `useNewsletter()` call.
- Do not treat `isNewsletterSubscriber` as confirmed. Check `confirmationNeeded` before telling the customer the subscription is active.
- Do not call `getNewsletterStatus()` outside a customer session.
- Do not request the status again right after `newsletterSubscribe()`. The composable already wrote the status from the response.
- Do not report whether an address was on the list after `newsletterUnsubscribe`. The call returns nothing, and echoing a difference would confirm addresses to whoever submits the form.
- Do not expose raw API error details from the newsletter routes in the UI.

## Testing Checklist

- Subscribing calls `subscribeToNewsletter post /newsletter/subscribe` with `option` set to `subscribe` and a `storefrontUrl` the component never provided.
- The status returned by the subscribe response lands in `newsletterStatus` without a follow-up request.
- A `notSet` status renders the pending-confirmation hint and leaves `isNewsletterSubscriber` true.
- Opening the confirmation link with `em` and `hash` calls `confirmNewsletter post /newsletter/confirm` and renders a success state.
- A missing or invalid `em` or `hash` renders an error state instead of a success message.
- Unsubscribing calls `unsubscribeToNewsletter post /newsletter/unsubscribe` and, for a logged-in customer, refreshes the status afterwards.
- `getNewsletterStatus()` is not called while `isLoggedIn` is false.
- A failing subscribe shows a form-level message and no raw API error.

## Related Links

- [Login recipe](login.html)
- [useNewsletter composable](../../packages/composables/useNewsletter.html)
- [API client package](../../packages/api-client.html)
- [devStorefrontUrl troubleshooting](../../resources/troubleshooting.html#what-is-devstorefronturl-and-when-to-use-it)
