import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents;
//   & {
//   schemas: schemas;
// };

export type Schemas = {
  ProductListingResult: components["schemas"]["EntitySearchResult"] & {
    /** @enum {string} */
    apiAlias: "product_listing";
    /** Contains the available sorting. These can be used to show a sorting select-box in the product listing. */
    availableSortings: {
      /** @enum {string} */
      apiAlias: "product_sorting";
      key: string;
      label: string;
      priority: number;
      translated: {
        apiAlias?: string;
        key?: string;
        label: string;
      };
    }[];
    /** Contains the state of the filters. These can be used to create listing filters. */
    currentFilters: {
      manufacturer: string[];
      navigationId: string;
      price: {
        /** @default 0 */
        max: number;
        /** @default 0 */
        min: number;
      };
      properties: string[];
      rating?: number; // TODO: [OpenAPI][ProductListingResult] - rating should be defined the same as in body of the request
      search: string; // TODO: [OpenAPI][ProductListingResult] - search should be required as is required in body of the request, otherwise everywhere optional
      /** @default false */
      "shipping-free": boolean;
    };
    elements: components["schemas"]["Product"][];
    /** @enum {string} */
    entity?: "product";
    sorting?: string;
  };
  SwagPaypalVaultToken: {
    // TODO: [OpenAPI][SwagPaypalVaultToken] - add SwagPaypalVaultToken definition to schema
    /** Format: date-time */
    createdAt: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    id?: string;
    identifier: string;
    mainMapping?: components["schemas"]["SwagPaypalVaultTokenMapping"];
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    /** Format: date-time */
    updatedAt?: string;
  };
};

