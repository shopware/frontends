<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";
import { defu } from "defu";
import { type Ref, computed, onMounted, ref } from "vue";
import xss from "xss";
import { useProduct } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();

type Translations = {
  product: {
    description: string;
    reviews: string;
    messages: {
      reviewAdded: string;
    };
  };
};

let translations: Translations = {
  product: {
    description: "Description",
    reviews: "Reviews",
    messages: {
      reviewAdded: "Thank you for submitting your review",
    },
  },
};
translations = defu(useCmsTranslations(), translations) as Translations;

const openSections = ref<Set<number>>(new Set([1]));
const { product } = useProduct(props.content.data?.product);

const description = computed(() =>
  xss(getTranslatedProperty(product.value, "description")),
);

const toggleSection = (sectionNumber: number) => {
  if (openSections.value.has(sectionNumber)) {
    openSections.value.delete(sectionNumber);
  } else {
    openSections.value.add(sectionNumber);
  }
};

const isSectionOpen = (sectionNumber: number) => {
  return openSections.value.has(sectionNumber);
};

const reviews: Ref<Schemas["ProductReview"][]> = ref([]);

onMounted(async () => {
  if (props.content.data?.reviews?.elements) {
    reviews.value = props.content.data.reviews.elements;
  }
});
</script>

<template>
  <div class="w-full self-stretch inline-flex flex-col justify-start items-start gap-4">
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(1)">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal">
            {{ translations.product.description }}
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(1) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(1)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch justify-start text-surface-on-surface text-base font-normal font-['Inter'] leading-normal">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="description"></div>
        </div>
      </div>
    </Transition>
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(2)">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal">
            {{ translations.product.reviews }} ({{ reviews.length }})
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(2) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(2)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch justify-start text-surface-on-surface text-base font-normal font-['Inter'] leading-normal">
          <div v-if="reviews.length === 0" class="text-center py-4">
            No reviews yet
          </div>
          <div v-else>
            <div v-for="review in reviews" :key="review.id"
              class="mb-4 p-4 border border-outline-outline-variant rounded">
              <div class="font-semibold">{{ review.title }}</div>
              <div class="text-sm text-surface-on-surface-variant">
                {{ review.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(3)">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal">
            Category
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(3) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(3)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch justify-start text-surface-on-surface text-base font-normal font-['Inter'] leading-normal">
          <div v-if="product?.categories">
            <div v-for="category in product.categories" :key="category.id" class="mb-2">
              {{ category.name }}
            </div>
          </div>
          <div v-else>
            No categories available
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}
</style>
