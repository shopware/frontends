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
    - useCart
    - useInternationalization
    - useShopwareContext
  helpers:
    - getTranslatedProperty
  operations:
    - register post /account/register
    - registerConfirm post /account/register-confirm
    - readContext get /context
    - readCart get /checkout/cart
    - readSalutation post /salutation
    - readSalutationGet get /salutation
    - readCountry post /country
    - readCountryGet get /country
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
import StorefrontUrlNotice from "../../components/StorefrontUrlNotice.vue";

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
      "register() awaits refreshSessionContext(), which reads GET /context and replaces the reactive session context, and then awaits refreshCart() so the cart is recalculated for the customer that context now carries. The customer on that response is what isLoggedIn is computed from.",
    code: "await refreshSessionContext(); await refreshCart()",
    state: "sessionContext + cart",
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
5. `register()` awaits `refreshSessionContext()`, so `readContext get /context` decides whether the session now carries a customer, and then awaits `refreshCart()`.
6. The UI reads `user`, `isLoggedIn`, and `isGuestSession` from composables instead of keeping its own copy.

<StorefrontUrlNotice
  operation="register post /account/register"
  :required="true"
  :injected="true"
/>

You do not call `readContext get /context` yourself after registering, because `register()` awaits `refreshSessionContext()` internally, and awaits `refreshCart()` right after it. `login()` and `logout()` fire their cart refresh without awaiting it, so `register()` is the one that resolves with the cart already recalculated.

## Request Flow

| Step                             | Code                                                                                                             | Store API                                                      | Type                                                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load salutation options          | `fetchSalutations()`                                                                                             | `POST /salutation`, or `GET /salutation` with `cacheableReads` | <SchemaTypeTooltip type-key='operations["readSalutation post /salutation"]["response"]' /> <SchemaTypeTooltip type-key='operations["readSalutationGet get /salutation"]["response"]' /> |
| Load countries and their states  | `fetchCountries()`                                                                                               | `POST /country`, or `GET /country` with `cacheableReads`       | <SchemaTypeTooltip type-key='operations["readCountry post /country"]["response"]' /> <SchemaTypeTooltip type-key='operations["readCountryGet get /country"]["response"]' />             |
| Read a customer group invitation | `apiClient.invoke("getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}")` | `GET /customer-group-registration/config/{customerGroupId}`    | <SchemaTypeTooltip type-key='operations["getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}"]["response"]' />                                   |
| Submit the registration          | `register(params)`                                                                                               | `POST /account/register`                                       | <SchemaTypeTooltip type-key='operations["register post /account/register"]["body"]' />                                                                                                  |
| Read the created customer        | `const customer = await register(params)`                                                                        | `POST /account/register`                                       | <SchemaTypeTooltip type-key='operations["register post /account/register"]["response"]' />                                                                                              |
| Refresh session context          | `refreshSessionContext()`                                                                                        | `GET /context`                                                 | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />                                                                                                     |
| Refresh the cart                 | `refreshCart()`                                                                                                  | `GET /checkout/cart`                                           | <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />                                                                                                  |
| Confirm a double opt-in link     | `apiClient.invoke("registerConfirm post /account/register-confirm")`                                             | `POST /account/register-confirm`                               | <SchemaTypeTooltip type-key='operations["registerConfirm post /account/register-confirm"]["body"]' />                                                                                   |

The two option lists are the only rows whose route depends on configuration. `useSalutations` and `useCountries` switch to the cacheable GET variant when `shopware.cacheableReads` is set, and `vue-starter-template` sets it, so the GET routes are what the supported template actually issues. The registration write itself is always a POST.

## Composables

