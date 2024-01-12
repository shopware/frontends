import { inject } from "vue";

export function useCmsTranslations() {
  try {
    return inject("cmsTranslations", {});
  } catch ($error) {
    return {};
  }
}
