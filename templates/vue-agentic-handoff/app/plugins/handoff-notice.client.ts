import type { Notification } from "@shopware/composables";

// The continue route redirects here with ?handoff=<reason> when an agent's
// checkout link could not be taken over. Tell the buyer why, then drop the
// parameter so a reload does not repeat the message.
const REASONS = ["invalid", "unavailable"] as const;

export default defineNuxtPlugin((nuxtApp) => {
  // useNotifications() shares its list through provide/inject, set up in
  // app.vue's setup, which a plugin can't reach. Providing the list at app
  // level first makes app.vue's useNotifications() use this same list.
  const notifications = ref<Notification[]>([]);
  nuxtApp.vueApp.provide("swNotifications", notifications);

  const router = useRouter();

  nuxtApp.hook("app:mounted", () => {
    const route = router.currentRoute.value;
    const reason = REASONS.find((value) => value === route.query.handoff);
    if (!reason) {
      return;
    }

    // Stays until the buyer closes it: they did not ask to land on the cart.
    notifications.value.push({
      id: Date.now(),
      type: "warning",
      message: nuxtApp.$i18n.t(`agenticHandoff.${reason}`),
    });
    router.replace({ query: { ...route.query, handoff: undefined } });
  });
});
