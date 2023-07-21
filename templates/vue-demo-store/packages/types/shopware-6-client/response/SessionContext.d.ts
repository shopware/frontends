import { PaymentMethod } from "../models/checkout/payment/PaymentMethod";
import { ShippingMethod } from "../models/checkout/shipping/ShippingMethod";
import { ShippingAddress } from "../models/checkout/customer/ShippingAddress";
import { Country } from "../models/system/country/Country";
import { Currency } from "../models/system/currency/Currency";
import { Language } from "../models/framework/language/Language";
import { Category } from "../models/content/category/Category";
import { Customer } from "../models/checkout/customer/Customer";

export type ContextTokenResponse = {
  contextToken: string;
};

export type SalesChannelDomain = {
  extensions: unknown;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: { [key: string]: string };
  createdAt: string;
  updatedAt: null | string;
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
  customFields: null | unknown;
  apiAlias: "sales_channel_domain";
};

export type SalesChannel = {
  extensions: unknown;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: null | string;
  languageId: string;
  currencyId: string;
  paymentMethodId: string;
  shippingMethodId: string;
  countryId: string;
  navigationCategoryId: string;
  navigationCategoryVersionId: null | string;
  navigationCategoryDepth: number;
  footerCategoryId: null | string;
  footerCategoryVersionId: null | string;
  serviceCategoryId: null | string;
  serviceCategoryVersionId: null | string;
  name: string;
  shortName: null | string;
  configuration: unknown;
  active: boolean;
  maintenance: boolean;
  taxCalculationType: "horizontal" | "vertical";
  currency: Currency;
  language: null | Language;
  paymentMethod: null | PaymentMethod;
  shippingMethod: null | ShippingMethod;
  country: null | Country;
  domains: SalesChannelDomain[];
  navigationCategory: null | Category;
  footerCategory: null | Category;
  serviceCategory: null | Category;
  mailHeaderFooterId: null | string;
  customerGroupId: null | string;
  hreflangActive: boolean;
  hreflangDefaultDomainId: null | string;
  hreflangDefaultDomain: null | SalesChannelDomain;
  id: string;
  customFields: null | unknown;
  apiAlias: "sales_channel";
};

export type SessionContext = {
  token: string;
  currentCustomerGroup: {
    id: string;
    name: string;
  };
  fallbackCustomerGroup: {
    id: string;
    name: string;
  };
  currency: Currency;
  salesChannel: SalesChannel;
  context: {
    languageIdChain: string[];
    versionId: null | string;
    currencyId: string;
    currencyFactor: number;
    scope: "user" | string;
    ruleIds: string[];
    source: unknown;
    considerInheritance: boolean;
    taxState: "gross" | "net" | string;
    rounding: {
      decimals: number;
      interval: number;
      roundForNet: boolean;
      apiAlias: "shopware_core_framework_data_abstraction_layer_pricing_cash_rounding_config";
    };
    apiAlias: "context";
  };
  taxRules: {
    id: string;
    name: string;
  }[];
  customer?: Customer;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingLocation: {
    address: ShippingAddress;
    country: Country;
  };
  apiAlias: "sales_channel_context";
};