- `useUser`: exposes `register`, which returns the created `Schemas["Customer"]`, plus `user`, `isLoggedIn`, `isCustomerSession`, `isGuestSession`, and `refreshUser` for the state you render afterwards.
- `useSalutations`: exposes `getSalutations` and `fetchSalutations`. It fetches the list on mount when nothing has been fetched yet — the guard is `if (!_salutations.value)`, not a length check. Its `swSalutations` injection shares the list only down a subtree: `useSalutations` both injects the key and provides it, and nothing provides it at the application root, so two callers that are siblings rather than ancestor and descendant each get their own list and each issue a request. See the [Contact form recipe](../cms/contact-form.html) for what that costs on a page holding two forms.
- `useCountries`: exposes `getCountries`, `getCountriesOptions`, `getStatesForCountry`, and `fetchCountries`. It is built the same way down to the guard — `swCountries`, `if (!_sharedCountries.value)`, provided from inside the composable — so the example never calls `fetchCountries` itself, and the same subtree limit applies. It merges `associations.states` into your criteria, which is why `getStatesForCountry` can answer from the already loaded countries without a second request.
- `useCart`: exposes `refreshCart`, which `register()` awaits for you. Reach for it directly only when the registration page renders cart state of its own.
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

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/account/register/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type RegisterBody = operations["register post /account/register"]["body"];
type RegisterPayload = Omit<RegisterBody, "storefrontUrl">;
type RegisterConfirmBody =
  operations["registerConfirm post /account/register-confirm"]["body"];
