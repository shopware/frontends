<script setup lang="ts">
import { ComputedRef } from "vue";

const props = withDefaults(
  defineProps<{
    allowRedirect?: boolean;
  }>(),
  {
    allowRedirect: false,
  }
);

const emit = defineEmits<{
  (e: "change", selected: any): void;
}>();
const isLoading = ref<boolean>();
const router = useRouter();
const {
  handleChange,
  getOptionGroups,
  getSelectedOptions,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const selectedOptions: ComputedRef<any> = computed(() =>
  Object.values(unref(getSelectedOptions))
);
const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const onHandleChange = async () => {
  isLoading.value = true;
  const variantFound = await findVariantForSelectedOptions(
    unref(selectedOptions)
  );
  const selectedOptionsVariantPath = variantFound?.seoUrls?.[0]?.seoPathInfo;
  if (props.allowRedirect && selectedOptionsVariantPath) {
    try {
      router.push("/" + selectedOptionsVariantPath);
    } catch (error) {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  } else {
    emit("change", variantFound);
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
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
      />
    </div>
    <div
      v-for="optionGroup in getOptionGroups"
      :key="optionGroup.id"
      class="mt-6"
    >
      <h3 class="text-sm text-gray-900 font-medium">{{ optionGroup.name }}</h3>
      <fieldset class="mt-4 flex-1">
        <legend class="sr-only">Choose a {{ optionGroup.name }}</legend>
        <div class="flex">
          <label
            data-testid="product-variant"
            class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer"
            :class="{
              'border-3 border-indigo-600': isOptionSelected(option.id),
            }"
            v-for="option in optionGroup.options"
            :key="option.id"
            @click="handleChange(optionGroup.name, option.id, onHandleChange)"
          >
            <p
              data-testid="product-variant-text"
              :id="`${option.id}-choice-label`"
            >
              {{ option.name }}
            </p>
          </label>
        </div>
      </fieldset>
    </div>
  </div>
</template>
