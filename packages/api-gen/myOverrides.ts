import { components as mainComponents } from "./apiSchema";

type GenericRecord =
  | never
  | null
  | string
  | string[]
  | number
  | { [key: string]: GenericRecord }; // TODO: [OpenAPI] - define GenericRecord properly

export type components = mainComponents;
//   & {
//   schemas: schemas;
// };

export type Schemas = {
  AccountNewsletterRecipientResult: {
    // TODO: [OpenAPI][AccountNewsletterRecipientResult] - update type definition
    apiAlias: "account_newsletter_recipient";
    status: "undefined" | "notSet" | "direct" | "optIn" | "optOut";
  };
  // TODO: [OpenAPI][CalculatedPrice] - define CalculatedPrice with proper fields + define calculated_cheapest_price entity as well
  CalculatedPrice: {
    apiAlias: "calculated_price";
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    calculatedTaxes: GenericRecord[];
    taxRules: GenericRecord[];
    referencePrice?: {
      price: number;
      referenceUnit: number;
      unitName: string;
    };
    hasRange?: boolean;
    listPrice: {
      price: number;
      discount: number;
      percentage: number;
      apiAlias: string;
    } | null;
    regulationPrice: null | {
      price: number;
    };
    variantId?: string;
  };
  Cart: components["schemas"]["ArrayStruct"] & {
    /** An affiliate tracking code */
    affiliateCode?: string;
    /** A campaign tracking code */
    campaignCode?: string;
    /** A comment that can be added to the cart. */
    customerComment?: string;
    deliveries?: components["schemas"]["OrderDelivery"][]; // TODO: [OpenAPI][Cart] - `deliveries` is missing in schema
    /** A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers. */
    errors: // TODO: [OpenAPI][Cart] - define errors properly, `key` and `message` should be required fields. `Errors` should be required field as well. Problem is that sometimes it's an array, and sometimes map object
    | []
      // | {
      //     key: string;
      //     code: string;
      //     details: string;
      //     level?: string;
      //     message: string;
      //   }[]
      | Record<
          string,
          {
            code: number;
            key: string;
            level: number;
            message: string;
            messageKey: string;
          }
        >;
    /** All items within the cart */
    lineItems?: components["schemas"]["LineItem"][];
    modified?: boolean;
    /** Name of the cart - for example `guest-cart` */
    name?: string;
    price?: {
      /**
       * Format: float
       * Net price of the cart
       */
      netPrice?: number;
      /**
       * Format: float
       * Price for all line items in the cart
       */
      positionPrice?: number;
      /** Tax calculation for the cart. One of `gross`, `net` or `tax-free` */
      taxStatus?: string;
      /**
       * Format: float
       * Total price of the cart, including shipping costs, discounts and taxes
       */
      totalPrice?: number;
    };
    /** Context token identifying the cart and the user session */
    token?: string;
    /** A list of all payment transactions associated with the current cart. */
    transactions?: {
      paymentMethodId?: string;
    }[];
  };
  /** Added since version: 6.0.0.0 */
  Category: {
    apiAlias: "category"; // TODO: [OpenAPI][Category] - define apiAlias properly
    active?: boolean;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    breadcrumb: string[]; // TODO: [OpenAPI][Category] - define breadcrumb properly
    /** Format: int64 */
    childCount: number; // TODO: [OpenAPI][Category] childCount field should be defined as required
    children: components["schemas"]["Category"][]; // TODO: [OpenAPI][Category] - define children as required array
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    cmsPageIdSwitched?: boolean;
    cmsPageVersionId?: string;
    /** Format: date-time */
    createdAt: string;
    customEntityTypeId?: string;
    customFields?: GenericRecord;
    description?: string;
    displayNestedProducts: boolean;
    externalLink?: string;
    id: string; // TODO: [OpenAPI][Category] - define id as required field
    internalLink?: string;
    keywords?: string;
    /** Format: int64 */
    level?: number;
    linkNewTab?: boolean;
    linkType?: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    parent?: components["schemas"]["Category"];
    parentId?: string;
    parentVersionId?: string;
    path?: string;
    productAssignmentType: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    tags?: components["schemas"]["Tag"][];
    translated?: {
      afterCategoryId?: string;
      afterCategoryVersionId?: string;
      breadcrumb?: string[]; // TODO: [OpenAPI][Category] - define breadcrumb properly
      cmsPageId?: string;
      cmsPageVersionId?: string;
      customEntityTypeId?: string;
      description?: string;
      externalLink?: string;
      internalLink?: string;
      keywords?: string;
      linkType?: string;
      mediaId?: string;
      metaDescription?: string;
      metaTitle?: string;
      name?: string;
      parentId?: string;
      parentVersionId?: string;
      path?: string;
      productAssignmentType?: string;
      type?: string;
      versionId?: string;
    };
    type: string;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
    visible?: boolean;
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    visibleChildCount?: number;
  };
  /** Added since version: 6.0.0.0 */
  CmsBlock: {
    apiAlias: "cms_block"; // TODO: [OpenAPI][CmsBlock] - define apiAlias properly
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    cmsSectionVersionId?: string;
    /** Format: date-time */
    createdAt: string;
    cssClass?: string;
    customFields?: GenericRecord;
    extensions?: {
      swagCmsExtensionsBlockRule?: {
        data?: {
          /** @example c426e9e5d9031b933f89682d49bb02b1 */
          id?: string;
          /** @example swag_cms_extensions_block_rule */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /cms-block/9c16ffe823ddccc710bfb336c2ef30b6/swagCmsExtensionsBlockRule
           */
          related?: string;
        };
      };
      swagCmsExtensionsQuickview?: {
        data?: {
          /** @example fae098a43df8714eda5249176ffcf26c */
          id?: string;
          /** @example swag_cms_extensions_quickview */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /cms-block/9c16ffe823ddccc710bfb336c2ef30b6/swagCmsExtensionsQuickview
           */
          related?: string;
        };
      };
    };
    id?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    name?: string;
    /** Format: int64 */
    position: number;
    sectionId: string;
    sectionPosition?: string;
    slots: components["schemas"]["CmsSlot"][]; // TODO: [OpenAPI][CmsBlock] - define slots as required array
    type: string;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
    visibility?: {
      desktop?: boolean;
      mobile?: boolean;
      tablet?: boolean;
    };
  };
  /** Added since version: 6.0.0.0 */
  CmsSection: {
    apiAlias: "cms_section"; // TODO: [OpenAPI][CmsSection] - define apiAlias properly
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    blocks: components["schemas"]["CmsBlock"][]; // TODO: [OpenAPI][CmsSection] - define blocks as required array
    cmsPageVersionId?: string;
    /** Format: date-time */
    createdAt: string;
    cssClass?: string;
    customFields?: GenericRecord;
    extensions?: {
      swagCmsExtensionsScrollNavigation?: {
        data?: {
          /** @example 425b8d6ec722d74191c6d39370af19dc */
          id?: string;
          /** @example swag_cms_extensions_scroll_navigation */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /cms-section/d08def49fa8924d6f4a32bdb448d5fba/swagCmsExtensionsScrollNavigation
           */
          related?: string;
        };
      };
    };
    id?: string;
    mobileBehavior?: string;
    name?: string;
    page?: components["schemas"]["CmsPage"];
    pageId: string;
    /** Format: int64 */
    position: number;
    sizingMode?: string;
    type: string;
    /** Format: date-time */
    updatedAt?: string;
    visibility?: {
      desktop?: boolean;
      mobile?: boolean;
      tablet?: boolean;
    };
  };
  /** Search parameters. For more information, see our documentation on [Search Queries](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#structure) */
  Criteria: {
    /** Used to perform aggregations on the search result. For more information, see [Search Queries > Aggregations](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#aggregations) */
    aggregations?: {
      /** The field you want to aggregate over. */
      field: string;
      /** Give your aggregation an identifier, so you can find it easier */
      name: string;
      /** The type of aggregation */
      type: string;
      /** Used to perform aggregations on the search result. For more information, see [Search Queries > Aggregations](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#aggregations) */
      aggregation?: {
        /** The field you want to aggregate over. */
        field: string;
        /** Give your aggregation an identifier, so you can find it easier */
        name: string;
        /** The type of aggregation */
        type: string;
      };
    }[];
    includes?: GenericRecord; // TODO: [OpenAPI][Criteria] - define includes properly
    /** Used to fetch associations which are not fetched by default. */
    associations?: GenericRecord;
    /** Fields which should be returned in the search result. */
    fields?: string[];
    /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
    filter?: {
      // TODO: [OpenAPI][Criteria] - there can be different filters, for example `equalsAny` can have array as value
      field: string;
      type: string;
      value?: string | string[] | boolean;
      parameters?: {
        gte?: string;
        lte?: string;
      };
    }[];
    /** Perform groupings over certain fields */
    grouping?: string[];
    /** Number of items per result page */
    limit?: number;
    /** Search result page */
    page?: number;
    /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
    "post-filter"?: {
      field: string;
      type: string;
      value: string;
    }[];
    /** Sorting in the search result. */
    sort?: {
      field: string;
      naturalSorting?: boolean;
      order?: string;
    }[];
    /**
     * Whether the total for the total number of hits should be determined for the search query. none = disabled total count, exact = calculate exact total amount (slow), next-pages = calculate only for next page (fast)
     * @default none
     * @enum {string}
     */
    "total-count-mode"?: "none" | "exact" | "next-pages";
  };
  CrossSellingElementCollection: {
    // TODO: [OpenAPI][CrossSellingElementCollection] - define CrossSellingElement instead of collection
    crossSelling: {
      // TODO: [OpenAPI][CrossSellingElementCollection] - define crossSelling as required
      active?: boolean;
      /** Format: int32 */
      limit?: number;
      name?: string;
      /** Format: int32 */
      position?: number;
      productId?: string;
      productStreamId?: string;
      sortBy?: string;
      sortDirection?: string;
      type?: string;
    };
    products: components["schemas"]["Product"][]; // TODO: [OpenAPI][CrossSellingElementCollection] - define products array as required
    /** Format: int32 */
    total?: number;
  }[];
  /** Added since version: 6.0.0.0 */
  Customer: {
    accountType: string;
    active?: boolean;
    activeBillingAddress: components["schemas"]["CustomerAddress"]; // TODO: [OpenAPI][Customer] - define activeBillingAddress as required
    activeShippingAddress: components["schemas"]["CustomerAddress"]; // TODO: [OpenAPI][Customer] - define activeShippingAddress as required
    addresses?: components["schemas"]["CustomerAddress"][];
    affiliateCode?: string;
    birthday?: string;
    campaignCode?: string;
    company?: string;
    /** Format: date-time */
    createdAt: string;
    createdById?: string;
    customerNumber: string;
    customFields?: GenericRecord;
    defaultBillingAddress?: components["schemas"]["CustomerAddress"];
    defaultBillingAddressId: string;
    defaultPaymentMethod?: components["schemas"]["PaymentMethod"];
    defaultPaymentMethodId: string;
    defaultShippingAddress?: components["schemas"]["CustomerAddress"];
    defaultShippingAddressId: string;
    /** Format: date-time */
    doubleOptInConfirmDate?: string;
    /** Format: date-time */
    doubleOptInEmailSentDate?: string;
    doubleOptInRegistration?: boolean;
    email: string;
    extensions?: {
      specificFeatures?: {
        data?: {
          /** @example 5cfb6fcb7542e25892e1a35cd6a06c54 */
          id?: string;
          /** @example customer_specific_features */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /customer/ce26601dac0dea138b7295f02b7620a7/specificFeatures
           */
          related?: string;
        };
      };
    };
    /** Format: date-time */
    firstLogin?: string;
    firstName: string;
    group?: components["schemas"]["CustomerGroup"];
    groupId: string;
    guest?: boolean;
    hash?: string;
    id?: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    /** Format: date-time */
    lastLogin?: string;
    lastName: string;
    /** Format: date-time */
    lastOrderDate?: string;
    lastPaymentMethod?: components["schemas"]["PaymentMethod"];
    lastPaymentMethodId?: string;
    /** Format: int64 */
    orderCount?: number;
    /** Format: float */
    orderTotalAmount?: number;
    /** Format: int64 */
    reviewCount?: number;
    salesChannelId: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    tagIds?: readonly string[];
    tags?: components["schemas"]["Tag"][];
    title?: string;
    /** Format: date-time */
    updatedAt?: string;
    updatedById?: string;
    vatIds?: string[];
  };
  /** Added since version: 6.0.0.0 */
  CustomerAddress: {
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    city: string;
    company?: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    countryStateId?: string;
    /** Format: date-time */
    createdAt: string;
    customerId: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string; // TODO: [OpenAPI][CustomerAddress] - make `id` required
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    street: string;
    title?: string;
    /** Format: date-time */
    updatedAt?: string;
    zipcode?: string;
  };
  /** Added since version: 6.0.0.0 */
  CustomerGroup: {
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    displayGross?: boolean;
    id?: string;
    name: string;
    registrationActive?: boolean;
    registrationIntroduction?: string;
    registrationOnlyCompanyRegistration?: boolean;
    registrationSeoMetaDescription?: string;
    registrationTitle?: string;
    // TODO: [OpenAPI][CustomerGroup] - make `translated` required
    translated: {
      name?: string;
      registrationIntroduction?: string;
      registrationSeoMetaDescription?: string;
      registrationTitle?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
  };
  /** Added since version: 6.0.0.0 */
  Document: {
    // TODO: [OpenAPI][Document] - define config properly
    config: {
      name: string;
      title: string;
    };
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    deepLinkCode: string;
    dependentDocuments?: components["schemas"]["Document"][];
    documentMediaFile?: components["schemas"]["Media"];
    documentMediaFileId?: string;
    documentNumber?: string;
    documentType?: components["schemas"]["DocumentType"];
    documentTypeId: string;
    fileType: string;
    id: string; // TODO: [OpenAPI][Document] - make `id` required
    order?: components["schemas"]["Order"];
    orderId: string;
    orderVersionId?: string;
    referencedDocument?: components["schemas"]["Document"];
    referencedDocumentId?: string;
    sent?: boolean;
    static?: boolean;
    /** Format: date-time */
    updatedAt?: string;
  };
  /** Added since version: 6.4.0.0 */
  LandingPage: {
    apiAlias: "landing_page"; // TODO: [OpenAPI][LandingPage] - add `apiAlias` definition to schema
    active?: boolean;
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    id?: string;
    keywords?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    slotConfig?: GenericRecord;
    translated?: {
      cmsPageId?: string;
      cmsPageVersionId?: string;
      keywords?: string;
      metaDescription?: string;
      metaTitle?: string;
      name?: string;
      url?: string;
      versionId?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
    url: string;
    versionId?: string;
  };
  LineItem: {
    description?: string;
    good?: boolean;
    id: string; // TODO: [OpenAPI][LineItem] - make `id` required
    cover?: components["schemas"]["ProductMedia"]; // TODO: [OpenAPI][LineItem] - add `cover` definition to schema
    deliveryInformation: {
      // TODO: [OpenAPI][LineItem] - define `deliveryInformation` object and find out what's inside (`cart_delivery_information` entity)
      stock: number;
    };
    label?: string;
    modified?: boolean;
    /** Format: int32 */
    quantity: number; // TODO: [OpenAPI][LineItem] - make `quantity` required
    payload: {
      // TODO: [OpenAPI][LineItem] - add `payload` definition to schema (find out what's inside)
      options: Array<{
        group: string;
        option: string;
        translated: {
          [key: string]: string;
        };
      }>;
      name?: string;
    };
    price: {
      // TODO: [OpenAPI][LineItem] - define price object, also UNIFY price objects across responses
      listPrice?: {
        /** Format: float */
        discount?: number;
        /** Format: float */
        percentage?: number;
        /** Format: float */
        price?: number;
      };
      /** Format: int64 */
      quantity: number;
      referencePrice?: GenericRecord;
      regulationPrice?: {
        /** Format: float */
        price?: number;
      };
      taxRules?: GenericRecord;
      /** Format: float */
      totalPrice: number;
      /** Format: float */
      unitPrice: number;
    };
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    states: string[]; // TODO: [OpenAPI][LineItem] - add definition of `states` array, also union type of possible states
    type: "product" | "promotion" | "custom" | "credit"; // TODO: [OpenAPI][LineItem] - define type as required and string union type -> see also #456
  };
  /** Added since version: 6.0.0.0 */
  Media: {
    alt?: string;
    config?: GenericRecord;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    extensions?: {
      mediaAiTag?: {
        data?: {
          /** @example 3c88197809d464216a8c40a8db191b38 */
          id?: string;
          /** @example media_ai_tag */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /media/3b563524fdb17b4a86590470d40bef74/mediaAiTag
           */
          related?: string;
        };
      };
    };
    fileExtension: string; // TODO: [OpenAPI][Media] fileExtension field should be defined as required
    fileName: string; // TODO: [OpenAPI][Media] fileName field should be defined as required
    /** Format: int64 */
    fileSize?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    hasFile?: boolean;
    id?: string;
    // TODO: [OpenAPI][Media] metaData field should be defined properly
    metaData?: {
      /** Format: int64 */
      height?: number;
      /** Format: int64 */
      width?: number;
    };
    mimeType?: string;
    path?: string;
    private?: boolean;
    thumbnails?: components["schemas"]["MediaThumbnail"][];
    title?: string;
    translated?: {
      alt?: string;
      fileExtension?: string;
      fileName?: string;
      mimeType?: string;
      path?: string;
      title?: string;
      uploadedAt?: string;
      url?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
    /** Format: date-time */
    uploadedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url: string; // TODO: [OpenAPI][Media] url field should be defined as required
  };
  /** Added since version: 6.0.0.0 */
  MediaThumbnail: {
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    /** Format: int64 */
    height: number;
    id?: string;
    mediaId: string;
    path?: string;
    /** Format: date-time */
    updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url: string; // TODO: [OpenAPI][MediaThumbnail] url should be defined as required
    /** Format: int64 */
    width: number;
  };
  NavigationType: // TODO: [OpenAPI][NavigationType] - add `NavigationType` definition to schema
  "main-navigation" | "footer-navigation" | "service-navigation";
  /** Added since version: 6.0.0.0 */
  Order: {
    addresses?: components["schemas"]["OrderAddress"][];
    affiliateCode?: string;
    /** Format: float */
    amountNet?: number;
    /** Format: float */
    amountTotal?: number;
    billingAddress?: components["schemas"]["OrderAddress"];
    billingAddressId: string;
    billingAddressVersionId?: string;
    campaignCode?: string;
    /** Format: date-time */
    createdAt: string;
    createdById?: string;
    currency?: components["schemas"]["Currency"];
    /** Format: float */
    currencyFactor: number;
    currencyId: string;
    customerComment?: string;
    customFields?: GenericRecord;
    deepLinkCode?: string;
    deliveries?: components["schemas"]["OrderDelivery"][];
    documents: components["schemas"]["Document"][]; // TODO: [OpenAPI][Order] - documents should be defined as required
    extensions?: {
      returns?: {
        data?: {
          /** @example 7fff84525c6516919851a9005373f87e */
          id?: string;
          /** @example order_return */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/returns
           */
          related?: string;
        };
      };
      subscription?: {
        data?: {
          /** @example b48b13e73a6ac2a86dc54425dd24d9ff */
          id?: string;
          /** @example subscription */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/subscription
           */
          related?: string;
        };
      };
    };
    id: string; // TODO: [OpenAPI][Order] id field should be defined as required
    language?: components["schemas"]["Language"];
    languageId: string;
    lineItems?: components["schemas"]["OrderLineItem"][];
    orderCustomer?: components["schemas"]["OrderCustomer"];
    orderDate: string; // TODO: [OpenAPI][Order] orderDate field should be defined as required
    /** Format: date-time */
    orderDateTime: string;
    orderNumber?: string;
    /** Format: float */
    positionPrice?: number;
    price?: {
      calculatedTaxes?: GenericRecord;
      /** Format: float */
      netPrice: number;
      /** Format: float */
      positionPrice: number;
      /** Format: float */
      rawTotal: number;
      taxRules?: GenericRecord;
      taxStatus: string;
      /** Format: float */
      totalPrice: number;
    };
    salesChannelId: string;
    shippingCosts?: {
      calculatedTaxes?: GenericRecord;
      listPrice?: {
        /** Format: float */
        discount?: number;
        /** Format: float */
        percentage?: number;
        /** Format: float */
        price?: number;
      };
      /** Format: int64 */
      quantity: number;
      referencePrice?: GenericRecord;
      regulationPrice?: {
        /** Format: float */
        price?: number;
      };
      taxRules?: GenericRecord;
      /** Format: float */
      totalPrice: number;
      /** Format: float */
      unitPrice: number;
    };
    /** Format: float */
    shippingTotal?: number;
    source?: string;
    stateMachineState: components["schemas"]["StateMachineState"]; // TODO: [OpenAPI][Order] stateMachineState field should be defined as required
    tags?: components["schemas"]["Tag"][];
    taxStatus?: string;
    transactions?: components["schemas"]["OrderTransaction"][];
    /** Format: date-time */
    updatedAt?: string;
    updatedById?: string;
    versionId?: string;
  };
  /** Added since version: 6.0.0.0 */
  OrderAddress: {
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    city: string;
    company?: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    countryStateId?: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string; // TODO: [OpenAPI][OrderAddress] id field should be defined as required
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    street: string;
    title?: string;
    /** Format: date-time */
    updatedAt?: string;
    vatId?: string;
    versionId?: string;
    zipcode?: string;
  };
  /** Added since version: 6.0.0.0 */
  OrderLineItem: {
    children: components["schemas"]["OrderLineItem"][];
    cover?: components["schemas"]["Media"];
    coverId?: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    description?: string;
    downloads?: components["schemas"]["OrderLineItemDownload"][];
    extensions?: {
      returns?: {
        data?: {
          /** @example 7fff84525c6516919851a9005373f87e */
          id?: string;
          /** @example order_return_line_item */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /order-line-item/40b401ac0b29ac5c5c8ffce649fdef62/returns
           */
          related?: string;
        };
      };
      state?: {
        data?: {
          /** @example 9ed39e2ea931586b6a985a6942ef573e */
          id?: string;
          /** @example state_machine_state */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /order-line-item/40b401ac0b29ac5c5c8ffce649fdef62/state
           */
          related?: string;
        };
      };
    };
    good?: boolean;
    id?: string;
    identifier: string;
    label: string;
    orderDeliveryPositions?: components["schemas"]["OrderDeliveryPosition"][];
    orderId: string;
    orderVersionId?: string;
    parent?: components["schemas"]["OrderLineItem"];
    parentId?: string;
    parentVersionId?: string;
    payload: components["schemas"]["Product"]; // TODO: [OpenAPI][OrderLineItem] define possible payloads for order line items
    /** Format: int64 */
    position: number;
    priceDefinition?: GenericRecord;
    productId?: string;
    productVersionId?: string;
    /** Format: int64 */
    quantity: number;
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    states: string[];
    /** Format: float */
    totalPrice?: number;
    type?: string;
    /** Format: float */
    unitPrice?: number;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
  };
  /** Added since version: 6.4.19.0 */
  OrderLineItemDownload: {
    accessGranted: boolean;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    id: string; // TODO: [OpenAPI][OrderLineItemDownload] id should be defined as required
    media: components["schemas"]["Media"]; // TODO: [OpenAPI][OrderLineItemDownload] media should be defined as required
    mediaId: string;
    orderLineItem?: components["schemas"]["OrderLineItem"];
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    /** Format: int64 */
    position: number;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
  };
  OrderRouteResponse: {
    // TODO: [OpenAPI][OrderRouteResponse] - `orders` field should be required
    orders: {
      // TODO: [OpenAPI][OrderRouteResponse] orders field should be defined properly
      elements: components["schemas"]["Order"][];
    } & components["schemas"]["EntitySearchResult"];
    /** The key-value pairs contain the uuid of the order as key and a boolean as value, indicating that the payment method can still be changed. */
    paymentChangeable?: GenericRecord;
  };
  /** Added since version: 6.0.0.0 */
  PaymentMethod: {
    active?: boolean;
    afterOrderEnabled?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    asynchronous?: boolean;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    description?: string;
    distinguishableName?: string;
    id: string; // TODO: [OpenAPI][PaymentMethod] id should be defined as required
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    prepared?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    recurring?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    refundable?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    shortName?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    synchronous?: boolean;
    technicalName?: string;
    translated?: {
      description?: string;
      distinguishableName?: string;
      mediaId?: string;
      name?: string;
      shortName?: string;
      technicalName?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
  };
  /** Added since version: 6.0.0.0 */
  // TODO: [OpenAPI][Product] - null should be undefined by default to decrease payload size
  Product: {
    apiAlias: "product"; // TODO: [OpenAPI][Product] apiAlias field should be defined in schema as string literal
    active?: boolean;
    available?: boolean;
    /** Format: int64 */
    availableStock?: number;
    calculatedCheapestPrice?: Schemas["CalculatedPrice"]; // TODO: [OpenAPI][Product] calculatedCheapestPrice field should be defined exactly what it is
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    // TODO: [OpenAPI][Product] calculatedPrice field should be defined properly
    calculatedPrice?: Schemas["CalculatedPrice"];
    calculatedPrices?: Schemas["CalculatedPrice"][]; // TODO: [OpenAPI][Product] calculatedPrices field should be defined as an array and required!
    canonicalProduct?: components["schemas"]["Product"];
    canonicalProductId?: string;
    categories?: components["schemas"]["Category"][];
    categoriesRo?: components["schemas"]["Category"][];
    categoryIds?: readonly string[];
    categoryTree?: readonly string[];
    /** Format: int64 */
    childCount?: number;
    children?: components["schemas"]["Product"][];
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    configuratorSettings?: components["schemas"]["ProductConfiguratorSetting"][];
    cover?: components["schemas"]["ProductMedia"];
    coverId?: string;
    /** Format: date-time */
    createdAt: string;
    crossSellings?: components["schemas"]["ProductCrossSelling"][];
    customFields?: GenericRecord;
    deliveryTime?: components["schemas"]["DeliveryTime"];
    deliveryTimeId?: string;
    description?: string;
    displayGroup?: string;
    downloads?: components["schemas"]["ProductDownload"][];
    ean?: string;
    extensions?: {
      reviewSummaries?: {
        data?: {
          /** @example c9c718522e64ffa5effb26cef94f4849 */
          id?: string;
          /** @example product_review_summary */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/reviewSummaries
           */
          related?: string;
        };
      };
      swagCustomizedProductsTemplate?: {
        data?: {
          /** @example 6e9fad30dd3cb84748a01bb8152f4769 */
          id?: string;
          /** @example swag_customized_products_template */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/swagCustomizedProductsTemplate
           */
          related?: string;
        };
      };
    };
    /** Format: float */
    height?: number;
    id: string; // TODO: [OpenAPI][Product] id field should be required in schema
    isCloseout?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    isNew?: boolean;
    keywords?: string;
    /** Format: float */
    length?: number;
    mainCategories?: components["schemas"]["MainCategory"][];
    manufacturer?: components["schemas"]["ProductManufacturer"];
    manufacturerId?: string;
    manufacturerNumber?: string;
    markAsTopseller?: boolean;
    /** Format: int64 */
    maxPurchase?: number;
    media?: components["schemas"]["ProductMedia"][];
    metaDescription?: string;
    metaTitle?: string;
    /** Format: int64 */
    minPurchase?: number;
    name: string;
    optionIds?: readonly string[];
    options?: components["schemas"]["PropertyGroupOption"][];
    packUnit?: string;
    packUnitPlural?: string;
    parent?: components["schemas"]["Product"];
    parentId?: string;
    parentVersionId?: string;
    productManufacturerVersionId?: string;
    productMediaVersionId?: string;
    productNumber: string;
    productReviews?: components["schemas"]["ProductReview"][];
    properties?: components["schemas"]["PropertyGroupOption"][];
    propertyIds?: readonly string[];
    /** Format: int64 */
    purchaseSteps?: number;
    /** Format: float */
    purchaseUnit?: number;
    /** Format: float */
    ratingAverage?: number;
    /** Format: float */
    referenceUnit?: number;
    /** Format: date-time */
    releaseDate?: string;
    /** Format: int64 */
    restockTime?: number;
    /** Format: int64 */
    sales?: number;
    seoCategory: components["schemas"]["Category"]; // TODO: [OpenAPI][Product] seoCategory field should be defined as required
    seoUrls?: components["schemas"]["SeoUrl"][];
    shippingFree?: boolean;
    sortedProperties?: GenericRecord;
    states?: readonly string[];
    /** Format: int64 */
    stock: number;
    streamIds?: readonly string[];
    streams?: components["schemas"]["ProductStream"][];
    tagIds?: readonly string[];
    tags?: components["schemas"]["Tag"][];
    tax?: components["schemas"]["Tax"];
    taxId: string;
    translated?: {
      canonicalProductId?: string;
      cmsPageId?: string;
      cmsPageVersionId?: string;
      coverId?: string;
      deliveryTimeId?: string;
      description?: string;
      displayGroup?: string;
      ean?: string;
      keywords?: string;
      manufacturerId?: string;
      manufacturerNumber?: string;
      metaDescription?: string;
      metaTitle?: string;
      name?: string;
      packUnit?: string;
      packUnitPlural?: string;
      parentId?: string;
      parentVersionId?: string;
      productManufacturerVersionId?: string;
      productMediaVersionId?: string;
      productNumber?: string;
      releaseDate?: string;
      taxId?: string;
      unitId?: string;
      versionId?: string;
    };
    unit?: components["schemas"]["Unit"];
    unitId?: string;
    /** Format: date-time */
    updatedAt?: string;
    // TODO: [OpenAPI][Product] variantListingConfig field should be defined in schema
    variantListingConfig?: {
      displayParent: boolean;
    };
    versionId?: string;
    /** Format: float */
    weight?: number;
    /** Format: float */
    width?: number;
  };
  /** Represents a product along with detailed information required to display a variant selection. */
  ProductDetailResponse: {
    /** List of property groups with their corresponding options and information on how to display them. */
    configurator?: components["schemas"]["PropertyGroup"][];
    product: components["schemas"]["Product"]; // TODO: [OpenAPI][ProductDetailResponse] product field should be defined as required
  };
  ProductListingResult: components["schemas"]["EntitySearchResult"] & {
    /** Contains the available sorting. These can be used to show a sorting select-box in the product listing. */
    availableSortings?: Array<{
      // TODO: [OpenAPI][ProductListingResult] availableSortings field should be defined properly
      label: string;
      translated: {
        label: string;
      };
      key: string;
      priority: number;
      apiAlias: "product_sorting";
    }>;
    /** Contains the state of the filters. These can be used to create listing filters. */
    currentFilters: {
      // TODO: [OpenAPI][ProductListingResult] currentFilters field should be required
      manufacturer?: string[]; // TODO: [OpenAPI][ProductListingResult] currentFilters.manufacturer field should be defined properly
      navigationId?: string;
      price?: {
        max?: number;
        min?: number;
      };
      properties?: string[]; // TODO: [OpenAPI][ProductListingResult] currentFilters.properties field should be defined properly
      rating?: number;
      "shipping-free"?: boolean;
      search: string; // TODO: [OpenAPI][ProductListingResult] search field should be defined properly
    };
    elements: components["schemas"]["Product"][]; // TODO: [OpenAPI][ProductListingResult] elements field should be defined as required
    sorting?: string;
  };
  /** Added since version: 6.0.0.0 */
  ProductMedia: {
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    id?: string;
    media?: components["schemas"]["Media"];
    mediaId: string;
    /** Format: int64 */
    position?: number;
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
    thumbnails?: Array<components["schemas"]["MediaThumbnail"]>; // TODO: [OpenAPI][Product] thumbnails field should be defined in ProductMedia
  };
  /** Added since version: 6.0.0.0 */
  ProductReview: {
    comment?: string;
    content: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    customerId?: string; // TODO: [OpenAPI][ProductReview] customerId field should be defined
    externalUser?: string; // TODO: [OpenAPI][ProductReview] externalUser field should be defined
    id: string; // TODO: [OpenAPI][ProductReview] id field should be defined as required
    languageId: string;
    /** Format: float */
    points: number; // TODO: [OpenAPI][ProductReview] points field should be defined as required
    productId: string;
    productVersionId?: string;
    salesChannelId: string;
    status?: boolean;
    title: string;
    /** Format: date-time */
    updatedAt?: string;
  };
  /** Added since version: 6.0.0.0 */
  PropertyGroupOption: {
    colorHexCode?: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    group: {
      // components["schemas"]["PropertyGroup"]; // TODO: [OpenAPI][PropertyGroupOption] group field should be defined and required
      name: string;
    };
    groupId: string;
    id: string; // TODO: [OpenAPI][PropertyGroupOption] id field should be required in schema
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    option: string; // TODO: [OpenAPI][PropertyGroupOption] option field should be defined; defined as string (?)
    /** Format: int64 */
    position?: number;
    translated?: {
      colorHexCode?: string;
      groupId?: string;
      mediaId?: string;
      name?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
  };
  SalesChannelContext: components["schemas"]["ArrayStruct"] & {
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
    // currency?: {
    //   /** Format: int32 */
    //   decimalPrecision?: number;
    //   factor?: number;
    //   isoCode?: string;
    //   isSystemDefault?: boolean;
    //   name?: string;
    //   /** Format: int32 */
    //   position?: number;
    //   shortName?: string;
    //   symbol?: string;
    // };
    /** Customer group of the current user */
    currentCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    customer?: components["schemas"]["Customer"]; // TODO: [OpenAPI][SalesChannelContext] customer field should be defined reusing Customer schema
    // customer?: {
    //   active?: boolean;
    //   affiliateCode?: string;
    //   /** Format: int32 */
    //   autoIncrement?: number;
    //   /** Format: date-time */
    //   birthday?: string;
    //   campaignCode?: string;
    //   company?: string;
    //   customerNumber?: string;
    //   defaultBillingAddressId?: string;
    //   defaultPaymentMethodId?: string;
    //   defaultShippingAddressId?: string;
    //   /** Format: date-time */
    //   doubleOptInConfirmDate?: string;
    //   /** Format: date-time */
    //   doubleOptInEmailSentDate?: string;
    //   doubleOptInRegistration?: boolean;
    //   email?: string;
    //   /** Format: date-time */
    //   firstLogin?: string;
    //   firstName?: string;
    //   groupId?: string;
    //   guest?: boolean;
    //   hash?: string;
    //   languageId?: string;
    //   /** Format: date-time */
    //   lastLogin?: string;
    //   lastName?: string;
    //   /** Format: date-time */
    //   lastOrderDate?: string;
    //   lastPaymentMethodId?: string;
    //   legacyEncoder?: string;
    //   legacyPassword?: string;
    //   newsletter?: boolean;
    //   /** Format: int32 */
    //   orderCount?: number;
    //   password?: string;
    //   remoteAddress?: string;
    //   salesChannelId?: string;
    //   salutationId?: string;
    //   title?: string;
    // };
    /** Fallback group if the default customer group is not applicable */
    fallbackCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    /** Selected payment method */
    paymentMethod?: components["schemas"]["PaymentMethod"]; // TODO: [OpenAPI][SalesChannelContext] paymentMethod field should be defined properly reusing PaymentMethod schema
    // paymentMethod?: {
    //   active?: boolean;
    //   availabilityRuleId?: string;
    //   description?: string;
    //   formattedHandlerIdentifier?: string;
    //   handlerIdentifier?: string;
    //   mediaId?: string;
    //   name?: string;
    //   pluginId?: string;
    //   /** Format: int32 */
    //   position?: number;
    // };
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
    // shippingMethod?: {
    //   active?: boolean;
    //   availabilityRuleId?: string;
    //   deliveryTimeId?: string;
    //   description?: string;
    //   mediaId?: string;
    //   name?: string;
    //   trackingUrl?: string;
    // };
    /** Currently active tax rules and/or rates */
    taxRules?: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    /** Context the user session */
    token?: string;
  };
  /** Added since version: 6.0.0.0 */
  SeoUrl: {
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    /** Runtime field, cannot be used as part of the criteria. */
    error?: string;
    foreignKey: string;
    id?: string;
    isCanonical?: boolean;
    isDeleted?: boolean;
    isModified?: boolean;
    languageId: string;
    pathInfo: string;
    routeName: // TODO: [OpenAPI][SeoUrl] routeName field should be defined as union type
    | "frontend.navigation.page"
      | "frontend.landing.page"
      | "frontend.detail.page";
    salesChannelId?: string;
    seoPathInfo: string;
    /** Format: date-time */
    updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url?: string;
  };
  /** Added since version: 6.0.0.0 */
  ShippingMethod: {
    active?: boolean;
    availabilityRule?: components["schemas"]["Rule"];
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    deliveryTime?: components["schemas"]["DeliveryTime"];
    deliveryTimeId: string;
    description?: string;
    id: string; // TODO: [OpenAPI][ShippingMethod] id field should be required in schema
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    prices?: components["schemas"]["ShippingMethodPrice"][];
    tags?: components["schemas"]["Tag"][];
    tax?: components["schemas"]["Tax"];
    taxType: string;
    technicalName?: string;
    trackingUrl?: string;
    translated?: {
      deliveryTimeId?: string;
      description?: string;
      mediaId?: string;
      name?: string;
      taxType?: string;
      technicalName?: string;
      trackingUrl?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
  };
  Sitemap: components["schemas"]["ArrayStruct"] & {
    /** Format: date-time */
    created: string; // TODO: [OpenAPI][Sitemap] created field should be defined as required
    filename: string; // TODO: [OpenAPI][Sitemap] filename field should be defined as required
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
  WishlistLoadRouteResponse: {
    products: components["schemas"]["ProductListingResult"]; // TODO: [OpenAPI][WishlistLoadRouteResponse] - products is listing result, not array
    wishlist?: {
      customerId?: string;
      salesChannelId?: string;
    };
  };
};

export type operations = {
  "createCustomerAddress post /account/address": {
    contentType?: "application/json";
    accept?: "application/json";
    body: Omit<
      // TODO: [OpenAPI][createCustomerAddress] - omit id while creating address
      components["schemas"]["CustomerAddress"],
      "id" | "createdAt"
    >;
    response: components["schemas"]["CustomerAddress"];
    responseCode: 200;
  };
  "listAddress post /account/list-address": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["Criteria"];
    response: {
      // TODO: [OpenAPI][listAddress] add proper response type as EntitySearchResult
      elements: components["schemas"]["CustomerAddress"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readNewsletterRecipient post /account/newsletter-recipient": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readNewsletterRecipient] - body should be optional
    response: components["schemas"]["AccountNewsletterRecipientResult"]; // TODO: [OpenAPI][readNewsletterRecipient] return type is not array
    responseCode: 200;
  };
  "readProductDetail post /product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Product ID */
      productId: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readProductDetail] - body should be optional
    response: components["schemas"]["ProductDetailResponse"];
    responseCode: 200;
  };
  "register post /account/register": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Flag indicating accepted data protection */
      acceptedDataProtection: boolean;
      /**
       * Account type of the customer which can be either `private` or `business`.
       * @default private
       */
      accountType?: string;
      /** Field can be used to store an affiliate tracking code */
      affiliateCode?: string;
      billingAddress: Omit<
        components["schemas"]["CustomerAddress"],
        "createdAt" | "id" | "customerId" | "firstName" | "lastName"
      >; // TODO: [OpenAPI][register] - omit id, createdAt, customerId, firstName, lastName while creating address (or better to reverse and pick required fields)
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
      salutationId: string;
      shippingAddress?: components["schemas"]["CustomerAddress"];
      /** URL of the storefront for that registration. Used in confirmation emails. Has to be one of the configured domains of the sales channel. */
      storefrontUrl: string;
      /** (Academic) title of the customer */
      title?: string;
    };
    response: components["schemas"]["Customer"];
    responseCode: 200;
  };
  "readCategory post /category/{navigationId}": {
    contentType?: "application/json";
    accept?: "application/json";
    header?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean; // TODO: [OpenAPI][readCategory] - add header to the parameters
    };
    query?: {
      /** Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character */
      slots?: string;
    };
    pathParams: {
      /** Identifier of the category to be fetched */
      navigationId: string;
    };
    body: components["schemas"]["Criteria"] &
      components["schemas"]["ProductListingCriteria"];
    response: components["schemas"]["Category"];
    responseCode: 200;
  };
  "addLineItem post /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      // TODO: [OpenAPI][addLineItem] - add proper request body type with required fields
      items: Array<{
        id?: string; // TODO: [OpenAPI][addLineItem] - check if this is used at all?
        referencedId: string;
        quantity?: number;
        type: "product" | "promotion" | "custom" | "credit"; // TODO: [OpenAPI][addLineItem] - add proper type -> see also #456
      }>;
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "updateLineItem patch /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
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
  "handlePaymentMethod post /handle-payment": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** URL to which the client should be redirected after erroneous payment */
      errorUrl?: string;
      /** URL to which the client should be redirected after successful payment */
      finishUrl?: string;
      /** Identifier of an order */
      orderId: string;
    };
    response: {
      redirectUrl: string; // TODO: [OpenAPI][handlePaymentMethod] add proper response type
    };
    responseCode: 200;
  };
  "readLanguages post /language": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readLanguages] - body should be optional
    response: {
      elements: components["schemas"]["Language"][]; // TODO: [OpenAPI][readLanguages] add elements property as required
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readNavigation post /navigation/{activeId}/{rootId}": {
    contentType?: "application/json";
    accept?: "application/json";
    header?: {
      "sw-include-seo-urls"?: boolean; // TODO: [OpenAPI][readNavigation] - add sw-include-seo-urls to header parameters
    };
    pathParams: {
      /** Identifier of the active category in the navigation tree (if not used, just set to the same as rootId). */
      // TODO: [OpenAPI][readNavigation] add union type in definition
      activeId: Schemas["NavigationType"] | string;
      /** Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree. */
      // TODO: [OpenAPI][readNavigation] add union type in definition
      rootId: Schemas["NavigationType"] | string;
    };
    body: components["schemas"]["Criteria"] & {
      /** Return the categories as a tree or as a flat list. */
      buildTree?: GenericRecord[];
      /**
       * Format: int32
       * Determines the depth of fetched navigation levels.
       */
      depth?: number;
    };
    response: components["schemas"]["NavigationRouteResponse"];
    responseCode: 200;
  };
  "cancelOrder post /order/state/cancel": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** The identifier of the order to be canceled. */
      orderId: string; // TODO: [OpenAPI][cancelOrder] add orderId as required field
    };
    response: components["schemas"]["StateMachineState"];
    responseCode: 200;
  };
  "download post /document/download/{documentId}/{deepLinkCode}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      documentId: string;
      deepLinkCode: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][download] - body should be optional
    response: components["schemas"]["Document"];
    responseCode: 200;
  };
  "readCustomerWishlist post /customer/wishlist": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readCustomerWishlist] - body should be optional
    response: components["schemas"]["WishlistLoadRouteResponse"];
    responseCode: 200;
  };
  "readProduct post /product": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["Criteria"] & {
      ids?: string[]; // TODO: [OpenAPI][readProduct]: add `ids` as field to criteria - (is required?)
    };
    response: {
      elements: components["schemas"]["Product"][]; // TODO: [OpenAPI][readProduct]: add elements property as required
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readProductListing post /product-listing/{categoryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    header?: {
      "sw-include-seo-urls"?: boolean; // TODO: [OpenAPI][readProductListing] - add sw-include-seo-urls to header parameters
    };
    pathParams: {
      /** Identifier of a category. */
      categoryId: string;
    };
    body: components["schemas"]["ProductListingCriteria"] &
      components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "readProductReviews post /product/{productId}/reviews": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the product. */
      productId: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readProductReviews] - body should be optional
    response: {
      elements?: components["schemas"]["ProductReview"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readSalutation post /salutation": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readSalutation] - body should be optional
    response: {
      elements?: components["schemas"]["Salutation"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readSeoUrl post /seo-url": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["SeoUrl"][]; // TODO: [OpenAPI][readSeoUrl]: response should be `EntitySearchResult` and elements should be required
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readShippingMethod post /shipping-method": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["Criteria"];
    query: {
      /** List only available shipping methods. This filters shipping methods methods which can not be used in the actual context because of their availability rule. */
      onlyAvailable?: boolean;
    };
    response: {
      /** aggregation result */
      aggregations?: GenericRecord;
      elements: components["schemas"]["ShippingMethod"][]; // TODO: [OpenAPI][readShippingMethod]: response should be `EntitySearchResult` and elements should be required
      /** Total amount */
      total?: number;
    };
    responseCode: 200;
  };
  "readQuote post /quote/detail/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readQuote] - body with the criteria should be defined
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "readQuotes post /quotes": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: make body optional
    response: {
      elements?: components["schemas"]["Quote"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
};
