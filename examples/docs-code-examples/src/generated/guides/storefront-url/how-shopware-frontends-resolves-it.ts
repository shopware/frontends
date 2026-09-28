const devStorefrontUrl: string | null = null;

function getStorefrontUrl() {
  return devStorefrontUrl ?? window.location.origin ?? "";
}
