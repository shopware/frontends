// Same discovery hint the plugin adds to Shopware Storefront pages, so an agent
// that lands on any page finds the UCP profile. Only where the proxy answers.
const UCP_PROFILE_LINK = '</.well-known/ucp>; rel="service-meta"';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    if (!isHandoffEnabled(event) || !isStorefrontHost(event)) {
      return;
    }

    response.headers ??= {};
    const existing = response.headers.link;

    response.headers.link = existing
      ? `${existing}, ${UCP_PROFILE_LINK}`
      : UCP_PROFILE_LINK;
  });
});
