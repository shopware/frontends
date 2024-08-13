import { inject } from "vue";

export function useCmsTranslations() {
  return inject("cmsTranslations", {});
}

export function useCmsTranslate() {
  return {
    cmsT: (key: string, params: any) => {
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
