<script setup lang="ts">
import { useData, withBase } from "vitepress";
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{
    operation?: string;
    required?: boolean;
    injected: boolean;
    guidePath?: string;
  }>(),
  {
    required: true,
    guidePath: "../../guides/storefront-url.html",
  },
);

const titleId = useId();
const { page } = useData();

const guideLink = computed(() => {
  const currentPath = page.value.relativePath;
  const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/"));
  const segments = `${currentDir}/${props.guidePath}`
    .split("/")
    .filter(Boolean);
  const resolved: string[] = [];

  for (const segment of segments) {
    if (segment === "..") {
      resolved.pop();
    } else if (segment !== ".") {
      resolved.push(segment);
    }
  }

  return withBase(`/${resolved.join("/")}`);
});

const requirementPhrase = computed(() =>
  props.required
    ? "requires a storefrontUrl"
    : "accepts an optional storefrontUrl",
);
</script>

<template>
  <aside class="storefront-url-notice" :aria-labelledby="titleId">
    <p :id="titleId" class="storefront-url-notice__title">
      This flow sends <code>storefrontUrl</code>
    </p>

    <p>
      <template v-if="props.operation">
        <code>{{ props.operation }}</code>
      </template>
      <template v-else> Every operation in this flow </template>
      {{ requirementPhrase }}. Shopware validates it against the configured
      sales channel domains, uses it to pick the language of the transactional
      mail, and prefixes the links inside that mail with it.
    </p>

    <p v-if="props.injected">
      The composable used here fills the field in for you and omits it from its
      parameter type, so you do not pass it yourself.
    </p>
    <p v-else>
      The composable used here forwards the payload untouched, so add
      <code>storefrontUrl: getStorefrontUrl()</code> from
      <code>useInternationalization</code> in the submit handler.
    </p>

    <p>
      <a :href="guideLink">Read the Storefront URL guide</a>
    </p>
  </aside>
</template>

<style scoped>
.storefront-url-notice {
  display: grid;
  gap: 8px;
  margin: 16px 0;
  padding: 16px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: var(--vp-custom-block-font-size, 14px);
  line-height: 1.6;
}

.storefront-url-notice__title {
  font-weight: 600;
}

.storefront-url-notice p {
  margin: 0;
}

.storefront-url-notice code {
  overflow-wrap: anywhere;
}
</style>
