import type { SalesChannel } from "../../system/sales-channel/SalesChannel";
import type { MailHeaderFooterTranslation } from "./MailHeaderFooterTranslation";

/**
 * @public
 */
export type MailHeaderFooter = {
  name: string | null;
  systemDefault: boolean;
  description: string | null;
  headerHtml: string | null;
  headerPlain: string | null;
  footerHtml: string | null;
  footerPlain: string | null;
  salesChannels: SalesChannel[] | null;
  translations: MailHeaderFooterTranslation[] | null;
};
