/**
 * @public
 */
export type CreateOrderParams = {
  customerComment?: string;
  affiliateCode?: string;
  campaignCode?: string;
  [key: string]: unknown;
};
