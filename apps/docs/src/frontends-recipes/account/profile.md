---
nav:
  position: 50
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useUser
    - useSalutations
    - useSessionContext
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
      "Turning a guest into a customer and deleting the account have no composable. Both change who the session belongs to, so the context has to be refreshed afterwards.",
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

<RecipeFlowDiagram label="Customer profile flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The form is seeded from `useUser().user`, which already holds the customer from the context.
2. `updatePersonalInfo()` or `updateEmail()` posts the changed fields.
3. The Store API answers with a bare `SuccessResponse`.
4. `refreshUser()` sends `readCustomer post /account/customer` and writes the customer into the shared value.
5. The UI re-renders from `user` and the session flags computed over it.
6. `convertGuest post /account/convert-guest` and `deleteCustomer delete /account/customer` are called through `apiClient.invoke`, followed by a context refresh.

You do not need to send fields the customer did not change, but `firstName` and `lastName` are required by the operation — a partial profile update still has to carry both.

## Request Flow

| Step                     | Code                                                | Store API                      | Type                                                                                              |
| ------------------------ | --------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Load the salutations     | `fetchSalutations()`                                | `POST /salutation`             | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' />        |
| Change the profile       | `updatePersonalInfo(profile)`                       | `POST /account/change-profile` | <SchemaTypeTooltip type-key='operations["changeProfile post /account/change-profile"]["body"]' /> |
| Change the email address | `updateEmail(emailChange)`                          | `POST /account/change-email`   | <SchemaTypeTooltip type-key='operations["changeEmail post /account/change-email"]["body"]' />     |
| Read the customer back   | `refreshUser()`                                     | `POST /account/customer`       | <SchemaTypeTooltip type-key='operations["readCustomer post /account/customer"]["response"]' />    |
| Convert a guest          | `invoke("convertGuest …", { body: { password } })`  | `POST /account/convert-guest`  | <SchemaTypeTooltip type-key='operations["convertGuest post /account/convert-guest"]["body"]' />   |
| Delete the account       | `invoke("deleteCustomer delete /account/customer")` | `DELETE /account/customer`     | none — the operation answers `204 No Content`                                                     |

`refreshUser()` accepts a `Criteria`, so associations the context does not carry — `addresses`, `salutation`, `defaultBillingAddress` — can be requested here rather than in a second call.

## Composables

- `useUser`: the customer surface. Reads `user`, `isLoggedIn`, `isCustomerSession`, `isGuestSession`, `defaultBillingAddressId`, `defaultShippingAddressId`, `userDefaultBillingAddress`, `userDefaultShippingAddress`, `country`, `salutation`. Writes `updatePersonalInfo` and `updateEmail`, and reloads with `refreshUser`. Also offers `loadCountry(id)` and `loadSalutation(id)` for resolving a single entity by id.
- `useSalutations`: supplies the list a salutation select needs, since `changeProfile` takes a `salutationId` rather than a label. `getSalutations` is the list, not a loader — the loader is `fetchSalutations()`, and the composable already calls it on mount when the shared list is empty.
- `useSessionContext`: `refreshSessionContext()` after a conversion or a deletion, because both change which customer the token resolves to.

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

`ChangeProfileBody` shows the whole editable surface: `salutationId`, `title`, `firstName`, `lastName`, `birthdayDay`, `birthdayMonth` and `birthdayYear`. Anything else on `Customer` is not changeable through this operation.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { operations } from "#shopware";

const {
  user,
  isCustomerSession,
  isGuestSession,
  updatePersonalInfo,
  updateEmail,
  refreshUser,
} = useUser();
// getSalutations is the list itself, and the composable fetches it on mount
const { getSalutations } = useSalutations();

const profile = reactive<
  operations["changeProfile post /account/change-profile"]["body"]
>({
  salutationId: "",
  title: "",
  firstName: "",
  lastName: "",
});

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
const savedMessage = ref("");

watch(
  user,
  (customer) => {
    if (!customer) return;

    profile.salutationId = customer.salutationId ?? "";
    profile.title = customer.title ?? "";
    profile.firstName = customer.firstName ?? "";
    profile.lastName = customer.lastName ?? "";
  },
  { immediate: true }
);

const saveProfile = async () => {
  profileError.value = "";
  savedMessage.value = "";
  isSavingProfile.value = true;

  try {
    await updatePersonalInfo(profile);
    // the write returns no customer, so read it back
    await refreshUser();
    savedMessage.value = "Your details were saved.";
  } catch {
    profileError.value = "Your details could not be saved.";
  } finally {
    isSavingProfile.value = false;
  }
};

const saveEmail = async () => {
  emailError.value = "";
  savedMessage.value = "";
  isSavingEmail.value = true;

  try {
    await updateEmail(emailChange);
    await refreshUser();
    emailChange.password = "";
    savedMessage.value = "Your email address was changed.";
  } catch {
    emailError.value =
      "The email address could not be changed. Check the address and your password.";
  } finally {
    isSavingEmail.value = false;
  }
};
</script>

