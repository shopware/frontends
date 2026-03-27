<script setup lang="ts">
import { pascalCase } from "scule";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsSection"] | Schemas["CmsBlock"] | Schemas["CmsSlot"];
}>();

const elementType = computed(() =>
  props.content.apiAlias === "cms_block"
    ? "Block"
    : props.content.apiAlias === "cms_section"
      ? "Section"
      : "Element",
);

const componentName = computed(() => props.content.type);

const expectedComponentName = computed(() =>
  pascalCase(`Cms-${elementType.value}-${componentName.value ?? ""}`),
);

const docsUrl = computed(() => {
  const params = new URLSearchParams({
    component: expectedComponentName.value,
    type: elementType.value.toLowerCase(),
  });
  return `https://frontends.shopware.com/getting-started/cms/missing-component?${params}`;
});

const aiPrompt = computed(() => {
  const schemaType =
    props.content.apiAlias === "cms_block"
      ? 'Schemas["CmsBlock"]'
      : props.content.apiAlias === "cms_section"
        ? 'Schemas["CmsSection"]'
        : 'Schemas["CmsSlot"]';

  const contentJson = JSON.stringify(props.content, null, 2);
  const type = elementType.value.toLowerCase();
  const name = componentName.value;
  const compName = expectedComponentName.value;

  return [
    `Create a Vue 3 component \`${compName}.vue\` for a Shopware Frontends headless storefront.`,
    "",
    `This component renders the CMS ${type} type: "${name}" (apiAlias: "${props.content.apiAlias}").`,
    "",
    "Requirements:",
    `- Accept a \`content: ${schemaType}\` prop`,
    `- Render the data for CMS ${type} type "${name}"`,
    `- Follow patterns from existing Cms${elementType.value} components in packages/cms-base-layer/app/components/public/cms/${type}/`,
    "- Use composables from @shopware/composables where applicable",
    "",
    `The full content prop for this ${type} is:`,
    contentJson,
    "",
    `Reference: ${docsUrl.value}`,
  ].join("\n");
});

const copied = refAutoReset(false, 2000);

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(aiPrompt.value);
    copied.value = true;
  } catch {
    // Fallback: clipboard API unavailable (non-secure origin, unfocused document)
    console.warn("[CMS] Could not copy to clipboard. Prompt logged below:");
    console.info(aiPrompt.value);
  }
}
</script>

<template>
  <div
    class="sw-cms-no-component box-border min-h-[40px] rounded border-2 border-dashed border-brand-primary bg-brand-secondary font-mono text-[11px] text-brand-on-secondary"
  >
    <div class="flex flex-wrap items-center gap-1.5 px-2 py-1.5">
      <span class="text-brand-primary">⚠ missing implementation:</span>
      <span class="font-semibold">{{ expectedComponentName }}</span>

      <a
        :href="docsUrl"
        target="_blank"
        rel="noopener noreferrer"
        title="View CMS documentation"
        class="whitespace-nowrap rounded border border-outline-outline-primary bg-surface-surface px-[5px] py-px text-[10px] leading-none text-brand-primary no-underline hover:bg-brand-secondary-hover"
      >
        docs ↗
      </a>

      <button
        type="button"
        title="Copy AI prompt to clipboard"
        class="cursor-pointer whitespace-nowrap rounded border border-outline-outline-primary bg-surface-surface px-[5px] py-px font-mono text-[10px] leading-none text-brand-primary hover:bg-brand-secondary-hover"
        @click.stop="copyPrompt"
      >
        {{ copied ? "copied ✓" : "copy AI prompt" }}
      </button>
    </div>
  </div>
</template>
