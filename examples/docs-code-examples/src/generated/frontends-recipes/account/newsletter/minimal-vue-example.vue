<script setup lang="ts">
const { user, isLoggedIn } = useUser();
const {
  newsletterSubscribe,
  newsletterUnsubscribe,
  getNewsletterStatus,
  newsletterStatus,
  isNewsletterSubscriber,
  confirmationNeeded,
  SUBSCRIBE_KEY,
} = useNewsletter();

const email = ref("");
const isSubmitting = ref(false);
const isLoadingStatus = ref(false);
const newsletterError = ref("");
const errorId = useId();

const subscriberEmail = computed(() =>
  isLoggedIn.value ? (user.value?.email ?? "") : email.value,
);

const loadStatus = async () => {
  // The account route answers for the logged-in customer only.
  if (!isLoggedIn.value) return;

  isLoadingStatus.value = true;

  try {
    await getNewsletterStatus();
  } catch {
    newsletterError.value = "The newsletter status could not be loaded.";
  } finally {
    isLoadingStatus.value = false;
  }
};

const subscribe = async () => {
  newsletterError.value = "";
  isSubmitting.value = true;

  try {
    // storefrontUrl is added by the composable, never by the form.
    // The response status is written to newsletterStatus, so no reload here.
    await newsletterSubscribe({
      email: subscriberEmail.value,
      option: SUBSCRIBE_KEY,
    });
  } catch {
    newsletterError.value = "The subscription could not be saved.";
  } finally {
    isSubmitting.value = false;
  }
};

const unsubscribe = async () => {
  newsletterError.value = "";
  isSubmitting.value = true;

  try {
    await newsletterUnsubscribe(subscriberEmail.value);
    // newsletterUnsubscribe resolves with void and leaves newsletterStatus
    // untouched, so read the status again for a logged-in customer.
    await loadStatus();
  } catch {
    newsletterError.value = "The subscription could not be removed.";
  } finally {
    isSubmitting.value = false;
  }
};

// Immediate watcher instead of onMounted: it also runs when the customer
// signs in without a page change, for example through the login modal.
watch(
  isLoggedIn,
  (loggedIn) => {
    if (!loggedIn) {
      newsletterStatus.value = "undefined";
      newsletterError.value = "";
      email.value = "";
      return;
    }

    loadStatus();
  },
  { immediate: import.meta.client },
);
</script>

<template>
  <section>
    <h2>Newsletter</h2>

    <p v-if="newsletterError" :id="errorId" role="alert">
      {{ newsletterError }}
    </p>

    <form v-if="!isLoggedIn" @submit.prevent="subscribe">
      <label>
        Email
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="newsletterError ? true : undefined"
          :aria-describedby="newsletterError ? errorId : undefined"
        />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Sending..." : "Subscribe" }}
      </button>

      <p v-if="confirmationNeeded" role="status">
        Check your inbox and confirm the subscription through the link we sent.
      </p>
    </form>

    <template v-else>
      <p v-if="isLoadingStatus && !isSubmitting" role="status">
        Loading subscription status...
      </p>

      <template v-else>
        <p v-if="confirmationNeeded" role="status">
          Your subscription is waiting for the confirmation link sent to
          {{ user?.email }}.
        </p>

        <button
          v-if="isNewsletterSubscriber"
          type="button"
          :disabled="isSubmitting"
          @click="unsubscribe()"
        >
          Unsubscribe
        </button>

        <button
          v-else
          type="button"
          :disabled="isSubmitting"
          @click="subscribe()"
        >
          Subscribe
        </button>
      </template>
    </template>
  </section>
</template>
