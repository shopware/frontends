<script setup lang="ts">
import type { Schemas } from "#shopware";
import { getProductRoute } from "@shopware-pwa/helpers-next";

const props = withDefaults(
  defineProps<{
    allowRedirect?: boolean;
  }>(),
  {
    allowRedirect: true,
  },
);

const emit = defineEmits<{
  (e: "change", selected: Schemas["Product"]): void;
}>();

const isLoading = ref<boolean>();
const router = useRouter();
const {
  handleChange,
  getOptionGroups,
  getSelectedOptions,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const onHandleChange = async () => {
  isLoading.value = true;
  const variantFound = await findVariantForSelectedOptions(
    getSelectedOptions.value,
  );
  const selectedOptionsVariantPath = getProductRoute(variantFound);
  if (props.allowRedirect && selectedOptionsVariantPath) {
    try {
      router.push(selectedOptionsVariantPath);
    } catch (error) {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  } else {
    if (variantFound) emit("change", variantFound);
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="flex relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-end z-10 bg-white/75"
    >
      <div
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-secondary-500"
      />
    </div>
    <div
      v-for="optionGroup in getOptionGroups"
      :key="optionGroup.id"
      class="mt-6"
    >
      <h3 class="text-sm text-secondary-900 font-medium">
        {{ optionGroup.name }}
      </h3>
      <fieldset class="mt-4 flex-1">
        <legend class="sr-only">
          {{ $t("product.choose") }} {{ optionGroup.name }}
        </legend>
        <div class="flex gap3">
          <label
            v-for="option in optionGroup.options"
            :key="option.id"
            data-testid="product-variant"
            class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-secondary-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-secondary-900 cursor-pointer"
            :class="{
              'border-3 border-indigo-600': isOptionSelected(option.id),
            }"
            @click="handleChange(optionGroup.name, option.id, onHandleChange)"
          >
            <p
              :id="`${option.id}-choice-label`"
              data-testid="product-variant-text"
            >
              {{ option.name }}
            </p>
          </label>
        </div>
      </fieldset>
    </div>
  </div>
</template>
