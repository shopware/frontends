/**
 * This file is auto-generated. Do not make direct changes to the file.
 * Instead override it in your shopware.d.ts file.
 *
 * Shopware API version: 6.6.10.0
 *
 */
type GenericRecord =
  | never
  | null
  | string
  | string[]
  | number
  | {
      [key: string]: GenericRecord;
    };
export type components = {
  schemas: Schemas;
};
export type Schemas = {
  AbstractDynamicPageOpenedPayload: {
    /** @default true */
    opened?: boolean;
    /** The id of the current dynamic page */
    pageId: string;
    /** The position of the dynamic page in the list of dynamic pages */
    position?: number;
    /** The type of the current dynamic page */
    type: string;
  };
  AccountNewsletterRecipient: {
    /** @enum {string} */
    apiAlias: "account_newsletter_recipient";
    /** @enum {string} */
    status: "undefined" | "notSet" | "direct" | "optIn" | "optOut";
  };
  AclRole: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchAction: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchActionSearchTerm: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchBoosting: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchConfig: {
    /** Format: date-time */
    readonly createdAt?: string;
    hitCount?: {
      category?: {
        /** Format: int64 */
        maxSearchCount?: number;
        /** Format: int64 */
        maxSuggestCount?: number;
      };
      product?: {
        /** Format: int64 */
        maxSearchCount?: number;
        /** Format: int64 */
        maxSuggestCount?: number;
      };
      product_manufacturer?: {
        /** Format: int64 */
        maxSearchCount?: number;
        /** Format: int64 */
        maxSuggestCount?: number;
      };
    };
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchConfigField: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchEntityStream: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchEntityStreamFilter: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AdvancedSearchSynonym: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Aggregation:
    | components["schemas"]["AggregationMetrics"]
    | (components["schemas"]["AggregationEntity"] &
        components["schemas"]["SubAggregations"])
    | (components["schemas"]["AggregationFilter"] &
        components["schemas"]["SubAggregations"])
    | (components["schemas"]["AggregationTerms"] &
        components["schemas"]["SubAggregations"])
    | (components["schemas"]["AggregationHistogram"] &
        components["schemas"]["SubAggregations"])
    | (components["schemas"]["AggregationRange"] &
        components["schemas"]["SubAggregations"]);
  AggregationEntity: {
    /** The entity definition e.g "product_manufacturer". */
    definition: string;
    /** The field you want to aggregate over. */
    field: string;
    /** Give your aggregation an identifier, so you can find it easier */
    name: string;
    /**
     * The type of aggregation
     * @enum {string}
     */
    type: "entity";
  };
  AggregationFilter: {
    filter: components["schemas"]["Filters"][];
    /** Give your aggregation an identifier, so you can find it easier */
    name: string;
    /**
     * The type of aggregation
     * @enum {string}
     */
    type: "filter";
  };
  AggregationHistogram: {
    /** The field you want to aggregate over. */
    field: string;
    /** The format of the histogram */
    format?: string;
    /** The interval of the histogram */
    interval?: number;
    /** Give your aggregation an identifier, so you can find it easier */
    name: string;
    /** The timezone of the histogram */
    timeZone?: string;
    /**
     * The type of aggregation
     * @enum {string}
     */
    type: "histogram";
  };
  AggregationMetrics: {
    field: string;
    name: string;
    /** @enum {string} */
    type: "avg" | "count" | "max" | "min" | "stats" | "sum";
  };
  AggregationRange: {
    /** The field you want to aggregate over. */
    field: string;
    /** Give your aggregation an identifier, so you can find it easier */
    name: string;
    /** The ranges of the aggregation */
    ranges: (
      | {
          /** The lower bound of the range */
          from: number;
          /** The upper bound of the range */
          to: number;
        }
      | {
          /** The lower bound of the range */
          from: string;
        }
      | {
          /** The upper bound of the range */
          to: string;
        }
    )[];
    /**
     * The type of aggregation
     * @enum {string}
     */
    type: "range";
  };
  AggregationTerms: {
    /** The field you want to aggregate over. */
    field: string;
    /** The number of terms to return */
    limit?: number;
    /** Give your aggregation an identifier, so you can find it easier */
    name: string;
    /** Sorting the aggregation result. */
    sort?: components["schemas"]["Sort"][];
    /**
     * The type of aggregation
     * @enum {string}
     */
    type: "terms";
  };
  App: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppActionButton: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppAdministrationSnippet: {
    appId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    localeId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    value: string;
  };
  AppCmsBlock: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppFlowAction: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppFlowEvent: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppPaymentMethod: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppScriptCondition: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppShippingMethod: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppTemplate: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  AppointmentBasicSettingResponse: {
    /** The API alias of the appointment basic setting */
    apiAlias?: string;
    /** The name of the appointment */
    appointmentName?: string;
    /**
     * The type of attendee restriction
     * @enum {string}
     */
    attendeeRestrictionType?: "open" | "customer" | "rules";
    /** The booking link */
    bookingLink?: string | null;
    /**
     * Indicates if appointments can be booked
     * @default false
     */
    canBookAppointment?: boolean;
    /**
     * Indicates if request emails can be sent
     * @default false
     */
    canSendRequestEmail?: boolean;
    /**
     * The mode of the interaction
     * @enum {string}
     */
    mode?: "guided" | "self";
    /** The name of the sales channel */
    salesChannelName?: string;
    /**
     * The video and audio settings
     * @enum {string}
     */
    videoAudioSettings?: "none" | "both" | "audio-only";
  };
  ApprovalRule: {
    active?: boolean;
    businessPartnerCustomerId?: string;
    conditions?: {
      type?: string;
      value?: string;
    }[];
    description?: string;
    /** Format: uuid */
    id?: string;
    name?: string;
    priority?: number;
  };
  Association: {
    [key: string]: components["schemas"]["Association"];
  };
  Associations: {
    [key: string]: components["schemas"]["Criteria"];
  };
  AttendeeProductCollectionLastSeenResponse: {
    collection?: {
      lastSeen?: string[];
    };
  };
  AttendeeProductCollectionResponse: {
    collection?:
      | {
          liked?: string[];
        }
      | {
          disliked?: string[];
        };
  };
  AttendeeRespondInvitationResponse: {
    /**
     * The invitation status that client responded to
     * @enum {string}
     */
    answer?: "accepted" | "maybe" | "declined";
    appointment?: {
      /**
       * Format: date-time
       * The time the client can access the appointment
       */
      accessibleFrom?: string;
      /**
       * Format: date-time
       * The time the appointment will be closed, the client can not access
       */
      accessibleTo?: string;
      /** The appointment id */
      id?: string;
      /** The appointment status */
      status?: ("started" | "ended") | null;
    };
  };
  B2BProductDefinition: {
    id: string;
    quantity: number;
    name: string;
    productNumber: string;
    translated: {
      name?: string;
    };
    options: Array<{
      id: string;
      group: {
        translated: {
          name?: string;
        };
      };
      translated: {
        name?: string;
      };
    }>;
    calculatedPrice: {
      unitPrice: number;
      totalPrice: number;
    };
  };
  B2bBusinessPartner: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsApprovalRule: {
    affectedRole?: components["schemas"]["B2bComponentsRole"];
    affectedRoleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    reviewerRole?: components["schemas"]["B2bComponentsRole"];
    reviewerRoleId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsApprovalRuleAppScriptCondition: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsPendingOrder: {
    addresses?: components["schemas"]["B2bComponentsPendingOrderAddress"][];
    /** Format: float */
    readonly amountNet?: number;
    /** Format: float */
    readonly amountTotal?: number;
    approvalRule?: components["schemas"]["B2bComponentsApprovalRule"];
    approvalRuleId?: string;
    billingAddress?: components["schemas"]["B2bComponentsPendingOrderAddress"];
    billingAddressId: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    customFields?: GenericRecord;
    decidedBy?: components["schemas"]["B2bEmployee"];
    decidedById?: string;
    employee?: components["schemas"]["B2bEmployee"];
    employeeId: string;
    id?: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    order?: components["schemas"]["Order"];
    orderId?: string;
    /** Format: float */
    originalPrice?: number;
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
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
    reason?: string;
    salesChannelId: string;
    shippingMethod?: components["schemas"]["ShippingMethod"];
    shippingMethodId: string;
    stateId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    readonly taxStatus?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsPendingOrderAddress: {
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    city: string;
    company?: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    countryStateId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string;
    lastName: string;
    pendingOrder?: components["schemas"]["B2bComponentsPendingOrder"];
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    street: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatId?: string;
    zipcode?: string;
  };
  B2bComponentsRole: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Runtime field, cannot be used as part of the criteria. */
    default?: boolean;
    id: string;
    name: string;
    permissions?: GenericRecord[];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsShoppingList: {
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    customFields?: GenericRecord;
    employee?: components["schemas"]["B2bEmployee"];
    employeeId?: string;
    id: string;
    lineItems?: components["schemas"]["B2bComponentsShoppingListLineItem"][];
    name?: string;
    price?: components["schemas"]["Price"][];
    salesChannelId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
  };
  B2bComponentsShoppingListJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    customerId: string;
    customFields?: GenericRecord;
    employeeId?: string;
    id: string;
    name?: string;
    price?: components["schemas"]["Price"][];
    relationships?: {
      customer?: {
        data?: {
          /** @example 91ec1f9324753048c0096d036a694f86 */
          id?: string;
          /** @example customer */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-shopping-list/23cb3bfda723e05b43cb25a427ee5a25/customer
           */
          related?: string;
        };
      };
      employee?: {
        data?: {
          /** @example fa5473530e4d1a5a1e1eb53d2fedb10c */
          id?: string;
          /** @example b2b_employee */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-shopping-list/23cb3bfda723e05b43cb25a427ee5a25/employee
           */
          related?: string;
        };
      };
      lineItems?: {
        data?: {
          /** @example a042af1aa9f3853fe3cd7dabc065568f */
          id?: string;
          /** @example b2b_components_shopping_list_line_item */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-shopping-list/23cb3bfda723e05b43cb25a427ee5a25/lineItems
           */
          related?: string;
        };
      };
    };
    salesChannelId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
  };
  B2bComponentsShoppingListLineItem: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    price?: components["schemas"]["Price"][];
    product?: components["schemas"]["Product"];
    productId?: string;
    productVersionId?: string;
    /** Format: int64 */
    quantity: number;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsShoppingListLineItemJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    price?: components["schemas"]["Price"][];
    productId?: string;
    productVersionId?: string;
    /** Format: int64 */
    quantity: number;
    relationships?: {
      product?: {
        data?: {
          /** @example f5bf48aa40cad7891eb709fcf1fde128 */
          id?: string;
          /** @example product */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-shopping-list-line-item/30d48c8d92682de24e11d3f72c5dd1ea/product
           */
          related?: string;
        };
      };
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bEmployee: {
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    email: string;
    firstName: string;
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lastName: string;
    role?: components["schemas"]["B2bComponentsRole"];
    status?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bOrderEmployee: {
    /** Format: date-time */
    readonly createdAt?: string;
    firstName: string;
    id?: string;
    lastName: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bPermission: {
    /** Format: date-time */
    readonly createdAt?: string;
    dependencies?: string[];
    group: string;
    id: string;
    name: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  BaseInteraction: {
    /**
     * The time in seconds how long the interaction should be stored in the database
     * @default -1
     */
    lifeTimeInSeconds?: number;
    /**
     * The time when the interaction was triggered
     * @default now
     */
    triggeredAt?: string;
  };
  BasePresentationSlideData: {
    cmsPage?: components["schemas"]["CmsPage"];
    extensions?: {
      cmsPageRelation?: components["schemas"]["PresentationCmsPage"];
    };
  };
  Breadcrumb: {
    /** @enum {string} */
    apiAlias: "breadcrumb";
    categoryId: string;
    name: string;
    path: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    translated: {
      categoryId: string;
      customFields?: GenericRecord;
      description?: string;
      externalLink?: string;
      internalLink?: string;
      keywords?: string;
      linkNewTab?: boolean;
      /** @enum {string} */
      linkType?: "category" | "external" | "landing_page" | "product";
      metaDescription?: string;
      metaTitle?: string;
      name: string;
      path: string;
      slotConfig?: GenericRecord;
      type: string;
    };
    /** @enum {string} */
    type: "page" | "link" | "folder";
  };
  BreadcrumbCollection: components["schemas"]["Breadcrumb"][];
  CalculatedPrice: {
    /** @enum {string} */
    apiAlias: "calculated_price";
    calculatedTaxes: {
      /** @enum {string} */
      apiAlias: "cart_tax_calculated";
      price: number;
      tax: number;
      taxRate: number;
    }[];
    hasRange: boolean;
    listPrice: components["schemas"]["CartListPrice"] | null;
    netPrice: number;
    positionPrice: number;
    quantity: number;
    rawTotal: number;
    referencePrice: components["schemas"]["CartPriceReference"] | null;
    regulationPrice: {
      /** @enum {string} */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    /** Currently active tax rules and/or rates */
    taxRules: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    /** @enum {string} */
    taxStatus: "net" | "tax-free";
    totalPrice: number;
    unitPrice: number;
    /** Format: ^[0-9a-f]{32}$ */
    variantId?: string | null;
  };
  Cart: {
    /** An affiliate tracking code */
    affiliateCode?: string | null;
    /** @enum {string} */
    apiAlias: "cart";
    /** A campaign tracking code */
    campaignCode?: string | null;
    /** A comment that can be added to the cart. */
    customerComment?: string | null;
    deliveries?: components["schemas"]["CartDelivery"][];
    /** A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers. */
    errors?:
      | components["schemas"]["CartError"][]
      | {
          [key: string]: {
            code: number;
            key: string;
            level: number;
            message: string;
            messageKey: string;
          };
        };
    /** All items within the cart */
    lineItems?: components["schemas"]["LineItem"][];
    modified?: boolean;
    /** Name of the cart - for example `guest-cart` */
    name?: string;
    price: components["schemas"]["CalculatedPrice"];
    /** Context token identifying the cart and the user session */
    token?: string;
    /** A list of all payment transactions associated with the current cart. */
    transactions?: {
      amount?: components["schemas"]["CalculatedPrice"];
      paymentMethodId?: string;
    }[];
  };
  CartDelivery: {
    deliveryDate?: {
      /** Format: date-time */
      earliest?: string;
      /** Format: date-time */
      latest?: string;
    };
    location?: {
      address?: components["schemas"]["CustomerAddress"];
      /** @enum {string} */
      apiAlias?: "cart_delivery_shipping_location";
      country?: components["schemas"]["Country"];
      state?: components["schemas"]["CountryState"];
    };
    positions?: components["schemas"]["CartDeliveryPosition"][];
    shippingCosts?: components["schemas"]["CalculatedPrice"];
    shippingMethod?: components["schemas"]["ShippingMethod"];
  };
  CartDeliveryInformation: {
    /** @enum {string} */
    apiAlias: "cart_delivery_information";
    deliveryTime?: {
      /** @enum {string} */
      apiAlias?: "cart_delivery_time";
      max?: number;
      min?: number;
      name?: string;
      unit?: string;
    };
    freeDelivery?: boolean;
    height?: number;
    length?: number;
    restockTime?: number;
    stock?: number;
    weight?: number;
    width?: number;
  };
  CartDeliveryPosition: {
    deliveryDate?: {
      /** Format: date-time */
      earliest?: string;
      /** Format: date-time */
      latest?: string;
    };
    identifier?: string;
    lineItem?: components["schemas"]["LineItem"];
    price?: components["schemas"]["CalculatedPrice"];
  };
  CartError: {
    key: string;
    /**
     * * `0` - notice,
     *     * `10` - warning,
     *     * `20` - error
     * @enum {number}
     */
    level: 0 | 10 | 20;
    message: string;
    messageKey: string;
  };
  CartItems: {
    items: components["schemas"]["LineItem"][];
  };
  CartListPrice: {
    /** @enum {string} */
    apiAlias: "cart_list_price";
    discount?: number;
    percentage?: number;
    price?: number;
  };
  CartPriceQuantity: {
    /** @enum {string} */
    apiAlias: "cart_price_quantity";
    isCalculated?: boolean;
    listPrice?: components["schemas"]["CartListPrice"];
    price?: number;
    quantity?: number;
    regulationPrice?: {
      /** Format: float */
      price?: number;
    };
    taxRules?: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    type?: string;
  };
  CartPriceReference: {
    /** @enum {string} */
    apiAlias: "cart_price_reference";
    hasRange: boolean;
    listPrice: components["schemas"]["CartListPrice"] | null;
    price?: number;
    purchaseUnit?: number;
    referenceUnit?: number;
    regulationPrice: {
      /** @enum {string} */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    unitName: string;
    /** Format: ^[0-9a-f]{32}$ */
    variantId?: string | null;
  };
  Category: {
    active?: boolean;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    /** @enum {string} */
    apiAlias: "category";
    breadcrumb: string[];
    /** Format: int64 */
    readonly childCount: number;
    children: components["schemas"]["Category"][];
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    cmsPageIdSwitched?: boolean;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customEntityTypeId?: string;
    customFields?: GenericRecord;
    description?: string;
    displayNestedProducts?: boolean;
    externalLink?: string;
    id: string;
    internalLink?: string;
    keywords?: string;
    /** Format: int64 */
    readonly level?: number;
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
    readonly path?: string;
    productAssignmentType?: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    tags?: components["schemas"]["Tag"][];
    translated: {
      afterCategoryId: string;
      afterCategoryVersionId: string;
      breadcrumb: string[];
      cmsPageId: string;
      cmsPageVersionId: string;
      customEntityTypeId: string;
      description: string;
      externalLink: string;
      internalLink: string;
      keywords: string;
      linkType: string;
      mediaId: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      parentId: string;
      parentVersionId: string;
      path: string;
      productAssignmentType: string;
      type: string;
      versionId: string;
    };
    /** @enum {string} */
    type: "page" | "link";
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
    visible?: boolean;
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    visibleChildCount?: number;
  };
  CategoryJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    readonly breadcrumb?: GenericRecord[];
    /** Format: int64 */
    readonly childCount?: number;
    cmsPageId?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    cmsPageIdSwitched?: boolean;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customEntityTypeId?: string;
    customFields?: GenericRecord;
    description?: string;
    displayNestedProducts?: boolean;
    externalLink?: string;
    id: string;
    internalLink?: string;
    keywords?: string;
    /** Format: int64 */
    readonly level?: number;
    linkNewTab?: boolean;
    linkType?: string;
    mediaId?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    parentId?: string;
    parentVersionId?: string;
    readonly path?: string;
    productAssignmentType?: string;
    relationships?: {
      children?: {
        data?: {
          /** @example 268184c12df027f536154d099d497b31 */
          id?: string;
          /** @example category */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/children
           */
          related?: string;
        };
      };
      cmsPage?: {
        data?: {
          /** @example 7b1460918b1abb93311108f3dc021c9b */
          id?: string;
          /** @example cms_page */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/cmsPage
           */
          related?: string;
        };
      };
      media?: {
        data?: {
          /** @example 62933a2951ef01f4eafd9bdf4d3cd2f0 */
          id?: string;
          /** @example media */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/media
           */
          related?: string;
        };
      };
      parent?: {
        data?: {
          /** @example d0e45878043844ffc41aac437e86b602 */
          id?: string;
          /** @example category */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/parent
           */
          related?: string;
        };
      };
      seoUrls?: {
        data?: {
          /** @example 5321b5a71127b8b98cdd4b068ad56c4c */
          id?: string;
          /** @example seo_url */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/seoUrls
           */
          related?: string;
        };
      };
      tags?: {
        data?: {
          /** @example d57ac45256849d9b13e2422d91580fb9 */
          id?: string;
          /** @example tag */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /category/3adbdb3ac060038aa0e6e6c138ef9873/tags
           */
          related?: string;
        };
      };
    };
    translated: {
      afterCategoryId: string;
      afterCategoryVersionId: string;
      cmsPageId: string;
      cmsPageVersionId: string;
      customEntityTypeId: string;
      description: string;
      externalLink: string;
      internalLink: string;
      keywords: string;
      linkType: string;
      mediaId: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      parentId: string;
      parentVersionId: string;
      path: string;
      productAssignmentType: string;
      type: string;
      versionId: string;
    };
    type?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
    visible?: boolean;
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    visibleChildCount?: number;
  };
  ClientPresentationStateResponse: {
    stateForAll?: components["schemas"]["StateForAll"];
    stateForClients?: components["schemas"]["StateForClients"];
  };
  CmsBlock: {
    /** @enum {string} */
    apiAlias: "cms_block";
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    cmsSectionVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
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
    slots: components["schemas"]["CmsSlot"][];
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
    visibility?: {
      desktop?: boolean;
      mobile?: boolean;
      tablet?: boolean;
    };
  };
  CmsPage: {
    /** @enum {string} */
    apiAlias: "cms_page";
    config?: {
      backgroundColor?: string;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    cssClass?: string;
    customFields?: GenericRecord;
    entity?: string;
    extensions?: {
      swagCmsExtensionsScrollNavigationPageSettings?: {
        data?: {
          /** @example 8b835206d09f3dec1b733f6a78c7ba33 */
          id?: string;
          /** @example swag_cms_extensions_scroll_navigation_page_settings */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /cms-page/64bf107168bcd03626208c1764ce6890/swagCmsExtensionsScrollNavigationPageSettings
           */
          related?: string;
        };
      };
    };
    id: string;
    landingPages?: components["schemas"]["LandingPage"][];
    name?: string;
    previewMedia?: components["schemas"]["Media"];
    previewMediaId?: string;
    sections: components["schemas"]["CmsSection"][];
    translated: {
      cssClass: string;
      entity: string;
      name: string;
      previewMediaId: string;
      type: string;
      versionId: string;
    };
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  CmsPageActivity: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CmsPageDraft: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CmsSection: {
    /** @enum {string} */
    apiAlias: "cms_section";
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    blocks: components["schemas"]["CmsBlock"][];
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
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
    /** @enum {string} */
    type: "default" | "sidebar";
    /** Format: date-time */
    readonly updatedAt?: string;
    visibility?: {
      desktop?: boolean;
      mobile?: boolean;
      tablet?: boolean;
    };
  };
  CmsSlot: {
    /** @enum {string} */
    apiAlias: "cms_slot";
    block?: components["schemas"]["CmsBlock"];
    blockId: string;
    cmsBlockVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: {
      _uniqueIdentifier?: string;
    };
    extensions?: {
      swagCmsExtensionsForm?: {
        data?: {
          /** @example 0654ad514da002e9d77fa24ee33acd95 */
          id?: string;
          /** @example swag_cms_extensions_form */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /cms-slot/ac5ca6960137c6b8a97c90c11b71d4bb/swagCmsExtensionsForm
           */
          related?: string;
        };
      };
    };
    fieldConfig?: GenericRecord;
    id: string;
    locked?: boolean;
    slot: string;
    translated: {
      blockId: string;
      cmsBlockVersionId: string;
      config?: {
        content?: {
          value?: string;
        };
      };
      slot: string;
      type: string;
      versionId: string;
    };
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  Country: {
    active?: boolean;
    addressFormat: GenericRecord;
    advancedPostalCodePattern?: string;
    checkAdvancedPostalCodePattern?: boolean;
    checkPostalCodePattern?: boolean;
    checkVatIdPattern?: boolean;
    companyTax?: {
      /** Format: float */
      amount: number;
      currencyId: string;
      enabled: boolean;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    customerTax?: {
      /** Format: float */
      amount: number;
      currencyId: string;
      enabled: boolean;
    };
    customFields?: GenericRecord;
    defaultPostalCodePattern?: string;
    displayStateInRegistration?: boolean;
    forceStateInRegistration?: boolean;
    id: string;
    isEu?: boolean;
    iso?: string;
    iso3?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    postalCodeRequired?: boolean;
    shippingAvailable?: boolean;
    states?: components["schemas"]["CountryState"][];
    translated: {
      advancedPostalCodePattern: string;
      defaultPostalCodePattern: string;
      iso: string;
      iso3: string;
      name: string;
      vatIdPattern: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    vatIdPattern?: string;
    vatIdRequired?: boolean;
  };
  CountryJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    addressFormat: GenericRecord;
    advancedPostalCodePattern?: string;
    checkAdvancedPostalCodePattern?: boolean;
    checkPostalCodePattern?: boolean;
    checkVatIdPattern?: boolean;
    companyTax?: {
      /** Format: float */
      amount: number;
      currencyId: string;
      enabled: boolean;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    customerTax?: {
      /** Format: float */
      amount: number;
      currencyId: string;
      enabled: boolean;
    };
    customFields?: GenericRecord;
    defaultPostalCodePattern?: string;
    displayStateInRegistration?: boolean;
    forceStateInRegistration?: boolean;
    id: string;
    isEu?: boolean;
    iso?: string;
    iso3?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    postalCodeRequired?: boolean;
    relationships?: {
      states?: {
        data?: {
          /** @example 34d955a0df5f7af9c9b4e4dccb3c3564 */
          id?: string;
          /** @example country_state */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /country/59716c97497eb9694541f7c3d37b1a4d/states
           */
          related?: string;
        };
      };
    };
    shippingAvailable?: boolean;
    translated: {
      advancedPostalCodePattern: string;
      defaultPostalCodePattern: string;
      iso: string;
      iso3: string;
      name: string;
      vatIdPattern: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    vatIdPattern?: string;
    vatIdRequired?: boolean;
  };
  CountryState: {
    active?: boolean;
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    /** Format: int64 */
    position?: number;
    shortCode: string;
    translated: {
      countryId: string;
      name: string;
      shortCode: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CountryStateJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    /** Format: int64 */
    position?: number;
    shortCode: string;
    translated: {
      countryId: string;
      name: string;
      shortCode: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CreateAppointmentRequestBody: {
    /** The company name of the requester */
    companyName?: string;
    /**
     * Format: email
     * The email address of the requester
     */
    emailAddress: string;
    /** The first name of the requester */
    firstName: string;
    /** The last name of the requester */
    lastName: string;
    /** The message of the appointment */
    message?: string;
    /** The phone number of the requester */
    phoneNumber?: string;
    /** The id of the salutation */
    salutationId: string;
    /** The subject of the appointment */
    subject: string;
  };
  CreateInteractionRequestBody: components["schemas"]["DynamicInteractionBody"];
  Criteria: {
    aggregations?: components["schemas"]["Aggregation"][];
    associations?: components["schemas"]["Association"];
    /** Fields which should be returned in the search result. */
    fields?: string[];
    /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
    filter?: (
      | components["schemas"]["SimpleFilter"]
      | components["schemas"]["EqualsFilter"]
      | components["schemas"]["MultiNotFilter"]
      | components["schemas"]["RangeFilter"]
    )[];
    /** Perform groupings over certain fields */
    grouping?: string[];
    /** List of ids to search for */
    ids?: string[];
    includes?: components["schemas"]["Includes"];
    /** Number of items per result page */
    limit?: number;
    /** Search result page */
    page?: number;
    /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
    "post-filter"?: (
      | components["schemas"]["SimpleFilter"]
      | components["schemas"]["EqualsFilter"]
      | components["schemas"]["MultiNotFilter"]
      | components["schemas"]["RangeFilter"]
    )[];
    /** The query string to search for */
    query?: string;
    /** Sorting in the search result. */
    sort?: components["schemas"]["Sort"][];
    /** Search term */
    term?: string;
    "total-count-mode"?: components["schemas"]["TotalCountMode"];
  };
  CrossSellingElement: {
    /** @enum {string} */
    apiAlias: "cross_selling_element";
    crossSelling: components["schemas"]["ProductCrossSelling"];
    products: components["schemas"]["Product"][];
    /** Format: uuid */
    streamId?: string;
    /** Format: int32 */
    total: number;
  };
  CrossSellingElementCollection: components["schemas"]["CrossSellingElement"][];
  Currency: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Format: float */
    factor: number;
    id: string;
    isoCode: string;
    /** Runtime field, cannot be used as part of the criteria. */
    isSystemDefault?: boolean;
    itemRounding: {
      /** Format: int64 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
    name: string;
    /** Format: int64 */
    position?: number;
    shortName: string;
    symbol: string;
    /** Format: float */
    taxFreeFrom?: number;
    totalRounding: {
      /** Format: int64 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
    translated: {
      isoCode: string;
      name: string;
      shortName: string;
      symbol: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CurrencyCountryRounding: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CurrencyJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Format: float */
    factor: number;
    id: string;
    isoCode: string;
    /** Runtime field, cannot be used as part of the criteria. */
    isSystemDefault?: boolean;
    itemRounding: {
      /** Format: int64 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
    name: string;
    /** Format: int64 */
    position?: number;
    shortName: string;
    symbol: string;
    /** Format: float */
    taxFreeFrom?: number;
    totalRounding: {
      /** Format: int64 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
    translated: {
      isoCode: string;
      name: string;
      shortName: string;
      symbol: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomEntity: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomField: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomFieldSet: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomFieldSetRelation: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomPrice: {
    /** Format: date-time */
    readonly createdAt?: string;
    customer?: components["schemas"]["Customer"];
    customerGroup?: components["schemas"]["CustomerGroup"];
    customerGroupId?: string;
    customerId?: string;
    id: string;
    price: GenericRecord;
    product?: components["schemas"]["Product"];
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Customer: {
    active?: boolean;
    activeBillingAddress: components["schemas"]["CustomerAddress"];
    activeShippingAddress: components["schemas"]["CustomerAddress"];
    addresses?: components["schemas"]["CustomerAddress"][];
    affiliateCode?: string;
    /** @enum {string} */
    apiAlias: "customer";
    birthday?: string;
    campaignCode?: string;
    /** Format: date-time */
    readonly createdAt?: string;
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
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    /** Format: date-time */
    lastLogin?: string;
    lastName: string;
    /** Format: date-time */
    readonly lastOrderDate?: string;
    lastPaymentMethod?: components["schemas"]["PaymentMethod"];
    lastPaymentMethodId?: string;
    /** Format: int64 */
    readonly orderCount?: number;
    /** Format: float */
    readonly orderTotalAmount?: number;
    /** Format: int64 */
    readonly reviewCount?: number;
    salesChannelId: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    readonly tagIds?: string[];
    tags?: components["schemas"]["Tag"][];
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
  } & (
    | {
        /** @enum {string} */
        accountType: "private";
      }
    | {
        /** @enum {string} */
        accountType: "business";
        company: string;
        vatIds: [string, ...string[]];
      }
    | {
        /** @enum {string} */
        accountType: "private";
      }
    | {
        /** @enum {string} */
        accountType: "business";
        company: string;
        vatIds: [string, ...string[]];
      }
  );
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
    readonly createdAt?: string;
    customerId: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    street: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    zipcode?: string;
  };
  CustomerAddressBody: {
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    city: string;
    company?: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    countryStateId?: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    street: string;
    title?: string;
    zipcode?: string;
  };
  CustomerAddressRead: {
    country: components["schemas"]["Country"];
    countryState?: components["schemas"]["CountryState"];
    /** Format: date-time */
    createdAt: string;
    readonly customerId: string;
    readonly id?: string;
    salutation: components["schemas"]["Salutation"];
    /** Format: date-time */
    updatedAt: string | null;
  };
  CustomerGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    displayGross?: boolean;
    id: string;
    name: string;
    registrationActive?: boolean;
    registrationIntroduction?: string;
    registrationOnlyCompanyRegistration?: boolean;
    registrationSeoMetaDescription?: string;
    registrationTitle?: string;
    translated: {
      name: string;
      registrationIntroduction: string;
      registrationSeoMetaDescription: string;
      registrationTitle: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomerRecovery: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomerSpecificFeatures: {
    /** Format: date-time */
    readonly createdAt?: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    features: GenericRecord;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomerTag: {
    customerId: string;
    id?: string;
    tag?: components["schemas"]["Tag"];
    tagId: string;
  };
  CustomerWishlist: {
    /** Format: date-time */
    readonly createdAt?: string;
    customerId: string;
    customFields?: GenericRecord;
    id: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  CustomerWishlistProduct: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DeliveryInformation: unknown;
  DeliveryTime: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    /** Format: int64 */
    max: number;
    /** Format: int64 */
    min: number;
    name: string;
    translated: {
      name: string;
      unit: string;
    };
    unit: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DiscountLineItemPayload: {
    /** Format: float */
    discountPrice?: number;
    /** @enum {string} */
    discountType?: "percentage" | "absolute";
    /** Format: float */
    discountValue?: number;
  };
  Document: {
    config: {
      name: string;
      title: string;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deepLinkCode: string;
    dependentDocuments?: components["schemas"]["Document"][];
    documentA11yMediaFile?: components["schemas"]["Media"];
    documentA11yMediaFileId?: string;
    documentMediaFile?: components["schemas"]["Media"];
    documentMediaFileId?: string;
    documentNumber?: string;
    documentType?: components["schemas"]["DocumentType"];
    documentTypeId: string;
    fileType: string;
    id: string;
    order?: components["schemas"]["Order"];
    orderId: string;
    orderVersionId?: string;
    referencedDocument?: components["schemas"]["Document"];
    referencedDocumentId?: string;
    sent?: boolean;
    static?: boolean;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DocumentBaseConfig: {
    config?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    documentNumber?: string;
    documentTypeId: string;
    filenamePrefix?: string;
    filenameSuffix?: string;
    global?: boolean;
    id: string;
    logo?: components["schemas"]["Media"];
    logoId?: string;
    name: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DocumentBaseConfigSalesChannel: {
    /** Format: date-time */
    readonly createdAt?: string;
    documentBaseConfigId: string;
    documentTypeId?: string;
    id: string;
    salesChannelId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DocumentType: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    technicalName: string;
    translated: {
      name: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrAppointment: {
    /** Format: date-time */
    accessibleFrom?: string;
    /** Format: date-time */
    accessibleTo?: string;
    active?: boolean;
    attendeeRuleIds?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById: string;
    customFields?: GenericRecord;
    default?: boolean;
    dsrPresentationVersionId?: string;
    /** Format: date-time */
    endedAt?: string;
    guideUserId?: string;
    id?: string;
    isPreview?: boolean;
    name: string;
    presentationId: string;
    salesChannelDomainId: string;
    /** Format: date-time */
    startedAt?: string;
    translated: {
      accessibleFrom: string;
      accessibleTo: string;
      createdById: string;
      dsrPresentationVersionId: string;
      endedAt: string;
      guideUserId: string;
      name: string;
      presentationId: string;
      salesChannelDomainId: string;
      startedAt: string;
      updatedById: string;
      videoAudioSettings: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    videoAudioSettings?: string;
    videoChat?: components["schemas"]["DsrAppointmentVideoChat"];
  };
  DsrAppointmentAttendee: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    isBlocked?: boolean;
    /** Format: date-time */
    joinedAt?: string;
    /** Format: date-time */
    lastActive?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrAppointmentRequest: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrAppointmentVideoChat: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    name?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    url?: string;
  };
  DsrAttendeeProductCollection: {
    attendeeId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    productId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrCmsSlide: {
    cmsSection?: components["schemas"]["CmsSection"];
    cmsSectionId: string;
    cmsSectionVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    slideName: string;
    translated: {
      cmsSectionId: string;
      cmsSectionVersionId: string;
      slideName: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  DsrInteraction: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrPresentation: {
    active?: boolean;
    appointments?: components["schemas"]["DsrAppointment"][];
    cmsPages?: components["schemas"]["DsrPresentationCmsPage"][];
    /** Format: date-time */
    readonly createdAt?: string;
    createdById: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    parent?: components["schemas"]["DsrPresentation"];
    parentId?: string;
    parentVersionId?: string;
    translated: {
      createdById: string;
      name: string;
      parentId: string;
      parentVersionId: string;
      updatedById: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    versionId?: string;
  };
  DsrPresentationCmsPage: {
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    dsrPresentationVersionId?: string;
    id: string;
    isInstantListing?: boolean;
    pickedProductIds?: GenericRecord;
    /** Format: int64 */
    position?: number;
    presentationId: string;
    productId?: string;
    productStreamId?: string;
    productVersionId?: string;
    title?: string;
    translated: {
      cmsPageId: string;
      cmsPageVersionId: string;
      dsrPresentationVersionId: string;
      presentationId: string;
      productId: string;
      productStreamId: string;
      productVersionId: string;
      title: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DynamicInteractionBody:
    | components["schemas"]["EmptyInteraction"]
    | components["schemas"]["ProductInteraction"]
    | components["schemas"]["DynamicPageOpenedInteraction"]
    | components["schemas"]["DynamicPageClosedInteraction"]
    | components["schemas"]["DynamicProductPageOpenedInteraction"]
    | components["schemas"]["PageViewedInteraction"]
    | components["schemas"]["GuideHoveredInteraction"]
    | components["schemas"]["ToggleBroadcastModeInteraction"]
    | components["schemas"]["ViewModeChangedInteraction"]
    | components["schemas"]["ScreenSharingToggledInteraction"];
  DynamicPageClosedInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["DynamicPageClosedPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "dynamicPage.closed";
  };
  DynamicPageClosedPayload: {
    /**
     * Whether all pages were closed
     * @default false
     */
    all?: boolean;
    /** The id of the page that was closed */
    pageId?: string | null;
  };
  DynamicPageOpenedInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["DynamicPageOpenedPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "dynamicPage.opened";
  };
  DynamicPageOpenedPayload: components["schemas"]["AbstractDynamicPageOpenedPayload"];
  DynamicProductListingPageOpenedPayload: {
    /** Current page position in the pagination */
    page: number;
  };
  DynamicProductPageOpenedInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["DynamicProductPageOpenedPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "dynamicProductPage.opened";
  };
  DynamicProductPageOpenedPayload: {
    /** the id from the product which is shown on the dynamic page */
    productId: string;
  } & components["schemas"]["AbstractDynamicPageOpenedPayload"];
  EmptyInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: GenericRecord;
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name:
      | "keep.alive"
      | "quickview.opened"
      | "quickview.closed"
      | "attendee.leave"
      | "remote.checkout.accepted"
      | "remote.checkout.denied";
  };
  EmptyPayload: Record<string, never>;
  EntitySearchResult: {
    /** Contains aggregated data. A simple example is the determination of the average price from a product search query. */
    aggregations?: GenericRecord[];
    entity?: string;
    /** The actual limit. This is used for pagination and goes together with the page. */
    limit?: number;
    /** The actual page. This can be used for pagination. */
    page?: number;
    /** The total number of found entities */
    total?: number;
  };
  EqualsFilter: {
    field: string;
    /** @enum {string} */
    type: "equals";
    value: string | number | boolean | null;
  };
  Filters: (
    | components["schemas"]["SimpleFilter"]
    | components["schemas"]["EqualsFilter"]
    | components["schemas"]["MultiNotFilter"]
    | components["schemas"]["RangeFilter"]
  )[];
  FindProductVariantRouteResponse: {
    foundCombination?: {
      options?: string[];
      variantId?: string;
    };
  };
  Flow: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  FlowSequence: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  FlowTemplate: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  GuideHoveredInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["GuideHoveredPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "guide.hovered";
  };
  GuideHoveredPayload: {
    hoveredElementId?: string | null;
  };
  ImportExportFile: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ImportExportLog: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ImportExportProfile: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Includes: {
    [key: string]: string[];
  };
  Integration: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  JoinAppointmentResponse: {
    /** The name of the appointment */
    appointmentName?: string;
    /** The created Id for the attendee */
    attendeeId?: string;
    /** The name of the attendee */
    attendeeName?: string | null;
    /** The b2b features that available for the appointment */
    b2bFeatures?: {
      /** To know if the quote management is enabled for current customer */
      quoteManagement?: boolean;
    };
    /** The appointment id */
    id?: string;
    /** To see if it's a preview appointment */
    isPreview?: boolean;
    /** The JWT mercure token to subscribe for updates */
    JWTMercurePublisherToken?: string | null;
    /** The JWT mercure token to publish updates */
    JWTMercureSubscriberToken?: string | null;
    /** The mercure hub url to connect for subscribing and updating */
    mercureHubPublicUrl?: string | null;
    /** The topic to which the attendee/guide can send updates */
    mercurePublisherTopic?: string | null;
    /** The topics to which the attendee/guide can subscribe for */
    mercureSubscriberTopics?: string[];
    /** The new context token will be used in the header (sw-context-token) for calling the other routes */
    newContextToken?: string;
    /**
     * The type of the appointment
     * @enum {string}
     */
    presentationGuideMode?: "self" | "guided";
    /** The id of the current sales channel */
    salesChannelId?: string;
    /** The name of the current sales channel */
    salesChannelName?: string;
    /** The video user id that attendee could use */
    videoUserId?: string | null;
  };
  LandingPage: {
    active?: boolean;
    /** @enum {string} */
    apiAlias: "landing_page";
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    keywords?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    slotConfig?: GenericRecord;
    translated: {
      cmsPageId: string;
      cmsPageVersionId: string;
      keywords: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      url: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    url: string;
    versionId?: string;
  };
  LandingPageJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    keywords?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    relationships?: {
      cmsPage?: {
        data?: {
          /** @example 7b1460918b1abb93311108f3dc021c9b */
          id?: string;
          /** @example cms_page */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /landing-page/815c27537bec3b60c50a2ae4d2ce875d/cmsPage
           */
          related?: string;
        };
      };
      seoUrls?: {
        data?: {
          /** @example 5321b5a71127b8b98cdd4b068ad56c4c */
          id?: string;
          /** @example seo_url */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /landing-page/815c27537bec3b60c50a2ae4d2ce875d/seoUrls
           */
          related?: string;
        };
      };
    };
    slotConfig?: GenericRecord;
    translated: {
      cmsPageId: string;
      cmsPageVersionId: string;
      keywords: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      url: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    url: string;
    versionId?: string;
  };
  Language: {
    children?: components["schemas"]["Language"][];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    locale?: components["schemas"]["Locale"];
    localeId: string;
    name: string;
    parent?: components["schemas"]["Language"];
    parentId?: string;
    translationCode?: components["schemas"]["Locale"];
    translationCodeId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  LanguageJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    localeId: string;
    name: string;
    parentId?: string;
    relationships?: {
      children?: {
        data?: {
          /** @example 268184c12df027f536154d099d497b31 */
          id?: string;
          /** @example language */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /language/4994a8ffeba4ac3140beb89e8d41f174/children
           */
          related?: string;
        };
      };
      locale?: {
        data?: {
          /** @example fb216d9e8791e63c8d12bdc420956839 */
          id?: string;
          /** @example locale */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /language/4994a8ffeba4ac3140beb89e8d41f174/locale
           */
          related?: string;
        };
      };
      parent?: {
        data?: {
          /** @example d0e45878043844ffc41aac437e86b602 */
          id?: string;
          /** @example language */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /language/4994a8ffeba4ac3140beb89e8d41f174/parent
           */
          related?: string;
        };
      };
      translationCode?: {
        data?: {
          /** @example 6ef2035242b8fcb7b61c3a41850e60b3 */
          id?: string;
          /** @example locale */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /language/4994a8ffeba4ac3140beb89e8d41f174/translationCode
           */
          related?: string;
        };
      };
    };
    translationCodeId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  LineItem: {
    children?: components["schemas"]["LineItem"][];
    cover?: components["schemas"]["ProductMedia"];
    dataContextHash?: string;
    dataTimestamp?: string;
    deliveryInformation: components["schemas"]["CartDeliveryInformation"];
    description?: string;
    extensions?: {
      meta?: {
        attendees?: {
          id: string;
          name: string;
        }[];
      };
    };
    good?: boolean;
    id: string;
    label?: string;
    modified?: boolean;
    modifiedByApp?: boolean;
    payload: components["schemas"]["ProductJsonApi"];
    price?: {
      /** @enum {string} */
      apiAlias: "calculated_price";
      calculatedTaxes?: {
        /** @enum {string} */
        apiAlias: "cart_tax_calculated";
        price: number;
        tax: number;
        taxRate: number;
      }[];
      listPrice?: components["schemas"]["CartListPrice"] | null;
      quantity: number;
      referencePrice?: components["schemas"]["CartPriceReference"] | null;
      regulationPrice?: {
        /** @enum {string} */
        apiAlias?: "cart_regulation_price";
        price?: number;
      } | null;
      /** Currently active tax rules and/or rates */
      taxRules?: {
        name?: string;
        /** Format: float */
        taxRate?: number;
      }[];
      totalPrice: number;
      unitPrice: number;
    };
    priceDefinition?: components["schemas"]["CartPriceQuantity"];
    quantity: number;
    quantityInformation?: {
      maxPurchase?: number;
      minPurchase?: number;
      purchaseSteps?: number;
    };
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    states: ("is-physical" | "is-download")[];
    type: components["schemas"]["LineItemType"];
    uniqueIdentifier?: string;
  };
  LineItemType:
    | "product"
    | "credit"
    | "custom"
    | "promotion"
    | "discount"
    | "container"
    | "quantity"
    | "dsr-line-item-discount"
    | "dsr-cart-discount";
  ListPrice: {
    /** @enum {string} */
    apiAlias: "cart_list_price";
    discount?: number;
    percentage?: number;
    price?: number;
  };
  Locale: {
    code: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    territory: string;
    translated: {
      code: string;
      name: string;
      territory: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  LogEntry: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MailHeaderFooter: {
    /** Format: date-time */
    readonly createdAt?: string;
    description?: string;
    footerHtml?: string;
    footerPlain?: string;
    headerHtml?: string;
    headerPlain?: string;
    id?: string;
    name: string;
    systemDefault?: boolean;
    translated: {
      description: string;
      footerHtml: string;
      footerPlain: string;
      headerHtml: string;
      headerPlain: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MailTemplate: {
    contentHtml: string;
    contentPlain: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    extensions?: {
      swagCmsExtensionsForms?: {
        data?: {
          /** @example a08561237fe1e2a012502c820a08405d */
          id?: string;
          /** @example swag_cms_extensions_form */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /mail-template/901aa1bf1715ad482f037eaa8b9cdc3a/swagCmsExtensionsForms
           */
          related?: string;
        };
      };
    };
    id?: string;
    mailTemplateType?: components["schemas"]["MailTemplateType"];
    media?: components["schemas"]["MailTemplateMedia"][];
    senderName?: string;
    systemDefault?: boolean;
    translated: {
      contentHtml: string;
      contentPlain: string;
      senderName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MailTemplateMedia: {
    id: string;
    languageId: string;
    mailTemplateId: string;
    media?: components["schemas"]["Media"];
    mediaId: string;
    /** Format: int64 */
    position?: number;
  };
  MailTemplateType: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    technicalName: string;
    translated: {
      name: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MainCategory: {
    categoryId: string;
    categoryVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    productId: string;
    productVersionId?: string;
    salesChannelId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MainCategoryJsonApi: components["schemas"]["resource"] & {
    categoryId: string;
    categoryVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    productId: string;
    productVersionId?: string;
    salesChannelId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Media: {
    alt?: string;
    /** @enum {string} */
    apiAlias: "media";
    config?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
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
    readonly fileExtension: string;
    fileName: string;
    /** Format: int64 */
    readonly fileSize?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    hasFile: boolean;
    id: string;
    metaData?: {
      /** Format: int64 */
      height?: number;
      /** Format: int64 */
      width?: number;
    };
    mimeType?: string;
    path: string;
    private: boolean;
    thumbnails?: components["schemas"]["MediaThumbnail"][];
    title?: string;
    translated: {
      alt: string;
      fileExtension: string;
      fileName: string;
      mimeType: string;
      path: string;
      title: string;
      uploadedAt: string;
      url: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Format: date-time */
    readonly uploadedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url: string;
  };
  MediaAiTag: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    media?: components["schemas"]["Media"];
    tags?: GenericRecord[];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MediaDefaultFolder: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MediaFolder: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MediaFolderConfiguration: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MediaTag: {
    id?: string;
    media?: components["schemas"]["Media"];
    mediaId: string;
    tag?: components["schemas"]["Tag"];
    tagId: string;
  };
  MediaThumbnail: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Format: int64 */
    readonly height: number;
    id: string;
    mediaId: string;
    path?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url: string;
    /** Format: int64 */
    readonly width: number;
  };
  MediaThumbnailSize: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Format: int64 */
    height: number;
    id: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Format: int64 */
    width: number;
  };
  MultiNotFilter: {
    /** @enum {string} */
    operator: "and" | "or" | "nor" | "nand";
    queries: components["schemas"]["Filters"];
    /** @enum {string} */
    type: "multi" | "not";
  };
  NaturalLanguageSearchTermResponse: {
    /** @enum {string} */
    apiAlias: "product_natural_language_search_term";
    reason: string;
    term: string;
  }[];
  NavigationRouteResponse: components["schemas"]["Category"][];
  NavigationType:
    | "main-navigation"
    | "footer-navigation"
    | "service-navigation";
  NewsletterRecipient: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  NewsletterRecipientJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Notification: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  NumberRange: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  NumberRangeSalesChannel: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  NumberRangeState: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  NumberRangeType: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Order: {
    addresses?: components["schemas"]["OrderAddress"][];
    affiliateCode?: string;
    /** Format: float */
    readonly amountNet?: number;
    /** Format: float */
    readonly amountTotal?: number;
    billingAddress?: components["schemas"]["OrderAddress"];
    billingAddressId: string;
    billingAddressVersionId?: string;
    campaignCode?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    currency?: components["schemas"]["Currency"];
    /** Format: float */
    currencyFactor: number;
    currencyId: string;
    customerComment?: string;
    customFields?: GenericRecord;
    deepLinkCode?: string;
    deliveries?: components["schemas"]["OrderDelivery"][];
    documents: components["schemas"]["Document"][];
    extensions?: {
      orderEmployee?: {
        data?: {
          /** @example 5ea451c08a87db806089c4031601c29a */
          id?: string;
          /** @example b2b_order_employee */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/orderEmployee
           */
          related?: string;
        };
      };
      quote?: {
        data?: {
          /** @example 7a674c327bfa07f7c1204fb38ca6ef3b */
          id?: string;
          /** @example quote */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/quote
           */
          related?: string;
        };
      };
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
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lineItems?: components["schemas"]["OrderLineItem"][];
    orderCustomer?: components["schemas"]["OrderCustomer"];
    readonly orderDate: string;
    /** Format: date-time */
    orderDateTime: string;
    orderNumber?: string;
    /** Format: float */
    readonly positionPrice?: number;
    price: components["schemas"]["CalculatedPrice"];
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
    readonly shippingTotal?: number;
    source?: string;
    stateMachineState: components["schemas"]["StateMachineState"];
    tags?: components["schemas"]["Tag"][];
    readonly taxStatus?: string;
    transactions?: components["schemas"]["OrderTransaction"][];
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    versionId?: string;
  };
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
    readonly createdAt?: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    street: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatId?: string;
    versionId?: string;
    zipcode?: string;
  };
  OrderCustomer: {
    company?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customerNumber?: string;
    customFields?: GenericRecord;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatIds?: string[];
    versionId?: string;
  };
  OrderDelivery: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    orderId: string;
    orderVersionId?: string;
    positions?: components["schemas"]["OrderDeliveryPosition"][];
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
    /** Format: date-time */
    shippingDateEarliest: string;
    /** Format: date-time */
    shippingDateLatest: string;
    shippingMethod?: components["schemas"]["ShippingMethod"];
    shippingMethodId: string;
    shippingOrderAddress?: components["schemas"]["OrderAddress"];
    shippingOrderAddressId: string;
    shippingOrderAddressVersionId?: string;
    stateId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    trackingCodes?: string[];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderDeliveryPosition: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    orderDeliveryId: string;
    orderDeliveryVersionId?: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    price?: {
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
    /** Format: int64 */
    quantity?: number;
    /** Format: float */
    totalPrice?: number;
    /** Format: float */
    unitPrice?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderLineItem: {
    /** @enum {string} */
    apiAlias: "order_line_item";
    children: components["schemas"]["OrderLineItem"][];
    cover?: components["schemas"]["Media"];
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
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
    id: string;
    identifier: string;
    label: string;
    orderDeliveryPositions?: components["schemas"]["OrderDeliveryPosition"][];
    orderId: string;
    orderVersionId?: string;
    parent?: components["schemas"]["OrderLineItem"];
    parentId?: string;
    parentVersionId?: string;
    payload?: {
      readonly categoryIds?: string[];
      /** Format: date-time */
      readonly createdAt?: string;
      customFields?: GenericRecord;
      features?: unknown[];
      isCloseout?: boolean;
      isNew?: boolean;
      manufacturerId?: string;
      markAsTopseller?: boolean;
      readonly optionIds?: string[];
      options?: components["schemas"]["PropertyGroupOption"][];
      parentId?: string;
      productNumber?: string;
      readonly propertyIds?: string[];
      purchasePrices?: string;
      /** Format: date-time */
      releaseDate?: string;
      /** Format: int64 */
      stock?: number;
      readonly streamIds?: string[];
      readonly tagIds?: string[];
      taxId?: string;
    };
    /** Format: int64 */
    position?: number;
    priceDefinition?: components["schemas"]["CartPriceQuantity"];
    productId?: string;
    productVersionId?: string;
    promotionId?: string;
    /** Format: int64 */
    quantity: number;
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    states: string[];
    /** Format: float */
    totalPrice?: number;
    translated: {
      coverId: string;
      description: string;
      identifier: string;
      label: string;
      orderId: string;
      orderVersionId: string;
      parentId: string;
      parentVersionId: string;
      productId: string;
      productVersionId: string;
      promotionId: string;
      referencedId: string;
      type: string;
      versionId: string;
    };
    type?: string;
    /** Format: float */
    unitPrice?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderLineItemDownload: {
    accessGranted: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    media: components["schemas"]["Media"];
    mediaId: string;
    orderLineItem?: components["schemas"]["OrderLineItem"];
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    /** Format: int64 */
    position: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderProductWarehouse: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  OrderReturn: {
    /** Format: float */
    amountNet?: number;
    /** Format: float */
    amountTotal?: number;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    id: string;
    lineItems?: components["schemas"]["OrderReturnLineItem"][];
    orderId: string;
    orderVersionId?: string;
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
    /** Format: date-time */
    requestedAt: string;
    returnNumber: string;
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
    state?: components["schemas"]["StateMachineState"];
    stateId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    versionId?: string;
  };
  OrderReturnLineItem: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    orderReturnId: string;
    orderReturnVersionId?: string;
    /** Format: int64 */
    quantity: number;
    reason?: components["schemas"]["OrderReturnLineItemReason"];
    reasonId: string;
    /** Format: float */
    refundAmount?: number;
    /** Format: int64 */
    restockQuantity?: number;
    state?: components["schemas"]["StateMachineState"];
    stateId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderReturnLineItemReason: {
    content: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    reasonKey: string;
    translated: {
      content: string;
      reasonKey: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  OrderRouteResponse: {
    orders: {
      elements: components["schemas"]["Order"][];
    } & components["schemas"]["EntitySearchResult"];
    /** The key-value pairs contain the uuid of the order as key and a boolean as value, indicating that the payment method can still be changed. */
    paymentChangeable?: {
      [key: string]: boolean;
    };
  };
  OrderTag: {
    id?: string;
    order?: components["schemas"]["Order"];
    orderId: string;
    orderVersionId?: string;
    tag?: components["schemas"]["Tag"];
    tagId: string;
  };
  OrderTransaction: {
    amount: {
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
    captures?: components["schemas"]["OrderTransactionCapture"][];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    orderId: string;
    orderVersionId?: string;
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    stateId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    /** Format: date-time */
    readonly updatedAt?: string;
    validationData?: GenericRecord;
    versionId?: string;
  };
  OrderTransactionCapture: {
    amount: {
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
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    externalReference?: string;
    id: string;
    orderTransactionId: string;
    orderTransactionVersionId?: string;
    refunds?: components["schemas"]["OrderTransactionCaptureRefund"][];
    stateId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    transaction?: components["schemas"]["OrderTransaction"];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderTransactionCaptureRefund: {
    amount: {
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
    captureId: string;
    captureVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    externalReference?: string;
    id: string;
    positions?: components["schemas"]["OrderTransactionCaptureRefundPosition"][];
    reason?: string;
    stateId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    transactionCapture?: components["schemas"]["OrderTransactionCapture"];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderTransactionCaptureRefundPosition: {
    amount: {
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
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    externalReference?: string;
    id: string;
    orderLineItem?: components["schemas"]["OrderLineItem"];
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    orderTransactionCaptureRefund?: components["schemas"]["OrderTransactionCaptureRefund"];
    /** Format: int64 */
    quantity?: number;
    reason?: string;
    refundId: string;
    refundVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderWarehouseGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PageViewedInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["PageViewedPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "page.viewed";
  };
  PageViewedPayload: {
    /** the id from the page which was viewed */
    pageId: string;
    pageNumber?: number | null;
    /** the id from the section within the page which was viewed */
    sectionId: string;
    /** the alias of the slide which was viewed */
    slideAlias: number;
  };
  PaymentMethod: {
    active?: boolean;
    afterOrderEnabled?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly asynchronous?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    readonly distinguishableName?: string;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly prepared?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly recurring?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly refundable?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    shortName?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly synchronous?: boolean;
    technicalName?: string;
    translated: {
      description: string;
      distinguishableName: string;
      mediaId: string;
      name: string;
      shortName: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PaymentMethodJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    afterOrderEnabled?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly asynchronous?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    readonly distinguishableName?: string;
    id: string;
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly prepared?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly recurring?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly refundable?: boolean;
    relationships?: {
      media?: {
        data?: {
          /** @example 62933a2951ef01f4eafd9bdf4d3cd2f0 */
          id?: string;
          /** @example media */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /payment-method/da8da1569e6bef3249a7064261df833f/media
           */
          related?: string;
        };
      };
    };
    /** Runtime field, cannot be used as part of the criteria. */
    shortName?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly synchronous?: boolean;
    technicalName?: string;
    translated: {
      description: string;
      distinguishableName: string;
      mediaId: string;
      name: string;
      shortName: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PendingOrder: {
    amountNet?: number | null;
    amountTotal?: number | null;
    approvalRuleId?: string;
    billingAddress?: GenericRecord;
    cartPayload?: GenericRecord | string;
    country?: GenericRecord;
    countryId?: string;
    currency?: GenericRecord;
    currencyId?: string;
    customerId?: string;
    decidedById?: string;
    employeeId?: string;
    /** Format: uuid */
    id?: string;
    itemRounding?: GenericRecord;
    language?: GenericRecord;
    languageId?: string;
    lineItemCount?: number;
    number?: string;
    originalPrice?: number | null;
    paymentMethodId?: string;
    price?: GenericRecord;
    reason?: string;
    salesChannel?: GenericRecord;
    salesChannelId?: string;
    shippingMethodId?: string;
    stateId?: string;
    taxStatus?: string;
    totalRounding?: GenericRecord;
  };
  Plugin: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PresentationCmsPage: components["schemas"]["DsrPresentationCmsPage"] & {
    /** The product id is assigned to presentation if it's product listing or instant listing */
    pickedProductIds?: string[] | null;
  };
  PresentationSlideData: {
    category?: components["schemas"]["Category"];
    cmsPage?: components["schemas"]["CmsPage"];
    configurator?: components["schemas"]["PropertyGroup"][];
    extensions?: {
      cmsPageRelation?: components["schemas"]["PresentationCmsPage"];
    };
    product?: components["schemas"]["Product"];
  };
  PresentationStructure: {
    cmsPageResults: {
      cmsPage?: components["schemas"]["CmsPage"];
      /** The presentation id */
      resourceIdentifier?: string;
      /**
       * The type of presentation page
       * @default frontend.presentation.page
       */
      resourceType?: string;
    }[];
    navigation: {
      /** The CMS page id */
      cmsPageId: string;
      /** The presentation CMS page id */
      groupId: string;
      /** The slide name */
      groupName: string;
      /** The slide position */
      index: number;
      /** If the slide is an instant listing */
      isInstantListing?: boolean;
      /** @default [] */
      notes?: components["schemas"]["CmsSlot"][];
      /** The number of picked products of the instant listing */
      pickedProductsCount?: number;
      /** The section id */
      sectionId: string;
      /** The section name */
      sectionName: string | null;
    }[];
  };
  Price: {
    currencyId: string;
    gross: number;
    linked?: boolean;
    listPrice?: {
      currencyId?: string;
      gross: number;
      linked?: boolean;
      net: number;
    };
    net: number;
    regulationPrice?: {
      currencyId?: string;
      gross: number;
      linked?: boolean;
      net: number;
    };
  };
  Product: {
    active?: boolean;
    /** @enum {string} */
    apiAlias: "product";
    readonly available?: boolean;
    /** Format: int64 */
    readonly availableStock?: number;
    calculatedCheapestPrice?: {
      /** @enum {string} */
      apiAlias?: "calculated_cheapest_price";
      hasRange?: boolean;
      listPrice?: components["schemas"]["ListPrice"] | null;
      quantity?: number;
      referencePrice?: components["schemas"]["ReferencePrice"] | null;
      regulationPrice?: {
        price: number;
      } | null;
      totalPrice?: number;
      unitPrice?: number;
      variantId?: string | null;
    };
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedPrice: components["schemas"]["CalculatedPrice"];
    calculatedPrices: components["schemas"]["CalculatedPrice"][];
    canonicalProduct?: components["schemas"]["Product"];
    canonicalProductId?: string;
    canonicalProductVersionId?: string;
    categories?: components["schemas"]["Category"][];
    categoriesRo?: components["schemas"]["Category"][];
    readonly categoryIds?: string[];
    readonly categoryTree?: string[];
    /** Format: int64 */
    readonly childCount?: number;
    children?: components["schemas"]["Product"][];
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    configuratorSettings?: components["schemas"]["ProductConfiguratorSetting"][];
    cover?: components["schemas"]["ProductMedia"];
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    crossSellings?: components["schemas"]["ProductCrossSelling"][];
    customFields?: GenericRecord;
    deliveryTime?: components["schemas"]["DeliveryTime"];
    deliveryTimeId?: string;
    description?: string;
    readonly displayGroup?: string;
    downloads?: components["schemas"]["ProductDownload"][];
    ean?: string;
    extensions?: {
      attendeeProductCollections?: {
        data?: {
          /** @example 0a7b3b2f4b81f36910a74f22826f35df */
          id?: string;
          /** @example dsr_attendee_product_collection */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/attendeeProductCollections
           */
          related?: string;
        };
      };
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
    id: string;
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
    readonly optionIds?: string[];
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
    readonly propertyIds?: string[];
    /** Format: int64 */
    purchaseSteps?: number;
    /** Format: float */
    purchaseUnit?: number;
    /** Format: float */
    readonly ratingAverage?: number;
    /** Format: float */
    referenceUnit?: number;
    /** Format: date-time */
    releaseDate?: string;
    /** Format: int64 */
    restockTime?: number;
    /** Format: int64 */
    readonly sales?: number;
    seoCategory: components["schemas"]["Category"];
    seoUrls?: components["schemas"]["SeoUrl"][];
    shippingFree?: boolean;
    sortedProperties?: GenericRecord;
    readonly states?: string[];
    /** Format: int64 */
    stock: number;
    readonly streamIds?: string[];
    streams?: components["schemas"]["ProductStream"][];
    readonly tagIds?: string[];
    tags?: components["schemas"]["Tag"][];
    tax?: components["schemas"]["Tax"];
    taxId: string;
    translated: {
      canonicalProductId: string;
      canonicalProductVersionId: string;
      cmsPageId: string;
      cmsPageVersionId: string;
      coverId: string;
      deliveryTimeId: string;
      description: string;
      displayGroup: string;
      ean: string;
      keywords: string;
      manufacturerId: string;
      manufacturerNumber: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      packUnit: string;
      packUnitPlural: string;
      parentId: string;
      parentVersionId: string;
      productManufacturerVersionId: string;
      productMediaVersionId: string;
      productNumber: string;
      releaseDate: string;
      taxId: string;
      unitId: string;
      versionId: string;
    };
    unit?: components["schemas"]["Unit"];
    unitId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    variantListingConfig?: {
      displayParent?: boolean;
    } | null;
    versionId?: string;
    /** Format: float */
    weight?: number;
    /** Format: float */
    width?: number;
  };
  ProductConfiguratorSetting: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    option?: components["schemas"]["PropertyGroupOption"];
    optionId: string;
    /** Format: int64 */
    position?: number;
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ProductCrossSelling: {
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: int64 */
    limit?: number;
    name: string;
    /** Format: int64 */
    position?: number;
    sortBy?: string;
    sortDirection?: string;
    translated: {
      name: string;
      sortBy: string;
      sortDirection: string;
      type: string;
    };
    type?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductCrossSellingAssignedProducts: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductDetailResponse: {
    /** List of property groups with their corresponding options and information on how to display them. */
    configurator?: components["schemas"]["PropertyGroup"][];
    product: components["schemas"]["Product"];
  };
  ProductDownload: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId: string;
    /** Format: int64 */
    position?: number;
    product?: components["schemas"]["Product"];
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ProductExport: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductFeatureSet: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["ProductPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name:
      | "product.viewed"
      | "attendee.product.collection.liked"
      | "attendee.product.collection.disliked"
      | "attendee.product.collection.removed";
  };
  ProductJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    readonly available?: boolean;
    /** Format: int64 */
    readonly availableStock?: number;
    calculatedCheapestPrice?: GenericRecord;
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedPrice?: GenericRecord;
    calculatedPrices?: GenericRecord[];
    canonicalProductId?: string;
    canonicalProductVersionId?: string;
    readonly categoryIds?: string[];
    readonly categoryTree?: string[];
    /** Format: int64 */
    readonly childCount?: number;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deliveryTimeId?: string;
    description?: string;
    readonly displayGroup?: string;
    ean?: string;
    extensions?: {
      attendeeProductCollections?: {
        data?: {
          /** @example 0a7b3b2f4b81f36910a74f22826f35df */
          id?: string;
          /** @example dsr_attendee_product_collection */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/attendeeProductCollections
           */
          related?: string;
        };
      };
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
    id: string;
    isCloseout?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    isNew?: boolean;
    keywords?: string;
    /** Format: float */
    length?: number;
    manufacturerId?: string;
    manufacturerNumber?: string;
    markAsTopseller?: boolean;
    /** Format: int64 */
    maxPurchase?: number;
    metaDescription?: string;
    metaTitle?: string;
    /** Format: int64 */
    minPurchase?: number;
    name: string;
    readonly optionIds?: string[];
    packUnit?: string;
    packUnitPlural?: string;
    parentId?: string;
    parentVersionId?: string;
    productManufacturerVersionId?: string;
    productMediaVersionId?: string;
    productNumber: string;
    readonly propertyIds?: string[];
    /** Format: int64 */
    purchaseSteps?: number;
    /** Format: float */
    purchaseUnit?: number;
    /** Format: float */
    readonly ratingAverage?: number;
    /** Format: float */
    referenceUnit?: number;
    relationships?: {
      canonicalProduct?: {
        data?: {
          /** @example 023995a50b56c0de077323e958b2bbcd */
          id?: string;
          /** @example product */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/canonicalProduct
           */
          related?: string;
        };
      };
      categories?: {
        data?: {
          /** @example b0b5ccb4a195a07fd3eed14affb8695f */
          id?: string;
          /** @example category */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/categories
           */
          related?: string;
        };
      };
      categoriesRo?: {
        data?: {
          /** @example 7f0702d3a90d965b8c9158c451f43fdb */
          id?: string;
          /** @example category */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/categoriesRo
           */
          related?: string;
        };
      };
      children?: {
        data?: {
          /** @example 268184c12df027f536154d099d497b31 */
          id?: string;
          /** @example product */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/children
           */
          related?: string;
        };
      };
      cmsPage?: {
        data?: {
          /** @example 7b1460918b1abb93311108f3dc021c9b */
          id?: string;
          /** @example cms_page */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/cmsPage
           */
          related?: string;
        };
      };
      configuratorSettings?: {
        data?: {
          /** @example c0827fee13725d41f1fd7e292243f5aa */
          id?: string;
          /** @example product_configurator_setting */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/configuratorSettings
           */
          related?: string;
        };
      };
      cover?: {
        data?: {
          /** @example 41d0e299ca1abeb2094852da042165c7 */
          id?: string;
          /** @example product_media */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/cover
           */
          related?: string;
        };
      };
      crossSellings?: {
        data?: {
          /** @example 89936e14544d1b403cecef938101b6b0 */
          id?: string;
          /** @example product_cross_selling */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/crossSellings
           */
          related?: string;
        };
      };
      deliveryTime?: {
        data?: {
          /** @example 8c888ae25a7bd42057370e31f7e01044 */
          id?: string;
          /** @example delivery_time */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/deliveryTime
           */
          related?: string;
        };
      };
      downloads?: {
        data?: {
          /** @example d07d50a751bc6ddf12bf3af0efee9b45 */
          id?: string;
          /** @example product_download */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/downloads
           */
          related?: string;
        };
      };
      mainCategories?: {
        data?: {
          /** @example 1fb731fc4139cbb575429e28846f0c39 */
          id?: string;
          /** @example main_category */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/mainCategories
           */
          related?: string;
        };
      };
      manufacturer?: {
        data?: {
          /** @example c2904bca62b22443d6cf5e9d89cab204 */
          id?: string;
          /** @example product_manufacturer */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/manufacturer
           */
          related?: string;
        };
      };
      media?: {
        data?: {
          /** @example 62933a2951ef01f4eafd9bdf4d3cd2f0 */
          id?: string;
          /** @example product_media */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/media
           */
          related?: string;
        };
      };
      options?: {
        data?: {
          /** @example 93da65a9fd0004d9477aeac024e08e15 */
          id?: string;
          /** @example property_group_option */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/options
           */
          related?: string;
        };
      };
      parent?: {
        data?: {
          /** @example d0e45878043844ffc41aac437e86b602 */
          id?: string;
          /** @example product */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/parent
           */
          related?: string;
        };
      };
      productReviews?: {
        data?: {
          /** @example 01e78541ea343ed72424a5222796a4cd */
          id?: string;
          /** @example product_review */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/productReviews
           */
          related?: string;
        };
      };
      properties?: {
        data?: {
          /** @example 74693d2fc58b46bd06410f278e39aa71 */
          id?: string;
          /** @example property_group_option */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/properties
           */
          related?: string;
        };
      };
      seoCategory?: {
        data?: {
          /** @example 9354d004d12e03d35ad8292bf0bb234d */
          id?: string;
          /** @example category */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/seoCategory
           */
          related?: string;
        };
      };
      seoUrls?: {
        data?: {
          /** @example 5321b5a71127b8b98cdd4b068ad56c4c */
          id?: string;
          /** @example seo_url */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/seoUrls
           */
          related?: string;
        };
      };
      streams?: {
        data?: {
          /** @example 2f6f4768f1c2d7c8f1f54823723f1a70 */
          id?: string;
          /** @example product_stream */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/streams
           */
          related?: string;
        };
      };
      tags?: {
        data?: {
          /** @example d57ac45256849d9b13e2422d91580fb9 */
          id?: string;
          /** @example tag */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/tags
           */
          related?: string;
        };
      };
      tax?: {
        data?: {
          /** @example 06565e5611f23fdf8cc43e5077b92b54 */
          id?: string;
          /** @example tax */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/tax
           */
          related?: string;
        };
      };
      unit?: {
        data?: {
          /** @example 3e34bdebd9bd5edda27e8728904a2552 */
          id?: string;
          /** @example unit */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/unit
           */
          related?: string;
        };
      };
    };
    /** Format: date-time */
    releaseDate?: string;
    /** Format: int64 */
    restockTime?: number;
    /** Format: int64 */
    readonly sales?: number;
    shippingFree?: boolean;
    sortedProperties?: GenericRecord;
    readonly states?: string[];
    /** Format: int64 */
    stock: number;
    readonly streamIds?: string[];
    readonly tagIds?: string[];
    taxId: string;
    translated: {
      canonicalProductId: string;
      canonicalProductVersionId: string;
      cmsPageId: string;
      cmsPageVersionId: string;
      coverId: string;
      deliveryTimeId: string;
      description: string;
      displayGroup: string;
      ean: string;
      keywords: string;
      manufacturerId: string;
      manufacturerNumber: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      packUnit: string;
      packUnitPlural: string;
      parentId: string;
      parentVersionId: string;
      productManufacturerVersionId: string;
      productMediaVersionId: string;
      productNumber: string;
      releaseDate: string;
      taxId: string;
      unitId: string;
      versionId: string;
    };
    unitId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
    /** Format: float */
    weight?: number;
    /** Format: float */
    width?: number;
  } & components["schemas"]["DiscountLineItemPayload"] & {
      options: {
        group: string;
        option: string;
        translated: {
          group: string;
          option: string;
        };
      }[];
    };
  ProductKeywordDictionary: {
    id?: string;
    keyword: string;
    languageId: string;
  };
  ProductListingCriteria: components["schemas"]["Criteria"] & {
    /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
    limit?: number;
    /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
    manufacturer?: string;
    /**
     * Enables/disabled filtering by manufacturer. If set to false, the `manufacturer` filter will be ignored. Also the `aggregations[manufacturer]` key will be removed from the response.
     * @default true
     */
    "manufacturer-filter"?: boolean;
    /**
     * Filters by a maximum product price. Has to be higher than the `min-price` filter.
     * @default 0
     */
    "max-price"?: number;
    /**
     * Filters by a minimum product price. Has to be lower than the `max-price` filter.
     * @default 0
     */
    "min-price"?: number;
    /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
    order?: string;
    /**
     * Search result page
     * @default 1
     */
    p?: number;
    /**
     * Enables/disabled filtering by price. If set to false, the `min-price` and `max-price` filter will be ignored. Also the `aggregations[price]` key will be removed from the response.
     * @default true
     */
    "price-filter"?: boolean;
    /** Filters products by their properties. List of property identifiers separated by a `|`. */
    properties?: string;
    /**
     * Enables/disabled filtering by properties products. If set to false, the `properties` filter will be ignored. Also the `aggregations[properties]` key will be removed from the response.
     * @default true
     */
    "property-filter"?: boolean;
    /** A whitelist of property identifiers which can be used for filtering. List of property identifiers separated by a `|`. The `property-filter` must be `true`, otherwise the whitelist has no effect. */
    "property-whitelist"?: string;
    /** Filter products with a minimum average rating. */
    rating?: number;
    /**
     * Enables/disabled filtering by rating. If set to false, the `rating` filter will be ignored. Also the `aggregations[rating]` key will be removed from the response.
     * @default true
     */
    "rating-filter"?: boolean;
    /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
    "reduce-aggregations"?: string | null;
    /**
     * Filters products that are marked as shipping-free.
     * @default false
     */
    "shipping-free"?: boolean;
    /**
     * Enables/disabled filtering by shipping-free products. If set to false, the `shipping-free` filter will be ignored. Also the `aggregations[shipping-free]` key will be removed from the response.
     * @default true
     */
    "shipping-free-filter"?: boolean;
  };
  ProductListingFlags: {
    /** Resets all aggregations in the criteria. This parameter is a flag, the value has no effect. */
    "no-aggregations"?: string | null;
    /** If this flag is set, no products are fetched. Sorting and associations are also ignored. This parameter is a flag, the value has no effect. */
    "only-aggregations"?: string | null;
  };
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
        key: string;
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
      rating: number | null;
      search?: string;
      /** @default false */
      "shipping-free": boolean;
    };
    elements: components["schemas"]["Product"][];
    /** @enum {string} */
    entity?: "product";
    sorting?: string;
  };
  ProductManufacturer: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    id: string;
    link?: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    translated: {
      description: string;
      link: string;
      mediaId: string;
      name: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ProductMedia: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    media: components["schemas"]["Media"];
    mediaId: string;
    /** Format: int64 */
    position?: number;
    productId: string;
    productVersionId?: string;
    thumbnails?: components["schemas"]["MediaThumbnail"][];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ProductPageResult: {
    apiAlias?: string;
    cmsPage?: components["schemas"]["CmsPage"];
    configurator?: components["schemas"]["PropertyGroup"] | null;
    product?: components["schemas"]["Product"];
  };
  ProductPayload: {
    /** the id from the product which is used in the interaction */
    productId: string;
  };
  ProductPrice: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductReview: {
    comment?: string;
    content: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customerId?: string;
    customFields?: GenericRecord;
    externalUser?: string;
    id: string;
    languageId: string;
    /** Format: float */
    points: number;
    productId: string;
    productVersionId?: string;
    salesChannelId: string;
    status?: boolean;
    title: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductReviewSummary: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    product?: components["schemas"]["Product"];
    productId: string;
    salesChannel?: components["schemas"]["SalesChannel"];
    salesChannelId: string;
    summary?: string;
    translated: {
      productId: string;
      salesChannelId: string;
      summary: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    visible?: boolean;
  };
  ProductSearchConfig: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductSearchConfigField: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductSearchKeyword: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductSorting: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    key: string;
    label: string;
    /** Format: int64 */
    priority: number;
    translated: {
      key: string;
      label: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductStream: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    id: string;
    name: string;
    translated: {
      description: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductStreamFilter: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductVisibility: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductWarehouse: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Promotion: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PromotionDiscount: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PromotionDiscountPrices: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PromotionIndividualCode: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PromotionSalesChannel: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PromotionSetgroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PropertyGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    displayType?: string;
    filterable?: boolean;
    id: string;
    name: string;
    options?: components["schemas"]["PropertyGroupOption"][];
    /** Format: int64 */
    position?: number;
    sortingType?: string;
    translated: {
      description: string;
      displayType: string;
      name: string;
      sortingType: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    visibleOnProductDetailPage?: boolean;
  };
  PropertyGroupOption: {
    colorHexCode?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    group: components["schemas"]["PropertyGroup"];
    groupId: string;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    option: string;
    /** Format: int64 */
    position?: number;
    translated: {
      colorHexCode: string;
      groupId: string;
      mediaId: string;
      name: string;
      option: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Query: {
    query?:
      | components["schemas"]["SimpleFilter"]
      | components["schemas"]["EqualsFilter"]
      | components["schemas"]["MultiNotFilter"]
      | components["schemas"]["RangeFilter"];
    score?: number;
  } & {
    [key: string]: unknown;
  };
  Quote: {
    /** Format: float */
    readonly amountNet?: number;
    /** Format: float */
    readonly amountTotal?: number;
    comments?: components["schemas"]["QuoteComment"][];
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customerId: string;
    customFields?: GenericRecord;
    deliveries?: components["schemas"]["QuoteDelivery"][];
    discount?: {
      type?: string;
      /** Format: float */
      value?: number;
    };
    documents?: components["schemas"]["QuoteDocument"][];
    /** Format: date-time */
    expirationDate?: string;
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lineItems?: components["schemas"]["QuoteLineItem"][];
    orderId?: string;
    orderVersionId?: string;
    price: {
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
    quoteNumber?: string;
    salesChannelId: string;
    /** Format: date-time */
    sentAt?: string;
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
    stateId: string;
    stateMachineState: components["schemas"]["StateMachineState"];
    /** Format: float */
    subtotalNet?: number;
    readonly taxStatus?: string;
    /** Format: float */
    totalDiscount?: number;
    transactions?: components["schemas"]["QuoteTransaction"][];
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    userId?: string;
    versionId?: string;
  };
  QuoteComment: {
    comment: string;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    customer?: components["schemas"]["Customer"];
    customerId?: string;
    id: string;
    quoteId: string;
    quoteVersionId?: string;
    /** Format: date-time */
    seenAt?: string;
    stateId?: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteDelivery: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    positions?: components["schemas"]["QuoteDeliveryPosition"][];
    quoteId: string;
    quoteVersionId?: string;
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
    /** Format: date-time */
    shippingDateEarliest: string;
    /** Format: date-time */
    shippingDateLatest: string;
    shippingMethod?: components["schemas"]["ShippingMethod"];
    shippingMethodId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteDeliveryPosition: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    price?: {
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
    /** Format: int64 */
    quantity?: number;
    quoteDeliveryId: string;
    quoteDeliveryVersionId?: string;
    quoteLineItemId: string;
    quoteLineItemVersionId?: string;
    /** Format: float */
    totalPrice?: number;
    /** Format: float */
    unitPrice?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteDocument: {
    active?: boolean;
    config: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deepLinkCode: string;
    documentMediaFile?: components["schemas"]["Media"];
    documentMediaFileId?: string;
    documentNumber?: string;
    documentType?: components["schemas"]["DocumentType"];
    documentTypeId: string;
    fileType: string;
    id: string;
    quote?: components["schemas"]["Quote"];
    quoteId: string;
    quoteVersionId?: string;
    sent?: boolean;
    static?: boolean;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteEmployee: {
    /** Format: date-time */
    readonly createdAt?: string;
    firstName: string;
    id?: string;
    lastName: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  QuoteJsonApi: components["schemas"]["resource"] & {
    /** Format: float */
    readonly amountNet?: number;
    /** Format: float */
    readonly amountTotal?: number;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    currencyId: string;
    customerId: string;
    customFields?: GenericRecord;
    discount?: {
      type?: string;
      /** Format: float */
      value?: number;
    };
    /** Format: date-time */
    expirationDate?: string;
    id: string;
    languageId: string;
    orderId?: string;
    orderVersionId?: string;
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
    quoteNumber?: string;
    relationships?: {
      comments?: {
        data?: {
          /** @example a5d491060952aa8ad5fdee071be752de */
          id?: string;
          /** @example quote_comment */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/comments
           */
          related?: string;
        };
      };
      currency?: {
        data?: {
          /** @example 1af0389838508d7016a9841eb6273962 */
          id?: string;
          /** @example currency */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/currency
           */
          related?: string;
        };
      };
      deliveries?: {
        data?: {
          /** @example 6fc31b6b9cd717cc0dcb81152308f8af */
          id?: string;
          /** @example quote_delivery */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/deliveries
           */
          related?: string;
        };
      };
      documents?: {
        data?: {
          /** @example 21f64da1e5792c8295b964d159a14491 */
          id?: string;
          /** @example quote_document */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/documents
           */
          related?: string;
        };
      };
      language?: {
        data?: {
          /** @example 8512ae7d57b1396273f76fe6ed341a23 */
          id?: string;
          /** @example language */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/language
           */
          related?: string;
        };
      };
      lineItems?: {
        data?: {
          /** @example a042af1aa9f3853fe3cd7dabc065568f */
          id?: string;
          /** @example quote_line_item */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/lineItems
           */
          related?: string;
        };
      };
      stateMachineState?: {
        data?: {
          /** @example 1ab22d393154f21e3be76aca3ec3ee31 */
          id?: string;
          /** @example state_machine_state */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/stateMachineState
           */
          related?: string;
        };
      };
      transactions?: {
        data?: {
          /** @example c15b977dd99332ca8623fbdfb86827e8 */
          id?: string;
          /** @example quote_transaction */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/transactions
           */
          related?: string;
        };
      };
    };
    salesChannelId: string;
    /** Format: date-time */
    sentAt?: string;
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
    stateId: string;
    /** Format: float */
    subtotalNet?: number;
    readonly taxStatus?: string;
    /** Format: float */
    totalDiscount?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedById?: string;
    userId?: string;
    versionId?: string;
  };
  QuoteLineItem: {
    children: components["schemas"]["QuoteLineItem"][];
    cover?: components["schemas"]["Media"];
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deliveryPositions?: components["schemas"]["QuoteDeliveryPosition"][];
    description?: string;
    discount?: {
      type?: string;
      /** Format: int64 */
      value?: number;
    };
    good?: boolean;
    id: string;
    identifier: string;
    label: string;
    parent?: components["schemas"]["QuoteLineItem"];
    parentId?: string;
    parentVersionId?: string;
    payload?: GenericRecord;
    /** Format: int64 */
    position: number;
    priceDefinition?: GenericRecord;
    productId?: string;
    productPrice?: components["schemas"]["Price"][];
    productVersionId?: string;
    purchasePrice?: components["schemas"]["Price"][];
    /** Format: int64 */
    quantity: number;
    quoteId: string;
    quoteVersionId?: string;
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
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteTransaction: {
    amount: {
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
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    quoteId: string;
    quoteVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  RangeFilter: {
    field: string;
    parameters: {
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
    };
    /** @enum {string} */
    type: "range";
  };
  ReferencePrice: {
    /** @enum {string} */
    apiAlias?: "cart_price_reference";
    hasRange: boolean;
    listPrice: components["schemas"]["ListPrice"] | null;
    price?: number;
    purchaseUnit?: number;
    referenceUnit?: number;
    regulationPrice: {
      /** @enum {string} */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    unitName: string;
    /** Format: ^[0-9a-f]{32}$ */
    variantId?: string | null;
  };
  Rule: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    extensions?: {
      swagCmsExtensionsBlockRules?: {
        data?: {
          /** @example ce0b9f43f8947576ee10c93d4d69a4c4 */
          id?: string;
          /** @example swag_cms_extensions_block_rule */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /rule/ab7a485ebe75b6dd7243ad719f23c7de/swagCmsExtensionsBlockRules
           */
          related?: string;
        };
      };
      warehouseGroup?: {
        data?: {
          /** @example 1768e3071b62161d415e0c24332055ed */
          id?: string;
          /** @example warehouse_group */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /rule/ab7a485ebe75b6dd7243ad719f23c7de/warehouseGroup
           */
          related?: string;
        };
      };
    };
    id?: string;
    name: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  RuleCondition: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SaasAppStorefrontConfig: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SaasSbpUserData: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SaasStorefrontDemoToken: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SaasUserLoginToken: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SalesChannel: {
    active?: boolean;
    configuration?: GenericRecord;
    country?: components["schemas"]["Country"];
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customerGroupId: string;
    customFields?: GenericRecord;
    domains?: components["schemas"]["SalesChannelDomain"][];
    footerCategory?: components["schemas"]["Category"];
    footerCategoryId?: string;
    footerCategoryVersionId?: string;
    hreflangActive?: boolean;
    hreflangDefaultDomain?: components["schemas"]["SalesChannelDomain"];
    hreflangDefaultDomainId?: string;
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    mailHeaderFooterId?: string;
    maintenance?: boolean;
    name: string;
    navigationCategory?: components["schemas"]["Category"];
    /** Format: int64 */
    navigationCategoryDepth?: number;
    navigationCategoryId: string;
    navigationCategoryVersionId?: string;
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    serviceCategory?: components["schemas"]["Category"];
    serviceCategoryId?: string;
    serviceCategoryVersionId?: string;
    shippingMethod?: components["schemas"]["ShippingMethod"];
    shippingMethodId: string;
    shortName?: string;
    taxCalculationType?: string;
    translated: {
      countryId: string;
      currencyId: string;
      customerGroupId: string;
      footerCategoryId: string;
      footerCategoryVersionId: string;
      hreflangDefaultDomainId: string;
      languageId: string;
      mailHeaderFooterId: string;
      name: string;
      navigationCategoryId: string;
      navigationCategoryVersionId: string;
      paymentMethodId: string;
      serviceCategoryId: string;
      serviceCategoryVersionId: string;
      shippingMethodId: string;
      shortName: string;
      taxCalculationType: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SalesChannelAnalytics: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SalesChannelContext: {
    /** @enum {string} */
    apiAlias: "sales_channel_context";
    /** Core context with general configuration values and state */
    context?: {
      currencyFactor?: number;
      currencyId?: string;
      /** Format: int32 */
      currencyPrecision?: number;
      languageIdChain?: string[];
      scope?: string;
      source?: string;
      taxState?: string;
      useCache?: boolean;
      versionId?: string;
    };
    currency?: components["schemas"]["Currency"];
    /** Customer group of the current user */
    currentCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    customer?: components["schemas"]["Customer"];
    /** Fallback group if the default customer group is not applicable */
    fallbackCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    languageInfo: {
      localeCode: string;
      name: string;
    };
    paymentMethod?: components["schemas"]["PaymentMethod"];
    salesChannel: components["schemas"]["SalesChannel"];
    shippingLocation?: {
      address?: components["schemas"]["CustomerAddress"];
      /** @enum {string} */
      apiAlias?: "cart_delivery_shipping_location";
      country?: components["schemas"]["Country"];
    };
    shippingMethod?: components["schemas"]["ShippingMethod"];
    /** Currently active tax rules and/or rates */
    taxRules?: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    /** Context the user session */
    token?: string;
  };
  SalesChannelDomain: {
    /** Format: date-time */
    readonly createdAt?: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customFields?: GenericRecord;
    hreflangUseOnlyLocale?: boolean;
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    salesChannelDefaultHreflang?: components["schemas"]["SalesChannel"];
    salesChannelId: string;
    snippetSetId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    url: string;
  };
  SalesChannelType: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Salutation: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    displayName: string;
    id: string;
    letterName: string;
    salutationKey: string;
    translated: {
      displayName: string;
      letterName: string;
      salutationKey: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SalutationJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    displayName: string;
    id: string;
    letterName: string;
    salutationKey: string;
    translated: {
      displayName: string;
      letterName: string;
      salutationKey: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ScheduledTask: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ScreenSharingToggledInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["ScreenSharingToggledPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "screenSharing.toggled";
  };
  ScreenSharingToggledPayload: {
    /** Whether the screen sharing is active or not */
    active: boolean;
  };
  Script: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SearchByImageSearchTermResponse: {
    /** @enum {string} */
    apiAlias: "product_image_upload_search_term";
    extensions?: GenericRecord[];
    term: string;
  }[];
  SeoUrl: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Runtime field, cannot be used as part of the criteria. */
    error?: string;
    foreignKey: string;
    id: string;
    isCanonical?: boolean;
    isDeleted?: boolean;
    isModified?: boolean;
    languageId: string;
    pathInfo: string;
    /** @enum {string} */
    routeName:
      | "frontend.navigation.page"
      | "frontend.landing.page"
      | "frontend.detail.page";
    salesChannelId?: string;
    seoPathInfo: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url?: string;
  };
  SeoUrlJsonApi: components["schemas"]["resource"] & {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    /** Runtime field, cannot be used as part of the criteria. */
    error?: string;
    foreignKey: string;
    id: string;
    isCanonical?: boolean;
    isDeleted?: boolean;
    isModified?: boolean;
    languageId: string;
    pathInfo: string;
    routeName: string;
    salesChannelId?: string;
    seoPathInfo: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url?: string;
  };
  SeoUrlTemplate: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    isValid?: boolean;
    salesChannelId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ShippingMethod: {
    active?: boolean;
    availabilityRule?: components["schemas"]["Rule"];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deliveryTime?: components["schemas"]["DeliveryTime"];
    deliveryTimeId: string;
    description?: string;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    prices?: components["schemas"]["ShippingMethodPrice"][];
    tags?: components["schemas"]["Tag"][];
    tax?: components["schemas"]["Tax"];
    taxType?: string;
    technicalName?: string;
    trackingUrl?: string;
    translated: {
      deliveryTimeId: string;
      description: string;
      mediaId: string;
      name: string;
      taxType: string;
      technicalName: string;
      trackingUrl: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ShippingMethodJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    deliveryTimeId: string;
    description?: string;
    id: string;
    mediaId?: string;
    name: string;
    /** Format: int64 */
    position?: number;
    relationships?: {
      availabilityRule?: {
        data?: {
          /** @example 9fbb7961d1cb158094924c679e1b302c */
          id?: string;
          /** @example rule */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/availabilityRule
           */
          related?: string;
        };
      };
      deliveryTime?: {
        data?: {
          /** @example 8c888ae25a7bd42057370e31f7e01044 */
          id?: string;
          /** @example delivery_time */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/deliveryTime
           */
          related?: string;
        };
      };
      media?: {
        data?: {
          /** @example 62933a2951ef01f4eafd9bdf4d3cd2f0 */
          id?: string;
          /** @example media */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/media
           */
          related?: string;
        };
      };
      prices?: {
        data?: {
          /** @example afae32efe0f84fece3f96b377b768b33 */
          id?: string;
          /** @example shipping_method_price */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/prices
           */
          related?: string;
        };
      };
      tags?: {
        data?: {
          /** @example d57ac45256849d9b13e2422d91580fb9 */
          id?: string;
          /** @example tag */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/tags
           */
          related?: string;
        };
      };
      tax?: {
        data?: {
          /** @example 06565e5611f23fdf8cc43e5077b92b54 */
          id?: string;
          /** @example tax */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /shipping-method/d72e7a227a27328b28342b32fc66b6bf/tax
           */
          related?: string;
        };
      };
    };
    taxType?: string;
    technicalName?: string;
    trackingUrl?: string;
    translated: {
      deliveryTimeId: string;
      description: string;
      mediaId: string;
      name: string;
      taxType: string;
      technicalName: string;
      trackingUrl: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ShippingMethodPageRouteResponse: {
    active?: boolean;
    availabilityRule?: {
      description?: string;
      invalid?: boolean;
      name?: string;
      /** Format: int32 */
      priority?: number;
    };
    availabilityRuleId?: string;
    deliveryTime?: {
      /** Format: int32 */
      max?: number;
      /** Format: int32 */
      min?: number;
      name?: string;
      unit?: string;
    };
    deliveryTimeId?: string;
    description?: string;
    media?: {
      alt?: string;
      fileExtension?: string;
      fileName?: string;
      /** Format: int32 */
      fileSize?: number;
      mediaFolderId?: string;
      mediaTypeRaw?: string;
      metaDataRaw?: string;
      mimeType?: string;
      private?: boolean;
      thumbnailsRo?: string;
      title?: string;
      /** Format: date-time */
      uploadedAt?: string;
      url?: string;
      userId?: string;
    };
    mediaId?: string;
    name?: string;
    orderDeliveries?: {
      orderId?: string;
      /** Format: date-time */
      shippingDateEarliest?: string;
      /** Format: date-time */
      shippingDateLatest?: string;
      shippingMethodId?: string;
      shippingOrderAddressId?: string;
      stateId?: string;
    }[];
    prices?: {
      /** Format: int32 */
      calculation?: number;
      calculationRuleId?: string;
      currencyId?: string;
      /** Format: float */
      price?: number;
      /** Format: float */
      quantityEnd?: number;
      /** Format: float */
      quantityStart?: number;
      ruleId?: string;
      shippingMethodId?: string;
    }[];
    salesChannelDefaultAssignments?: {
      accessKey?: string;
      active?: boolean;
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
    }[];
    salesChannels?: {
      accessKey?: string;
      active?: boolean;
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
    }[];
    tags?: {
      name?: string;
    }[];
    translations?: {
      description?: string;
      name?: string;
      shippingMethodId?: string;
    }[];
  }[];
  ShippingMethodPrice: {
    /** Format: int64 */
    calculation?: number;
    calculationRuleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    currencyPrice?: components["schemas"]["Price"][];
    customFields?: GenericRecord;
    id: string;
    /** Format: float */
    quantityEnd?: number;
    /** Format: float */
    quantityStart?: number;
    ruleId?: string;
    shippingMethodId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SimpleFilter: {
    field: string;
    /** @enum {string} */
    type: "contains" | "equalsAny" | "prefix" | "suffix";
    value: string;
  };
  Sitemap: {
    /** Format: date-time */
    created: string;
    filename: string;
  };
  Snippet: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    setId: string;
    translationKey: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    value: string;
  };
  SnippetSet: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    iso: string;
    name: string;
    snippets?: components["schemas"]["Snippet"][];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Sort: {
    field: string;
    naturalSorting?: boolean;
    /** @enum {string} */
    order: "ASC" | "DESC";
    type?: string;
  };
  SpatialRenderConfigSize: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialScene: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialSceneCamera: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialSceneGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialSceneLight: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialSceneMaterial: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialSceneObject: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SpatialScenePrimitive: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SsoProvider: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    media?: components["schemas"]["Media"];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SsoProviderCustomer: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  StateForAll: {
    accessibleFrom?: string | null;
    accessibleTo?: string | null;
    /** @default false */
    allowScreenSharing?: boolean;
    /** @default false */
    allowUserActionsForGuide?: boolean;
    /** @enum {string} */
    appointmentMode?: "guided" | "self";
    attendeeRestrictionType?: ("open" | "customer" | "rules") | null;
    /** @default false */
    broadcastMode?: boolean;
    currentDynamicPage?: components["schemas"]["DynamicPageOpenedPayload"];
    currentGuideProductId?: string | null;
    currentPageId?: string | null;
    currentSectionId?: string | null;
    /** @default 0 */
    currentSlideAlias?: number;
    currentSlideData?:
      | components["schemas"]["DynamicProductListingPageOpenedPayload"]
      | null;
    /** @default false */
    ended?: boolean;
    endedAt?: string | null;
    /** @default [] */
    extensions?: unknown[];
    lastActiveGuideSection?: string | null;
    productDetailDefaultPageId?: string | null;
    productListingDefaultPageId?: string | null;
    quickviewPageId?: string | null;
    /** @default false */
    running?: boolean;
    /** @default false */
    started?: boolean;
    startedAt?: string | null;
    /**
     * @default none
     * @enum {string}
     */
    videoAudioSettings?: "both" | "none" | "audio-only";
    /** @default  */
    videoRoomUrl?: string;
    /**
     * @default presentation
     * @enum {string}
     */
    viewMode?: "onlyYou" | "presentation" | "videoGrid";
  };
  StateForClients: {
    /** @default [] */
    extensions?: unknown[];
    hoveredElementId?: string | null;
    videoClientToken?: string | null;
  };
  StateMachine: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    states?: components["schemas"]["StateMachineState"][];
    transitions?: components["schemas"]["StateMachineTransition"][];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  StateMachineHistory: {
    /** Format: date-time */
    readonly createdAt?: string;
    fromStateMachineState?: components["schemas"]["StateMachineState"];
    id?: string;
    toStateMachineState?: components["schemas"]["StateMachineState"];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  StateMachineState: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id?: string;
    name: string;
    technicalName: string;
    translated: {
      name: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  StateMachineTransition: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SubAggregations: {
    aggregation?:
      | components["schemas"]["AggregationMetrics"]
      | components["schemas"]["AggregationEntity"]
      | components["schemas"]["AggregationFilter"]
      | components["schemas"]["AggregationTerms"]
      | components["schemas"]["AggregationHistogram"]
      | components["schemas"]["AggregationRange"];
  };
  Subscription: {
    addresses?: components["schemas"]["SubscriptionAddress"][];
    billingAddress?: components["schemas"]["SubscriptionAddress"];
    billingAddressId: string;
    convertedOrder: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    cronInterval: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customFields?: GenericRecord;
    dateInterval: string;
    id: string;
    /** Format: int64 */
    initialExecutionCount?: number;
    language?: components["schemas"]["Language"];
    languageId: string;
    /** Format: date-time */
    nextSchedule: string;
    orders?: components["schemas"]["Order"][];
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    /** Format: int64 */
    remainingExecutionCount?: number;
    salesChannelId: string;
    shippingAddress?: components["schemas"]["SubscriptionAddress"];
    shippingAddressId: string;
    shippingMethod?: components["schemas"]["ShippingMethod"];
    shippingMethodId: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    subscriptionCustomer?: components["schemas"]["SubscriptionCustomer"];
    subscriptionInterval?: components["schemas"]["SubscriptionInterval"];
    subscriptionIntervalId?: string;
    subscriptionIntervalName: string;
    subscriptionNumber: string;
    subscriptionPlan?: components["schemas"]["SubscriptionPlan"];
    subscriptionPlanId?: string;
    subscriptionPlanName: string;
    tags?: components["schemas"]["Tag"][];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SubscriptionAddress: {
    additionalAddressLine1?: string;
    additionalAddressLine2?: string;
    billingSubscription?: components["schemas"]["Subscription"];
    city: string;
    company?: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    countryStateId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    department?: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId?: string;
    shippingSubscription?: components["schemas"]["Subscription"];
    street: string;
    subscription?: components["schemas"]["Subscription"];
    subscriptionId: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatId?: string;
    zipcode?: string;
  };
  SubscriptionCustomer: {
    company?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customerId?: string;
    customerNumber?: string;
    customFields?: GenericRecord;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    salutation?: components["schemas"]["Salutation"];
    salutationId: string;
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatIds?: string[];
  };
  SubscriptionInterval: {
    active?: boolean;
    availabilityRuleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    cronInterval?: string;
    dateInterval?: string;
    id: string;
    name: string;
    subscriptions?: components["schemas"]["Subscription"][];
    translated: {
      availabilityRuleId: string;
      cronInterval: string;
      dateInterval: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SubscriptionPlan: {
    active?: boolean;
    activeStorefrontLabel?: boolean;
    availabilityRuleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    description?: string;
    /** Format: float */
    discountPercentage?: number;
    discountPrice?: components["schemas"]["Price"][];
    id: string;
    label?: string;
    /** Format: int64 */
    minimumExecutionCount?: number;
    name: string;
    subscriptions?: components["schemas"]["Subscription"][];
    translated: {
      availabilityRuleId: string;
      description: string;
      label: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SubscriptionPlanIntervalMapping: {
    id?: string;
    subscriptionInterval?: components["schemas"]["SubscriptionInterval"];
    subscriptionIntervalId: string;
    subscriptionPlan?: components["schemas"]["SubscriptionPlan"];
    subscriptionPlanId: string;
  };
  SubscriptionPlanJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    activeStorefrontLabel?: boolean;
    availabilityRuleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    description?: string;
    /** Format: float */
    discountPercentage?: number;
    discountPrice?: components["schemas"]["Price"][];
    id: string;
    label?: string;
    /** Format: int64 */
    minimumExecutionCount?: number;
    name: string;
    relationships?: {
      subscriptions?: {
        data?: {
          /** @example 2d5d14f95af035cbd8437948de61f94c */
          id?: string;
          /** @example subscription */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /subscription-plan/5e63f9057837020694081b9412211bfb/subscriptions
           */
          related?: string;
        };
      };
    };
    translated: {
      availabilityRuleId: string;
      description: string;
      label: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SubscriptionPlanProductMapping: {
    id?: string;
    product?: components["schemas"]["Product"];
    productId: string;
    productVersionId?: string;
    subscriptionPlan?: components["schemas"]["SubscriptionPlan"];
    subscriptionPlanId: string;
  };
  SubscriptionTagMapping: {
    id?: string;
    subscription?: components["schemas"]["Subscription"];
    subscriptionId: string;
    tag?: components["schemas"]["Tag"];
    tagId: string;
  };
  SuccessResponse: {
    success?: boolean;
  };
  SwagCmsExtensionsBlockRule: {
    cmsBlock?: components["schemas"]["CmsBlock"];
    cmsBlockId: string;
    cmsBlockVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    inverted?: boolean;
    /** Format: date-time */
    readonly updatedAt?: string;
    visibilityRule?: components["schemas"]["Rule"];
    visibilityRuleId?: string;
  };
  SwagCmsExtensionsForm: {
    cmsSlot?: components["schemas"]["CmsSlot"];
    cmsSlotId?: string;
    cmsSlotVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    groups?: components["schemas"]["SwagCmsExtensionsFormGroup"][];
    id: string;
    isTemplate?: boolean;
    mailTemplate?: components["schemas"]["MailTemplate"];
    mailTemplateId: string;
    receivers?: GenericRecord;
    successMessage?: string;
    technicalName: string;
    title?: string;
    translated: {
      cmsSlotId: string;
      cmsSlotVersionId: string;
      mailTemplateId: string;
      successMessage: string;
      technicalName: string;
      title: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCmsExtensionsFormGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    fields?: components["schemas"]["SwagCmsExtensionsFormGroupField"][];
    form?: components["schemas"]["SwagCmsExtensionsForm"];
    formId?: string;
    id: string;
    /** Format: int64 */
    position: number;
    technicalName: string;
    title?: string;
    translated: {
      formId: string;
      technicalName: string;
      title: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCmsExtensionsFormGroupField: {
    config?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    errorMessage?: string;
    group?: components["schemas"]["SwagCmsExtensionsFormGroup"];
    groupId?: string;
    id: string;
    label: string;
    placeholder?: string;
    /** Format: int64 */
    position: number;
    required?: boolean;
    technicalName: string;
    translated: {
      errorMessage: string;
      groupId: string;
      label: string;
      placeholder: string;
      technicalName: string;
      type: string;
    };
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Format: int64 */
    width: number;
  };
  SwagCmsExtensionsQuickview: {
    active?: boolean;
    cmsBlock?: components["schemas"]["CmsBlock"];
    cmsBlockId?: string;
    cmsBlockVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCmsExtensionsScrollNavigation: {
    active?: boolean;
    cmsSection?: components["schemas"]["CmsSection"];
    cmsSectionId?: string;
    cmsSectionVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    displayName?: string;
    id: string;
    translated: {
      cmsSectionId: string;
      cmsSectionVersionId: string;
      displayName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCmsExtensionsScrollNavigationPageSettings: {
    active?: boolean;
    bouncy?: boolean;
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Format: int64 */
    duration?: number;
    easing?: string;
    /** Format: int64 */
    easingDegree?: number;
    id: string;
    nativeScrolling: boolean;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCustomizedProductsTemplate: {
    active?: boolean;
    configurations?: components["schemas"]["SwagCustomizedProductsTemplateConfiguration"][];
    confirmInput?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    readonly decisionTree?: GenericRecord;
    description?: string;
    displayName: string;
    exclusions?: components["schemas"]["SwagCustomizedProductsTemplateExclusion"][];
    id: string;
    internalName: string;
    media?: components["schemas"]["Media"];
    mediaId?: string;
    options?: components["schemas"]["SwagCustomizedProductsTemplateOption"][];
    optionsAutoCollapse?: boolean;
    parentVersionId?: string;
    products?: components["schemas"]["Product"][];
    stepByStep?: boolean;
    translated: {
      description: string;
      displayName: string;
      internalName: string;
      mediaId: string;
      parentVersionId: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateConfiguration: {
    configuration: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    hash: string;
    id: string;
    template?: components["schemas"]["SwagCustomizedProductsTemplate"];
    templateConfigurationShares?: components["schemas"]["SwagCustomizedProductsTemplateConfigurationShare"][];
    templateId: string;
    templateVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateConfigurationJsonApi: components["schemas"]["resource"] & {
    configuration: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    hash: string;
    id: string;
    relationships?: {
      template?: {
        data?: {
          /** @example 66f6181bcb4cff4cd38fbc804a036db6 */
          id?: string;
          /** @example swag_customized_products_template */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-configuration/ab78fa5f6df63876a7c6575bdf517fe2/template
           */
          related?: string;
        };
      };
      templateConfigurationShares?: {
        data?: {
          /** @example 81a31c81fde24f296e176502d32baa6d */
          id?: string;
          /** @example swag_customized_products_template_configuration_share */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-configuration/ab78fa5f6df63876a7c6575bdf517fe2/templateConfigurationShares
           */
          related?: string;
        };
      };
    };
    templateId: string;
    templateVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateConfigurationShare: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCustomizedProductsTemplateExclusion: {
    conditions?: components["schemas"]["SwagCustomizedProductsTemplateExclusionCondition"][];
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    name: string;
    template?: components["schemas"]["SwagCustomizedProductsTemplate"];
    templateId: string;
    templateVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateExclusionCondition: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    templateExclusion?: components["schemas"]["SwagCustomizedProductsTemplateExclusion"];
    templateExclusionId: string;
    templateExclusionOperator?: components["schemas"]["SwagCustomizedProductsTemplateExclusionOperator"];
    templateExclusionOperatorId: string;
    templateExclusionVersionId?: string;
    templateOption?: components["schemas"]["SwagCustomizedProductsTemplateOption"];
    templateOptionId: string;
    templateOptionValues?: components["schemas"]["SwagCustomizedProductsTemplateOptionValue"][];
    templateOptionVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateExclusionOperator: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    label: string;
    operator: string;
    templateExclusionConditions?: components["schemas"]["SwagCustomizedProductsTemplateExclusionCondition"][];
    templateOptionType: string;
    translated: {
      label: string;
      operator: string;
      templateOptionType: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCustomizedProductsTemplateJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    confirmInput?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    readonly decisionTree?: GenericRecord;
    description?: string;
    displayName: string;
    id: string;
    internalName: string;
    mediaId?: string;
    optionsAutoCollapse?: boolean;
    parentVersionId?: string;
    relationships?: {
      configurations?: {
        data?: {
          /** @example 86f23519571eb918e8812e1979d55409 */
          id?: string;
          /** @example swag_customized_products_template_configuration */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template/4751e4cb483e992aa073494b9cfa9be6/configurations
           */
          related?: string;
        };
      };
      exclusions?: {
        data?: {
          /** @example c6fc0a7508c1a1fe9e233e81d31133b8 */
          id?: string;
          /** @example swag_customized_products_template_exclusion */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template/4751e4cb483e992aa073494b9cfa9be6/exclusions
           */
          related?: string;
        };
      };
      media?: {
        data?: {
          /** @example 62933a2951ef01f4eafd9bdf4d3cd2f0 */
          id?: string;
          /** @example media */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template/4751e4cb483e992aa073494b9cfa9be6/media
           */
          related?: string;
        };
      };
      options?: {
        data?: {
          /** @example 93da65a9fd0004d9477aeac024e08e15 */
          id?: string;
          /** @example swag_customized_products_template_option */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template/4751e4cb483e992aa073494b9cfa9be6/options
           */
          related?: string;
        };
      };
      products?: {
        data?: {
          /** @example 86024cad1e83101d97359d7351051156 */
          id?: string;
          /** @example product */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template/4751e4cb483e992aa073494b9cfa9be6/products
           */
          related?: string;
        };
      };
    };
    stepByStep?: boolean;
    translated: {
      description: string;
      displayName: string;
      internalName: string;
      mediaId: string;
      parentVersionId: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateOption: {
    advancedSurcharge?: boolean;
    calculatedPrice?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    description?: string;
    displayName: string;
    id: string;
    itemNumber?: string;
    oneTimeSurcharge?: boolean;
    /** Format: float */
    percentageSurcharge?: number;
    placeholder?: string;
    /** Format: int64 */
    position?: number;
    price?: components["schemas"]["Price"][];
    prices?: components["schemas"]["SwagCustomizedProductsTemplateOptionPrice"][];
    relativeSurcharge?: boolean;
    required?: boolean;
    tax?: components["schemas"]["Tax"];
    taxId?: string;
    template?: components["schemas"]["SwagCustomizedProductsTemplate"];
    templateExclusionConditions?: components["schemas"]["SwagCustomizedProductsTemplateExclusionCondition"][];
    templateId: string;
    templateVersionId?: string;
    translated: {
      description: string;
      displayName: string;
      itemNumber: string;
      placeholder: string;
      taxId: string;
      templateId: string;
      templateVersionId: string;
      type: string;
    };
    type: string;
    typeProperties?: GenericRecord;
    /** Format: date-time */
    readonly updatedAt?: string;
    values?: components["schemas"]["SwagCustomizedProductsTemplateOptionValue"][];
  };
  SwagCustomizedProductsTemplateOptionJsonApi: components["schemas"]["resource"] & {
    advancedSurcharge?: boolean;
    calculatedPrice?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    description?: string;
    displayName: string;
    id: string;
    itemNumber?: string;
    oneTimeSurcharge?: boolean;
    /** Format: float */
    percentageSurcharge?: number;
    placeholder?: string;
    /** Format: int64 */
    position?: number;
    price?: components["schemas"]["Price"][];
    relationships?: {
      prices?: {
        data?: {
          /** @example afae32efe0f84fece3f96b377b768b33 */
          id?: string;
          /** @example swag_customized_products_template_option_price */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option/6342f0c20b443cb5408ec0fc12430bcb/prices
           */
          related?: string;
        };
      };
      tax?: {
        data?: {
          /** @example 06565e5611f23fdf8cc43e5077b92b54 */
          id?: string;
          /** @example tax */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option/6342f0c20b443cb5408ec0fc12430bcb/tax
           */
          related?: string;
        };
      };
      template?: {
        data?: {
          /** @example 66f6181bcb4cff4cd38fbc804a036db6 */
          id?: string;
          /** @example swag_customized_products_template */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option/6342f0c20b443cb5408ec0fc12430bcb/template
           */
          related?: string;
        };
      };
      templateExclusionConditions?: {
        data?: {
          /** @example 57e853a74b92e339ec2e302b015e60f3 */
          id?: string;
          /** @example swag_customized_products_template_exclusion_condition */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option/6342f0c20b443cb5408ec0fc12430bcb/templateExclusionConditions
           */
          related?: string;
        };
      };
      values?: {
        data?: {
          /** @example f09cc7ee3a9a93273f4b80601cafb00c */
          id?: string;
          /** @example swag_customized_products_template_option_value */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option/6342f0c20b443cb5408ec0fc12430bcb/values
           */
          related?: string;
        };
      };
    };
    relativeSurcharge?: boolean;
    required?: boolean;
    taxId?: string;
    templateId: string;
    templateVersionId?: string;
    translated: {
      description: string;
      displayName: string;
      itemNumber: string;
      placeholder: string;
      taxId: string;
      templateId: string;
      templateVersionId: string;
      type: string;
    };
    type: string;
    typeProperties?: GenericRecord;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagCustomizedProductsTemplateOptionPrice: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: float */
    percentageSurcharge?: number;
    price?: components["schemas"]["Price"][];
    rule?: components["schemas"]["Rule"];
    ruleId?: string;
    templateOption?: components["schemas"]["SwagCustomizedProductsTemplateOption"];
    templateOptionId: string;
    templateOptionVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateOptionValue: {
    advancedSurcharge?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    default?: boolean;
    displayName: string;
    id: string;
    itemNumber?: string;
    oneTimeSurcharge?: boolean;
    /** Format: float */
    percentageSurcharge?: number;
    /** Format: int64 */
    position: number;
    price?: components["schemas"]["Price"][];
    prices?: components["schemas"]["SwagCustomizedProductsTemplateOptionValuePrice"][];
    relativeSurcharge?: boolean;
    tax?: components["schemas"]["Tax"];
    taxId?: string;
    templateExclusionConditions?: components["schemas"]["SwagCustomizedProductsTemplateExclusionCondition"][];
    templateOption?: components["schemas"]["SwagCustomizedProductsTemplateOption"];
    templateOptionId: string;
    templateOptionVersionId?: string;
    translated: {
      displayName: string;
      itemNumber: string;
      taxId: string;
      templateOptionId: string;
      templateOptionVersionId: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    value?: GenericRecord;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateOptionValueJsonApi: components["schemas"]["resource"] & {
    advancedSurcharge?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    default?: boolean;
    displayName: string;
    id: string;
    itemNumber?: string;
    oneTimeSurcharge?: boolean;
    /** Format: float */
    percentageSurcharge?: number;
    /** Format: int64 */
    position: number;
    price?: components["schemas"]["Price"][];
    relationships?: {
      prices?: {
        data?: {
          /** @example afae32efe0f84fece3f96b377b768b33 */
          id?: string;
          /** @example swag_customized_products_template_option_value_price */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option-value/b57f26a8362182be3e67a815927b7f37/prices
           */
          related?: string;
        };
      };
      tax?: {
        data?: {
          /** @example 06565e5611f23fdf8cc43e5077b92b54 */
          id?: string;
          /** @example tax */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option-value/b57f26a8362182be3e67a815927b7f37/tax
           */
          related?: string;
        };
      };
      templateExclusionConditions?: {
        data?: {
          /** @example 57e853a74b92e339ec2e302b015e60f3 */
          id?: string;
          /** @example swag_customized_products_template_exclusion_condition */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option-value/b57f26a8362182be3e67a815927b7f37/templateExclusionConditions
           */
          related?: string;
        };
      };
      templateOption?: {
        data?: {
          /** @example 6891a002a90a39e71e67c4fc148db8df */
          id?: string;
          /** @example swag_customized_products_template_option */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /swag-customized-products-template-option-value/b57f26a8362182be3e67a815927b7f37/templateOption
           */
          related?: string;
        };
      };
    };
    relativeSurcharge?: boolean;
    taxId?: string;
    templateOptionId: string;
    templateOptionVersionId?: string;
    translated: {
      displayName: string;
      itemNumber: string;
      taxId: string;
      templateOptionId: string;
      templateOptionVersionId: string;
      versionId: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    value?: GenericRecord;
    versionId?: string;
  };
  SwagCustomizedProductsTemplateOptionValuePrice: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: float */
    percentageSurcharge?: number;
    price?: components["schemas"]["Price"][];
    rule?: components["schemas"]["Rule"];
    ruleId?: string;
    templateOptionValue?: components["schemas"]["SwagCustomizedProductsTemplateOptionValue"];
    templateOptionValueId: string;
    templateOptionValueVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  SwagDelayAction: {
    /** Format: date-time */
    readonly createdAt?: string;
    customerId?: string;
    id: string;
    orderId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagDynamicAccessLandingPageRule: {
    id?: string;
    landingPage?: components["schemas"]["LandingPage"];
    landingPageId: string;
    landingPageVersionId?: string;
    rule?: components["schemas"]["Rule"];
    ruleId: string;
  };
  SwagDynamicAccessProductRule: {
    id?: string;
    product?: components["schemas"]["Product"];
    productId: string;
    productVersionId?: string;
    rule?: components["schemas"]["Rule"];
    ruleId: string;
  };
  SwagLanguagePackLanguage: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationConnection: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationData: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationGeneralSetting: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationLogging: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationMapping: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationMediaFile: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagMigrationRun: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagPaypalPosSalesChannel: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagPaypalPosSalesChannelRun: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagPaypalPosSalesChannelRunLog: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagPaypalTransactionReport: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagPaypalVaultToken: {
    id?: string;
    identifier?: string;
  };
  SwagPaypalVaultTokenMapping: {
    /** Format: date-time */
    readonly createdAt?: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    id?: string;
    paymentMethod?: components["schemas"]["PaymentMethod"];
    paymentMethodId: string;
    token?: components["schemas"]["SwagPaypalVaultToken"];
    tokenId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagSocialShoppingCustomer: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagSocialShoppingOrder: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagSocialShoppingProductError: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SwagSocialShoppingSalesChannel: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SystemConfig: {
    configurationKey: string;
    configurationValue: {
      _value?: GenericRecord;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    salesChannel?: components["schemas"]["SalesChannel"];
    salesChannelId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Tag: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    name: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Tax: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    /**
     * Format: int64
     * Added since version: 6.4.0.0.
     */
    position?: number;
    /** Format: float */
    taxRate: number;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  TaxProvider: {
    active?: boolean;
    appId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    /** Format: int64 */
    priority: number;
    processUrl?: string;
    translated: {
      appId: string;
      name: string;
      processUrl: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  TaxRule: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  TaxRuleType: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Theme: {
    active: boolean;
    author: string;
    baseConfig?: GenericRecord;
    configValues?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    description?: string;
    helpTexts?: GenericRecord;
    id: string;
    labels?: GenericRecord;
    media?: components["schemas"]["Media"][];
    name: string;
    parentThemeId?: string;
    previewMediaId?: string;
    technicalName?: string;
    translated: {
      author: string;
      description: string;
      name: string;
      parentThemeId: string;
      previewMediaId: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ToggleBroadcastModeInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["ToggleBroadcastModePayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "broadcastMode.toggled";
  };
  ToggleBroadcastModePayload: {
    /** Status if the mode is toggled to active or inactive */
    active: boolean;
  };
  TotalCountMode: "none" | "exact" | "next-pages";
  Unit: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: GenericRecord;
    id: string;
    name: string;
    shortCode: string;
    translated: {
      name: string;
      shortCode: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  UpdateAttendeeRequestBody: {
    /** Name of the attendee */
    attendeeName?: string;
    /** The permission for guide cart actions */
    guideCartPermissionsGranted?: boolean;
    /** Id of the attendee in the video chat tool */
    videoUserId?: string;
  };
  User: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  UserAccessKey: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  UserConfig: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  UserRecovery: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ViewModeChangedInteraction: components["schemas"]["BaseInteraction"] & {
    name: string;
    payload: components["schemas"]["ViewModeChangedPayload"];
  } & {
    /**
     * discriminator enum property added by openapi-typescript
     * @enum {string}
     */
    name: "viewMode.changed";
  };
  ViewModeChangedPayload: {
    /**
     * The view mode of presentation
     * @default presentation
     * @enum {string}
     */
    mode?: "onlyYou" | "presentation" | "videoGrid";
  };
  Warehouse: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  WarehouseGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  Webhook: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  WebhookEventLog: {
    /** Format: date-time */
    readonly createdAt?: string;
    id?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  WishlistLoadRouteResponse: {
    products: components["schemas"]["ProductListingResult"];
    wishlist?: {
      customerId?: string;
      salesChannelId?: string;
    };
  };
  attributes: {
    [key: string]: unknown;
  };
  data: components["schemas"]["resource"] | components["schemas"]["resource"][];
  error: {
    /** An application-specific error code, expressed as a string value. */
    code?: string;
    /** A human-readable description of the problem. */
    description?: string;
    /** A human-readable explanation specific to this occurrence of the problem. */
    detail?: string;
    /** A unique identifier for this particular occurrence of the problem. */
    id?: string;
    links?: components["schemas"]["links"];
    meta?: components["schemas"]["meta"];
    source?: {
      /** A string indicating which query parameter caused the error. */
      parameter?: string;
      /** A JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. */
      pointer?: string;
    };
    /** The HTTP status code applicable to this problem, expressed as a string value. */
    status?: string;
    /** A short, human-readable summary of the problem. It **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization. */
    title?: string;
  };
  failure: {
    errors: components["schemas"]["error"][];
    links?: components["schemas"]["links"];
    meta?: components["schemas"]["meta"];
  };
  info: {
    jsonapi?: components["schemas"]["jsonapi"];
    links?: components["schemas"]["links"];
    meta: components["schemas"]["meta"];
  };
  jsonapi: {
    meta?: components["schemas"]["meta"];
    version?: string;
  };
  link:
    | string
    | {
        /**
         * Format: uri-reference
         * A string containing the link's URL.
         */
        href: string;
        meta?: components["schemas"]["meta"];
      };
  linkage: {
    id: string;
    meta?: components["schemas"]["meta"];
    type: string;
  };
  links: {
    [key: string]: components["schemas"]["link"];
  };
  meta: {
    [key: string]: unknown;
  };
  pagination: {
    /**
     * Format: uri-reference
     * The first page of data
     */
    first?: string;
    /**
     * Format: uri-reference
     * The last page of data
     */
    last?: string;
    /**
     * Format: uri-reference
     * The next page of data
     */
    next?: string;
    /**
     * Format: uri-reference
     * The previous page of data
     */
    prev?: string;
  };
  relationshipLinks: {
    related?: components["schemas"]["link"];
    self?: GenericRecord[] & components["schemas"]["link"];
  } & {
    [key: string]: unknown;
  };
  relationshipToMany: components["schemas"]["linkage"][];
  relationshipToOne: unknown & components["schemas"]["linkage"];
  relationships:
    | unknown
    | unknown
    | unknown
    | {
        /** Member, whose value represents "resource linkage". */
        data?:
          | components["schemas"]["relationshipToOne"]
          | components["schemas"]["relationshipToMany"];
        links?: components["schemas"]["relationshipLinks"];
      };
  resource: {
    attributes?: components["schemas"]["attributes"];
    id: string;
    links?: components["schemas"]["links"];
    meta?: components["schemas"]["meta"];
    relationships?: components["schemas"]["relationships"];
    type: string;
  };
  success: {
    data: components["schemas"]["data"];
    /** To reduce the number of HTTP requests, servers **MAY** allow responses that include related resources along with the requested primary resources. Such responses are called "compound documents". */
    included?: components["schemas"]["resource"][];
    /** Link members related to the primary data. */
    links?: components["schemas"]["links"] &
      components["schemas"]["pagination"];
    meta?: components["schemas"]["meta"];
  };
  swag_paypal_v1_capture: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    id: string;
    is_final_capture: boolean;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    reason_code: string;
    state: string;
    transaction_fee: components["schemas"]["swag_paypal_v1_capture_transaction_fee"];
    update_time: string;
  };
  swag_paypal_v1_capture_transaction_fee: components["schemas"]["swag_paypal_v1_common_value"];
  swag_paypal_v1_client_token: {
    client_token: string;
    /**
     * Format: date-time
     * Calculated expiration date
     */
    expire_date_time: string;
    /** The lifetime of the access token, in seconds. */
    expires_in: number;
  };
  swag_paypal_v1_common_address: {
    city: string;
    country_code: string;
    line1: string;
    line2: string | null;
    phone: string | null;
    postal_code: string;
    state: string | null;
  };
  swag_paypal_v1_common_amount: {
    currency: string;
    details: components["schemas"]["swag_paypal_v1_common_details"];
    total: string;
  };
  swag_paypal_v1_common_details: {
    discount: string;
    handling_fee: string;
    insurance: string;
    shipping: string;
    shipping_discount: string;
    subtotal: string;
    tax: string;
  };
  swag_paypal_v1_common_link: {
    enc_type: string | null;
    href: string;
    method: string;
    rel: string;
  };
  swag_paypal_v1_common_money: {
    currency_code: string;
    value: string;
  };
  swag_paypal_v1_common_value: {
    currency: string;
    value: string;
  };
  swag_paypal_v1_create_webhooks: {
    event_types: components["schemas"]["swag_paypal_v1_create_webhooks_event_type"][];
    url: string;
  };
  swag_paypal_v1_create_webhooks_event_type: {
    name: string;
  };
  swag_paypal_v1_disputes: {
    items: components["schemas"]["swag_paypal_v1_disputes_item"][] | null;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
  };
  swag_paypal_v1_disputes_common_buyer: {
    name: string;
  };
  swag_paypal_v1_disputes_common_item: {
    dispute_amount: components["schemas"]["swag_paypal_v1_common_money"];
    item_description: string;
    item_id: string;
    item_quantity: string;
    notes: string;
    partner_transaction_id: string;
    reason: string;
  };
  swag_paypal_v1_disputes_common_product_details: {
    product_received: string;
    product_received_time: string;
    purchase_url: string;
    return_details: components["schemas"]["swag_paypal_v1_disputes_common_return_details"];
    sub_reasons: components["schemas"]["swag_paypal_v1_disputes_common_sub_reason"][];
  };
  swag_paypal_v1_disputes_common_return_details: {
    mode: string;
    receipt: boolean;
    return_confirmation_number: string;
    return_time: string;
    returned: boolean;
  };
  swag_paypal_v1_disputes_common_seller: {
    email: string;
    merchant_id: string;
    name: string;
  };
  swag_paypal_v1_disputes_common_service_details: {
    description: string;
    note: string;
    purchase_url: string;
    service_started: string;
    sub_reasons: components["schemas"]["swag_paypal_v1_disputes_common_sub_reason"][];
  };
  swag_paypal_v1_disputes_common_sub_reason: {
    sub_reason: string;
  };
  swag_paypal_v1_disputes_common_transaction: {
    buyer: components["schemas"]["swag_paypal_v1_disputes_common_buyer"];
    buyer_transaction_id: string;
    create_time: string;
    custom: string;
    gross_amount: components["schemas"]["swag_paypal_v1_common_money"];
    invoice_number: string;
    items: components["schemas"]["swag_paypal_v1_disputes_common_item"][];
    reference_id: string;
    seller: components["schemas"]["swag_paypal_v1_disputes_common_seller"];
    seller_transaction_id: string;
    transaction_status: string;
  };
  swag_paypal_v1_disputes_item: {
    adjudications: components["schemas"]["swag_paypal_v1_disputes_item_adjudication"][];
    buyer_response_due_date: string | null;
    communication_details:
      | components["schemas"]["swag_paypal_v1_disputes_item_communication_details"]
      | null;
    create_time: string;
    dispute_amount: components["schemas"]["swag_paypal_v1_disputes_item_dispute_amount"];
    dispute_channel: string | null;
    dispute_id: string;
    dispute_life_cycle_stage: string;
    dispute_outcome:
      | components["schemas"]["swag_paypal_v1_disputes_item_dispute_outcome"]
      | null;
    /** @enum {string|null} */
    dispute_state:
      | "REQUIRED_ACTION"
      | "REQUIRED_OTHER_PARTY_ACTION"
      | "UNDER_PAYPAL_REVIEW"
      | "RESOLVED"
      | "OPEN_INQUIRIES"
      | "APPEALABLE"
      | null;
    disputed_transactions:
      | components["schemas"]["swag_paypal_v1_disputes_item_disputed_transaction"][]
      | null;
    evidences:
      | components["schemas"]["swag_paypal_v1_disputes_item_evidence"][]
      | null;
    extensions: components["schemas"]["swag_paypal_v1_disputes_item_extensions"];
    external_reason_code: string | null;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    messages:
      | components["schemas"]["swag_paypal_v1_disputes_item_message"][]
      | null;
    money_movements: components["schemas"]["swag_paypal_v1_disputes_item_money_movement"][];
    offer: components["schemas"]["swag_paypal_v1_disputes_item_offer"] | null;
    partner_actions:
      | components["schemas"]["swag_paypal_v1_disputes_item_partner_action"][]
      | null;
    reason: string;
    refund_details:
      | components["schemas"]["swag_paypal_v1_disputes_item_refund_details"]
      | null;
    seller_response_due_date: string | null;
    status: string;
    supporting_info:
      | components["schemas"]["swag_paypal_v1_disputes_item_supporting_info"][]
      | null;
    update_time: string;
  };
  swag_paypal_v1_disputes_item_adjudication: {
    adjudication_time: string;
    dispute_life_cycle_stage: string;
    reason: string;
    type: string;
  };
  swag_paypal_v1_disputes_item_communication_details: {
    email: string;
    note: string;
    time_posted: string;
  };
  swag_paypal_v1_disputes_item_dispute_amount: components["schemas"]["swag_paypal_v1_common_money"];
  swag_paypal_v1_disputes_item_dispute_outcome: {
    amount_refunded: components["schemas"]["swag_paypal_v1_common_money"];
    outcome_code: string;
  };
  swag_paypal_v1_disputes_item_disputed_transaction: components["schemas"]["swag_paypal_v1_disputes_common_transaction"] & {
    seller_protection_eligible: boolean;
  };
  swag_paypal_v1_disputes_item_evidence: {
    documents: components["schemas"]["swag_paypal_v1_disputes_item_evidence_document"][];
    evidence_info: components["schemas"]["swag_paypal_v1_disputes_item_evidence_evidence_info"];
    evidence_type: string;
    item_id: string;
    notes: string;
  };
  swag_paypal_v1_disputes_item_evidence_document: {
    name: string;
  };
  swag_paypal_v1_disputes_item_evidence_evidence_info: {
    refund_ids: components["schemas"]["swag_paypal_v1_disputes_item_evidence_evidence_info_refund_id"][];
    tracking_info: components["schemas"]["swag_paypal_v1_disputes_item_evidence_evidence_info_tracking_info"][];
  };
  swag_paypal_v1_disputes_item_evidence_evidence_info_refund_id: {
    refund_id: string;
  };
  swag_paypal_v1_disputes_item_evidence_evidence_info_tracking_info: {
    carrier_name: string;
    carrier_name_other: string;
    tracking_number: string;
    tracking_url: string;
  };
  swag_paypal_v1_disputes_item_extensions: {
    billing_dispute_properties: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties"];
    buyer_contacted_channel: string;
    buyer_contacted_time: string;
    merchandize_dispute_properties: components["schemas"]["swag_paypal_v1_disputes_item_extensions_merchandize_dispute_properties"];
    merchant_contacted: boolean;
    merchant_contacted_mode: string;
    merchant_contacted_outcome: string;
    merchant_contacted_time: string;
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties: {
    canceled_recurring_billing: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_canceled_recurring_billing"];
    credit_not_processed: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_credit_not_processed"];
    duplicate_transaction: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_duplicate_transaction"];
    incorrect_transaction_amount: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_incorrect_transaction_amount"];
    payment_by_other_means: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_payment_by_other_means"];
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_canceled_recurring_billing: {
    cancellation_details: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details"];
    expected_refund: components["schemas"]["swag_paypal_v1_common_money"];
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_common_agreed_refund_details: {
    merchant_agreed_refund: boolean;
    merchant_agreed_refund_time: string;
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details: {
    cancellation_date: string;
    cancellation_mode: string;
    cancellation_number: string;
    cancelled: boolean;
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_credit_not_processed: {
    agreed_refund_details: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_common_agreed_refund_details"];
    cancellation_details: components["schemas"]["swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details"];
    expected_refund: components["schemas"]["swag_paypal_v1_common_money"];
    issue_type: string;
    product_details: components["schemas"]["swag_paypal_v1_disputes_common_product_details"];
    service_details: components["schemas"]["swag_paypal_v1_disputes_common_service_details"];
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_duplicate_transaction: {
    original_transaction: components["schemas"]["swag_paypal_v1_disputes_common_transaction"];
    received_duplicate: boolean;
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_incorrect_transaction_amount: {
    correct_transaction_amount: components["schemas"]["swag_paypal_v1_common_money"];
    correct_transaction_time: string;
  };
  swag_paypal_v1_disputes_item_extensions_billing_dispute_properties_payment_by_other_means: {
    charge_different_from_original: boolean;
    payment_instrument_suffix: string;
    payment_method: string;
    received_duplicate: boolean;
  };
  swag_paypal_v1_disputes_item_extensions_merchandize_dispute_properties: {
    issue_type: string;
    product_details: components["schemas"]["swag_paypal_v1_disputes_common_product_details"];
    service_details: components["schemas"]["swag_paypal_v1_disputes_common_service_details"];
  };
  swag_paypal_v1_disputes_item_message: {
    content: string;
    posted_by: string;
    time_posted: string;
  };
  swag_paypal_v1_disputes_item_money_movement: {
    affected_party: string;
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    initiated_time: string;
    reason: string;
    type: string;
  };
  swag_paypal_v1_disputes_item_offer: {
    buyer_requested_amount: components["schemas"]["swag_paypal_v1_common_money"];
    history:
      | components["schemas"]["swag_paypal_v1_disputes_item_offer_history"][]
      | null;
    offer_type: string;
    seller_offered_amount: components["schemas"]["swag_paypal_v1_common_money"];
  };
  swag_paypal_v1_disputes_item_offer_history: {
    actor: string;
    event_type: string;
    offer_time: string;
    offer_type: string;
  };
  swag_paypal_v1_disputes_item_partner_action: {
    amount: components["schemas"]["swag_paypal_v1_common_money"];
    create_time: string;
    due_time: string;
    id: string;
    name: string;
    status: string;
    update_time: string;
  };
  swag_paypal_v1_disputes_item_refund_details: {
    allowed_refund_amount: components["schemas"]["swag_paypal_v1_common_money"];
  };
  swag_paypal_v1_disputes_item_supporting_info: {
    notes: string;
    provided_time: string;
    source: string;
  };
  swag_paypal_v1_do_void: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    state: string;
    update_time: string;
  };
  swag_paypal_v1_merchant_integrations: {
    capabilities:
      | components["schemas"]["swag_paypal_v1_merchant_integrations_capability"][]
      | null;
    granted_permissions: string[];
    legal_name: string;
    merchant_id: string;
    oauth_integrations: components["schemas"]["swag_paypal_v1_merchant_integrations_oauth_integration"][];
    payments_receivable: boolean;
    primary_email: string;
    primary_email_confirmed: boolean;
    products: components["schemas"]["swag_paypal_v1_merchant_integrations_product"][];
    tracking_id: string;
  };
  swag_paypal_v1_merchant_integrations_capability: {
    name: string;
    status: string;
  };
  swag_paypal_v1_merchant_integrations_oauth_integration: {
    integration_method?: string;
    integration_type?: string;
    oauth_third_party?: components["schemas"]["swag_paypal_v1_merchant_integrations_oauth_integration_oauth_third_party"][];
    status?: string;
  };
  swag_paypal_v1_merchant_integrations_oauth_integration_oauth_third_party: {
    access_token?: string;
    merchant_client_id?: string;
    partner_client_id?: string;
    refresh_token?: string;
    scopes: string[];
  };
  swag_paypal_v1_merchant_integrations_product: {
    capabilities?: string[];
    name: string;
    vetting_status?: string;
  };
  swag_paypal_v1_oauth_credentials: {
    restId: string;
    restSecret: string;
    url: string;
  };
  swag_paypal_v1_patch: {
    /** @enum {string} */
    op: "add" | "replace";
    path: string;
    value: string | Record<string, never>[];
  };
  swag_paypal_v1_payment: {
    application_context: components["schemas"]["swag_paypal_v1_payment_application_context"];
    cart: string;
    create_time: string;
    id: string;
    /**
     * @default sale
     * @enum {string}
     */
    intent?: "sale" | "authorize" | "order";
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    payer: components["schemas"]["swag_paypal_v1_payment_payer"];
    payment_instruction:
      | components["schemas"]["swag_paypal_v1_payment_payment_instruction"]
      | null;
    redirect_urls: components["schemas"]["swag_paypal_v1_payment_redirect_urls"];
    state: string;
    transactions: components["schemas"]["swag_paypal_v1_payment_transaction"][];
    update_time: string;
  };
  swag_paypal_v1_payment_application_context: {
    brand_name: string;
    /** @enum {string} */
    landing_page: "Login" | "Billing";
    locale: string;
    /** @default SET_PROVIDED_ADDRESS */
    shipping_preference?: string;
    /** @default commit */
    user_action?: string;
  };
  swag_paypal_v1_payment_payer: {
    external_selected_funding_instrument_type: string;
    payer_info: components["schemas"]["swag_paypal_v1_payment_payer_payer_info"];
    payment_method: string;
    status: string;
  };
  swag_paypal_v1_payment_payer_execute_payer_info: {
    payer_id: string;
  };
  swag_paypal_v1_payment_payer_payer_info: components["schemas"]["swag_paypal_v1_payment_payer_execute_payer_info"] & {
    billing_address:
      | components["schemas"]["swag_paypal_v1_common_address"]
      | null;
    country_code: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    shipping_address: components["schemas"]["swag_paypal_v1_payment_transaction_item_list_shipping_address"];
  };
  swag_paypal_v1_payment_payment_instruction: {
    amount: components["schemas"]["swag_paypal_v1_common_value"];
    instruction_type: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    payment_due_date: string;
    recipient_banking_instruction: components["schemas"]["swag_paypal_v1_payment_payment_instruction_recipient_banking_instruction"];
    reference_number: string;
  };
  swag_paypal_v1_payment_payment_instruction_recipient_banking_instruction: {
    account_holder_name: string;
    bank_identifier_code: string;
    bank_name: string;
    international_bank_account_number: string;
  };
  swag_paypal_v1_payment_redirect_urls: {
    cancel_url: string;
    return_url: string;
  };
  swag_paypal_v1_payment_transaction: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    custom: string;
    description: string;
    invoice_number: string | null;
    item_list:
      | components["schemas"]["swag_paypal_v1_payment_transaction_item_list"]
      | null;
    payee: components["schemas"]["swag_paypal_v1_payment_transaction_payee"];
    related_resources: components["schemas"]["swag_paypal_v1_payment_transaction_related_resource"][];
    soft_descriptor: string;
  };
  swag_paypal_v1_payment_transaction_item_list: {
    items: components["schemas"]["swag_paypal_v1_payment_transaction_item_list_item"][];
    shipping_address: components["schemas"]["swag_paypal_v1_payment_transaction_item_list_shipping_address"];
    shipping_options: components["schemas"]["swag_paypal_v1_payment_transaction_item_list_shipping_option"][];
    shipping_phone_number: string;
  };
  swag_paypal_v1_payment_transaction_item_list_item: {
    currency: string;
    name: string;
    price: string;
    quantity: number;
    sku: string | null;
    tax: string;
  };
  swag_paypal_v1_payment_transaction_item_list_shipping_address: components["schemas"]["swag_paypal_v1_common_address"] & {
    recipient_name: string;
  };
  swag_paypal_v1_payment_transaction_item_list_shipping_option: unknown;
  swag_paypal_v1_payment_transaction_payee: {
    email: string;
    merchant_id: string;
  };
  swag_paypal_v1_payment_transaction_related_resource: {
    authorization:
      | components["schemas"]["swag_paypal_v1_payment_transaction_related_resource_authorization"]
      | null;
    capture:
      | components["schemas"]["swag_paypal_v1_payment_transaction_related_resource_capture"]
      | null;
    order:
      | components["schemas"]["swag_paypal_v1_payment_transaction_related_resource_order"]
      | null;
    refund:
      | components["schemas"]["swag_paypal_v1_payment_transaction_related_resource_refund"]
      | null;
    sale:
      | components["schemas"]["swag_paypal_v1_payment_transaction_related_resource_sale"]
      | null;
  };
  swag_paypal_v1_payment_transaction_related_resource_authorization: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    reason_code: string;
    receipt_id: string;
    state: string;
    update_time: string;
    valid_until: string;
  };
  swag_paypal_v1_payment_transaction_related_resource_capture: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    custom: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    state: string;
    transaction_fee: components["schemas"]["swag_paypal_v1_common_value"];
    update_time: string;
  };
  swag_paypal_v1_payment_transaction_related_resource_order: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    reason_code: string;
    receipt_id: string;
    state: string;
    update_time: string;
  };
  swag_paypal_v1_payment_transaction_related_resource_refund: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    capture_id: string;
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    sale_id: string;
    state: string;
    update_time: string;
  };
  swag_paypal_v1_payment_transaction_related_resource_sale: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    state: string;
    transaction_fee: components["schemas"]["swag_paypal_v1_common_value"];
    update_time: string;
  };
  swag_paypal_v1_plan: {
    billing_cycles: components["schemas"]["swag_paypal_v1_plan_billing_cycle"][];
    description: string | null;
    name: string;
    payment_preferences: components["schemas"]["swag_paypal_v1_plan_payment_preferences"];
    product_id: string;
    status: string;
    taxes: components["schemas"]["swag_paypal_v1_plan_taxes"];
  };
  swag_paypal_v1_plan_billing_cycle: {
    frequency: components["schemas"]["swag_paypal_v1_plan_billing_cycle_frequency"];
    pricing_scheme: components["schemas"]["swag_paypal_v1_plan_billing_cycle_pricing_scheme"];
    sequence: number;
    tenure_type: string;
    total_cycles: number;
  };
  swag_paypal_v1_plan_billing_cycle_frequency: {
    interval_count: number;
    interval_unit: string;
  };
  swag_paypal_v1_plan_billing_cycle_pricing_scheme: {
    fixed_price: components["schemas"]["swag_paypal_v1_common_money"];
  };
  swag_paypal_v1_plan_payment_preferences: {
    auto_bill_outstanding: boolean;
    payment_failure_threshold: number;
  };
  swag_paypal_v1_plan_taxes: {
    inclusive: boolean;
    percentage: string;
  };
  swag_paypal_v1_product: {
    description: string;
    name: string;
    type: string;
  };
  swag_paypal_v1_refund: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    capture_id: string;
    create_time: string;
    description: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    parent_payment: string;
    reason: string;
    refund_from_received_amount: components["schemas"]["swag_paypal_v1_common_value"];
    refund_from_transaction_fee: components["schemas"]["swag_paypal_v1_common_value"];
    sale_id: string;
    state: string;
    total_refunded_amount: components["schemas"]["swag_paypal_v1_common_value"];
    update_time: string;
  };
  swag_paypal_v1_shipping: {
    trackers: components["schemas"]["swag_paypal_v1_shipping_tracker"][];
  };
  swag_paypal_v1_shipping_tracker: {
    carrier: string;
    notify_buyer: boolean;
    /** Pattern: '2022-08-15' */
    shipment_date: string;
    status: string;
    tracking_number: string;
    transaction_id: string;
  };
  swag_paypal_v1_subscription: {
    application_context: components["schemas"]["swag_paypal_v1_subscription_application_context"];
    billing_info:
      | components["schemas"]["swag_paypal_v1_subscription_billing_info"]
      | null;
    create_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    plan_id: string;
    quantity: string;
    shipping_amount: components["schemas"]["swag_paypal_v1_common_money"];
    start_time: string;
    status: string;
    status_update_time: string;
    subscriber: components["schemas"]["swag_paypal_v1_subscription_subscriber"];
    update_time: string;
  };
  swag_paypal_v1_subscription_application_context: {
    brand_name: string;
    cancel_url: string;
    locale: string;
    return_url: string;
    /** @default SET_PROVIDED_ADDRESS */
    shipping_preference?: string;
    /** @default SUBSCRIBE_NOW */
    user_action?: string;
  };
  swag_paypal_v1_subscription_billing_info: {
    cycle_executions: components["schemas"]["swag_paypal_v1_subscription_billing_info_cycle_execution"][];
    failed_payments_count: number;
    last_payment: components["schemas"]["swag_paypal_v1_subscription_billing_info_last_payment"];
    next_billing_time: string | null;
    outstanding_balance: components["schemas"]["swag_paypal_v1_subscription_billing_info_outstanding_balance"];
  };
  swag_paypal_v1_subscription_billing_info_cycle_execution: {
    cycles_completed: number;
    cycles_remaining: number;
    sequence: number;
    tenure_type: string;
    total_cycles: number;
  };
  swag_paypal_v1_subscription_billing_info_last_payment: {
    amount: components["schemas"]["swag_paypal_v1_common_money"];
    time: string;
  };
  swag_paypal_v1_subscription_billing_info_outstanding_balance: components["schemas"]["swag_paypal_v1_common_money"];
  swag_paypal_v1_subscription_subscriber: {
    email_address: string;
    name: components["schemas"]["swag_paypal_v1_subscription_subscriber_name"];
    payer_id: string;
    shipping_address:
      | components["schemas"]["swag_paypal_v1_subscription_subscriber_shipping_address"]
      | null;
  };
  swag_paypal_v1_subscription_subscriber_name: {
    given_name: string;
    surname: string;
  };
  swag_paypal_v1_subscription_subscriber_shipping_address: {
    address:
      | components["schemas"]["swag_paypal_v1_subscription_subscriber_shipping_address_address"]
      | null;
    name:
      | components["schemas"]["swag_paypal_v1_subscription_subscriber_shipping_address_name"]
      | null;
  };
  swag_paypal_v1_subscription_subscriber_shipping_address_address: {
    address_line_1: string | null;
    address_line_2: string | null;
    admin_area_1: string | null;
    admin_area_2: string | null;
    country_code: string;
    postal_code: string | null;
  };
  swag_paypal_v1_subscription_subscriber_shipping_address_name: {
    full_name: string;
  };
  swag_paypal_v1_token: {
    /** The access token issued by PayPal. After the access token
     *     expires (see $expiresIn), you must request a new access token. */
    access_token: string;
    app_id: string;
    /**
     * Format: date-time
     * Calculated expiration date
     */
    expire_date_time: string;
    /** The lifetime of the access token, in seconds. */
    expires_in: number;
    id_token: string | null;
    nonce: string;
    /** Scopes expressed in the form of resource URL endpoints. The value of the scope parameter
     *     is expressed as a list of space-delimited, case-sensitive strings. */
    scope: string;
    /** The type of the token issued as described in OAuth2.0 RFC6749,
     *     Section 7.1. Value is case insensitive. */
    token_type: string;
  };
  swag_paypal_v1_webhook: {
    create_time: string;
    event_type: string;
    event_version: string;
    id: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    resource:
      | (
          | components["schemas"]["swag_paypal_v3_payment_token"]
          | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_authorization"]
          | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_capture"]
          | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_refund"]
          | components["schemas"]["swag_paypal_v1_webhook_resource"]
          | components["schemas"]["swag_paypal_v1_subscription"]
        )
      | null;
    resource_type: string;
    resource_version: string;
    summary: string;
  };
  swag_paypal_v1_webhook_resource: {
    amount: components["schemas"]["swag_paypal_v1_common_amount"];
    billing_agreement_id: string | null;
    clearing_time: string;
    create_time: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["swag_paypal_v1_common_link"][];
    merchant_id: string | null;
    parent_payment: string | null;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    refund_reason_code: string | null;
    sale_id: string | null;
    state: string;
    transaction_fee: components["schemas"]["swag_paypal_v1_common_value"];
    update_time: string;
  };
  swag_paypal_v2_common_address: {
    /** The first line of the address. For example, number or street. For example, 173 Drury Lane.
     *     Required for data entry and compliance and risk checks. Must contain the full address. */
    address_line_1: string | null;
    /** The second line of the address. For example, suite or apartment number. */
    address_line_2: string | null;
    /** The highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision.
     *     Format for postal delivery. For example, CA and not California. */
    admin_area_1: string | null;
    /** A city, town, or village. Smaller than $adminArea1 */
    admin_area_2: string | null;
    country_code: string;
    postal_code: string | null;
  };
  swag_paypal_v2_common_link: {
    enc_type: string | null;
    href: string;
    method: string;
    rel: string;
  };
  swag_paypal_v2_common_money: {
    currency_code: string;
    value: string;
  };
  swag_paypal_v2_common_name: {
    given_name: string;
    surname: string;
  };
  swag_paypal_v2_common_phone_number: {
    country_code: string;
    national_number: string;
  };
  swag_paypal_v2_order: {
    application_context: components["schemas"]["swag_paypal_v2_order_application_context"];
    create_time: string;
    id: string;
    intent: string;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    payer: components["schemas"]["swag_paypal_v2_order_payer"];
    payment_source:
      | components["schemas"]["swag_paypal_v2_order_payment_source"]
      | null;
    processing_instruction: string;
    purchase_units:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit"][]
      | null;
    status: string;
    update_time: string;
  };
  swag_paypal_v2_order_application_context: {
    brand_name: string;
    cancel_url: string;
    /**
     * @default NO_PREFERENCE
     * @enum {string}
     */
    landing_page?: "LOGIN" | "BILLING" | "NO_PREFERENCE";
    return_url: string;
    /**
     * @default SET_PROVIDED_ADDRESS
     * @enum {string}
     */
    shipping_preference?:
      | "SET_PROVIDED_ADDRESS"
      | "NO_SHIPPING"
      | "GET_FROM_FILE";
    /**
     * @default PAY_NOW
     * @enum {string}
     */
    user_action?: "CONTINUE" | "PAY_NOW";
  };
  swag_paypal_v2_order_payer: {
    address: components["schemas"]["swag_paypal_v2_common_address"];
    email_address: string;
    name: components["schemas"]["swag_paypal_v2_common_name"];
    payer_id: string;
    phone:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_phone"]
      | null;
  };
  swag_paypal_v2_order_payment_source: {
    apple_pay: components["schemas"]["swag_paypal_v2_order_payment_source_apple_pay"];
    bancontact:
      | components["schemas"]["swag_paypal_v2_order_payment_source_bancontact"]
      | null;
    blik:
      | components["schemas"]["swag_paypal_v2_order_payment_source_blik"]
      | null;
    boletobancario:
      | components["schemas"]["swag_paypal_v2_order_payment_source_boletobancario"]
      | null;
    card:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card"]
      | null;
    eps:
      | components["schemas"]["swag_paypal_v2_order_payment_source_eps"]
      | null;
    giropay:
      | components["schemas"]["swag_paypal_v2_order_payment_source_giropay"]
      | null;
    google_pay:
      | components["schemas"]["swag_paypal_v2_order_payment_source_google_pay"]
      | null;
    ideal:
      | components["schemas"]["swag_paypal_v2_order_payment_source_ideal"]
      | null;
    multibanco:
      | components["schemas"]["swag_paypal_v2_order_payment_source_multibanco"]
      | null;
    my_bank:
      | components["schemas"]["swag_paypal_v2_order_payment_source_my_bank"]
      | null;
    oxxo:
      | components["schemas"]["swag_paypal_v2_order_payment_source_oxxo"]
      | null;
    p24:
      | components["schemas"]["swag_paypal_v2_order_payment_source_p24"]
      | null;
    pay_upon_invoice:
      | components["schemas"]["swag_paypal_v2_order_payment_source_pay_upon_invoice"]
      | null;
    paypal:
      | components["schemas"]["swag_paypal_v2_order_payment_source_paypal"]
      | null;
    sofort:
      | components["schemas"]["swag_paypal_v2_order_payment_source_sofort"]
      | null;
    token:
      | components["schemas"]["swag_paypal_v2_order_payment_source_token"]
      | null;
    trustly:
      | components["schemas"]["swag_paypal_v2_order_payment_source_trustly"]
      | null;
    venmo:
      | components["schemas"]["swag_paypal_v2_order_payment_source_venmo"]
      | null;
  };
  swag_paypal_v2_order_payment_source_apple_pay: {
    attributes:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes"]
      | null;
    card:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card"]
      | null;
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_bancontact: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_blik: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_boletobancario: {
    billing_address: components["schemas"]["swag_paypal_v2_common_address"];
    country_code: string;
    email: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    expiry_date: string;
    name: string;
    tax_info: components["schemas"]["swag_paypal_v2_order_payment_source_boletobancario_tax_info"];
  };
  swag_paypal_v2_order_payment_source_boletobancario_tax_info: {
    tax_id: string;
    tax_id_type: string;
  };
  swag_paypal_v2_order_payment_source_card: {
    attributes:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes"]
      | null;
    authentication_result:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card_authentication_result"]
      | null;
    billing_address:
      | components["schemas"]["swag_paypal_v2_common_address"]
      | null;
    brand: string;
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    last_digits: string;
    name: string;
    stored_credential:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card_stored_credential"]
      | null;
    type: string;
    vault_id: string;
  };
  swag_paypal_v2_order_payment_source_card_authentication_result: {
    liability_shift: string;
    three_d_secure:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card_authentication_result_3d_secure"]
      | null;
  };
  swag_paypal_v2_order_payment_source_card_authentication_result_3d_secure: {
    authentication_status: string;
    enrollment_status: string;
  };
  swag_paypal_v2_order_payment_source_card_stored_credential: {
    /** @enum {string} */
    payment_initiator: "MERCHANT" | "CUSTOMER";
    /** @enum {string} */
    payment_type: "RECURRING" | "ONE_TIME" | "UNSCHEDULED";
    previous_network_transaction_reference: string;
    /** @enum {string} */
    usage: "DERIVED" | "FIRST" | "SUBSEQUENT";
  };
  swag_paypal_v2_order_payment_source_common_attributes: {
    customer: components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes_customer"];
    vault: components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes_vault"];
    verification: components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes_verification"];
  };
  swag_paypal_v2_order_payment_source_common_attributes_customer: {
    id: string;
  };
  swag_paypal_v2_order_payment_source_common_attributes_vault: {
    confirm_payment_token: string;
    customer:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes_customer"]
      | null;
    id: string | null;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    permit_multiple_payment_tokens: boolean;
    status: string;
    store_in_vault: string;
    usage_type: string;
  };
  swag_paypal_v2_order_payment_source_common_attributes_verification: {
    method: string;
  };
  swag_paypal_v2_order_payment_source_common_experience_context: {
    brand_name: string;
    cancel_url: string;
    /** Only: PUI */
    customer_service_instructions: string[];
    /**
     * @default NO_PREFERENCE
     * @enum {string}
     */
    landing_page?: "LOGIN" | "GUEST_CHECKOUT" | "NO_PREFERENCE";
    locale: string;
    logo_url: string;
    /**
     * Only: PayPal Wallet
     * @enum {string}
     */
    payment_method_preference: "UNRESTRICTED" | "IMMEDIATE_PAYMENT_REQUIRED";
    return_url: string;
    /**
     * @default SET_PROVIDED_ADDRESS
     * @enum {string}
     */
    shipping_preference?:
      | "SET_PROVIDED_ADDRESS"
      | "NO_SHIPPING"
      | "GET_FROM_FILE";
    /**
     * @default PAY_NOW
     * @enum {string}
     */
    user_action?: "CONTINUE" | "PAY_NOW";
  };
  swag_paypal_v2_order_payment_source_common_phone: {
    phone_number: components["schemas"]["swag_paypal_v2_common_phone_number"];
    phone_type: string;
  };
  swag_paypal_v2_order_payment_source_eps: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_giropay: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_google_pay: {
    attributes:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes"]
      | null;
    card:
      | components["schemas"]["swag_paypal_v2_order_payment_source_card"]
      | null;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
  };
  swag_paypal_v2_order_payment_source_ideal: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_multibanco: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_my_bank: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_oxxo: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_p24: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_pay_upon_invoice: {
    billing_address: components["schemas"]["swag_paypal_v2_common_address"];
    birth_date: string;
    deposit_bank_details: components["schemas"]["swag_paypal_v2_order_payment_source_pay_upon_invoice_deposit_bank_details"];
    email: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["swag_paypal_v2_common_name"];
    payment_reference: string;
    phone: components["schemas"]["swag_paypal_v2_common_phone_number"];
  };
  swag_paypal_v2_order_payment_source_pay_upon_invoice_deposit_bank_details: {
    account_holder_name: string;
    bank_name: string;
    bic: string;
    iban: string;
  };
  swag_paypal_v2_order_payment_source_paypal: {
    account_id: string;
    address: components["schemas"]["swag_paypal_v2_common_address"];
    attributes:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes"]
      | null;
    billing_agreement_id: string;
    birth_date: string;
    email_address: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["swag_paypal_v2_common_name"];
    phone_number:
      | components["schemas"]["swag_paypal_v2_common_phone_number"]
      | null;
    phone_type: string;
    vault_id: string;
  };
  swag_paypal_v2_order_payment_source_sofort: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_token: {
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    id: string;
    stored_payment_source: components["schemas"]["swag_paypal_v2_order_payment_source_token_stored_payment_source"];
    type: string;
  };
  swag_paypal_v2_order_payment_source_token_stored_payment_source: {
    payment_initiator: string;
    payment_type: string;
    usage: string;
  };
  swag_paypal_v2_order_payment_source_trustly: {
    country_code: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  swag_paypal_v2_order_payment_source_venmo: {
    account_id: string;
    address: components["schemas"]["swag_paypal_v2_common_address"];
    attributes:
      | components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes"]
      | null;
    email_address: string;
    experience_context: components["schemas"]["swag_paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["swag_paypal_v2_common_name"];
    phone_number:
      | components["schemas"]["swag_paypal_v2_common_phone_number"]
      | null;
    user_name: string;
    vault_id: string;
  };
  swag_paypal_v2_order_purchase_unit: {
    amount: components["schemas"]["swag_paypal_v2_order_purchase_unit_amount"];
    custom_id: string | null;
    description: string;
    invoice_id: string | null;
    items:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_item"][]
      | null;
    payee: components["schemas"]["swag_paypal_v2_order_purchase_unit_payee"];
    payments:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments"]
      | null;
    reference_id: string;
    shipping: components["schemas"]["swag_paypal_v2_order_purchase_unit_shipping"];
  };
  swag_paypal_v2_order_purchase_unit_amount: components["schemas"]["swag_paypal_v2_common_money"] & {
    breakdown:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_amount_breakdown"]
      | null;
  };
  swag_paypal_v2_order_purchase_unit_amount_breakdown: {
    discount: components["schemas"]["swag_paypal_v2_common_money"];
    handling: components["schemas"]["swag_paypal_v2_common_money"];
    insurance: components["schemas"]["swag_paypal_v2_common_money"];
    item_total: components["schemas"]["swag_paypal_v2_common_money"];
    shipping: components["schemas"]["swag_paypal_v2_common_money"];
    shipping_discount: components["schemas"]["swag_paypal_v2_common_money"];
    tax_total: components["schemas"]["swag_paypal_v2_common_money"] | null;
  };
  swag_paypal_v2_order_purchase_unit_item: {
    /** @enum {string} */
    category: "PHYSICAL_GOODS" | "DIGITAL_GOODS" | "DONATION";
    name: string;
    quantity: number;
    sku: string | null;
    tax: components["schemas"]["swag_paypal_v2_common_money"];
    tax_rate: string | number | Record<string, never>;
    unit_amount: components["schemas"]["swag_paypal_v2_common_money"];
  };
  swag_paypal_v2_order_purchase_unit_payee: {
    display_data: components["schemas"]["swag_paypal_v2_order_purchase_unit_payee_display_data"];
    email_address: string;
    merchant_id: string;
  };
  swag_paypal_v2_order_purchase_unit_payee_display_data: {
    brand_name: string;
  };
  swag_paypal_v2_order_purchase_unit_payments: {
    authorizations:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_authorization"][]
      | null;
    captures:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_capture"][]
      | null;
    refunds:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_refund"][]
      | null;
  };
  swag_paypal_v2_order_purchase_unit_payments_authorization: {
    amount: components["schemas"]["swag_paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    expiration_time: string;
    id: string;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    seller_protection: components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_common_seller_protection"];
    status: string;
    update_time: string;
  };
  swag_paypal_v2_order_purchase_unit_payments_authorization_seller_protection: {
    dispute_categories: string[];
    status: string;
  };
  swag_paypal_v2_order_purchase_unit_payments_capture: {
    amount: components["schemas"]["swag_paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    disbursement_mode: string;
    final_capture: boolean;
    id: string;
    invoice_id: string | null;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    note_to_payer: string | null;
    processor_response: components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_capture_processor_response"];
    seller_protection: components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_common_seller_protection"];
    seller_receivable_breakdown: components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_capture_seller_receivable_breakdown"];
    status: string;
    update_time: string;
  };
  swag_paypal_v2_order_purchase_unit_payments_capture_processor_response: {
    avs_code: string | null;
    cvv_code: string | null;
    response_code: string | null;
  };
  swag_paypal_v2_order_purchase_unit_payments_capture_seller_receivable_breakdown: {
    gross_amount: components["schemas"]["swag_paypal_v2_common_money"];
    net_amount: components["schemas"]["swag_paypal_v2_common_money"];
    paypal_fee: components["schemas"]["swag_paypal_v2_common_money"];
  };
  swag_paypal_v2_order_purchase_unit_payments_common_seller_protection: {
    dispute_categories: string[];
    status: string;
  };
  swag_paypal_v2_order_purchase_unit_payments_refund: {
    amount: components["schemas"]["swag_paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    id: string;
    invoice_id: string | null;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    note_to_payer: string | null;
    seller_payable_breakdown: components["schemas"]["swag_paypal_v2_order_purchase_unit_payments_refund_seller_payable_breakdown"];
    status: string;
    update_time: string;
  };
  swag_paypal_v2_order_purchase_unit_payments_refund_seller_payable_breakdown: {
    gross_amount: components["schemas"]["swag_paypal_v2_common_money"];
    net_amount: components["schemas"]["swag_paypal_v2_common_money"];
    paypal_fee: components["schemas"]["swag_paypal_v2_common_money"];
    total_refunded_amount: components["schemas"]["swag_paypal_v2_common_money"];
  };
  swag_paypal_v2_order_purchase_unit_shipping: {
    address: components["schemas"]["swag_paypal_v2_common_address"];
    name: components["schemas"]["swag_paypal_v2_order_purchase_unit_shipping_name"];
    trackers:
      | components["schemas"]["swag_paypal_v2_order_purchase_unit_shipping_tracker"][]
      | null;
  };
  swag_paypal_v2_order_purchase_unit_shipping_name: {
    full_name: string;
  };
  swag_paypal_v2_order_purchase_unit_shipping_tracker: {
    id: string;
    items: components["schemas"]["swag_paypal_v2_order_purchase_unit_item"][];
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    notify_payer: boolean;
    status: string;
  };
  swag_paypal_v2_order_purchase_unit_shipping_tracker_item: {
    image_url: string | null;
    name: string;
    quantity: number;
    sku: string | null;
    url: string | null;
  };
  swag_paypal_v2_order_tracker: {
    capture_id: string;
    carrier: string;
    carrier_name_other: string | null;
    items: components["schemas"]["swag_paypal_v2_order_purchase_unit_shipping_tracker_item"][];
    /** @default false */
    notify_payer?: boolean;
    tracking_number: string;
  };
  swag_paypal_v2_patch: {
    from: string;
    op: string;
    path: string;
    value:
      | (
          | number
          | Record<string, never>
          | string
          | boolean
          | Record<string, never>[]
        )
      | null;
  };
  swag_paypal_v2_referral: {
    business_entity: components["schemas"]["swag_paypal_v2_referral_business_entity"];
    capabilities: string[];
    legal_consents: components["schemas"]["swag_paypal_v2_referral_legal_consent"][];
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    operations: components["schemas"]["swag_paypal_v2_referral_operation"][];
    partner_config_override: components["schemas"]["swag_paypal_v2_referral_partner_config_override"];
    preferred_language_code: string;
    products: string[];
    tracking_id: string;
  };
  swag_paypal_v2_referral_business_entity: {
    addresses: components["schemas"]["swag_paypal_v2_referral_business_entity_address"][];
  };
  swag_paypal_v2_referral_business_entity_address: {
    country_code: string;
    /** @default WORK */
    type?: string;
  };
  swag_paypal_v2_referral_legal_consent: {
    granted: boolean;
    /** @default SHARE_DATA_CONSENT */
    type?: string;
  };
  swag_paypal_v2_referral_operation: {
    api_integration_preference: components["schemas"]["swag_paypal_v2_referral_operation_integration_preference"];
    /** @default API_INTEGRATION */
    operation?: string;
  };
  swag_paypal_v2_referral_operation_integration_preference: {
    rest_api_integration: components["schemas"]["swag_paypal_v2_referral_operation_integration_preference_integration"];
  };
  swag_paypal_v2_referral_operation_integration_preference_integration: {
    /** @default PAYPAL */
    integration_method?: string;
    /** @default THIRD_PARTY */
    integration_type?: string;
    third_party_details: components["schemas"]["swag_paypal_v2_referral_operation_integration_preference_integration_third_party_details"];
  };
  swag_paypal_v2_referral_operation_integration_preference_integration_third_party_details: {
    features: string[];
  };
  swag_paypal_v2_referral_partner_config_override: {
    partner_logo_url: string;
    return_url: string;
  };
  swag_paypal_v3_payment_token: {
    customer: components["schemas"]["swag_paypal_v2_order_payment_source_common_attributes_customer"];
    id: string;
    links: components["schemas"]["swag_paypal_v2_common_link"][];
    metadata:
      | components["schemas"]["swag_paypal_v3_payment_token_metadata"]
      | null;
    payment_source: components["schemas"]["swag_paypal_v2_order_payment_source"];
    status: string;
  };
  swag_paypal_v3_payment_token_metadata: {
    order_id: string;
  };
};
export type operations = {
  "api-info get /_info/openapi3.json": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      /** Type of the api */
      type?: "jsonapi" | "json";
    };
    response: {
      components?: {
        callbacks?: GenericRecord;
        examples?: GenericRecord;
        headers?: GenericRecord;
        links?: GenericRecord;
        parameters?: GenericRecord;
        pathItems?: GenericRecord;
        requestBodies?: GenericRecord;
        responses?: GenericRecord;
        schemas?: GenericRecord;
        securitySchemes?: GenericRecord;
      };
      externalDocs?: {
        description?: string;
        /** Format: uri */
        url: string;
      };
      info: {
        contact?: {
          /** Format: email */
          email?: string;
          name?: string;
          /** Format: uri */
          url?: string;
        };
        description?: string;
        license?: {
          identifier?: string;
          name: string;
          /** Format: uri */
          url?: string;
        };
        summary?: string;
        /** Format: uri */
        termsOfService?: string;
        title: string;
        version: string;
      };
      jsonSchemaDialect?: string;
      openapi: string;
      paths?: GenericRecord;
      security?: GenericRecord[];
      servers?: {
        url: string;
      }[];
      tags?: {
        description?: string;
        externalDocs?: {
          description?: string;
          /** Format: uri */
          url: string;
        };
        name: string;
      }[];
      webhooks?: GenericRecord;
    };
    responseCode: 200;
  };
  "getRoutes get /_info/routes": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      endpoints: {
        methods: string[];
        path: string;
      }[];
    };
    responseCode: 200;
  };
  "createCustomerAddress post /account/address": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["CustomerAddressBody"];
    response: components["schemas"]["CustomerAddress"] &
      components["schemas"]["CustomerAddressRead"];
    responseCode: 200;
  };
  "deleteCustomerAddress delete /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** ID of the address to be deleted. */
      addressId: string;
    };
    response: never;
    responseCode: 204;
  };
  "updateCustomerAddress patch /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Address ID */
      addressId: string;
    };
    body: components["schemas"]["CustomerAddressBody"];
    response: components["schemas"]["CustomerAddress"] &
      components["schemas"]["CustomerAddressRead"];
    responseCode: 200;
  };
  "defaultBillingAddress patch /account/address/default-billing/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Address ID */
      addressId: string;
    };
    response: never;
    responseCode: 200;
  };
  "defaultShippingAddress patch /account/address/default-shipping/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Address ID */
      addressId: string;
    };
    response: never;
    responseCode: 200;
  };
  "changeEmail post /account/change-email": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** New email address. Has to be unique amongst all customers */
      email: string;
      /** Confirmation of the new email address. */
      emailConfirmation: string;
      /** Customer's current password */
      password: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "changeLanguage post /account/change-language": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** New languageId */
      language?: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "changePassword post /account/change-password": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** New Password for the customer */
      newPassword: string;
      /** Confirmation of the new password */
      newPasswordConfirm: string;
      /** Current password of the customer */
      password: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "changePaymentMethod post /account/change-payment-method/{paymentMethodId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the desired default payment method */
      paymentMethodId: string;
    };
    response: components["schemas"]["SuccessResponse"];
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
      salutationId?: string;
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
  "readCustomer post /account/customer": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["Customer"];
    responseCode: 200;
  };
  "deleteCustomer delete /account/customer": {
    contentType?: "application/json";
    accept?: "application/json";
    response: never;
    responseCode: 204;
  };
  "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Parameter from the link in the confirmation mail sent in Step 1 */
      hash: string;
    };
    response: {
      /** @enum {string} */
      apiAlias?: "array_struct";
      data?: {
        isExpired: boolean;
      }[];
    };
    responseCode: 200;
  };
  "listAddress post /account/list-address": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["CustomerAddress"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "loginCustomer post /account/login": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Password */
      password: string;
      /** Email */
      username: string;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "imitateCustomerLogin post /account/login/imitate-customer": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** ID of the customer */
      customerId: string;
      /** Generated customer impersonation token */
      token: string;
      /** ID of the user who generated the token */
      userId: string;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "logoutCustomer post /account/logout": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "readNewsletterRecipient post /account/newsletter-recipient": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["AccountNewsletterRecipient"];
    responseCode: 200;
  };
  "sendRecoveryMail post /account/recovery-password": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** E-Mail address to identify the customer */
      email: string;
      /** URL of the storefront to use for the generated reset link. It has to be a domain that is configured in the sales channel domain settings. */
      storefrontUrl: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "recoveryPassword post /account/recovery-password-confirm": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Parameter from the link in the confirmation mail sent in Step 1 */
      hash: string;
      /** New password for the customer */
      newPassword: string;
      /** Confirmation of the new password */
      newPasswordConfirm: string;
    };
    response: components["schemas"]["SuccessResponse"];
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
      salutationId?: string;
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
  "registerConfirm post /account/register-confirm": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Email hash from the email received */
      em: string;
      /** Hash from the email received */
      hash: string;
    };
    response: never;
    responseCode: 200;
  };
  "generateJWTAppSystemAppServer post /app-system/{name}/generate-token": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Name of the app */
      name: string;
    };
    body?: GenericRecord;
    response: {
      /** Format: date-time */
      expires?: string;
      shopId?: string;
      token?: string;
    };
    responseCode: 200;
  };
  "readApprovalRules get /approval-rule": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      /** Number of items per page */
      limit?: number;
      /** Page number */
      p?: number;
    };
    response: {
      elements?: components["schemas"]["ApprovalRule"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "listApprovalRules post /approval-rule": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      /** Number of items per page */
      limit?: number;
      /** Page number */
      p?: number;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["ApprovalRule"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readApprovalRule get /approval-rule/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the approval rule to be fetched */
      id: string;
    };
    response: components["schemas"]["ApprovalRule"];
    responseCode: 200;
  };
  "updateApprovalRule patch /approval-rule/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the approval rule to be updated */
      id: string;
    };
    body: {
      /** Active status of the approval rule */
      active?: boolean;
      /** ID of the role that can approve the rule */
      approvalRuleApprove?: string;
      /** List of rules */
      approvalRuleCondition?: {
        /** Type of the rule */
        type?: string;
        /** Value */
        value?: string;
      };
      /** Name of the approval rule */
      approvalRuleName?: string;
      /** ID of the role that is affected by the rule */
      approvalRuleRole?: string;
      /** Description of the approval rule */
      description?: string;
      /** Priority of the approval rule */
      priority?: number;
    };
    response: components["schemas"]["ApprovalRule"];
    responseCode: 200;
  };
  "createApprovalRule post /approval-rule/create": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Active status of the approval rule */
      active?: boolean;
      /** ID of the role that can approve the rule */
      approvalRuleApprove?: string;
      /** List of rules */
      approvalRuleCondition?: {
        /** Type of the rule */
        type?: string;
        /** Value */
        value?: string;
      };
      /** Name of the approval rule */
      approvalRuleName?: string;
      /** ID of the role that is affected by the rule */
      approvalRuleRole?: string;
      /** Description of the approval rule */
      description?: string;
      /** Priority of the approval rule */
      priority?: number;
    };
    response: components["schemas"]["ApprovalRule"];
    responseCode: 200;
  };
  "readBreadcrumb get /breadcrumb/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      /** UUID for referrer category only used for product breadcrumb */
      referrerCategoryId?: string;
      /** Type: category or product (optional - default: product) */
      type?: "product" | "category";
    };
    pathParams: {
      /** UUID for product or category */
      id: string;
    };
    response: components["schemas"]["BreadcrumbCollection"];
    responseCode: 200;
  };
  "readCategoryList post /category": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Category"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCategory post /category/{navigationId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
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
  "readCart get /checkout/cart": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "deleteCart delete /checkout/cart": {
    contentType?: "application/json";
    accept?: "application/json";
    response: components["schemas"]["SuccessResponse"];
    responseCode: 204;
  };
  "addLineItem post /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      items: (
        | {
            id: string;
            quantity: number;
            referencedId?: string;
            /** @enum {string} */
            type: "product" | "custom" | "credit" | "discount" | "container";
          }
        | {
            id?: string;
            quantity?: number;
            referencedId: string;
            /** @enum {string} */
            type: "promotion";
          }
      )[];
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "removeLineItemDeprecated delete /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    query: {
      /** A list of product identifiers. */
      ids: string[];
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "updateLineItem patch /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      items: [
        {
          id: string;
          quantity: number;
        },
        ...{
          id: string;
          quantity: number;
        }[],
      ];
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "removeLineItem post /checkout/cart/line-item/delete": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** A list of product identifiers. */
      ids: [string, ...string[]];
    };
    response: components["schemas"]["Cart"];
    responseCode: 200;
  };
  "checkoutGateway get /checkout/gateway": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      errors?: {
        /** If the error is blocking */
        blocking?: boolean;
        /** Error code */
        code?: string;
        /** Error detail */
        detail?: string;
      }[];
      paymentMethods?: {
        /** aggregation result */
        aggregations?: GenericRecord;
        elements?: components["schemas"]["PaymentMethod"][];
        /** Total amount */
        total?: number;
      };
      shippingMethods?: {
        /** aggregation result */
        aggregations?: GenericRecord;
        elements?: components["schemas"]["ShippingMethod"][];
        /** Total amount */
        total?: number;
      };
    };
    responseCode: 200;
  };
  "createOrder post /checkout/order": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** The affiliate code can be used to track which referrer the customer came through. An example could be `Price-comparison-company-XY`. */
      affiliateCode?: string;
      /** The campaign code is used to track which action the customer came from. An example could be `Summer-Deals` */
      campaignCode?: string;
      /** Adds a comment from the customer to the order. */
      customerComment?: string;
    };
    response: components["schemas"]["Order"];
    responseCode: 200;
  };
  "readCms post /cms/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Identifier of the CMS page to be resolved */
      id: string;
    };
    body: {
      /** Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character. */
      slots?: string;
    } & components["schemas"]["ProductListingCriteria"];
    response: components["schemas"]["CmsPage"];
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
      salutationId?: string;
      /** Identifier of the cms element */
      slotId?: string;
      /** The subject of the contact form. */
      subject: string;
    };
    response: never;
    responseCode: 200;
  };
  "readContext get /context": {
    contentType?: "application/json";
    accept?: "application/json";
    response: components["schemas"]["SalesChannelContext"];
    responseCode: 200;
  };
  "updateContext patch /context": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Billing Address */
      billingAddressId?: string;
      /** Country */
      countryId?: string;
      /** Country State */
      countryStateId?: string;
      /** Currency */
      currencyId?: string;
      /** Language */
      languageId?: string;
      /** Payment Method */
      paymentMethodId?: string;
      /** Shipping Address */
      shippingAddressId?: string;
      /** Shipping Method */
      shippingMethodId?: string;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "readCountry post /country": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Country"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCountryState post /country-state/{countryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      countryId: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["CountryState"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCurrency post /currency": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["Currency"][];
    responseCode: 200;
  };
  "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Customer group id */
      customerGroupId: string;
    };
    response: components["schemas"]["CustomerGroup"];
    responseCode: 200;
  };
  "readCustomerWishlist post /customer/wishlist": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["WishlistLoadRouteResponse"];
    responseCode: 200;
  };
  "addProductOnWishlist post /customer/wishlist/add/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the product to be added. */
      productId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The identifier of the product to be removed from the wishlist. */
      productId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "mergeProductOnWishlist post /customer/wishlist/merge": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** List product id */
      productIds?: string[];
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "download post /document/download/{documentId}/{deepLinkCode}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      deepLinkCode: string;
      documentId: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["Document"];
    responseCode: 200;
  };
  "attendeeRespondInvitation patch /dsr/appointment/{appointmentId}/attendee/respond-invitation": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The appointment id you respond to */
      appointmentId: string;
    };
    body: {
      /**
       * The status you respond to
       * @enum {string}
       */
      answer?: "accepted" | "maybe" | "declined";
      /** The token will be attached to the invitation response link in the invitation mail */
      token: string;
    };
    response: components["schemas"]["AttendeeRespondInvitationResponse"];
    responseCode: 200;
  };
  "getCalendarFile post /dsr/appointment/{appointmentId}/download-ics": {
    contentType?: "application/json";
    accept: "text/calendar";
    pathParams: {
      /** The appointment id you want to get the calendar file */
      appointmentId: string;
    };
    body: {
      /** The token will be attached to the invitation response link in the invitation mail */
      token: string;
    };
    response: unknown;
    responseCode: 200;
  };
  "dsrReadAppointmentSettings get /dsr/appointment/{presentationPath}/basic-setting": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Presentation path */
      presentationPath: string;
    };
    response: components["schemas"]["AppointmentBasicSettingResponse"];
    responseCode: 200;
  };
  "joinAppointmentAsClient post /dsr/appointment/{presentationPath}/join-as-client": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Presentation path */
      presentationPath: string;
    };
    body?: {
      /** The name of the attendee */
      attendeeName?: string | null;
    };
    response: components["schemas"]["JoinAppointmentResponse"];
    responseCode: 200;
  };
  "updateAttendee patch /dsr/appointment/attendee": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["UpdateAttendeeRequestBody"];
    response: {
      /**
       * The api alias of the API
       * @default dsr.appointment.update-attendee
       */
      apiAlias?: string;
      /** The data is used to update the attendee information */
      data?: unknown;
    };
    responseCode: 200;
  };
  "getAttendeeProductCollection get /dsr/appointment/collection/{alias}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The alias of collection you want to get */
      alias: "liked" | "disliked";
    };
    response: components["schemas"]["AttendeeProductCollectionResponse"];
    responseCode: 200;
  };
  "attendeeProductCollectionAddProduct post /dsr/appointment/collection/{alias}/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The alias of collection you want to add */
      alias: "liked" | "disliked";
      /** The product id you want to add */
      productId: string;
    };
    response: never;
    responseCode: 204;
  };
  "attendeeProductCollectionRemoveProduct delete /dsr/appointment/collection/{alias}/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The alias of collection you want to remove */
      alias: "liked" | "disliked";
      /** The product id you want to remove */
      productId: string;
    };
    response: never;
    responseCode: 204;
  };
  "getLastSeenProducts get /dsr/appointment/collection/last-seen": {
    contentType?: "application/json";
    accept?: "application/json";
    response: components["schemas"]["AttendeeProductCollectionLastSeenResponse"];
    responseCode: 200;
  };
  "getPresentationStructure get /dsr/appointment/presentation": {
    contentType?: "application/json";
    accept?: "application/json";
    response: components["schemas"]["PresentationStructure"];
    responseCode: 200;
  };
  "getSlideData get /dsr/appointment/presentation/{presentationCmsPageId}/slide/{sectionId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Presentation CMS page id for which the data is requested */
      presentationCmsPageId: string;
      /** CMS section id for which the data is requested */
      sectionId: string;
    };
    response: components["schemas"]["PresentationSlideData"];
    responseCode: 200;
  };
  "getSlideProducts post /dsr/appointment/presentation/{presentationCmsPageId}/slide/{sectionId}/products": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Presentation CMS page id for which the data is requested */
      presentationCmsPageId: string;
      /** CMS section id for which the data is requested */
      sectionId: string;
    };
    body: components["schemas"]["Criteria"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "getClientPresentationState get /dsr/appointment/presentation/state": {
    contentType?: "application/json";
    accept?: "application/json";
    response: components["schemas"]["ClientPresentationStateResponse"];
    responseCode: 200;
  };
  "createAppointmentRequest post /dsr/appointment/request": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["CreateAppointmentRequestBody"];
    response: {
      /**
       * The api alias of the API
       * @default dsr.appointment.create-appointment-request
       */
      apiAlias?: string;
      /** The data is used to create the appointment request */
      data?: string[];
    };
    responseCode: 200;
  };
  "addInteraction post /dsr/interaction": {
    contentType?: "application/json";
    accept?: "application/json";
    body: components["schemas"]["CreateInteractionRequestBody"];
    response: never;
    responseCode: 200;
  };
  "dsrProductListing post /dsr/product-listing": {
    contentType?: "application/json";
    accept?: "application/json";
    body?:
      | components["schemas"]["Criteria"]
      | {
          /**
           * Load interaction (like & dislike) to product of attendee. It will be added into product extensions named interaction
           * @default false
           */
          interaction?: boolean;
          /**
           * Load all product ids, you can access it from `extensions.allIds` of the response
           * @default false
           */
          loadAllIds?: boolean;
          /**
           * load all variants following the main products
           * @default false
           */
          loadVariants?: boolean;
          /**
           * Use id sorting instead of other sorting fields
           * @default false
           */
          useIdSorting?: boolean;
        };
    response: {
      elements?: components["schemas"]["Product"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "dsrReadProductDetailPage get /dsr/product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      productId: string;
    };
    response: components["schemas"]["ProductPageResult"];
    responseCode: 200;
  };
  "resolveQuickviewPage get /dsr/quickview/{productId}/{cmsPageLayoutId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** The cms page id using as product quick view */
      cmsPageLayoutId: string;
      /** The product id */
      productId: string;
    };
    response: {
      cmsPage?: components["schemas"]["CmsPage"];
      configurator?: components["schemas"]["PropertyGroup"][];
      product?: components["schemas"]["Product"];
    };
    responseCode: 200;
  };
  "dsrReadShopPage get /dsr/shop-pages/{layoutName}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      layoutName: string;
    };
    response: components["schemas"]["CmsPage"];
    responseCode: 200;
  };
  "readEmployees get /employee": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bEmployee"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readEmployeesPOST post /employee": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bEmployee"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readEmployee get /employee/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the employee to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bEmployee"];
    responseCode: 200;
  };
  "deleteEmployee delete /employee/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the employee to be deleted */
      id: string;
    };
    response: never;
    responseCode: 204;
  };
  "updateEmployee patch /employee/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the employee to be updated */
      id: string;
    };
    body: {
      /** New email of the employee */
      email?: string;
      /** New first name of the employee */
      firstName?: string;
      /** New last name of the employee */
      lastName?: string;
      /** New id of the role of the employee */
      roleId?: string;
    };
    response: components["schemas"]["B2bEmployee"];
    responseCode: 200;
  };
  "createEmployee post /employee/create": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Email of the new employee */
      email: string;
      /** First name of the new employee */
      firstName: string;
      /** Identifier of the [language](#/System%20%26%20Context/readLanguages) to be set for the new employee. */
      languageId: string;
      /** Last name of the new employee */
      lastName: string;
      /** Id of the role of the new employee */
      roleId?: string;
    };
    response: components["schemas"]["B2bEmployee"];
    responseCode: 200;
  };
  "reinviteEmployee post /employee/reinvite/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the employee to be reinvited */
      id: string;
    };
    body: {
      /** URL of the storefront domain */
      storefrontUrl?: string;
    };
    response: components["schemas"]["B2bEmployee"];
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
      redirectUrl: string;
    };
    responseCode: 200;
  };
  "readLandingPage post /landing-page/{landingPageId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Identifier of the landing page. */
      landingPageId: string;
    };
    body: components["schemas"]["Criteria"] &
      ({
        /** Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character. */
        slots?: string;
      } & components["schemas"]["ProductListingCriteria"]);
    response: components["schemas"]["LandingPage"];
    responseCode: 200;
  };
  "readLanguages post /language": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["Language"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readMedia post /media": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Identifier (UUID) of the media entity to be fetched. */
      ids: string[];
    };
    response: components["schemas"]["Media"][];
    responseCode: 200;
  };
  "readNavigation post /navigation/{activeId}/{rootId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Identifier of the active category in the navigation tree (if not used, just set to the same as rootId). */
      activeId: string | components["schemas"]["NavigationType"];
      /** Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree. */
      rootId: string | components["schemas"]["NavigationType"];
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
  "confirmNewsletter post /newsletter/confirm": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Email hash parameter from the link in the confirmation mail */
      em: string;
      /** Hash parameter from link the in the confirmation mail */
      hash: string;
    };
    response: never;
    responseCode: 200;
  };
  "subscribeToNewsletter post /newsletter/subscribe": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** City */
      city?: string;
      /** Custom field data that should be added to the subscription. */
      customFields?: string;
      /** Email address that will receive the confirmation and the newsletter. */
      email: string;
      /** First name */
      firstName?: string;
      /** Identifier of the language. */
      languageId?: string;
      /** Last name */
      lastName?: string;
      /** Defines what should be done. */
      option: string;
      /** Identifier of the salutation. */
      salutationId?: string;
      /** Url of the storefront of the shop. This will be used for generating the link to the /newsletter/confirm inside the confirm email. */
      storefrontUrl: string;
      /** Street */
      street?: string;
      /** Zip code */
      tags?: string;
      /** Zip code */
      zipCode?: string;
    };
    response: never;
    responseCode: 200;
  };
  "unsubscribeToNewsletter post /newsletter/unsubscribe": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Email address that should be removed from the mailing lists. */
      email: string;
    };
    response: never;
    responseCode: 200;
  };
  "readOrder post /order": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: components["schemas"]["Criteria"] & {
      /** Check if the payment method of the order is still changeable. */
      checkPromotion?: boolean;
    };
    response: components["schemas"]["OrderRouteResponse"];
    responseCode: 200;
  };
  "orderDownloadFile get /order/download/{orderId}/{downloadId}": {
    contentType?: "application/json";
    accept: "application/octet-stream";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      downloadId: string;
      orderId: string;
    };
    response: Blob;
    responseCode: 200;
  };
  "orderSetPayment post /order/payment": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** The identifier of the order. */
      orderId: string;
      /** The identifier of the paymentMethod to be set */
      paymentMethodId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "cancelOrder post /order/state/cancel": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** The identifier of the order to be canceled. */
      orderId: string;
    };
    response: components["schemas"]["StateMachineState"];
    responseCode: 200;
  };
  "readPaymentMethod post /payment-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: components["schemas"]["Criteria"] & {
      /** List only available */
      onlyAvailable?: boolean;
    };
    response: {
      /** aggregation result */
      aggregations?: GenericRecord;
      elements?: components["schemas"]["PaymentMethod"][];
      /** Total amount */
      total?: number;
    };
    responseCode: 200;
  };
  "createPayPalOrder post /paypal/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Use an existing order id to create PayPal order */
      orderId?: string;
      /**
       * Use an existing order id to create PayPal order
       * @default ppcp
       */
      product?: string;
    };
    response: {
      token?: string;
    };
    responseCode: 200;
  };
  "createPayPalExpressOrder post /paypal/express/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    response: never;
    responseCode: 200;
  };
  "preparePayPalExpressCheckout post /paypal/express/prepare-checkout": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** ID of the paypal order */
      token?: string;
    };
    response: {
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "setPaymentMethodEligibility post /paypal/payment-method-eligibility": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** List of PayPal payment method identifiers according to constant REMOVABLE_PAYMENT_HANDLERS */
      paymentMethods?: string[];
    };
    response: never;
    responseCode: 204;
  };
  "getPUIPaymentInstructions get /paypal/pui/payment-instructions/{transactionId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the order transaction to be fetched */
      transactionId: string;
    };
    response: never;
    responseCode: 200;
  };
  "getPayPalCustomerVaultToken get /paypal/vault-token": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      token?: string;
    };
    responseCode: 200;
  };
  "paypalVaultClear post /paypal/vault/clear": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** @enum {string} */
      type?: "cancel" | "browser" | "error";
    };
    response: never;
    responseCode: 204;
  };
  "fetchPendingOrder post /pending-order/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the pending order to be fetched */
      id: string;
    };
    response: components["schemas"]["PendingOrder"];
    responseCode: 200;
  };
  "approvePendingOrder post /pending-order/{id}/approve": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the pending order to be approved */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "createOrderFromPendingOrder post /pending-order/{id}/checkout/order": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the pending order to be used to create a order */
      id: string;
    };
    body?: {
      /** Message content */
      customerComment?: string;
    };
    response: components["schemas"]["Order"];
    responseCode: 200;
  };
  "declinePendingOrder post /pending-order/{id}/decline": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the pending order to be declined */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "requestOrderApproval post /pending-order/request": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: {
      /** Message content */
      comment?: string;
    };
    response: components["schemas"]["PendingOrder"];
    responseCode: 200;
  };
  "readPermissions get /permission": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      elements?: {
        permissionDependencies?: string[];
        permissionGroupName?: string;
        permissionName?: string;
      }[];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "addPermission post /permission": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Optional dependencies for the new permission */
      dependencies?: string[];
      /** Group of the new permission */
      group?: string;
      /** Name of the new permission */
      name?: string;
    };
    response: {
      elements?: {
        permissionDependencies?: string[];
        permissionGroupName?: string;
        permissionName?: string;
      }[];
    } & components["schemas"]["EntitySearchResult"];
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
      elements: components["schemas"]["Product"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readProductExport get /product-export/{accessKey}/{fileName}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Access Key */
      accessKey: string;
      /** File Name */
      fileName: string;
    };
    response: never;
    responseCode: 200;
  };
  "readProductListing post /product-listing/{categoryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Determines if the response must contain a SeoUrl entity for a product entity */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
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
  "readProductDetail post /product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["ProductDetailResponse"];
    responseCode: 200;
  };
  "readProductCrossSellings post /product/{productId}/cross-selling": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: components["schemas"]["CrossSellingElementCollection"];
    responseCode: 200;
  };
  "searchProductVariantIds post /product/{productId}/find-variant": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    body: {
      /** The options parameter for the variant to find. */
      options: string[];
      /** The id of the option group that has been switched. */
      switchedGroup?: string;
    };
    response: components["schemas"]["FindProductVariantRouteResponse"];
    responseCode: 200;
  };
  "saveProductReview post /product/{productId}/review": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Identifier of the product which is reviewed. */
      productId: string;
    };
    body: {
      /** The content of review. */
      content: string;
      /** The email address of the review author. If not set, the email of the customer is chosen. */
      email?: string;
      /** The name of the review author. If not set, the first name of the customer is chosen. */
      name?: string;
      /**
       * Format: double
       * The review rating for the product.
       */
      points: number;
      /** The title of the review. */
      title: string;
    };
    response: never;
    responseCode: 200;
  };
  "readProductReviews post /product/{productId}/reviews": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    pathParams: {
      /** Identifier of the product. */
      productId: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["ProductReview"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "searchByImageSearchTerm post /product/image-upload-search/search-term": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /**
       * Format: binary
       * Base-64 encoded image
       */
      file?: Blob;
    };
    response: components["schemas"]["SearchByImageSearchTermResponse"];
    responseCode: 200;
  };
  "naturalLanguageSearchTerm post /product/natural-language/search-term": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /**
       * Natural language query
       * @example I'm looking for a present for my wife
       */
      query?: string;
    };
    response: components["schemas"]["NaturalLanguageSearchTermResponse"];
    responseCode: 200;
  };
  "quickOrderLoadFile post /quick-order/load-file": {
    contentType: "multipart/form-data";
    accept?: "application/json";
    body: FormData;
    response: {
      products: components["schemas"]["B2BProductDefinition"][];
    };
    responseCode: 200;
  };
  "quickOrderProductSearch get /quick-order/product": {
    contentType?: "application/json";
    accept?: "application/json";
    query: {
      /** Product search string  */
      search: string;
    };
    response: {
      elements: components["schemas"]["B2BProductDefinition"][];
    };
    responseCode: 200;
  };
  "switchPaymentOrShippingMethod post /quote/{id}/configure": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body: {
      /** Id of the payment method */
      paymentMethodId?: string;
      /** Id of the shipping method */
      shippingMethodId?: string;
    };
    response: never;
    responseCode: 204;
  };
  "declineQuote post /quote/{id}/decline": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "requestChangeQuote post /quote/{id}/request-change": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "sendMessageInQuote post /quote/{id}/send-message": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "readQuote post /quote/detail/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "downloadQuoteDocument post /quote/document/download/{documentId}/{deepLinkCode}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Deep link code of the quote document */
      deepLinkCode: string;
      /** Identifier of the quote document to be reinvited */
      documentId: string;
    };
    response: never;
    responseCode: 200;
  };
  "createOrderFromQuote post /quote/order/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body?: {
      /** Message content */
      customerComment?: string;
    };
    response: components["schemas"]["Order"];
    responseCode: 200;
  };
  "requestQuote post /quote/request": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: {
      /** Message content */
      comment?: string;
    };
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "readQuotes post /quotes": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Quote"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readRoles get /role": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      elements?: components["schemas"]["B2bComponentsRole"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readRolesPOST post /role": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsRole"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readRole get /role/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the role to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bComponentsRole"];
    responseCode: 200;
  };
  "deleteRole delete /role/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the role to be fetched */
      id: string;
    };
    response: never;
    responseCode: 204;
  };
  "updateRole patch /role/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the role to be updated */
      id: string;
    };
    body: {
      /** Ability to set the role as default */
      isDefaultRole?: boolean;
      /** New name of the role */
      name?: string;
      /** New permissions of the role */
      permissions?: string[];
    };
    response: components["schemas"]["B2bComponentsRole"];
    responseCode: 200;
  };
  "createRole post /role/create": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Ability to set the new role as default */
      isDefaultRole?: boolean;
      /** Name of the new role */
      name?: string;
      /** Permissions of the new role */
      permissions?: string[];
    };
    response: components["schemas"]["B2bComponentsRole"];
    responseCode: 200;
  };
  "updateDefaultRoleId post /role/default": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Id of the roleId to be set as default */
      id?: string;
    };
    response: never;
    responseCode: 204;
  };
  "readSalutation post /salutation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Salutation"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "getScriptStoreApiRoute get /script/{hook}":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: {
          [key: string]: unknown;
        } | null;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "application/vnd.api+json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: {
          [key: string]: unknown;
        } | null;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: never;
        responseCode: 204;
      };
  "postScriptStoreApiRoute post /script/{hook}":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: {
          [key: string]: unknown;
        } | null;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "application/vnd.api+json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: {
          [key: string]: unknown;
        } | null;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: never;
        responseCode: 204;
      };
  "searchPage post /search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search: string;
    } & components["schemas"]["ProductListingCriteria"] &
      components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "searchSuggest post /search-suggest": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: {
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search: string;
    } & components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "readSeoUrl post /seo-url": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["SeoUrl"][];
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
      aggregations?: GenericRecord;
      elements: components["schemas"]["ShippingMethod"][];
      /** Total amount */
      total?: number;
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "createShoppingList post /shopping-list": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      lineItems?: {
        [key: string]: {
          /** Product id */
          id: string;
          /** Quantity of the product */
          quantity: number;
        };
      };
      /** Shopping list name */
      name: string;
    };
    response: never;
    responseCode: 204;
  };
  "removeShoppingLists delete /shopping-list": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Shopping list ids */
      ids: string[];
    };
    response: never;
    responseCode: 204;
  };
  "readShoppingList post /shopping-list/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["B2bComponentsShoppingList"];
    responseCode: 200;
  };
  "addLineItems post /shopping-list/{id}/add": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list to be fetched */
      id: string;
    };
    body?: {
      lineItems: {
        [key: string]: {
          /** Product id */
          id: string;
          /** Quantity of the product */
          quantity: number;
        };
      };
    };
    response: never;
    responseCode: 204;
  };
  "updateShoppingList patch /shopping-list/{id}/change-name": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list to be fetched */
      id: string;
    };
    body: {
      /** Shopping list name */
      name: string;
    };
    response: never;
    responseCode: 204;
  };
  "duplicateShoppingList post /shopping-list/{id}/duplicate": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list to be fetched */
      id: string;
    };
    body: {
      /** Shopping list name */
      name: string;
    };
    response: {
      /** The generated id of the duplicated shopping list */
      id?: string;
    };
    responseCode: 200;
  };
  "summaryShoppingList get /shopping-list/{id}/summary": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list to be fetched */
      id: string;
    };
    response: {
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
    };
    responseCode: 200;
  };
  "updateLineItems post /shopping-list/line-item/{id}/change-quantity": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the shopping list line item to be fetched */
      id: string;
    };
    body: {
      /** new line item quantity */
      quantity: number;
    };
    response: never;
    responseCode: 204;
  };
  "removeLineItems post /shopping-list/line-item/remove": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Line items ids */
      ids?: string[];
      /** List id */
      listId?: string;
      /** Product ids */
      productIds?: string[];
    };
    response: never;
    responseCode: 204;
  };
  "readShoppingLists post /shopping-lists": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsShoppingList"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "addShoppingListsToCart post /shopping-lists/add-to-cart": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Shopping list ids */
      ids: string[];
    };
    response: never;
    responseCode: 204;
  };
  "readSitemap get /sitemap": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    response: components["schemas"]["Sitemap"][];
    responseCode: 200;
  };
  "getSitemapFile get /sitemap/{filePath}":
    | {
        contentType?: "application/json";
        accept: "application/gzip";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: string;
        };
        pathParams: {
          /** The path to the sitemap file */
          filePath: string;
        };
        response: Blob;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "application/xml";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: string;
        };
        pathParams: {
          /** The path to the sitemap file */
          filePath: string;
        };
        response: Blob;
        responseCode: 200;
      };
  "auth post /sso/auth/{providerId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the SSO provider used to authenticate */
      providerId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 204;
  };
  "redirect post /sso/redirect/{providerId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the SSO provider used to authenticate */
      providerId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 204;
  };
};
