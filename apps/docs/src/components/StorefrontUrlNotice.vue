<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";

const props = withDefaults(
  defineProps<{
    operation?: string;
    required?: boolean;
    injected?: boolean;
  }>(),
  {
    operation: undefined,
    required: true,
    injected: true,
  }
);

const guideLink = withBase("/guides/storefront-url.html");

const requirement = computed(() =>
  props.required
    ? "requires a storefrontUrl"
    : "accepts an optional storefrontUrl"
);
</script>

<template>
  <aside class="storefront-url-notice">
    <p class="storefront-url-notice__title">
      This flow sends <code>storefrontUrl</code>
    </p>

    <p>
      <template v-if="props.operation">
        <code>{{ props.operation }}</code>
      </template>
      <template v-else> Every operation in this flow </template>
      {{ requirement }}. Shopware validates it against the configured sales
      channel domains, uses it to pick the language of the transactional mail,
      and prefixes the links inside that mail with it.
    </p>

    <p v-if="props.injected">
      The composable used here fills the field in for you and omits it from its
      parameter type, so you do not pass it yourself.
    </p>
    <p v-else>
      The composable used here forwards the payload untouched, so add
      <code>storefrontUrl: getStorefrontUrl()</code> from
      <code>useInternationalization</code> in the submit handler. Resolving it
      during setup throws <code>window is not defined</code> on the server
      unless <code>devStorefrontUrl</code> is configured.
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
  margin: 18px 0;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.storefront-url-notice__title {
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
}

.storefront-url-notice p {
  margin: 0;
}

.storefront-url-notice code {
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
