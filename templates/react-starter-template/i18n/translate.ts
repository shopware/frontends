import { defaultLocale } from "./config";
import type { Locale } from "./config";
import fallbackMessages from "./en-GB/en-GB";
import type { MessageTree } from "./merge";

export type TranslateParams =
  | Record<string, string | number | null | undefined>
  | Array<string | number>;

export type Translate = (
  key: string,
  params?: TranslateParams,
  count?: number,
) => string;

const PLACEHOLDER = /\{\s*(\w+)\s*\}/g;
const PLURAL_SEPARATOR = /\s*\|\s*/;

const lookups = new WeakMap<Translate, (key: string) => boolean>();
const warnedKeys = new Set<string>();

function lookup(messages: MessageTree, key: string): string | undefined {
  let node: unknown = messages;
  for (const segment of key.split(".")) {
    if (typeof node !== "object" || node === null) {
      node = undefined;
      break;
    }
    node = Object.hasOwn(node, segment)
      ? (node as MessageTree)[segment]
      : undefined;
  }
  if (typeof node === "string") return node;
  const flat = Object.hasOwn(messages, key) ? messages[key] : undefined;
  return typeof flat === "string" ? flat : undefined;
}

function warnMissing(key: string): void {
  if (process.env.NODE_ENV !== "development" || warnedKeys.has(key)) return;
  warnedKeys.add(key);
  console.warn(`[i18n] No message for "${key}" in ${defaultLocale}.`);
}

function selectForm(
  message: string,
  rules: Intl.PluralRules,
  count: number | undefined,
): string {
  const forms = message.split(PLURAL_SEPARATOR);
  if (forms.length === 1) return message;
  const last = forms.length - 1;
  if (count === undefined) return forms[last] ?? "";
  const category = rules.select(count);
  if (category === "one") return forms[0] ?? "";
  if (category === "few" && forms.length > 2) return forms[1] ?? "";
  return forms[last] ?? "";
}

function paramValue(
  name: string,
  params: TranslateParams | undefined,
  count: number | undefined,
): string {
  if (params && Object.hasOwn(params, name)) {
    const value: unknown = (params as Record<string, unknown>)[name];
    return value === null || value === undefined ? "" : String(value);
  }
  if ((name === "n" || name === "count") && count !== undefined) {
    return String(count);
  }
  return "";
}

function interpolate(
  message: string,
  params: TranslateParams | undefined,
  count: number | undefined,
): string {
  return message.replace(PLACEHOLDER, (_, name: string) =>
    paramValue(name, params, count),
  );
}

export function createTranslator(
  locale: Locale,
  messages: MessageTree,
): Translate {
  const rules = new Intl.PluralRules(locale);
  const fallbackRules =
    locale === defaultLocale ? rules : new Intl.PluralRules(defaultLocale);

  const has = (key: string): boolean =>
    lookup(messages, key) !== undefined ||
    lookup(fallbackMessages, key) !== undefined;

  const translate: Translate = (key, params, count) => {
    const own = lookup(messages, key);
    if (own !== undefined) {
      return interpolate(selectForm(own, rules, count), params, count);
    }
    const fallback = lookup(fallbackMessages, key);
    if (fallback !== undefined) {
      return interpolate(
        selectForm(fallback, fallbackRules, count),
        params,
        count,
      );
    }
    warnMissing(key);
    return key;
  };

  lookups.set(translate, has);
  return translate;
}

export function hasTranslation(t: Translate, key: string): boolean {
  const has = lookups.get(t);
  return has ? has(key) : t(key) !== key;
}
