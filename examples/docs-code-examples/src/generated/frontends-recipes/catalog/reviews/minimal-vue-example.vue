<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { productReviews, loadProductReviews, addReview } = useProductReviews(
  toRef(() => product),
);
const { isLoggedIn } = useUser();

const PER_PAGE = 10;

const total = ref(0);
const currentPage = ref(1);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref("");
const submitError = ref("");
const hasSubmitted = ref(false);

const form = reactive({ title: "", content: "", points: 5 });

const totalPages = computed(() => Math.ceil(total.value / PER_PAGE));

const loadReviews = async (page: number) => {
  loadError.value = "";
  isLoading.value = true;

  try {
    const result = await loadProductReviews({
      limit: PER_PAGE,
      page,
      "total-count-mode": "exact",
    });
    total.value = result.total ?? 0;
    currentPage.value = page;
  } catch (error) {
    console.error(error);
    loadError.value = "The reviews could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (page: number) => {
  if (isLoading.value) return;
  loadReviews(page);
};

onMounted(() => loadReviews(1));

const submitReview = async () => {
  if (isSubmitting.value) return;

  submitError.value = "";
  hasSubmitted.value = false;
  isSubmitting.value = true;

  try {
    await addReview(form);
    hasSubmitted.value = true;
    form.title = "";
    form.content = "";
    form.points = 5;

    await loadReviews(1);

    if (loadError.value) {
      loadError.value =
        "Your review was submitted, but the list could not be refreshed.";
    }
  } catch (error) {
    console.error(error);

    const alreadyReviewed =
      error instanceof ApiClientError &&
      error.details?.errors?.some(
        (apiError: { code?: string }) =>
          apiError.code === "VIOLATION::ENTITY_EXISTS",
      );

    submitError.value = alreadyReviewed
      ? "You have already reviewed this product."
      : "Your review could not be submitted.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section>
    <h2>Reviews</h2>

    <p v-if="product.ratingAverage != null">
      {{ product.ratingAverage.toFixed(1) }} out of 5
    </p>

    <div aria-live="polite" :aria-busy="isLoading">
      <p v-if="isLoading">Loading reviews…</p>

      <div v-else-if="loadError" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" @click="loadReviews(currentPage)">
          Try again
        </button>
      </div>

      <p v-else-if="!productReviews.length">This product has no reviews yet.</p>

      <ol v-else>
        <li v-for="review in productReviews" :key="review.id">
          <h3>{{ review.title }}</h3>
          <p v-if="!review.status">Your review has not been approved yet.</p>
          <p>{{ review.points ?? 0 }} out of 5</p>
          <p>{{ review.content }}</p>
          <p v-if="review.externalUser">{{ review.externalUser }}</p>
          <p v-if="review.comment">Shop reply: {{ review.comment }}</p>
        </li>
      </ol>
    </div>

    <nav v-if="totalPages > 1" aria-label="Reviews pagination">
      <button
        type="button"
        :disabled="isLoading || currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        type="button"
        :disabled="isLoading || currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </section>

  <section v-if="isLoggedIn">
    <h2>Write a review</h2>

    <p v-if="hasSubmitted" role="status">
      Thank you. Your review will appear to everyone once it has been approved.
    </p>

    <form v-else @submit.prevent="submitReview">
      <p v-if="submitError" role="alert">{{ submitError }}</p>

      <label>
        Rating
        <select v-model.number="form.points">
          <option
            v-for="points in [5, 4, 3, 2, 1]"
            :key="points"
            :value="points"
          >
            {{ points }}
          </option>
        </select>
      </label>

      <label>
        Title
        <input v-model="form.title" type="text" required />
      </label>

      <label>
        Your review
        <textarea v-model="form.content" required />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Submitting…" : "Submit my review" }}
      </button>
    </form>
  </section>

  <p v-else>Sign in to write a review.</p>
</template>