type Customer = Schemas["Customer"];
type CustomerAddress = Schemas["CustomerAddress"];
```

<!-- /automd -->

`RegisterBody` is a union discriminated by `accountType`. The `private` branch requires `company` and `vatIds` to be omitted or `null`, while the `business` branch requires `accountType: "business"`, a `company`, and a `vatIds` array with at least one entry.

`RegisterPayload` is the shape `useUser().register()` accepts, because the composable fills `storefrontUrl`. Note that `Omit` does not distribute over a union: it flattens `RegisterBody` into a single object whose `accountType`, `company`, and `vatIds` are all optional, so the composable's parameter type does **not** enforce the business branch. Build the branch yourself at submit time, as the example does, rather than trusting the type to catch a business body with no `company` — that combination is rejected by the Store API, not by the compiler.

Two things follow from the flattening. `form.accountType = "business"` and `form.vatIds = [value]` compile directly, so `accountTypeModel` in the example is a `v-model` convenience over an optional field rather than something the type forces on you. And the `private` and `business` shapes the section above describes are only enforced on the wire, so nothing in your editor stops you sending a half-filled business body.

## Minimal Vue Example

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/account/register/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { operations } from "#shopware";

const { register, isLoggedIn, isGuestSession, user } = useUser();
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
  acceptedDataProtection: false,
  billingAddress: {
    id: "",
    customerId: "",
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
});

const vatId = ref("");
const isSubmitting = ref(false);
const registerError = ref("");
const errorsByPointer = reactive<Record<string, string>>({});
const isAwaitingConfirmation = ref(false);
const confirmation = ref<HTMLElement>();

const renderedPointers = new Set([
  "/email",
  "/password",
  "/billingAddress/company",
  "/billingAddress/street",
  "/billingAddress/zipcode",
  "/billingAddress/city",
  "/billingAddress/countryId",
]);

const countryStates = computed(() =>
  getStatesForCountry(form.billingAddress.countryId),
);

watch(
  () => form.billingAddress.countryId,
  () => {
    form.billingAddress.countryStateId = "";
  },
);

const accountTypeModel = computed({
  get: () => form.accountType ?? "private",
  set: (value: "private" | "business") => {
    form.accountType = value;
  },
});

const violationMessages: Record<string, string> = {
  "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE":
    "An account with this email address already exists.",
  "VIOLATION::IS_BLANK_ERROR": "This field is required.",
  "VIOLATION::TOO_SHORT_ERROR": "This value is too short.",
  "VIOLATION::ZIP_CODE_INVALID":
    "This postal code is not valid for the selected country.",
  "VIOLATION::VAT_ID_FORMAT_NOT_CORRECT":
    "This VAT ID does not have the correct format.",
};

const formMessageFor = (code?: string) =>
  (code && violationMessages[code]) || "The account could not be created.";

const fieldMessageFor = (code?: string) =>
  (code && violationMessages[code]) || "Please check this value.";

const submit = async () => {
  if (isSubmitting.value) return;

  registerError.value = "";
  for (const key of Object.keys(errorsByPointer)) {
    delete errorsByPointer[key];
  }
  isSubmitting.value = true;

  try {
    const isBusiness = form.accountType === "business";
    const customer = await register({
      ...form,
      ...(isBusiness
        ? { company: form.billingAddress.company, vatIds: [vatId.value] }
        : { company: null, vatIds: null }),
      billingAddress: {
        ...form.billingAddress,
        firstName: form.firstName,
        lastName: form.lastName,
      },
    });

    isAwaitingConfirmation.value = !!customer.doubleOptInRegistration;
    await nextTick();
    confirmation.value?.focus();
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiErrors = error.details?.errors ?? [];
      const formMessages: string[] = [];
      let shownInField = false;

      for (const apiError of apiErrors) {
        const pointer = apiError.source?.pointer;

        if (pointer && renderedPointers.has(pointer)) {
          errorsByPointer[pointer] = fieldMessageFor(apiError.code);
          shownInField = true;
        } else {
          formMessages.push(formMessageFor(apiError.code));
        }
      }

      if (formMessages.length) {
        registerError.value = formMessages.join(" ");
      } else if (!shownInField) {
        registerError.value = formMessageFor();
      }
    } else if (isTimeoutError(error)) {
      registerError.value =
        "The request timed out. Your account may already exist, so try signing in before registering again.";
    } else {
      console.error(error);
      registerError.value =
        "We could not confirm your registration. Your account may already exist, so try signing in before registering again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <p v-if="registerError" role="alert">{{ registerError }}</p>

  <p
    v-if="isAwaitingConfirmation"
    ref="confirmation"
    tabindex="-1"
    role="status"
  >
    Check your inbox and open the confirmation link to activate the account.
  </p>

  <p v-else-if="isLoggedIn" role="status">
    Signed in as {{ user?.firstName || user?.email }}
  </p>

  <template v-else>
    <p v-if="isGuestSession" role="status">
      Continuing as a guest with {{ user?.email }}. Create an account below to
      keep your order history.
    </p>

    <form @submit.prevent="submit">
      <h2>Create an account</h2>

      <label>
        Account type
        <select v-model="accountTypeModel">
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>
      </label>

      <label>
        Salutation
        <select
          v-model="form.salutationId"
          autocomplete="honorific-prefix"
          required
        >
          <option value="" disabled>Please select</option>
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
        <input v-model="form.firstName" autocomplete="given-name" required />
      </label>

      <label>
        Last name
        <input v-model="form.lastName" autocomplete="family-name" required />
      </label>

      <label>
        Email
        <input
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="errorsByPointer['/email'] ? true : undefined"
          :aria-describedby="
            errorsByPointer['/email'] ? 'email-error' : undefined
          "
        />
      </label>
      <p v-if="errorsByPointer['/email']" id="email-error">
        {{ errorsByPointer["/email"] }}
      </p>

      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorsByPointer['/password'] ? true : undefined"
          :aria-describedby="
            errorsByPointer['/password'] ? 'password-error' : undefined
          "
        />
      </label>
      <p v-if="errorsByPointer['/password']" id="password-error">
        {{ errorsByPointer["/password"] }}
      </p>

      <fieldset>
        <legend>Billing address</legend>

        <template v-if="accountTypeModel === 'business'">
          <label>
            Company
            <input
              v-model="form.billingAddress.company"
              autocomplete="organization"
              required
              :aria-invalid="
                errorsByPointer['/billingAddress/company'] ? true : undefined
              "
              :aria-describedby="
                errorsByPointer['/billingAddress/company']
                  ? 'company-error'
                  : undefined
              "
            />
          </label>
          <p
            v-if="errorsByPointer['/billingAddress/company']"
            id="company-error"
          >
            {{ errorsByPointer["/billingAddress/company"] }}
          </p>

          <label>
            VAT ID
            <input v-model="vatId" required />
          </label>
        </template>

        <label>
          Street
          <input
            v-model="form.billingAddress.street"
            autocomplete="street-address"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/street'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/street']
                ? 'street-error'
                : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/street']" id="street-error">
          {{ errorsByPointer["/billingAddress/street"] }}
        </p>

        <label>
          Postal code
          <input
            v-model="form.billingAddress.zipcode"
            autocomplete="postal-code"
            :aria-invalid="
              errorsByPointer['/billingAddress/zipcode'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/zipcode']
                ? 'zipcode-error'
                : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/zipcode']" id="zipcode-error">
          {{ errorsByPointer["/billingAddress/zipcode"] }}
        </p>

        <label>
          City
          <input
            v-model="form.billingAddress.city"
            autocomplete="address-level2"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/city'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/city'] ? 'city-error' : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/city']" id="city-error">
          {{ errorsByPointer["/billingAddress/city"] }}
        </p>

        <label>
          Country
          <select
            v-model="form.billingAddress.countryId"
            autocomplete="country"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/countryId'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/countryId']
                ? 'country-error'
                : undefined
            "
          >
            <option value="" disabled>Please select</option>
            <option
              v-for="country in getCountriesOptions"
              :key="country.value"
              :value="country.value"
            >
              {{ country.label }}
            </option>
          </select>
        </label>
        <p
          v-if="errorsByPointer['/billingAddress/countryId']"
          id="country-error"
        >
          {{ errorsByPointer["/billingAddress/countryId"] }}
        </p>

        <label v-if="countryStates?.length">
          State
          <select
            v-model="form.billingAddress.countryStateId"
            autocomplete="address-level1"
          >
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
      </fieldset>

      <label>
        <input v-model="form.acceptedDataProtection" type="checkbox" required />
        I accept the data protection terms
      </label>

      <button
        type="submit"
        :aria-disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Creating account..." : "Create account" }}
      </button>
    </form>
  </template>
</template>
```

