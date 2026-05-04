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

const templatesById: Record<TemplateId, Template> = {
  "vue-starter-template": {
    id: "vue-starter-template",
    title: "Vue Starter Template",
    pitch:
      "Production-ready blank starter with all core packages pre-configured.",
  },
  "vue-starter-template-extended": {
    id: "vue-starter-template-extended",
    title: "Vue Starter Template Extended (Lumora)",
    pitch:
      "Branded demo store layered on top of the starter — shows the Nuxt layer pattern.",
  },
};

const templates: Template[] = [
  templatesById["vue-starter-template"],
  templatesById["vue-starter-template-extended"],
];

const environmentsById: Record<EnvId, Env> = {
  local: {
    id: "local",
    title: "Local clone",
    pitch: "Fastest after first install. Run on your machine.",
    expectedDuration: "~1 minute after first install",
    buildOpenUrl: () => null,
    buildCommand: (t) =>
      `npx tiged shopware/frontends/templates/${t} my-store && cd my-store && npm install && npm run dev`,
  },
  stackblitz: {
    id: "stackblitz",
    title: "StackBlitz",
    pitch: "Fastest to open in the browser. Some boot noise is expected.",
    expectedDuration: "~30 seconds to first preview",
    buildOpenUrl: (t) =>
      `https://stackblitz.com/github/shopware/frontends/tree/main/templates/${t}`,
  },
  codespaces: {
    id: "codespaces",
    title: "GitHub Codespaces",
    pitch:
      "Clean cloud dev environment. Slower cold start, full VS Code experience.",
    expectedDuration: "~2-3 minutes on first boot",
    buildOpenUrl: (t) =>
      `https://github.com/codespaces/new?repo=shopware/frontends&ref=main&devcontainer_path=.devcontainer/${t}/devcontainer.json`,
  },
};

const environments: Env[] = [
  environmentsById.local,
  environmentsById.stackblitz,
  environmentsById.codespaces,
];

const selectedTemplate = ref<TemplateId>("vue-starter-template");
const selectedEnv = ref<EnvId>("local");

const env = computed(() => environmentsById[selectedEnv.value]);
const template = computed(() => templatesById[selectedTemplate.value]);

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
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

const aiPrompts: Record<TemplateId, string> = {
  "vue-starter-template": `I want to set up the Shopware Frontends Vue Starter Template for local development.

In my current working directory, please:

1. Run \`npx tiged shopware/frontends/templates/vue-starter-template my-store\`
2. \`cd my-store\`
3. Run \`npm install\`
4. Start the dev server with \`npm run dev\` and tell me when it's ready on http://localhost:3000

If anything fails, surface the error and stop — don't try to "fix" peer-dep warnings unless I ask.

The template is Nuxt 4 + UnoCSS + the Shopware composables/cms-base layers, pre-configured against a public demo backend. After it's running, point me at \`app/\` for components and pages, and \`nuxt.config.ts\` for runtime configuration.`,
  "vue-starter-template-extended": `I want to set up the Shopware Frontends Vue Starter Template Extended (Lumora demo) for local development.

This template is a Nuxt layer that extends \`vue-starter-template\`, so we need both. In my current working directory, please:

1. Scaffold the base: \`npx tiged shopware/frontends/templates/vue-starter-template vue-starter-template\`
2. Scaffold the extended: \`npx tiged shopware/frontends/templates/vue-starter-template-extended lumora-store\`
3. In \`lumora-store/package.json\`:
   - replace \`"vue-starter-template": "workspace:*"\` with \`"vue-starter-template": "file:../vue-starter-template"\`
   - replace any other \`workspace:*\` dep with \`"canary"\` (the published npm tag)
   - tell me exactly what you changed
4. \`cd lumora-store\`, run \`npm install\`, then \`npm run dev\`. Confirm when the storefront is up on http://localhost:3000.

Peer-dep warnings during install are safe to ignore. If any package fails to resolve, stop and report.

After it's running, point me at \`lumora-store/app/app.config.ts\` (brand config) and \`lumora-store/uno.config.ts\` (theme overrides).`,
};

const aiPrompt = computed(() => aiPrompts[selectedTemplate.value]);

const promptCopied = ref(false);
async function copyAiPrompt() {
  await navigator.clipboard.writeText(aiPrompt.value);
  promptCopied.value = true;
  setTimeout(() => {
    promptCopied.value = false;
  }, 2000);
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

    <section class="try-it-out-ai">
      <div class="try-it-out-ai-header">
        <h3 class="try-it-out-section-title">Or: delegate to an AI agent</h3>
        <p class="try-it-out-ai-hint">
          Paste this prompt into Claude, Cursor, Copilot, or any code assistant.
          The prompt is tailored to <strong>{{ template.title }}</strong>.
        </p>
      </div>
      <pre class="try-it-out-command try-it-out-ai-prompt"><code>{{ aiPrompt }}</code></pre>
      <button
        class="try-it-out-launch-btn secondary"
        type="button"
        @click="copyAiPrompt"
      >
        <span v-if="promptCopied">Copied!</span>
        <span v-else>Copy AI prompt</span>
      </button>
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

.try-it-out-ai {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 18px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.try-it-out-ai-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.try-it-out-ai-hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.try-it-out-ai-prompt {
  white-space: pre-wrap;
  max-height: 320px;
  overflow-y: auto;
  font-size: 12px;
}
</style>
