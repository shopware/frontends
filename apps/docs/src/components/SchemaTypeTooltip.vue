<script setup lang="ts">
import { computed, ref } from "vue";
import { data as schemaData } from "../../.vitepress/data/login-flow-schema.data";

const props = defineProps<{
  typeKey: string;
  label?: string;
}>();

const triggerElement = ref<HTMLElement>();
const isVisible = ref(false);
const tooltipStyle = ref<Record<string, string>>({});
const summary = computed(() => schemaData.summaries[props.typeKey]);
const displayLabel = computed(
  () => props.label ?? summary.value?.label ?? props.typeKey,
);

function showTooltip() {
  const trigger = triggerElement.value;
  if (!trigger) {
    return;
  }

  const rect = trigger.getBoundingClientRect();
  const tooltipWidth = Math.min(340, window.innerWidth - 32);
  const left = Math.min(
    Math.max(rect.left + rect.width / 2, tooltipWidth / 2 + 16),
    window.innerWidth - tooltipWidth / 2 - 16,
  );
  const shouldOpenAbove =
    rect.bottom + 260 > window.innerHeight && rect.top > 260;

  tooltipStyle.value = {
    left: `${left}px`,
    top: `${shouldOpenAbove ? rect.top - 10 : rect.bottom + 10}px`,
    width: `${tooltipWidth}px`,
    transform: shouldOpenAbove ? "translate(-50%, -100%)" : "translateX(-50%)",
  };
  isVisible.value = true;
}

function hideTooltip() {
  isVisible.value = false;
}
</script>

<template>
  <span
    ref="triggerElement"
    class="schema-type"
    tabindex="0"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
    @keydown.escape="hideTooltip"
  >
    {{ displayLabel }}
    <Teleport to="body">
      <span
        v-if="isVisible"
        class="schema-type__tooltip"
        role="tooltip"
        :style="tooltipStyle"
      >
      <strong>{{ summary?.label ?? typeKey }}</strong>
      <small>{{ summary?.source }}</small>
      <span v-if="summary?.description" class="schema-type__description">
        {{ summary.description }}
      </span>
      <span class="schema-type__fields">
        <span
          v-for="field in summary?.fields ?? []"
          :key="field.name"
          class="schema-type__field"
        >
          <code>{{ field.name }}{{ field.required ? "" : "?" }}</code>
          <span>{{ field.type }}</span>
        </span>
        <span v-if="summary?.hiddenFields" class="schema-type__more">
          +{{ summary.hiddenFields }} more fields
        </span>
      </span>
      </span>
    </Teleport>
  </span>
</template>

<style scoped>
.schema-type {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  padding: 3px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  vertical-align: middle;
  cursor: help;
}

.schema-type:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.schema-type__tooltip {
  position: fixed;
  z-index: 100;
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  text-align: left;
}

.schema-type__tooltip strong {
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.schema-type__tooltip small {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.schema-type__description {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

.schema-type__fields {
  display: grid;
  gap: 5px;
}

.schema-type__field {
  display: grid;
  grid-template-columns: minmax(90px, 0.8fr) minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  font-size: 12px;
  font-weight: 400;
}

.schema-type__field code {
  color: var(--vp-c-text-1);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.schema-type__field span,
.schema-type__more {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
</style>
