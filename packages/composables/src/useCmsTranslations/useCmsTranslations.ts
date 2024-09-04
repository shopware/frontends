import { inject } from "vue";

/**
 * @category CMS (Shopping Experiences)
 * @returns
 */
export function useCmsTranslations() {
  return inject("cmsTranslations", {});
}
