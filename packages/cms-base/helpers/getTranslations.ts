import { inject } from "vue";

export default function getTranslations() {
  try {
    return inject("cmsTranslations", {});
  } catch ($error) {
    return {};
  }
}
