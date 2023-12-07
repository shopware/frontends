<script setup lang="ts">
import { useMollieCreditCard, useMollie, onMounted } from "#imports";
import { MollieLocale } from "../../types";

const props = defineProps<{
  locale?: MollieLocale;
  submitButtonLabel?: string;
  submitDisabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "submit", token: string | undefined): void;
  (e: "error", error: string | undefined): void;
}>();

const { init, getToken } = useMollie({ locale: props.locale });
const { mount } = useMollieCreditCard({
  elementId: "mollie-credit-card-container",
});

const onCreditCardSubmit = async () => {
  try {
    const token = await getToken();
    emits("submit", token);
  } catch (error) {
    emits("error", error as string);
  }
};

onMounted(async () => {
  await init();
  await mount();
});
</script>
<template>
  <div class="mollie-credit-card">
    <div id="mollie-credit-card-container"></div>
    <button
      :disabled="submitDisabled"
      class="mollie-credit-card__submit-button"
      :class="{ 'button-disabled': submitDisabled }"
      @click="onCreditCardSubmit"
    >
      {{ submitButtonLabel ?? `Store Credit Card Data` }}
    </button>
  </div>
</template>
<style>
#mollie-credit-card-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f2f2f2;
  padding: 15px;
  border-radius: 3px;
}

label {
  margin-top: 5px;
  margin-bottom: 0px;
  display: block;
  color: #04aa6d;
}

div[role="alert"] {
  color: rgb(241, 101, 101);
  margin-bottom: 10px;
  font-size: 0.8em;
}

.mollie-component {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.mollie-credit-card__submit-button {
  background-color: #04aa6d;
  color: white;
  padding: 12px;
  margin: 10px 0;
  border: none;
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
  font-size: 17px;
}

.mollie-credit-card__submit-button:hover {
  background-color: #45a049;
}

.mollie-credit-card__submit-button.button-disabled {
  background-color: #f2f2f2;
  color: #949494;
  cursor: default;
}
</style>
