---
nav:
  position: 30
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useCustomerPassword
    - useInternationalization
    - useShopwareContext
    - useUser
  helpers: []
  operations:
    - sendRecoveryMail post /account/recovery-password
    - getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired
    - recoveryPassword post /account/recovery-password-confirm
    - changePassword post /account/change-password
    - loginCustomer post /account/login
  schemas:
    - SuccessResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";
import StorefrontUrlNotice from "../../components/StorefrontUrlNotice.vue";

const steps = [
  {
    title: "UI",
    action: "Ask for the mail",
    detail:
      "A forgotten-password form collects one email address. The submit handler is where storefrontUrl is resolved.",
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

Build both password flows: the recovery a customer starts when they cannot log in, and the change a logged-in customer makes from their account. The important part is that recovery is three separate operations of which only the first has a composable, and that the recovery response tells you nothing about whether the address exists.

## Shopware Flow

Recovery is not one request. `sendRecoveryMail post /account/recovery-password` mails a link, `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired` reports whether the hash in that link is still valid, and `recoveryPassword post /account/recovery-password-confirm` sets the new password. Only the first is wrapped by `useCustomerPassword`; the other two are called through `apiClient.invoke`.

Two things this flow does _not_ do are easy to get wrong. It does not tell you whether the address belongs to a customer: the schema declares a single `200` carrying a `SuccessResponse`, and its description makes the mail conditional on the address corresponding to an existing customer. Read a success as "the request was accepted", never as "the account exists". And it does not create a session: after a successful reset the customer is still logged out and has to sign in with the new password.

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
| Check the hash           | `invoke("getCustomerRecoveryIsExpired …")`     | `POST /account/customer-recovery-is-expired` | <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"]' /> |
| Confirm the new password | `invoke("recoveryPassword …")`                 | `POST /account/recovery-password-confirm`    | <SchemaTypeTooltip type-key='operations["recoveryPassword post /account/recovery-password-confirm"]["body"]' />                |
| Change from the account  | `updatePassword({ password, newPassword, … })` | `POST /account/change-password`              | <SchemaTypeTooltip type-key='operations["changePassword post /account/change-password"]["body"]' />                            |
| Sign in afterwards       | `login({ username, password })`                | `POST /account/login`                        | <SchemaTypeTooltip type-key='operations["loginCustomer post /account/login"]["body"]' />                                       |

The two middle rows go through `apiClient.invoke` because `useCustomerPassword` exposes only `resetPassword` and `updatePassword`.

## Composables

Pick by scope — how much of the flow the composable is about:

| Composable                | Scope                    | Reach for it when                                                  |
| ------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `useShopwareContext`      | the API client           | an operation in the flow has no composable                         |
| `useInternationalization` | the whole storefront     | you need the `storefrontUrl` that `resetPassword` will not fill in |
| `useUser`                 | the customer session     | choosing which form to render, or signing in after a reset         |
| `useCustomerPassword`     | both password operations | building either form                                               |

`useCustomerPassword` is the one this recipe is about:

- **Recovery** — `resetPassword(body)` takes `{ email, storefrontUrl }` and sends the mail.
- **Change** — `updatePassword(body)` takes `{ password, newPassword, newPasswordConfirm }` and changes the password of the logged-in customer.

Three things the generated reference will not tell you:

- It wraps two of the four password operations on this page. `getCustomerRecoveryIsExpired` and `recoveryPassword` have no composable at all, so `apiClient.invoke` from `useShopwareContext` is the intended route for them, not a workaround.
- `resetPassword` forwards its payload untouched, so `storefrontUrl` is yours to add. `register()` and `newsletterSubscribe()` do the opposite — they inject the value and `Omit` the field from their parameter types, which is why only this one needs it at the call site.
- Both methods return `response.data` rather than the API client envelope, so what you get back is the `SuccessResponse` itself — a single optional `success` flag. It is not worth branching on: a rejected request arrives as a thrown `ApiClientError`.

From `useInternationalization` this recipe needs only `getStorefrontUrl()`, which returns `devStorefrontUrl` when it is configured and `window.location.origin` otherwise. From `useUser` it needs only `isLoggedIn`, to choose which form to render, and `login()`, to sign the customer in after a completed reset.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the request bodies or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["sendRecoveryMail post /account/recovery-password"]["body"]' />
  <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"]' />
  <SchemaTypeTooltip type-key='operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["response"]' />
  <SchemaTypeTooltip type-key='operations["recoveryPassword post /account/recovery-password-confirm"]["body"]' />
  <SchemaTypeTooltip type-key='operations["changePassword post /account/change-password"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["SuccessResponse"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type RecoveryMailBody =
  operations["sendRecoveryMail post /account/recovery-password"]["body"];
type RecoveryExpiredBody =
  operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"];
type RecoveryExpiredResponse =
  operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["response"];
type RecoveryConfirmBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];
type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];
type SuccessResponse = Schemas["SuccessResponse"];
```

`RecoveryMailBody` is the type that makes the `storefrontUrl` requirement visible — it is required there and absent from all three other bodies. `RecoveryExpiredResponse` is the one worth expanding in the tooltip: it is an `array_struct` envelope, so the flag lives at `data[0].isExpired`. The example below annotates its two form objects with `RecoveryConfirmBody` and `ChangePasswordBody`, which is what makes `{ hash, ...resetForm }` self-evidently complete.

## Minimal Vue Example

<CodeExample title="Minimal password recovery and change page">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { operations } from "#shopware";

type RecoveryConfirmBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];
type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];

const { apiClient } = useShopwareContext();
const { resetPassword, updatePassword } = useCustomerPassword();
const { getStorefrontUrl } = useInternationalization();
const { isLoggedIn } = useUser();

const hash = useRoute().query.hash?.toString();

const heading = ref<HTMLElement | null>(null);

const email = ref("");
const isRecoveryRequested = ref(false);
const recoveryError = ref("");

const isHashChecked = ref(false);
const isExpired = ref(false);
const isCheckFailed = ref(false);
const isResetComplete = ref(false);
const isChangeComplete = ref(false);

const resetForm = reactive<Omit<RecoveryConfirmBody, "hash">>({
  newPassword: "",
  newPasswordConfirm: "",
});

const changeForm = reactive<ChangePasswordBody>({
  password: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const isSubmitting = ref(false);
const passwordError = ref("");
// Which input the message belongs to, so it can be described on that field
// rather than as one sentence at the top of the page.
const errorField = ref<"currentPassword" | "newPassword" | "">("");

// A rejected field arrives as a JSON pointer, e.g. "/newPasswordConfirm".
const rejectedPointer = (error: unknown) =>
  error instanceof ApiClientError
    ? (error.details.errors?.[0]?.source?.pointer ?? "")
    : "";

const canSetPassword = computed(
  () =>
    isHashChecked.value &&
    !isCheckFailed.value &&
    !isExpired.value &&
    !isResetComplete.value,
);

const startSubmit = () => {
  passwordError.value = "";
  errorField.value = "";
  isSubmitting.value = true;
};

const announce = async () => {
  await nextTick();
  heading.value?.focus();
};

const checkHash = async () => {
  if (!hash) return;

  isCheckFailed.value = false;
  isHashChecked.value = false;

  try {
    const { data: recoveryResponse } = await apiClient.invoke(
      "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired",
      { body: { hash }, fetchOptions: { timeout: 10_000 } },
    );
    // the flag sits inside an array_struct envelope, not on the response root
    isExpired.value = !!recoveryResponse.data?.[0]?.isExpired;
  } catch (error) {
    // Only the API rejecting the hash means the link is dead. A dropped
    // connection or a 5xx says nothing about it, so offer a retry instead.
    if (error instanceof ApiClientError && error.status < 500) {
      isExpired.value = true;
    } else {
      isCheckFailed.value = true;
    }
  } finally {
    isHashChecked.value = true;
  }
};

const requestRecoveryMail = async () => {
  if (isSubmitting.value) return;
  startSubmit();

  recoveryError.value = "";

  try {
    await resetPassword({
      email: email.value,
      // resolved here, because setup also runs on the server, where there is no window
      storefrontUrl: getStorefrontUrl(),
    });
    // Same wording for a known and an unknown address: the API already
    // answered both with a success.
    isRecoveryRequested.value = true;
    await announce();
  } catch (error) {
    // A rejection is operational, not about the address, so say so and keep
    // the form for another try.
    console.error(error);
    recoveryError.value = "We could not send the mail. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const confirmNewPassword = async () => {
  if (!hash || isSubmitting.value) return;
  startSubmit();

  try {
    await apiClient.invoke(
      "recoveryPassword post /account/recovery-password-confirm",
      { body: { hash, ...resetForm } },
    );
    resetForm.newPassword = "";
    resetForm.newPasswordConfirm = "";
    isResetComplete.value = true;
    await announce();
  } catch (error) {
    const pointer = rejectedPointer(error);

    if (pointer.includes("Password")) {
      errorField.value = "newPassword";
      passwordError.value =
        "That password was rejected. Check both fields match and meet the minimum length.";
    } else if (error instanceof ApiClientError) {
      passwordError.value = "This link is no longer valid.";
    } else {
      passwordError.value = "We could not reach the shop. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const submitPasswordChange = async () => {
  if (isSubmitting.value) return;
  startSubmit();

  try {
    await updatePassword(changeForm);
    changeForm.password = "";
    changeForm.newPassword = "";
    changeForm.newPasswordConfirm = "";
    isChangeComplete.value = true;
    await announce();
  } catch (error) {
    const pointer = rejectedPointer(error);

    if (pointer.includes("password") && !pointer.includes("new")) {
      errorField.value = "currentPassword";
      passwordError.value = "Your current password is not correct.";
    } else if (error instanceof ApiClientError) {
      errorField.value = "newPassword";
      passwordError.value =
        "That password was rejected. Check both fields match and meet the minimum length.";
    } else {
      passwordError.value = "We could not reach the shop. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(checkHash);
</script>

<template>
  <section v-if="hash">
    <h1 ref="heading" tabindex="-1">Choose a new password</h1>

    <!-- the live region is in the page from the start: a node inserted into
         a region that was not already there is not announced -->
    <div aria-live="polite" :aria-busy="!isHashChecked">
      <p v-if="!isHashChecked">Checking the link…</p>

      <p v-else-if="isCheckFailed">
        We could not check this link.
        <button type="button" @click="checkHash">Try again</button>
      </p>

      <p v-else-if="isExpired">
        This link is no longer valid. Request a new recovery mail.
      </p>

      <p v-else-if="isResetComplete">
        Your password was changed. You can sign in with it now.
      </p>
    </div>

    <form v-if="canSetPassword" @submit.prevent="confirmNewPassword">
      <p v-if="passwordError" id="reset-error" role="alert">
        {{ passwordError }}
      </p>

      <label>
        New password
        <input
          v-model="resetForm.newPassword"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="passwordError ? 'reset-error' : undefined"
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="resetForm.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="passwordError ? 'reset-error' : undefined"
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Save the new password" }}
      </button>
    </form>
  </section>

  <section v-else-if="isLoggedIn">
    <h1 ref="heading" tabindex="-1">Change your password</h1>

    <p v-if="isChangeComplete" role="status">Your password was changed.</p>

    <form @submit.prevent="submitPasswordChange">
      <p v-if="passwordError" id="change-error" role="alert">
        {{ passwordError }}
      </p>

      <label>
        Current password
        <input
          v-model="changeForm.password"
          type="password"
          autocomplete="current-password"
          required
          :aria-invalid="errorField === 'currentPassword'"
          :aria-describedby="
            errorField === 'currentPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <label>
        New password
        <input
          v-model="changeForm.newPassword"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="
            errorField === 'newPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="changeForm.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="
            errorField === 'newPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Change the password" }}
      </button>
    </form>
  </section>

  <section v-else>
    <h1 ref="heading" tabindex="-1">Forgot your password?</h1>

    <p v-if="isRecoveryRequested" role="status">
      If an account exists for that address, a recovery mail is on its way.
    </p>

    <form v-else @submit.prevent="requestRecoveryMail">
      <p v-if="recoveryError" role="alert">{{ recoveryError }}</p>

      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Sending…" : "Send the recovery mail" }}
      </button>
    </form>
  </section>
</template>
```

