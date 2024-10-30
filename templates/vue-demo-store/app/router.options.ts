import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    /**
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
    } else {
      return {
        top: 0,
        behavior: "smooth",
      };
    }
  },
};
