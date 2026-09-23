/**
 * Save current contextToken when it changes
 */
instance.onConfigChange(({ config }) => {
  try {
    Cookies.set("sw-context-token", config.contextToken || "", {
      expires: 365,
      sameSite: "Lax",
      path: "/",
    });
    Cookies.set("sw-language-id", config.languageId || "", {
      expires: 365,
      sameSite: "Lax",
      path: "/",
    });

    contextToken.value = config.contextToken;
    languageId.value = config.languageId;
  } catch (e) {
    // Sometimes cookie is set on server after request is send, it can fail silently
  }
});
