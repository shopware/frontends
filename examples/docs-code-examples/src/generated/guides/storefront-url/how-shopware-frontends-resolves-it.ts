const devStorefrontUrl: string | null = null;
declare const sessionContext: {
  salesChannel: { domains?: { url: string; languageId: string }[] };
};

function getStorefrontUrl() {
  const preferred = devStorefrontUrl ?? window.location.origin ?? "";
  const domains = sessionContext.salesChannel.domains ?? [];
  // keep preferred when it matches a configured domain; otherwise
  // use the domain for the active language or the first domain
}
