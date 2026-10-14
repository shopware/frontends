export type EmailLinkParams = { em: string; hash: string };

export function readEmailLinkParams(search: string): EmailLinkParams | null {
  const params = new URLSearchParams(search);
  const em = params.get("em")?.trim();
  const hash = params.get("hash")?.trim();
  return em && hash ? { em, hash } : null;
}
