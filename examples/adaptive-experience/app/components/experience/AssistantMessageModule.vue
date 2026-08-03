<script setup lang="ts">
// Inline concrete shape (mirrors `assistantMessagePropsSchema`): the Vue macro
// cannot resolve a zod `z.infer` alias at compile time.
defineProps<{ message: string; quickActions?: string[] }>();

const { track, theme, setVibe } = useExperienceEngine();
const route = useRoute();
const router = useRouter();

// The assistant's signature action: it always offers to flip the whole Gen Z
// experience on or off. The label follows the current skin, so one button both
// offers and reverts.
const vibeLabel = computed(() =>
  theme.value === "genz" ? "Back to classic" : "Switch it up",
);
const toggleVibe = () => setVibe(theme.value === "genz" ? "classic" : "genz");

// The context quick actions the planner may emit. Each maps to a real change
// through the same event -> rules -> plan flow the rest of the page already uses
// - no new pathway for AI output to move the UI. A label with no handler falls
// through to an inert chip, so an unrecognised suggestion can never do anything.
const ACTIONS: Record<string, () => void> = {
  "Sort by price": () =>
    router.push({ query: { ...route.query, order: "price-asc" } }),
  "Clear comparison": () => track({ type: "comparison-cleared" }),
};

const run = (label: string) => ACTIONS[label]?.();
</script>

<template>
  <aside
    v-if="message"
    class="border border-outline-outline-variant rounded-lg bg-surface-surface-container-low p-4 text-sm flex flex-col gap-3"
    data-testid="experience-assistant-panel"
  >
    <!-- Interpolated as text, never as HTML: the message may originate from AI. -->
    <p class="m-0 text-surface-on-surface">{{ message }}</p>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="text-xs font-semibold rounded-full px-3 py-1 bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover transition-colors cursor-pointer"
        data-testid="experience-vibe-action"
        @click="toggleVibe"
      >
        {{ vibeLabel }}
      </button>
      <template v-for="action in quickActions" :key="action">
        <button
          v-if="ACTIONS[action]"
          type="button"
          class="text-xs font-medium rounded-full px-3 py-1 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-on-primary transition-colors cursor-pointer"
          data-testid="experience-assistant-action"
          @click="run(action)"
        >
          {{ action }}
        </button>
        <span
          v-else
          class="text-xs rounded-full px-3 py-1 border border-outline-outline-variant text-surface-on-surface-variant"
        >
          {{ action }}
        </span>
      </template>
    </div>
  </aside>
</template>
