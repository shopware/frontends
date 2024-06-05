// import { PaymentMethod } from "../models/checkout/payment/PaymentMethod";
// import { ShippingMethod } from "../models/checkout/shipping/ShippingMethod";
// import { ShippingAddress } from "../models/checkout/customer/ShippingAddress";
// import { Country } from "../models/system/country/Country";
import { Currency } from "../models/system/currency/Currency";
import { Language } from "../models/framework/language/Language";
// import { Category } from "../models/content/category/Category";
// import { Customer } from "../models/checkout/customer/Customer";
import { CustomFields } from "../models/common/CustomField";
import type { Schemas } from "#shopware";

// export type ContextTokenResponse = {
//   apiAlias: "array_struct";
//   contextToken: string;
//   redirectUrl?: string;
// };
/**
 * @deprecated use {@link Schemas['SalesChannelContext']} from "#shopware" import instead
 */
export type ContextTokenResponse = Schemas["SalesChannelContext"];

export type SalesChannelDomain = {
  extensions: unknown;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: { [key: string]: string };
  createdAt: string;
  updatedAt: Date | string | null;
  url: string;
  currencyId: string;
  currency: null | Currency;
  snippetSetId: null | string;
  salesChannelId: string;
  languageId: string;
  language: null | Language;
  salesChannelDefaultHreflang: null | string;
  hreflangUseOnlyLocale: boolean;
  id: string;
  customFields: CustomFields;
  apiAlias: "sales_channel_domain";
};

/**
 * @deprecated use {@link Schemas['SalesChannelContext']} from "#shopware" import instead
 */
export type SessionContext = Schemas["SalesChannelContext"];
// export type SessionContext = {
//   token: string;
//   currentCustomerGroup: {
//     id: string;
//     name: string;
//   };
//   fallbackCustomerGroup: {
//     id: string;
//     name: string;
//   };
//   currency: Currency;
//   salesChannel: SalesChannel;
//   context: {
//     languageIdChain: string[];
//     versionId: null | string;
//     currencyId: string;
//     currencyFactor: number;
//     scope: "user" | string;
//     ruleIds: string[];
//     source: unknown;
//     considerInheritance: boolean;
//     taxState: "gross" | "net" | string;
//     rounding: {
//       decimals: number;
//       interval: number;
//       roundForNet: boolean;
//       apiAlias: "shopware_core_framework_data_abstraction_layer_pricing_cash_rounding_config";
//     };
//     apiAlias: "context";
//   };
//   taxRules: {
//     id: string;
//     name: string;
//   }[];
//   customer?: Customer;
//   paymentMethod: PaymentMethod;
//   shippingMethod: ShippingMethod;
//   shippingLocation: {
//     address: ShippingAddress;
//     country: Country;
//   };
//   apiAlias: "sales_channel_context";
// };
