import type { Schemas } from "#shopware";

export type StorefrontUrlContext = {
  salesChannel?: {
    languageId?: string;
    domains?: Pick<Schemas["SalesChannelDomain"], "url" | "languageId">[];
  };
  context?: { languageIdChain?: string[] };
};

export type StorefrontUrlInput = {
  devStorefrontUrl: string | null;
  origin: string;
  context: StorefrontUrlContext | null;
};

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function getStorefrontUrl({
  devStorefrontUrl,
  origin,
  context,
}: StorefrontUrlInput): string {
  const preferred = devStorefrontUrl ?? origin;
  const domains = context?.salesChannel?.domains ?? [];
  if (!domains.length) return preferred;

  const normalizedPreferred = withoutTrailingSlash(preferred);
  const matchingDomain = domains.find(
    (domain) =>
      domain.url && withoutTrailingSlash(domain.url) === normalizedPreferred,
  );
  if (matchingDomain?.url) return matchingDomain.url;

  const languageId =
    context?.context?.languageIdChain?.[0] ?? context?.salesChannel?.languageId;
  const languageDomain = domains.find(
    (domain) => domain.languageId === languageId && domain.url,
  );
  if (languageDomain?.url) return languageDomain.url;

  return domains.find((domain) => domain.url)?.url ?? preferred;
}
