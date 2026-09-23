const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken);
const languageId = ref(cookieLanguageId);

const instance = createInstance({
  endpoint: options.endpoint,
  accessToken: options.accessToken,
  timeout: options.shopwareApiClient?.timeout || 5000,
  contextToken: contextToken.value,
  languageId: languageId.value,
});
