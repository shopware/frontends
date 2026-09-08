---
nav:
  position: 60
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useAddress
    - useCountries
    - useSalutations
    - useSessionContext
  helpers: []
  operations:
    - listAddress post /account/list-address
    - createCustomerAddress post /account/address
    - updateCustomerAddress patch /account/address/{addressId}
    - deleteCustomerAddress delete /account/address/{addressId}
    - defaultBillingAddress patch /account/address/default-billing/{addressId}
    - defaultShippingAddress patch /account/address/default-shipping/{addressId}
    - readCountry post /country
    - readSalutation post /salutation
  schemas:
    - CustomerAddress
    - CustomerAddressBody
    - Country
    - CountryState
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Open the address book",
    detail:
      "The page loads the list once. useCountries and useSalutations fetch their own lists on mount, so a form can be rendered without extra plumbing.",
    code: "await loadCustomerAddresses()",
    state: "swCustomerAddresses",
    typeKeys: ['operations["listAddress post /account/list-address"]["response"]'],
  },
  {
    title: "Store API",
    action: "Search the addresses",
    detail:
      "listAddress is a criteria search scoped to the customer behind the context token. The result is an EntitySearchResult, so the addresses come out of elements.",
    code: 'apiClient.invoke("listAddress post /account/list-address", { body: criteria })',
    state: "sw-context-token",
    typeKeys: ['Schemas["CustomerAddress"]'],
  },
  {
    title: "UI",
    action: "Submit the form",
    detail:
      "Create and update take the same fields. The only difference is that an update also needs the address id, which goes into the path rather than the body.",
    code: "await updateCustomerAddress(address)",
    state: "local form state",
    typeKeys: ['Schemas["CustomerAddressBody"]'],
  },
  {
    title: "Store API",
    action: "Return one address",
    detail:
      "The write answers with the single address it created or changed. It does not answer with the list, which is why the shared list is now out of date.",
    code: "result.data",
    state: "none shared",
    typeKeys: [
      'operations["createCustomerAddress post /account/address"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Reload the list yourself",
    detail:
      "No write method on useAddress touches swCustomerAddresses. Every create, update, delete and default switch has to be followed by loadCustomerAddresses.",
    code: "await loadCustomerAddresses()",
    state: "swCustomerAddresses",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Switch a default",
    detail:
      "The two default operations are bodyless PATCH requests carrying the address id in the path. They change isDefaultBillingAddress and isDefaultShippingAddress on the list entries.",
    code: "await setDefaultCustomerBillingAddress(addressId)",
    state: "customer defaults",
    typeKeys: [
      'operations["defaultBillingAddress patch /account/address/default-billing/{addressId}"]["response"]',
    ],
  },
];
</script>

# Customer Addresses

## Goal

Build an address book: list the customer's addresses, add one, edit one, delete one, and pick the default billing and shipping address. The important part is that not one write method on `useAddress` updates the shared list — reloading it after every change is the pattern, not an optimisation you skipped.

## Shopware Flow

`listAddress post /account/list-address` is a criteria search scoped to the customer that the `sw-context-token` resolves to. It is the only operation here that fills `customerAddresses`, and `useAddress` keeps that list in the `swCustomerAddresses` injection.

The five write operations return either the one address they touched or nothing at all. None of them returns the list, and `useAddress` makes no attempt to patch it locally. So the shape of every handler on this page is the same: write, then `loadCustomerAddresses()`.

<RecipeFlowDiagram label="Customer addresses flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page calls `loadCustomerAddresses()` once to fill the shared list.
2. `listAddress post /account/list-address` returns the addresses in `elements`.
3. A form submit calls `createCustomerAddress(address)` or `updateCustomerAddress(address)`.
4. The Store API answers with that single address, not with the list.
5. The handler calls `loadCustomerAddresses()` again, because nothing else will.
6. `setDefaultCustomerBillingAddress(id)` and `setDefaultCustomerShippingAddress(id)` are bodyless PATCH requests that need the same reload.

You do not need to refresh the session context after editing an address book entry — but you do after changing a default, because `useSessionContext().activeBillingAddress` reads the customer from the context.

## Request Flow

