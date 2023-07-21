import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig> {
  scrollBehavior(to, from, savedPosition) {
    if (!to.query.preventScroll) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 }
      }
    }
  }
}