export type operations = {
  "updateLineItem patch /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      // TODO: [OpenAPI][updateLineItem] - add proper request body type with required fields
      items: Array<{
        id: string;
        quantity: number;
      }>;
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "readProduct post /product": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["Product"][]; // TODO: [OpenAPI][readProduct]: add elements property as required
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readShippingMethod post /shipping-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    query?: {
      /** List only available shipping methods. This filters shipping methods methods which can not be used in the actual context because of their availability rule. */
      onlyAvailable?: boolean;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      /** aggregation result */
      aggregations?: Record<string, never>;
      elements: components["schemas"]["ShippingMethod"][]; // TODO: [OpenAPI][readShippingMethod]: response should be `EntitySearchResult` and elements should be required
      /** Total amount */
      total?: number;
    };
    responseCode: 200;
  };
  "register post /account/register": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Flag indicating accepted data protection */
      acceptedDataProtection: boolean;
      /** Field can be used to store an affiliate tracking code */
      affiliateCode?: string;
      billingAddress: components["schemas"]["CustomerAddress"];
      /** Birthday day */
      birthdayDay?: number;
      /** Birthday month */
      birthdayMonth?: number;
      /** Birthday year */
      birthdayYear?: number;
      /** Field can be used to store a campaign tracking code */
      campaignCode?: string;
      /** Email of the customer. Has to be unique, unless `guest` is `true` */
      email: string;
      /** Customer first name. Value will be reused for shipping and billing address if not provided explicitly. */
      firstName: string;
      /**
       * If set, will create a guest customer. Guest customers can re-use an email address and don't need a password.
       * @default false
       */
      guest?: boolean;
      /** Customer last name. Value will be reused for shipping and billing address if not provided explicitly. */
      lastName: string;
      /** Password for the customer. Required, unless `guest` is `true` */
      password: string;
      /** Id of the salutation for the customer account. Fetch options using `salutation` endpoint. */
      salutationId?: string; // TODO: [OpenAPI][register]: salutationId should not be required
      shippingAddress?: components["schemas"]["CustomerAddress"];
      /** URL of the storefront for that registration. Used in confirmation emails. Has to be one of the configured domains of the sales channel. */
      storefrontUrl: string;
      /** (Academic) title of the customer */
      title?: string;
    } & (
      | {
          /**
           * Type of the customer account. Default value is 'private'.
           * @default private
           * @enum {string}
           */
          accountType?: "private";
          company?: null;
          vatIds?: null;
        }
      | {
          /**
           * Type of the customer account. Can be `private` or `business`.
           * @enum {string}
           */
          accountType: "business";
          /** Company of the customer. Only required when `accountType` is `business`. */
          company: string;
          /** VAT IDs of the customer's company. Only valid when `accountType` is `business`. */
          vatIds: [string, ...string[]];
        }
      | {
          /**
           * Type of the customer account. Default value is 'private'.
           * @default private
           * @enum {string}
           */
          accountType?: "private";
          company?: null;
          vatIds?: null;
        }
      | {
          /**
           * Type of the customer account. Can be `private` or `business`.
           * @enum {string}
           */
          accountType: "business";
          /** Company of the customer. Only required when `accountType` is `business`. */
          company: string;
          /** VAT IDs of the customer's company. Only valid when `accountType` is `business`. */
          vatIds: [string, ...string[]];
        }
    );
    response: components["schemas"]["Customer"];
    responseCode: 200;
  };
  "sendContactMail post /contact-form": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** Type of the content management page */
      cmsPageType?: string;
      /** The message of the contact form */
      comment: string;
      /** Email address */
      email: string;
      /** Entity name for slot config */
      entityName?: string;
      /** Firstname. This field may be required depending on the system settings. */
      firstName?: string;
      /** Lastname. This field may be required depending on the system settings. */
      lastName?: string;
      /** Identifier of the navigation page. Can be used to override the configuration.
       *     Take a look at the settings of a category containing a concat form in the administration. */
      navigationId?: string;
      /** Phone. This field may be required depending on the system settings. */
      phone?: string;
      /** Identifier of the salutation. Use `/api/salutation` endpoint to fetch possible values. */
      salutationId?: string; // TODO: [OpenAPI][sendContactMail]: salutationId should not be required
      /** Identifier of the cms element */
      slotId?: string;
      /** The subject of the contact form. */
      subject: string;
    };
    response: never;
    responseCode: 200;
  };
  "changeProfile post /account/change-profile": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Birthday day */
      birthdayDay?: number;
      /** Birthday month */
      birthdayMonth?: number;
      /** Birthday year */
      birthdayYear?: number;
      /** Customer first name. Value will be reused for shipping and billing address if not provided explicitly. */
      firstName: string;
      /** Customer last name. Value will be reused for shipping and billing address if not provided explicitly. */
      lastName: string;
      /** Id of the salutation for the customer account. Fetch options using `salutation` endpoint. */
      salutationId?: string; // TODO: [OpenAPI][changeProfile]: salutationId should not be required
      /** (Academic) title of the customer */
      title?: string;
    } & (
      | {
          /**
           * Type of the customer account. Default value is 'private'.
           * @default private
           * @enum {string}
           */
          accountType?: "private";
          company?: null;
          vatIds?: null;
        }
      | {
          /**
           * Type of the customer account. Can be `private` or `business`.
           * @enum {string}
           */
          accountType: "business";
          /** Company of the customer. Only required when `accountType` is `business`. */
          company: string;
          /** VAT IDs of the customer's company. Only valid when `accountType` is `business`. */
          vatIds: [string, ...string[]];
        }
      | {
          /**
           * Type of the customer account. Default value is 'private'.
           * @default private
           * @enum {string}
           */
          accountType?: "private";
          company?: null;
          vatIds?: null;
        }
      | {
          /**
           * Type of the customer account. Can be `private` or `business`.
           * @enum {string}
           */
          accountType: "business";
          /** Company of the customer. Only required when `accountType` is `business`. */
          company: string;
          /** VAT IDs of the customer's company. Only valid when `accountType` is `business`. */
          vatIds: [string, ...string[]];
        }
    );
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
};
