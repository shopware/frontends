<script setup lang="ts">
import {
  getLanguageName,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";

const { languages, getLanguageCodeFromId } = useInternationalization();
const { sessionContext, languageIdChain } = useSessionContext();

const language = computed(() =>
  languages.value.find((l) => languageIdChain.value === l.id),
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
        Language: {{ language ? getLanguageName(language) : languageIdChain }}
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
        :selected="languageIdChain === language.id"
        :label="getLanguageName(language)"
      >
        {{ getLanguageName(language) }}
      </option>
    </select>
  </div>
</template>
