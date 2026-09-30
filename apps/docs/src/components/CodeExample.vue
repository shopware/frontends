<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    peek?: number;
    expanded?: boolean;
  }>(),
  {
    title: "Example",
    peek: 260,
    expanded: false,
  },
);

const bodyId = useId();

const root = ref<HTMLElement>();
const body = ref<HTMLElement>();
const isExpanded = ref(props.expanded);
const needsToggle = ref(true);

const isClipped = computed(() => needsToggle.value && !isExpanded.value);

onMounted(() => {
  const el = body.value;
  if (el && el.scrollHeight <= props.peek + 8) needsToggle.value = false;
});

function toggle() {
  isExpanded.value = !isExpanded.value;
  if (!isExpanded.value) root.value?.scrollIntoView({ block: "nearest" });
}
</script>

<template>
  <div ref="root" class="code-example">
    <div class="code-example__bar">
      <span class="code-example__title">{{ title }}</span>
    </div>

    <div
      :id="bodyId"
      ref="body"
      class="code-example__body"
      :class="{ 'is-clipped': isClipped }"
      :style="isClipped ? { maxHeight: peek + 'px' } : null"
    >
      <slot />
      <span v-if="isClipped" class="code-example__fade" aria-hidden="true" />
    </div>

    <button
      v-if="needsToggle"
      type="button"
      class="code-example__more"
      :aria-expanded="isExpanded"
      :aria-controls="bodyId"
      @click="toggle"
    >
      {{ isExpanded ? "Show less" : "Show more" }}
    </button>
  </div>
</template>

<style scoped>
.code-example {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.code-example__bar {
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-example__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.code-example__body {
  position: relative;
}

.code-example__body.is-clipped {
  overflow: hidden;
}

.code-example__fade {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 64px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--vp-code-block-bg));
}

.code-example__more {
  display: block;
  width: 100%;
  padding: 9px 12px;
  border-top: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
}

.code-example__more:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.code-example__more:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.code-example__body :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
}
</style>
