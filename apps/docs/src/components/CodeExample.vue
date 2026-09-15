<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Example" },
  peek: { type: Number, default: 260 },
  expanded: { type: Boolean, default: false },
});

const bodyId = computed(
  () =>
    "code-example-" +
    props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
);

const root = ref(null);
const body = ref(null);
const isExpanded = ref(props.expanded);
const needsToggle = ref(true);
const copyState = ref("idle");
let resetTimer;

const isClipped = computed(() => needsToggle.value && !isExpanded.value);

const copyLabel = computed(() =>
  copyState.value === "copied"
    ? "Copied"
    : copyState.value === "failed"
    ? "Failed"
    : "Copy"
);

const status = computed(() => {
  if (copyState.value === "copied") return "Code copied to clipboard.";
  if (copyState.value === "failed")
    return "Copying failed. Select the code and copy it manually.";
  return "";
});

onMounted(() => {
  const el = body.value;
  if (el && el.scrollHeight <= props.peek + 8) needsToggle.value = false;
});

function toggle() {
  isExpanded.value = !isExpanded.value;
  if (!isExpanded.value && root.value) {
    root.value.scrollIntoView({ block: "nearest" });
  }
}

async function copy() {
  const el = body.value && body.value.querySelector("pre code");
  const code = el ? el.textContent : "";
  if (!code) return;

  try {
    if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(code);
    copyState.value = "copied";
  } catch {
    copyState.value = "failed";
  }

  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copyState.value = "idle";
  }, 2000);
}

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <div ref="root" class="code-example">
    <div class="code-example__bar">
      <span class="code-example__title">{{ title }}</span>

      <button type="button" class="code-example__copy" @click="copy">
        <span aria-hidden="true">{{ copyLabel }}</span>
        <span class="code-example__sr">Copy {{ title }} code</span>
      </button>
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

    <p class="code-example__sr" role="status">{{ status }}</p>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 8px 6px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-example__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.code-example__copy,
.code-example__more {
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
}

.code-example__copy {
  padding: 6px 10px;
  min-width: 64px;
}

.code-example__copy:hover,
.code-example__more:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.code-example__copy:focus-visible,
.code-example__more:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
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
  background: var(--vp-c-bg-soft);
}

.code-example__body :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
}

.code-example__body :deep(button.copy) {
  display: none;
}

.code-example__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
