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
  <RecipeCard page="session-context.html" title="Session Context" summary="Seed the sales channel context once at the root and patch it through setters that read it back for you." :composables="['useSessionContext', 'useContext']" />
  <RecipeCard page="language-and-currency.html" title="Language and Currency Switch" summary="Switch language and currency with the same context patch, and see why only the language switch ends in a redirect." :composables="['useInternationalization', 'useSessionContext']" />
  <RecipeCard page="navigation.html" title="Navigation and Breadcrumbs" summary="Load main and footer navigation, resolve the current entity and render breadcrumbs." :composables="['useNavigation', 'useBreadcrumbs']" />
  <RecipeCard page="url-resolving.html" title="URL Resolving and SEO URLs" summary="Serve every shop URL from one catch-all route and redirect technical URLs to SEO URLs." :composables="['useNavigationSearch', 'useNavigationContext']" />
</RecipeCardGrid>
