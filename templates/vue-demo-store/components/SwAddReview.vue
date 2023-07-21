<script setup lang="ts">
import { Product } from "@shopware-pwa/types";
import { maxValue, minValue, numeric, required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { StarIcon } from "@heroicons/vue/24/solid";
import { ReviewStar } from '~/models/enum';

const props = defineProps<{
  product: Product;
  data?: any;
  editMode?: boolean;
}>();
const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "submit"): void;
}>();
const { product } = toRefs(props);
const loading = ref();
const { addReview } = useProductReviews(product);

const rating = ref<number>(5);

const state = reactive({
  id: "",
  title: "",
  content: "",
  points: 5,
});

const rules = computed(() => ({
  title: {
    required,
    minLength: minLength(5),
  },
  content: {
    required,
    minLength: minLength(40),
  },
  points: {
    required,
    numeric,
    minValue: minValue(1),
    maxValue: maxValue(5),
  },
}));

watch(props.data, (val) => {
  if (val) {
    const { title, content, points, id } = val;
    if (props.editMode) {
      state.id = id;
    }
    state.title = title;
    state.content = content;
    state.points = points;
  }
}, {
  immediate: true
});

const $v = useVuelidate(rules, state);

const onSelectRating = (value: number, type: string = "") => {
  if (type === "selected") {
    rating.value = value;
  } else {
    rating.value += value;
  }
  state.points = rating.value;
};

const onCancel = () => {
  emits('cancel');
}

const onAddReview = async (): Promise<void> => {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    loading.value = true;
    try {
      const result = await addReview(state);
      emits('submit');
    } catch (e) {
      console.error("error add review", e);
    } finally {
      loading.value = false;
    }
  } else {
    return;
  }
};
</script>

<template>
  <div class="space-y-8">
    <form class="space-y-6" @submit.prevent="onAddReview">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-500 dark:text-white">
          {{ $t('your_rating') }}*
        </label>
        <div class="flex gap-2">
          <div class="flex items-center">
            <StarIcon
              v-for="value in rating"
              class="w-4 h-4 text-black cursor-pointer"
              @click="() => onSelectRating(value, 'selected')"
            />
            <StarIcon
              v-for="value in 5 - rating"
              class="w-4 h-4 text-gray-300 cursor-pointer"
              @click="() => onSelectRating(value)"
            />
          </div>
          <span class="font-medium">{{ $t(ReviewStar[state.points]) }}</span>
        </div>
      </div>
      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div class="flex flex-col gap-2">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
            :class="{
              'text-red-600': $v.title.$error
            }"
          >
            {{ $t('title') }}*
          </label>
          <input
            id="title"
            v-model="state.title"
            name="title"
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
            :class="{
              'border-red-600': $v.title.$error
            }"
          />
          <span
            v-if="$v.title.$error"
            class="block pt-2 text-sm text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.title.$errors[0].$message }}
          </span>
        </div>
        <div class="flex flex-col gap-2">
          <label
            for="content"
            class="block text-sm font-medium text-gray-500 dark:text-white"
            :class="{
              'text-red-600': $v.content.$error
            }"
          >
            {{ $t('your_review') }}*
          </label>
          <textarea
            id="content"
            v-model="state.content"
            name="content"
            rows="5"
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
            :class="{
              'border-red-600': $v.content.$error
            }"
          />
          <span
            v-if="$v.content.$error"
            class="text-sm text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.content.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="flex gap-4 justify-end">
        <button
          class="group relative w-20 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          type="button"
          @click="onCancel"
          :disabled="loading"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="group relative w-20 flex justify-center py-2 px-4 disabled:opacity-50 border border-transparent text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          type="submit"
          :disabled="loading"
        >
          {{ $t('submit') }}
        </button>
      </div>
    </form>
  </div>
</template>
