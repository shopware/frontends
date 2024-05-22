import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  name: "mollie-register",
  enforce: "pre",

  async setup() {
    // if (route.path !== "/checkout") {
    //   return;
    // }

    useServerHead({
      script: [
        {
          src: "https://static-eu.payments-amazon.com/checkout.js",
        },
      ],
    });
  },
});