<template>
  <p v-if="!user">You are not signed in.</p>

  <div v-else>
    <p v-if="isGuestSession">
      You are shopping as a guest. Set a password to keep these details.
    </p>

    <p v-if="savedMessage">{{ savedMessage }}</p>

    <form @submit.prevent="saveProfile">
      <h2>Your details</h2>

      <label>
        Salutation
        <select v-model="profile.salutationId">
          <option value="">Not specified</option>
          <option
            v-for="salutation in getSalutations"
            :key="salutation.id"
            :value="salutation.id"
          >
            {{ salutation.translated?.displayName ?? salutation.displayName }}
          </option>
        </select>
      </label>

      <label>
        First name
        <input
          v-model="profile.firstName"
          type="text"
          autocomplete="given-name"
        />
      </label>

      <label>
        Last name
        <input
          v-model="profile.lastName"
          type="text"
          autocomplete="family-name"
        />
      </label>

      <p v-if="profileError">{{ profileError }}</p>

      <button type="submit" :disabled="isSavingProfile">
        {{ isSavingProfile ? "Saving…" : "Save my details" }}
      </button>
    </form>

    <form v-if="isCustomerSession" @submit.prevent="saveEmail">
      <h2>Email address</h2>
      <p>Currently {{ user.email }}</p>

      <label>
        New email
        <input v-model="emailChange.email" type="email" autocomplete="email" />
      </label>

      <label>
        Repeat the new email
        <input
          v-model="emailChange.emailConfirmation"
          type="email"
          autocomplete="email"
        />
      </label>

      <label>
        Your password
        <input
          v-model="emailChange.password"
          type="password"
          autocomplete="current-password"
        />
      </label>

      <p v-if="emailError">{{ emailError }}</p>

      <button type="submit" :disabled="isSavingEmail">
        {{ isSavingEmail ? "Saving…" : "Change my email" }}
      </button>
    </form>
  </div>
</template>
```

## State And Session

There is one customer value in the application, held under the `customer` injection by `useUser`. It is kept in sync from the session context with `syncRefs(userFromContext, _user, { immediate: true })`, so a `refreshSessionContext()` anywhere updates the profile page too.

That sync runs in one direction only — context to customer. `refreshUser()` writes the shared value directly, which is why it can carry associations the context does not have. It also means a later `refreshSessionContext()` replaces the enriched customer with the leaner one from the context.

The three session flags are computed differently and are not interchangeable. `isLoggedIn` requires an id, `active` **and** not `guest`. `isCustomerSession` requires an id and not `guest`, ignoring `active`. `isGuestSession` is just `guest`. A customer awaiting double opt-in has `active: false`, so they are a customer session but not logged in.

## Edge Cases

- `updatePersonalInfo()` and `updateEmail()` resolve to `void`. A page that does not call `refreshUser()` afterwards keeps rendering the old values until the next context refresh.
- `firstName` and `lastName` are required on `changeProfile`. Sending only a changed salutation is a constraint violation.
- The birthday is three separate integer fields — `birthdayDay`, `birthdayMonth`, `birthdayYear` — not the `birthday` string on `Customer`. Splitting and rejoining them is part of the form, not of the API.
- `changeEmail` requires `email`, `emailConfirmation` **and** the current `password`. The server compares the two addresses, so a client-side check is a convenience only.
- The new email address has to be unique across all customers. That rejection is a normal outcome and belongs on the email field.
- `refreshUser()` sets the shared customer to `undefined` and rethrows when the request fails, so an expired session empties the page rather than freezing it.
- `convertGuest post /account/convert-guest` takes only a password and turns the guest into a customer. It has no composable, and the session flags stay wrong until the context is refreshed.
- `deleteCustomer delete /account/customer` answers `204` with no body. Nothing in the frontend reacts to it — refresh the context and route the visitor away yourself.
- `userDefaultPaymentMethod` falls back to a `defaultPaymentMethod` field that was removed in 6.7. Against a current schema it reads `lastPaymentMethod` only.
- `useSalutations().getSalutations` is a `ComputedRef` of the array despite the verb in its name. Calling it as a function throws, and the list is shared across every component that mounts the composable.

## Common Mistakes

- Do not assume a successful profile write updated `user`. It did not.
- Do not treat `isCustomerSession` and `isLoggedIn` as the same flag. They differ for an inactive customer.
- Do not offer the email form to a guest session. `changeEmail` needs a password the guest does not have.
- Do not send the `birthday` string from `Customer` back to `changeProfile`.
- Do not keep the entered password in state after an email change.
- Do not call `deleteCustomer` without refreshing the context and leaving the account area.
- Do not enrich the customer with `refreshUser({ associations })` and then rely on it surviving a context refresh.
- Do not render the raw constraint violation from a duplicate email address.
- Do not call `getSalutations()`. It is the list; `fetchSalutations()` is the request.

## Testing Checklist

- The profile form is prefilled from `user` without an extra request.
- Saving the profile calls `changeProfile post /account/change-profile` and then `readCustomer post /account/customer`.
- The rendered name changes only after the refresh resolves.
- Submitting the profile without a last name is rejected and shown on that field.
- Changing the email calls `changeEmail post /account/change-email` with both addresses and the password.
- A duplicate email address shows a field-level error and leaves `user.email` unchanged.
- The password field is cleared after a successful email change.
- A guest session renders the details form but not the email form.
- A failing `refreshUser()` empties `user` instead of keeping a stale customer.

## Related Links

- [Login recipe](login.html)
- [Login form page element](../../getting-started/page-elements/login-form.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
