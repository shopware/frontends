import { MailHeaderFooter } from "./MailHeaderFooter";

/**
 * @public
 */
export type MailHeaderFooterTranslation = {
  name: string | null;
  description: string | null;
  headerHtml: string | null;
  headerPlain: string | null;
  footerHtml: string | null;
  footerPlain: string | null;
  mailHeaderFooter: MailHeaderFooter | null;
  mailHeaderFooterId: string;
};
