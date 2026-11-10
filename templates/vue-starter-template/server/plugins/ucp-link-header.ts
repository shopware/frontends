// Same discovery hint the plugin adds to Shopware Storefront pages, so an agent
// that lands on any page finds the UCP profile. It cannot depend on the host:
// ISR keeps one copy of a rendered page for every host, so a per-host header
// would be served to the wrong hosts. The proxy itself answers only on the
// shop's hosts.
const UCP_PROFILE_LINK = '</.well-known/ucp>; rel="service-meta"';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    if (!isHandoffEnabled(event)) {
      return;
    }

    response.headers ??= {};
    const existing = response.headers.link;

    response.headers.link = existing
      ? `${existing}, ${UCP_PROFILE_LINK}`
      : UCP_PROFILE_LINK;
  });
});
