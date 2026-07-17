<script setup lang="ts">
// The engine's reset, not the plan's: restoring the standard view has to clear
// the signals the rules read, or they rebuild the adapted view on the next pass.
const { plan, reset } = useExperienceEngine();

// Static lookups: UnoCSS scans source text, so a class built by interpolation
// would never be generated. The schemas bound every value, which makes these
// maps exhaustive by contract.
const WIDTH_CLASSES = {
  standard: "max-w-screen-2xl",
  wide: "max-w-[1800px]",
  full: "max-w-none",
} as const;

const DENSITY_CLASSES = {
  comfortable: "gap-6 lg:gap-8",
  compact: "gap-3 lg:gap-4",
} as const;

const hasSidebar = computed(() => plan.value.regions.sidebar.length > 0);
</script>

<template>
  <div
    class="my-4 w-full mx-auto"
    :class="WIDTH_CLASSES[plan.workspace.width]"
    data-testid="experience-workspace"
    :data-experience-mode="plan.mode"
  >
    <div class="flex justify-end mb-2">
      <button
        v-if="plan.version > 0"
        type="button"
        class="text-sm underline"
        data-testid="experience-reset"
        @click="reset"
      >
        Restore standard view
      </button>
    </div>

    <div
      class="grid grid-cols-12"
      :class="DENSITY_CLASSES[plan.workspace.density]"
    >
      <aside
        v-if="hasSidebar"
        class="col-span-12 md:col-span-4 lg:col-span-3 order-2 md:order-1"
      >
        <ExperienceRegion :modules="plan.regions.sidebar" />
      </aside>
      <div
        class="col-span-12 order-1 md:order-2"
        :class="hasSidebar ? 'md:col-span-8 lg:col-span-9' : ''"
      >
        <ExperienceRegion :modules="plan.regions.main" />
      </div>
    </div>
  </div>
</template>
