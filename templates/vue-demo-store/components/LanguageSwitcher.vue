<script setup lang="ts">
const { languages, changeLanguage } = useInternationalization();

const onChangeHandler = (option) => {
  changeLanguage(option.target.value);
};
</script>
<template>
  <select @change="onChangeHandler">
    <option
      v-for="language in languages"
      :key="language.id"
      :value="language.id"
    >
      {{ language.translationCode.translated.name }} -
      {{ language.translationCode.code }}
    </option>
  </select>
</template>
