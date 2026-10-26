---
nav:
  title: Catalog
  position: 15
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# Catalog

Recipes for the product catalog: listings and filters, search, variants, prices, reviews, and cross-selling.

<RecipeCardGrid>
  <RecipeCard page="listing.html" title="Product Listing and Filters" summary="Render a listing with filters, sorting, pagination and infinite scroll from one response." :composables="['useListing', 'useCategory']" />
  <RecipeCard page="prices.html" title="Prices and Tax State" summary="Show the right price, tier and strikethrough in the current currency without doing price math." :composables="['usePrice', 'useProductPrice']" />
  <RecipeCard page="search.html" title="Search and Suggest" summary="Build a suggestion dropdown and a full results page, and pick the right search route for each." :composables="['useProductSearchSuggest', 'useListing']" />
  <RecipeCard page="reviews.html" title="Product Reviews" summary="Render a product's reviews and rating, and let a customer submit one." :composables="['useProductReviews', 'useUser']" />
  <RecipeCard page="variants.html" title="Product Variants" summary="Render option groups, track the selection and resolve the matching variant." :composables="['useProductConfigurator', 'useProduct']" />
  <RecipeCard page="cross-selling.html" title="Cross-Selling" summary="Render a product's cross-selling groups such as accessories and related products." :composables="['useProductAssociations', 'useProduct']" />
</RecipeCardGrid>
