<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { colors } from "../../data/design-tokens-colors";

const GROUP_ORDER = [
  "brand",
  "surface",
  "outline",
  "states",
  "fixed",
  "other",
  "overlay",
];

const GROUP_LABELS: Record<string, string> = {
  brand: "Brand",
  surface: "Surface",
  outline: "Outline",
  states: "States",
  fixed: "Fixed",
  other: "Other",
  overlay: "Overlay",
};

function groupKey(token: string): string {
  const seg = token.split("-")[0];
  return GROUP_ORDER.includes(seg) ? seg : "other";
}

interface Token {
  name: string;
  value: string;
  isTransparent: boolean;
}

const overrides = reactive<Record<string, string>>({});

function isRgba(value: string): boolean {
  return value.trim().startsWith("rgba");
}

function resolvedValue(name: string, base: string): string {
  return overrides[name] ?? base;
}

const groups = computed(() => {
  const map = new Map<string, Token[]>();
  for (const [name, value] of Object.entries(colors) as [string, string][]) {
    const g = groupKey(name);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push({
      name,
      value,
      isTransparent: value.startsWith("rgba"),
    });
  }
  for (const tokens of map.values()) {
    tokens.sort((a, b) => a.name.localeCompare(b.name));
  }
  return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
    key: g,
    label: GROUP_LABELS[g] || g,
    tokens: map.get(g)!,
  }));
});

function toColorInputHex(css: string): string {
  const s = css.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) {
    return s.toLowerCase();
  }
  if (/^#[0-9A-Fa-f]{3}$/.test(s)) {
    const r = s[1];
    const g = s[2];
    const b = s[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return "#000000";
}

function onHexInput(name: string, event: Event) {
  const el = event.target as HTMLInputElement;
  overrides[name] = el.value;
}

const rgbaEditName = ref<string | null>(null);
const rgbaDraft = ref("");
const rgbaInputRef = ref<HTMLInputElement | null>(null);

function openRgbaEditor(name: string, current: string) {
  rgbaEditName.value = name;
  rgbaDraft.value = current;
  nextTick(() => rgbaInputRef.value?.focus());
}

function applyRgbaEdit(name: string) {
  const v = rgbaDraft.value.trim();
  if (v) {
    overrides[name] = v;
  }
  rgbaEditName.value = null;
}

function cancelRgbaEdit() {
  rgbaEditName.value = null;
}

function mergedEntries(): [string, string][] {
  return (Object.entries(colors) as [string, string][]).map(([k, v]) => [
    k,
    overrides[k] ?? v,
  ]);
}

function buildSnippet(): string {
  const lines = mergedEntries().map(([k, v]) => `  "${k}": "${v}",`);
  return `colors: {\n${lines.join("\n")}\n}`;
}

const copied = ref(false);

async function copySnippet() {
  await navigator.clipboard.writeText(buildSnippet());
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function downloadSnippet() {
  const header =
    "// Paste this object inside theme: { ... } in your uno.config.ts\n";
  const blob = new Blob([header + buildSnippet() + "\n"], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "uno-theme-colors.ts";
  a.click();
  URL.revokeObjectURL(url);
}

function contrastColor(value: string): string {
  if (value.startsWith("rgba")) {
    return "#000";
  }
  const hex = value.replace("#", "");
  if (hex.length < 6) {
    return "#FFFFFF";
  }
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1D1B20" : "#FFFFFF";
}
</script>

<template>
  <div class="color-tokens">
    <p class="color-tokens-hint">
      Click a swatch to change its color. Copy or download includes your edits.
    </p>
    <div class="color-tokens-actions">
      <button class="color-tokens-btn primary" type="button" @click="copySnippet">
        <span v-if="copied">Copied!</span>
        <span v-else>Copy Uno theme snippet</span>
      </button>
      <button class="color-tokens-btn secondary" type="button" @click="downloadSnippet">
        Download .ts snippet
      </button>
    </div>

    <div v-for="group in groups" :key="group.key" class="color-tokens-group">
      <h3 :id="`tokens-${group.key}`">{{ group.label }}</h3>
      <div class="color-tokens-grid">
        <div
          v-for="token in group.tokens"
          :key="token.name"
          class="color-token-card"
        >
          <div
            class="color-token-swatch"
            :class="{
              'is-transparent': isRgba(resolvedValue(token.name, token.value)),
            }"
            :title="
              isRgba(resolvedValue(token.name, token.value))
                ? 'Click to edit rgba value'
                : 'Click to pick a color'
            "
          >
            <div
              class="color-token-swatch-fill"
              :style="{
                backgroundColor: resolvedValue(token.name, token.value),
              }"
            >
              <span
                class="color-token-swatch-label"
                :style="{
                  color: contrastColor(resolvedValue(token.name, token.value)),
                }"
              >Aa</span>
            </div>
            <input
              v-if="!isRgba(resolvedValue(token.name, token.value))"
              type="color"
              class="color-token-picker-hitbox"
              :aria-label="`Pick color for ${token.name}`"
              :value="toColorInputHex(resolvedValue(token.name, token.value))"
              @input="onHexInput(token.name, $event)"
            >
            <button
              v-else
              type="button"
              class="color-token-picker-hitbox color-token-picker-rgba"
              :aria-label="`Edit ${token.name}`"
              @click="openRgbaEditor(token.name, resolvedValue(token.name, token.value))"
            />
          </div>
          <div
            v-if="rgbaEditName === token.name"
            class="color-token-rgba-panel"
            @keydown.escape="cancelRgbaEdit"
          >
            <label class="color-token-rgba-label" :for="`rgba-${token.name}`">CSS color</label>
            <input
              :id="`rgba-${token.name}`"
              ref="rgbaInputRef"
              v-model="rgbaDraft"
              type="text"
              class="color-token-rgba-input"
              autocomplete="off"
              spellcheck="false"
              @blur="applyRgbaEdit(token.name)"
              @keydown.enter="applyRgbaEdit(token.name)"
              @keydown.escape="cancelRgbaEdit"
            >
          </div>
          <div class="color-token-info">
            <code class="color-token-name">{{ token.name }}</code>
            <span class="color-token-value">{{
              resolvedValue(token.name, token.value)
            }}</span>
            <span class="color-token-class">bg-{{ token.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-tokens {
  margin-top: 24px;
}

.color-tokens-hint {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.color-tokens-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.color-tokens-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
  min-width: 180px;
  justify-content: center;
}

.color-tokens-btn.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.color-tokens-btn.primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.color-tokens-btn.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.color-tokens-btn.secondary:hover {
  background: var(--vp-c-bg-mute);
}

.color-tokens-group {
  margin-bottom: 40px;
}

.color-tokens-group h3 {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.color-tokens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.color-token-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg);
  transition: box-shadow 0.2s ease;
}

.color-token-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.color-token-swatch {
  height: 80px;
  position: relative;
}

.color-token-swatch.is-transparent {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}

.color-token-swatch:hover .color-token-swatch-fill {
  filter: brightness(0.97);
}

.color-token-swatch-fill {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.color-token-picker-hitbox {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  opacity: 0;
}

.color-token-picker-rgba {
  background: transparent;
}

.color-token-rgba-panel {
  padding: 10px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.color-token-rgba-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.color-token-rgba-input {
  width: 100%;
  box-sizing: border-box;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.color-token-rgba-input:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 0;
}

.color-token-swatch-label {
  font-size: 20px;
  font-weight: 700;
  opacity: 0.85;
  user-select: none;
}

.color-token-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-token-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.color-token-value {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}

.color-token-class {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}
</style>
