---
nav:
  title: CMS
  position: 25
---

<script setup>
import RecipeCard from "../../components/RecipeCard.vue";
import RecipeCardGrid from "../../components/RecipeCardGrid.vue";
</script>

# CMS

Recipes for Shopping Experiences: rendering a CMS page's tree of sections, blocks and slots, and the elements that tree is built from.

<RecipeCardGrid>
  <RecipeCard page="rendering.html" title="Rendering CMS Pages" summary="Walk a page's sections, blocks and slots and resolve each one to a component." :composables="['useCmsSection', 'useCmsBlock']" />
  <RecipeCard page="contact-form.html" title="Contact Form" summary="Build a contact form element that submits to the Store API and passes a real shop's validation." :composables="['useCmsElementConfig', 'useSalutations']" />
</RecipeCardGrid>
