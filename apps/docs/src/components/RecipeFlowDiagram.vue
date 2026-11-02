<script setup lang="ts">
import type { RecipeFlowStep } from "./recipeFlow";
import SchemaTypeTooltip from "./SchemaTypeTooltip.vue";

const props = defineProps<{
  steps: RecipeFlowStep[];
  label?: string;
}>();

// Same layer colors as the nodes in LoginVueFlowDiagram. Layers without an
// entry fall back to a neutral accent.
const layerKinds: Record<string, string> = {
  UI: "ui",
  Page: "ui",
  Components: "ui",
  Composable: "composable",
  "Composable state": "context",
  "Store API": "api",
  Client: "api",
  Context: "context",
  "Shared state": "context",
  Cart: "cart",
  Error: "error",
  Errors: "error",
};

function layerKind(title: string) {
  return layerKinds[title] ?? "neutral";
}
</script>

<template>
  <section
    class="recipe-flow"
    :aria-label="props.label ?? 'Recipe flow diagram'"
  >
    <p class="recipe-flow__hint">
      Hover or focus a type chip to inspect its fields, generated from the
      current Store API schema.
    </p>
    <ol class="recipe-flow__steps">
      <li
        v-for="(step, index) in props.steps"
        :key="`${step.title}-${index}`"
        class="recipe-flow__step"
        :class="`recipe-flow__step--${layerKind(step.title)}`"
      >
        <span class="recipe-flow__marker" aria-hidden="true">
          {{ index + 1 }}
        </span>

        <div class="recipe-flow__card">
          <p class="recipe-flow__heading">
            <span class="recipe-flow__layer">{{ step.title }}</span>
            <span class="recipe-flow__action">{{ step.action }}</span>
          </p>

          <p class="recipe-flow__detail">{{ step.detail }}</p>

          <pre class="recipe-flow__code"><code>{{ step.code }}</code></pre>

          <dl class="recipe-flow__meta">
            <div class="recipe-flow__meta-item">
              <dt>State</dt>
              <dd>{{ step.state }}</dd>
            </div>
            <div v-if="step.typeKeys.length" class="recipe-flow__meta-item">
              <dt>Types</dt>
              <dd class="recipe-flow__types">
                <SchemaTypeTooltip
                  v-for="typeKey in step.typeKeys"
                  :key="typeKey"
                  :type-key="typeKey"
                />
              </dd>
            </div>
          </dl>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.recipe-flow {
  margin: 24px 0;
}

.recipe-flow__hint {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.recipe-flow__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.recipe-flow__step {
  --recipe-flow-accent: var(--vp-c-text-3);
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
  margin: 0;
  padding-bottom: 16px;
}

.recipe-flow__step--ui {
  --recipe-flow-accent: #2563eb;
}

.recipe-flow__step--composable {
  --recipe-flow-accent: #7c3aed;
}

.recipe-flow__step--api {
  --recipe-flow-accent: #0891b2;
}

.recipe-flow__step--context {
  --recipe-flow-accent: #16a34a;
}

.recipe-flow__step--cart {
  --recipe-flow-accent: #ea580c;
}

.recipe-flow__step--error {
  --recipe-flow-accent: #dc2626;
}

.recipe-flow__step:last-child {
  padding-bottom: 0;
}

/* Rail connecting the step markers. */
.recipe-flow__step:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 46px;
  bottom: 4px;
  left: 15px;
  width: 2px;
  border-radius: 1px;
  background: var(--vp-c-border);
}

.recipe-flow__marker {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  margin-top: 10px;
  border: 2px solid var(--recipe-flow-accent);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 700;
}

.recipe-flow__card {
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid var(--recipe-flow-accent);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.recipe-flow__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 0 0 6px;
  line-height: 1.4;
}

.recipe-flow__layer {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--recipe-flow-accent) 16%, transparent);
  color: var(--vp-c-text-1);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.recipe-flow__action {
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 600;
}

.recipe-flow__detail {
  max-width: 68ch;
  margin: 0 0 10px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.recipe-flow__code {
  margin: 0 0 10px;
  padding: 8px 12px;
  overflow-x: auto;
  border-radius: 6px;
  background: var(--vp-code-block-bg, var(--vp-c-bg-alt));
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
}

.recipe-flow__code code {
  padding: 0;
  background: transparent;
  color: var(--vp-code-block-color, var(--vp-c-text-1));
  font-size: inherit;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.recipe-flow__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
}

.recipe-flow__meta-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  min-width: 0;
}

.recipe-flow__meta dt {
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.recipe-flow__meta dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.recipe-flow__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