</CodeExample>

The example puts all three states on one route so it stays readable. A real storefront splits them: the recovery-mail form and the in-account change are separate pages, and the confirm step lives on the route the recovery mail links to, whose path is configured in the Admin — `vue-starter-template` serves the default `/account/recover/password` from `app/pages/account/recover/password.vue`.

Three choices in the markup are deliberate. The submit buttons carry `aria-disabled` rather than `disabled`, because a disabled control cannot hold focus — the customer who just pressed it would be thrown back to the top of the document, so the handlers guard on `isSubmitting` instead. The error paragraphs are `role="alert"` and sit inside the form, above the button, because by the time one renders the control has been re-enabled and focus is nowhere near it. And each `h1` is focusable, because the form holding focus unmounts on success — without moving focus to the heading, a screen reader never learns the request went through.

## State And Session

Neither flow touches the sales channel context. `changePassword post /account/change-password` runs inside the customer session identified by `sw-context-token` and leaves it intact, so nothing needs refreshing and `isLoggedIn` stays `true`.

The recovery flow has no session at all. The hash in the mail link is the entire credential, and the confirm operation does not issue a context token either — the customer arrives on the login form afterwards, not in their account.

## Edge Cases

- `sendRecoveryMail` answers the same way for a known and an unknown address. Never render "no account with that address" — the API does not tell you, and saying it would leak who has an account. A rejected request is a different matter: Shopware validates `storefrontUrl` and applies its rate limit before it looks the customer up, so a failure says nothing about the address. Show a generic error and keep the form instead of claiming a mail is on its way.
- The recovery hash expires, which is the whole reason `getCustomerRecoveryIsExpired` exists. Check it before showing a form, or the customer fills in two fields for nothing.
- Only a rejection from the API means the link is dead. A dropped connection or a 5xx says nothing about the hash, so treating every failure as expiry sends a customer back for a new mail they did not need — keep the two apart and offer a retry.
- Nothing in the composables carries a request deadline. Configure `apiClientConfig.timeout` or pass one per call, or a hash check that never settles leaves the page on "Checking the link…" with no error and no way out.
- `getCustomerRecoveryIsExpired` answers with an `array_struct` envelope: the flag is at `data[0].isExpired`, not on the response root. Reading it one level too high yields `undefined`, which is falsy — so a stale link renders the form as if it were valid.
- `recoveryPassword post /account/recovery-password-confirm` requires `newPassword` **and** `newPasswordConfirm`. The server compares them, so a client-side check is a convenience, not the validation — which means a mismatch comes back as a rejection you have to map to the right field.
- A completed reset does not log the customer in. Send them to the login form, or call `useUser().login()` yourself with the address and the new password.
- `changePassword post /account/change-password` requires the current `password`. A wrong one is a normal rejection and belongs on the current-password field — read `error.details.errors?.[0]?.source?.pointer` to tell it apart from a rejected new password.
- `storefrontUrl` must match a domain configured under **Sales Channel → Domains**, and the request fails validation whenever it does not — in any environment. On `localhost` nothing matches, so point `devStorefrontUrl` at a domain that does. It is not a development-only switch: once set it wins over `window.location.origin` everywhere, so clear it before going live, or the links inside your customers' recovery mails point at whatever domain it names.

