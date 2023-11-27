/**
 * @public
 * @deprecated use RequestParameters<"createOrder"> from "#shopware" import instead
 */
export type CreateOrderParams = {
  customerComment?: string;
  affiliateCode?: string;
  campaignCode?: string;
  [key: string]: unknown;
};
