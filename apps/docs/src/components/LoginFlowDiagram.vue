<script setup lang="ts">
import RecipeFlowDiagram from "./RecipeFlowDiagram.vue";

const steps = [
  {
    title: "UI",
    action: "Submit credentials",
    detail:
      "The login form collects username and password, then calls the composable. The component owns loading and form error state only.",
    code: "submit() -> login(credentials)",
    state: "local form state",
    typeKeys: ['operations["loginCustomer post /account/login"]["body"]'],
  },
  {
    title: "Composable",
    action: "Run login workflow",
    detail:
      "useUser owns the Shopware-specific workflow. It sends credentials first, then refreshes context and cart data.",
    code: "useUser().login(credentials)",
    state: "customer workflow",
    typeKeys: [
      'operations["loginCustomer post /account/login"]["body"]',
      'operations["loginCustomer post /account/login"]["response"]',
    ],
  },
  {
    title: "Store API",
    action: "Authenticate customer",
    detail:
      "The API client invokes the generated operation for POST /account/login. This step validates credentials.",
    code: 'apiClient.invoke("loginCustomer post /account/login")',
    state: "sw-context-token",
    typeKeys: [
      'operations["loginCustomer post /account/login"]["body"]',
      'operations["loginCustomer post /account/login"]["response"]',
      'components["schemas"]["failure"]',
    ],
  },
  {
    title: "Context",
    action: "Refresh session",
    detail:
      "The session context is fetched again so customer, customer group, currency, rules, and other context-dependent values are current.",
    code: 'apiClient.invoke("readContext get /context")',
    state: "user, isLoggedIn, sales channel context",
    typeKeys: [
      'operations["readContext get /context"]["response"]',
      'Schemas["Customer"]',
    ],
  },
  {
    title: "Cart",
    action: "Reload cart",
    detail:
      "The cart is refreshed because prices, promotions, and line items can depend on the authenticated customer context.",
    code: "refreshCart()",
    state: "cart, prices, promotions",
    typeKeys: ['Schemas["Cart"]'],
  },
  {
    title: "UI",
    action: "Render new state",
    detail:
      "The UI reads user, isLoggedIn, and cart data from composables instead of keeping its own copy.",
    code: "user + isLoggedIn + cart",
    state: "reactive UI",
    typeKeys: ['Schemas["Customer"]', 'Schemas["Cart"]'],
  },
];
</script>

<template>
  <RecipeFlowDiagram label="Login flow diagram" :steps="steps" />
</template>
