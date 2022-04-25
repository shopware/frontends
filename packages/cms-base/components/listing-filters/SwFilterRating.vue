
<script setup lang="ts">
import SwStarIcon from "../SwStarIcon.vue"
const $emits = defineEmits("select-value");
const $props = defineProps(["filter", "selectedFilters"])
const isHoverActive = ref(false);
const hoveredIndex = ref(0)
const displayedScore = computed(() => isHoverActive.value ? hoveredIndex.value : $props.selectedFilters?.rating || 0)
const hoverRating = (key) =>  {
  hoveredIndex.value = key
  isHoverActive.value = true
}
const onChangeRating = () => {
  const newValue = $props.selectedFilters?.rating !== hoveredIndex.value ? hoveredIndex.value : undefined;
  $emits('select-value', {code: $props.filter?.code, value: newValue})
}
</script>

<template>
<div class="flex">
    <SwStarIcon v-for="i in filter.max || 5"
      @mouseleave="isHoverActive = false"
      :key="i"
      :isEmpty="i > displayedScore"
      @click="onChangeRating()"
      @mouseover="hoverRating(i)" />
</div>
</template>
