const instance = createInstance({
  endpoint: ssrValue || clientValue,
  accessToken: options.accessToken,
  timeout: options.shopwareApiClient?.timeout || 5000,
  contextToken: contextToken.value,
  languageId: languageId.value,
});
