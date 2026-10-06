import { loadPublicConfig } from "@/features/session/browserClient";
import { getStorefrontUrl } from "@/features/session/storefrontUrl";
import type { StorefrontUrlContext } from "@/features/session/storefrontUrl";

export async function resolveNewsletterStorefrontUrl(
  context: StorefrontUrlContext | null,
): Promise<string> {
  const { devStorefrontUrl } = await loadPublicConfig();
  return getStorefrontUrl({
    devStorefrontUrl,
    origin: window.location.origin,
    context,
  });
}
