---
nav:
  position: 20
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useUser
    - useSalutations
    - useCountries
    - useSessionContext
    - useInternationalization
    - useShopwareContext
  helpers:
    - getTranslatedProperty
  operations:
    - register post /account/register
    - registerConfirm post /account/register-confirm
    - readContext get /context
    - readSalutation post /salutation
    - readCountry post /country
    - getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}
  schemas:
    - Customer
    - CustomerAddress
    - Salutation
    - Country
    - CountryState
    - CustomerGroup
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Collect the registration body",
    detail:
      "The form owns one object shaped like the register body. A billing address is part of that body, not a second request, and salutations and countries come from their own read routes before the customer can pick anything.",
    code: "reactive<Omit<RegisterBody, 'storefrontUrl'>>({ ... })",
    state: "local form state",
    typeKeys: ['Schemas["Salutation"]', 'Schemas["Country"]'],
  },
  {
    title: "Composable",
    action: "Add the storefront URL",
    detail:
      "useUser().register() is the only place storefrontUrl is set. It calls useInternationalization().getStorefrontUrl(), which returns devStorefrontUrl or window.location.origin, and the Store API rejects a value that is not a configured sales channel domain.",
    code: "register({ ...params, storefrontUrl: getStorefrontUrl() })",
    state: "sw-context-token",
    typeKeys: ['operations["register post /account/register"]["body"]'],
  },
  {
    title: "Store API",
    action: "Create the customer",
    detail:
      "The register route creates the customer in the sales channel session identified by the context token and responds with the full Customer, including active and doubleOptInRegistration.",
    code: 'apiClient.invoke("register post /account/register")',
    state: "customer record",
    typeKeys: [
      'operations["register post /account/register"]["response"]',
      'Schemas["Customer"]',
    ],
  },
  {
    title: "Composable",
    action: "Decide whether a session exists",
    detail:
      "register() assigns the returned customer to the shared customer context only when active is true and doubleOptInRegistration is false. A double opt-in registration therefore creates a customer without creating a customer session.",
    code: "if (data.active && !data.doubleOptInRegistration) _user.value = data",
    state: "shared customer context",
    typeKeys: ['Schemas["Customer"]'],
  },
  {
    title: "Context",
    action: "Refresh the session context",
    detail:
      "register() awaits refreshSessionContext(), which reads GET /context and replaces the reactive session context. The customer on that response is what isLoggedIn is computed from.",
    code: "await refreshSessionContext()",
    state: "sessionContext",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "UI",
    action: "Branch on the response",
    detail:
      "The component reads user, isLoggedIn, and isGuestSession from useUser, and uses the returned doubleOptInRegistration flag to show the confirmation notice instead of navigating to the account area.",
    code: "user + isLoggedIn + isGuestSession + doubleOptInRegistration",
    state: "reactive UI",
    typeKeys: ['Schemas["Customer"]'],
  },
];
</script>

# Register

## Goal

Build a customer registration form and understand what the Store API does with the body you send. The important part is not the field list, but that one `register post /account/register` request creates the customer and its billing address at once, and that whether the customer ends up with a session depends on `active` and `doubleOptInRegistration` in the response.

## Shopware Flow

Registration is a single write. `register post /account/register` takes `email`, `password`, `firstName`, `lastName`, `acceptedDataProtection`, `storefrontUrl`, and a `billingAddress`, and returns the created `Customer`. An optional `shippingAddress` uses the same `CustomerAddress` shape, and the Store API reuses the customer name for the addresses when you do not send it explicitly.

`useUser().register()` accepts the body without `storefrontUrl` and fills that field itself from `useInternationalization().getStorefrontUrl()`. Everything else the form needs comes from separate read routes: `readSalutation post /salutation` for `salutationId` and `readCountry post /country` for `billingAddress.countryId` and `billingAddress.countryStateId`.

