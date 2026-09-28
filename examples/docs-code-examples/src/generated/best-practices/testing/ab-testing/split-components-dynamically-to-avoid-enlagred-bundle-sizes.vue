<script setup lang="ts">
import { defineAsyncComponent } from "vue";

function useABTesting(_flag: string) {
  return true;
}

const myExperimentFlag = useABTesting("myExperimentFlag");

const MyComponent = defineAsyncComponent(() =>
  myExperimentFlag
    ? import("./MyComponentVariantA.vue")
    : import("./MyComponentVariantB.vue"),
);
</script>

<template>
  <MyComponent />
</template>
