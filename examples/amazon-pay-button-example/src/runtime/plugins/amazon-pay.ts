import { useServerHead } from "@unhead/vue";
import { defineNuxtPlugin } from "#imports";

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
