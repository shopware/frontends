<script setup lang="ts">
import type { Schemas } from "#shopware";
import { defu } from "defu";
import { useCmsTranslations } from "@shopware-pwa/composables-next";

type Translations = {
  UnzerPayment: {
    frame: {
      creditCard: {
        choose: string;
        new: string;
        number: string;
        expiry: string;
        cvc: string;
        remember: string;
      };
    };
  };
};

let translations: Translations = {
  UnzerPayment: {
    frame: {
      creditCard: {
        choose: "Choose a saved credit card",
        new: "Use a new credit card",
        number: "Card number",
        expiry: "Expiry date",
        cvc: "CVC",
        remember: "Remember this card",
      },
    },
  },
};
translations = defu(translations, useCmsTranslations()) as Translations;

const { isUnzerPaymentMethod, unzerInstance } = useUnzer();

const orderButtonDisabled = inject<Ref<boolean | undefined>>(
  "orderButtonDisabled",
  ref(true),
);

async function createResource(): Promise<void> {
  console.debug("[unzer] create:resource", creditCard.value);

  if (creditCard.value !== null) {
    try {
      const response: { id: string } = await creditCard.value.createResource();
      console.debug("[unzer] create:resource:response", response);
      const store = useLocalStorage("unzerId", "");
      store.value = response.id;
      orderButtonDisabled.value = false;
    } catch (error) {
      console.error("[unzer] create:resource:error", error);
      if (error?.message) {
        errorText.value = error?.message;
      }
      throw error;
    }
  } else {
    throw new Error("[unzer] Resource ID not found");
  }
}

const creditCard = ref(null);
const number = ref<HTMLElement>();
const expiry = ref<HTMLElement>();
const cvc = ref<HTMLElement>();

watch(unzerInstance, (unzer) => {
  const card = unzer.Card();

  card.create("number", {
    containerId: "card-element-id-number",
    onlyIframe: false,
  });

  card.create("expiry", {
    containerId: "card-element-id-expiry",
    onlyIframe: false,
  });

  card.create("cvc", {
    containerId: "card-element-id-cvc",
    onlyIframe: false,
  });

  creditCard.value = card;
});

watch(
  () => [number, expiry, cvc],
  ([number, expiry, cvc]) => {
    if (!number.value || !expiry.value || !cvc.value) return;
    console.log(number.value, expiry.value, cvc.value);
    const allSuccess = [number.value, expiry.value, cvc.value].every(
      (ref) => ref.firstChild && ref.firstChild.classList.contains("success"),
    );
    //orderButtonDisabled.value = !allSuccess;
  },
  { deep: true, immediate: true },
);

onBeforeUnmount(() => {
  document.querySelectorAll(".unzerSandboxNotify").forEach((el) => el.remove());
  orderButtonDisabled.value = false;
  // avoid duplicated iframes
  [number, expiry, cvc].forEach((field) => {
    while (field.value && field.value.firstChild) {
      field.value.removeChild(field.value.firstChild);
    }
  });
});

const errorText = ref();

const { listen } = useEventBus();
listen(
  ["order:placed", "order:retry-payment"],
  async (paymentMethod: Schemas["PaymentMethod"], eventName: string) => {
    const isUnzerMethod = isUnzerPaymentMethod(paymentMethod);
    if (!isUnzerMethod) return;

    console.debug(`[unzer] ${eventName}`);
    errorText.value = null;

    try {
      await createResource();
      console.debug("[unzer] order:placed:resource-created");
    } catch (e) {
      console.error("[unzer] order:placed:resource-error", e);
      if (e?.message) {
        errorText.value = e.message;
      }
      throw e;
    }
  },
);
</script>

<template>
  <div id="unzer-payment-base" class="unzer-payment-base">
    <div class="unzer-payment-base-body">
      <div
        class="unzer-payment-frame border-brand-lightgray lg:shadow-md lg:border-1 lg:p-4"
      >
        <div class="unzer-payment-credit-card-wrapper">
          <UnzerTestDataTable />

          <div
            v-if="errorText"
            id="alert-border-2"
            class="unzer-error flex items-center p-4 mt-2 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
            role="alert"
          >
            <svg
              class="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <div class="ml-3 text-sm font-medium">
              {{ errorText }}
            </div>
          </div>

          <form id="payment-form" class="unzerUI form" novalidate>
            <div class="field">
              <div
                ref="number"
                id="card-element-id-number"
                class="unzerInput"
              ></div>
            </div>
            <div class="two fields">
              <div class="field ten wide">
                <div
                  ref="expiry"
                  id="card-element-id-expiry"
                  class="unzerInput"
                ></div>
              </div>
              <div class="field six wide">
                <div
                  ref="cvc"
                  id="card-element-id-cvc"
                  class="unzerInput"
                ></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