| Step                     | Code                                           | Store API                                             | Type                                                                                                                                  |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Load the addresses       | `loadCustomerAddresses()`                      | `POST /account/list-address`                          | <SchemaTypeTooltip type-key='operations["listAddress post /account/list-address"]["response"]' />                                     |
| Load the countries       | `fetchCountries()`                             | `POST /country`                                       | <SchemaTypeTooltip type-key='operations["readCountry post /country"]["response"]' />                                                  |
| Create an address        | `createCustomerAddress(address)`               | `POST /account/address`                               | <SchemaTypeTooltip type-key='operations["createCustomerAddress post /account/address"]["body"]' />                                    |
| Update an address        | `updateCustomerAddress(address)`               | `PATCH /account/address/{addressId}`                  | <SchemaTypeTooltip type-key='operations["updateCustomerAddress patch /account/address/{addressId}"]["body"]' />                       |
| Delete an address        | `deleteCustomerAddress(addressId)`             | `DELETE /account/address/{addressId}`                 | none — the operation answers `204 No Content`                                                                                         |
| Set the default billing  | `setDefaultCustomerBillingAddress(addressId)`  | `PATCH /account/address/default-billing/{addressId}`  | <SchemaTypeTooltip type-key='operations["defaultBillingAddress patch /account/address/default-billing/{addressId}"]["response"]' />   |
| Set the default shipping | `setDefaultCustomerShippingAddress(addressId)` | `PATCH /account/address/default-shipping/{addressId}` | <SchemaTypeTooltip type-key='operations["defaultShippingAddress patch /account/address/default-shipping/{addressId}"]["response"]' /> |

The two default rows send no body. The address id is the whole request, which is why they cannot fail on validation — only on ownership.

## Composables

- `useAddress`: the address book. Reads `customerAddresses`, loads it with `loadCustomerAddresses`, writes with `createCustomerAddress`, `updateCustomerAddress`, `deleteCustomerAddress`, `setDefaultCustomerBillingAddress` and `setDefaultCustomerShippingAddress`, and offers `errorMessageBuilder(error)` for one specific violation code.
- `useCountries`: `getCountries` and `getCountriesOptions` for the country select, and `getStatesForCountry(countryId)` for the dependent state select. It fetches on mount with a `states` association already merged in, so the states are present without a second request.
- `useSalutations`: `getSalutations` for the salutation select, since the address takes a `salutationId`.

## Types

Use generated Store API types when you need to type the address form, the list response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["listAddress post /account/list-address"]["response"]' />
  <SchemaTypeTooltip type-key='operations["createCustomerAddress post /account/address"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["CustomerAddressBody"]' />
  <SchemaTypeTooltip type-key='Schemas["CustomerAddress"]' />
  <SchemaTypeTooltip type-key='Schemas["Country"]' />
  <SchemaTypeTooltip type-key='Schemas["CountryState"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type AddressListResponse =
  operations["listAddress post /account/list-address"]["response"];
