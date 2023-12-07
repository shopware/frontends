<script setup lang="ts">
import { getLanguageName } from "@shopware-pwa/helpers-next";

const { languages, changeLanguage, replaceToDevStorefront } =
  useInternationalization();
const { languageIdChain } = useSessionContext();

const onChangeHandler = async (option: Event) => {
  const data = await changeLanguage((option.target as HTMLSelectElement).value);

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
};
</script>
<template>
  <select
    aria-label="Select language"
    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
    @change="onChangeHandler"
  >
    <option
      v-for="language in languages"
      :key="language.id"
      :value="language.id"
      :selected="languageIdChain === language.id"
      :label="getLanguageName(language)"
    >
      {{ getLanguageName(language) }}
    </option>
  </select>
</template>
