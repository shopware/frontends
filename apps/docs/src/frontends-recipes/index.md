---
nav:
  title: Frontends Recipes
  position: 115
---

<script setup>
import RecipeCard from "../components/RecipeCard.vue";
import RecipeCardGrid from "../components/RecipeCardGrid.vue";
</script>

# Frontends Recipes

Each recipe follows one Shopware Frontends feature end-to-end, from the UI action through the composables and Store API calls to the session state the UI reads afterwards. They are written for frontend developers who want the Shopware flow behind a feature, not a generic Vue tutorial.

New here? Start with **Login** or **Cart**. Most other recipes build on the session and cart state they explain.

## Account

<RecipeCardGrid>
  <RecipeCard page="account/login.html" title="Login" badge="Start here" summary="Log a customer in, then refresh the session context and the cart so the UI matches the new customer." :composables="['useUser', 'useSessionContext', 'useCart']" />
  <RecipeCard page="account/register.html" title="Register" summary="Create a customer and its billing address in one request, with salutation and country lookups and double opt-in." :composables="['useUser', 'useSalutations', 'useCountries']" />
  <RecipeCard page="account/password.html" title="Password Recovery and Change" summary="Recover a forgotten password in three steps, and let a logged-in customer change theirs." :composables="['useCustomerPassword', 'useUser']" />
  <RecipeCard page="account/wishlist.html" title="Wishlist" summary="Add and remove wishlist products, and page through one wishlist shared by every component." :composables="['useWishlist', 'useProductWishlist']" />
  <RecipeCard page="account/order-history.html" title="Order History" summary="List a customer's orders page by page and open one order with the associations it needs." :composables="['useCustomerOrders', 'useOrderDetails']" />
  <RecipeCard page="account/newsletter.html" title="Newsletter" summary="Subscribe and unsubscribe through the double opt-in lifecycle, for guests and customers." :composables="['useNewsletter', 'useUser']" />
  <RecipeCard page="account/addresses.html" title="Customer Addresses" summary="List, add, edit and delete addresses, and switch the default billing and shipping address." :composables="['useAddress', 'useCountries', 'useSessionContext']" />
  <RecipeCard page="account/profile.html" title="Customer Profile" summary="Show the logged-in customer and change their name, salutation, birthday and email address." :composables="['useUser', 'useSessionContext']" />
</RecipeCardGrid>

## Catalog

<RecipeCardGrid>
  <RecipeCard page="catalog/listing.html" title="Product Listing and Filters" summary="Render a listing with filters, sorting, pagination and infinite scroll from one response." :composables="['useListing', 'useCategory']" />
  <RecipeCard page="catalog/prices.html" title="Prices and Tax State" summary="Show the right price, tier and strikethrough in the current currency without doing price math." :composables="['usePrice', 'useProductPrice']" />
  <RecipeCard page="catalog/search.html" title="Search and Suggest" summary="Build a suggestion dropdown and a full results page, and pick the right search route for each." :composables="['useProductSearchSuggest', 'useListing']" />
  <RecipeCard page="catalog/reviews.html" title="Product Reviews" summary="Render a product's reviews and rating, and let a customer submit one." :composables="['useProductReviews', 'useUser']" />
  <RecipeCard page="catalog/variants.html" title="Product Variants" summary="Render option groups, track the selection and resolve the matching variant." :composables="['useProductConfigurator', 'useProduct']" />
  <RecipeCard page="catalog/cross-selling.html" title="Cross-Selling" summary="Render a product's cross-selling groups such as accessories and related products." :composables="['useProductAssociations', 'useProduct']" />
</RecipeCardGrid>

## Checkout

<RecipeCardGrid>
  <RecipeCard page="checkout/cart.html" title="Cart" badge="Start here" summary="Add, change and remove line items, and keep one shared cart in sync with every response." :composables="['useCart', 'useCartItem', 'useAddToCart']" />
  <RecipeCard page="checkout/cart-errors.html" title="Cart Errors" summary="Turn the errors a successful cart response carries into messages a customer can act on." :composables="['useCartNotification', 'useCart']" />
  <RecipeCard page="checkout/checkout.html" title="Checkout and Order Placement" summary="Select shipping and payment methods as context changes, then turn the cart into an order." :composables="['useCheckout', 'useSessionContext']" />
  <RecipeCard page="checkout/payment.html" title="Payment" summary="Hand a placed order to the payment provider and read the real payment state on the return page." :composables="['useOrderPayment', 'useOrderDetails']" />
</RecipeCardGrid>

## CMS

<RecipeCardGrid>
  <RecipeCard page="cms/rendering.html" title="Rendering CMS Pages" summary="Walk a page's sections, blocks and slots and resolve each one to a component." :composables="['useCmsSection', 'useCmsBlock']" />
  <RecipeCard page="cms/contact-form.html" title="Contact Form" summary="Build a contact form element that submits to the Store API and passes a real shop's validation." :composables="['useCmsElementConfig', 'useSalutations']" />
</RecipeCardGrid>

## Context

<RecipeCardGrid>
  <RecipeCard page="context/session-context.html" title="Session Context" summary="Seed the sales channel context once at the root and patch it through setters that read it back for you." :composables="['useSessionContext', 'useContext']" />
  <RecipeCard page="context/language-and-currency.html" title="Language and Currency Switch" summary="Switch language and currency with the same context patch, and see why only the language switch ends in a redirect." :composables="['useInternationalization', 'useSessionContext']" />
  <RecipeCard page="context/navigation.html" title="Navigation and Breadcrumbs" summary="Load main and footer navigation, resolve the current entity and render breadcrumbs." :composables="['useNavigation', 'useBreadcrumbs']" />
  <RecipeCard page="context/url-resolving.html" title="URL Resolving and SEO URLs" summary="Serve every shop URL from one catch-all route and redirect technical URLs to SEO URLs." :composables="['useNavigationSearch', 'useNavigationContext']" />
</RecipeCardGrid>

## Orders

<RecipeCardGrid>
  <RecipeCard page="orders/guest-order-lookup.html" title="Guest Order Lookup via Deep Link" summary="Open a guest order from the confirmation mail link, asking for the email and postal code only when the first lookup rejects the guest as not authenticated." :composables="['useOrderDetails', 'useUser']" />
  <RecipeCard page="orders/details.html" title="Order Details" summary="Render one order with its state, items, documents and downloads, and let the customer cancel it." :composables="['useOrderDetails', 'useDefaultOrderAssociations']" />
</RecipeCardGrid>
