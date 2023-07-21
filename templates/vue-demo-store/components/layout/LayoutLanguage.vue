<script setup lang="ts">
const attrs = useAttrs();

const { setLanguage, languages, currentLanguage } = useLanguage();
const languagesOptions = computed(() => {
  return languages.value?.map(x => ({
    label: `${x.name}`,
    value: x.id
  })) ?? [];
})
</script>
<template>
  <div
    class="sw-language-switcher"
    data-testid="language-switcher"
  >
    <SwSelect
      id="language"
      name="language"
      :modelValue="currentLanguage?.id" 
      @update:modelValue="(e: any) => setLanguage(e)"
      :options="languagesOptions"
      v-bind="attrs"
    />
  </div>
</template>