type CustomerAddressBody = Schemas["CustomerAddressBody"];
type CustomerAddress = Schemas["CustomerAddress"];
type Country = Schemas["Country"];
type CountryState = Schemas["CountryState"];
```

The two address types are not the same and the difference matters. `CustomerAddressBody` is what the operations accept and requires `countryId`, `firstName`, `lastName`, `city` and `street`. `CustomerAddress` is what comes back and additionally carries `id`, `customerId`, `isDefaultBillingAddress` and `isDefaultShippingAddress`.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const {
  customerAddresses,
  loadCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerBillingAddress,
  setDefaultCustomerShippingAddress,
} = useAddress();
const { getCountries, getStatesForCountry } = useCountries();
const { getSalutations } = useSalutations();
const { refreshSessionContext } = useSessionContext();

const emptyAddress = () => ({
  salutationId: "",
  firstName: "",
  lastName: "",
  street: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
});

const form = reactive(emptyAddress());
const editedId = ref("");
const pendingId = ref("");
const isSaving = ref(false);
const addressError = ref("");

const states = computed(() =>
  form.countryId ? getStatesForCountry(form.countryId) ?? [] : []
);

onMounted(async () => {
  try {
    await loadCustomerAddresses();
  } catch {
    addressError.value = "Your addresses could not be loaded.";
  }
});

const startEdit = (address: Schemas["CustomerAddress"]) => {
  editedId.value = address.id;
  Object.assign(form, {
    salutationId: address.salutationId ?? "",
    firstName: address.firstName,
    lastName: address.lastName,
    street: address.street,
    zipcode: address.zipcode ?? "",
    city: address.city,
    countryId: address.countryId,
    countryStateId: address.countryStateId ?? "",
  });
};

const resetForm = () => {
  editedId.value = "";
  Object.assign(form, emptyAddress());
};

const save = async () => {
  addressError.value = "";
  isSaving.value = true;

  try {
    if (editedId.value) {
      await updateCustomerAddress({
        ...form,
        id: editedId.value,
      } as Schemas["CustomerAddress"]);
    } else {
      await createCustomerAddress({ ...form } as Schemas["CustomerAddress"]);
    }

    // no write method updates the shared list
    await loadCustomerAddresses();
    resetForm();
  } catch {
    addressError.value = "The address could not be saved.";
  } finally {
    isSaving.value = false;
  }
};

const runOnAddress = async (
  addressId: string,
  action: () => Promise<unknown>,
  message: string,
  refreshContext = false
) => {
  addressError.value = "";
  pendingId.value = addressId;

  try {
    await action();
    await loadCustomerAddresses();
    if (refreshContext) await refreshSessionContext();
  } catch {
    addressError.value = message;
  } finally {
    pendingId.value = "";
  }
};

const remove = (addressId: string) =>
  runOnAddress(
    addressId,
    () => deleteCustomerAddress(addressId),
    "This address could not be deleted."
  );

const makeDefaultBilling = (addressId: string) =>
  runOnAddress(
    addressId,
    () => setDefaultCustomerBillingAddress(addressId),
    "The default billing address could not be changed.",
    true
  );

const makeDefaultShipping = (addressId: string) =>
  runOnAddress(
    addressId,
    () => setDefaultCustomerShippingAddress(addressId),
    "The default shipping address could not be changed.",
    true
  );
</script>

<template>
  <p v-if="addressError">{{ addressError }}</p>

  <p v-if="!customerAddresses.length">You have no saved addresses yet.</p>

  <ul v-else>
    <li v-for="address in customerAddresses" :key="address.id">
      <p>
        {{ address.firstName }} {{ address.lastName }}, {{ address.street }},
        {{ address.zipcode }} {{ address.city }}
      </p>

      <p v-if="address.isDefaultBillingAddress">Default billing address</p>
      <p v-if="address.isDefaultShippingAddress">Default shipping address</p>

      <button
        type="button"
        :disabled="pendingId === address.id"
        @click="startEdit(address)"
      >
        Edit
      </button>

      <button
        v-if="!address.isDefaultBillingAddress"
        type="button"
        :disabled="pendingId === address.id"
        @click="makeDefaultBilling(address.id)"
      >
        Use for billing
      </button>

      <button
        v-if="!address.isDefaultShippingAddress"
        type="button"
        :disabled="pendingId === address.id"
        @click="makeDefaultShipping(address.id)"
      >
        Use for shipping
      </button>

      <button
        v-if="
          !address.isDefaultBillingAddress && !address.isDefaultShippingAddress
        "
        type="button"
        :disabled="pendingId === address.id"
        @click="remove(address.id)"
      >
        Delete
      </button>
    </li>
  </ul>

  <form @submit.prevent="save">
    <h2>{{ editedId ? "Edit this address" : "Add an address" }}</h2>

    <label>
      Salutation
      <select v-model="form.salutationId">
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
      <input v-model="form.firstName" type="text" autocomplete="given-name" />
    </label>

    <label>
      Last name
      <input v-model="form.lastName" type="text" autocomplete="family-name" />
    </label>

    <label>
      Street
      <input v-model="form.street" type="text" autocomplete="street-address" />
    </label>

    <label>
      Postal code
      <input v-model="form.zipcode" type="text" autocomplete="postal-code" />
    </label>

    <label>
      City
      <input v-model="form.city" type="text" autocomplete="address-level2" />
    </label>

    <label>
      Country
      <select v-model="form.countryId">
        <option value="">Select a country</option>
        <option
          v-for="country in getCountries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.translated.name }}
        </option>
      </select>
    </label>

    <label v-if="states.length">
      State
      <select v-model="form.countryStateId">
        <option value="">Not specified</option>
        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.translated?.name ?? state.name }}
        </option>
      </select>
    </label>

    <button type="submit" :disabled="isSaving">
      {{ isSaving ? "Saving…" : editedId ? "Save changes" : "Add the address" }}
    </button>

    <button v-if="editedId" type="button" @click="resetForm()">Cancel</button>
  </form>
</template>
```

