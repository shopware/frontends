export default defineNuxtRouteMiddleware((context) => {
  const { $getCurrentSession, ssrContext } = useNuxtApp();

  console.warn(
    ssrContext ? "(server)" : "(client)",
    "customer email:",
    $getCurrentSession.value.customer?.email,
  );
});
