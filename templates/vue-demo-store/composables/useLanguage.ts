import {
  getAvailableLanguages,
  setCurrentLanguage,
} from "@shopware-pwa/api-client";
import { EntityResult, Language } from "@shopware-pwa/types";

export function useLanguage() {
  const { apiInstance } = useShopwareContext();
  const { refreshSessionContext } = useSessionContext();
  
  const languages = useState<Language[]>('languages', () => []);
  const currentLanguage = useState<Language>('current-language');

  const fetchLang = async () => {
    const response: EntityResult<"language", Language> = await getAvailableLanguages(apiInstance);
    languages.value = response.elements;
  }

  const setLanguage = async (languageId: string) => {
    await setCurrentLanguage(languageId, apiInstance);
    apiInstance.config.languageId = languageId;
    await refreshSessionContext();
    location.reload();
  };

  const syncLanguageData = (languageId: string) => {
    if (currentLanguage.value?.id === languageId) return;
    currentLanguage.value = languages.value.find(x => x.id === languageId)!;
  };

  return {
    fetchLang,
    languages: computed(() => languages.value),
    setLanguage,
    currentLanguage: computed(() => currentLanguage.value),
    syncLanguageData
  }
}



