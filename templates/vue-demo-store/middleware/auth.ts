import { defineNuxtRouteMiddleware } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();

  console.warn(
    "auth middleware",
    (await nuxtApp.$shopwareApiInstance.invoke("readContext get /context")).data
      .customer,
  );
});
