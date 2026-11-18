---
nav:
  title: Checkout
  position: 20
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# Checkout

Recipes for the cart and checkout flows, from the first line item to a placed order and its payment.

<RecipeCardGrid>
  <RecipeCard page="cart.html" title="Cart" badge="Start here" summary="Add, change and remove line items, and keep one shared cart in sync with every response." :composables="['useCart', 'useCartItem', 'useAddToCart']" />
  <RecipeCard page="cart-errors.html" title="Cart Errors" summary="Turn the errors a successful cart response carries into messages a customer can act on." :composables="['useCartNotification', 'useCart']" />
  <RecipeCard page="checkout.html" title="Checkout and Order Placement" summary="Select shipping and payment methods as context changes, then turn the cart into an order." :composables="['useCheckout', 'useSessionContext']" />
  <RecipeCard page="payment.html" title="Payment" summary="Hand a placed order to the payment provider and read the real payment state on the return page." :composables="['useOrderPayment', 'useOrderDetails']" />
</RecipeCardGrid>
