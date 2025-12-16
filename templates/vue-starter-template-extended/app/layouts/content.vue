<script setup lang="ts">
/**
 * Minimal layout for new Content API
 * Allows content to control the entire page including header and footer
 *
 * Use with: definePageMeta({ layout: 'content' })
 */

defineOptions({
  name: "ContentLayout",
});
</script>

<template>
  <div class="content-layout">
    <!-- No hardcoded header/footer - content has full control -->
    <slot />
  </div>
</template>
