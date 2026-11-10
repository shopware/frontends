// Same discovery hint the plugin adds to Shopware Storefront pages, so an agent
// that lands on any page finds the UCP profile.
const UCP_PROFILE_LINK = '</.well-known/ucp>; rel="service-meta"';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response) => {
    const headers = (response.headers ??= {});
    const existing = headers.link;

    headers.link = existing
      ? `${existing}, ${UCP_PROFILE_LINK}`
      : UCP_PROFILE_LINK;
  });
});