The response, not the HTTP status, tells you what happened. When double opt-in registration is enabled in the Shopware Admin, the returned customer carries `doubleOptInRegistration` and no session is created until the customer opens the confirmation email, which points at `registerConfirm post /account/register-confirm`.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Register flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer fills one object shaped like the register body, including the nested `billingAddress`, with salutation and country options loaded from their own routes.
2. `useUser().register()` adds `storefrontUrl` from `getStorefrontUrl()` and posts the body.
3. The Store API creates the customer in the session identified by `sw-context-token` and returns the `Customer`.
4. `register()` writes that customer into the shared customer context only when `active` is true and `doubleOptInRegistration` is false.
5. `register()` awaits `refreshSessionContext()`, so `readContext get /context` decides whether the session now carries a customer.
6. The UI reads `user`, `isLoggedIn`, and `isGuestSession` from composables instead of keeping its own copy.

You do not call `readContext get /context` yourself after registering, because `register()` awaits `refreshSessionContext()` internally. Unlike `login()`, it does not call `refreshCart()`, so a cart already rendered on the page keeps the totals it had before the customer existed.

## Request Flow

| Step                             | Code                                                                                                             | Store API                                                   | Type                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load salutation options          | `fetchSalutations()`                                                                                             | `POST /salutation`                                          | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' />                                                            |
| Load countries and their states  | `fetchCountries()`                                                                                               | `POST /country`                                             | <SchemaTypeTooltip type-key='operations["readCountry post /country"]["response"]' />                                                                  |
| Read a customer group invitation | `apiClient.invoke("getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}")` | `GET /customer-group-registration/config/{customerGroupId}` | <SchemaTypeTooltip type-key='operations["getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}"]["response"]' /> |
| Submit the registration          | `register(params)`                                                                                               | `POST /account/register`                                    | <SchemaTypeTooltip type-key='operations["register post /account/register"]["body"]' />                                                                |
| Read the created customer        | `const customer = await register(params)`                                                                        | `POST /account/register`                                    | <SchemaTypeTooltip type-key='operations["register post /account/register"]["response"]' />                                                            |
| Refresh session context          | `refreshSessionContext()`                                                                                        | `GET /context`                                              | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />                                                                   |
| Confirm a double opt-in link     | `apiClient.invoke("registerConfirm post /account/register-confirm")`                                             | `POST /account/register-confirm`                            | <SchemaTypeTooltip type-key='operations["registerConfirm post /account/register-confirm"]["body"]' />                                                 |

## Composables

- `useUser`: exposes `register`, which returns the created `Schemas["Customer"]`, plus `user`, `isLoggedIn`, `isCustomerSession`, `isGuestSession`, and `refreshUser` for the state you render afterwards.
- `useSalutations`: exposes `getSalutations` and `fetchSalutations`. It fetches the list on mount when nothing has been provided yet and shares it through the `swSalutations` injection, so several forms on one page issue one request.
- `useCountries`: exposes `getCountries`, `getCountriesOptions`, `getStatesForCountry`, and `fetchCountries`. It merges `associations.states` into your criteria, which is why `getStatesForCountry` can answer from the already loaded countries without a second request.
- `useSessionContext`: exposes `refreshSessionContext` and `userFromContext`. `useUser` keeps its customer ref in sync with `userFromContext`, so the context response is the source of truth for the session.
- `useInternationalization`: exposes `getStorefrontUrl`, which `register()` uses to fill `storefrontUrl`. It returns the configured `devStorefrontUrl` or `window.location.origin`.
- `useShopwareContext`: exposes `apiClient` for `registerConfirm post /account/register-confirm`, which no composable wraps.

## Types

