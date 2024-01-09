import { inject } from "vue";

export default function getCmsTranslations() {
  try {
    return inject("cmsTranslations", {});
  } catch ($error) {
    return {};
  }
}
