<script setup lang="ts">
import { computed, ref } from "vue";

type TemplateId = "vue-starter-template" | "vue-starter-template-extended";
type EnvId = "stackblitz" | "codespaces" | "local";

interface Template {
  id: TemplateId;
  title: string;
  pitch: string;
}

interface Env {
  id: EnvId;
  title: string;
  pitch: string;
  expectedDuration: string;
  buildOpenUrl: (template: TemplateId) => string | null;
  buildCommand?: (template: TemplateId) => string;
}

const templates: Template[] = [
  {
    id: "vue-starter-template",
    title: "Vue Starter Template",
    pitch:
      "Production-ready blank starter with all core packages pre-configured.",
  },
  {
    id: "vue-starter-template-extended",
    title: "Vue Starter Template Extended (Lumora)",
    pitch:
      "Branded demo store layered on top of the starter — shows the Nuxt layer pattern.",
  },
];

const environments: Env[] = [
  {
    id: "stackblitz",
    title: "StackBlitz",
    pitch: "Fastest to open in the browser. Some boot noise is expected.",
    expectedDuration: "~30 seconds to first preview",
    buildOpenUrl: (t) =>
      `https://stackblitz.com/github/shopware/frontends/tree/main/templates/${t}`,
  },
  {
    id: "codespaces",
    title: "GitHub Codespaces",
    pitch:
      "Clean cloud dev environment. Slower cold start, full VS Code experience.",
    expectedDuration: "~2-3 minutes on first boot",
    buildOpenUrl: (t) =>
      `https://github.com/codespaces/new?repo=shopware/frontends&ref=main&devcontainer_path=.devcontainer/${t}/devcontainer.json`,
  },
  {
    id: "local",
    title: "Local clone",
    pitch: "Fastest after first install. Run on your machine.",
    expectedDuration: "~1 minute after first install",
    buildOpenUrl: () => null,
    buildCommand: (t) =>
      `npx tiged shopware/frontends/templates/${t} my-store && cd my-store && npm install && npm run dev`,
  },
];

const selectedTemplate = ref<TemplateId>("vue-starter-template");
const selectedEnv = ref<EnvId>("codespaces");

const env = computed(
  () => environments.find((e) => e.id === selectedEnv.value)!,
);
const template = computed(
  () => templates.find((t) => t.id === selectedTemplate.value)!,
);

const openUrl = computed(() => env.value.buildOpenUrl(selectedTemplate.value));
const command = computed(() =>
  env.value.buildCommand
    ? env.value.buildCommand(selectedTemplate.value)
    : null,
);

const copied = ref(false);
async function copyCommand() {
  if (!command.value) return;
  await navigator.clipboard.writeText(command.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <div class="try-it-out">
    <section class="try-it-out-section">
      <h3 class="try-it-out-section-title">1. Choose a template</h3>
      <div class="try-it-out-grid">
        <button
          v-for="t in templates"
          :key="t.id"
          type="button"
          class="try-it-out-card"
          :class="{ 'is-selected': selectedTemplate === t.id }"
          :aria-pressed="selectedTemplate === t.id"
          @click="selectedTemplate = t.id"
        >
          <span class="try-it-out-card-title">{{ t.title }}</span>
          <span class="try-it-out-card-pitch">{{ t.pitch }}</span>
        </button>
      </div>
    </section>

    <section class="try-it-out-section">
      <h3 class="try-it-out-section-title">2. Choose an environment</h3>
      <div class="try-it-out-grid">
        <button
          v-for="e in environments"
          :key="e.id"
          type="button"
          class="try-it-out-card"
          :class="{ 'is-selected': selectedEnv === e.id }"
          :aria-pressed="selectedEnv === e.id"
          @click="selectedEnv = e.id"
        >
          <span class="try-it-out-card-title">{{ e.title }}</span>
          <span class="try-it-out-card-pitch">{{ e.pitch }}</span>
          <span class="try-it-out-card-meta">{{ e.expectedDuration }}</span>
        </button>
      </div>
    </section>

    <section class="try-it-out-launch">
      <div class="try-it-out-launch-summary">
        <span class="try-it-out-launch-label">Launching</span>
        <strong>{{ template.title }}</strong>
        <span class="try-it-out-launch-divider">in</span>
        <strong>{{ env.title }}</strong>
      </div>

      <a
        v-if="openUrl"
        class="try-it-out-launch-btn primary"
        :href="openUrl"
        target="_blank"
        rel="noopener"
      >Open in {{ env.title }} ↗</a>

      <div v-else-if="command" class="try-it-out-command-block">
        <pre class="try-it-out-command"><code>{{ command }}</code></pre>
        <button
          class="try-it-out-launch-btn secondary"
          type="button"
          @click="copyCommand"
        >
          <span v-if="copied">Copied!</span>
          <span v-else>Copy command</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.try-it-out {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.try-it-out-section-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

.try-it-out-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.try-it-out-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  font: inherit;
  color: inherit;
}

.try-it-out-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.try-it-out-card.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft, var(--vp-c-bg-soft));
  box-shadow: 0 0 0 1px var(--vp-c-brand-1) inset;
}

.try-it-out-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.try-it-out-card-pitch {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.try-it-out-card-meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.try-it-out-launch {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 18px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.try-it-out-launch-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.try-it-out-launch-label,
.try-it-out-launch-divider {
  color: var(--vp-c-text-2);
}

.try-it-out-launch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.15s ease;
  align-self: flex-start;
}

.try-it-out-launch-btn.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.try-it-out-launch-btn.primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.try-it-out-launch-btn.secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.try-it-out-launch-btn.secondary:hover {
  background: var(--vp-c-bg-mute);
}

.try-it-out-command-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.try-it-out-command {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  overflow-x: auto;
  white-space: pre;
}
</style>