Use generated Store API types when you type the registration body, the created customer, or the option lists behind the form:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["register post /account/register"]["body"]' />
  <SchemaTypeTooltip type-key='operations["register post /account/register"]["response"]' />
  <SchemaTypeTooltip type-key='operations["registerConfirm post /account/register-confirm"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["Customer"]' />
  <SchemaTypeTooltip type-key='Schemas["CustomerAddress"]' />
  <SchemaTypeTooltip type-key='Schemas["Salutation"]' />
  <SchemaTypeTooltip type-key='Schemas["Country"]' />
  <SchemaTypeTooltip type-key='Schemas["CountryState"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type RegisterBody = operations["register post /account/register"]["body"];
type RegisterPayload = Omit<RegisterBody, "storefrontUrl">;
type RegisterConfirmBody =
  operations["registerConfirm post /account/register-confirm"]["body"];
type Customer = Schemas["Customer"];
type CustomerAddress = Schemas["CustomerAddress"];
```

`RegisterBody` is a union discriminated by `accountType`. The `private` branch keeps `company` and `vatIds` null, while the `business` branch requires `accountType: "business"`, a `company`, and a `vatIds` array with at least one entry. `RegisterPayload` is the shape `useUser().register()` accepts, because the composable fills `storefrontUrl`.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { operations } from "#shopware";

const { register, isLoggedIn, user } = useUser();
const { getSalutations } = useSalutations();
const { getCountriesOptions, getStatesForCountry } = useCountries();

type RegisterPayload = Omit<
  operations["register post /account/register"]["body"],
  "storefrontUrl"
>;

const form = reactive<RegisterPayload>({
  accountType: "private",
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  company: "",
  vatIds: [""],
  acceptedDataProtection: false,
  billingAddress: {
    // The generated CustomerAddress type requires both ids, and the Store API
    // assigns the real ones while it creates the address.
    id: "",
    customerId: "",
    firstName: "",
    lastName: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
});

const isSubmitting = ref(false);
const registerError = ref("");
const fieldErrors = reactive<Record<string, string>>({});
const awaitsConfirmation = ref(false);

// getStatesForCountry answers from the countries already loaded with their
// states association, so switching country needs no extra request.
const countryStates = computed(() =>
  getStatesForCountry(form.billingAddress.countryId)
);

// A countryStateId left over from the previous country would be sent as is.
watch(
  () => form.billingAddress.countryId,
  () => {
    form.billingAddress.countryStateId = "";
  }
);

// The generated body is a union, so accountType is a literal and vatIds can be
// null. Bind both through typed models instead of writing into them directly.
const accountTypeModel = computed({
  get: () => form.accountType ?? "private",
  set: (value: "private" | "business") => {
    form.accountType = value;
  },
});

const vatIdModel = computed({
  get: () => form.vatIds?.[0] ?? "",
  set: (value: string) => {
    form.vatIds = [value];
  },
});

const messages: Record<string, string> = {
  "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE":
    "An account with this email address already exists.",
  "VIOLATION::IS_BLANK_ERROR": "This field is required.",
  "VIOLATION::TOO_SHORT_ERROR": "This value is too short.",
  "VIOLATION::ZIP_CODE_INVALID":
    "This postal code is not valid for the selected country.",
  "VIOLATION::VAT_ID_FORMAT_NOT_CORRECT":
    "This VAT ID does not have the correct format.",
};

const messageFor = (code?: string) =>
  (code && messages[code]) || "The account could not be created.";

const submit = async () => {
  registerError.value = "";
  for (const key of Object.keys(fieldErrors)) {
    delete fieldErrors[key];
  }
  isSubmitting.value = true;

  try {
    const customer = await register({
      ...form,
      billingAddress: {
        ...form.billingAddress,
        firstName: form.firstName,
        lastName: form.lastName,
      },
    });

    awaitsConfirmation.value = !!customer.doubleOptInRegistration;
  } catch (error) {
    if (error instanceof ApiClientError) {
      // Constraint violations carry a JSON pointer to the field they belong to,
      // so a nested billingAddress error can be shown next to its input.
      for (const apiError of error.details.errors) {
        const pointer = apiError.source?.pointer;

        if (pointer) {
          fieldErrors[pointer] = messageFor(apiError.code);
        } else {
          registerError.value = messageFor(apiError.code);
        }
      }
    } else {
      registerError.value = "The account could not be created.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <p v-if="awaitsConfirmation">
    Check your inbox and open the confirmation link to activate the account.
  </p>

  <p v-else-if="isLoggedIn">
    Signed in as {{ user?.firstName || user?.email }}
  </p>

  <form v-else @submit.prevent="submit">
    <label>
      Account type
      <select v-model="accountTypeModel">
        <option value="private">Private</option>
        <option value="business">Business</option>
      </select>
    </label>

    <label>
      Salutation
      <select v-model="form.salutationId">
        <option value="">Please select</option>
        <option
          v-for="salutation in getSalutations"
          :key="salutation.id"
          :value="salutation.id"
        >
          {{ getTranslatedProperty(salutation, "displayName") }}
        </option>
      </select>
    </label>

    <label>
      First name
      <input v-model="form.firstName" autocomplete="given-name" />
    </label>

    <label>
      Last name
      <input v-model="form.lastName" autocomplete="family-name" />
    </label>

    <label>
      Email
      <input v-model="form.email" type="email" autocomplete="email" />
    </label>
    <p v-if="fieldErrors['/email']">{{ fieldErrors["/email"] }}</p>

    <label>
      Password
      <input
        v-model="form.password"
        type="password"
        autocomplete="new-password"
      />
    </label>
    <p v-if="fieldErrors['/password']">{{ fieldErrors["/password"] }}</p>

    <template v-if="accountTypeModel === 'business'">
      <label>
        Company
        <input v-model="form.company" autocomplete="organization" />
      </label>

      <label>
        VAT ID
        <input v-model="vatIdModel" />
      </label>
    </template>

    <label>
      Street
      <input
        v-model="form.billingAddress.street"
        autocomplete="street-address"
      />
    </label>
    <p v-if="fieldErrors['/billingAddress/street']">
      {{ fieldErrors["/billingAddress/street"] }}
    </p>

    <label>
      Postal code
      <input v-model="form.billingAddress.zipcode" autocomplete="postal-code" />
    </label>
    <p v-if="fieldErrors['/billingAddress/zipcode']">
      {{ fieldErrors["/billingAddress/zipcode"] }}
    </p>

    <label>
      City
      <input v-model="form.billingAddress.city" autocomplete="address-level2" />
    </label>

    <label>
      Country
      <select v-model="form.billingAddress.countryId">
        <option value="">Please select</option>
        <option
          v-for="country in getCountriesOptions"
          :key="country.value"
          :value="country.value"
        >
          {{ country.label }}
        </option>
      </select>
    </label>

    <label v-if="countryStates?.length">
      State
      <select v-model="form.billingAddress.countryStateId">
        <option value="">Please select</option>
        <option
          v-for="state in countryStates"
          :key="state.id"
          :value="state.id"
        >
          {{ getTranslatedProperty(state, "name") }}
        </option>
      </select>
    </label>

    <label>
      <input v-model="form.acceptedDataProtection" type="checkbox" />
      I accept the data protection terms
    </label>

    <p v-if="registerError">{{ registerError }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Creating account..." : "Create account" }}
    </button>
  </form>
</template>
```

