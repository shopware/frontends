<script setup lang="ts">
const { languages, changeLanguage } = useInternationalization();
const { languageId, languageIdChain } = useSessionContext();

const onChangeHandler = (option) => {
  changeLanguage(option.target.value);
};
</script>
<template>
  [ {{ languageId }} - {{ languageIdChain }} ]
  <select @change="onChangeHandler">
    <option
      v-for="language in languages"
      :key="language.id"
      :value="language.id"
      :selected="languageIdChain === language.id"
    >
      {{ language.translationCode.translated.name }} -
      {{ language.translationCode.code }} - {{ languageId === language.id }} -
      {{ language.id }}
    </option>
  </select>
</template>
