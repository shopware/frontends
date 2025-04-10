export default defineNuxtPlugin({
  name: "core-init",
  parallel: true,
  hooks: {
    // You can directly register Nuxt app runtime hooks here
    "app:created"() {
      console.warn("core-init: app:created");
      //useSessionContext().refreshSessionContext()
    },
  },
  // async setup(nuxtApp) {
  //   nuxtApp.hooks.hook("app:beforeMount", () => {
  //     console.warn("core-init: app:beforeMount");
  //     useCart().refreshCart();
  //   });
  // },
});