## State And Session

The list lives in the `swCustomerAddresses` injection, so an address selector in the checkout and the address book on the account page read the same array. It starts as an empty array rather than `undefined`, which means "no addresses" and "not loaded yet" look identical — track the loading state yourself if that distinction matters.

Ownership is entirely session-based. Every operation resolves the customer from the `sw-context-token`; there is no customer id in any path or body. A guest or a logged-out visitor gets a `403`, and `loadCustomerAddresses` handles that one status specially: it clears the shared list and then rethrows, so the UI empties _and_ the error surfaces.

Changing a default also changes the sales channel context, because `useSessionContext().activeBillingAddress` reads `customer.activeBillingAddress`. That is the one case on this page where reloading the address list is not enough.

## Edge Cases

- No write method updates `customerAddresses`. Create, update, delete and both default switches all need `loadCustomerAddresses()` afterwards.
- The declared type of `loadCustomerAddresses()` takes no arguments, while the implementation accepts a `Criteria`. Passing one is a type error even though the request would carry it.
- `createCustomerAddress` and `updateCustomerAddress` are typed with `Schemas["CustomerAddress"]`, which requires `id` and `customerId`, but the operations accept `CustomerAddressBody`, which has neither. Creating an address therefore means satisfying a type stricter than the request — a cast, not a real requirement.
- `updateCustomerAddress` reads the address id from the object and puts it in the path. An object without `id` produces a request against `/account/address/undefined`.
- `countryId`, `firstName`, `lastName`, `city` and `street` are required. `zipcode` is not, because not every country has one.
- `countryStateId` is only valid for countries that have states. `getStatesForCountry` returns `null` — not an empty array — for those that do not.
- Deleting the default billing or shipping address is rejected by the server. Hide the button for those entries rather than explaining the failure afterwards.
- `errorMessageBuilder` handles only `VIOLATION::IS_BLANK_ERROR` and returns `null` for everything else. Treat `null` as "not a message I can build", not as "no error".
- A `403` from `loadCustomerAddresses` both empties the list and throws. Catching the error without rendering an empty state gives the customer a blank page.

## Common Mistakes

- Do not assume a successful write refreshed the list.
- Do not patch `customerAddresses` locally after a write. It is a `ComputedRef` over the shared value.
- Do not skip the context refresh after changing a default. The checkout reads the active addresses from the context.
- Do not treat an empty `customerAddresses` as proof that the customer has no addresses.
- Do not send a `countryStateId` for a country without states.
- Do not offer to delete an address that is a current default.
- Do not render `errorMessageBuilder(error)` without a fallback for its `null` result.
- Do not build the update path yourself. `updateCustomerAddress` derives it from the address id.

## Testing Checklist

- Opening the page calls `listAddress post /account/list-address` once and fills `customerAddresses`.
- Creating an address calls `createCustomerAddress post /account/address` and then reloads the list.
- The new entry appears only after the reload resolves.
- Updating an address sends the id in the path and reloads the list.
- Deleting an address calls the delete operation and removes the entry from the rendered list.
- Setting a default calls the matching bodyless PATCH, reloads the list, and refreshes the session context.
- The `isDefaultBillingAddress` and `isDefaultShippingAddress` flags drive which buttons render.
- Submitting the form without a country is rejected and shown on that field.
- Selecting a country without states hides the state select.
- A logged-out visitor sees an empty state and an error rather than a stale list.

## Related Links

- [Login recipe](login.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
