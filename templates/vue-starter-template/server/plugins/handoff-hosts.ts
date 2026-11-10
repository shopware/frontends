// An empty host list trusts the forwarded host (see isStorefrontHost). Preview
// deployments and the nightly run need that; a live shop should not miss it.
export default defineNitroPlugin(() => {
  if (
    isHandoffEnabled() &&
    !useRuntimeConfig().agenticHandoff.storefrontHosts.trim()
  ) {
    console.warn(
      "[agentic-handoff] NUXT_AGENTIC_HANDOFF_STOREFRONT_HOSTS is empty: the UCP proxy and the continue page answer on every host. Set it before going live.",
    );
  }
});
