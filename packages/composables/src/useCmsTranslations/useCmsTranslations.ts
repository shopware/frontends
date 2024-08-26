import { inject } from "vue";

export function useCmsTranslations() {
  return inject("cmsTranslations", {});
}