<!-- /automd -->

## State And Session

The Store API identifies the sales channel session with the `sw-context-token` header, and registration runs inside the session the visitor already has. The customer is created against that token, so the guest context the visitor browsed with becomes the customer context without a new token being requested.

`useUser().register()` assigns the returned customer to the shared customer context only when `active` is true and `doubleOptInRegistration` is false. It then awaits `refreshSessionContext()`, which invokes `readContext get /context` and replaces the reactive session context. `useUser` keeps its customer ref synced with `userFromContext`, so that context response is what `user`, `isLoggedIn`, `isCustomerSession`, and `isGuestSession` are computed from.

`register()` awaits `refreshCart()` after the context refresh, so line item prices, promotions, and rule matches are re-evaluated against the customer in the context before the promise resolves. `login()` and `logout()` call `refreshCart()` without awaiting it, which is why only `register()` guarantees a settled cart by the time it returns.

`storefrontUrl` is resolved inside `register()` by `getStorefrontUrl()`, which returns the configured `devStorefrontUrl` or `window.location.origin`. The Store API only accepts a value that matches a configured domain of the sales channel, and it is the base for the confirmation link in the double opt-in email.

## Edge Cases

- The generated `billingAddress` type is `Schemas["CustomerAddress"]`, which marks `id` and `customerId` as required. The Store API does not need them — a register body that omits both is accepted — so the empty strings `vue-starter-template` sends are there to satisfy the generated type, not the route. Omit them if your form state is not typed against `CustomerAddress`.
- A business account is validated against `billingAddress.company`, not the top-level `company` the generated union declares. Bind your Company input to `form.billingAddress.company` as `vue-starter-template` does; a body that only sets the top-level field comes back with `VIOLATION::IS_BLANK_ERROR` pointing at `/billingAddress/company`. Send the top-level `company` and `vatIds` too, because the union requires them on the business branch.
- A registration with double opt-in enabled resolves successfully while leaving `isLoggedIn` false. Branch on the returned `doubleOptInRegistration` flag instead of assuming a session exists after the promise resolves.
- `refreshSessionContext()` rethrows after logging, and the `refreshCart()` that `register()` awaits right after it has no error handling at all, so a failure on either read rejects the `register()` promise even though the customer was already created. A retry then hits `VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE`, so send the customer to sign-in or password reset instead of inviting another submit.
- `useUser().register()` writes the customer into the shared context before it awaits those two reads, so `isLoggedIn` can already be `true` when the promise rejects. Render your form-level error outside the branch that the form itself lives in, or the message lands in a subtree that has just unmounted.
- A timeout or a dropped connection is not an `ApiClientError`, so it falls through the `instanceof` branch. `apiClientConfig.timeout` has no default, which means an unanswered request leaves a submit button pending indefinitely unless you configure one and branch on `isTimeoutError`.
- `useSalutations` and `useCountries` load their lists in `onMounted`, and they keep them in a provided ref rather than in Nuxt state, so nothing is serialized into the payload. Both selects therefore render with only their placeholder option during server-side rendering and fill one tick after hydration. Call `fetchSalutations()` and `fetchCountries()` yourself if you need the options present in the server-rendered HTML.
- The session branches of the form are decided by the customer in the session context, which is anonymous during server-side rendering unless `useUserContextInSSR` is enabled. Put a registration page on a route that opts out of SSR, the way `vue-starter-template` marks `/account/**` with `ssr: false`, or the signed-in branch will hydrate over a server-rendered form.
- `getStorefrontUrl()` falls back to `window.location.origin` whenever `devStorefrontUrl` is unset, and `window` does not exist during server-side rendering, so calling it on the server throws a `ReferenceError` rather than returning an empty string. Submit the form from the client, and set `devStorefrontUrl` when the Shopware domain differs from the origin your app runs on. An origin that is not a configured sales channel domain comes back as a constraint violation pointing at `/storefrontUrl`, which no field in your form owns.
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
- Do not call `refreshCart()` yourself after `register()`. The composable already awaits one, so a second call is a redundant request.
- Do not render `error.details.errors` as they arrive. Map `code` to your own copy and use `source.pointer` to place the message next to its field.

