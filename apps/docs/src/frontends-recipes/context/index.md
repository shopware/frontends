---
nav:
  title: Context
  position: 30
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# Context

Recipes for the sales channel context and everything derived from it: the context itself, language, currency, navigation, and URL resolving.

<RecipeCardGrid>
  <RecipeCard page="session-context.html" title="Session Context" summary="Read and patch the sales channel context, and read it back after every change." :composables="['useSessionContext', 'useContext']" />
  <RecipeCard page="language-and-currency.html" title="Language and Currency Switch" summary="Switch language with a redirect and currency with a context patch." :composables="['useInternationalization', 'useSessionContext']" />
  <RecipeCard page="navigation.html" title="Navigation and Breadcrumbs" summary="Load main and footer navigation, resolve the current entity and render breadcrumbs." :composables="['useNavigation', 'useBreadcrumbs']" />
  <RecipeCard page="url-resolving.html" title="URL Resolving and SEO URLs" summary="Serve every shop URL from one catch-all route and redirect technical URLs to SEO URLs." :composables="['useNavigationSearch', 'useNavigationContext']" />
</RecipeCardGrid>
