---
nav:
  position: 40
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useCustomerPassword
    - useInternationalization
    - useUser
  helpers: []
  operations:
    - sendRecoveryMail post /account/recovery-password
    - getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired
    - recoveryPassword post /account/recovery-password-confirm
    - changePassword post /account/change-password
    - loginCustomer post /account/login
  schemas:
    - Customer
    - SuccessResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import StorefrontUrlNotice from "../../components/StorefrontUrlNotice.vue";

const steps = [
  {
    title: "UI",
    action: "Ask for the mail",
    detail:
      "A forgotten-password form collects one email address. The submit handler is also where storefrontUrl has to be resolved, because it runs only in the browser.",
    code: "resetPassword({ email, storefrontUrl: getStorefrontUrl() })",
    state: "local form state",
    typeKeys: [
      'operations["sendRecoveryMail post /account/recovery-password"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Send a recovery mail",
    detail:
      "sendRecoveryMail validates storefrontUrl against the configured sales channel domains and mails a link containing a hash. The response says nothing about whether the address exists.",
    code: 'apiClient.invoke("sendRecoveryMail post /account/recovery-password")',
    state: "none in the frontend",
    typeKeys: [
      'operations["sendRecoveryMail post /account/recovery-password"]["response"]',
    ],
  },
  {
    title: "UI",
    action: "Open the link",
    detail:
      "The customer lands on a reset route carrying the hash. No session exists at this point — the hash is the only credential.",
    code: "const hash = route.query.hash",
    state: "route query hash",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Check the hash first",
    detail:
      "getCustomerRecoveryIsExpired reports whether the hash is still usable. There is no composable for it, so it is called through apiClient.invoke.",
    code: 'apiClient.invoke("getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired", { body: { hash } })',
    state: "isExpired",
    typeKeys: [
      'operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["response"]',
    ],
  },
  {
    title: "Store API",
    action: "Set the new password",
    detail:
      "recoveryPassword takes the hash plus the new password twice. It has no composable either, and it does not log the customer in.",
    code: 'apiClient.invoke("recoveryPassword post /account/recovery-password-confirm")',
    state: "server-side password",
    typeKeys: [
      'operations["recoveryPassword post /account/recovery-password-confirm"]["body"]',
    ],
  },
  {
    title: "Account",
    action: "Change from inside",
    detail:
      "For a logged-in customer the flow is one request. updatePassword needs the current password as well, and the session survives it.",
    code: "updatePassword({ password, newPassword, newPasswordConfirm })",
    state: "sw-context-token",
    typeKeys: [
      'operations["changePassword post /account/change-password"]["body"]',
    ],
  },
];
</script>

# Password Recovery and Change

## Goal

Build both password flows: the recovery a customer starts when they cannot log in, and the change a logged-in customer makes from their account. The important part is that recovery is three separate operations of which only the first has a composable, and that the recovery response deliberately tells you nothing about whether the address exists.

## Shopware Flow

Recovery is not one request. `sendRecoveryMail post /account/recovery-password` mails a link, `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired` reports whether the hash in that link is still valid, and `recoveryPassword post /account/recovery-password-confirm` sets the new password. Only the first is wrapped by `useCustomerPassword`; the other two are called through `apiClient.invoke`.

Two things this flow does _not_ do are easy to get wrong. It does not confirm that the email address belongs to a customer — the response is the same either way, on purpose. And it does not create a session: after a successful reset the customer is still logged out and has to sign in with the new password.

<RecipeFlowDiagram label="Password recovery flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer submits their email address in a forgotten-password form.
2. `resetPassword()` sends `sendRecoveryMail post /account/recovery-password` with the address and a `storefrontUrl`, and Shopware mails a link containing a hash.
3. The customer opens that link, arriving on a reset route with the hash and no session.
4. The page checks the hash with `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired` before rendering a form.
5. `recoveryPassword post /account/recovery-password-confirm` sets the new password from the hash and the two password fields.
6. The separate in-account flow is a single `changePassword post /account/change-password` call that also requires the current password.

You do not need to refresh the session context or the cart in either flow. Neither operation changes the logged-in customer, so nothing derived from the context becomes stale.

<StorefrontUrlNotice
  operation="sendRecoveryMail post /account/recovery-password"
  :required="true"
  :injected="false"
/>

## Request Flow

| Step                     | Code                                           | Store API                                    | Type                                                                                                                           |
| ------------------------ | ---------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Request a recovery mail  | `resetPassword({ email, storefrontUrl })`      | `POST /account/recovery-password`            | <SchemaTypeTooltip type-key='operations["sendRecoveryMail post /account/recovery-password"]["body"]' />                        |
| Read the acknowledgement | `resetPassword()` result                       | `POST /account/recovery-password`            | <SchemaTypeTooltip type-key='operations["sendRecoveryMail post /account/recovery-password"]["response"]' />                    |
| Check the hash           | `invoke("getCustomerRecoveryIsExpired …")`     | `POST /account/customer-recovery-is-expired` | <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"]' /> |
| Confirm the new password | `invoke("recoveryPassword …")`                 | `POST /account/recovery-password-confirm`    | <SchemaTypeTooltip type-key='operations["recoveryPassword post /account/recovery-password-confirm"]["body"]' />                |
| Change from the account  | `updatePassword({ password, newPassword, … })` | `POST /account/change-password`              | <SchemaTypeTooltip type-key='operations["changePassword post /account/change-password"]["body"]' />                            |
| Sign in afterwards       | `login({ username, password })`                | `POST /account/login`                        | <SchemaTypeTooltip type-key='operations["loginCustomer post /account/login"]["body"]' />                                       |

Both recovery-confirm rows go through `apiClient.invoke` because `useCustomerPassword` exposes only `resetPassword` and `updatePassword`.

## Composables

- `useCustomerPassword`: the two wrapped operations. `resetPassword(body)` sends the recovery mail and `updatePassword(body)` changes the password of the logged-in customer. Both take the generated request body and return the response data.
- `useInternationalization`: `getStorefrontUrl()` resolves the `storefrontUrl` that `resetPassword` needs. It returns `devStorefrontUrl` when configured and `window.location.origin` otherwise.
- `useUser`: `login()` after a completed reset, and `isLoggedIn` to decide which of the two flows a page should render.

## Types

Use generated Store API types when you need to type the request bodies or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["sendRecoveryMail post /account/recovery-password"]["body"]' />
  <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"]' />
  <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["response"]' />
  <SchemaTypeTooltip type-key='operations["recoveryPassword post /account/recovery-password-confirm"]["body"]' />
  <SchemaTypeTooltip type-key='operations["changePassword post /account/change-password"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["SuccessResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Customer"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type RecoveryMailBody =
  operations["sendRecoveryMail post /account/recovery-password"]["body"];
type RecoveryExpiredBody =
  operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"];
type RecoveryConfirmBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];
type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];
type SuccessResponse = Schemas["SuccessResponse"];
```

`RecoveryMailBody` is the type that makes the `storefrontUrl` requirement visible — it is required there and absent from all three other bodies.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

const { apiClient } = useShopwareContext();
const { resetPassword, updatePassword } = useCustomerPassword();
const { getStorefrontUrl } = useInternationalization();
const { isLoggedIn } = useUser();

const hash = useRoute().query.hash as string | undefined;

const email = ref("");
const mailSent = ref(false);

const isExpired = ref(false);
const resetDone = ref(false);

const newPassword = reactive({ newPassword: "", newPasswordConfirm: "" });
const changeForm = reactive({
  password: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const isSubmitting = ref(false);
const passwordError = ref("");

const requestRecoveryMail = async () => {
  passwordError.value = "";
  isSubmitting.value = true;

  try {
    await resetPassword({
      email: email.value,
      // resolved here, because getStorefrontUrl() reads window during setup
      storefrontUrl: getStorefrontUrl(),
    });
    mailSent.value = true;
  } catch {
    passwordError.value = "The recovery mail could not be requested.";
  } finally {
    isSubmitting.value = false;
  }
};

const confirmNewPassword = async () => {
  if (!hash) return;

  passwordError.value = "";
  isSubmitting.value = true;

  try {
    await apiClient.invoke(
      "recoveryPassword post /account/recovery-password-confirm",
      { body: { hash, ...newPassword } }
    );
    resetDone.value = true;
  } catch (error) {
    passwordError.value =
      error instanceof ApiClientError
        ? "This link is no longer valid, or the passwords do not match."
        : "The password could not be changed.";
  } finally {
    isSubmitting.value = false;
  }
};

const changePassword = async () => {
  passwordError.value = "";
  isSubmitting.value = true;

  try {
    await updatePassword(changeForm);
    changeForm.password = "";
    changeForm.newPassword = "";
    changeForm.newPasswordConfirm = "";
  } catch {
    passwordError.value = "Your current password is not correct.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (!hash) return;

  const { data: recoveryState } = await apiClient.invoke(
    "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired",
    { body: { hash } }
  );
  // the flag sits inside an array_struct envelope, not on the response root
  isExpired.value = !!recoveryState.data?.[0]?.isExpired;
});
</script>

<template>
  <p v-if="passwordError">{{ passwordError }}</p>

  <section v-if="hash">
    <h1>Choose a new password</h1>

    <p v-if="isExpired">This link has expired. Request a new recovery mail.</p>

    <p v-else-if="resetDone">
      Your password was changed. You can sign in with it now.
    </p>

    <form v-else @submit.prevent="confirmNewPassword">
      <label>
        New password
        <input
          v-model="newPassword.newPassword"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="newPassword.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Save the new password" }}
      </button>
    </form>
  </section>

  <section v-else-if="isLoggedIn">
    <h1>Change your password</h1>

    <form @submit.prevent="changePassword">
      <label>
        Current password
        <input
          v-model="changeForm.password"
          type="password"
          autocomplete="current-password"
        />
      </label>

      <label>
        New password
        <input
          v-model="changeForm.newPassword"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="changeForm.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
        />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Change the password" }}
      </button>
    </form>
  </section>

  <section v-else>
    <h1>Forgot your password?</h1>

    <p v-if="mailSent">
      If an account exists for that address, a recovery mail is on its way.
    </p>

    <form v-else @submit.prevent="requestRecoveryMail">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Sending…" : "Send the recovery mail" }}
      </button>
    </form>
  </section>
</template>
```

