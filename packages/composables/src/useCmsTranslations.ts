import { inject } from "vue";

export function useCmsTranslations() {
  return inject("cmsTranslations", {});
}

export function useCmsTranslate() {
  return {
    /**
     * Replace text placeholder with param value
     *
     * @param {string} key
     * @param {{ [key: string]: string }} params
     * @returns {string}
     */
    cmsT: (key: string, params?: { [key: string]: string }) => {
      if (!params) return key;

      let translatedText = key;
      for (const param in params) {
        const placeholder = `{${param}}`;
        const paramValue = params[param];
        translatedText = translatedText.replace(placeholder, paramValue);
      }
      return translatedText;
    },
  };
}
