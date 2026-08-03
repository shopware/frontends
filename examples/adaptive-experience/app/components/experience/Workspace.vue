<script setup lang="ts">
// The §12 renderer. Reads the plan and composes the four regions per the §7
// workspace layout. Reset is the engine's, not the plan's: restoring the
// standard view has to clear the signals the rules read, or they rebuild the
// adapted view on the next pass.
const { plan, reset } = useExperienceEngine();

// Static lookups: UnoCSS scans source text, so an interpolated class would never
// be generated. The schemas bound every value, so these maps are exhaustive.
const WIDTH_CLASSES = {
  standard: "max-w-screen-2xl",
  wide: "max-w-[1800px]",
  full: "max-w-none",
} as const;
const DENSITY_CLASSES = {
  comfortable: "gap-6 lg:gap-8",
  compact: "gap-3 lg:gap-4",
} as const;

const workspace = computed(() => plan.value.workspace);

// "Adapted" means the shopper's behaviour moved the view beyond the route
// baseline (filters + grid), so the route's own layout does not offer a reset.
const isAdapted = computed(
  () =>
    plan.value.mode !== "explore" ||
    workspace.value.density === "compact" ||
    plan.value.regions.top.some((m) => m.type === "product-comparison"),
);
const hasSidebar = computed(
  () =>
    workspace.value.sidebar !== "none" && plan.value.regions.aside.length > 0,
);
const asideClass = computed(() => {
  const order = workspace.value.sidebar === "right" ? "order-2" : "order-1";
  const sticky = workspace.value.stickyAside
    ? "md:sticky md:top-4 md:self-start"
    : "";
  return `col-span-12 md:col-span-4 lg:col-span-3 ${order} ${sticky}`;
});
const mainClass = computed(() =>
  hasSidebar.value
    ? `col-span-12 md:col-span-8 lg:col-span-9 ${workspace.value.sidebar === "right" ? "order-1" : "order-2"}`
    : "col-span-12",
);
</script>

<template>
  <div
    class="my-4 w-full mx-auto"
    :class="WIDTH_CLASSES[workspace.maxWidth]"
    data-testid="experience-workspace"
    :data-experience-mode="plan.mode"
  >
    <div class="flex justify-end mb-2">
      <button
        v-if="isAdapted"
        type="button"
        class="text-sm underline"
        data-testid="experience-reset"
        @click="reset"
      >
        Restore standard view
      </button>
    </div>

    <ExperienceRegion :modules="plan.regions.top" />

    <div class="grid grid-cols-12" :class="DENSITY_CLASSES[workspace.density]">
      <aside v-if="hasSidebar" :class="asideClass">
        <ExperienceRegion :modules="plan.regions.aside" />
      </aside>
      <div :class="mainClass">
        <ExperienceRegion :modules="plan.regions.main" />
      </div>
    </div>

    <ExperienceRegion :modules="plan.regions.bottom" />
  </div>
</template>
