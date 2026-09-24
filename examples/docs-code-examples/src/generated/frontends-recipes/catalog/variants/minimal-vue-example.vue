<script setup lang="ts">
import {
  buildUrlPrefix,
  getProductRoute,
  getTranslatedProperty,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product, configurator } = defineProps<{
  product: Schemas["Product"];
  // optional on ProductDetailResponse, so optional here
  configurator?: Schemas["PropertyGroup"][];
}>();

useProduct(product, configurator);

const {
  getOptionGroups,
  getSelectedOptions,
  handleChange,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const router = useRouter();
const { getUrlPrefix } = useUrlResolver();

const isResolving = ref(false);
const resolveMessage = ref("");

const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const selectOption = (group: Schemas["PropertyGroup"], optionId: string) =>
  handleChange(getTranslatedProperty(group, "name"), optionId);

const resolveVariant = async () => {
  if (isResolving.value) return;

  resolveMessage.value = "";
  isResolving.value = true;

  try {
    const variant = await findVariantForSelectedOptions();

    if (!variant) {
      resolveMessage.value = "We could not load that combination. Try again.";
      return;
    }

    const failure = await router.push(
      buildUrlPrefix(getProductRoute(variant), getUrlPrefix()),
    );

    if (failure) resolveMessage.value = "We could not open that variant.";
  } catch {
    resolveMessage.value = "We could not open that variant.";
  } finally {
    isResolving.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="resolveVariant">
    <p v-if="resolveMessage" role="alert">{{ resolveMessage }}</p>

    <fieldset
      v-for="group in getOptionGroups"
      :key="group.id"
      :aria-busy="isResolving"
    >
      <legend>{{ getTranslatedProperty(group, "name") }}</legend>

      <label v-for="option in group.options ?? []" :key="option.id">
        <input
          type="radio"
          :name="group.id"
          :value="option.id"
          :checked="isOptionSelected(option.id)"
          @change="selectOption(group, option.id)"
        />
        {{ getTranslatedProperty(option, "name") }}
      </label>
    </fieldset>

    <button type="submit" :aria-disabled="isResolving">
      Show this variant
    </button>

    <p v-if="isResolving" role="status">Resolving the selected variant…</p>
  </form>
</template>
