<script setup lang="ts">
import { defu } from "defu";
import { useCmsTranslations } from "@shopware-pwa/composables-next";

const showTestData = computed(() => {
  return process.env.NODE_ENV === "development" ?? false;
});

type CreditCard = {
  brand: string;
  number: string;
  expiry: string;
  cvc: string;
  secret: string;
};

const creditCards: CreditCard[] = [
  {
    brand: "Mastercard",
    number: "5232050000010003",
    expiry: "12/30",
    cvc: "123",
    secret: "None",
  },
  {
    brand: "Visa",
    number: "4711100000000000",
    expiry: "12/30",
    cvc: "123",
    secret: "secret",
  },
  {
    brand: "Visa",
    number: "4012888888881881",
    expiry: "12/30",
    cvc: "123",
    secret: "None",
  },
  {
    brand: "Visa",
    number: "4644400000308888",
    expiry: "12/30",
    cvc: "123",
    secret: "None",
  },
];

type Translations = {
  UnzerPayment: {
    frame: {
      creditCard: {
        testData: {
          brand: string;
          number: string;
          expiry: string;
          cvc: string;
          secret: string;
        };
      };
    };
  };
};

let translations: Translations = {
  UnzerPayment: {
    frame: {
      creditCard: {
        testData: {
          brand: "Brand",
          number: "Number",
          expiry: "Expiry",
          cvc: "CVC",
          secret: "Secret",
        },
      },
    },
  },
};

translations = defu(translations, useCmsTranslations()) as Translations;
</script>

<template>
  <div v-if="showTestData" class="unzer-test-data">
    <div class="mb-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr class="divide-x divide-gray-200">
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  {{
                    translations.UnzerPayment.frame.creditCard.testData.brand
                  }}
                </th>
                <th
                  scope="col"
                  class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {{
                    translations.UnzerPayment.frame.creditCard.testData.number
                  }}
                </th>
                <th
                  scope="col"
                  class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {{
                    translations.UnzerPayment.frame.creditCard.testData.expiry
                  }}
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  {{ translations.UnzerPayment.frame.creditCard.testData.cvc }}
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  {{
                    translations.UnzerPayment.frame.creditCard.testData.secret
                  }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="card in creditCards"
                :key="card.brand"
                class="divide-x divide-gray-200 text-gray-500 text-sm"
              >
                <td class="py-4 pl-4 pr-4 font-medium text-gray-900 sm:pl-0">
                  {{ card.brand }}
                </td>
                <td class="p-4">
                  {{ card.number }}
                </td>
                <td class="p-4">
                  {{ card.expiry }}
                </td>
                <td class="p-4">
                  {{ card.cvc }}
                </td>
                <td class="py-4 pl-4 pr-4 sm:pr-0">
                  {{ card.secret }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
