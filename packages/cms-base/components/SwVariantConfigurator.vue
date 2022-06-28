<script setup lang="ts">
const props = defineProps({
  product: Object,
});
const router = useRouter();
const {
  handleChange,
  getOptionGroups,
  getSelectedOptions,
  findVariantForSelectedOptions,
} = useProductConfigurator({ product: props.product });

const selectedOptions = computed(() =>
  Object.values(unref(getSelectedOptions))
);
const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);
const redirectToSelectedVariantUrl = async () => {
  const selectedOption = await findVariantForSelectedOptions(
    unref(selectedOptions)
  );
  const selectedOptionsVariantPath = selectedOption?.seoUrls?.[0]?.seoPathInfo;
  if (selectedOptionsVariantPath) {
    try {
      router.push("/" + selectedOptionsVariantPath);
    } catch (error) {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  }
};
</script>

<template>
  <div
    v-for="optionGroup in getOptionGroups"
    :key="optionGroup.id"
    class="mt-6"
  >
    <h3 class="text-sm text-gray-900 font-medium">{{ optionGroup.name }}</h3>
    <fieldset class="mt-4">
      <legend class="sr-only">Choose a {{ optionGroup.name }}</legend>
      <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
        <label
          class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer"
          v-for="option in optionGroup.options"
          :key="option.id"
          @click="
            handleChange(
              optionGroup.name,
              option.id,
              redirectToSelectedVariantUrl
            )
          "
        >
          <input
            type="radio"
            :name="`${option.id}-choice`"
            :value="option.name"
            class="sr-only"
            :aria-labelledby="`${option.id}-choice-label`"
          />
          <p :id="`${option.id}-choice-label`">{{ option.name }}</p>
          <div
            class="absolute -inset-px rounded-md pointer-events-none"
            :class="{ 'border border-cyan-600': isOptionSelected(option.id) }"
          ></div>
        </label>
      </div>
    </fieldset>
  </div>
</template>
