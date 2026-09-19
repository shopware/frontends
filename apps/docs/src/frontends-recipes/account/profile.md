---
nav:
  position: 30
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useUser
    - useSalutations
    - useSessionContext
    - useShopwareContext
  helpers: []
  operations:
    - changeProfile post /account/change-profile
    - changeEmail post /account/change-email
    - readCustomer post /account/customer
    - deleteCustomer delete /account/customer
    - convertGuest post /account/convert-guest
    - readSalutation post /salutation
  schemas:
    - Customer
    - Salutation
    - SuccessResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "UI",
    action: "Prefill the form",
    detail:
      "The form is seeded from useUser().user, which is the customer embedded in the session context. Nothing extra is requested to render it.",
    code: "const { user } = useUser()",
    state: "local form state",
    typeKeys: ['Schemas["Customer"]'],
  },
  {
    title: "Composable",
    action: "Send the change",
    detail:
      "updatePersonalInfo posts the profile fields. It resolves to void — the response carries no customer, so nothing in the application knows about the change yet.",
    code: "await updatePersonalInfo({ firstName, lastName, salutationId })",
    state: "none",
    typeKeys: [
      'operations["changeProfile post /account/change-profile"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Acknowledge only",
    detail:
      "changeProfile and changeEmail both answer with a bare SuccessResponse. This is the single fact that shapes the recipe: the write tells you nothing about the new state.",
    code: 'apiClient.invoke("changeProfile post /account/change-profile")',
    state: "sw-context-token",
    typeKeys: [
      'operations["changeProfile post /account/change-profile"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Read the customer back",
    detail:
      "refreshUser sends readCustomer and writes the result into the shared customer value. Without this call the profile page keeps rendering the previous name.",
    code: "await refreshUser()",
    state: "customer",
    typeKeys: ['operations["readCustomer post /account/customer"]["response"]'],
  },
  {
    title: "UI",
    action: "Re-render from user",
    detail:
      "user, isLoggedIn, isCustomerSession, isGuestSession and the default address ids are all computed over that one shared value.",
    code: "user?.firstName, isGuestSession",
    state: "reactive UI",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Convert or delete",
    detail:
      "Turning a guest into a customer and deleting the account have no composable — you call them with the apiClient from useShopwareContext. Both change who the session belongs to, so the context has to be refreshed afterwards.",
    code: 'apiClient.invoke("convertGuest post /account/convert-guest", { body: { password } })',
    state: "swSessionContext",
    typeKeys: [
      'operations["convertGuest post /account/convert-guest"]["body"]',
    ],
  },
];
</script>

# Customer Profile

## Goal

Build an account page that shows the logged-in customer and lets them change their name, salutation, birthday and email address. The important part is that every write here answers with a bare success response, so the composable cannot update the customer for you — reading it back is part of the flow.

## Shopware Flow

`useUser().user` is not fetched by the profile page. It is the customer embedded in the sales channel context: `useUser` keeps a shared `customer` value and syncs it from `useSessionContext().userFromContext`. That is why a profile form can be prefilled on first render without a request.

`changeProfile post /account/change-profile` and `changeEmail post /account/change-email` both respond with a `SuccessResponse` and nothing else. `updatePersonalInfo()` and `updateEmail()` therefore return `Promise<void>` and leave the shared customer untouched. Refreshing it is your job, either with `refreshUser()` or by refreshing the whole context.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Customer profile flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The form is seeded from `useUser().user`, which already holds the customer from the context.
2. `updatePersonalInfo()` or `updateEmail()` posts the changed fields.
3. The Store API answers with a bare `SuccessResponse`.
4. `refreshUser()` sends `readCustomer post /account/customer` and writes the customer into the shared value.
5. The UI re-renders from `user` and the session flags computed over it.
6. `convertGuest post /account/convert-guest` and `deleteCustomer delete /account/customer` are called through `apiClient.invoke`, followed by a context refresh.

You do not need to call `refreshSessionContext()` after a profile or email change. The token and the sales channel are untouched — only the customer record changed, and `refreshUser()` already writes the fresh customer into the shared value. Keep the context refresh for `convertGuest` and `deleteCustomer`, which change who the token resolves to.

## Request Flow

| Step                     | Code                                                          | Store API                      | Type                                                                                              |
| ------------------------ | ------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Load the salutations     | `fetchSalutations()`                                          | `POST /salutation`             | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' />        |
| Change the profile       | `updatePersonalInfo(profile)`                                 | `POST /account/change-profile` | <SchemaTypeTooltip type-key='operations["changeProfile post /account/change-profile"]["body"]' /> |
| Change the email address | `updateEmail(emailChange)`                                    | `POST /account/change-email`   | <SchemaTypeTooltip type-key='operations["changeEmail post /account/change-email"]["body"]' />     |
| Read the customer back   | `refreshUser()`                                               | `POST /account/customer`       | <SchemaTypeTooltip type-key='operations["readCustomer post /account/customer"]["response"]' />    |
| Convert a guest          | `apiClient.invoke("convertGuest …", { body: { password } })`  | `POST /account/convert-guest`  | <SchemaTypeTooltip type-key='operations["convertGuest post /account/convert-guest"]["body"]' />   |
| Delete the account       | `apiClient.invoke("deleteCustomer delete /account/customer")` | `DELETE /account/customer`     | none — the operation answers `204 No Content`                                                     |

`refreshUser()` accepts a `Criteria`, so associations the context does not carry — the full `addresses` list, the `salutation` entity — can be requested here rather than in a second call. The default addresses are a different case: `userDefaultBillingAddress` and `userDefaultShippingAddress` are computed straight off the context customer, so they are already there before you call anything.

## Composables

Pick by scope — how much of the session the composable is about:

| Composable           | Scope                           | Reach for it when                                                                 |
| -------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `useSessionContext`  | the whole sales channel context | who the token resolves to changed — a guest was converted, an account was deleted |
| `useUser`            | the customer record             | reading or writing anything on the logged-in customer                             |
| `useSalutations`     | one list of salutations         | rendering the salutation select                                                   |
| `useShopwareContext` | the raw API client              | calling an operation that has no composable — `convertGuest`, `deleteCustomer`    |

`convertGuest` and `deleteCustomer` have no composable at all, so those two go through the client itself — `const { apiClient } = useShopwareContext()`.

`useUser` is the one you reach for most:

- **Read** — `user`, `isLoggedIn`, `isCustomerSession`, `isGuestSession`, `defaultBillingAddressId`, `defaultShippingAddressId`, `userDefaultBillingAddress`, `userDefaultShippingAddress`, `userDefaultPaymentMethod`.
- **Write** — `updatePersonalInfo`, `updateEmail`, and `refreshUser` to read the customer back afterwards.
- **Resolve by id** — `loadCountry(id)` and `loadSalutation(id)` fill the `country` and `salutation` refs for a single entity.

Four things the generated reference will not tell you:

- `updatePersonalInfo()` and `updateEmail()` resolve to `void` because the operations answer with a bare `SuccessResponse`. The pair is `await updatePersonalInfo(...)` followed by `await refreshUser()`; without the second call nothing on the page changes.
- `refreshUser()` writes the shared customer directly, which is why it can carry associations the context does not have. The sync from `useSessionContext().userFromContext` runs one way only, so a later `refreshSessionContext()` replaces that enriched customer with the leaner one.
- `useSalutations().getSalutations` is a `ComputedRef` of the array despite the verb in its name — `fetchSalutations()` is the request. The composable fires it `onMounted` the first time, while the shared list is still unfetched. That mount-time call has no error surface: a rejected `readSalutation` goes to the application error handler, `getSalutations` stays empty, and the customer is told nothing. Keep `fetchSalutations` in the destructuring so you have something to retry with.
- `userDefaultPaymentMethod` falls back to a `defaultPaymentMethod` field that was removed in 6.7. Against a current schema it reads `lastPaymentMethod` only.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the profile form, the email change, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["changeProfile post /account/change-profile"]["body"]' />
  <SchemaTypeTooltip type-key='operations["changeEmail post /account/change-email"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readCustomer post /account/customer"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["Customer"]' />
  <SchemaTypeTooltip type-key='Schemas["Salutation"]' />
  <SchemaTypeTooltip type-key='Schemas["SuccessResponse"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ChangeProfileBody =
  operations["changeProfile post /account/change-profile"]["body"];
type ChangeEmailBody =
  operations["changeEmail post /account/change-email"]["body"];
type Customer = Schemas["Customer"];
type Salutation = Schemas["Salutation"];
```

`ChangeProfileBody` is an intersection of two things. The always-available fields are `salutationId`, `title`, `firstName`, `lastName`, `birthdayDay`, `birthdayMonth` and `birthdayYear`, with `firstName` and `lastName` required. On top of that sits a union over `accountType`: the `private` branch keeps `company` and `vatIds` `null`, the `business` branch requires `accountType: "business"`, a `company` and a `vatIds` array with at least one entry — all three together. Anything else on `Customer` is not changeable through this operation.

`Customer` carries the same `accountType` split, so `company` and `vatIds` are only reachable after narrowing. It is not identical to the body, though: on `Customer` the `private` branch has `accountType` **required** and drops `company` and `vatIds` entirely, while on the body they are present as `null` and `accountType` may be omitted — which is why the form state below can leave it out. Prefilling the form means reading the union, not the flat record.

## Minimal Vue Example

<CodeExample title="Minimal profile page">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import type { operations } from "#shopware";

const {
  user,
  isCustomerSession,
  isGuestSession,
  updatePersonalInfo,
  updateEmail,
  refreshUser,
} = useUser();
const { getSalutations, fetchSalutations } = useSalutations();

const profile = reactive<
  operations["changeProfile post /account/change-profile"]["body"]
>({
  salutationId: "",
  title: "",
  firstName: "",
  lastName: "",
});

const birthday = ref("");
const accountType = ref<"private" | "business">("private");
const company = ref("");
const vatId = ref("");

const emailChange = reactive<
  operations["changeEmail post /account/change-email"]["body"]
>({
  email: "",
  emailConfirmation: "",
  password: "",
});

const isSavingProfile = ref(false);
const isSavingEmail = ref(false);
const profileError = ref("");
const emailError = ref("");
const profileFieldErrors = ref<Record<string, string>>({});
const emailFieldErrors = ref<Record<string, string>>({});
const profileSaved = ref("");
const emailSaved = ref("");
const salutationsError = ref("");
const reloadError = ref("");

const messageFor = (violation: ApiError) => {
  switch (violation.code) {
    case "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE":
      return "That email address is already in use.";
    case "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT":
      return "That password is not correct.";
    case "VIOLATION::IS_BLANK_ERROR":
      return "This field is required.";
    default:
      return "This value is not valid.";
  }
};

const fieldErrorsFrom = (error: unknown): Record<string, string> => {
  if (!(error instanceof ApiClientError)) return {};

  const byField: Record<string, string> = {};
  for (const violation of error.details.errors ?? []) {
    const field = violation.source?.pointer?.split("/").pop();
    if (field) byField[field] = messageFor(violation);
  }
  return byField;
};

const loadSalutations = async () => {
  salutationsError.value = "";
  try {
    await fetchSalutations();
  } catch (error) {
    console.error(error);
    salutationsError.value = "The salutations could not be loaded.";
  }
};

onMounted(loadSalutations);

watch(
  () => user.value?.id,
  () => {
    const customer = user.value;
    if (!customer) return;

    profile.salutationId = customer.salutationId ?? "";
    profile.title = customer.title ?? "";
    profile.firstName = customer.firstName ?? "";
    profile.lastName = customer.lastName ?? "";
    birthday.value = customer.birthday?.slice(0, 10) ?? "";

    if (customer.accountType === "business") {
      accountType.value = "business";
      company.value = customer.company;
      vatId.value = customer.vatIds[0];
    } else {
      accountType.value = "private";
      company.value = "";
      vatId.value = "";
    }
  },
  { immediate: true },
);

const saveProfile = async () => {
  if (isSavingProfile.value) return;

  profileError.value = "";
  profileFieldErrors.value = {};
  profileSaved.value = "";
  isSavingProfile.value = true;

  const [year, month, day] = birthday.value.split("-");
  const basePayload =
    year && month && day
      ? {
          ...profile,
          birthdayYear: Number(year),
          birthdayMonth: Number(month),
          birthdayDay: Number(day),
        }
      : profile;

  try {
    await updatePersonalInfo(
      accountType.value === "business"
        ? {
            ...basePayload,
            accountType: "business",
            company: company.value,
            vatIds: [vatId.value],
          }
        : basePayload,
    );
  } catch (error) {
    console.error(error);
    profileFieldErrors.value = fieldErrorsFrom(error);
    if (!Object.keys(profileFieldErrors.value).length) {
      profileError.value = "Your details could not be saved.";
    }
    isSavingProfile.value = false;
    return;
  }

  try {
    await refreshUser();
    profileSaved.value = "Your details were saved.";
  } catch (error) {
    console.error(error);
    reloadError.value =
      "Your details were saved, but we could not reload your account. Reload the page to see them.";
  } finally {
    isSavingProfile.value = false;
  }
};

const saveEmail = async () => {
  if (isSavingEmail.value) return;

  emailError.value = "";
  emailFieldErrors.value = {};
  emailSaved.value = "";
  isSavingEmail.value = true;

  try {
    await updateEmail(emailChange);
  } catch (error) {
    console.error(error);
    emailFieldErrors.value = fieldErrorsFrom(error);
    if (!Object.keys(emailFieldErrors.value).length) {
      emailError.value = "The email address could not be changed.";
    }
    isSavingEmail.value = false;
    return;
  }

  emailChange.password = "";

  try {
    await refreshUser();
    emailSaved.value = "Your email address was changed.";
  } catch (error) {
    console.error(error);
    reloadError.value =
      "Your email address was changed, but we could not reload your account. Sign in with the new address.";
  } finally {
    isSavingEmail.value = false;
  }
};
</script>

<template>
  <section>
    <h1>Your profile</h1>

    <p v-if="reloadError" role="alert">{{ reloadError }}</p>

    <p v-else-if="!user">You are not signed in.</p>

    <template v-else>
      <p v-if="isGuestSession">
        You are shopping as a guest. Set a password to keep these details.
      </p>

      <form @submit.prevent="saveProfile">
        <h2>Your details</h2>

        <p v-if="profileSaved" role="status">{{ profileSaved }}</p>
        <p v-if="profileError" role="alert">{{ profileError }}</p>

        <p v-if="salutationsError" role="alert">
          {{ salutationsError }}
          <button type="button" @click="loadSalutations">Retry</button>
        </p>

        <label for="salutation">Salutation</label>
        <select id="salutation" v-model="profile.salutationId">
          <option value="">Not specified</option>
          <option
            v-for="salutation in getSalutations"
            :key="salutation.id"
            :value="salutation.id"
          >
            {{ salutation.translated?.displayName ?? salutation.displayName }}
          </option>
        </select>

        <label for="first-name">First name</label>
        <input
          id="first-name"
          v-model="profile.firstName"
          type="text"
          required
          autocomplete="given-name"
          :aria-invalid="profileFieldErrors.firstName ? true : undefined"
          :aria-describedby="
            profileFieldErrors.firstName ? 'first-name-error' : undefined
          "
        />
        <p
          v-if="profileFieldErrors.firstName"
          id="first-name-error"
          role="alert"
        >
          {{ profileFieldErrors.firstName }}
        </p>

        <label for="last-name">Last name</label>
        <input
          id="last-name"
          v-model="profile.lastName"
          type="text"
          required
          autocomplete="family-name"
          :aria-invalid="profileFieldErrors.lastName ? true : undefined"
          :aria-describedby="
            profileFieldErrors.lastName ? 'last-name-error' : undefined
          "
        />
        <p v-if="profileFieldErrors.lastName" id="last-name-error" role="alert">
          {{ profileFieldErrors.lastName }}
        </p>

        <label for="birthday">Date of birth</label>
        <input
          id="birthday"
          v-model="birthday"
          type="date"
          autocomplete="bday"
        />

        <label for="account-type">Account type</label>
        <select id="account-type" v-model="accountType">
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>

        <template v-if="accountType === 'business'">
          <label for="company">Company</label>
          <input
            id="company"
            v-model="company"
            type="text"
            autocomplete="organization"
          />

          <label for="vat-id">VAT ID</label>
          <input id="vat-id" v-model="vatId" type="text" />
        </template>

        <button
          type="submit"
          :aria-disabled="isSavingProfile"
          :aria-busy="isSavingProfile"
        >
          {{ isSavingProfile ? "Saving…" : "Save my details" }}
        </button>
      </form>

      <form v-if="isCustomerSession" @submit.prevent="saveEmail">
        <h2>Email address</h2>
        <p>Currently {{ user.email }}</p>

        <p v-if="emailSaved" role="status">{{ emailSaved }}</p>
        <p v-if="emailError" role="alert">{{ emailError }}</p>

        <label for="new-email">New email</label>
        <input
          id="new-email"
          v-model="emailChange.email"
          type="email"
          required
          autocomplete="off"
          :aria-invalid="emailFieldErrors.email ? true : undefined"
          :aria-describedby="
            emailFieldErrors.email ? 'new-email-error' : undefined
          "
        />
        <p v-if="emailFieldErrors.email" id="new-email-error" role="alert">
          {{ emailFieldErrors.email }}
        </p>

        <label for="confirm-email">Repeat the new email</label>
        <input
          id="confirm-email"
          v-model="emailChange.emailConfirmation"
          type="email"
          required
          autocomplete="off"
        />

        <label for="current-password">Your password</label>
        <input
          id="current-password"
          v-model="emailChange.password"
          type="password"
          required
          autocomplete="current-password"
          :aria-invalid="emailFieldErrors.password ? true : undefined"
          :aria-describedby="
            emailFieldErrors.password ? 'password-error' : undefined
          "
        />
        <p v-if="emailFieldErrors.password" id="password-error" role="alert">
          {{ emailFieldErrors.password }}
        </p>

        <button
          type="submit"
          :aria-disabled="isSavingEmail"
          :aria-busy="isSavingEmail"
        >
          {{ isSavingEmail ? "Saving…" : "Change my email" }}
        </button>
      </form>
    </template>
  </section>
</template>
```

</CodeExample>

## State And Session

There is one customer value in the application, held under the `customer` injection by `useUser`. It is kept in sync from the session context with `syncRefs(userFromContext, _user, { immediate: true })`, so a `refreshSessionContext()` anywhere updates the profile page too.

That sync runs in one direction only — context to customer. `refreshUser()` writes the shared value directly, which is why it can carry associations the context does not have. It also means a later `refreshSessionContext()` replaces the enriched customer with the leaner one from the context.

The three session flags are computed differently and are not interchangeable. `isLoggedIn` requires an id, `active` **and** not `guest`. `isCustomerSession` requires an id and not `guest`, ignoring `active`. `isGuestSession` is just `guest`. An inactive customer is therefore a customer session but not a logged-in one, so gate the account area on the flag you actually mean.

## Edge Cases

- `updatePersonalInfo()` and `updateEmail()` resolve to `void`. A page that does not call `refreshUser()` afterwards keeps rendering the old values until the next context refresh.
- `firstName` and `lastName` are required on `changeProfile`. Sending only a changed salutation is a constraint violation.
- The birthday is three separate integer fields — `birthdayDay`, `birthdayMonth`, `birthdayYear` — not the `birthday` string on `Customer`. Splitting and rejoining them is part of the form, not of the API.
- Switching a customer to a business account is one payload, not three loose fields: `accountType: "business"`, `company` and a `vatIds` array with at least one entry travel together. The body type is a union, so a `company` without the matching `accountType` does not compile.
- Prefill `accountType`, `company` and `vatIds` from `user` before you submit. The form defaults to `private`, and submitting that branch for a business customer sends `accountType: "private"` with no company and no VAT id.
- `vatIds` is generated as a non-empty tuple, `[string, ...string[]]`. Build it inside the call, where the parameter types the array literal; a `string[]` held in a variable first is rejected.
- `changeEmail` requires `email`, `emailConfirmation` **and** the current `password`. The server compares the two addresses, so a client-side check is a convenience only.
- The new email address has to be unique across all customers. That rejection is a normal outcome and belongs on the email field.
- `refreshUser()` sets the shared customer to `undefined` and rethrows when the request fails, so an expired session empties the page rather than freezing it. It does this on _any_ rejection, not just a 401 — a 500 or a timeout empties the page while the token is still valid. Whatever you set in that `catch` has to render outside the branch that depends on `user`, or it is destroyed before it is ever shown.
- A failed read-back after a successful write is not a failed write. Give `updatePersonalInfo`/`updateEmail` and the `refreshUser()` that follows their own `catch`, and say which of the two failed — after `changeEmail` resolves, the new address is already the customer's login.
- Constraint violations arrive as `ApiClientError.details.errors`, each carrying a `code` and a `source.pointer`. The pointer shape differs per operation — `/email` and `/data/attributes/lastName` both occur — so key on its last segment rather than matching the whole string.
- `convertGuest post /account/convert-guest` takes only a password and turns the guest into a customer. It has no composable, and the session flags stay wrong until the context is refreshed.
- `deleteCustomer delete /account/customer` answers `204` with no body. Nothing in the frontend reacts to it — refresh the context and route the visitor away yourself.
- `getSalutations` is shared through `provide`/`inject`, so every component below the one that mounted it reads the same list.

## Common Mistakes

- Do not assume a successful profile write updated `user`. It did not.
- Do not treat `isCustomerSession` and `isLoggedIn` as the same flag. They differ for an inactive customer.
- Do not offer the email form to a guest session. `changeEmail` needs a password the guest does not have.
- Do not send the `birthday` string from `Customer` back to `changeProfile`.
- Do not send `company` or `vatIds` without `accountType: "business"`.
- Do not keep the entered password in state after an email change.
- Do not call `deleteCustomer` without refreshing the context and leaving the account area.
- Do not enrich the customer with `refreshUser({ associations })` and then rely on it surviving a context refresh.
- Do not render the raw constraint violation from a duplicate email address.
- Do not report a failed read-back as a failed write. The customer acts on that message, and after `changeEmail` it sends them back to an address that no longer signs them in.
- Do not write `catch {}` without binding the error. You cannot log it, you cannot map it to a field, and a programming error reaches the customer disguised as a rejected save.
- Do not re-seed the form from a `watch` on `user`. Every `refreshUser()` assigns a new object, so the watcher overwrites whatever the customer is typing — watch `user.value?.id` instead.
- Do not call `getSalutations()`. It is the list; `fetchSalutations()` is the request.

## Testing Checklist

- The profile form is prefilled from `user` without an extra request.
- Saving the profile calls `changeProfile post /account/change-profile` and then `readCustomer post /account/customer`.
- The rendered name changes only after the refresh resolves.
- Submitting the profile without a last name is rejected and shown on that field.
- Switching to a business account sends `accountType`, `company` and `vatIds` in the same request.
- Changing the email calls `changeEmail post /account/change-email` with both addresses and the password.
- A duplicate email address shows a field-level error and leaves `user.email` unchanged.
- The password field is cleared once `changeEmail` resolves, on both the reload-success and the reload-failure path.
- A guest session renders the details form but not the email form.
- A failing `refreshUser()` empties `user` instead of keeping a stale customer.
- A `changeEmail` that succeeds followed by a `readCustomer` that fails tells the customer the address _was_ changed, not that it was rejected.
- Editing a field and then submitting the other form leaves the edit in place.

## Related Links

- [Login recipe](login.html)
- [Login form page element](../../getting-started/page-elements/login-form.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
