<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";
import { customValidators } from "@/i18n/utils/i18n-validators";

type State = {
  rating: number | null;
  title: string;
  review: string;
};

const props = defineProps<{
  productId: string;
}>();

const state = reactive<State>({
  rating: null,
  title: "",
  review: "",
});

const isLoading = ref(false);
const reviewAdded = ref(false);

const rules = computed(() => ({
  rating: {
    required,
  },
  title: {
    required,
    minLength: minLength(5),
  },
  review: {
    required,
    minLength: minLength(40),
  },
}));

const { apiClient } = useShopwareContext();
const { resolveApiErrors } = useApiErrorsResolver();
const { pushError } = useNotifications();
const { required, minLength } = customValidators();

const $v = useVuelidate(rules, state);

const emits = defineEmits<{
  (e: "success"): void;
}>();

const invokeSend = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();

  if (!valid) {
    return;
  }

  try {
    isLoading.value = true;
    await apiClient.invoke(
      "saveProductReview post /product/{productId}/review",
      {
        pathParams: {
          productId: props.productId,
        },
        body: {
          title: state.title,
          content: state.review,
          points: state.rating || 0,
        },
      },
    );
    reviewAdded.value = true;
    emits("success");
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      errors.forEach((error) => pushError(error));
    }
  } finally {
    isLoading.value = false;
  }
};

const invokeRating = (value: number) => {
  state.rating = value;
};
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="invokeSend">
    <div>
      <div class="flex flex-col gap-2">
        <h4 class="text-xl font-bold dark:text-white mt-3">
          {{ $t("product.addReview") }}
        </h4>
        <span>{{ $t("product.reviewsForm.rating") }}</span>
        <div class="flex flex-row">
          <div
            v-for="(value, index) in state.rating"
            :key="index"
            class="w-5 h-5 i-carbon-star-filled"
            data-testid="review-filled-star"
            @click="invokeRating(value)"
          ></div>
          <div
            v-for="(value, index) in 5 - (state.rating || 0)"
            :key="index"
            class="w-5 h-5 i-carbon-star"
            data-testid="review-empty-star"
            @click="invokeRating(value + (state.rating || 0))"
          ></div>
        </div>
        <span
          v-if="$v.rating.$error"
          class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
        >
          {{ $v.rating.$errors[0].$message }}
        </span>
      </div>
    </div>
    <div>
      <label for="title">{{ $t("product.reviewsForm.title") }}</label>
      <input
        id="title"
        v-model="state.title"
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        :disabled="isLoading"
        data-testid="review-title-input"
      />
      <span
        v-if="$v.title.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ $v.title.$errors[0].$message }}
      </span>
    </div>
    <div>
      <label for="review">{{ $t("product.reviewsForm.review") }}</label>
      <textarea
        id="review"
        v-model="state.review"
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :disabled="isLoading"
        data-testid="review-text-input"
      />
      <span
        v-if="$v.review.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ $v.review.$errors[0].$message }}
      </span>
    </div>
    <button
      class="bg-sky-400 text-white mt-4 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-sky-500"
      type="submit"
      :disabled="isLoading"
      data-testid="review-submit-button"
    >
      {{ $t("product.reviewsForm.submit") }}
    </button>
  </form>
</template>
