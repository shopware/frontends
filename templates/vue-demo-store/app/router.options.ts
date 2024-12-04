import type { RouterOptions } from "@nuxt/schema";

export default (<RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return;
    }
    /**
     * IMPORTANT:
     *
     * This solutions is related to the default SEO URL pattern structure:
     * {{ product.translated.name }}/{{ product.productNumber }}
     *
     * For more information please visit:
     * https://docs.shopware.com/en/shopware-6-en/settings/seo
     *
     * ----------------------------------------------
     *
     * Do not scroll to top when switching between product variants
     *
     * Assumptions:
     * - product with variants contains minimum 2 subdirectories
     * - for the same product 1 subdirectory is the same
     */
    if (
      from.params?.all?.length > 1 &&
      to.params?.all?.length > 1 &&
      from.params?.all[0] === to.params?.all[0]
    ) {
      return null;
    }

    if (savedPosition) {
      return savedPosition;
    }
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});
