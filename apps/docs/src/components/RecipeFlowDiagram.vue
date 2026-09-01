<script setup lang="ts">
import { computed, ref } from "vue";

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

const activeStepIndex = ref(0);
const activeStep = computed(() => props.steps[activeStepIndex.value]);
</script>

<template>
  <section
    class="recipe-flow"
    :aria-label="props.label ?? 'Recipe flow diagram'"
  >
    <div class="recipe-flow__track">
      <button
        v-for="(step, index) in props.steps"
        :key="`${step.title}-${index}`"
        type="button"
        class="recipe-flow__step"
        :class="{ 'recipe-flow__step--active': activeStepIndex === index }"
        :aria-pressed="activeStepIndex === index"
        @click="activeStepIndex = index"
      >
        <span class="recipe-flow__number">{{ index + 1 }}</span>
        <span class="recipe-flow__title">{{ step.title }}</span>
        <span class="recipe-flow__action">{{ step.action }}</span>
      </button>
    </div>

    <div class="recipe-flow__details">
      <div>
        <p class="recipe-flow__eyebrow">Step {{ activeStepIndex + 1 }}</p>
        <h3>{{ activeStep.title }}: {{ activeStep.action }}</h3>
        <p>{{ activeStep.detail }}</p>
      </div>

      <dl class="recipe-flow__facts">
        <div>
          <dt>Code</dt>
          <dd>
            <code>{{ activeStep.code }}</code>
          </dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{{ activeStep.state }}</dd>
        </div>
        <div>
          <dt>Types</dt>
          <dd class="recipe-flow__types">
            <SchemaTypeTooltip
              v-for="typeKey in activeStep.typeKeys"
              :key="typeKey"
              :type-key="typeKey"
            />
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.recipe-flow {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: visible;
  background: var(--vp-c-bg-soft);
}

.recipe-flow__track {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  border-bottom: 1px solid var(--vp-c-divider);
}

.recipe-flow__step {
  min-height: 128px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 8px;
  align-content: start;
  padding: 16px 12px;
  border: 0;
  border-right: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
}

.recipe-flow__step:last-child {
  border-right: 0;
}

.recipe-flow__step:hover,
.recipe-flow__step:focus-visible {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.recipe-flow__step:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.recipe-flow__step--active {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: inset 0 -3px 0 var(--vp-c-brand-1);
}

.recipe-flow__number {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 13px;
}

.recipe-flow__step--active .recipe-flow__number {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.recipe-flow__title {
  font-weight: 700;
  font-size: 14px;
}

.recipe-flow__action {
  font-size: 13px;
  line-height: 1.4;
}

.recipe-flow__details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.6fr);
  gap: 24px;
  padding: 24px;
  background: var(--vp-c-bg);
}

.recipe-flow__details h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.recipe-flow__details p {
  margin: 0;
}

.recipe-flow__eyebrow {
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.recipe-flow__facts {
  display: grid;
  gap: 12px;
  margin: 0;
}

.recipe-flow__facts div {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.recipe-flow__facts dt {
  margin-bottom: 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.recipe-flow__facts dd {
  margin: 0;
  font-size: 13px;
}

.recipe-flow__facts code {
  white-space: normal;
  overflow-wrap: anywhere;
}

.recipe-flow__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 960px) {
  .recipe-flow__track {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .recipe-flow__step:nth-child(3) {
    border-right: 0;
  }

  .recipe-flow__step:nth-child(n + 4) {
    border-top: 1px solid var(--vp-c-divider);
  }
}

@media (max-width: 640px) {
  .recipe-flow__track,
  .recipe-flow__details {
    grid-template-columns: 1fr;
  }

  .recipe-flow__step {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .recipe-flow__step:nth-child(n + 4) {
    border-top: 0;
  }

  .recipe-flow__details {
    padding: 18px;
  }
}
</style>