## State And Session

Neither flow touches the sales channel context. `changePassword post /account/change-password` runs inside the customer session identified by `sw-context-token` and leaves it intact, so nothing needs refreshing and `isLoggedIn` stays `true`.

The recovery flow has no session at all. The hash in the mail link is the entire credential, which is why it can be used exactly once and expires. The confirm operation does not issue a context token either — the customer arrives on the login form afterwards, not in their account.

`storefrontUrl` is the one value in this recipe that depends on where the frontend runs rather than on the session. Resolving it in the submit handler keeps it out of the server render, where `window.location.origin` does not exist.

## Edge Cases

- `sendRecoveryMail` answers the same way for a known and an unknown address. Never render "no account with that address" — the API does not tell you, and saying it would leak who has an account.
- The recovery hash is single-use and time-limited. Check it with `getCustomerRecoveryIsExpired` before showing a form, or the customer fills in two fields for nothing.
- `getCustomerRecoveryIsExpired` and `recoveryPassword` have no composable. Calling them through `apiClient.invoke` is the intended route, not a workaround.
- `getCustomerRecoveryIsExpired` answers with an `array_struct` envelope: the flag is at `data[0].isExpired`, not on the response root. Reading it one level too high yields `undefined`, which is falsy — so a stale link renders the form as if it were valid.
- `recoveryPassword post /account/recovery-password-confirm` requires `newPassword` **and** `newPasswordConfirm`. The server compares them, so a client-side check is a convenience, not the validation.
- A completed reset does not log the customer in. Send them to the login form, or call `useUser().login()` yourself with the address and the new password.
- `changePassword post /account/change-password` requires the current `password`. A wrong one is a normal rejection and belongs on the current-password field.
- `resetPassword` forwards its payload untouched, unlike `useUser().register()` and `useNewsletter().newsletterSubscribe()`. Omitting `storefrontUrl` is a constraint violation, not a silent default.
- `storefrontUrl` must match a domain configured under **Sales Channel → Domains**. On `localhost` that means configuring `devStorefrontUrl`, or the recovery mail request fails validation in development only.

