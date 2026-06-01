---
nav:
  position: 10
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useUser
    - useSessionContext
    - useCart
  helpers: []
  operations:
    - loginCustomer post /account/login
    - readContext get /context
    - logoutCustomer post /account/logout
  schemas:
    - Customer
    - SalesChannelContext
---

<script setup>
import LoginFlowDiagram from "../../components/LoginFlowDiagram.vue";
</script>

# Login

## Goal

Build a customer login flow and understand what happens after credentials are submitted. The important part is not the form itself, but how Shopware Frontends updates the customer session, context, and cart after the Store API accepts the login.

## Shopware Flow

Login is a small form action, but it changes the whole sales channel session. The important part is that `POST /account/login` only authenticates the customer. The UI becomes reliable after the session context and cart are refreshed.

<LoginFlowDiagram />

Read the diagram from left to right:

1. Customer submits the login form.
2. `useUser().login()` sends credentials to `POST /account/login`.
3. The API client keeps using the current `sw-context-token` and reacts to context-token changes from the API response.
4. `useUser` refreshes the sales channel context with `GET /context`.
5. `useUser` refreshes the cart so it matches the customer session.
6. The UI reads `user`, `isLoggedIn`, and cart state from composables instead of keeping its own copy.

You usually do not need to call `readContext get /context` manually after login, because `useUser` calls `refreshSessionContext()` internally.

## Request Flow

| Step | Code | Store API | Type |
|---|---|---|---|
| Submit credentials | `login(credentials)` | `POST /account/login` | `operations["loginCustomer post /account/login"]["body"]` |
| Refresh session context | `refreshSessionContext()` | `GET /context` | `operations["readContext get /context"]["response"]` |
| Logout customer | `logout()` | `POST /account/logout` | `operations["logoutCustomer post /account/logout"]["response"]` |

## Composables

- `useUser`: exposes `login`, `logout`, `user`, `isLoggedIn`, and related customer state.
- `useSessionContext`: refreshes the sales channel context after the customer session changes.
- `useCart`: refreshes the cart after login or logout so line items and prices match the current customer context.

## Types

Use generated Store API types when you need to type credentials, responses, or lower-level API client calls:

```ts
import type { Schemas, operations } from "#shopware";

type LoginBody = operations["loginCustomer post /account/login"]["body"];
type LoginResponse =
  operations["loginCustomer post /account/login"]["response"];
type SessionContext = operations["readContext get /context"]["response"];
type Customer = Schemas["Customer"];
```

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { operations } from "#shopware";

const { login, logout, isLoggedIn, user } = useUser();

const credentials = reactive<
  operations["loginCustomer post /account/login"]["body"]
>({
  username: "",
  password: "",
});

const isSubmitting = ref(false);
const loginError = ref("");

const submit = async () => {
  loginError.value = "";
  isSubmitting.value = true;

  try {
    await login(credentials);
  } catch {
    loginError.value = "The email or password is invalid.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form v-if="!isLoggedIn" @submit.prevent="submit">
    <label>
      Email
      <input v-model="credentials.username" type="email" autocomplete="email" />
    </label>

    <label>
      Password
      <input
        v-model="credentials.password"
        type="password"
        autocomplete="current-password"
      />
    </label>

    <p v-if="loginError">{{ loginError }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Signing in..." : "Sign in" }}
    </button>
  </form>

  <div v-else>
    <p>Signed in as {{ user?.firstName || user?.email }}</p>
    <button type="button" @click="logout()">Sign out</button>
  </div>
</template>
```

## State And Session

The Store API identifies the current sales channel session with the `sw-context-token` header. A successful login can affect the current customer context and the cart associated with that context.

After `POST /account/login`, `useUser().login()` calls `refreshSessionContext()`. That request uses `GET /context` and updates the reactive session context. The `user` and `isLoggedIn` values then reflect the customer from the refreshed context.

`useUser().login()` also calls `refreshCart()`. This matters because cart prices, promotions, customer-specific rules, and line items can depend on the logged-in customer context.

## Edge Cases

- Invalid credentials cause the API client call to throw. Map this error to the login form instead of assuming the composable stores form errors.
- If the session context is missing or stale, login can fail before customer state is refreshed.
- Customer-specific prices, promotions, or rules may change after login because the cart is refreshed in the new context.
- A successful API response does not mean old local UI state is still valid. Read `user`, `isLoggedIn`, and cart data from the composables after the login promise resolves.

## Common Mistakes

- Do not keep a separate local `isLoggedIn` flag. Use `useUser().isLoggedIn`.
- Do not skip the cart refresh after login when implementing a custom flow with `apiClient.invoke` directly.
- Do not assume the old cart totals are still correct after the customer session changes.
- Do not expose raw API error details directly in the UI.

## Testing Checklist

- Successful login calls `loginCustomer post /account/login`.
- Successful login refreshes the session context and updates `isLoggedIn`.
- Successful login refreshes the cart.
- Invalid credentials show a form-level error and keep the user logged out.
- Logout calls `logoutCustomer post /account/logout`, refreshes context, and refreshes cart.

## Related Links

- [Login form page element](../../getting-started/page-elements/login-form.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Cart documentation](../../getting-started/e-commerce/cart.html)
