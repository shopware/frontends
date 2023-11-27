import type { Schemas } from "#shopware";

/**
 * @deprecated use `Schemas["Currency"]` from "#shopware" import instead
 */
export type Currency = Schemas["Currency"];
// export type Currency = {
//   id: string;
//   isoCode: string;
//   factor: number;
//   symbol: string;
//   shortName: string | null;
//   name: string | null;
//   position: number;
//   decimalPrecision: number;
//   translations: CurrencyTranslation[] | null;
//   orders: Order[] | null;
//   salesChannels: SalesChannel[] | null;
//   salesChannelDefaultAssignments: SalesChannel[] | null;
//   salesChannelDomains: SalesChannelDomain[] | null;
//   customFields: CustomFields;
//   /**
//    * @deprecated removed from 6.5.0
//    */
//   shippingMethodPrices: ShippingMethodPrice[] | null;
//   promotionDiscountPrices: PromotionDiscountPrice[];
//   isSystemDefault: boolean | null;
// };
