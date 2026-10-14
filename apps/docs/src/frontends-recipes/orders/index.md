---
nav:
  title: Orders
  position: 40
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# Orders

Recipes for reading one placed order — access without a customer session, and everything a detail page renders from it.

<RecipeCardGrid>
  <RecipeCard page="guest-order-lookup.html" title="Guest Order Lookup via Deep Link" summary="Open a guest order from the confirmation mail link, asking for the email and postal code only when the first lookup rejects the guest as not authenticated." :composables="['useOrderDetails', 'useUser']" />
  <RecipeCard page="details.html" title="Order Details" summary="Render one order with its state, items, documents and downloads, and let the customer cancel it." :composables="['useOrderDetails', 'useDefaultOrderAssociations']" />
</RecipeCardGrid>

The paginated list a signed-in customer opens these pages from lives in the Account area:

<RecipeCardGrid>
  <RecipeCard page="../account/order-history.html" title="Order History" summary="List a customer's orders page by page and open one order with the associations it needs." :composables="['useCustomerOrders', 'useOrderDetails']" />
</RecipeCardGrid>
