import { inject } from "vue";

export default function getUrlPrefix() {
  try {
    return inject("urlPrefix", "");
  } catch ($error) {
    return "";
  }
}