## Testing Checklist

- Submitting the form calls `register post /account/register` with a `billingAddress` and a `storefrontUrl` the form never set.
- A successful registration without double opt-in refreshes the session context and the cart, and flips `isLoggedIn` to true.
- A registration with double opt-in renders the confirmation notice and leaves `isLoggedIn` false.
- Registering with an email that already exists shows a mapped message for `VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE` and keeps the entered values.
- A constraint violation on `billingAddress.zipcode` is rendered next to the postal code field, resolved from `source.pointer`.
- Switching `accountType` to `business` sends `billingAddress.company`, and the registration is accepted rather than rejected at `/billingAddress/company`.
- A constraint violation on a field the form does not render, such as `/storefrontUrl`, still reaches the customer as a form-level message instead of being dropped.
- Selecting a country with states renders the state select, and selecting one without it does not.
- Opening the confirmation link calls `registerConfirm post /account/register-confirm` with `hash` and `em`, then refreshes the session context.
- A second visit to the confirmation link renders the already-confirmed state instead of an error toast.

## Related Links

- [Login recipe](login.html)
- [Session Context recipe](../context/session-context.html)
- [Customer Profile recipe](profile.html)
- [Storefront URL](../../guides/storefront-url.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Cart documentation](../../guides/e-commerce/cart.html)
- [devStorefrontUrl troubleshooting](../../resources/troubleshooting.html#what-is-devstorefronturl-and-when-to-use-it)
