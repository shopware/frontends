<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { useCmsTranslations } from "@shopware/composables";
import { useVuelidate } from "@vuelidate/core";
import type { ValidationRuleWithoutParams } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { defu } from "defu";
import { computed, reactive, ref } from "vue";
import { useShopwareContext } from "#imports";

const props = defineProps<{
  productId: string;
}>();

const emit = defineEmits<{
  success: [];
}>();

type Translations = {
  product: {
    addReview: string;
    reviewsForm: {
      title: string;
      titlePlaceholder: string;
      review: string;
      reviewPlaceholder: string;
      submit: string;
      rating: string;
    };
  };
};

let translations: Translations = {
  product: {
    addReview: "Add review",
    reviewsForm: {
      title: "Title",
      titlePlaceholder: "Enter a title for your review",
      review: "Your review",
      reviewPlaceholder:
        "Share your experience with this product (minimum 40 characters)",
      submit: "Submit",
      rating: "Your rating",
    },
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

type State = {
  rating: number | null;
  title: string;
  review: string;
};

const state = reactive<State>({
  rating: null,
  title: "",
  review: "",
});

const isLoading = ref(false);
const errorMessages = ref<ApiError[]>([]);

const rules = computed(() => ({
  rating: {
    required: required as ValidationRuleWithoutParams,
  },
  title: {
    required: required as ValidationRuleWithoutParams,
    minLength: minLength(5),
  },
  review: {
    required: required as ValidationRuleWithoutParams,
    minLength: minLength(40),
  },
}));

const { apiClient } = useShopwareContext();

const $v = useVuelidate(rules, state);

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

    // Reset form state after successful submission
    state.rating = null;
    state.title = "";
    state.review = "";
    $v.value.$reset();
    errorMessages.value = [];

    emit("success");
  } catch (error) {
    if (error instanceof ApiClientError) {
      errorMessages.value = error.details.errors;
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
  <form class="flex flex-col gap-4 relative" @submit.prevent="invokeSend">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-10 bg-surface-surface/80 rounded-md"
    >
      <div
        class="h-12 w-12 i-carbon-progress-bar-round animate-spin text-brand-primary"
      />
    </div>
    <div>
      <div class="flex flex-col gap-2">
        <h4 class="text-xl font-bold text-surface-on-surface mt-3">
          {{ translations.product.addReview }}
        </h4>
        <span class="text-surface-on-surface-variant">{{
          translations.product.reviewsForm.rating
        }}</span>
        <div class="flex flex-row gap-1">
          <SwStarIcon
            v-for="index in state.rating || 0"
            :key="`filled-${index}`"
            :filled="true"
            :size="20"
            class="cursor-pointer hover:opacity-80 transition-opacity"
            data-testid="review-filled-star"
            @click="invokeRating(index)"
          />
          <SwStarIcon
            v-for="index in 5 - (state.rating || 0)"
            :key="`empty-${index}`"
            :filled="false"
            :size="20"
            class="cursor-pointer hover:opacity-80 transition-opacity"
            data-testid="review-empty-star"
            @click="invokeRating((state.rating || 0) + index)"
          />
        </div>
        <span
          v-if="$v.rating.$error && $v.rating.$errors[0]?.$message"
          class="pt-1 text-sm text-states-error"
        >
          {{ $v.rating.$errors[0].$message }}
        </span>
      </div>
    </div>
    <div
      v-if="errorMessages.length"
      class="p-3 mb-4 bg-surface-surface-container border border-states-error rounded-md flex gap-3 items-start"
    >
      <div class="w-5 h-5 i-carbon-warning text-states-error flex-shrink-0 mt-0.5" />
      <div class="flex-1">
        <p v-for="(error, index) in errorMessages" :key="index" class="text-sm text-states-error">
          {{ error.detail }}
        </p>
      </div>
    </div>
    <div>
      <label
        for="title"
        class="block mb-2 text-sm font-medium text-surface-on-surface"
        >{{ translations.product.reviewsForm.title }}</label
      >
      <input
        id="title"
        v-model="state.title"
        class="block w-full px-3 py-2 border rounded-md text-surface-on-surface bg-surface-surface placeholder-surface-on-surface-variant focus:outline-none focus:ring-2 focus:ring-outline-outline"
        :class="[
          $v.title.$error
            ? 'border-states-error focus:ring-states-error'
            : 'border-outline-outline',
        ]"
        type="text"
        :placeholder="translations.product.reviewsForm.titlePlaceholder"
        :disabled="isLoading"
        data-testid="review-title-input"
        @blur="$v.title.$touch()"
      />
      <span
        v-if="$v.title.$error && $v.title.$errors[0]?.$message"
        class="pt-1 text-sm text-states-error"
      >
        {{ $v.title.$errors[0].$message }}
      </span>
    </div>
    <div>
      <label
        for="review"
        class="block mb-2 text-sm font-medium text-surface-on-surface"
        >{{ translations.product.reviewsForm.review }}</label
      >
      <textarea
        id="review"
        v-model="state.review"
        class="block w-full px-3 py-2 border rounded-md text-surface-on-surface bg-surface-surface placeholder-surface-on-surface-variant focus:outline-none focus:ring-2 focus:ring-outline-outline min-h-32"
        :class="[
          $v.review.$error
            ? 'border-states-error focus:ring-states-error'
            : 'border-outline-outline',
        ]"
        :placeholder="translations.product.reviewsForm.reviewPlaceholder"
        :disabled="isLoading"
        data-testid="review-text-input"
        @blur="$v.review.$touch()"
      />
      <span
        v-if="$v.review.$error && $v.review.$errors[0]?.$message"
        class="pt-1 text-sm text-states-error"
      >
        {{ $v.review.$errors[0].$message }}
      </span>
    </div>
    <BaseButton
      type="submit"
      variant="primary"
      size="medium"
      :disabled="isLoading"
      :loading="isLoading"
      block
      class="mt-4"
      data-testid="review-submit-button"
    >
      {{ translations.product.reviewsForm.submit }}
    </BaseButton>
  </form>
</template>
