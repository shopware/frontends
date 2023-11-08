import { defineNuxtPlugin } from "#imports";
import { useServerHead } from "#imports";

export default defineNuxtPlugin({
  name: "mollie-register",
  enforce: "pre",

  async setup() {
    useServerHead({
      script: [
        {
          src: "https://js.mollie.com/v1/mollie.js",
        },
      ],
    });
  },
});