## State And Session

The Store API identifies the sales channel session with the `sw-context-token` header, and registration runs inside the session the visitor already has. The customer is created against that token, so the guest context the visitor browsed with becomes the customer context without a new token being requested.

`useUser().register()` assigns the returned customer to the shared customer context only when `active` is true and `doubleOptInRegistration` is false. It then awaits `refreshSessionContext()`, which invokes `readContext get /context` and replaces the reactive session context. `useUser` keeps its customer ref synced with `userFromContext`, so that context response is what `user`, `isLoggedIn`, `isCustomerSession`, and `isGuestSession` are computed from.

`register()` does not call `refreshCart()`, and `login()` does. If the customer registers while a cart is on screen, call `refreshCart()` from `useCart` yourself, because line item prices, promotions, and rule matches are evaluated against the customer in the context.

`storefrontUrl` is resolved inside `register()` by `getStorefrontUrl()`, which returns the configured `devStorefrontUrl` or `window.location.origin`. The Store API only accepts a value that matches a configured domain of the sales channel, and it is the base for the confirmation link in the double opt-in email.

## Edge Cases

- The generated `billingAddress` type is `Schemas["CustomerAddress"]`, which requires `id` and `customerId`. Send placeholder values as both starter templates do, because you cannot know the ids of an address that does not exist yet.
- A registration with double opt-in enabled resolves successfully while leaving `isLoggedIn` false. Branch on the returned `doubleOptInRegistration` flag instead of assuming a session exists after the promise resolves.
- `refreshSessionContext()` rethrows after logging, so a failing `readContext get /context` rejects the `register()` promise even though the customer was already created. A retry then hits `VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE`.
- `getStorefrontUrl()` falls back to `window.location.origin`, which is empty during server-side rendering. Submit the form from the client, and set `devStorefrontUrl` when the Shopware domain differs from the origin your app runs on. An origin that is not a configured sales channel domain comes back as a constraint violation pointing at `/storefrontUrl`, which no field in your form owns.
- `guest: true` creates a guest customer that can reuse an email address and needs no password. `isLoggedIn` stays false for that customer because it is computed as `!!id && active && !guest`, while `isGuestSession` becomes true.
- A `requestedGroupId` does not move the customer into that group. It stores the request, and the group has to be available for registration in the current sales channel, which `getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}` reports through `registrationActive` and `registrationOnlyCompanyRegistration`.
- `registerConfirm post /account/register-confirm` needs both `hash` and `em` from the email link, and answers a second click with `CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED`. Treat that code as an expected state, not a failure.
- No composable wraps the confirm call, so nothing refreshes the session for you. Call `refreshSessionContext()` after it, otherwise the customer is authenticated in the Store API while your UI still renders as signed out.
- Country states are only present because `useCountries` requests the `states` association. `getStatesForCountry` returns `null` for a country that has none, and a `countryStateId` left over from a previously selected country stays in the form until you clear it.

