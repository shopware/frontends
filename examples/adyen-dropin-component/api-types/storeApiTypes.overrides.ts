import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {
  AdyenPaymentMethod: {
    /**
     * The unique payment method code.
     */
    type: string;
    /**
     * The displayable name of this payment method.
     */
    name: string;
    /**
     * All input details to be provided to complete the payment with this payment method.
     */
    details?: object;
    /**
     * Configuration props as set by the merchant in the CA and received in the PM object in the /paymentMethods response
     */
    configuration?: object;
    /**
     * Brand for the selected gift card. For example: plastix, hmclub.
     */
    brand?: string;
    /**
     * List of possible brands. For example: visa, mc.
     */
    brands?: string[];
    /**
     * The funding source of the payment method.
     */
    fundingSource?: "debit" | "credit";
    /**
     * The group where this payment method belongs to.
     */
    group?: {
      /**
       * The name of the group.
       */
      name: string;
      /**
       * Echo data to be used if the payment method is displayed as part of this group.
       */
      paymentMethodData: string;
      /**
       * The unique code of the group.
       */
      type: string;
    };
  };
  StoredPaymentMethod: Schemas["AdyenPaymentMethod"] & {
    /**
     * The supported shopper interactions for this stored payment method.
     */
    supportedShopperInteractions: string[];
    /**
     * A unique identifier of this stored payment method.
     * Mapped from 'storedPaymentMethod.id'
     */
    storedPaymentMethodId?: string;
    id: string;
  };
  SalesChannelContext: {
    apiAlias: "sales_channel_context";
    /** Core context with general configuration values and state */
    context?: {
      currencyFactor?: number;
      currencyId?: string;
      /** Format: int32 */
      currencyPrecision?: number;
      languageIdChain?: string[]; // TODO: [OpenAPI][SalesChannelContext] languageIdChain field should be defined properly in context
      scope?: string;
      source?: string;
      taxState?: string;
      useCache?: boolean;
      versionId?: string;
    };
    /** Currency associated with the current user */
    currency?: components["schemas"]["Currency"]; // TODO: [OpenAPI][SalesChannelContext] currency field should be defined reusing Currency schema
    /** Customer group of the current user */
    currentCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    customer?: components["schemas"]["Customer"]; // TODO: [OpenAPI][SalesChannelContext] customer field should be defined reusing Customer schema
    extensions: {
      adyenData: {};
    };
    /** Fallback group if the default customer group is not applicable */
    fallbackCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    /** Selected payment method */
    paymentMethod?: components["schemas"]["PaymentMethod"] & {
      fundingSource: components["schemas"]["AdyenPaymentMethod"]["fundingSource"];
    }; // TODO: [OpenAPI][SalesChannelContext] paymentMethod field should be defined properly reusing PaymentMethod schema
    /** Information about the current sales channel */
    salesChannel?: {
      accessKey?: string;
      active?: boolean;
      analyticsId?: string;
      countryId?: string;
      currencyId?: string;
      customerGroupId?: string;
      footerCategoryId?: string;
      hreflangActive?: boolean;
      hreflangDefaultDomainId?: string;
      languageId?: string;
      mailHeaderFooterId?: string;
      maintenance?: boolean;
      maintenanceIpWhitelist?: string;
      name?: string;
      /** Format: int32 */
      navigationCategoryDepth?: number;
      navigationCategoryId?: string;
      paymentMethodId?: string;
      serviceCategoryId?: string;
      shippingMethodId?: string;
      shortName?: string;
      typeId?: string;
    };
    shippingLocation?: {
      // TODO: [OpenAPI][SalesChannelContext] shippingLocation field should be defined properly
      apiAlias: "cart_delivery_shipping_location";
      country: components["schemas"]["Country"];
      address: components["schemas"]["CustomerAddress"];
    };
    /** Selected shipping method */
    shippingMethod?: components["schemas"]["ShippingMethod"]; // TODO: [OpenAPI][SalesChannelContext] shippingMethod field should be defined properly reusing ShippingMethod schema
    /** Currently active tax rules and/or rates */
    taxRules?: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    /** Context the user session */
    token?: string;
  };
};

export type operations = {
  "readAdyenPaymentStatus post /adyen/payment-status": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      orderId: string;
    };
    response: never;
    responseCode: 204;
  };
  "readAdyenConfiguration post /adyen/payment-status": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      orderId: string;
    };
    response: {
      paymentMethods: components["schemas"]["AdyenPaymentMethod"][];
      storedPaymentMethods: components["schemas"]["StoredPaymentMethod"][];
    };
    responseCode: 200;
  };
};
