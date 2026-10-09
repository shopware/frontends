import type { Locale } from "./config";
import deDE from "./de-DE/de-DE";
import enGB from "./en-GB/en-GB";
import { deepMerge } from "./merge";
import type { MessageTree } from "./merge";
import plPL from "./pl-PL/pl-PL";

export type Messages = MessageTree;

const catalogs: Record<Locale, Messages> = {
  "en-GB": enGB,
  "pl-PL": deepMerge(enGB, plPL),
  "de-DE": deepMerge(enGB, deDE),
};

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
