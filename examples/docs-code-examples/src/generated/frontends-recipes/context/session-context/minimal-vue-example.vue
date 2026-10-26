<script setup lang="ts">
const {
  sessionContext,
  currency,
  taxState,
  countryId,
  activeShippingAddress,
  userFromContext,
  setCountry,
  refreshSessionContext,
} = useSessionContext();

const isSwitching = ref(false);
const contextError = ref("");

const priceLabel = computed(() => {
  if (taxState.value === "gross") return "including tax";
  if (taxState.value === "net") return "excluding tax";
  return "tax free";
});

const switchCountry = async (id?: string) => {
  if (!id) return;

  contextError.value = "";
  isSwitching.value = true;

  try {
    await setCountry(id);
  } catch {
    contextError.value = "The country change could not be confirmed.";
    await refreshSessionContext();
  } finally {
    isSwitching.value = false;
  }
};
</script>

<template>
  <p v-if="!sessionContext">Loading the session…</p>

  <div v-else>
    <p v-if="contextError">{{ contextError }}</p>

    <dl>
      <dt>Currency</dt>
      <dd>
        <ClientOnly>{{ currency?.isoCode }}</ClientOnly>
      </dd>

      <dt>Prices</dt>
      <dd>{{ priceLabel }}</dd>

      <dt>Shipping country</dt>
      <dd>{{ sessionContext.shippingLocation?.country?.name }}</dd>

      <dt>Shipping address</dt>
      <dd v-if="activeShippingAddress">
        {{ activeShippingAddress.street }}, {{ activeShippingAddress.city }}
      </dd>
      <dd v-else>not selected yet</dd>

      <dt>Customer</dt>
      <dd>
        <ClientOnly>{{ userFromContext?.email ?? "guest" }}</ClientOnly>
      </dd>
    </dl>

    <button
      type="button"
      :disabled="isSwitching || !countryId"
      @click="switchCountry(countryId)"
    >
      {{ isSwitching ? "Switching…" : "Re-apply the current country" }}
    </button>
  </div>
</template>