## Common Mistakes

- Do not send a separate address request after registering. The billing address is part of the register body, and `shippingAddress` is a second field in that same body.
- Do not treat a resolved `register()` call as a logged-in customer. Check `doubleOptInRegistration` and `isLoggedIn`.
- Do not set `storefrontUrl` yourself when calling `useUser().register()`. The composable fills it and the parameter type omits it.
- Do not keep a local copy of the registered customer. Read `user`, `isLoggedIn`, and `isGuestSession` from `useUser`.
- Do not leave the cart untouched when registration signs the customer in and prices are already on screen.
- Do not render `error.details.errors` as they arrive. Map `code` to your own copy and use `source.pointer` to place the message next to its field.

## Testing Checklist

- Submitting the form calls `register post /account/register` with a `billingAddress` and a `storefrontUrl` the form never set.
- A successful registration without double opt-in refreshes the session context and flips `isLoggedIn` to true.
- A registration with double opt-in renders the confirmation notice and leaves `isLoggedIn` false.
- Registering with an email that already exists shows a mapped message for `VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE` and keeps the entered values.
- A constraint violation on `billingAddress.zipcode` is rendered next to the postal code field, resolved from `source.pointer`.
- Switching `accountType` to `business` sends `company` and a non-empty `vatIds`.
- Selecting a country with states renders the state select, and selecting one without it does not.
- Opening the confirmation link calls `registerConfirm post /account/register-confirm` with `hash` and `em`, then refreshes the session context.
- A second visit to the confirmation link renders the already-confirmed state instead of an error toast.

## Related Links

- [Login recipe](login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Cart documentation](../../getting-started/e-commerce/cart.html)