## Common Mistakes

- Do not tell the customer whether the address was found.
- Do not call `getStorefrontUrl()` in the component body. On the server it throws `window is not defined` unless `devStorefrontUrl` is set.
- Do not render the reset form before checking the hash.
- Do not read `isExpired` off the response root. It is inside the `data` array.
- Do not treat the reset as a login. There is no session afterwards.
- Do not send only `newPassword` to the confirm operation. Both password fields are required.
- Do not reuse the recovery flow for a logged-in customer. `changePassword post /account/change-password` exists for that and verifies the current password.
- Do not keep the entered passwords in state after a successful change.
- Do not surface the raw constraint violation from a rejected `storefrontUrl`. It describes a configuration problem, not something the customer did.

## Testing Checklist

- Submitting the forgotten-password form calls `sendRecoveryMail post /account/recovery-password` with a `storefrontUrl`.
- An unknown address produces the same UI as a known one.
- Opening a reset link calls `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired` before any form is rendered.
- An expired hash renders the expiry message and no password form.
- A valid hash plus two matching passwords calls `recoveryPassword post /account/recovery-password-confirm` and reports success without creating a session.
- Reusing a consumed hash is rejected and shown as an invalid link.
- Changing the password from the account calls `changePassword post /account/change-password` and keeps `isLoggedIn` at `true`.
- A wrong current password shows a field-level error and the fields are not cleared.
- The password fields are cleared after a successful change.

## Related Links

- [Storefront URL guide](../../guides/storefront-url.html)
- [Login recipe](login.html)
- [Login form page element](../../getting-started/page-elements/login-form.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
