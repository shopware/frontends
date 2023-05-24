<script setup lang="ts">
const { languages, changeLanguage } = useInternationalization();
const { languageIdChain } = useSessionContext();

const onChangeHandler = (option: Event) => {
  changeLanguage((option.target as HTMLSelectElement).value);
  window.location.reload();
};
</script>
<template>
  <select
    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
    @change="onChangeHandler"
  >
    <option
      v-for="language in languages"
      :key="language.id"
      :value="language.id"
      :selected="languageIdChain === language.id"
    >
      {{ language.translationCode.translated.name }}
    </option>
  </select>
</template>
