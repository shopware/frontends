import { useNuxtApp, defineNuxtRouteMiddleware } from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();

  nuxtApp.$adyenCheckout;
});