## Common Mistakes

- Do not tell the customer whether the address was found, and do not let a failed request claim a mail was sent.
- Do not call `getStorefrontUrl()` in the component body — resolve it in the submit handler.
- Do not render the reset form before the hash check has answered.
- Do not read `isExpired` off the response root. It is inside the `data` array.
- Do not map every rejection to one message. A rejected password and a dead link need opposite actions from the customer, and `ApiClientError` covers both.
- Do not disable the submit button while the request runs. It drops focus and never returns it; use `aria-disabled` and guard in the handler.
- Do not treat the reset as a login. There is no session afterwards.
- Do not send only `newPassword` to the confirm operation. Both password fields are required.
- Do not reuse the recovery flow for a logged-in customer. `changePassword post /account/change-password` exists for that and verifies the current password.
- Do not keep the entered passwords in state after a successful change **or** a successful reset.
- Do not surface the raw constraint violation from a rejected `storefrontUrl`. It describes a configuration problem, not something the customer did.

## Testing Checklist

- Submitting the forgotten-password form calls `sendRecoveryMail post /account/recovery-password` with a `storefrontUrl`.
- An unknown address produces the same UI as a known one. A rejected request keeps the form and shows a generic error.
- Opening a reset link calls `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired` before any form is rendered.
- An expired hash renders the expiry message and no password form.
- A hash check that fails on the transport renders a retry, not the expiry message.
- A valid hash plus two matching passwords calls `recoveryPassword post /account/recovery-password-confirm` and reports success without creating a session.
- A completed reset clears both password fields and moves focus to the heading.
- Changing the password from the account calls `changePassword post /account/change-password` and keeps `isLoggedIn` at `true`.
- A wrong current password shows the error on the current-password field, and the fields are not cleared.
- A rejected new password shows the error on the new-password fields, not on the current one.
- The password fields are cleared and the success message is announced after a successful change.

## Related Links

- [Login recipe](login.html)
- [Register recipe](register.html)
- [Customer Profile recipe](profile.html)
- [devStorefrontUrl troubleshooting](../../resources/troubleshooting.html#what-is-devstorefronturl-and-when-to-use-it)
- [Login form page element](../../guides/page-elements/login-form.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
