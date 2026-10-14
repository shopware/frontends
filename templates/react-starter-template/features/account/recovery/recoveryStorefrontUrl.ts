import { loadPublicConfig } from "@/features/session/browserClient";
import { getStorefrontUrl } from "@/features/session/storefrontUrl";
import type { StorefrontUrlContext } from "@/features/session/storefrontUrl";

export type RecoveryStorefrontUrlInput = {
  devStorefrontUrl: string | null;
  origin: string;
  context: StorefrontUrlContext | null;
  localePrefix: string;
};

function withoutTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

export function recoveryStorefrontUrl({
  devStorefrontUrl,
  origin,
  context,
  localePrefix,
}: RecoveryStorefrontUrlInput): string {
  if (localePrefix) {
    const wanted = `${withoutTrailingSlashes(devStorefrontUrl ?? origin)}/${localePrefix}`;
    const prefixed = context?.salesChannel?.domains?.find(
      ({ url }) => url && withoutTrailingSlashes(url) === wanted,
    );
    if (prefixed?.url) return withoutTrailingSlashes(prefixed.url);
  }
  return withoutTrailingSlashes(
    getStorefrontUrl({ devStorefrontUrl, origin, context }),
  );
}

export async function resolveRecoveryStorefrontUrl(
  context: StorefrontUrlContext | null,
  localePrefix: string,
): Promise<string> {
  const { devStorefrontUrl } = await loadPublicConfig();
  return recoveryStorefrontUrl({
    devStorefrontUrl,
    origin: window.location.origin,
    context,
    localePrefix,
  });
}
