<script setup lang="ts">
import { Product } from "@shopware-pwa/types";
import { ComputedRef } from "vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

const props = withDefaults(
  defineProps<{
    allowRedirect?: boolean;
    product: Product;
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
const selectedVariant = ref<any>(getSelectedOptions);

const selectedOptions: ComputedRef<any> = computed(() =>
  Object.values(unref(getSelectedOptions))
);

const onHandleChange = async () => {
  isLoading.value = true;
  const variantFound = await findVariantForSelectedOptions(
    unref(selectedOptions)
  );
  const selectedOptionsVariantPath = variantFound?.seoUrls?.[0]?.seoPathInfo;
  if (props.allowRedirect && selectedOptionsVariantPath) {
    try {
      router.replace({
        path: "/" + selectedOptionsVariantPath,
        query: {
          preventScroll: 1
        }
      });
    } catch (error) {
      console.error("incorrect URL", selectedOptionsVariantPath);
    }
  } else {
    emit("change", variantFound);
  }
  isLoading.value = false;
};

const getSelectPropertiesName = (name: string) => {
  const activeValue = selectedVariant.value[name];
  const variant = getOptionGroups.value.find((item) => item.name === name);
  const options = variant?.options ?? [];
  const selectedOption = options.find((option) => option.id === activeValue);
  return selectedOption?.name ?? '';
}
</script>

<template>
  <div class="flex flex-col">
<!--    <div-->
<!--      v-if="isLoading"-->
<!--      class="fixed inset-0 flex items-center justify-center z-10 bg-white/75"-->
<!--    >-->
<!--      <div-->
<!--        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"-->
<!--      />-->
<!--    </div>-->
    <div
      v-for="optionGroup in getOptionGroups"
      :key="optionGroup.id"
    >
      <div class="mb-6">
        <div class="flex justify-between mb-4">
          <h2 class="text-base font-medium ">{{ optionGroup.name }}: {{ getSelectPropertiesName(optionGroup.name) }}</h2>
          <!-- <a v-if="optionGroup.id === '75f353b589d04bf48e8a9ab1f5422b0e'" class="underline font-medium underline-offset-4 cursor-pointer">Size guide</a> -->
        </div>
        <RadioGroup v-if="optionGroup.displayType === 'color'" v-model="selectedVariant[optionGroup.name]">
          <RadioGroupLabel class="sr-only"> Choose a color </RadioGroupLabel>
          <div class="flex items-center space-x-3">
            <RadioGroupOption @click="handleChange(optionGroup.name, color.id, onHandleChange)" as="template" v-for="color in optionGroup.options" :key="color.id" :value="color.id" v-slot="{ active, checked }">
              <div :class="[checked ? 'ring-2 ring-offset-1 ring-gray-500' : '', 'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none']">
                <RadioGroupLabel as="span" class="sr-only"> {{ color.name }} </RadioGroupLabel>
                <span aria-hidden="true" :class="['h-8 w-8 rounded-full border border-black border-opacity-25']" :style="{ backgroundColor: `${color.colorHexCode}` }" />
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
        <RadioGroup v-if="optionGroup.displayType === 'text'" v-model="selectedVariant[optionGroup.name]">
          <RadioGroupLabel class="sr-only"> Choose a size </RadioGroupLabel>
          <div class="flex gap-4">
            <RadioGroupOption @click="handleChange(optionGroup.name, size.id, onHandleChange)" as="template" v-for="size in optionGroup.options" :key="size.id" :value="size.id" :disabled="false" v-slot="{ active, checked }">
              <div :class="[true ? 'cursor-pointer bg-white text-gray-900' : 'cursor-not-allowed bg-gray-50 text-gray-200', 'group relative flex items-center justify-center py-3.25 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none flex-1 md:max-w-[85px] md:py-6 md:px-0']">
                <RadioGroupLabel class="text-gray-700" as="span">{{ size.name }}</RadioGroupLabel>
                <span v-if="true" :class="[checked ? 'ring-2 ring-gray-500 border-transparent' : 'border-gray-300', 'shadow-sm border pointer-events-none absolute -inset-px']" aria-hidden="true" />
                <span v-else aria-hidden="true" class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                  <svg class="absolute inset-0 h-full w-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                    <line x1="0" y1="100" x2="100" y2="0" vector-effect="non-scaling-stroke" />
                  </svg>
                </span>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>
