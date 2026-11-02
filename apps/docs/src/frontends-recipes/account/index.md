---
nav:
  title: Account
  position: 10
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# Account

Recipes for customer session and account flows.

<RecipeCardGrid>
  <RecipeCard page="login.html" title="Login" badge="Start here" summary="Log a customer in, then refresh the session context and the cart so the UI matches the new customer." :composables="['useUser', 'useSessionContext', 'useCart']" />
  <RecipeCard page="register.html" title="Register" summary="Create a customer and its billing address in one request, with salutation and country lookups and double opt-in." :composables="['useUser', 'useSalutations', 'useCountries']" />
  <RecipeCard page="password.html" title="Password Recovery and Change" summary="Recover a forgotten password in three steps, and let a logged-in customer change theirs." :composables="['useCustomerPassword', 'useUser']" />
  <RecipeCard page="wishlist.html" title="Wishlist" summary="Add and remove wishlist products, and page through one wishlist shared by every component." :composables="['useWishlist', 'useProductWishlist']" />
  <RecipeCard page="order-history.html" title="Order History" summary="List a customer's orders page by page and open one order with the associations it needs." :composables="['useCustomerOrders', 'useOrderDetails']" />
  <RecipeCard page="newsletter.html" title="Newsletter" summary="Subscribe and unsubscribe through the double opt-in lifecycle, for guests and customers." :composables="['useNewsletter', 'useUser']" />
  <RecipeCard page="addresses.html" title="Customer Addresses" summary="List, add, edit and delete addresses, and switch the default billing and shipping address." :composables="['useAddress', 'useCountries', 'useSessionContext']" />
  <RecipeCard page="profile.html" title="Customer Profile" summary="Show the logged-in customer and change their name, salutation, birthday and email address." :composables="['useUser', 'useSessionContext']" />
</RecipeCardGrid>
