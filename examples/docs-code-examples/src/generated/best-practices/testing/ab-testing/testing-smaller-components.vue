<script setup lang="ts">
function useABTesting(_flag: string) {
  return true;
}

const myExperimentFlag = useABTesting("myExperimentFlag");
</script>

<template>
  <button
    :class="{
      'bg-color-red': myExperimentFlag,
      'bg-color-blue': !myExperimentFlag,
    }"
  >
    Click me
  </button>

  <button v-if="myExperimentFlag" class="bg-color-red">Click me</button>
  <button v-else class="bg-color-blue">Click me please!</button>
</template>
