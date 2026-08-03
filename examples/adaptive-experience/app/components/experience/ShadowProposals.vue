<script setup lang="ts">
// The shadow inspector: in shadow mode (§6) the planner records what it *would*
// do without applying it. This surfaces those proposals so a model can be judged
// before it is ever allowed to move the UI - the whole point of shadow mode.
// Inline prop shape: the Vue macro cannot resolve an imported alias reliably.
const props = defineProps<{
  proposals: {
    basedOnPlanVersion: number;
    reasonCode: string;
    confidence: number;
    wouldAccept: number;
    wouldReject: string[];
  }[];
}>();

// Most recent first, capped so the panel stays readable.
const recent = computed(() => props.proposals.slice(-6).reverse());
</script>

<template>
  <section
    class="mt-8 border rounded-lg p-4 text-sm"
    data-testid="experience-shadow-panel"
  >
    <header class="flex items-center justify-between mb-3">
      <h2 class="font-medium m-0">AI planner · shadow proposals</h2>
      <span class="text-xs text-brand-on-secondary/60 font-mono">
        {{ proposals.length }} recorded · applied nothing
      </span>
    </header>

    <p v-if="!recent.length" class="text-xs text-brand-on-secondary/60 m-0">
      No proposals yet. The planner is asked on the next settled change; each
      proposal shows how many operations the merger would accept.
    </p>

    <ul v-else class="flex flex-col gap-2 m-0 p-0 list-none">
      <li
        v-for="(p, index) in recent"
        :key="index"
        class="border rounded p-3 flex flex-wrap items-center gap-x-4 gap-y-1"
      >
        <span
          class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-brand-secondary/50"
        >
          {{ p.reasonCode }}
        </span>
        <span class="font-mono text-xs">
          confidence <b>{{ p.confidence.toFixed(2) }}</b>
        </span>
        <span class="font-mono text-xs text-states-success">
          would accept <b>{{ p.wouldAccept }}</b>
        </span>
        <span
          v-if="p.wouldReject.length"
          class="font-mono text-xs text-states-error"
        >
          would reject: {{ p.wouldReject.join(", ") }}
        </span>
        <span v-else class="font-mono text-xs text-brand-on-secondary/50">
          nothing rejected
        </span>
      </li>
    </ul>
  </section>
</template>
