<script setup lang="ts">
import { getLanguageName, getTranslatedProperty } from "@shopware/helpers";

const { languages, getLanguageCodeFromId } = useInternationalization();
const { sessionContext, currentSessionLanguageID } = useSessionContext();

const language = computed(() =>
  languages.value.find((l) => currentSessionLanguageID.value === l.id),
);

const onChangeHandler = async (option: Event) => {
  const id = (option.target as HTMLSelectElement).value;
  const code = getLanguageCodeFromId(id);

  navigateTo(`/${code}`, {
    external: true,
  });
};
</script>

<template>
  <div>
    <ul>
      <li>
        Language: {{ language ? getLanguageName(language) : currentSessionLanguageID }}
      </li>
      <li>
        Sales channel:
        {{ getTranslatedProperty(sessionContext?.salesChannel, "name") }}
      </li>
    </ul>

    <select aria-label="Select language" @change="onChangeHandler">
      <option
        v-for="language in languages"
        :key="language.id"
        :value="language.id"
        :selected="currentSessionLanguageID === language.id"
        :label="getLanguageName(language)"
      >
        {{ getLanguageName(language) }}
      </option>
    </select>
  </div>
</template>
