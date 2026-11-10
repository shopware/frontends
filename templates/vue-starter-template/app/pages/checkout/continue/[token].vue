<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

// A UCP continue_url lands here. Nothing changes until the buyer submits the
// form: the POST route then adopts the agent's cart as this browser's session.
const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { isLoggedIn } = useUser();
const { isEmpty } = useCart();

if (!useRuntimeConfig().public.agenticHandoff.enabled) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    fatal: true,
  });
}

const token = String(route.params.token ?? "");

useHead({
  meta: [
    { name: "referrer", content: "no-referrer" },
    { name: "robots", content: "noindex, nofollow" },
  ],
});
</script>
<template>
  <div class="container mx-auto px-6 sm:px-4 max-w-2xl py-16 text-center">
    <h1 class="text-10 my-10 font-['Noto_Serif']">
      {{ $t("cart.handoff.title") }}
    </h1>
    <p class="text-lg text-surface-on-surface">
      {{ $t("cart.handoff.description") }}
    </p>
    <p v-if="isLoggedIn || !isEmpty" class="mt-4 text-surface-on-surface">
      {{
        $t(
          isLoggedIn
            ? "cart.handoff.replacesSession"
            : "cart.handoff.replacesCart",
        )
      }}
    </p>
    <form
      method="post"
      :action="`/checkout/continue/${token}`"
      class="mt-10 flex flex-col sm:flex-row justify-center gap-4"
    >
      <button
        type="submit"
        class="bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded-md"
      >
        {{ $t("cart.handoff.continue") }}
      </button>
      <NuxtLink
        :to="formatLink('/checkout/cart')"
        class="border-1 border-brand-primary text-brand-primary text-center font-bold leading-6 py-3 px-4 rounded-md"
      >
        {{ $t("cart.handoff.keepCart") }}
      </NuxtLink>
    </form>
  </div>
</template>
