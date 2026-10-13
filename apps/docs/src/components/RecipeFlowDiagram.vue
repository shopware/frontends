<script setup lang="ts">
import SchemaTypeTooltip from "./SchemaTypeTooltip.vue";

type RecipeFlowStep = {
  title: string;
  action: string;
  detail: string;
  code: string;
  state: string;
  typeKeys: string[];
};

const props = defineProps<{
  steps: RecipeFlowStep[];
  label?: string;
}>();
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
      >
        <span class="recipe-flow__marker" aria-hidden="true">
          {{ index + 1 }}
        </span>

        <div class="recipe-flow__body">
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
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 16px;
  margin: 0;
  padding-bottom: 28px;
}

.recipe-flow__step:last-child {
  padding-bottom: 0;
}

/* Rail connecting the step markers. */
.recipe-flow__step:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 36px;
  bottom: 4px;
  left: 15px;
  width: 2px;
  border-radius: 1px;
  background: var(--vp-c-divider);
}

.recipe-flow__marker {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 700;
}

.recipe-flow__body {
  min-width: 0;
  padding-top: 3px;
}

.recipe-flow__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin: 0 0 6px;
  line-height: 1.4;
}

.recipe-flow__layer {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.recipe-flow__action {
  color: var(--vp-c-text-1);
  font-size: 17px;
  font-weight: 600;
}

.recipe-flow__detail {
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  line-height: 1.65;
}

.recipe-flow__code {
  margin: 0 0 12px;
  padding: 10px 14px;
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
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.recipe-flow__meta dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.recipe-flow__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
