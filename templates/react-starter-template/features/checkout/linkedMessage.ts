import type { Translate } from "@/i18n/translate";

const LINK_MARKER = "\u0000";

export type LinkedMessageParts = {
  before: string;
  link: string;
  after: string;
};

export function splitLinkedMessage(
  t: Translate,
  key: string,
  linkKey: string,
): LinkedMessageParts {
  const [before = "", ...rest] = t(key, { link: LINK_MARKER }).split(
    LINK_MARKER,
  );
  if (rest.length === 0) return { before, link: "", after: "" };
  return { before, link: t(linkKey), after: rest.join("") };
}

export function linkedMessageText(
  t: Translate,
  key: string,
  linkKey: string,
): string {
  const { before, link, after } = splitLinkedMessage(t, key, linkKey);
  return `${before}${link}${after}`;
}
