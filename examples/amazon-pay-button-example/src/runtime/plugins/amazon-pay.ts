import { defineNuxtPlugin } from "#imports";
import { useServerHead } from "@unhead/vue";

export default defineNuxtPlugin({
  name: "amazon-pay-register",
  enforce: "pre",

  setup() {
    useServerHead({
      script: [
        {
          src: "https://static-eu.payments-amazon.com/checkout.js",
        },
      ],
    });
  },
});
