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
        productId: props.productId,
        title: state.title,
        content: state.review,
        points: state.rating,
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
  <form @submit.prevent="invokeSend" class="flex flex-col gap-4">
    <div>
      <div class="mt-2 flex flex-col gap-2">
        <span>{{ $t("product.reviewsForm.rating") }}</span>
        <div class="flex flex-row">
          <div
            v-for="value in state.rating"
            @click="invokeRating(value)"
            class="w-5 h-5 i-carbon-star-filled"
          ></div>
          <div
            v-for="value in 5 - (state.rating || 0)"
            @click="invokeRating(value + (state.rating || 0))"
            class="w-5 h-5 i-carbon-star"
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
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        id="title"
        :disabled="isLoading"
        v-model="state.title"
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
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id="review"
        :disabled="isLoading"
        v-model="state.review"
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
    >
      {{ $t("product.reviewsForm.submit") }}
    </button>
  </form>
</template>
