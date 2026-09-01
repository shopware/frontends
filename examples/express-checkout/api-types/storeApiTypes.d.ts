/**
 * This file is auto-generated. Do not make direct changes to the file.
 * Instead override it in your shopware.d.ts file.
 *
 * Shopware API version: 6.7.13.0
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
type CustomFields = {
  [key: string]: CustomFieldValue;
};
type CustomFieldValue =
  | null
  | string
  | string[]
  | number
  | boolean
  | CustomFieldValue[]
  | {
      [key: string]: CustomFieldValue;
    };
export type components = {
  schemas: Schemas;
  parameters: {
    CompressedCriteria: string;
    CompressedNoneFieldsCriteria: string;
    criteriaAggregations: components["schemas"]["Aggregation"][];
    criteriaAssociations: components["schemas"]["Associations"];
    criteriaExcludes: components["schemas"]["Excludes"];
    criteriaFields: string[];
    criteriaFilter: (
      | components["schemas"]["SimpleFilter"]
      | components["schemas"]["EqualsFilter"]
      | components["schemas"]["MultiNotFilter"]
      | components["schemas"]["RangeFilter"]
    )[];
    criteriaGrouping: string[];
    criteriaIds: string[];
    criteriaIncludes: components["schemas"]["Includes"];
    criteriaLimit: number;
    criteriaPage: number;
    criteriaPostFilter: (
      | components["schemas"]["SimpleFilter"]
      | components["schemas"]["EqualsFilter"]
      | components["schemas"]["MultiNotFilter"]
      | components["schemas"]["RangeFilter"]
    )[];
    criteriaQuery: string;
    criteriaSort: components["schemas"]["Sort"][];
    criteriaTerm: string;
    criteriaTotalCountMode: components["schemas"]["TotalCountMode"];
    noAggregations: string | null;
    onlyAggregations: string | null;
    swLanguageId: string;
  };
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
    /** @constant */
    apiAlias: "account_newsletter_recipient";
    status: components["schemas"]["NewsletterStatus"];
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
     * Indicates if the wishlist is enabled
     * @default false
     */
    enableWishlist?: boolean;
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
  B2bComponentsApprovalRule: {
    active: boolean;
    affectedRole?: components["schemas"]["B2bComponentsRole"];
    affectedRoleId?: string;
    conditions: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    description?: string;
    id: string;
    name: string;
    /** Format: int64 */
    priority: number;
    reviewerRole?: components["schemas"]["B2bComponentsRole"];
    reviewerRoleId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsBudget: {
    active?: boolean;
    allowApproval?: boolean;
    /** Format: float */
    amount: number;
    costCentre?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    currency?: components["schemas"]["Currency"];
    customer?: components["schemas"]["Customer"];
    customerId?: string;
    customFields?: CustomFields | null;
    endDate?: string;
    extensions?: {
      subscriptionBudgets?: {
        data?: {
          /** @example db9b610a5feba7efda832033f6be0bbf */
          id?: string;
          /** @example b2b_components_subscription_budget */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-budget/1e4002da52224f484ff690aa9b0bfb2a/subscriptionBudgets
           */
          related?: string;
        };
      };
    };
    id: string;
    name: string;
    notificationConfig?: {
      type?: string;
      value?: string;
    };
    notificationRecipients?: components["schemas"]["B2bEmployee"][];
    notify?: boolean;
    organizations?: components["schemas"]["B2bComponentsOrganization"][];
    renewsType?: string;
    reviewerRole?: components["schemas"]["B2bComponentsRole"];
    reviewerRoleId?: string;
    showRemaining?: boolean;
    startDate: string;
    technicalName: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Format: float */
    readonly usedAmount?: number;
  };
  B2bComponentsIndividualPricing: {
    /** Format: float */
    actionAmount?: number;
    actionType: string;
    active: boolean;
    applyToAllProducts: boolean;
    companyAssignments?: components["schemas"]["B2bComponentsIndividualPricingCompanyAssignment"][];
    /** Format: date-time */
    readonly createdAt?: string;
    createdBy?: components["schemas"]["User"];
    createdById?: string;
    customFields?: CustomFields | null;
    description?: string;
    id: string;
    name: string;
    /** Format: int64 */
    priority: number;
    productStream?: components["schemas"]["ProductStream"];
    productStreamId?: string;
    showStrikeThrough: boolean;
    readonly tagIds?: string[];
    tags?: components["schemas"]["Tag"][];
    target: string;
    tiers: components["schemas"]["B2bComponentsIndividualPricingTier"][];
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedBy?: components["schemas"]["User"];
    updatedById?: string;
    useValidityRange: boolean;
    validFrom?: string;
    validUntil?: string;
  };
  B2bComponentsIndividualPricingCompanyAssignment: {
    /** Format: date-time */
    readonly createdAt?: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    id: string;
    individualPricing?: components["schemas"]["B2bComponentsIndividualPricing"];
    individualPricingId: string;
    readonly organizationUnitIds?: string[];
    scope: string;
    units?: components["schemas"]["B2bComponentsOrganization"][];
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsIndividualPricingTier: {
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    individualPricing?: components["schemas"]["B2bComponentsIndividualPricing"];
    individualPricingId: string;
    price: components["schemas"]["Price"][];
    /** Format: int64 */
    qtyFrom: number;
    /** Format: int64 */
    qtyTo?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bComponentsOrganization: {
    billingAddresses?: components["schemas"]["CustomerAddress"][];
    /** Format: int64 */
    readonly childCount?: number;
    children?: components["schemas"]["B2bComponentsOrganization"][];
    /** Format: date-time */
    readonly createdAt?: string;
    createdBy?: components["schemas"]["User"];
    createdById?: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    customFields?: CustomFields | null;
    defaultBillingAddress?: components["schemas"]["CustomerAddress"];
    defaultBillingAddressId?: string;
    defaultShippingAddress?: components["schemas"]["CustomerAddress"];
    defaultShippingAddressId?: string;
    description?: string;
    employees?: components["schemas"]["B2bEmployee"][];
    extensions?: {
      organizationBreadcrumb?: GenericRecord;
      organizationInheritance?: GenericRecord;
    };
    id: string;
    /** Format: int64 */
    readonly level?: number;
    name: string;
    organizationCustomerAddresses?: components["schemas"]["B2bComponentsOrganizationCustomerAddress"][];
    parent?: components["schemas"]["B2bComponentsOrganization"];
    parentId?: string;
    readonly path?: string;
    paymentMethods?: components["schemas"]["PaymentMethod"][];
    shippingAddresses?: components["schemas"]["CustomerAddress"][];
    shippingMethods?: components["schemas"]["ShippingMethod"][];
    technicalName?: string;
    readonly treeSortPath?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    updatedBy?: components["schemas"]["User"];
    updatedById?: string;
  };
  B2bComponentsOrganizationCustomerAddress: {
    /** Format: date-time */
    readonly createdAt?: string;
    customerAddress?: components["schemas"]["CustomerAddress"];
    customerAddressId: string;
    id: string;
    organizationId: string;
    type: string;
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
    cartPayload: string;
    country?: components["schemas"]["Country"];
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    currency?: components["schemas"]["Currency"];
    currencyId: string;
    customer?: components["schemas"]["Customer"];
    customerId: string;
    customFields?: CustomFields | null;
    decidedBy?: components["schemas"]["B2bEmployee"];
    decidedById?: string;
    employee?: components["schemas"]["B2bEmployee"];
    employeeId: string;
    extensions?: {
      budget?: {
        data?: {
          /** @example 2f212049ce79d2b949fd242043004288 */
          id?: string;
          /** @example b2b_components_budget */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-pending-order/e87c4279c6f83e4de2543a63bf59b373/budget
           */
          related?: string;
        };
      };
      budgetId?: string;
    };
    id: string;
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
    customFields?: CustomFields | null;
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
    customFields?: CustomFields | null;
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
    customFields?: CustomFields | null;
    employee?: components["schemas"]["B2bEmployee"];
    employeeId?: string;
    extensions?: {
      organization?: {
        data?: {
          /** @example b4c1948c087fafc89a88450fcbb64c77 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-components-shopping-list/23cb3bfda723e05b43cb25a427ee5a25/organization
           */
          related?: string;
        };
      };
      organizationId?: string;
    };
    id: string;
    lineItems?: components["schemas"]["B2bComponentsShoppingListLineItem"][];
    name?: string;
    price?: components["schemas"]["Price"][];
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
  B2bEmployee: {
    account?: components["schemas"]["B2bEmployeeAccount"];
    accountId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Format: date-time */
    detachedAt?: string;
    email: string;
    extensions?: {
      organization?: {
        data?: {
          /** @example b4c1948c087fafc89a88450fcbb64c77 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-employee/1131eb0b1859b37129289fe3bcc9e70b/organization
           */
          related?: string;
        };
      };
      organizationId?: string;
    };
    firstName: string;
    id: string;
    isPrimaryMembership?: boolean;
    language?: components["schemas"]["Language"];
    languageId: string;
    lastName: string;
    role?: components["schemas"]["B2bComponentsRole"];
    status?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  B2bEmployeeAccount: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    email: string;
    employees?: components["schemas"]["B2bEmployee"][];
    extensions?: {
      defaultEmployee?: {
        data?: {
          /** @example dcc27abeb81b4e3a5d24d9a66132c3bf */
          id?: string;
          /** @example b2b_employee */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /b2b-employee-account/d44c56f59f71fa5dfc80938683b96e81/defaultEmployee
           */
          related?: string;
        };
      };
      defaultEmployeeId?: string;
    };
    firstName: string;
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lastName: string;
    status?: string;
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
    /** @constant */
    apiAlias: "breadcrumb";
    categoryId: string;
    name: string;
    path: string;
    seoUrls?: components["schemas"]["SeoUrl"][];
    translated: {
      categoryId: string;
      customFields?: CustomFields | null;
      description?: string;
      externalLink?: string;
      internalLink?: string;
      keywords?: string;
      linkNewTab?: boolean;
      linkType?: components["schemas"]["Category"]["linkType"];
      metaDescription?: string;
      metaTitle?: string;
      name: string;
      path: string;
      slotConfig?: GenericRecord;
    };
    type: components["schemas"]["Category"]["type"];
  };
  BreadcrumbCollection: components["schemas"]["Breadcrumb"][];
  CalculatedPrice: {
    /** @constant */
    apiAlias: "calculated_price";
    calculatedTaxes: {
      /** @constant */
      apiAlias: "cart_tax_calculated";
      price: number;
      tax: number;
      taxRate: number;
    }[];
    listPrice: components["schemas"]["CartListPrice"] | null;
    quantity: number;
    referencePrice: components["schemas"]["CartPriceReference"] | null;
    regulationPrice: {
      /** @constant */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    /** Currently active tax rules and/or rates */
    taxRules: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    totalPrice: number;
    unitPrice: number;
  };
  Cart: {
    /** An affiliate tracking code */
    affiliateCode?: string | null;
    /** @constant */
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
    price: components["schemas"]["CartPrice"];
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
      /** @constant */
      apiAlias?: "cart_delivery_shipping_location";
      country?: components["schemas"]["Country"];
      state?: components["schemas"]["CountryState"];
    };
    positions?: components["schemas"]["CartDeliveryPosition"][];
    shippingCosts?: components["schemas"]["CalculatedPrice"];
    shippingMethod?: components["schemas"]["ShippingMethod"];
  };
  CartDeliveryInformation: {
    /** @constant */
    apiAlias: "cart_delivery_information";
    deliveryTime?: {
      /** @constant */
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
  CartItemsUpdate: {
    items: components["schemas"]["CartLineItemUpdate"][];
  };
  CartLineItemUpdate: {
    coverId?: string;
    id: string;
    label?: string;
    payload?: GenericRecord;
    priceDefinition?: {
      isCalculated?: boolean;
      listPrice?: number;
      percentage?: number;
      price?: number;
      quantity?: number;
      taxRules?: {
        percentage?: number;
        taxRate?: number;
      }[];
      type?: string;
    };
    quantity?: number;
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    type?: components["schemas"]["OrderLineItem"]["type"];
  };
  CartListPrice: {
    /** @constant */
    apiAlias: "cart_list_price";
    discount?: number;
    percentage?: number;
    price?: number;
  };
  CartPrice: {
    /** @constant */
    apiAlias: "cart_price";
    calculatedTaxes: {
      /** @constant */
      apiAlias: "cart_tax_calculated";
      price: number;
      tax: number;
      taxRate: number;
    }[];
    netPrice: number;
    positionPrice: number;
    rawTotal: number;
    /** Currently active tax rules and/or rates */
    taxRules: {
      name?: string;
      /** Format: float */
      taxRate?: number;
    }[];
    /** @enum {string} */
    taxStatus: "gross" | "net" | "tax-free";
    totalPrice: number;
  };
  CartPriceQuantity: {
    /** @constant */
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
    /** @constant */
    apiAlias: "cart_price_reference";
    hasRange: boolean;
    listPrice: components["schemas"]["CartListPrice"] | null;
    price?: number;
    purchaseUnit?: number;
    referenceUnit?: number;
    regulationPrice: {
      /** @constant */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    unitName: string;
    variantId?: string | null;
  };
  Category: {
    /** When boolean value is `true`, the category is listed for selection. */
    active?: boolean;
    /** Unique identity of the category under which the new category is to be created. */
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    /** @constant */
    apiAlias: "category";
    readonly breadcrumb: string[];
    /** Format: int64 */
    readonly childCount: number;
    /** Child categories within this category for hierarchical navigation */
    children: components["schemas"]["Category"][];
    /** CMS page layout for the category */
    cmsPage?: components["schemas"]["CmsPage"];
    /** Unique identity of CMS page. */
    cmsPageId?: string;
    /**
     * @deprecated
     * Runtime field, cannot be used as part of the criteria.
     */
    cmsPageIdSwitched?: boolean;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customEntityTypeId?: string;
    customFields?: CustomFields | null;
    description?: string;
    /** Shows nested categories on a product category page. */
    displayNestedProducts?: boolean;
    externalLink?: string;
    id: string;
    internalLink?: string;
    keywords?: string;
    /**
     * Format: int64
     * An integer value that denotes the level of nesting of a particular category located in an hierarchical category tree.
     */
    readonly level?: number;
    linkNewTab?: boolean;
    /** @enum {string} */
    linkType?: "category" | "product" | "external" | "landing_page";
    /** Category image or banner */
    media?: components["schemas"]["Media"];
    /** Unique identity of media added to identify category. */
    mediaId?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    /** Unique identity of category. */
    parent?: components["schemas"]["Category"];
    parentId?: string;
    parentVersionId?: string;
    /** A relative URL to the category. */
    readonly path?: string;
    /** Type of product assignment: Dynamic product group as or `product_stream` or Manual assignment as `product`. */
    productAssignmentType?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    seoUrl?: string;
    /** SEO-friendly URLs for the category across different sales channels */
    seoUrls?: components["schemas"]["SeoUrl"][];
    /** Tags for organizing and filtering categories */
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
      seoUrl: string;
      type: string;
      versionId: string;
    };
    /**
     * Type of categories like `page`, `folder`, `link`.
     * @enum {string}
     */
    type: "page" | "link" | "folder";
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
    /** Displays categories on category page when true. */
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
    /** @constant */
    apiAlias: "cms_block";
    /** Defines the background color of an element. */
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    /** Unique identity of background media. */
    backgroundMediaId?: string;
    /** Background media mode accept values `cover`, `auto`, `contain`. */
    backgroundMediaMode?: string;
    cmsSectionVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** One or more CSS classes added and separated by spaces. */
    cssClass?: string;
    customFields?: CustomFields | null;
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
    id: string;
    /** Defines for the margin area on the bottom of an element. */
    marginBottom?: string;
    /** Defines for the margin area on the left of an element. */
    marginLeft?: string;
    /** Defines the margin area on the right of an element. */
    marginRight?: string;
    /** Defines the margin area on the top of an element. */
    marginTop?: string;
    /** Unique name of the CMS Block. */
    name?: string;
    /**
     * Format: int64
     * Order of the block indicated by number like 0, 1, 2,...
     */
    position: number;
    /** Unique identity of section. */
    sectionId: string;
    /** Position of the section. It can either be `main` or `sidebar`. */
    sectionPosition?: string;
    slots: components["schemas"]["CmsSlot"][];
    /** Type of block can be 'image`, `text`, 'product-listing`, `image-two-column`, etc. */
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
    /** @constant */
    apiAlias: "cms_page";
    config?: {
      backgroundColor?: string;
    };
    /** Format: date-time */
    readonly createdAt?: string;
    /** One or more CSS classes added and separated by spaces. */
    cssClass?: string;
    customFields?: CustomFields | null;
    /** This field will be implemented in the future. */
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
    /** Landing pages using this CMS layout */
    landingPages?: components["schemas"]["LandingPage"][];
    name?: string;
    /** Preview image for the CMS page in admin panel and page selection */
    previewMedia?: components["schemas"]["Media"];
    /** Unique identity of media to be previewed. */
    previewMediaId?: string;
    /** Content sections within the CMS page (layout blocks containing slots) */
    sections: components["schemas"]["CmsSection"][];
    translated: {
      cssClass: string;
      entity: string;
      name: string;
      previewMediaId: string;
      type: string;
      versionId: string;
    };
    /** CMS page types can be `landingpage`, `page`, `product_list`, `product_detail`. */
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  CmsSection: {
    /** @constant */
    apiAlias: "cms_section";
    /** Background color of CMS page. */
    backgroundColor?: string;
    backgroundMedia?: components["schemas"]["Media"];
    /** Unique identity of CMS section's background media. */
    backgroundMediaId?: string;
    /** Background media mode can be `cover`, `auto` or `contain`. */
    backgroundMediaMode?: string;
    blocks: components["schemas"]["CmsBlock"][];
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** One or more CSS classes added and separated by spaces. */
    cssClass?: string;
    customFields?: CustomFields | null;
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
    id: string;
    /** Hides the sidebar on mobile viewports. It can hold values such as 'mobile', 'wrap', any other string or be unset. */
    mobileBehavior?: string;
    /** Name of the CMS section defined. */
    name?: string;
    page?: components["schemas"]["CmsPage"];
    /** Unique identity of page where CMS section is defined. */
    pageId: string;
    /**
     * Format: int64
     * Position of occurrence of each section denoted by numerical values 0, 1, 2...
     */
    position: number;
    /** Sizing mode can be `boxed` or `full_width`. */
    sizingMode?: string;
    /**
     * Types of sections can be `default` or `sidebar`.
     * @enum {string}
     */
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
    /** @constant */
    apiAlias: "cms_slot";
    block?: components["schemas"]["CmsBlock"];
    /** Unique identity of CMS block where slot is defined. */
    blockId: string;
    cmsBlockVersionId?: string;
    config?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    readonly data?: GenericRecord;
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
    /** Key-value pair to configure which element to be shown in which slot. */
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
    /** It indicates the types of content that can be defined within the slot which includes `image`, `text`, `form`, `product-listing`, `category-navigation`, `product-box`, `buy-box`, `sidebar-filter`, etc. */
    type: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ContextMeasurementSystemInfo: {
    /**
     * The measurement system used in the store. 'metric' for metric system, 'imperial' for imperial system.
     * @default metric
     * @enum {string}
     */
    system?: "metric" | "imperial";
    /** Units used in the measurement system. */
    units?: {
      /**
       * Unit of length.
       * @default mm
       * @enum {string}
       */
      length?: "mm" | "cm" | "m" | "in" | "ft";
      /**
       * Unit of weight.
       * @default kg
       * @enum {string}
       */
      weight?: "g" | "kg" | "oz" | "lb";
    };
  };
  CookieEntry: {
    /** @constant */
    apiAlias: "cookie_entry";
    cookie: string;
    description?: string;
    expiration?: number;
    hidden: boolean;
    name?: string;
    value?: string;
  };
  CookieEntryCollection: components["schemas"]["CookieEntry"][];
  CookieGroup: {
    /** @constant */
    apiAlias: "cookie_group";
    cookie?: string;
    description?: string;
    entries?: components["schemas"]["CookieEntryCollection"];
    expiration?: number;
    isRequired: boolean;
    name: string;
    value?: string;
  };
  CookieRouteResponse: {
    /** @constant */
    apiAlias: "cookie_groups_hash";
    /** Collection of cookie groups */
    elements: components["schemas"]["CookieGroup"][];
    /**
     * Hash of the current cookie configuration. Can be used to detect changes in cookie configuration.
     * @example f86b6a872cb83dbd22d838ceda1aa3d4
     */
    hash: string;
    /**
     * The language ID for which the cookie configuration was generated. Used to store hashes per language.
     * @example 2fbb5fe2e29a4d70aa5854ce7ce3e20b
     */
    languageId: string;
  };
  Country: {
    /** When boolean value is `true`, the country is available for selection in the storefront. */
    active?: boolean;
    addressFormat: GenericRecord;
    /** Wildcard formatted zip codes to allow easy searching in the frontend based on initial constants, for example - 24****, 1856**. */
    advancedPostalCodePattern?: string;
    /** Verify for advanced postal code pattern. */
    checkAdvancedPostalCodePattern?: boolean;
    /** Verify for valid postal code pattern. */
    checkPostalCodePattern?: boolean;
    /** Verify if VAT ID is valid or not. */
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
    customFields?: CustomFields | null;
    /** Default pattern of postal or zip code. */
    defaultPostalCodePattern?: string;
    /** The country's state is displayed in the address when boolean value is `true`. */
    displayStateInRegistration?: boolean;
    /** State details in the address are force included when boolean value is `true`. */
    forceStateInRegistration?: boolean;
    id: string;
    isEu?: boolean;
    /** Internationally recognized two-letter country codes. For example, DE, IN, NO, etc. */
    iso?: string;
    /** Internationally recognized three-letter country codes. For example, DEU, IND, NOR, etc. */
    iso3?: string;
    name: string;
    /**
     * Format: int64
     * Numerical value that indicates the order in which the defined countries must be displayed in the frontend.
     */
    position?: number;
    /** The postal code is made mandatory specification in the address, when boolean value is `true`. */
    postalCodeRequired?: boolean;
    /** The shipping availability for a country is enabled when boolean value is `true`. */
    shippingAvailable?: boolean;
    /** States/provinces/regions within the country */
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
    /** Unique VAT ID with country code and numbers, for example - GB999 9999 */
    vatIdPattern?: string;
    /** Set to true, if VAT ID is to be made mandatory. */
    vatIdRequired?: boolean;
  };
  CountryState: {
    /** When boolean value is `true`, the country's state is available for selection in the storefront. */
    active?: boolean;
    /** Unique identity of the country. */
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    name: string;
    /**
     * Format: int64
     * Numerical value that indicates the order in which the defined states must be displayed in the frontend.
     */
    position?: number;
    /** An abbreviation for the country's state. */
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
    associations?: components["schemas"]["Associations"];
    excludes?: components["schemas"]["Excludes"];
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
    /** @constant */
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
    customFields?: CustomFields | null;
    /**
     * Format: float
     * Currency exchange rate.
     */
    factor: number;
    id: string;
    /** Standard international three digit code to represent currency. For example, USD. */
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
    /**
     * Format: int64
     * The order of the tabs for multiple currencies defined.
     */
    position?: number;
    shortName: string;
    /** A currency symbol is a graphical representation used as shorthand for a currency's name, for example US Dollar - $ */
    symbol: string;
    /**
     * Format: float
     * The value from which the tax must be exempted.
     */
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
  Customer: {
    /** To keep the status of the customer active, the boolean value is set to `true`. */
    active?: boolean;
    /** Currently active billing address in the session */
    activeBillingAddress: components["schemas"]["CustomerAddress"];
    /** Currently active shipping address in the session */
    activeShippingAddress: components["schemas"]["CustomerAddress"];
    /** All addresses saved for the customer */
    addresses?: components["schemas"]["CustomerAddress"][];
    /** An affiliate code is an identification option with which website operators can mark outgoing links. */
    affiliateCode?: string;
    /** @constant */
    apiAlias: "customer";
    /** To capture customer's birthday details. */
    birthday?: string;
    /** A campaign code is the globally unique identifier for a campaign. */
    campaignCode?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    createdById?: string;
    /** Unique  number assigned to identity a customer. */
    customerNumber: string;
    customFields?: CustomFields | null;
    /** Default billing address for the customer */
    defaultBillingAddress?: components["schemas"]["CustomerAddress"];
    /** Unique identity of default billing address. */
    defaultBillingAddressId: string;
    /** Default shipping address for the customer */
    defaultShippingAddress?: components["schemas"]["CustomerAddress"];
    /** Unique identity of default shipping address. */
    defaultShippingAddressId: string;
    /**
     * Format: date-time
     * Date and time when the double opt-in email was confirmed.
     */
    doubleOptInConfirmDate?: string;
    /**
     * Format: date-time
     * Date and time when the double opt-in email was sent.
     */
    doubleOptInEmailSentDate?: string;
    /** Set to `true` to allow user subscriptions to an email marketing list. */
    doubleOptInRegistration?: boolean;
    /** Email ID of the customer. */
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
    /**
     * Format: date-time
     * To capture date and time of customer's first login.
     */
    firstLogin?: string;
    /** First name of the customer. */
    firstName: string;
    /** Customer group determining pricing and permissions */
    group?: components["schemas"]["CustomerGroup"];
    /** Unique identity of customer group. */
    groupId: string;
    /** Boolean value is `true` if it is to be a guest account. */
    guest?: boolean;
    /** Customer registration double opt-in hash for confirming the customer account. */
    hash?: string;
    id: string;
    /** Preferred language for customer communication */
    language?: components["schemas"]["Language"];
    /** Unique identity of language. */
    languageId: string;
    /**
     * Format: date-time
     * To capture date and time of customer's last login.
     */
    lastLogin?: string;
    /** Last name of the customer. */
    lastName: string;
    /**
     * Format: date-time
     * Captures last order date.
     */
    readonly lastOrderDate?: string;
    /** Last used payment method by the customer */
    lastPaymentMethod?: components["schemas"]["PaymentMethod"];
    /** Unique identity of previous payment method. */
    lastPaymentMethodId?: string;
    /**
     * Format: int64
     * Captures the number of orders placed.
     */
    readonly orderCount?: number;
    /**
     * Format: float
     * Sum of total amount to be paid.
     */
    readonly orderTotalAmount?: number;
    /** Unique identity of requested group. */
    requestedGroupId?: string;
    /**
     * Format: int64
     * Number of reviews the customer has given.
     */
    readonly reviewCount?: number;
    /** Unique identity of sales channel. */
    salesChannelId: string;
    /** Customer salutation (e.g., Mr., Mrs., Ms.) */
    salutation?: components["schemas"]["Salutation"];
    /** Unique identity of salutation. */
    salutationId?: string;
    readonly tagIds?: string[];
    /** Tags assigned to the customer for organization and segmentation */
    tags?: components["schemas"]["Tag"][];
    /** Titles or honorifics like Mr, Mrs, etc. */
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
  );
  CustomerAddress: {
    /** Additional customer's address information. */
    additionalAddressLine1?: string;
    /** Additional customer's address information. */
    additionalAddressLine2?: string;
    /** Name of customer's city. */
    city: string;
    /** Name of customer's company. */
    company?: string;
    country?: components["schemas"]["Country"];
    /** Unique identity of country. */
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    /** Unique identity of country's state. */
    countryStateId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Unique identity of customer. */
    customerId: string;
    customFields?: CustomFields | null;
    /** Name of customer's department. */
    department?: string;
    extensions?: {
      billingOrganizations?: {
        data?: {
          /** @example aff42a9b805cb256b5fa77d84c3fa8a9 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /customer-address/1b4b031005f93d02d887e7d66efb653b/billingOrganizations
           */
          related?: string;
        };
      };
      organizationCustomerAddresses?: {
        data?: {
          /** @example ada6a19a929bea8dbec29edb3d68df58 */
          id?: string;
          /** @example b2b_components_organization_customer_address */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /customer-address/1b4b031005f93d02d887e7d66efb653b/organizationCustomerAddresses
           */
          related?: string;
        };
      };
      shippingOrganizations?: {
        data?: {
          /** @example 91f4ddd1dd77c56814febc8cdb355696 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /customer-address/1b4b031005f93d02d887e7d66efb653b/shippingOrganizations
           */
          related?: string;
        };
      };
    };
    /** First name of the customer. */
    firstName: string;
    /** Runtime field, cannot be used as part of the criteria. */
    hash?: string;
    id: string;
    /** Added since version: 6.7.7.0. Runtime field, cannot be used as part of the criteria. */
    isDefaultBillingAddress?: boolean;
    /** Added since version: 6.7.7.0. Runtime field, cannot be used as part of the criteria. */
    isDefaultShippingAddress?: boolean;
    /** Last name of the customer. */
    lastName: string;
    /** Customer's phone number. */
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    /** Unique identity of salutation. */
    salutationId?: string;
    /** Name of customer's street. */
    street: string;
    /** Titles given to customer like Dr. , Prof., etc */
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Postal or zip code of customer's address. */
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
    customFields?: CustomFields | null;
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
    countryState?: components["schemas"]["CountryState"] | null;
    /** Format: date-time */
    createdAt: string;
    readonly customerId: string;
    readonly id?: string;
    salutation: components["schemas"]["Salutation"];
    updatedAt: string | null;
  };
  CustomerGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** If boolean value is `true` gross value is displayed else, net value will be displayed to the customer. */
    displayGross?: boolean;
    id: string;
    name: string;
    /** To enable the registration of partner customer group. */
    registrationActive?: boolean;
    registrationIntroduction?: string;
    registrationOnlyCompanyRegistration?: boolean;
    registrationSeoMetaDescription?: string;
    registrationTitle?: string;
    translated: {
      name: string;
      registrationIntroduction: string;
      registrationOnlyCompanyRegistration?: boolean;
      registrationSeoMetaDescription: string;
      registrationTitle: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DeliveryTime: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    /**
     * Format: int64
     * Maximum delivery time taken.
     */
    max: number;
    /**
     * Format: int64
     * Minimum delivery time taken.
     */
    min: number;
    name: string;
    translated: {
      name: string;
      unit: string;
    };
    /** Unit in which the delivery time is defined. For example, days or hours. */
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
    customFields?: CustomFields | null;
    deepLinkCode: string;
    dependentDocuments?: components["schemas"]["Document"][];
    documentA11yMediaFile?: components["schemas"]["Media"];
    documentA11yMediaFileId?: string;
    documentMediaFile?: components["schemas"]["Media"];
    documentMediaFileId?: string;
    documentNumber?: string;
    documentType?: components["schemas"]["DocumentType"];
    documentTypeId: string;
    fileType?: string;
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
  DocumentType: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    name: string;
    /** Technical name of document type. */
    technicalName: string;
    translated: {
      name: string;
      technicalName: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  DsrPresentationCmsPage: {
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
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
  EmployeeAvailableContextsResponse: {
    /** Every active membership the logged-in account can act as. */
    contexts: components["schemas"]["EmployeeContext"][];
    /** True when the account has more than one context and none is active yet, so the storefront must prompt the user to pick one before continuing. */
    contextSelectionRequired: boolean;
    /** The account's default context, auto-activated on the next login. Null when no default is set. */
    defaultEmployeeId?: string | null;
  };
  EmployeeContext: {
    /** Whether this context is the one currently active for the session. */
    active: boolean;
    /** Identifier of the business partner customer (company). Null when the context is not bound to a specific customer record. */
    companyId?: string | null;
    /** Display name of the company this context belongs to. */
    companyName: string;
    /** Identifier of the employee identity that represents this membership. */
    employeeId: string;
    /** Identifier of the B2B role granted in this context. Null when no role is assigned. */
    roleId?: string | null;
    /** Name of the B2B role granted in this context. Null when no role is assigned. */
    roleName?: string | null;
  };
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
  Excludes: {
    [key: string]: string[];
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
  Includes: {
    [key: string]: string[];
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
    /** @constant */
    apiAlias: "landing_page";
    /** CMS page layout for the landing page */
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    keywords?: string;
    metaDescription?: string;
    metaTitle?: string;
    name: string;
    /** SEO-friendly URLs for the landing page across different sales channels */
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
  Language: {
    active?: boolean;
    /** Child languages inheriting from this parent language */
    children?: components["schemas"]["Language"][];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    /** Locale defining regional settings (date, time, number formats) */
    locale?: components["schemas"]["Locale"];
    /** Unique identity of locale. */
    localeId: string;
    /** Name of the language. */
    name: string;
    /** Unique identity of language. */
    parent?: components["schemas"]["Language"];
    parentId?: string;
    /** Locale used for translating content */
    translationCode?: components["schemas"]["Locale"];
    /** Unique identity of translation code. */
    translationCodeId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  LineItem: {
    children?: components["schemas"]["LineItem"][];
    cover: components["schemas"]["Media"] | null;
    dataContextHash?: string;
    dataTimestamp?: string;
    deliveryInformation?: components["schemas"]["CartDeliveryInformation"];
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
    payload?: components["schemas"]["ProductJsonApi"];
    price?: {
      /** @constant */
      apiAlias: "calculated_price";
      calculatedTaxes?: {
        /** @constant */
        apiAlias: "cart_tax_calculated";
        price: number;
        tax: number;
        taxRate: number;
      }[];
      listPrice?: components["schemas"]["CartListPrice"] | null;
      quantity: number;
      referencePrice?: components["schemas"]["CartPriceReference"] | null;
      regulationPrice?: {
        /** @constant */
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
    quantity?: number;
    quantityInformation?: {
      maxPurchase?: number;
      minPurchase?: number;
      purchaseSteps?: number;
    };
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    /** @deprecated */
    states?: ("is-physical" | "is-download")[];
    type: components["schemas"]["OrderLineItem"]["type"];
    uniqueIdentifier?: string;
  };
  LineItemType: "dsr-line-item-discount" | "dsr-cart-discount";
  ListCategoryRouteResponse: {
    categories: components["schemas"]["EntitySearchResult"];
  };
  ListPrice: {
    /** @constant */
    apiAlias: "cart_list_price";
    discount?: number;
    percentage?: number;
    price?: number;
  };
  Locale: {
    /** Code given to the locale. For example: en-CA. */
    code: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
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
  MainCategory: {
    /** Unique identity of the category. */
    categoryId: string;
    categoryVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /** Unique identity of the product. */
    productId: string;
    productVersionId?: string;
    /** Unique identity of the sales channel. */
    salesChannelId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  MeasurementUnits: {
    /**
     * The measurement system used in the store. 'metric' for metric system, 'imperial' for imperial system.
     * @default metric
     * @enum {string}
     */
    system?: "metric" | "imperial";
    /** Units used in the measurement system. */
    units?: {
      /**
       * Unit of length.
       * @default mm
       * @enum {string}
       */
      length?: "mm" | "cm" | "m" | "in" | "ft";
      /**
       * Unit of weight.
       * @default kg
       * @enum {string}
       */
      weight?: "g" | "kg" | "oz" | "lb";
    };
  };
  Media: {
    alt?: string;
    /** @constant */
    apiAlias: "media";
    config?: GenericRecord;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
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
    /** Type of file indication. For example: jpeg, png. */
    fileExtension: string;
    /** Name of the media file uploaded. */
    fileName: string;
    /**
     * Format: int64
     * Size of the file media file uploaded.
     */
    readonly fileSize?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    hasFile: boolean;
    id: string;
    readonly metaData?: {
      /** Format: int64 */
      height?: number;
      /** Format: int64 */
      width?: number;
    };
    /** A string sent along with a file indicating the type of the file. For example: image/jpeg. */
    mimeType?: string;
    path: string;
    /** When `true`, the media display is kept private. */
    private: boolean;
    /** Generated thumbnail images in various sizes */
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
    /**
     * Format: date-time
     * Date and time at which media was added.
     */
    readonly uploadedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url: string;
  };
  MediaThumbnail: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /**
     * Format: int64
     * Height of the thumbnail.
     */
    readonly height: number;
    id: string;
    /** Unique identity of media. */
    mediaId: string;
    mediaThumbnailSizeId?: string;
    path?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Public url of media thumbnail. Runtime field, cannot be used as part of the criteria. */
    url: string;
    /**
     * Format: int64
     * Width of the thumbnail.
     */
    readonly width: number;
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
  NewsletterStatus: "notSet" | "optIn" | "optOut" | "direct" | "undefined";
  NoneFieldsCriteria: {
    aggregations?: components["schemas"]["Aggregation"][];
    associations?: components["schemas"]["Associations"];
    excludes?: components["schemas"]["Excludes"];
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
  Order: {
    /** All addresses associated with the order (billing and shipping) */
    addresses?: components["schemas"]["OrderAddress"][];
    /** An affiliate code is an identification option with which website operators can mark outgoing links. */
    affiliateCode?: string;
    /**
     * Format: float
     * Net price of the order.
     */
    readonly amountNet?: number;
    /**
     * Format: float
     * Gross price of the order.
     */
    readonly amountTotal?: number;
    /** Billing address for the order */
    billingAddress?: components["schemas"]["OrderAddress"];
    /** Unique identity of the billing address. */
    billingAddressId: string;
    billingAddressVersionId?: string;
    /** A campaign code is the globally unique identifier for a campaign. */
    campaignCode?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Unique identity of createdBy. */
    createdById?: string;
    /** Currency used for the order */
    currency?: components["schemas"]["Currency"];
    /**
     * Format: float
     * Rate at which currency is exchanged.
     */
    currencyFactor: number;
    /** Unique identity of the currency. */
    currencyId: string;
    /** Comments given by comments. */
    customerComment?: string;
    customFields?: CustomFields | null;
    /** It is a generated special code linked to email. It is used to access orders placed by guest customers. */
    deepLinkCode?: string;
    /** Delivery information including shipping address and tracking */
    deliveries?: components["schemas"]["OrderDelivery"][];
    /** Generated documents (invoices, delivery notes, credit notes) */
    documents: components["schemas"]["Document"][];
    extensions?: {
      budget?: {
        data?: {
          /** @example 2f212049ce79d2b949fd242043004288 */
          id?: string;
          /** @example b2b_components_budget */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/budget
           */
          related?: string;
        };
      };
      budgetId?: string;
      initialSubscriptions?: {
        data?: {
          /** @example 3b40c275cdd1f84402bcef5be1651f64 */
          id?: string;
          /** @example subscription */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/initialSubscriptions
           */
          related?: string;
        };
      };
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
      organization?: {
        data?: {
          /** @example b4c1948c087fafc89a88450fcbb64c77 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /order/a240fa27925a635b08dc28c9e4f9216d/organization
           */
          related?: string;
        };
      };
      organizationId?: string;
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
      subscriptionId?: string;
    };
    id: string;
    /** Language used when placing the order */
    language?: components["schemas"]["Language"];
    /** Unique identity of the language. */
    languageId: string;
    /** Order line items (products, discounts, fees) */
    lineItems?: components["schemas"]["OrderLineItem"][];
    /** Customer information associated with the order */
    orderCustomer?: components["schemas"]["OrderCustomer"];
    /** Date when the order was placed. */
    readonly orderDate: string;
    /**
     * Format: date-time
     * Timestamp when the order was placed.
     */
    orderDateTime: string;
    /** Unique number associated with every order. */
    orderNumber?: string;
    /**
     * Format: float
     * Price of each line item in the cart multiplied by its quantity excluding charges like shipping cost, rules, taxes etc.
     */
    readonly positionPrice?: number;
    price: components["schemas"]["CartPrice"];
    /** Primary delivery information for the order */
    primaryOrderDelivery?: components["schemas"]["OrderDelivery"];
    primaryOrderDeliveryId?: string;
    primaryOrderDeliveryVersionId?: string;
    /** Primary payment transaction for the order */
    primaryOrderTransaction?: components["schemas"]["OrderTransaction"];
    primaryOrderTransactionId?: string;
    primaryOrderTransactionVersionId?: string;
    /** Unique identity of the sales channel. */
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
    /**
     * Format: float
     * Total shipping cost of the ordered product.
     */
    readonly shippingTotal?: number;
    /** Source of orders either via normal order placement or subscriptions. */
    source?: string;
    /** Current order state (e.g., open, in_progress, completed, cancelled) */
    stateMachineState: components["schemas"]["StateMachineState"];
    /** Tags assigned to the order for organization and filtering */
    tags?: components["schemas"]["Tag"][];
    taxCalculationType?: string;
    /** TaxStatus takes `Free`, `Net` or `Gross` as values. */
    readonly taxStatus?: string;
    /** Payment transactions for the order */
    transactions?: components["schemas"]["OrderTransaction"][];
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Unique identity of updatedBy. */
    updatedById?: string;
    versionId?: string;
  };
  OrderAddress: {
    /** Additional address input if necessary. */
    additionalAddressLine1?: string;
    /** Additional address input if necessary. */
    additionalAddressLine2?: string;
    /** Name of the city. */
    city: string;
    /** Name of the company. */
    company?: string;
    country?: components["schemas"]["Country"];
    /** Unique identity of country. */
    countryId: string;
    countryState?: components["schemas"]["CountryState"];
    /** Unique identity of state. */
    countryStateId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Name of the department. */
    department?: string;
    /** First name of the customer. */
    firstName: string;
    /** Runtime field, cannot be used as part of the criteria. */
    hash?: string;
    id: string;
    /** Last name of the customer. */
    lastName: string;
    /** Phone number of the customer. */
    phoneNumber?: string;
    salutation?: components["schemas"]["Salutation"];
    /** Street address */
    street: string;
    /** Title name given to customer like DR. , Prof., etc. */
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /**
     * @deprecated
     * Unique identity of VAT.
     */
    vatId?: string;
    versionId?: string;
    /** Zip code of the country. */
    zipcode?: string;
  };
  OrderCustomer: {
    /** Name of the company. */
    company?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Unique number assigned to the customer. */
    customerNumber?: string;
    customFields?: CustomFields | null;
    /** Email address of the customer. */
    email: string;
    /** First name of the customer. */
    firstName: string;
    id: string;
    /** Last name of the customer. */
    lastName: string;
    salutation?: components["schemas"]["Salutation"];
    /** Unique identity of salutation. */
    salutationId?: string;
    /** Title name given to the customer like Dr, prof. etc. */
    title?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    vatIds?: string[];
    versionId?: string;
  };
  OrderDelivery: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    /** Unique identity of order. */
    orderId: string;
    orderVersionId?: string;
    /** Line items included in this delivery */
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
    /**
     * Format: date-time
     * Date and time of earliest delivery of products.
     */
    shippingDateEarliest: string;
    /**
     * Format: date-time
     * Date and time of latest delivery of products.
     */
    shippingDateLatest: string;
    /** Shipping method used for this delivery */
    shippingMethod?: components["schemas"]["ShippingMethod"];
    /** Unique identity of shipping method. */
    shippingMethodId: string;
    /** Shipping address for this delivery */
    shippingOrderAddress?: components["schemas"]["OrderAddress"];
    /** Unique identity of order's shipping address. */
    shippingOrderAddressId: string;
    shippingOrderAddressVersionId?: string;
    /** Unique identity of state. */
    stateId: string;
    /** Current delivery state (e.g., open, shipped, delivered, cancelled) */
    stateMachineState?: components["schemas"]["StateMachineState"];
    trackingCodes?: string[];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderDeliveryPosition: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    /** Unique identity of order delivery. */
    orderDeliveryId: string;
    orderDeliveryVersionId?: string;
    /** Unique identity of line items in an order. */
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
    /**
     * Format: int64
     * Number of items of each product.
     */
    quantity?: number;
    /**
     * Format: float
     * Cost of product based on quantity.
     */
    totalPrice?: number;
    /**
     * Format: float
     * Price of product per item (where, quantity=1).
     */
    unitPrice?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderLineItem: {
    /** @constant */
    apiAlias: "order_line_item";
    children: components["schemas"]["OrderLineItem"][];
    /** Line item image or thumbnail */
    cover?: components["schemas"]["Media"];
    /** Unique identity of cover image. */
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Description of line items in an order. */
    description?: string;
    /** Digital downloads associated with this line item */
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
      stateId?: string;
    };
    /** When set to true, it indicates the line item is physical else it is virtual. */
    good?: boolean;
    id: string;
    /** It is a unique identity of an item in cart before its converted to an order. */
    identifier: string;
    /** It is a typical product name given to the line item. */
    label: string;
    /** Delivery positions for this line item */
    orderDeliveryPositions?: components["schemas"]["OrderDeliveryPosition"][];
    /** Unique identity of order. */
    orderId: string;
    orderVersionId?: string;
    parent?: components["schemas"]["OrderLineItem"];
    parentId?: string;
    parentVersionId?: string;
    payload?: {
      readonly categoryIds?: string[];
      /** Format: date-time */
      readonly createdAt?: string;
      customFields?: CustomFields | null;
      features?: unknown[];
      isCloseout?: boolean;
      isNew?: boolean;
      manufacturerId?: string;
      markAsTopseller?: boolean;
      readonly optionIds?: string[];
      options?: components["schemas"]["PropertyGroupOption"][];
      parentId?: string;
      productNumber?: string;
      productType?: components["schemas"]["Product"]["type"];
      readonly propertyIds?: string[];
      /** Format: date-time */
      releaseDate?: string;
      /** Format: int64 */
      stock?: number;
      readonly streamIds?: string[];
      readonly tagIds?: string[];
      taxId?: string;
    };
    /**
     * Format: int64
     * Position of line items placed in an order.
     */
    position?: number;
    priceDefinition?: components["schemas"]["CartPriceQuantity"];
    /** Referenced product if this is a product line item */
    product?: components["schemas"]["Product"];
    /** Unique identity of product. */
    productId?: string;
    productVersionId?: string;
    /** Unique identity of product. */
    promotionId?: string;
    /**
     * Format: int64
     * Number of items of product.
     */
    quantity: number;
    /** Unique identity of type of entity. */
    referencedId?: string;
    /** Allows the line item to be removable from the cart when set to true. */
    removable?: boolean;
    /** Allows to change the quantity of the line item when set to true. */
    stackable?: boolean;
    /** @deprecated */
    states: string[];
    /**
     * Format: float
     * Cost of product based on quantity.
     */
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
    /**
     * Type refers to the entity type of an item whether it is product or promotion for instance.
     * @enum {string}
     */
    type?:
      | "product"
      | "credit"
      | "custom"
      | "promotion"
      | "container"
      | "discount"
      | "quantity";
    /**
     * Format: float
     * Price of product per item (where, quantity=1).
     */
    unitPrice?: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  OrderLineItemDownload: {
    /** When boolean value is `true`, the digital product is allowed to download. */
    accessGranted: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    media: components["schemas"]["Media"];
    /** Unique identity of media. */
    mediaId: string;
    orderLineItem?: components["schemas"]["OrderLineItem"];
    /** Unique identity of Order line item. */
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    /**
     * Format: int64
     * The order of downloaded digital products displayed in the storefront by mentioning numerical values like 1,2,3, etc.
     */
    position: number;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
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
    customFields?: CustomFields | null;
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
    content?: string;
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
    /** Payment captures for this transaction */
    captures?: components["schemas"]["OrderTransactionCapture"][];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    /** Unique identity of an order. */
    orderId: string;
    orderVersionId?: string;
    /** Payment method used for this transaction */
    paymentMethod?: components["schemas"]["PaymentMethod"];
    /** Unique identity of payment method. */
    paymentMethodId: string;
    /** Unique identity of state. */
    stateId: string;
    /** Current payment transaction state (e.g., open, paid, cancelled) */
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
    customFields?: CustomFields | null;
    /** External payment provider token. */
    externalReference?: string;
    id: string;
    /** Unique identity of order transaction. */
    orderTransactionId: string;
    orderTransactionVersionId?: string;
    refunds?: components["schemas"]["OrderTransactionCaptureRefund"][];
    /** Unique identity of order state. */
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
    /** Unique identity of order transaction capture. */
    captureId: string;
    captureVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** External payment provider token. */
    externalReference?: string;
    id: string;
    positions?: components["schemas"]["OrderTransactionCaptureRefundPosition"][];
    /** Reason for refunding the amount for an order. */
    reason?: string;
    /** Unique identity of order state. */
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
    customFields?: CustomFields | null;
    /** External payment provider token. */
    externalReference?: string;
    id: string;
    orderLineItem?: components["schemas"]["OrderLineItem"];
    /** Unique identity of order line item. */
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    orderTransactionCaptureRefund?: components["schemas"]["OrderTransactionCaptureRefund"];
    /**
     * Format: int64
     * Quantity of line item to be refunded.
     */
    quantity?: number;
    /** Reason for refunding the amount for an order. */
    reason?: string;
    /** Unique identity of order transaction capture refund. */
    refundId: string;
    refundVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
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
    /** When boolean value is `true`, the payment methods are available for selection in the storefront. */
    active?: boolean;
    /** When set to true, customers are redirected to the payment options page to choose a new payment method on order failure. */
    afterOrderEnabled?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    description?: string;
    readonly distinguishableName?: string;
    id: string;
    /** Payment method logo or icon image */
    media?: components["schemas"]["Media"];
    /** Unique identity of media. */
    mediaId?: string;
    name: string;
    /**
     * Format: int64
     * The order of the tabs of your defined payment methods in the storefront by entering numerical values like 1,2,3, etc.
     */
    position?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    shortName?: string;
    technicalName: string;
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
    /** Unique identity of the associated currency. */
    currencyId: string;
    /** Gross price for the associated currency. */
    gross: number;
    /** Whether gross and net prices are linked through the tax configuration. */
    linked?: boolean;
    /** Reference list price for displaying discounts. */
    listPrice?: {
      /** Unique identity of the associated currency. */
      currencyId?: string;
      /** Gross list price for the associated currency. */
      gross: number;
      /** Whether gross and net list prices are linked through the tax configuration. */
      linked?: boolean;
      /** Net list price for the associated currency. */
      net: number;
    };
    /** Net price for the associated currency. */
    net: number;
    /** Discount percentage relative to the list price for the gross and net amounts. `null` when no list price is set. */
    percentage?: {
      /** Discount percentage relative to the gross list price. */
      gross: number;
      /** Discount percentage relative to the net list price. */
      net: number;
    } | null;
    /** Reference price used for legal price disclosures. */
    regulationPrice?: {
      /** Unique identity of the associated currency. */
      currencyId?: string;
      /** Gross regulation price for the associated currency. */
      gross: number;
      /** Whether gross and net regulation prices are linked through the tax configuration. */
      linked?: boolean;
      /** Net regulation price for the associated currency. */
      net: number;
    };
  };
  Product: {
    /** When boolean value is `true`, the products are available for selection in the storefront for purchase. */
    active?: boolean;
    /** @constant */
    apiAlias: "product";
    /** Indicates weather the product is available or not. */
    readonly available?: boolean;
    /**
     * Format: int64
     * Indicates the number of products still available. This value results from the stock minus the open orders.
     */
    readonly availableStock?: number;
    calculatedCheapestPrice?: {
      /** @constant */
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
    /** Canonical product reference for variant consolidation and SEO purposes */
    canonicalProduct?: components["schemas"]["Product"];
    /** Unique identity of canonical product. */
    canonicalProductId?: string;
    canonicalProductVersionId?: string;
    /** Categories this product is assigned to */
    categories?: components["schemas"]["Category"][];
    /** Read-only category tree including all parent categories for optimized queries */
    categoriesRo?: components["schemas"]["Category"][];
    readonly categoryIds?: string[];
    readonly categoryTree?: string[];
    /** Format: int64 */
    readonly childCount?: number;
    /** Product variants that inherit from this parent product */
    children?: components["schemas"]["Product"][];
    /** Custom CMS page layout for the product detail page */
    cmsPage?: components["schemas"]["CmsPage"];
    /** Unique identity of CMS page. */
    cmsPageId?: string;
    cmsPageVersionId?: string;
    /** Variant configurator settings defining available options for product variants */
    configuratorSettings?: components["schemas"]["ProductConfiguratorSetting"][];
    /** Main product image displayed in listings and detail pages */
    cover?: components["schemas"]["ProductMedia"];
    /** Unique identity of a ProductMedia item used as product cover. */
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Cross-selling configurations (related products, accessories, similar items) */
    crossSellings?: components["schemas"]["ProductCrossSelling"][];
    customFields?: CustomFields | null;
    /** Estimated delivery time for the product */
    deliveryTime?: components["schemas"]["DeliveryTime"];
    /** Unique identity of delivery time. */
    deliveryTimeId?: string;
    description?: string;
    /** Read-only, HTML-stripped excerpt of the description, derived on write. */
    readonly descriptionTeaser?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    readonly displayGroup?: string;
    /** Downloadable files associated with the product (e.g., manuals, digital content) */
    downloads?: components["schemas"]["ProductDownload"][];
    /** Indicates EAN of the product. */
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
      /** Reference to the bundle item definition when this product acts as a bundle item. */
      belongToBundleItems?: {
        data?: {
          /** @example db4ef6a91ceb3a70935c07a3617ea4cd */
          id?: string;
          /** @example bundle_item */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/belongToBundleItems
           */
          related?: string;
        };
      };
      /** Discount configurations that belong to this bundle. */
      bundleDiscounts?: {
        data?: {
          /** @example a79712cce6d0182645b519f6add10f77 */
          id?: string;
          /** @example bundle_discount */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/bundleDiscounts
           */
          related?: string;
        };
      };
      /** Bundle items assigned to this grouped bundle product. */
      bundleItems?: {
        data?: {
          /** @example d7706d2e11bc4878ffb242403ea5b274 */
          id?: string;
          /** @example bundle_item */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/bundleItems
           */
          related?: string;
        };
      };
      /**
       * Format: int64
       * Runtime-only number of bundle items used for storefront display and validation. Runtime field, cannot be used as part of the criteria.
       */
      bundleItemsCount?: number;
      /** Bundles that include this product as an item. */
      bundles?: {
        data?: {
          /** @example 9e21e19f42862a3b26cd7aae135a3f74 */
          id?: string;
          /** @example product */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/bundles
           */
          related?: string;
        };
      };
      /** Sales channels in which this bundle is available. */
      readonly bundleSalesChannels?: {
        data?: {
          /** @example d4aa52cb00cd89c5e047c6a5c72a0384 */
          id?: string;
          /** @example sales_channel */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/bundleSalesChannels
           */
          related?: string;
        };
      };
      /** Products referenced as bundle items of this bundle. */
      items?: {
        data?: {
          /** @example 691d502cfd0e0626cd3b058e5682ad1c */
          id?: string;
          /** @example product */
          type?: string;
        }[];
        links?: {
          /**
           * Format: uri-reference
           * @example /product/deb10517653c255364175796ace3553f/items
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
      swagCustomizedProductsTemplateId?: string;
      swagCustomizedProductsTemplateVersionId?: string;
    };
    /**
     * Format: float
     * The height of the product.
     */
    height?: number;
    id: string;
    /** When the value is set to true, the product is hidden when sold out. */
    isCloseout?: boolean;
    /** Runtime field, cannot be used as part of the criteria. */
    isNew?: boolean;
    keywords?: string;
    /**
     * Format: float
     * The length of the product.
     */
    length?: number;
    /** Primary category assignments per sales channel for SEO and navigation */
    mainCategories?: components["schemas"]["MainCategory"][];
    /** Product manufacturer or brand information */
    manufacturer?: components["schemas"]["ProductManufacturer"];
    /** Unique identity of the manufacturer. */
    manufacturerId?: string;
    /** Unique number that describes the manufacturer. */
    manufacturerNumber?: string;
    /** Indicates weather the product is top seller or not. */
    markAsTopseller?: boolean;
    /**
     * Format: int64
     * Maximum number of items that can be purchased.
     */
    maxPurchase?: number;
    measurements?: components["schemas"]["ProductMeasurements"];
    /** Product images and media gallery */
    media?: components["schemas"]["ProductMedia"][];
    metaDescription?: string;
    metaTitle?: string;
    /**
     * Format: int64
     * Minimum number of items that can be purchased.
     */
    minPurchase?: number;
    name: string;
    ogDescription?: string;
    ogTitle?: string;
    /** Open Graph image for social media sharing */
    openGraphMedia?: components["schemas"]["Media"];
    /** Media used as Open Graph image for social media sharing. */
    openGraphMediaId?: string;
    readonly optionIds?: string[];
    /** Product variant options (e.g., size, color) that define different variants */
    options?: components["schemas"]["PropertyGroupOption"][];
    packUnit?: string;
    packUnitPlural?: string;
    /** Unique identity of the product. */
    parent?: components["schemas"]["Product"];
    parentId?: string;
    parentVersionId?: string;
    productManufacturerVersionId?: string;
    productMediaVersionId?: string;
    /** Unique number assigned to individual products. Define rules for automatic assignment of every product creation as per your number range. */
    productNumber: string;
    /** Customer reviews and ratings for the product */
    productReviews?: components["schemas"]["ProductReview"][];
    /** Product properties and characteristics for filtering */
    properties?: components["schemas"]["PropertyGroupOption"][];
    readonly propertyIds?: string[];
    /**
     * Format: int64
     * Specifies the scales in which the item is to be offered. For example, a scale of 2 means that your customers can purchase 2, 4, 6 products, etc., but not 1, 3 or 5.
     */
    purchaseSteps?: number;
    /**
     * Format: float
     * Quantity of the item purchased. For example, 500ml, 2kg, etc.
     */
    purchaseUnit?: number;
    /**
     * Format: float
     * Average of all the ratings.
     */
    readonly ratingAverage?: number;
    /**
     * Format: float
     * Price of purchased item calculated as per the reference unit. Say, you bought 500ml of milk and the price is calculated in reference to 1000ml.
     */
    referenceUnit?: number;
    /**
     * Format: date-time
     * The release date of a product or product model. This can be used to distinguish the exact variant of a product.
     */
    releaseDate?: string;
    /**
     * Format: int64
     * The restock time in days indicates how long it will take until a sold out item is back in stock.
     */
    restockTime?: number;
    /**
     * Format: int64
     * Frequency of the product sales.
     */
    readonly sales?: number;
    /** Main category used for SEO URL generation in the current sales channel */
    seoCategory: components["schemas"]["Category"];
    /** SEO-friendly URLs for the product across different sales channels */
    seoUrls?: components["schemas"]["SeoUrl"][];
    /** Indicates weather the shipping price is free or not. */
    shippingFree?: boolean;
    sortedProperties?: GenericRecord;
    /** @deprecated */
    readonly states?: string[];
    /**
     * Format: int64
     * Indicates the number of products available.
     */
    stock: number;
    readonly streamIds?: string[];
    /** Dynamic product streams this product belongs to based on defined filters */
    streams?: components["schemas"]["ProductStream"][];
    readonly tagIds?: string[];
    /** Tags for organizing and filtering products */
    tags?: components["schemas"]["Tag"][];
    /** Tax configuration (rate and calculation rules) */
    tax?: components["schemas"]["Tax"];
    /** Unique identity of tax. */
    taxId: string;
    translated: {
      canonicalProductId: string;
      canonicalProductVersionId: string;
      cmsPageId: string;
      cmsPageVersionId: string;
      coverId: string;
      deliveryTimeId: string;
      description: string;
      descriptionTeaser: string;
      displayGroup: string;
      ean: string;
      keywords: string;
      manufacturerId: string;
      manufacturerNumber: string;
      metaDescription: string;
      metaTitle: string;
      name: string;
      ogDescription: string;
      ogTitle: string;
      openGraphMediaId: string;
      packUnit: string;
      packUnitPlural: string;
      parentId: string;
      parentVersionId: string;
      productManufacturerVersionId: string;
      productMediaVersionId: string;
      productNumber: string;
      releaseDate: string;
      taxId: string;
      type: string;
      unitId: string;
      versionId: string;
    };
    /**
     * The type of the product, e.g., physical or digital.
     * @enum {string}
     */
    type: "physical" | "digital";
    /** Product unit of measure (e.g., piece, liter, kg) */
    unit?: components["schemas"]["Unit"];
    /** Unique identity of the unit. */
    unitId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    variantListingConfig?: {
      displayParent?: boolean;
    } | null;
    versionId?: string;
    /**
     * Format: float
     * The weight of the product.
     */
    weight?: number;
    /**
     * Format: float
     * The width of the product.
     */
    width?: number;
  };
  ProductConfiguratorSetting: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    media?: components["schemas"]["Media"];
    /** Unique identity of media. */
    mediaId?: string;
    option?: components["schemas"]["PropertyGroupOption"];
    /** Unique identity of option. */
    optionId: string;
    /**
     * Format: int64
     * The order of the tabs of your defined product configuration settings in the storefront by entering numerical values like 1,2,3, etc.
     */
    position?: number;
    /** Unique identity of product. */
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  ProductCrossSelling: {
    /** When set to active, the cross-selling feature is enabled. */
    active?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    id: string;
    /**
     * Format: int64
     * The maximum number of products to be displayed in cross-selling on the item detail page of your item.
     */
    limit?: number;
    name: string;
    /**
     * Format: int64
     * The order of the tabs of your defined cross-selling actions in the storefront by entering numerical values like 1,2,3, etc.
     */
    position?: number;
    /** To sort the display of products by name, price or publication (descending, ascending) date. */
    sortBy?: string;
    /** To sort the display of products by ascending or descending order. */
    sortDirection?: string;
    translated: {
      name: string;
      sortBy: string;
      sortDirection: string;
      type: string;
    };
    /** Type of product assignment for cross-selling. It can either be Dynamic product group or Manual assignment. */
    type?: string;
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
    customFields?: CustomFields | null;
    id: string;
    media?: components["schemas"]["Media"];
    /** Unique identity of media. */
    mediaId: string;
    /**
     * Format: int64
     * The order in which the digital products are downloaded, like 1,2,3, etc.to adjust their order of display.
     */
    position?: number;
    product?: components["schemas"]["Product"];
    /** Unique identity of Product. */
    productId: string;
    productVersionId?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
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
  ProductJsonApi: unknown &
    unknown &
    components["schemas"]["resource"] & {
      /** When boolean value is `true`, the products are available for selection in the storefront for purchase. */
      active?: boolean;
      /** Indicates weather the product is available or not. */
      readonly available?: boolean;
      /**
       * Format: int64
       * Indicates the number of products still available. This value results from the stock minus the open orders.
       */
      readonly availableStock?: number;
      calculatedCheapestPrice?: GenericRecord;
      /**
       * Format: int64
       * Runtime field, cannot be used as part of the criteria.
       */
      calculatedMaxPurchase?: number;
      calculatedPrice?: GenericRecord;
      calculatedPrices?: GenericRecord[];
      /** Unique identity of canonical product. */
      canonicalProductId?: string;
      canonicalProductVersionId?: string;
      readonly categoryIds?: string[];
      readonly categoryTree?: string[];
      /** Format: int64 */
      readonly childCount?: number;
      /** Unique identity of CMS page. */
      cmsPageId?: string;
      cmsPageVersionId?: string;
      /** Unique identity of a ProductMedia item used as product cover. */
      coverId?: string;
      /** Format: date-time */
      readonly createdAt?: string;
      customFields?: CustomFields | null;
      /** Unique identity of delivery time. */
      deliveryTimeId?: string;
      description?: string;
      /** Read-only, HTML-stripped excerpt of the description, derived on write. */
      readonly descriptionTeaser?: string;
      /** Runtime field, cannot be used as part of the criteria. */
      readonly displayGroup?: string;
      /** Indicates EAN of the product. */
      ean?: string;
      /**
       * Format: float
       * The height of the product.
       */
      height?: number;
      id: string;
      /** When the value is set to true, the product is hidden when sold out. */
      isCloseout?: boolean;
      /** Runtime field, cannot be used as part of the criteria. */
      isNew?: boolean;
      keywords?: string;
      /**
       * Format: float
       * The length of the product.
       */
      length?: number;
      /** Unique identity of the manufacturer. */
      manufacturerId?: string;
      /** Unique number that describes the manufacturer. */
      manufacturerNumber?: string;
      /** Indicates weather the product is top seller or not. */
      markAsTopseller?: boolean;
      /**
       * Format: int64
       * Maximum number of items that can be purchased.
       */
      maxPurchase?: number;
      measurements?: GenericRecord;
      metaDescription?: string;
      metaTitle?: string;
      /**
       * Format: int64
       * Minimum number of items that can be purchased.
       */
      minPurchase?: number;
      name: string;
      ogDescription?: string;
      ogTitle?: string;
      /** Media used as Open Graph image for social media sharing. */
      openGraphMediaId?: string;
      readonly optionIds?: string[];
      packUnit?: string;
      packUnitPlural?: string;
      parentId?: string;
      parentVersionId?: string;
      productManufacturerVersionId?: string;
      productMediaVersionId?: string;
      /** Unique number assigned to individual products. Define rules for automatic assignment of every product creation as per your number range. */
      productNumber: string;
      readonly propertyIds?: string[];
      /**
       * Format: int64
       * Specifies the scales in which the item is to be offered. For example, a scale of 2 means that your customers can purchase 2, 4, 6 products, etc., but not 1, 3 or 5.
       */
      purchaseSteps?: number;
      /**
       * Format: float
       * Quantity of the item purchased. For example, 500ml, 2kg, etc.
       */
      purchaseUnit?: number;
      /**
       * Format: float
       * Average of all the ratings.
       */
      readonly ratingAverage?: number;
      /**
       * Format: float
       * Price of purchased item calculated as per the reference unit. Say, you bought 500ml of milk and the price is calculated in reference to 1000ml.
       */
      referenceUnit?: number;
      relationships?: {
        /** Canonical product reference for variant consolidation and SEO purposes */
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
        /** Categories this product is assigned to */
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
        /** Read-only category tree including all parent categories for optimized queries */
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
        /** Product variants that inherit from this parent product */
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
        /** Custom CMS page layout for the product detail page */
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
        /** Variant configurator settings defining available options for product variants */
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
        /** Main product image displayed in listings and detail pages */
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
        /** Cross-selling configurations (related products, accessories, similar items) */
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
        /** Estimated delivery time for the product */
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
        /** Downloadable files associated with the product (e.g., manuals, digital content) */
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
        /** Primary category assignments per sales channel for SEO and navigation */
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
        /** Product manufacturer or brand information */
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
        /** Product images and media gallery */
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
        /** Open Graph image for social media sharing */
        openGraphMedia?: {
          data?: {
            /** @example bbda52d941a3452369a00f2880f4f358 */
            id?: string;
            /** @example media */
            type?: string;
          };
          links?: {
            /**
             * Format: uri-reference
             * @example /product/deb10517653c255364175796ace3553f/openGraphMedia
             */
            related?: string;
          };
        };
        /** Product variant options (e.g., size, color) that define different variants */
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
        /** Unique identity of the product. */
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
        /** Customer reviews and ratings for the product */
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
        /** Product properties and characteristics for filtering */
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
        /** Main category used for SEO URL generation in the current sales channel */
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
        /** SEO-friendly URLs for the product across different sales channels */
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
        /** Dynamic product streams this product belongs to based on defined filters */
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
        /** Tags for organizing and filtering products */
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
        /** Tax configuration (rate and calculation rules) */
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
        /** Product unit of measure (e.g., piece, liter, kg) */
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
      /**
       * Format: date-time
       * The release date of a product or product model. This can be used to distinguish the exact variant of a product.
       */
      releaseDate?: string;
      /**
       * Format: int64
       * The restock time in days indicates how long it will take until a sold out item is back in stock.
       */
      restockTime?: number;
      /**
       * Format: int64
       * Frequency of the product sales.
       */
      readonly sales?: number;
      /** Indicates weather the shipping price is free or not. */
      shippingFree?: boolean;
      sortedProperties?: GenericRecord;
      /** @deprecated */
      readonly states?: string[];
      /**
       * Format: int64
       * Indicates the number of products available.
       */
      stock: number;
      readonly streamIds?: string[];
      readonly tagIds?: string[];
      /** Unique identity of tax. */
      taxId: string;
      translated: {
        canonicalProductId: string;
        canonicalProductVersionId: string;
        cmsPageId: string;
        cmsPageVersionId: string;
        coverId: string;
        deliveryTimeId: string;
        description: string;
        descriptionTeaser: string;
        displayGroup: string;
        ean: string;
        keywords: string;
        manufacturerId: string;
        manufacturerNumber: string;
        metaDescription: string;
        metaTitle: string;
        name: string;
        ogDescription: string;
        ogTitle: string;
        openGraphMediaId: string;
        packUnit: string;
        packUnitPlural: string;
        parentId: string;
        parentVersionId: string;
        productManufacturerVersionId: string;
        productMediaVersionId: string;
        productNumber: string;
        releaseDate: string;
        taxId: string;
        type: string;
        unitId: string;
        versionId: string;
      };
      /**
       * The type of the product, e.g., physical or digital.
       * @enum {string}
       */
      type?: "physical" | "digital";
      /** Unique identity of the unit. */
      unitId?: string;
      /** Format: date-time */
      readonly updatedAt?: string;
      versionId?: string;
      /**
       * Format: float
       * The weight of the product.
       */
      weight?: number;
      /**
       * Format: float
       * The width of the product.
       */
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
    /** @constant */
    apiAlias: "product_listing";
    /** Contains the available sorting. These can be used to show a sorting select-box in the product listing. */
    availableSortings: {
      /** @constant */
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
    customFields?: CustomFields | null;
    description?: string;
    id: string;
    link?: string;
    media?: components["schemas"]["Media"];
    /** Unique identity of the media. */
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
  ProductMeasurements: {
    height?: {
      /**
       * @default mm
       * @enum {string}
       */
      unit?: "mm" | "cm" | "m" | "in" | "ft";
      value?: number;
    };
    length?: {
      /**
       * @default mm
       * @enum {string}
       */
      unit?: "mm" | "cm" | "m" | "in" | "ft";
      value?: number;
    };
    weight?: {
      /**
       * @default kg
       * @enum {string}
       */
      unit?: "g" | "kg" | "oz" | "lb";
      value?: number;
    };
    width?: {
      /**
       * @default mm
       * @enum {string}
       */
      unit?: "mm" | "cm" | "m" | "in" | "ft";
      value?: number;
    };
  };
  ProductMedia: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id: string;
    media: components["schemas"]["Media"];
    /** Unique identity of the media. */
    mediaId: string;
    /**
     * Format: int64
     * The order of the images to be displayed for a product.
     */
    position?: number;
    /** Unique identity of the product. */
    productId: string;
    productVersionId?: string;
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
  ProductPurchaseLimit: {
    /** @constant */
    apiAlias: "product_purchase_limit";
    /** Maximum quantity a customer can purchase, reflecting current stock for closeout products. */
    maxPurchase: number;
    /** Minimum quantity a customer can purchase. */
    minPurchase: number;
    /** The product ID. */
    productId: string;
    /** Step increment for quantity selection. */
    purchaseSteps: number;
    /** Current stock level of the product. */
    stock: number | null;
  };
  ProductReview: {
    /** Detailed review about the product. */
    comment?: string;
    /** Short description or subject of the project review. */
    content: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** External user name. */
    externalUser?: string;
    id: string;
    /** Unique identity of the language. */
    languageId: string;
    /**
     * Format: float
     * A floating point number given to rate a product.
     */
    points?: number;
    /** Unique identity of the product. */
    productId: string;
    productVersionId?: string;
    /** Unique identity of the sales channel. */
    salesChannelId: string;
    /** When status is set, the rating is made visible. */
    status?: boolean;
    /** Title of product review. */
    title: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  ProductStream: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    description?: string;
    /** When enabled, matching variants are grouped according to the product presentation setting. Disable to show them individually. */
    displayAsGroup?: boolean;
    id: string;
    /** When the boolean value is `true` indicating that it is for internal use only and will not appear in product stream listings. */
    internal?: boolean;
    name: string;
    translated: {
      description: string;
      name: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  PropertyGroup: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    description?: string;
    /** Property groups can be displayed in the form of text, image, dropdown or color. */
    displayType?: string;
    /** When set to true, the property will be displayed in the product filter of product lists. */
    filterable?: boolean;
    id: string;
    name: string;
    options?: components["schemas"]["PropertyGroupOption"][];
    /** Format: int64 */
    position?: number;
    /** Sorting the property group by name or position. */
    sortingType?: string;
    translated: {
      description: string;
      displayType: string;
      name: string;
      sortingType: string;
    };
    /** Format: date-time */
    readonly updatedAt?: string;
    /** When set to true, the property groups are displayed on product detail page. */
    visibleOnProductDetailPage?: boolean;
  };
  PropertyGroupOption: {
    /** Property group options can be displayed in the form of color. For example: #98e3f5ff. */
    colorHexCode?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    combinable?: boolean;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    group: components["schemas"]["PropertyGroup"];
    /** Unique identity of property group. */
    groupId: string;
    id: string;
    media?: components["schemas"]["Media"];
    /** Unique identity of media. */
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
    customFields?: CustomFields | null;
    deliveries?: components["schemas"]["QuoteDelivery"][];
    discount?: {
      type?: string;
      /** Format: float */
      value?: number;
    };
    displayState?: {
      adminState?: string;
      storefrontState?: string;
    };
    documents?: components["schemas"]["QuoteDocument"][];
    /** Format: date-time */
    expirationDate?: string;
    extensions?: {
      organization?: {
        data?: {
          /** @example b4c1948c087fafc89a88450fcbb64c77 */
          id?: string;
          /** @example b2b_components_organization */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /quote/c48e929b2b1eabba2ba036884433345e/organization
           */
          related?: string;
        };
      };
      organizationId?: string;
    };
    histories?: components["schemas"]["QuoteHistory"][];
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lineItems?: components["schemas"]["QuoteLineItem"][];
    notificationEmployees?: components["schemas"]["B2bEmployee"][];
    notificationRecipients?: {
      /** Format: date-time */
      createdAt?: string;
      id?: string;
      /** Format: date-time */
      updatedAt?: string | null;
    }[];
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
    /** Format: date-time */
    quoteCreatedAt?: string;
    quoteNumber?: string;
    /** Format: date-time */
    requestedAt?: string;
    salesChannelId: string;
    sendNotification?: boolean;
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
    stateMachineState?: components["schemas"]["StateMachineState"];
    /** Format: float */
    subtotalNet?: number;
    readonly taxStatus?: string;
    /** Format: float */
    totalDiscount?: number;
    /** Format: float */
    totalLineItemDiscount?: number;
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
    employee?: components["schemas"]["B2bEmployee"];
    employeeId?: string;
    id: string;
    lineItem?: components["schemas"]["QuoteLineItem"];
    quoteId: string;
    quoteLineItemId?: string;
    quoteLineItemVersionId?: string;
    quoteVersionId?: string;
    /** Format: date-time */
    seenAt?: string;
    /** @deprecated */
    stateId?: string;
    stateMachineState?: components["schemas"]["StateMachineState"];
    /** Format: date-time */
    readonly updatedAt?: string;
    versionId?: string;
  };
  QuoteDelivery: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
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
    customFields?: CustomFields | null;
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
    customFields?: CustomFields | null;
    deepLinkCode: string;
    documentA11yMediaFile?: components["schemas"]["Media"];
    documentA11yMediaFileId?: string;
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
  QuoteHistory: {
    /** Action represented by this quote history entry. */
    action: string;
    changes?: GenericRecord;
    /** Comment linked to this quote history entry. */
    comment?: components["schemas"]["QuoteComment"];
    /** Unique identity of the related quote comment. */
    commentId?: string;
    /** Version identifier of the related quote comment. */
    commentVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Admin user reference returned on commercial associations. */
    createdBy?: components["schemas"]["User"];
    /** Unique identity of the user who created the history entry. */
    createdById?: string;
    /** Customer who created this quote history entry. */
    customer?: components["schemas"]["Customer"];
    /** Unique identity of the customer who created the history entry. */
    customerId?: string;
    /** Employee who created this quote history entry. */
    employee?: components["schemas"]["B2bEmployee"];
    /** Unique identity of the employee who created the history entry. */
    employeeId?: string;
    id: string;
    /** Marks whether this quote history entry has been resolved. */
    isResolved?: boolean;
    /** Quote associated with this history entry. */
    quote?: components["schemas"]["Quote"];
    /** Unique identity of the related quote. */
    quoteId: string;
    /** Version identifier of the related quote. */
    quoteVersionId?: string;
    /**
     * Format: date-time
     * Timestamp when this quote history entry was seen.
     */
    seenAt?: string;
    /**
     * Format: date-time
     * Timestamp when this quote history entry was sent.
     */
    sentAt?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Version identifier of the quote history entity. */
    versionId?: string;
  };
  QuoteLineItem: {
    children: components["schemas"]["QuoteLineItem"][];
    comments?: components["schemas"]["QuoteComment"][];
    cover?: components["schemas"]["Media"];
    coverId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Format: date-time */
    deletedAt?: string;
    deliveryPositions?: components["schemas"]["QuoteDeliveryPosition"][];
    description?: string;
    discount?: {
      type?: string;
      /** Format: int64 */
      value?: number;
    };
    good?: boolean;
    histories?: components["schemas"]["QuoteLineItemHistory"][];
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
    /** Format: float */
    requestedPrice?: number;
    stackable?: boolean;
    /** @deprecated */
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
  QuoteLineItemHistory: {
    /** Action represented by this quote line item history entry. */
    action: string;
    changes?: GenericRecord;
    /** Child quote line item history entries replying to this entry. */
    children?: components["schemas"]["QuoteLineItemHistory"][];
    /** Comment linked to this quote line item history entry. */
    comment?: components["schemas"]["QuoteComment"];
    /** Unique identity of the related quote comment. */
    commentId?: string;
    /** Version identifier of the related quote comment. */
    commentVersionId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Unique identity of the user who created the history entry. */
    createdById?: string;
    /** Unique identity of the customer who created the history entry. */
    customerId?: string;
    /** Unique identity of the employee who created the history entry. */
    employeeId?: string;
    id: string;
    /** Marks whether this is the current history state for the quote line item. */
    isCurrent?: boolean;
    /** Marks whether this quote line item history entry has been resolved. */
    isResolved?: boolean;
    /** Parent quote line item history entry this reply belongs to. */
    parent?: components["schemas"]["QuoteLineItemHistory"];
    /** Unique identity of the parent quote line item history entry. */
    parentId?: string;
    /** Version identifier of the parent quote line item history entry. */
    parentVersionId?: string;
    /** Quote line item associated with this history entry. */
    quoteLineItem?: components["schemas"]["QuoteLineItem"];
    /** Unique identity of the related quote line item. */
    quoteLineItemId: string;
    /** Version identifier of the related quote line item. */
    quoteLineItemVersionId?: string;
    /**
     * Format: date-time
     * Timestamp when this quote line item history entry was seen.
     */
    seenAt?: string;
    /**
     * Format: date-time
     * Timestamp when this quote line item history entry was sent.
     */
    sentAt?: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Version identifier of the quote line item history entity. */
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
    customFields?: CustomFields | null;
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
    /** @constant */
    apiAlias?: "cart_price_reference";
    hasRange: boolean;
    listPrice: components["schemas"]["ListPrice"] | null;
    price?: number;
    purchaseUnit?: number;
    referenceUnit?: number;
    regulationPrice: {
      /** @constant */
      apiAlias?: "cart_regulation_price";
      price?: number;
    } | null;
    unitName: string;
    variantId?: string | null;
  };
  Rule: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Description of the rule. */
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
    /** Name of the rule defined. */
    name: string;
    /** Format: date-time */
    readonly updatedAt?: string;
  };
  SaasAppStorefrontConfig: {
    appId: string;
    appVersion: string;
    assetPaths?: string[];
    author?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    extensions?: GenericRecord;
    id: string;
    isTheme?: boolean;
    name?: string;
    previewMedia?: string;
    scriptFiles?: GenericRecord;
    storefrontEntryPath?: string;
    styleFiles?: GenericRecord;
    technicalName: string;
    themeConfig?: GenericRecord;
    themeJson?: GenericRecord;
    /** Format: date-time */
    readonly updatedAt?: string;
    viewInheritance?: string[];
  };
  SalesChannel: {
    /** When boolean value is `true`, the sales channel is enabled. */
    active?: boolean;
    /** Business timezone used for sales-channel-specific rendering. Added since version: 6.7.13.0. */
    businessTimeZone?: string;
    configuration?: GenericRecord;
    /** Default country for the sales channel */
    country?: components["schemas"]["Country"];
    /** Unique identity of country. */
    countryId: string;
    /** Format: date-time */
    readonly createdAt?: string;
    /** Default currency for the sales channel */
    currency?: components["schemas"]["Currency"];
    /** Unique identity of currency used. */
    currencyId: string;
    /** Unique identity of customer group. */
    customerGroupId: string;
    customFields?: CustomFields | null;
    /** Domain URLs configured for the sales channel */
    domains?: components["schemas"]["SalesChannelDomain"][];
    /** Root category for footer navigation */
    footerCategory?: components["schemas"]["Category"];
    /** Unique identity of footer category. */
    footerCategoryId?: string;
    footerCategoryVersionId?: string;
    /** When set to true, the sales channel pages are available in different languages. */
    hreflangActive?: boolean;
    hreflangDefaultDomain?: components["schemas"]["SalesChannelDomain"];
    /** Unique identity of hreflangDefaultDomain. */
    hreflangDefaultDomainId?: string;
    id: string;
    /** Default language for the sales channel */
    language?: components["schemas"]["Language"];
    /** Unique identity of language used. */
    languageId: string;
    /** Unique identity of mail header and footer. */
    mailHeaderFooterId?: string;
    /** When `true`, it indicates that the sales channel is undergoing maintenance, and shopping is temporarily unavailable during this period. */
    maintenance?: boolean;
    measurementUnits?: components["schemas"]["MeasurementUnits"];
    name: string;
    /** Root category for navigation menu */
    navigationCategory?: components["schemas"]["Category"];
    /**
     * Format: int64
     * It determines the number of levels of subcategories in the storefront category menu.
     */
    navigationCategoryDepth?: number;
    /** Unique identity of navigation category. */
    navigationCategoryId: string;
    navigationCategoryVersionId?: string;
    /** Default payment method for the sales channel */
    paymentMethod?: components["schemas"]["PaymentMethod"];
    /** Unique identity of payment method used. */
    paymentMethodId: string;
    /** Root category for service pages */
    serviceCategory?: components["schemas"]["Category"];
    /** Unique identity of service category. */
    serviceCategoryId?: string;
    serviceCategoryVersionId?: string;
    /** Default shipping method for the sales channel */
    shippingMethod?: components["schemas"]["ShippingMethod"];
    /** Unique identity of shipping method. */
    shippingMethodId: string;
    /** A short name for sales channel. */
    shortName?: string;
    /** Tax calculation types are `horizontal` and `vertical`. */
    taxCalculationType?: string;
    translated: {
      businessTimeZone: string;
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
  SalesChannelContext: {
    /** @constant */
    apiAlias: "sales_channel_context";
    /** Core context with general configuration values and state */
    context?: {
      currencyFactor?: number;
      currencyId?: string;
      /** Format: int32 */
      currencyPrecision?: number;
      languageIdChain?: string[];
      scope?: string;
      source?: {
        salesChannelId: string;
        /** @enum {string} */
        type: "sales-channel" | "shop-api";
      };
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
    customer?: null | components["schemas"]["Customer"];
    /** Fallback group if the default customer group is not applicable */
    fallbackCustomerGroup?: {
      displayGross?: boolean;
      name?: string;
    };
    itemRounding: {
      /** @constant */
      apiAlias: "shopware_core_framework_data_abstraction_layer_pricing_cash_rounding_config";
      /** Format: int32 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
    languageInfo: {
      localeCode: string;
      name: string;
    };
    measurementSystem?: components["schemas"]["ContextMeasurementSystemInfo"];
    paymentMethod?: components["schemas"]["PaymentMethod"];
    salesChannel: components["schemas"]["SalesChannel"];
    shippingLocation?: {
      address?: components["schemas"]["CustomerAddress"];
      /** @constant */
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
    totalRounding: {
      /** @constant */
      apiAlias: "shopware_core_framework_data_abstraction_layer_pricing_cash_rounding_config";
      /** Format: int32 */
      decimals: number;
      /** Format: float */
      interval: number;
      roundForNet: boolean;
    };
  };
  SalesChannelDomain: {
    /** Format: date-time */
    readonly createdAt?: string;
    currency?: components["schemas"]["Currency"];
    /** Unique identity of currency. */
    currencyId: string;
    customFields?: CustomFields | null;
    /** This is used to toggle the language configurations, say between DE and DE-DE for instance. */
    hreflangUseOnlyLocale?: boolean;
    id: string;
    language?: components["schemas"]["Language"];
    /** Unique identity of language used. */
    languageId: string;
    measurementUnits?: components["schemas"]["MeasurementUnits"];
    salesChannelDefaultHreflang?: components["schemas"]["SalesChannel"];
    /** Unique identity of sales channel. */
    salesChannelId: string;
    /** Unique identity of snippet set. */
    snippetSetId: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** URL of the sales channel domain. */
    url: string;
  };
  Salutation: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    displayName: string;
    id: string;
    letterName: string;
    /**
     * Format: int64
     * Numerical value that indicates the order in which the defined salutations must be displayed in the frontend.
     */
    position?: number;
    /** Technical name given to salutation. For example: mr */
    salutationKey: string;
    translated: {
      displayName: string;
      letterName: string;
      salutationKey: string;
    };
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
  SearchByImageSearchTermResponse: {
    /** @enum {string} */
    apiAlias: "product_image_upload_search_term";
    extensions?: GenericRecord[];
    term: string;
  }[];
  SeoUrl: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Runtime field, cannot be used as part of the criteria. */
    error?: string;
    /** The key that references to product or category entity ID. */
    foreignKey: string;
    id: string;
    /** When set to true, search redirects to the main URL. */
    isCanonical?: boolean;
    /** When set to true, the URL is deleted and cannot be used any more but it is still available on table and can be restored later. */
    isDeleted?: boolean;
    /** When boolean value is `true`, the seo url is changed. */
    isModified?: boolean;
    /** Unique identity of language. */
    languageId: string;
    /** Path to product URL. For example: \\"/detail/bbf36734504741c79a3bbe3795b91564\\" */
    pathInfo: string;
    /**
     * A destination routeName that has been registered somewhere in the app's router. For example: \\"frontend.detail.page\\"
     * @enum {string}
     */
    routeName:
      | "frontend.navigation.page"
      | "frontend.landing.page"
      | "frontend.detail.page";
    /** Unique identity of sales channel. */
    salesChannelId?: string;
    /** Seo path to product. For example: \\"Pepper-white-ground-pearl/SW10098\\" */
    seoPathInfo: string;
    /** Format: date-time */
    readonly updatedAt?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    url?: string;
  };
  ShippingMethod: {
    /** When boolean value is `true`, the shipping methods are available for selection in the storefront. */
    active?: boolean;
    /** Rule defining when this shipping method is available */
    availabilityRule?: components["schemas"]["Rule"];
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    /** Estimated delivery time information */
    deliveryTime?: components["schemas"]["DeliveryTime"];
    /** Unique identity of deliveryTime. */
    deliveryTimeId: string;
    description?: string;
    id: string;
    /** Shipping method logo or carrier image */
    media?: components["schemas"]["Media"];
    /** Unique identity of media. */
    mediaId?: string;
    name: string;
    /**
     * Format: int64
     * The order of the tabs of your defined shipping methods in the storefront by entering numerical values like 1,2,3, etc.
     */
    position?: number;
    /** Shipping prices based on weight, volume, or cart value */
    prices?: components["schemas"]["ShippingMethodPrice"][];
    /** Tags for organizing shipping methods */
    tags?: components["schemas"]["Tag"][];
    /** Tax configuration for shipping costs */
    tax?: components["schemas"]["Tax"];
    /** Refers `Free`, `Net` or `Gross` type of taxes. */
    taxType?: string;
    technicalName: string;
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
  ShippingMethodPrice: {
    /**
     * Format: int64
     * Shipping price calculated based on quantity, price, weight or volume of items.
     */
    calculation?: number;
    /** Unique identity of rule calculation. */
    calculationRuleId?: string;
    /** Format: date-time */
    readonly createdAt?: string;
    currencyPrice?: components["schemas"]["Price"][];
    customFields?: CustomFields | null;
    id: string;
    /**
     * Format: float
     * Ending range of quantity of an item.
     */
    quantityEnd?: number;
    /**
     * Format: float
     * Starting range of quantity of an item.
     */
    quantityStart?: number;
    /** Unique identity of rule. */
    ruleId?: string;
    /** Unique identity of shipping method. */
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
  SnippetSetResult: {
    /** @constant */
    apiAlias: "snippet_set_result";
    /** Fallback locale prefix used while resolving, e.g. `de`. Null if it equals the locale. */
    fallbackLocale: string | null;
    /** Content hash of the `snippets` map. Also sent as `ETag` response header, so clients can revalidate cheaply via `If-None-Match`. */
    hash: string;
    /** Id of the language the snippets were resolved for. */
    languageId: string;
    /** Locale of the resolved snippet set, e.g. `de-DE`. */
    locale: string;
    /** Flat map of fully resolved snippets, e.g. `{"account.loginTitle": "Log in"}`. Values are never null, the language fallback is already merged. Note: when no snippet matches the requested `prefixes`, the empty map is serialized as an empty JSON list (`[]`). */
    snippets: {
      [key: string]: string;
    };
    /** Id of the snippet set the database overrides were taken from. */
    snippetSetId: string | null;
  };
  Sort: {
    field: string;
    naturalSorting?: boolean;
    /** @enum {string} */
    order: "ASC" | "DESC";
    type?: string;
  };
  StateForAll: {
    accessibleFrom?: string | null;
    accessibleTo?: string | null;
    /** @default false */
    allowScreenSharing?: boolean;
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
  StateMachineState: {
    /** Format: date-time */
    readonly createdAt?: string;
    customFields?: CustomFields | null;
    id?: string;
    name: string;
    /** Technical name of StateMachineState. */
    technicalName: string;
    translated: {
      name: string;
      technicalName: string;
    };
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
    customFields?: CustomFields | null;
    dateInterval: string;
    extensions?: {
      subscriptionBudget?: {
        data?: {
          /** @example 6b2732717e6360e8eccfd947596f4e64 */
          id?: string;
          /** @example b2b_components_subscription_budget */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /subscription/787ad0b7a17de4ad6b1711bbf8d79fcb/subscriptionBudget
           */
          related?: string;
        };
      };
      subscriptionEmployee?: {
        data?: {
          /** @example a4844d7989267e34103e44248b16cf6c */
          id?: string;
          /** @example b2b_components_subscription_employee */
          type?: string;
        };
        links?: {
          /**
           * Format: uri-reference
           * @example /subscription/787ad0b7a17de4ad6b1711bbf8d79fcb/subscriptionEmployee
           */
          related?: string;
        };
      };
    };
    /**
     * Format: date-time
     * Runtime field, cannot be used as part of the criteria.
     */
    followingNextSchedule: string;
    id: string;
    /** Format: int64 */
    initialExecutionCount?: number;
    initialOrder?: components["schemas"]["Order"];
    initialOrderId?: string;
    initialOrderVersionId?: string;
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
    customFields?: CustomFields | null;
    department?: string;
    firstName: string;
    /** Runtime field, cannot be used as part of the criteria. */
    hash?: string;
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
    customFields?: CustomFields | null;
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
    /** Runtime field, cannot be used as part of the criteria. */
    delayed: boolean;
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
  SuccessResponse: {
    success?: boolean;
  };
  SwagCustomizedProductsAddToCartRequest: {
    "customized-products-template": components["schemas"]["SwagCustomizedProductsTemplateConfiguration"];
    lineItems: {
      [key: string]: components["schemas"]["SwagCustomizedProductsLineItem"];
    };
  };
  SwagCustomizedProductsConfigurationShareResponse: {
    /** Format: uri */
    shareUrl: string;
  };
  SwagCustomizedProductsCreateConfigurationShareRequest: components["schemas"]["SwagCustomizedProductsAddToCartRequest"] & {
    /** Format: uri */
    absoluteBaseUrl?: string;
    baseUrl?: string;
    "swag-customized-products-one-time-share"?: boolean;
  };
  SwagCustomizedProductsEntitySearchResult: {
    /** Aggregation result. */
    aggregations?: {
      [key: string]: unknown;
    };
    elements?: {
      [key: string]: unknown;
    }[];
    /** Total amount. */
    total?: number;
  };
  SwagCustomizedProductsLineItem: {
    /** Format: uuid */
    id: string;
    quantity: number;
  };
  SwagCustomizedProductsTemplateConfiguration: {
    /**
     * Format: uuid
     * The template id this configuration is for.
     */
    id: string;
    /** Existing configuration hash to replace in the cart. */
    oldHash?: string;
    /** An object keyed by option id with submitted option values. */
    options?: {
      [key: string]: unknown;
    };
  };
  SwagCustomizedProductsUploadRequest: {
    /**
     * Format: binary
     * The file to upload.
     */
    file: Blob;
    /**
     * Format: uuid
     * Id of the template option.
     */
    optionId: string;
  };
  SwagCustomizedProductsUploadResponse: {
    filename: string;
    /** Format: uuid */
    mediaId: string;
  };
  SwagPaypalVaultToken: {
    id?: string;
    identifier?: string;
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
    customFields?: CustomFields | null;
    id: string;
    /** Name defined for a Tax. */
    name: string;
    /**
     * Format: int64
     * The order of the tabs of your defined taxes in the storefront by entering numerical values like 1,2,3, etc. Added since version: 6.4.0.0.
     */
    position?: number;
    /**
     * Format: float
     * Rate of tax.
     */
    taxRate: number;
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
    customFields?: CustomFields | null;
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
  paypal_agentic_commerce_v1_address: {
    /**
     * The first line of the address, such as number and street, for example, 173 Drury Lane.
     *     Needed for data entry, and Compliance and Risk checks. This field needs to pass the full address.
     */
    address_line_1?: string;
    address_line_2?: string;
    /**
     * The highest-level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision.
     *     This data is formatted for postal delivery, for example, CA and not California. Value, by country, is UK.
     *     A county. US. A state. Canada. A province. Japan. A prefecture. Switzerland. A kanton.
     */
    admin_area_1?: string;
    /** A city, town, or village. Smaller than admin_area_level_1. */
    admin_area_2?: string;
    /** The 2-character ISO 3166-1 alpha-2 country code */
    country_code?: string;
    /**
     * The postal code, which is the ZIP code or equivalent.
     *     Typically required for countries with a postal code or an equivalent. See postal code.
     */
    postal_code?: string;
  };
  paypal_agentic_commerce_v1_agent_error_detail: {
    description: string;
    field: string;
    issue: string;
  };
  paypal_agentic_commerce_v1_applied_coupon: {
    code: string;
    description: string;
    discount_amount: components["schemas"]["paypal_agentic_commerce_v1_money"];
  };
  paypal_agentic_commerce_v1_billing_address: components["schemas"]["paypal_agentic_commerce_v1_address"];
  paypal_agentic_commerce_v1_cart_item: {
    custom_options?: components["schemas"]["paypal_agentic_commerce_v1_referral_custom_option"][];
    /** Product description */
    description?: string;
    gift_options?: components["schemas"]["paypal_agentic_commerce_v1_gift_options"];
    /** Unique product identifier (optional in v1 for backwards compatibility) */
    item_id?: string;
    /** URL for product details page */
    item_url?: string;
    /** Product display name */
    name?: string;
    /** Item grouping identifier - passed when item is part of a group in honey catalog */
    parent_id?: string;
    price: components["schemas"]["paypal_agentic_commerce_v1_money"];
    /** Number of items */
    quantity: number;
    selected_attributes?: components["schemas"]["paypal_agentic_commerce_v1_referral_selected_attribute"][];
    /** Product variant identifier (color, size, etc.) - unique id of the product */
    variant_id?: string;
  };
  paypal_agentic_commerce_v1_cart_totals: {
    custom_charges?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    discount?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    handling?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    insurance?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    shipping?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    shipping_discount?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    subtotal?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    tax?: components["schemas"]["paypal_agentic_commerce_v1_money"];
    total: components["schemas"]["paypal_agentic_commerce_v1_money"];
  };
  paypal_agentic_commerce_v1_checkout_field: {
    /**
     * Additional context and metadata for the checkout field.
     *     This is a flexible object that can contain any field-specific information needed for validation, display, or processing.
     *     The structure varies based on the field type.
     */
    context?: Record<string, never>;
    /**
     * Field completion and validation status:
     *
     *     PENDING: Field needs customer input
     *
     *     Initial state when field is required
     *     AI agent should collect this information
     *     value field is null or empty
     *
     *     COMPLETED: Valid value provided and accepted
     *
     *     Customer provided acceptable input
     *     Value passes all validation rules
     *     Cart can proceed with this field resolved
     *
     *     REJECTED: Invalid or unacceptable value provided
     *
     *     Customer provided input that doesn't meet requirements
     *     validation_issue explains the specific problem
     *     AI agent should request corrected input
     *
     *     ERROR: System error during processing
     *
     *     Technical failure in field processing
     *     Should retry or escalate to support
     *     Not caused by customer input
     * @enum {string}
     */
    status: "PENDING" | "COMPLETED" | "REJECTED" | "ERROR";
    /**
     * PayPal-approved checkout field type
     * @enum {string}
     */
    type:
      | "AGE_VERIFICATION_18_PLUS"
      | "AGE_VERIFICATION_21_PLUS"
      | "GIFT_RECIPIENT_EMAIL"
      | "GIFT_RECIPIENT_NAME"
      | "GIFT_MESSAGE"
      | "DELIVERY_INSTRUCTIONS"
      | "DELIVERY_DATE_PREFERENCE"
      | "ALLERGY_INFORMATION"
      | "CUSTOM_ENGRAVING_TEXT"
      | "CUSTOM_SIZING_INFO"
      | "TERMS_ACCEPTANCE"
      | "PRIVACY_CONSENT";
    validation_issue?: components["schemas"]["paypal_agentic_commerce_v1_validation_issue"];
    /**
     * Structured value based on field type. Each checkout field type has a specific value schema.
     *     Use oneOf to validate against the appropriate structure for the field type.
     */
    value?:
      | components["schemas"]["paypal_agentic_commerce_v1_value_age_verification_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_gift_recipient_email_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_gift_recipient_name_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_gift_message_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_delivery_instructions_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_delivery_date_preference_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_allergy_information_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_custom_engraving_text_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_custom_sizing_info_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_terms_acceptance_value"]
      | components["schemas"]["paypal_agentic_commerce_v1_value_privacy_consent_value"];
  };
  paypal_agentic_commerce_v1_context_business_rule_error_context: {
    /** Customer account status */
    account_status: string;
    /** Required minimum age */
    age_requirement: number;
    /** Quantity requiring approval */
    approval_threshold: number;
    /** Store business hours */
    business_hours: components["schemas"]["paypal_agentic_commerce_v1_referral_business_hour"][];
    /** Support contact information */
    contact_info: string;
    /** Current order amount */
    current_amount: string;
    /** Current month purchase total */
    current_month_total: string;
    /** Amount by which limit is exceeded */
    exceeds_by: string;
    /** When maintenance ends */
    maintenance_end_time: string;
    /** Maximum allowed amount */
    maximum_amount: string;
    /** Monthly purchase limit */
    monthly_limit: string;
    /** Amount needed to meet minimum */
    remaining_amount: string;
    /** Required minimum amount */
    required_amount: string;
    /** When limits reset */
    reset_date: string;
    /** Items with restrictions */
    restricted_items: string[];
    /** Seconds before retry recommended */
    retry_after: number;
    /** Current service status */
    service_status: string;
    /** Amount needed to meet minimum requirements */
    shortage_amount: string;
    /** Specific business rule issue type */
    specific_issue: string;
    /** Date of account suspension */
    suspension_date: string;
    /** Reason for account suspension */
    suspension_reason: string;
    /** Total quantity in bulk order */
    total_quantity: number;
  };
  paypal_agentic_commerce_v1_context_data_error_context: {
    /** List of allowed values for enum fields */
    allowed_values: string[];
    /** Current value length */
    current_length: number;
    /** Expected format description */
    expected_format: string;
    /** Descriptions for required fields */
    field_descriptions: string[];
    /** Name of the field with validation error */
    field_name: string;
    /** Maximum allowed length */
    max_length: number;
    /** Minimum required length */
    min_length: number;
    /** Value that failed validation */
    provided_value: string;
    /** Required regex pattern */
    regex_pattern: string;
    /** List of required field names */
    required_fields: string[];
    /** Specific business rule issue type */
    specific_issue: string;
    /** Suggested corrected value */
    suggested_value: string;
  };
  paypal_agentic_commerce_v1_context_inventory_issue_context: {
    /** Currently available quantity */
    available_quantity: number;
    /** Maximum allowed back-order quantity */
    back_order_limit: number;
    current_back_orders: number;
    discontinuation_date: string;
    /** Estimated shipping date for back-orders */
    estimated_ship_date: string;
    /** Product item identifier */
    item_id: string;
    /** When item was last sold */
    last_sold: string;
    requested_quantity: number;
    /** Quantity reserved for other transactions */
    reserved_quantity: number;
    /** Expected restock date */
    restock_date: string;
    /** When seasonal product becomes available */
    seasonal_start_date: string;
    /** Specific business rule issue type */
    specific_issue: string;
    /** Alternative product IDs */
    suggested_alternatives: string[];
    /** Whether newer version is available */
    upgrade_available: boolean;
    /** Product variant identifier if applicable */
    variant_id: string;
  };
  paypal_agentic_commerce_v1_context_payment_error_context: {
    /** Currency conversion service status */
    conversion_service: string;
    /** Transaction currency */
    currency_code: string;
    /** Reason for payment decline */
    decline_reason: string;
    /** Amount exceeding limit */
    excess_amount: string;
    /** Source currency for conversion */
    from_currency: string;
    /** Minimum payment amount */
    minimum_amount: string;
    /** Total order amount */
    order_total: string;
    /** Maximum payment limit */
    payment_limit: string;
    /** Payment method being used */
    payment_method: string;
    /** Payment token that was declined */
    payment_token: string;
    /** Payment processor specific error code */
    processor_error_code: string;
    /** Specific business rule issue type */
    specific_issue: string;
    /** List of supported payment methods */
    supported_payment_methods: string[];
    /** Target currency for conversion */
    to_currency: string;
  };
  paypal_agentic_commerce_v1_context_pricing_error_context: {
    /** Coupon code with issues */
    coupon_code: string;
    /** Currency code */
    currency_code: string;
    /** Current system date for comparisons */
    current_date: string;
    /** Current price value */
    current_price: string;
    /** Current coupon usage count */
    current_usage: number;
    /** Discount amount that was applied */
    discount_amount: string;
    /** Discount expiration date */
    expiration_date: string;
    /** Multiple currencies found in cart */
    found_currencies: string[];
    /** Item with pricing issue */
    item_id: string;
    /** Minimum order for discount */
    minimum_order_amount: string;
    /** Items with different currencies */
    mixed_items: components["schemas"]["paypal_agentic_commerce_v1_referral_mixed_item"][];
    /** Original price value */
    original_price: string;
    /**
     * Reason for price change
     * @enum {string}
     */
    price_change_reason:
      | "promotional_ended"
      | "promotional_started"
      | "market_adjustment"
      | "cost_increase"
      | "seasonal_pricing"
      | "component_cost_increase"
      | "terms_updated";
    /** Amount of price decrease */
    price_decrease: string;
    /** Amount of price increase */
    price_increase: string;
    /** Whether all items must use same currency */
    required_currency_consistency: boolean;
    /** Specific business rule issue type */
    specific_issue: string;
    /** List of supported currencies */
    supported_currencies: string[];
    /** Tax calculation service error */
    tax_service_error: string;
    /** Coupon usage limit */
    usage_limit: number;
  };
  paypal_agentic_commerce_v1_context_shipping_error_context: {
    /**
     * Format: float
     * Address validation quality score
     */
    address_quality_score: number;
    /** Destination country code */
    destination_country: string;
    /** Whether PO Box was detected */
    po_box_detected: boolean;
    /** Address string that failed validation */
    provided_address: string;
    /** Items with shipping restrictions */
    restricted_items: string[];
    /** Restricted region identifier */
    restricted_region: string;
    /**
     * Reason for shipping restriction
     * @enum {string}
     */
    restriction_reason:
      | "signature_required"
      | "age_verification_required"
      | "export_controlled"
      | "hazardous_material"
      | "oversized_item"
      | "po_box_restriction";
    /** Specific business rule issue type */
    specific_issue: string;
    /** Suggested address corrections */
    suggested_corrections: components["schemas"]["paypal_agentic_commerce_v1_referral_suggested_correction"][];
    /** List of supported countries */
    supported_countries: string[];
    /** Specific address validation failures */
    validation_failures: string[];
  };
  paypal_agentic_commerce_v1_coupon: {
    /**
     * Action to perform on this specific coupon
     * @enum {string}
     */
    action: "APPLY" | "REMOVE";
    /** Coupon code identifier */
    code: string;
  };
  paypal_agentic_commerce_v1_customer: {
    /**
     * The internationalized email address.
     *     Note: Up to 64 characters are allowed before and 255 characters are allowed after the @ sign.
     *     However, the generally accepted maximum length for an email address is 254 characters.
     *     The pattern verifies that an unquoted @ sign exists.
     */
    email_address: string;
    name: components["schemas"]["paypal_agentic_commerce_v1_referral_customer_name"];
    phone: components["schemas"]["paypal_agentic_commerce_v1_phone"];
  };
  paypal_agentic_commerce_v1_error: {
    /** Unique error identifier for support */
    debug_id?: string;
    /** Detailed error information */
    details?: components["schemas"]["paypal_agentic_commerce_v1_agent_error_detail"][];
    /** Error description */
    message: string;
    /** Error name/type */
    name: string;
  };
  paypal_agentic_commerce_v1_geo_coordinates: {
    /** ISO 3166-1 alpha-2 country code for the coordinate location. */
    country_code: string;
    /** Latitude coordinate in decimal degrees (-90 to 90). WGS84 datum. */
    latitude: string;
    /** Longitude coordinate in decimal degrees (-180 to 180). WGS84 datum. */
    longitude: string;
    /**
     * Administrative subdivision code (state, province, region).
     *     ISO 3166-2 format without country prefix (e.g., 'CA' for California, 'ON' for Ontario).
     */
    subdivision: string;
  };
  paypal_agentic_commerce_v1_gift_options: {
    /**
     * Scheduled delivery date in RFC3339 format. Seconds are required while fractional seconds are optional.
     *
     *     example: 2024-12-25T09:00:00Z
     */
    delivery_date: string;
    /** Personal message (max 500 characters) */
    gift_message: string;
    /** Whether to include gift wrapping */
    gift_wrap: boolean;
    /** Whether this is a gift */
    is_gift: boolean;
    recipient: components["schemas"]["paypal_agentic_commerce_v1_referral_recipient"];
    /** Name of gift sender */
    sender_name: string;
  };
  paypal_agentic_commerce_v1_link: {
    /**
     * Target URL for the link
     *
     *     example: https://your-domain.com/api/paypal/v1/merchant-cart/CART-123
     */
    href: string;
    /**
     * HTTP method for the link
     * @enum {string}
     */
    method?: "GET" | "POST" | "PUT";
    /**
     * Link relationship type
     * @enum {string}
     */
    rel: "rel" | "update" | "checkout";
    /** Human-readable description of the link */
    title?: string;
    /** Expected content type */
    type?: string;
  };
  paypal_agentic_commerce_v1_money: {
    /** The 3-character ISO-4217 currency code that identifies the currency. */
    currency_code?: string;
    /** The value, which might be: An integer for currencies like JPY that are not typically fractional. A decimal fraction for currencies like TND that are subdivided into thousandths. For the required number of decimal places for a currency code, see Currency Codes. */
    value: string;
  };
  paypal_agentic_commerce_v1_pay_pal_cart: {
    /** Successfully applied coupons (server-calculated) */
    applied_coupons?: components["schemas"]["paypal_agentic_commerce_v1_applied_coupon"][];
    /** Available shipping methods with selection state */
    available_shipping_options?: components["schemas"]["paypal_agentic_commerce_v1_shipping_option"][];
    billing_address?: components["schemas"]["paypal_agentic_commerce_v1_billing_address"];
    /** Custom checkout fields (age verification, etc.) */
    checkout_fields?: components["schemas"]["paypal_agentic_commerce_v1_checkout_field"][];
    /** Discount coupons to apply or remove from cart */
    coupons?: components["schemas"]["paypal_agentic_commerce_v1_coupon"][];
    customer?: components["schemas"]["paypal_agentic_commerce_v1_customer"];
    geo_coordinates?: components["schemas"]["paypal_agentic_commerce_v1_geo_coordinates"];
    readonly id?: string;
    /** Products in the cart */
    items: components["schemas"]["paypal_agentic_commerce_v1_cart_item"][];
    /** HATEOAS navigation links for cart operations */
    links?: components["schemas"]["paypal_agentic_commerce_v1_link"][];
    payment_method?: components["schemas"]["paypal_agentic_commerce_v1_payment_method"];
    shipping_address?: components["schemas"]["paypal_agentic_commerce_v1_shipping_address"];
    /** @enum {string} */
    readonly status?: "CREATED" | "COMPLETE" | "READY" | "INCOMPLETE";
    totals?: components["schemas"]["paypal_agentic_commerce_v1_cart_totals"];
    /** List of issues preventing checkout (empty = ready) */
    validation_issues?: components["schemas"]["paypal_agentic_commerce_v1_validation_issue"][];
    /** @enum {string} */
    readonly validation_status?:
      | "VALID"
      | "INVALID"
      | "REQUIRES_ADDITIONAL_INFORMATION";
  };
  paypal_agentic_commerce_v1_payment_method: {
    /** URL used to inform merchant that the PayPal buyer approved the order */
    approval_url?: string;
    /** PayPal payer identifier provided after customer approval */
    payer_id?: string;
    /** PayPal payment token from cart creation or customer approval */
    token?: string;
    /**
     * Payment method type - only PayPal is supported by this API
     * @enum {string}
     */
    type: "paypal";
  };
  paypal_agentic_commerce_v1_phone: {
    /**
     * The country calling code (CC), in its canonical international E.164 numbering plan format.
     *     The combined length of the CC and the national number must not be greater than 15 digits.
     *     The national number consists of a national destination code (NDC) and subscriber number (SN)
     */
    country_code?: string;
    /** The extension number */
    extension_number?: string;
    /**
     * The national number, in its canonical international E.164 numbering plan format.
     *     The combined length of the country calling code (CC) and the national number must not be greater than 15 digits.
     *     The national number consists of a national destination code (NDC) and subscriber number (SN).
     */
    national_number?: string;
  };
  paypal_agentic_commerce_v1_referral_business_hour: {
    close_time: string;
    open_time: string;
    timezone: string;
  };
  paypal_agentic_commerce_v1_referral_custom_option: {
    name: string;
    price_modifier: string;
    value: string;
  };
  paypal_agentic_commerce_v1_referral_customer_name: {
    given_name: string;
    surname: string;
  };
  paypal_agentic_commerce_v1_referral_measurements: {
    chest: string;
    height: string;
    waist: string;
    weight: string;
  };
  paypal_agentic_commerce_v1_referral_meta_data: {
    auto_applicable: boolean;
    cost_impact: string;
    estimated_time: string;
    priority: string;
    redirect_required: boolean;
    waist: string;
  };
  paypal_agentic_commerce_v1_referral_mixed_item: {
    currency: string;
    item_id: string;
  };
  paypal_agentic_commerce_v1_referral_recipient: {
    email: string;
    name: string;
    phone: string;
  };
  paypal_agentic_commerce_v1_referral_selected_attribute: {
    name: string;
    value: string;
  };
  paypal_agentic_commerce_v1_referral_suggested_correction: {
    address_line_1: string;
    admin_area_2: string;
    postal_code: string;
  };
  paypal_agentic_commerce_v1_resolution_option: {
    /**
     * Machine-readable action identifier
     * @enum {string}
     */
    action:
      | "REDIRECT_TO_MERCHANT"
      | "MODIFY_CART"
      | "ACCEPT_NEW_PRICE"
      | "ACCEPT_BACK_ORDER"
      | "SUGGEST_ALTERNATIVE"
      | "REMOVE_ITEM"
      | "UPDATE_ADDRESS"
      | "PROVIDE_MISSING_FIELD"
      | "USE_DIFFERENT_PAYMENT"
      | "SPLIT_ORDER"
      | "CONTACT_SUPPORT"
      | "RETRY_LATER"
      | "REQUEST_APPROVAL"
      | "WAIT_FOR_RESTOCK"
      | "USE_DIFFERENT_CURRENCY"
      | "ACCEPT_PRE_ORDER"
      | "UPDATE_SHIPPING_METHOD"
      | "ACCEPT_TERMS"
      | "VERIFY_ACCOUNT"
      | "APPLY_DIFFERENT_COUPON"
      | "REMOVE_COUPON"
      | "CHOOSE_DIFFERENT_VARIANT";
    /** Human-readable action label */
    label: string;
    metadata?: components["schemas"]["paypal_agentic_commerce_v1_referral_meta_data"];
    /** URL to redirect to for resolution */
    url?: string;
  };
  paypal_agentic_commerce_v1_shipping_address: components["schemas"]["paypal_agentic_commerce_v1_address"];
  paypal_agentic_commerce_v1_shipping_option: {
    /** Detailed description */
    description?: string;
    /** Estimated delivery date in YYYY-MM-DD format */
    estimated_delivery?: string;
    /** Unique shipping option identifier */
    id?: string;
    /** Whether this shipping option is currently selected */
    is_selected?: boolean;
    /** Display name */
    name?: string;
    price: components["schemas"]["paypal_agentic_commerce_v1_money"];
  };
  paypal_agentic_commerce_v1_validation_issue: {
    /**
     * Consolidated error category
     * @enum {string}
     */
    code:
      | "INVENTORY_ISSUE"
      | "PRICING_ERROR"
      | "SHIPPING_ERROR"
      | "PAYMENT_ERROR"
      | "DATA_ERROR"
      | "BUSINESS_RULE_ERROR";
    /** Category-specific context information */
    context?:
      | (
          | components["schemas"]["paypal_agentic_commerce_v1_context_inventory_issue_context"]
          | components["schemas"]["paypal_agentic_commerce_v1_context_pricing_error_context"]
          | components["schemas"]["paypal_agentic_commerce_v1_context_shipping_error_context"]
          | components["schemas"]["paypal_agentic_commerce_v1_context_payment_error_context"]
          | components["schemas"]["paypal_agentic_commerce_v1_context_data_error_context"]
          | components["schemas"]["paypal_agentic_commerce_v1_context_business_rule_error_context"]
        )
      | null;
    /** Specific field name if the issue is field-specific */
    field?: string;
    /** Specific item ID if the issue is item-specific */
    item_id?: string;
    /** Technical message for developers and logging */
    message: string;
    /** Available actions to resolve this issue */
    resolution_options?: components["schemas"]["paypal_agentic_commerce_v1_resolution_option"][];
    /**
     * Type classification for error handling
     * @enum {string}
     */
    type: "MISSING_FIELD" | "INVALID_DATA" | "BUSINESS_RULE";
    /** Customer-friendly message for end users */
    user_message?: string;
  };
  paypal_agentic_commerce_v1_value_age_verification_value: {
    /** Whether age verification was confirmed */
    confirmed: boolean;
    /** When verification was completed */
    verificationDate?: string;
    /**
     * Method used for age verification
     * @enum {string}
     */
    verificationMethod?: "self_declaration" | "id_verification" | "third_party";
  };
  paypal_agentic_commerce_v1_value_allergy_information_value: {
    /** List of known allergies */
    allergies: string[];
    /**
     * Emergency contact information
     *
     *     example: +1-555-999-8888
     */
    emergency_contact: string;
    /** Medications to avoid */
    medications: string[];
    /**
     * Allergy severity level
     * @enum {string}
     */
    severity: "life_threatening" | "mild" | "moderate" | "severe";
  };
  paypal_agentic_commerce_v1_value_custom_engraving_text_value: {
    /**
     * Preferred font style
     * @enum {string}
     */
    font?: "arial" | "times" | "script" | "block";
    /**
     * Engraving position
     * @enum {string}
     */
    position?: "front" | "back" | "side" | "bottom";
    /**
     * Text size preference
     * @enum {string}
     */
    size?: "small" | "medium" | "large";
    /** Text to be engraved */
    text: string;
  };
  paypal_agentic_commerce_v1_value_custom_sizing_info_value: {
    measurements: components["schemas"]["paypal_agentic_commerce_v1_referral_measurements"];
    /**
     * Fit preference
     * @enum {string}
     */
    size_preference: "tight" | "regular" | "loose";
    /** Special sizing requirements */
    special_requirements: string;
  };
  paypal_agentic_commerce_v1_value_delivery_date_preference_value: {
    /** Preferred delivery date */
    preferred_date: string;
    /** Specific preferred time (HH:MM format) */
    specific_time: string;
    /**
     * Preferred time window
     * @enum {string}
     */
    time_window: "morning" | "afternoon" | "evening" | "anytime";
  };
  paypal_agentic_commerce_v1_value_delivery_instructions_value: {
    /** Building or gate access code */
    access_code?: string;
    /** Contact phone for delivery */
    contact_phone?: string;
    /** Special delivery instructions */
    instructions: string;
  };
  paypal_agentic_commerce_v1_value_gift_message_value: {
    /** Personal message for the recipient */
    message: string;
    /** Name of the person sending the gift */
    sender_name?: string;
  };
  paypal_agentic_commerce_v1_value_gift_recipient_email_value: {
    /** Recipient's email address */
    email: string;
    /** Whether email was verified */
    verified?: boolean;
  };
  paypal_agentic_commerce_v1_value_gift_recipient_name_value: {
    /** Recipient's first name */
    first_name?: string;
    /** Recipient's last name */
    last_name?: string;
    /** Recipient's full name */
    name: string;
  };
  paypal_agentic_commerce_v1_value_privacy_consent_value: {
    /** When consent was given */
    consent_date?: string;
    /**
     * Types of consent given
     * @enum {array}
     */
    consent_types?:
      | "analytics"
      | "third_party_sharing"
      | "data_processing"
      | "marketing";
    /** Whether privacy policy was consented to */
    consented: boolean;
    /** Privacy policy version */
    policy_version?: string;
  };
  paypal_agentic_commerce_v1_value_terms_acceptance_value: {
    /** When terms were accepted */
    acceptance_date?: string;
    /** Whether terms were accepted */
    accepted: boolean;
    /** IP address of acceptance */
    ip_address?: string;
    /** Version of terms accepted */
    terms_versions?: string;
  };
  paypal_error: {
    debug_id: string | null;
    details: components["schemas"]["paypal_error_detail"][] | null;
    /** Only set if OAuth error occurs */
    error: string | null;
    /** Only set if OAuth error occurs */
    error_description: string | null;
    links: components["schemas"]["paypal_v1_common_link"][] | null;
    message: string | null;
    name: string | null;
  };
  paypal_error_detail: {
    description: string;
    field: string;
    issue: string;
    location: string;
    value: string;
  };
  paypal_v1_capture: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    id: string;
    is_final_capture: boolean;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    reason_code: string;
    state: string;
    transaction_fee: components["schemas"]["paypal_v1_capture_transaction_fee"];
    update_time: string;
  };
  paypal_v1_capture_transaction_fee: components["schemas"]["paypal_v1_common_value"];
  paypal_v1_client_token: {
    client_token: string;
    /**
     * Format: date-time
     * Calculated expiration date
     */
    expire_date_time: string;
    /** The lifetime of the access token, in seconds. */
    expires_in: number;
  };
  paypal_v1_common_address: {
    city: string;
    country_code: string;
    line_1: string;
    line_2: string | null;
    phone: string | null;
    postal_code: string;
    state: string | null;
  };
  paypal_v1_common_amount: {
    currency: string;
    details: components["schemas"]["paypal_v1_common_details"];
    total: string;
  };
  paypal_v1_common_details: {
    discount: string;
    handling_fee: string;
    insurance: string;
    shipping: string;
    shipping_discount: string;
    subtotal: string;
    tax: string;
  };
  paypal_v1_common_link: {
    enc_type: string | null;
    href: string;
    method: string;
    rel: string;
  };
  paypal_v1_common_money: {
    currency_code: string;
    value: string;
  };
  paypal_v1_common_value: {
    currency: string;
    value: string;
  };
  paypal_v1_disputes: {
    items: components["schemas"]["paypal_v1_disputes_item"][] | null;
    links: components["schemas"]["paypal_v1_common_link"][];
  };
  paypal_v1_disputes_common_buyer: {
    name: string;
  };
  paypal_v1_disputes_common_item: {
    dispute_amount: components["schemas"]["paypal_v1_common_money"];
    item_description: string;
    item_id: string;
    item_quantity: string;
    notes: string;
    partner_transaction_id: string;
    reason: string;
  };
  paypal_v1_disputes_common_product_details: {
    product_received: string;
    product_received_time: string;
    purchase_url: string;
    return_details: components["schemas"]["paypal_v1_disputes_common_return_details"];
    sub_reasons: components["schemas"]["paypal_v1_disputes_common_sub_reason"][];
  };
  paypal_v1_disputes_common_return_details: {
    mode: string;
    receipt: boolean;
    return_confirmation_number: string;
    return_time: string;
    returned: boolean;
  };
  paypal_v1_disputes_common_seller: {
    email: string;
    merchant_id: string;
    name: string;
  };
  paypal_v1_disputes_common_service_details: {
    description: string;
    note: string;
    purchase_url: string;
    service_started: string;
    sub_reasons: components["schemas"]["paypal_v1_disputes_common_sub_reason"][];
  };
  paypal_v1_disputes_common_sub_reason: {
    sub_reason: string;
  };
  paypal_v1_disputes_common_transaction: {
    buyer: components["schemas"]["paypal_v1_disputes_common_buyer"];
    buyer_transaction_id: string;
    create_time: string;
    custom: string;
    gross_amount: components["schemas"]["paypal_v1_common_money"];
    invoice_number: string;
    items: components["schemas"]["paypal_v1_disputes_common_item"][];
    reference_id: string;
    seller: components["schemas"]["paypal_v1_disputes_common_seller"];
    seller_transaction_id: string;
    transaction_status: string;
  };
  paypal_v1_disputes_item: {
    adjudications: components["schemas"]["paypal_v1_disputes_item_adjudication"][];
    buyer_response_due_date: string | null;
    communication_details:
      | components["schemas"]["paypal_v1_disputes_item_communication_details"]
      | null;
    create_time: string;
    dispute_amount: components["schemas"]["paypal_v1_disputes_item_dispute_amount"];
    dispute_channel: string | null;
    dispute_id: string;
    dispute_life_cycle_stage: string;
    dispute_outcome:
      | components["schemas"]["paypal_v1_disputes_item_dispute_outcome"]
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
      | components["schemas"]["paypal_v1_disputes_item_disputed_transaction"][]
      | null;
    evidences:
      | components["schemas"]["paypal_v1_disputes_item_evidence"][]
      | null;
    extensions: components["schemas"]["paypal_v1_disputes_item_extensions"];
    external_reason_code: string | null;
    links: components["schemas"]["paypal_v1_common_link"][];
    messages: components["schemas"]["paypal_v1_disputes_item_message"][] | null;
    money_movements: components["schemas"]["paypal_v1_disputes_item_money_movement"][];
    offer: components["schemas"]["paypal_v1_disputes_item_offer"] | null;
    partner_actions:
      | components["schemas"]["paypal_v1_disputes_item_partner_action"][]
      | null;
    reason: string;
    refund_details:
      | components["schemas"]["paypal_v1_disputes_item_refund_details"]
      | null;
    seller_response_due_date: string | null;
    status: string;
    supporting_info:
      | components["schemas"]["paypal_v1_disputes_item_supporting_info"][]
      | null;
    update_time: string;
  };
  paypal_v1_disputes_item_adjudication: {
    adjudication_time: string;
    dispute_life_cycle_stage: string;
    reason: string;
    type: string;
  };
  paypal_v1_disputes_item_communication_details: {
    email: string;
    note: string;
    time_posted: string;
  };
  paypal_v1_disputes_item_dispute_amount: components["schemas"]["paypal_v1_common_money"];
  paypal_v1_disputes_item_dispute_outcome: {
    amount_refunded: components["schemas"]["paypal_v1_common_money"];
    outcome_code: string;
  };
  paypal_v1_disputes_item_disputed_transaction: components["schemas"]["paypal_v1_disputes_common_transaction"] & {
    seller_protection_eligible: boolean;
  };
  paypal_v1_disputes_item_evidence: {
    documents: components["schemas"]["paypal_v1_disputes_item_evidence_document"][];
    evidence_info: components["schemas"]["paypal_v1_disputes_item_evidence_evidence_info"];
    evidence_type: string;
    item_id: string;
    notes: string;
  };
  paypal_v1_disputes_item_evidence_document: {
    name: string;
  };
  paypal_v1_disputes_item_evidence_evidence_info: {
    refund_ids: components["schemas"]["paypal_v1_disputes_item_evidence_evidence_info_refund_id"][];
    tracking_info: components["schemas"]["paypal_v1_disputes_item_evidence_evidence_info_tracking_info"][];
  };
  paypal_v1_disputes_item_evidence_evidence_info_refund_id: {
    refund_id: string;
  };
  paypal_v1_disputes_item_evidence_evidence_info_tracking_info: {
    carrier_name: string;
    carrier_name_other: string;
    tracking_number: string;
    tracking_url: string;
  };
  paypal_v1_disputes_item_extensions: {
    billing_dispute_properties: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties"];
    buyer_contacted_channel: string;
    buyer_contacted_time: string;
    merchandize_dispute_properties: components["schemas"]["paypal_v1_disputes_item_extensions_merchandize_dispute_properties"];
    merchant_contacted: boolean;
    merchant_contacted_mode: string;
    merchant_contacted_outcome: string;
    merchant_contacted_time: string;
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties: {
    canceled_recurring_billing: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_canceled_recurring_billing"];
    credit_not_processed: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_credit_not_processed"];
    duplicate_transaction: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_duplicate_transaction"];
    incorrect_transaction_amount: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_incorrect_transaction_amount"];
    payment_by_other_means: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_payment_by_other_means"];
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_canceled_recurring_billing: {
    cancellation_details: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details"];
    expected_refund: components["schemas"]["paypal_v1_common_money"];
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_common_agreed_refund_details: {
    merchant_agreed_refund: boolean;
    merchant_agreed_refund_time: string;
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details: {
    cancellation_date: string;
    cancellation_mode: string;
    cancellation_number: string;
    cancelled: boolean;
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_credit_not_processed: {
    agreed_refund_details: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_common_agreed_refund_details"];
    cancellation_details: components["schemas"]["paypal_v1_disputes_item_extensions_billing_dispute_properties_common_cancellation_details"];
    expected_refund: components["schemas"]["paypal_v1_common_money"];
    issue_type: string;
    product_details: components["schemas"]["paypal_v1_disputes_common_product_details"];
    service_details: components["schemas"]["paypal_v1_disputes_common_service_details"];
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_duplicate_transaction: {
    original_transaction: components["schemas"]["paypal_v1_disputes_common_transaction"];
    received_duplicate: boolean;
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_incorrect_transaction_amount: {
    correct_transaction_amount: components["schemas"]["paypal_v1_common_money"];
    correct_transaction_time: string;
  };
  paypal_v1_disputes_item_extensions_billing_dispute_properties_payment_by_other_means: {
    charge_different_from_original: boolean;
    payment_instrument_suffix: string;
    payment_method: string;
    received_duplicate: boolean;
  };
  paypal_v1_disputes_item_extensions_merchandize_dispute_properties: {
    issue_type: string;
    product_details: components["schemas"]["paypal_v1_disputes_common_product_details"];
    service_details: components["schemas"]["paypal_v1_disputes_common_service_details"];
  };
  paypal_v1_disputes_item_message: {
    content: string;
    posted_by: string;
    time_posted: string;
  };
  paypal_v1_disputes_item_money_movement: {
    affected_party: string;
    amount: components["schemas"]["paypal_v1_common_amount"];
    initiated_time: string;
    reason: string;
    type: string;
  };
  paypal_v1_disputes_item_offer: {
    buyer_requested_amount: components["schemas"]["paypal_v1_common_money"];
    history:
      | components["schemas"]["paypal_v1_disputes_item_offer_history"][]
      | null;
    offer_type: string;
    seller_offered_amount: components["schemas"]["paypal_v1_common_money"];
  };
  paypal_v1_disputes_item_offer_history: {
    actor: string;
    event_type: string;
    offer_time: string;
    offer_type: string;
  };
  paypal_v1_disputes_item_partner_action: {
    amount: components["schemas"]["paypal_v1_common_money"];
    create_time: string;
    due_time: string;
    id: string;
    name: string;
    status: string;
    update_time: string;
  };
  paypal_v1_disputes_item_refund_details: {
    allowed_refund_amount: components["schemas"]["paypal_v1_common_money"];
  };
  paypal_v1_disputes_item_supporting_info: {
    notes: string;
    provided_time: string;
    source: string;
  };
  paypal_v1_do_void: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    state: string;
    update_time: string;
  };
  paypal_v1_merchant_integrations: {
    capabilities:
      | components["schemas"]["paypal_v1_merchant_integrations_capability"][]
      | null;
    granted_permissions: string[];
    legal_name: string;
    merchant_id: string;
    oauth_integrations: components["schemas"]["paypal_v1_merchant_integrations_oauth_integration"][];
    payments_receivable: boolean;
    primary_email: string;
    primary_email_confirmed: boolean;
    products: components["schemas"]["paypal_v1_merchant_integrations_product"][];
    tracking_id: string;
  };
  paypal_v1_merchant_integrations_capability: {
    name: string;
    status: string;
  };
  paypal_v1_merchant_integrations_credentials: {
    client_id: string;
    client_secret: string;
    payer_id: string;
  };
  paypal_v1_merchant_integrations_oauth_integration: {
    integration_method?: string;
    integration_type?: string;
    oauth_third_party?: components["schemas"]["paypal_v1_merchant_integrations_oauth_integration_oauth_third_party"][];
    status?: string;
  };
  paypal_v1_merchant_integrations_oauth_integration_oauth_third_party: {
    access_token?: string;
    merchant_client_id?: string;
    partner_client_id?: string;
    refresh_token?: string;
    scopes: string[];
  };
  paypal_v1_merchant_integrations_product: {
    capabilities?: string[];
    name: string;
    vetting_status?: string;
  };
  paypal_v1_merchant_tracking: {
    links: components["schemas"]["paypal_v1_common_link"][];
    merchant_id: string;
    tracking_id: string;
  };
  paypal_v1_patch: {
    /** @enum {string} */
    op: "add" | "replace";
    path: string;
    value: string | Record<string, never>[];
  };
  paypal_v1_payment: {
    application_context: components["schemas"]["paypal_v1_payment_application_context"];
    cart: string;
    create_time: string;
    id: string;
    /**
     * @default sale
     * @enum {string}
     */
    intent?: "sale" | "authorize" | "order";
    links: components["schemas"]["paypal_v1_common_link"][];
    payer: components["schemas"]["paypal_v1_payment_payer"];
    payment_instruction:
      | components["schemas"]["paypal_v1_payment_payment_instruction"]
      | null;
    redirect_urls: components["schemas"]["paypal_v1_payment_redirect_urls"];
    state: string;
    transactions: components["schemas"]["paypal_v1_payment_transaction"][];
    update_time: string;
  };
  paypal_v1_payment_application_context: {
    brand_name: string;
    /** @enum {string} */
    landing_page: "Login" | "Billing";
    locale: string;
    /** @default SET_PROVIDED_ADDRESS */
    shipping_preference?: string;
    /** @default commit */
    user_action?: string;
  };
  paypal_v1_payment_payer: {
    external_selected_funding_instrument_type: string;
    payer_info: components["schemas"]["paypal_v1_payment_payer_payer_info"];
    payment_method: string;
    status: string;
  };
  paypal_v1_payment_payer_execute_payer_info: {
    payer_id: string;
  };
  paypal_v1_payment_payer_payer_info: components["schemas"]["paypal_v1_payment_payer_execute_payer_info"] & {
    billing_address: components["schemas"]["paypal_v1_common_address"] | null;
    country_code: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    shipping_address: components["schemas"]["paypal_v1_payment_transaction_item_list_shipping_address"];
  };
  paypal_v1_payment_payment_instruction: {
    amount: components["schemas"]["paypal_v1_common_value"];
    instruction_type: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    payment_due_date: string;
    recipient_banking_instruction: components["schemas"]["paypal_v1_payment_payment_instruction_recipient_banking_instruction"];
    reference_number: string;
  };
  paypal_v1_payment_payment_instruction_recipient_banking_instruction: {
    account_holder_name: string;
    bank_identifier_code: string;
    bank_name: string;
    international_bank_account_number: string;
  };
  paypal_v1_payment_redirect_urls: {
    cancel_url: string;
    return_url: string;
  };
  paypal_v1_payment_transaction: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    custom: string;
    description: string;
    invoice_number: string | null;
    item_list:
      | components["schemas"]["paypal_v1_payment_transaction_item_list"]
      | null;
    payee: components["schemas"]["paypal_v1_payment_transaction_payee"];
    related_resources: components["schemas"]["paypal_v1_payment_transaction_related_resource"][];
    soft_descriptor: string;
  };
  paypal_v1_payment_transaction_item_list: {
    items: components["schemas"]["paypal_v1_payment_transaction_item_list_item"][];
    shipping_address: components["schemas"]["paypal_v1_payment_transaction_item_list_shipping_address"];
    shipping_options: components["schemas"]["paypal_v1_payment_transaction_item_list_shipping_option"][];
    shipping_phone_number: string;
  };
  paypal_v1_payment_transaction_item_list_item: {
    currency: string;
    name: string;
    price: string;
    quantity: number;
    sku: string | null;
    tax: string;
  };
  paypal_v1_payment_transaction_item_list_shipping_address: components["schemas"]["paypal_v1_common_address"] & {
    recipient_name: string;
  };
  paypal_v1_payment_transaction_item_list_shipping_option: Record<
    string,
    never
  >;
  paypal_v1_payment_transaction_payee: {
    email: string;
    merchant_id: string;
  };
  paypal_v1_payment_transaction_related_resource: {
    authorization:
      | components["schemas"]["paypal_v1_payment_transaction_related_resource_authorization"]
      | null;
    capture:
      | components["schemas"]["paypal_v1_payment_transaction_related_resource_capture"]
      | null;
    order:
      | components["schemas"]["paypal_v1_payment_transaction_related_resource_order"]
      | null;
    refund:
      | components["schemas"]["paypal_v1_payment_transaction_related_resource_refund"]
      | null;
    sale:
      | components["schemas"]["paypal_v1_payment_transaction_related_resource_sale"]
      | null;
  };
  paypal_v1_payment_transaction_related_resource_authorization: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
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
  paypal_v1_payment_transaction_related_resource_capture: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    custom: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    state: string;
    transaction_fee: components["schemas"]["paypal_v1_common_value"];
    update_time: string;
  };
  paypal_v1_payment_transaction_related_resource_order: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    reason_code: string;
    receipt_id: string;
    state: string;
    update_time: string;
  };
  paypal_v1_payment_transaction_related_resource_refund: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    capture_id: string;
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    sale_id: string;
    state: string;
    update_time: string;
  };
  paypal_v1_payment_transaction_related_resource_sale: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    receipt_id: string;
    state: string;
    transaction_fee: components["schemas"]["paypal_v1_common_value"];
    update_time: string;
  };
  paypal_v1_plan: {
    billing_cycles: components["schemas"]["paypal_v1_plan_billing_cycle"][];
    description: string | null;
    name: string;
    payment_preferences: components["schemas"]["paypal_v1_plan_payment_preferences"];
    product_id: string;
    status: string;
    taxes: components["schemas"]["paypal_v1_plan_taxes"];
  };
  paypal_v1_plan_billing_cycle: {
    frequency: components["schemas"]["paypal_v1_plan_billing_cycle_frequency"];
    pricing_scheme: components["schemas"]["paypal_v1_plan_billing_cycle_pricing_scheme"];
    sequence: number;
    tenure_type: string;
    total_cycles: number;
  };
  paypal_v1_plan_billing_cycle_frequency: {
    interval_count: number;
    interval_unit: string;
  };
  paypal_v1_plan_billing_cycle_pricing_scheme: {
    fixed_price: components["schemas"]["paypal_v1_common_money"];
  };
  paypal_v1_plan_payment_preferences: {
    auto_bill_outstanding: boolean;
    payment_failure_threshold: number;
  };
  paypal_v1_plan_taxes: {
    inclusive: boolean;
    percentage: string;
  };
  paypal_v1_product: {
    description: string;
    name: string;
    type: string;
  };
  paypal_v1_refund: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    capture_id: string;
    create_time: string;
    description: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    parent_payment: string;
    reason: string;
    refund_from_received_amount: components["schemas"]["paypal_v1_common_value"];
    refund_from_transaction_fee: components["schemas"]["paypal_v1_common_value"];
    sale_id: string;
    state: string;
    total_refunded_amount: components["schemas"]["paypal_v1_common_value"];
    update_time: string;
  };
  paypal_v1_shipping: {
    trackers: components["schemas"]["paypal_v1_shipping_tracker"][];
  };
  paypal_v1_shipping_tracker: {
    carrier: string;
    notify_buyer: boolean;
    /** Format: date-time */
    shipment_date: string;
    status: string;
    tracking_number: string;
    transaction_id: string;
  };
  paypal_v1_subscription: {
    application_context: components["schemas"]["paypal_v1_subscription_application_context"];
    billing_info:
      | components["schemas"]["paypal_v1_subscription_billing_info"]
      | null;
    create_time: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    plan_id: string;
    quantity: string;
    shipping_amount: components["schemas"]["paypal_v1_common_money"];
    start_time: string;
    status: string;
    status_update_time: string;
    subscriber: components["schemas"]["paypal_v1_subscription_subscriber"];
    update_time: string;
  };
  paypal_v1_subscription_application_context: {
    brand_name: string;
    cancel_url: string;
    locale: string;
    return_url: string;
    /** @default SET_PROVIDED_ADDRESS */
    shipping_preference?: string;
    /** @default SUBSCRIBE_NOW */
    user_action?: string;
  };
  paypal_v1_subscription_billing_info: {
    cycle_executions: components["schemas"]["paypal_v1_subscription_billing_info_cycle_execution"][];
    failed_payments_count: number;
    last_payment: components["schemas"]["paypal_v1_subscription_billing_info_last_payment"];
    next_billing_time: string | null;
    outstanding_balance: components["schemas"]["paypal_v1_subscription_billing_info_outstanding_balance"];
  };
  paypal_v1_subscription_billing_info_cycle_execution: {
    cycles_completed: number;
    cycles_remaining: number;
    sequence: number;
    tenure_type: string;
    total_cycles: number;
  };
  paypal_v1_subscription_billing_info_last_payment: {
    amount: components["schemas"]["paypal_v1_common_money"];
    time: string;
  };
  paypal_v1_subscription_billing_info_outstanding_balance: components["schemas"]["paypal_v1_common_money"];
  paypal_v1_subscription_subscriber: {
    email_address: string;
    name: components["schemas"]["paypal_v1_subscription_subscriber_name"];
    payer_id: string;
    shipping_address:
      | components["schemas"]["paypal_v1_subscription_subscriber_shipping_address"]
      | null;
  };
  paypal_v1_subscription_subscriber_name: {
    given_name: string;
    surname: string;
  };
  paypal_v1_subscription_subscriber_shipping_address: {
    address:
      | components["schemas"]["paypal_v1_subscription_subscriber_shipping_address_address"]
      | null;
    name:
      | components["schemas"]["paypal_v1_subscription_subscriber_shipping_address_name"]
      | null;
  };
  paypal_v1_subscription_subscriber_shipping_address_address: {
    address_line_1: string | null;
    address_line_2: string | null;
    admin_area_1: string | null;
    admin_area_2: string | null;
    country_code: string;
    postal_code: string | null;
  };
  paypal_v1_subscription_subscriber_shipping_address_name: {
    full_name: string;
  };
  paypal_v1_token: {
    /**
     * The access token issued by PayPal. After the access token
     *     expires (see $expiresIn), you must request a new access token.
     */
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
    /**
     * Scopes expressed in the form of resource URL endpoints. The value of the scope parameter
     *     is expressed as a list of space-delimited, case-sensitive strings.
     */
    scope: string;
    /**
     * The type of the token issued as described in OAuth2.0 RFC6749,
     *     Section 7.1. Value is case insensitive.
     */
    token_type: string;
  };
  paypal_v1_webhook: {
    event_types: components["schemas"]["paypal_v1_webhook_event_type"][];
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    url: string;
  };
  paypal_v1_webhook_event: {
    create_time: string;
    event_type: string;
    event_version: string;
    id: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    resource:
      | (
          | components["schemas"]["paypal_v3_payment_token"]
          | components["schemas"]["paypal_v2_order_purchase_unit_payments_authorization"]
          | components["schemas"]["paypal_v2_order_purchase_unit_payments_capture"]
          | components["schemas"]["paypal_v2_order_purchase_unit_payments_refund"]
          | components["schemas"]["paypal_v1_webhook_resource"]
          | components["schemas"]["paypal_v1_subscription"]
        )
      | null;
    resource_type: string;
    resource_version: string;
    summary: string;
  };
  paypal_v1_webhook_event_type: {
    description: string;
    name: string;
    resource_version: string;
    status: string;
  };
  paypal_v1_webhook_list: {
    webhooks: components["schemas"]["paypal_v1_webhook"][];
  };
  paypal_v1_webhook_resource: {
    amount: components["schemas"]["paypal_v1_common_amount"];
    billing_agreement_id: string | null;
    clearing_time: string;
    create_time: string;
    id: string;
    invoice_number: string;
    links: components["schemas"]["paypal_v1_common_link"][];
    merchant_id: string | null;
    parent_payment: string | null;
    payment_mode: string;
    protection_eligibility: string;
    protection_eligibility_type: string;
    refund_reason_code: string | null;
    sale_id: string | null;
    state: string;
    transaction_fee: components["schemas"]["paypal_v1_common_value"];
    update_time: string;
  };
  paypal_v2_common_address: {
    /**
     * The first line of the address. For example, number or street. For example, 173 Drury Lane.
     *     Required for data entry and compliance and risk checks. Must contain the full address.
     */
    address_line_1: string | null;
    /** The second line of the address. For example, suite or apartment number. */
    address_line_2: string | null;
    /**
     * The highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision.
     *     Format for postal delivery. For example, CA and not California.
     */
    admin_area_1: string | null;
    /** A city, town, or village. Smaller than $adminArea1 */
    admin_area_2: string | null;
    country_code: string;
    postal_code: string | null;
  };
  paypal_v2_common_link: {
    enc_type: string | null;
    href: string;
    method: string;
    rel: string;
  };
  paypal_v2_common_money: {
    currency_code: string;
    value: string;
  };
  paypal_v2_common_name: {
    given_name: string;
    surname: string;
  };
  paypal_v2_common_phone_number: {
    country_code: string;
    national_number: string;
  };
  paypal_v2_common_upc: {
    code: string;
    type: string;
  };
  paypal_v2_eligible_methods_data: {
    eligible_methods: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods"];
    supplementary_data: components["schemas"]["paypal_v2_eligible_methods_data_supplementary_data"];
  };
  paypal_v2_eligible_methods_data_eligible_methods: {
    advanced_cards: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_advanced_cards"];
    apple_pay: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_apple_pay"];
    bancontact: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_bancontact"];
    bizum: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_bizum"];
    blik: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_blik"];
    eps: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_eps"];
    google_pay: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_google_pay"];
    ideal: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_ideal"];
    klarna: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_klarna"];
    p_2_4: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_p24"];
    paypal: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal"];
    paypal_pay_later: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal_pay_later"];
  };
  paypal_v2_eligible_methods_data_eligible_methods_advanced_cards: {
    cobranded_enabled: boolean;
    supports_installements: boolean;
    vendors: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_advanced_cards_vendor"][];
  };
  paypal_v2_eligible_methods_data_eligible_methods_advanced_cards_vendor: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal"] & {
    branded: boolean;
    eligible: boolean;
    network: string;
  };
  paypal_v2_eligible_methods_data_eligible_methods_apple_pay: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal"] & {
    config: Record<string, never>[];
  };
  paypal_v2_eligible_methods_data_eligible_methods_bancontact: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_bizum: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_blik: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_eps: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_google_pay: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal"] & {
    config: Record<string, never>[];
  };
  paypal_v2_eligible_methods_data_eligible_methods_ideal: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_klarna: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_p24: GenericRecord;
  paypal_v2_eligible_methods_data_eligible_methods_paypal: {
    can_be_vaulted: boolean;
  };
  paypal_v2_eligible_methods_data_eligible_methods_paypal_pay_later: components["schemas"]["paypal_v2_eligible_methods_data_eligible_methods_paypal"] & {
    /** ISO 3166-1 alpha-2 country code */
    country_code: string;
    product_code: string;
  };
  paypal_v2_eligible_methods_data_supplementary_data: {
    /** ISO 3166-1 alpha-2 country code */
    buyer_country_code: string;
  };
  paypal_v2_find_eligible_methods: {
    customer: components["schemas"]["paypal_v2_find_eligible_methods_customer"];
    preferences: components["schemas"]["paypal_v2_find_eligible_methods_preferences"];
    /**
     * Does not have to be a full purchase unit.
     *     `[{"amount":{"currency_code":"<iso-4217-code>"},"payee":{"merchant_id":"<merchant-id>"}}]` is enough.
     */
    purchase_units: components["schemas"]["paypal_v2_order_purchase_unit"][];
  };
  paypal_v2_find_eligible_methods_customer: {
    channel: components["schemas"]["paypal_v2_find_eligible_methods_customer_channel"];
    /** ISO 3166-1 alpha-2 country code */
    country_code: string;
  };
  paypal_v2_find_eligible_methods_customer_channel: {
    browser_type: string | null;
    client_os: string | null;
    device_type: string | null;
  };
  paypal_v2_find_eligible_methods_preferences: {
    commit: boolean;
    /** @enum {string} */
    intent: "CAPTURE" | "AUTHORIZE";
    /** @enum {string} */
    payment_flow: "ONE_TIME_PAYMENT";
    payment_source_constraint: components["schemas"]["paypal_v2_find_eligible_methods_preferences_payment_source_constraint"];
    vault: boolean;
  };
  paypal_v2_find_eligible_methods_preferences_payment_source_constraint: {
    /** @enum {string} */
    constraint_type: "INCLUDE";
    payment_sources: string[];
  };
  paypal_v2_order: {
    application_context: components["schemas"]["paypal_v2_order_application_context"];
    create_time: string;
    id: string;
    /** @enum {string} */
    intent: "CAPTURE" | "AUTHORIZE";
    links: components["schemas"]["paypal_v2_common_link"][];
    payer: components["schemas"]["paypal_v2_order_payer"];
    payment_source:
      | components["schemas"]["paypal_v2_order_payment_source"]
      | null;
    processing_instruction: string;
    purchase_units:
      | components["schemas"]["paypal_v2_order_purchase_unit"][]
      | null;
    status: string;
    update_time: string;
  };
  paypal_v2_order_application_context: {
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
  paypal_v2_order_payer: {
    address: components["schemas"]["paypal_v2_common_address"];
    email_address: string;
    name: components["schemas"]["paypal_v2_common_name"];
    payer_id: string;
    phone:
      | components["schemas"]["paypal_v2_order_payment_source_common_phone"]
      | null;
  };
  paypal_v2_order_payment_source: {
    afterpay:
      | components["schemas"]["paypal_v2_order_payment_source_afterpay"]
      | null;
    apple_pay: components["schemas"]["paypal_v2_order_payment_source_apple_pay"];
    bancontact:
      | components["schemas"]["paypal_v2_order_payment_source_bancontact"]
      | null;
    blik: components["schemas"]["paypal_v2_order_payment_source_blik"] | null;
    boletobancario:
      | components["schemas"]["paypal_v2_order_payment_source_boletobancario"]
      | null;
    card: components["schemas"]["paypal_v2_order_payment_source_card"] | null;
    eps: components["schemas"]["paypal_v2_order_payment_source_eps"] | null;
    google_pay:
      | components["schemas"]["paypal_v2_order_payment_source_google_pay"]
      | null;
    ideal: components["schemas"]["paypal_v2_order_payment_source_ideal"] | null;
    klarna:
      | components["schemas"]["paypal_v2_order_payment_source_klarna"]
      | null;
    multibanco:
      | components["schemas"]["paypal_v2_order_payment_source_multibanco"]
      | null;
    my_bank:
      | components["schemas"]["paypal_v2_order_payment_source_my_bank"]
      | null;
    oxxo: components["schemas"]["paypal_v2_order_payment_source_oxxo"] | null;
    p_2_4: components["schemas"]["paypal_v2_order_payment_source_p24"] | null;
    pay_upon_invoice:
      | components["schemas"]["paypal_v2_order_payment_source_pay_upon_invoice"]
      | null;
    paypal:
      | components["schemas"]["paypal_v2_order_payment_source_paypal"]
      | null;
    swish: components["schemas"]["paypal_v2_order_payment_source_swish"] | null;
    token: components["schemas"]["paypal_v2_order_payment_source_token"] | null;
    trustly:
      | components["schemas"]["paypal_v2_order_payment_source_trustly"]
      | null;
    venmo: components["schemas"]["paypal_v2_order_payment_source_venmo"] | null;
  };
  paypal_v2_order_payment_source_afterpay: {
    /** Format: date */
    birth_date: string;
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
    phone: string;
  };
  paypal_v2_order_payment_source_apple_pay: {
    attributes:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes"]
      | null;
    card: components["schemas"]["paypal_v2_order_payment_source_card"] | null;
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_bancontact: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_blik: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_boletobancario: {
    billing_address: components["schemas"]["paypal_v2_common_address"];
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    expiry_date: string;
    name: string;
    tax_info: components["schemas"]["paypal_v2_order_payment_source_boletobancario_tax_info"];
  };
  paypal_v2_order_payment_source_boletobancario_tax_info: {
    tax_id: string;
    tax_id_type: string;
  };
  paypal_v2_order_payment_source_card: {
    attributes:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes"]
      | null;
    authentication_result:
      | components["schemas"]["paypal_v2_order_payment_source_card_authentication_result"]
      | null;
    billing_address: components["schemas"]["paypal_v2_common_address"] | null;
    brand: string;
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    last_digits: string;
    name: string;
    stored_credential:
      | components["schemas"]["paypal_v2_order_payment_source_card_stored_credential"]
      | null;
    type: string;
    vault_id: string;
  };
  paypal_v2_order_payment_source_card_authentication_result: {
    liability_shift: string;
    three_d_secure:
      | components["schemas"]["paypal_v2_order_payment_source_card_authentication_result_3d_secure"]
      | null;
  };
  paypal_v2_order_payment_source_card_authentication_result_3d_secure: {
    authentication_status: string;
    enrollment_status: string;
  };
  paypal_v2_order_payment_source_card_stored_credential: {
    /** @enum {string} */
    payment_initiator: "MERCHANT" | "CUSTOMER";
    /** @enum {string} */
    payment_type: "RECURRING" | "ONE_TIME" | "UNSCHEDULED";
    previous_network_transaction_reference: string;
    /** @enum {string} */
    usage: "DERIVED" | "FIRST" | "SUBSEQUENT";
  };
  paypal_v2_order_payment_source_common_app_switch_context: {
    mobile_web:
      | components["schemas"]["paypal_v2_order_payment_source_common_app_switch_context_mobile_web_context"]
      | null;
    native_app:
      | components["schemas"]["paypal_v2_order_payment_source_common_app_switch_context_native_app_context"]
      | null;
  };
  paypal_v2_order_payment_source_common_app_switch_context_mobile_web_context: {
    buyer_user_agent: string;
    /**
     * @default AUTO
     * @enum {string}
     */
    return_flow?: "AUTO" | "MANUAL";
  };
  paypal_v2_order_payment_source_common_app_switch_context_native_app_context: {
    /** @enum {string} */
    os_type: "ANDROID" | "IOS" | "OTHER";
    os_version: string;
  };
  paypal_v2_order_payment_source_common_attributes: {
    customer: components["schemas"]["paypal_v2_order_payment_source_common_attributes_customer"];
    vault: components["schemas"]["paypal_v2_order_payment_source_common_attributes_vault"];
    verification: components["schemas"]["paypal_v2_order_payment_source_common_attributes_verification"];
  };
  paypal_v2_order_payment_source_common_attributes_customer: {
    id: string;
  };
  paypal_v2_order_payment_source_common_attributes_order_update_callback_config: {
    callback_events: ("SHIPPING_ADDRESS" | "SHIPPING_OPTIONS")[];
    callback_url: string;
  };
  paypal_v2_order_payment_source_common_attributes_vault: {
    confirm_payment_token: string;
    customer:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes_customer"]
      | null;
    id: string | null;
    links: components["schemas"]["paypal_v2_common_link"][];
    permit_multiple_payment_tokens: boolean;
    status: string;
    store_in_vault: string;
    usage_type: string;
  };
  paypal_v2_order_payment_source_common_attributes_verification: {
    method: string;
  };
  paypal_v2_order_payment_source_common_experience_context: {
    app_switch_context:
      | components["schemas"]["paypal_v2_order_payment_source_common_app_switch_context"]
      | null;
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
    order_update_callback_config: components["schemas"]["paypal_v2_order_payment_source_common_attributes_order_update_callback_config"];
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
  paypal_v2_order_payment_source_common_phone: {
    phone_number: components["schemas"]["paypal_v2_common_phone_number"];
    phone_type: string;
  };
  paypal_v2_order_payment_source_eps: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_google_pay: {
    attributes:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes"]
      | null;
    card: components["schemas"]["paypal_v2_order_payment_source_card"] | null;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
  };
  paypal_v2_order_payment_source_ideal: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_klarna: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
    phone: string;
  };
  paypal_v2_order_payment_source_multibanco: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_my_bank: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_oxxo: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_p24: {
    country_code: string;
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_pay_upon_invoice: {
    billing_address: components["schemas"]["paypal_v2_common_address"];
    birth_date: string;
    deposit_bank_details: components["schemas"]["paypal_v2_order_payment_source_pay_upon_invoice_deposit_bank_details"];
    email: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["paypal_v2_common_name"];
    payment_reference: string;
    phone: components["schemas"]["paypal_v2_common_phone_number"];
  };
  paypal_v2_order_payment_source_pay_upon_invoice_deposit_bank_details: {
    account_holder_name: string;
    bank_name: string;
    bic: string;
    iban: string;
  };
  paypal_v2_order_payment_source_paypal: {
    account_id: string;
    address: components["schemas"]["paypal_v2_common_address"];
    attributes:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes"]
      | null;
    billing_agreement_id: string;
    birth_date: string;
    email_address: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["paypal_v2_common_name"];
    phone_number: components["schemas"]["paypal_v2_common_phone_number"] | null;
    phone_type: string;
    vault_id: string;
  };
  paypal_v2_order_payment_source_swish: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
    phone: string;
  };
  paypal_v2_order_payment_source_token: {
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    id: string;
    stored_payment_source: components["schemas"]["paypal_v2_order_payment_source_token_stored_payment_source"];
    type: string;
  };
  paypal_v2_order_payment_source_token_stored_payment_source: {
    payment_initiator: string;
    payment_type: string;
    usage: string;
  };
  paypal_v2_order_payment_source_trustly: {
    country_code: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: string;
  };
  paypal_v2_order_payment_source_venmo: {
    account_id: string;
    address: components["schemas"]["paypal_v2_common_address"];
    attributes:
      | components["schemas"]["paypal_v2_order_payment_source_common_attributes"]
      | null;
    email_address: string;
    experience_context: components["schemas"]["paypal_v2_order_payment_source_common_experience_context"];
    name: components["schemas"]["paypal_v2_common_name"];
    phone_number: components["schemas"]["paypal_v2_common_phone_number"] | null;
    user_name: string;
    vault_id: string;
  };
  paypal_v2_order_purchase_unit: {
    amount: components["schemas"]["paypal_v2_order_purchase_unit_amount"];
    custom_id: string | null;
    description: string;
    invoice_id: string | null;
    items: components["schemas"]["paypal_v2_order_purchase_unit_item"][] | null;
    payee: components["schemas"]["paypal_v2_order_purchase_unit_payee"];
    payments:
      | components["schemas"]["paypal_v2_order_purchase_unit_payments"]
      | null;
    reference_id: string;
    shipping: components["schemas"]["paypal_v2_order_purchase_unit_shipping"];
    shipping_options:
      | components["schemas"]["paypal_v2_order_purchase_unit_shipping_option"][]
      | null;
    supplementary_data: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data"];
  };
  paypal_v2_order_purchase_unit_amount: components["schemas"]["paypal_v2_common_money"] & {
    breakdown:
      | components["schemas"]["paypal_v2_order_purchase_unit_amount_breakdown"]
      | null;
  };
  paypal_v2_order_purchase_unit_amount_breakdown: {
    discount: components["schemas"]["paypal_v2_common_money"];
    handling: components["schemas"]["paypal_v2_common_money"];
    insurance: components["schemas"]["paypal_v2_common_money"];
    item_total: components["schemas"]["paypal_v2_common_money"];
    shipping: components["schemas"]["paypal_v2_common_money"];
    shipping_discount: components["schemas"]["paypal_v2_common_money"];
    tax_total: components["schemas"]["paypal_v2_common_money"] | null;
  };
  paypal_v2_order_purchase_unit_item: {
    /** @enum {string} */
    category: "PHYSICAL_GOODS" | "DIGITAL_GOODS" | "DONATION";
    name: string;
    quantity: number;
    sku: string | null;
    tax: components["schemas"]["paypal_v2_common_money"];
    tax_rate: string | number | Record<string, never>;
    unit_amount: components["schemas"]["paypal_v2_common_money"];
  };
  paypal_v2_order_purchase_unit_payee: {
    display_data: components["schemas"]["paypal_v2_order_purchase_unit_payee_display_data"];
    email_address: string;
    merchant_id: string;
  };
  paypal_v2_order_purchase_unit_payee_display_data: {
    brand_name: string;
  };
  paypal_v2_order_purchase_unit_payments: {
    authorizations:
      | components["schemas"]["paypal_v2_order_purchase_unit_payments_authorization"][]
      | null;
    captures:
      | components["schemas"]["paypal_v2_order_purchase_unit_payments_capture"][]
      | null;
    refunds:
      | components["schemas"]["paypal_v2_order_purchase_unit_payments_refund"][]
      | null;
  };
  paypal_v2_order_purchase_unit_payments_authorization: {
    amount: components["schemas"]["paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    expiration_time: string;
    id: string;
    links: components["schemas"]["paypal_v2_common_link"][];
    seller_protection: components["schemas"]["paypal_v2_order_purchase_unit_payments_common_seller_protection"];
    status: string;
    update_time: string;
  };
  paypal_v2_order_purchase_unit_payments_authorization_seller_protection: {
    dispute_categories: string[];
    status: string;
  };
  paypal_v2_order_purchase_unit_payments_capture: {
    amount: components["schemas"]["paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    disbursement_mode: string;
    final_capture: boolean;
    id: string;
    invoice_id: string | null;
    links: components["schemas"]["paypal_v2_common_link"][];
    note_to_payer: string | null;
    processor_response: components["schemas"]["paypal_v2_order_purchase_unit_payments_capture_processor_response"];
    seller_protection: components["schemas"]["paypal_v2_order_purchase_unit_payments_common_seller_protection"];
    seller_receivable_breakdown: components["schemas"]["paypal_v2_order_purchase_unit_payments_capture_seller_receivable_breakdown"];
    status: string;
    update_time: string;
  };
  paypal_v2_order_purchase_unit_payments_capture_processor_response: {
    avs_code: string | null;
    cvv_code: string | null;
    response_code: string | null;
  };
  paypal_v2_order_purchase_unit_payments_capture_seller_receivable_breakdown: {
    gross_amount: components["schemas"]["paypal_v2_common_money"];
    net_amount: components["schemas"]["paypal_v2_common_money"];
    paypal_fee: components["schemas"]["paypal_v2_common_money"];
  };
  paypal_v2_order_purchase_unit_payments_common_seller_protection: {
    dispute_categories: string[];
    status: string;
  };
  paypal_v2_order_purchase_unit_payments_refund: {
    amount: components["schemas"]["paypal_v2_common_money"] | null;
    create_time: string;
    custom_id: string | null;
    id: string;
    invoice_id: string | null;
    links: components["schemas"]["paypal_v2_common_link"][];
    note_to_payer: string | null;
    seller_payable_breakdown: components["schemas"]["paypal_v2_order_purchase_unit_payments_refund_seller_payable_breakdown"];
    status: string;
    update_time: string;
  };
  paypal_v2_order_purchase_unit_payments_refund_seller_payable_breakdown: {
    gross_amount: components["schemas"]["paypal_v2_common_money"];
    net_amount: components["schemas"]["paypal_v2_common_money"];
    paypal_fee: components["schemas"]["paypal_v2_common_money"];
    total_refunded_amount: components["schemas"]["paypal_v2_common_money"];
  };
  paypal_v2_order_purchase_unit_shipping: {
    address: components["schemas"]["paypal_v2_common_address"];
    name: components["schemas"]["paypal_v2_order_purchase_unit_shipping_name"];
    trackers:
      | components["schemas"]["paypal_v2_order_purchase_unit_shipping_tracker"][]
      | null;
  };
  paypal_v2_order_purchase_unit_shipping_name: {
    full_name: string;
  };
  paypal_v2_order_purchase_unit_shipping_option: {
    amount: components["schemas"]["paypal_v2_common_money"];
    id: string;
    label: string;
    selected: boolean;
    /** @enum {string} */
    type: "SHIPPING" | "PICKUP";
  };
  paypal_v2_order_purchase_unit_shipping_tracker: {
    id: string;
    items: components["schemas"]["paypal_v2_order_purchase_unit_item"][];
    links: components["schemas"]["paypal_v2_common_link"][];
    notify_payer: boolean;
    status: string;
  };
  paypal_v2_order_purchase_unit_shipping_tracker_item: {
    image_url: string | null;
    name: string;
    quantity: number;
    sku: string | null;
    url: string | null;
  };
  paypal_v2_order_purchase_unit_supplementary_data: {
    card: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data_card"];
    risk: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data_risk"];
  };
  paypal_v2_order_purchase_unit_supplementary_data_card: {
    address: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data_card_level2"];
  };
  paypal_v2_order_purchase_unit_supplementary_data_card_level2: {
    invoice_id: string;
    tax_total: components["schemas"]["paypal_v2_common_money"];
  };
  paypal_v2_order_purchase_unit_supplementary_data_card_level3: {
    discount_amount: components["schemas"]["paypal_v2_common_money"];
    duty_amount: components["schemas"]["paypal_v2_common_money"];
    line_items: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data_card_line_item"][];
    shipping_address: components["schemas"]["paypal_v2_common_address"];
    shipping_amount: components["schemas"]["paypal_v2_common_money"];
    ships_from_postal_code: string;
  };
  paypal_v2_order_purchase_unit_supplementary_data_card_line_item: {
    commodity_code: string;
    description: string;
    discount_amount: components["schemas"]["paypal_v2_common_money"];
    image_url: string;
    name: string;
    quantity: number;
    sku: string;
    tax: components["schemas"]["paypal_v2_common_money"];
    total_amount: components["schemas"]["paypal_v2_common_money"];
    unit_amount: components["schemas"]["paypal_v2_common_money"];
    unit_of_measure: string;
    upc: components["schemas"]["paypal_v2_common_upc"];
    url: string;
  };
  paypal_v2_order_purchase_unit_supplementary_data_risk: {
    address: components["schemas"]["paypal_v2_order_purchase_unit_supplementary_data_risk_participant_metadata"];
  };
  paypal_v2_order_purchase_unit_supplementary_data_risk_participant_metadata: {
    ip_address: string;
  };
  paypal_v2_order_shipping_callback: {
    id: string;
    purchase_units: components["schemas"]["paypal_v2_order_purchase_unit"][];
    shipping_address: components["schemas"]["paypal_v2_common_address"];
    shipping_option: components["schemas"]["paypal_v2_order_purchase_unit_shipping_option"];
  };
  paypal_v2_order_tracker: {
    capture_id: string;
    carrier: string;
    carrier_name_other: string | null;
    items: components["schemas"]["paypal_v2_order_purchase_unit_shipping_tracker_item"][];
    /** @default false */
    notify_payer?: boolean;
    tracking_number: string;
  };
  paypal_v2_patch: {
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
  paypal_v2_referral: {
    business_entity: components["schemas"]["paypal_v2_referral_business_entity"];
    capabilities: string[];
    legal_consents: components["schemas"]["paypal_v2_referral_legal_consent"][];
    legal_country_code: string;
    links: components["schemas"]["paypal_v2_common_link"][];
    operations: components["schemas"]["paypal_v2_referral_operation"][];
    partner_config_override: components["schemas"]["paypal_v2_referral_partner_config_override"];
    preferred_language_code: string;
    products: string[];
    tracking_id: string;
  };
  paypal_v2_referral_business_entity: {
    addresses: components["schemas"]["paypal_v2_referral_business_entity_address"][];
  };
  paypal_v2_referral_business_entity_address: {
    country_code: string;
    /** @default WORK */
    type?: string;
  };
  paypal_v2_referral_legal_consent: {
    granted: boolean;
    /** @default SHARE_DATA_CONSENT */
    type?: string;
  };
  paypal_v2_referral_operation: {
    api_integration_preference: components["schemas"]["paypal_v2_referral_operation_api_integration_preference"];
    /** @default API_INTEGRATION */
    operation?: string;
  };
  paypal_v2_referral_operation_api_integration_preference: {
    rest_api_integration: components["schemas"]["paypal_v2_referral_operation_api_integration_preference_rest_api_integration"];
  };
  paypal_v2_referral_operation_api_integration_preference_rest_api_integration: {
    /** @default PAYPAL */
    integration_method?: string;
    /** @default THIRD_PARTY */
    integration_type?: string;
    third_party_details: components["schemas"]["paypal_v2_referral_operation_api_integration_preference_rest_api_integration_third_party_details"];
  };
  paypal_v2_referral_operation_api_integration_preference_rest_api_integration_third_party_details: {
    /** @deprecated */
    features: string[];
    organization: string;
    signup_mode: string;
  };
  paypal_v2_referral_partner_config_override: {
    partner_logo_url: string;
    return_url: string;
  };
  paypal_v3_payment_token: {
    customer: components["schemas"]["paypal_v2_order_payment_source_common_attributes_customer"];
    id: string;
    links: components["schemas"]["paypal_v2_common_link"][];
    metadata: components["schemas"]["paypal_v3_payment_token_metadata"] | null;
    payment_source: components["schemas"]["paypal_v2_order_payment_source"];
    status: string;
  };
  paypal_v3_payment_token_metadata: {
    order_id: string;
  };
  relationship: {
    /** Member, whose value represents "resource linkage". */
    data?:
      | components["schemas"]["relationshipToOne"]
      | components["schemas"]["relationshipToMany"];
    links?: components["schemas"]["relationshipLinks"];
    meta?: components["schemas"]["meta"];
  };
  relationshipLinks: {
    related?: components["schemas"]["link"];
    self?: GenericRecord[] & components["schemas"]["link"];
  } & {
    [key: string]: unknown;
  };
  relationshipToMany: components["schemas"]["linkage"][];
  relationshipToOne: unknown & components["schemas"]["linkage"];
  relationships: {
    [key: string]: components["schemas"]["relationship"];
  };
  resource: {
    attributes?: components["schemas"]["attributes"];
    id: string;
    links?: components["schemas"]["links"];
    meta?: components["schemas"]["meta"];
    relationships?: components["schemas"]["relationships"];
    type: string;
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
      /** Format: uri-reference */
      $self?: string;
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
        kind?: string;
        name: string;
        parent?: string;
        summary?: string;
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
  "storeApiMcpPost post /_mcp":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers?: {
          /** Session ID returned by the server in the `mcp-session-id` response header after a successful `initialize` request. Required for all subsequent requests within the same session. */
          "mcp-session-id"?: string;
          /** Standard Store API context token identifying the customer session. When provided, MCP tools operate in the context of that customer. Same semantics as all other Store API endpoints. */
          "sw-context-token"?: string;
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        body: {
          /** Request identifier. Omit for notifications (fire-and-forget). Present for requests that expect a response. */
          id?: string | number;
          /** @enum {string} */
          jsonrpc: "2.0";
          /** MCP method name. */
          method: string;
          /** Method-specific parameters, see the request variants. */
          params?: GenericRecord;
        } & (
          | {
              /** @constant */
              method?: "initialize";
              params: {
                /** Capabilities the client supports. */
                capabilities: {
                  [key: string]: unknown;
                };
                clientInfo: {
                  name: string;
                  version: string;
                };
                /** MCP protocol version the client supports, e.g. `2025-03-26`. */
                protocolVersion: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/list";
              params?: {
                /** Opaque pagination cursor from a previous `tools/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/call";
              params: {
                /** Tool arguments matching the tool's `inputSchema`. */
                arguments?: {
                  [key: string]: unknown;
                };
                /** Name of the tool to invoke, as returned by `tools/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/list";
              params?: {
                /** Opaque pagination cursor from a previous `resources/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/read";
              params: {
                /** URI of the resource to read, as returned by `resources/list`. */
                uri: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/list";
              params?: {
                /** Opaque pagination cursor from a previous `prompts/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/get";
              params: {
                /** Prompt arguments as string values. */
                arguments?: {
                  [key: string]: string;
                };
                /** Name of the prompt, as returned by `prompts/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "ping";
            }
        );
        response: {
          id: string | number | null;
          /** @enum {string} */
          jsonrpc: "2.0";
        } & (
          | {
              /** Method-specific result payload, one of the variants below depending on the requested method. */
              result:
                | ({
                    /** Capabilities the server supports (tools, resources, prompts, logging, ...). */
                    capabilities: {
                      [key: string]: unknown;
                    };
                    /** Usage instructions for the client / model. */
                    instructions?: string;
                    protocolVersion: string;
                    serverInfo: {
                      name: string;
                      version: string;
                    };
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    /** Pagination cursor for the next page, absent on the last page. */
                    nextCursor?: string;
                    tools: ({
                      description?: string;
                      /** JSON Schema describing the tool arguments. */
                      inputSchema: {
                        [key: string]: unknown;
                      };
                      name: string;
                      title?: string;
                    } & {
                      [key: string]: unknown;
                    })[];
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    content: ({
                      data?: string;
                      mimeType?: string;
                      resource?: {
                        [key: string]: unknown;
                      };
                      text?: string;
                      /** @enum {string} */
                      type: "text" | "image" | "audio" | "resource";
                    } & {
                      [key: string]: unknown;
                    })[];
                    /** True when the tool execution failed; error details are in `content`. */
                    isError?: boolean;
                    /** Structured tool output matching the tool's declared output schema. */
                    structuredContent?: {
                      [key: string]: unknown;
                    };
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    /** Pagination cursor for the next page, absent on the last page. */
                    nextCursor?: string;
                    resources: ({
                      description?: string;
                      mimeType?: string;
                      name: string;
                      uri: string;
                    } & {
                      [key: string]: unknown;
                    })[];
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    contents: ({
                      blob?: string;
                      mimeType?: string;
                      text?: string;
                      uri: string;
                    } & {
                      [key: string]: unknown;
                    })[];
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    /** Pagination cursor for the next page, absent on the last page. */
                    nextCursor?: string;
                    prompts: ({
                      arguments?: ({
                        description?: string;
                        name: string;
                        required?: boolean;
                      } & {
                        [key: string]: unknown;
                      })[];
                      description?: string;
                      name: string;
                      title?: string;
                    } & {
                      [key: string]: unknown;
                    })[];
                  } & {
                    [key: string]: unknown;
                  })
                | ({
                    description?: string;
                    messages: ({
                      /** Content block, same shape as in `tools/call` results. */
                      content: {
                        [key: string]: unknown;
                      };
                      /** @enum {string} */
                      role: "user" | "assistant";
                    } & {
                      [key: string]: unknown;
                    })[];
                  } & {
                    [key: string]: unknown;
                  })
                | GenericRecord;
            }
          | {
              error: {
                /** JSON-RPC error code, e.g. -32700 parse error, -32600 invalid request, -32601 method not found, -32602 invalid params, -32603 internal error. */
                code: number;
                /** Optional additional error information. */
                data?: unknown;
                message: string;
              };
            }
        );
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "text/event-stream";
        headers?: {
          /** Session ID returned by the server in the `mcp-session-id` response header after a successful `initialize` request. Required for all subsequent requests within the same session. */
          "mcp-session-id"?: string;
          /** Standard Store API context token identifying the customer session. When provided, MCP tools operate in the context of that customer. Same semantics as all other Store API endpoints. */
          "sw-context-token"?: string;
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        body: {
          /** Request identifier. Omit for notifications (fire-and-forget). Present for requests that expect a response. */
          id?: string | number;
          /** @enum {string} */
          jsonrpc: "2.0";
          /** MCP method name. */
          method: string;
          /** Method-specific parameters, see the request variants. */
          params?: GenericRecord;
        } & (
          | {
              /** @constant */
              method?: "initialize";
              params: {
                /** Capabilities the client supports. */
                capabilities: {
                  [key: string]: unknown;
                };
                clientInfo: {
                  name: string;
                  version: string;
                };
                /** MCP protocol version the client supports, e.g. `2025-03-26`. */
                protocolVersion: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/list";
              params?: {
                /** Opaque pagination cursor from a previous `tools/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/call";
              params: {
                /** Tool arguments matching the tool's `inputSchema`. */
                arguments?: {
                  [key: string]: unknown;
                };
                /** Name of the tool to invoke, as returned by `tools/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/list";
              params?: {
                /** Opaque pagination cursor from a previous `resources/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/read";
              params: {
                /** URI of the resource to read, as returned by `resources/list`. */
                uri: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/list";
              params?: {
                /** Opaque pagination cursor from a previous `prompts/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/get";
              params: {
                /** Prompt arguments as string values. */
                arguments?: {
                  [key: string]: string;
                };
                /** Name of the prompt, as returned by `prompts/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "ping";
            }
        );
        response: string;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers?: {
          /** Session ID returned by the server in the `mcp-session-id` response header after a successful `initialize` request. Required for all subsequent requests within the same session. */
          "mcp-session-id"?: string;
          /** Standard Store API context token identifying the customer session. When provided, MCP tools operate in the context of that customer. Same semantics as all other Store API endpoints. */
          "sw-context-token"?: string;
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        body: {
          /** Request identifier. Omit for notifications (fire-and-forget). Present for requests that expect a response. */
          id?: string | number;
          /** @enum {string} */
          jsonrpc: "2.0";
          /** MCP method name. */
          method: string;
          /** Method-specific parameters, see the request variants. */
          params?: GenericRecord;
        } & (
          | {
              /** @constant */
              method?: "initialize";
              params: {
                /** Capabilities the client supports. */
                capabilities: {
                  [key: string]: unknown;
                };
                clientInfo: {
                  name: string;
                  version: string;
                };
                /** MCP protocol version the client supports, e.g. `2025-03-26`. */
                protocolVersion: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/list";
              params?: {
                /** Opaque pagination cursor from a previous `tools/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "tools/call";
              params: {
                /** Tool arguments matching the tool's `inputSchema`. */
                arguments?: {
                  [key: string]: unknown;
                };
                /** Name of the tool to invoke, as returned by `tools/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/list";
              params?: {
                /** Opaque pagination cursor from a previous `resources/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "resources/read";
              params: {
                /** URI of the resource to read, as returned by `resources/list`. */
                uri: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/list";
              params?: {
                /** Opaque pagination cursor from a previous `prompts/list` result. */
                cursor?: string;
              };
            }
          | {
              /** @constant */
              method?: "prompts/get";
              params: {
                /** Prompt arguments as string values. */
                arguments?: {
                  [key: string]: string;
                };
                /** Name of the prompt, as returned by `prompts/list`. */
                name: string;
              };
            }
          | {
              /** @constant */
              method?: "ping";
            }
        );
        response: never;
        responseCode: 202;
      };
  "storeApiMcpDelete delete /_mcp": {
    contentType?: "application/json";
    accept?: "application/json";
    headers: {
      /** Session ID of the session to close. Obtained from the `mcp-session-id` response header of the `initialize` request. */
      "mcp-session-id": string;
    };
    response: never;
    responseCode: 200;
  };
  "createCustomerAddress post /account/address": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** New languageId */
      languageId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "changePassword post /account/change-password": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "changeProfile post /account/change-profile": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    );
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "convertGuest post /account/convert-guest": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** New Password for the customer */
      password: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "readCustomer post /account/customer": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["NoneFieldsCriteria"];
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Parameter from the link in the confirmation mail sent in Step 1 */
      hash: string;
    };
    response: {
      /** @constant */
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
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["CustomerAddress"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "loginCustomer post /account/login": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "readNewsletterRecipient post /account/newsletter-recipient": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["AccountNewsletterRecipient"];
    responseCode: 200;
  };
  "sendRecoveryMail post /account/recovery-password": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
      /** Optional customer group registration request. The customer is created in the current sales channel group and this field stores the requested target group. The group must be available for registration in the current sales channel. */
      requestedGroupId?: string;
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
    );
    response: components["schemas"]["Customer"];
    responseCode: 200;
  };
  "registerConfirm post /account/register-confirm": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Email hash from the email received */
      em: string;
      /** Hash from the email received */
      hash: string;
    };
    response: never;
    responseCode: 200;
  };
  "listAdvancedProductCatalogCategories get /advanced-product-catalogs/categories": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["ListCategoryRouteResponse"];
    responseCode: 200;
  };
  "listAdvancedProductCatalogCategoriesPost post /advanced-product-catalogs/categories": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["ListCategoryRouteResponse"];
    responseCode: 200;
  };
  "removeAdvancedProductCatalogCategories delete /advanced-product-catalogs/categories/remove": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body: {
      /** The ID of the advanced product catalog */
      id: string;
      /** Array of category IDs to remove from the catalog */
      removedCategories: string[];
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "searchAdvancedProductCatalogCategories get /advanced-product-catalogs/categories/search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["ListCategoryRouteResponse"];
    responseCode: 200;
  };
  "saveAdvancedProductCatalog post /advanced-product-catalogs/save": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body: {
      /** Whether to automatically add new categories to the catalog */
      autoAddNewCategories?: boolean;
      /** The ID of the advanced product catalog (optional, will be generated if not provided) */
      id?: string;
      /** The ID of the organization */
      organizationId: string;
      /** Array of category IDs to associate with the catalog */
      selectedCategories?: string[];
    };
    response: {
      /** The ID of the created/updated advanced product catalog */
      id: string;
    };
    responseCode: 200;
  };
  "updateAdvancedProductCatalog patch /advanced-product-catalogs/save": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Language ID for localized content */
      "sw-language-id"?: string;
    };
    body: {
      /** Whether to automatically add new categories to the catalog */
      autoAddNewCategories?: boolean;
      /** The ID of the advanced product catalog (optional, will be generated if not provided) */
      id?: string;
      /** The ID of the organization */
      organizationId: string;
      /** Array of category IDs to associate with the catalog */
      selectedCategories?: string[];
    };
    response: {
      /** The ID of the created/updated advanced product catalog */
      id: string;
    };
    responseCode: 200;
  };
  "generateJWTAppSystemAppServer post /app-system/{name}/generate-token": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Number of items per page */
      limit?: number;
      /** Page number */
      p?: number;
    };
    response: {
      elements?: components["schemas"]["B2bComponentsApprovalRule"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "listApprovalRules post /approval-rule": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Number of items per page */
      limit?: number;
      /** Page number */
      p?: number;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsApprovalRule"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readApprovalRule get /approval-rule/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the approval rule to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bComponentsApprovalRule"];
    responseCode: 200;
  };
  "updateApprovalRule patch /approval-rule/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    response: components["schemas"]["B2bComponentsApprovalRule"];
    responseCode: 200;
  };
  "createApprovalRule post /approval-rule/create": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
    response: components["schemas"]["B2bComponentsApprovalRule"];
    responseCode: 200;
  };
  "readBreadcrumb get /breadcrumb/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "createBudget post /budget": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Whether the budget is active */
      active?: boolean;
      /** Whether budget allows approval */
      allowApproval?: boolean;
      /**
       * Format: float
       * Budget amount
       */
      amount: number;
      /** Cost centre */
      costCentre?: string;
      /**
       * Format: date
       * Budget end date
       */
      endDate?: string;
      /** Budget name */
      name: string;
      /** Notification configuration */
      notificationConfig?: {
        /**
         * Notification type
         * @enum {string}
         */
        type: "Percentage" | "SpecificDay" | "BeforeDay";
        /** Notification value */
        value: string;
      };
      /** Whether to send notifications */
      notify?: boolean;
      /** Organization unit IDs */
      organizationUnitIds?: string[];
      /**
       * Budget renewal type
       * @enum {string}
       */
      renewsType:
        | "None"
        | "Weekly"
        | "Monthly"
        | "Quarterly"
        | "Biannual"
        | "Yearly";
      /** Reviewer role ID */
      reviewerRoleId?: string;
      /** Whether to show remaining budget */
      showRemaining?: boolean;
      /**
       * Format: date
       * Budget start date
       */
      startDate: string;
      /** Technical name (unique identifier) */
      technicalName: string;
    };
    response: string[];
    responseCode: 201;
  };
  "readBudgetGet get /budget/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the budget to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bComponentsBudget"];
    responseCode: 200;
  };
  "readBudget post /budget/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the budget to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["B2bComponentsBudget"];
    responseCode: 200;
  };
  "updateBudget patch /budget/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the budget to be updated */
      id: string;
    };
    body: {
      /** Whether the budget is active */
      active?: boolean;
      /** Whether budget allows approval */
      allowApproval?: boolean;
      /**
       * Format: float
       * Budget amount
       */
      amount?: number;
      /** Cost centre */
      costCentre?: string;
      /** Employee IDs for notifications */
      employeeIds?: string[];
      /**
       * Format: date
       * Budget end date
       */
      endDate?: string;
      /** Budget name */
      name?: string;
      /** Notification configuration */
      notificationConfig?: {
        /**
         * Notification type
         * @enum {string}
         */
        type: "Percentage" | "SpecificDay" | "BeforeDay";
        /** Notification value */
        value: string;
      };
      /** Whether to send notifications */
      notify?: boolean;
      /** Organization unit IDs */
      organizationUnitIds?: string[];
      /**
       * Budget renewal type
       * @enum {string}
       */
      renewsType?:
        | "None"
        | "Weekly"
        | "Monthly"
        | "Quarterly"
        | "Biannual"
        | "Yearly";
      /** Reviewer role ID */
      reviewerRoleId?: string;
      /** Whether to show remaining budget */
      showRemaining?: boolean;
      /**
       * Format: date
       * Budget start date
       */
      startDate?: string;
      /** Technical name (unique identifier) */
      technicalName?: string;
    };
    response: string[];
    responseCode: 200;
  };
  "storeBudgetRecipients post /budget/{id}/recipients": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the budget to add recipients to */
      id: string;
    };
    body: {
      /** Employee IDs to add as budget recipients */
      employeeIds: [string, ...string[]];
    };
    response: never;
    responseCode: 204;
  };
  "deleteBudgetRecipients delete /budget/{id}/recipients": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the budget to remove recipients from */
      id: string;
    };
    body: {
      /** Employee IDs to remove from budget recipients */
      employeeIds: [string, ...string[]];
    };
    response: never;
    responseCode: 204;
  };
  "readBudgetsGet get /budgets": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Number of items to return */
      limit?: number;
      /** Page number */
      page?: number;
    };
    response: {
      elements?: components["schemas"]["B2bComponentsBudget"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readBudgets post /budgets": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsBudget"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "deleteBudgets delete /budgets/delete": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Budget IDs to delete */
      ids: [string, ...string[]];
    };
    response: never;
    responseCode: 204;
  };
  "readCategoryListGet get /category": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements?: components["schemas"]["Category"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCategoryList post /category": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Category"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCategoryGet get /category/{navigationId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character */
      slots?: string;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of the category to be fetched */
      navigationId: string;
    };
    response: components["schemas"]["Category"];
    responseCode: 200;
  };
  "readCategory post /category/{navigationId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character */
      slots?: string;
    };
    pathParams: {
      /** Identifier of the category to be fetched */
      navigationId: string;
    };
    body: components["schemas"]["ProductListingCriteria"];
    response: components["schemas"]["Category"];
    responseCode: 200;
  };
  "getCheckoutBudgetStatistic get /checkout/budget/{budgetId}/statistic": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Quote ID to calculate statistics for (optional) */
      quoteId?: string;
    };
    pathParams: {
      /** Budget ID to get statistics for */
      budgetId: string;
    };
    response: {
      data?: {
        /** Whether budget allows approval */
        allowApproval: boolean;
        /**
         * Format: float
         * Budget total amount
         */
        amount?: number;
        /**
         * Format: float
         * Currency factor
         */
        factor?: number;
        /** Whether budget is exceeded */
        isExceeded: boolean;
        /**
         * Format: float
         * Budget used amount
         */
        usedAmount?: number;
      };
    };
    responseCode: 200;
  };
  "getCheckoutBudgetStatisticPost post /checkout/budget/{budgetId}/statistic": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Budget ID to get statistics for */
      budgetId: string;
    };
    body: {
      /** Quote ID to calculate statistics for (optional) */
      quoteId?: string;
    };
    response: {
      data?: {
        /** Whether budget allows approval */
        allowApproval: boolean;
        /**
         * Format: float
         * Budget total amount
         */
        amount?: number;
        /**
         * Format: float
         * Currency factor
         */
        factor?: number;
        /** Whether budget is exceeded */
        isExceeded: boolean;
        /**
         * Format: float
         * Budget used amount
         */
        usedAmount?: number;
      };
    };
    responseCode: 200;
  };
  "getCheckoutAvailableBudgets get /checkout/budgets": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      budgets?: components["schemas"]["B2bComponentsBudget"][];
    };
    responseCode: 200;
  };
  "getCheckoutAvailableBudgetsPost post /checkout/budgets": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: GenericRecord;
    response: {
      budgets?: components["schemas"]["B2bComponentsBudget"][];
    };
    responseCode: 200;
  };
  "readCart get /checkout/cart": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "readCmsGet get /cms/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character. */
      slots?: string;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of the CMS page to be resolved */
      id: string;
    };
    response: components["schemas"]["CmsPage"];
    responseCode: 200;
  };
  "readCms post /cms/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      /**
       * Identifier of the navigation page. Can be used to override the configuration.
       *     Take a look at the settings of a category containing a concat form in the administration.
       */
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SalesChannelContext"];
    responseCode: 200;
  };
  "updateContext patch /context": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "contextGatewayGet get /context/gateway": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
      appName: string;
      data?: GenericRecord;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "contextGateway post /context/gateway": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      appName: string;
      data?: GenericRecord;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "readCookieGroups get /cookie-groups": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["CookieRouteResponse"];
    responseCode: 200;
  };
  "readCountryGet get /country": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements?: components["schemas"]["Country"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCountry post /country": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Country"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCountryStateGet get /country-state/{countryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      countryId: string;
    };
    response: {
      elements?: components["schemas"]["CountryState"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readCountryState post /country-state/{countryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "readCurrencyGet get /currency": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the NoneFieldsCriteria schema (see #/components/schemas/NoneFieldsCriteria). */
      _criteria?: components["parameters"]["CompressedNoneFieldsCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: components["schemas"]["Currency"][];
    responseCode: 200;
  };
  "readCurrency post /currency": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["NoneFieldsCriteria"];
    response: components["schemas"]["Currency"][];
    responseCode: 200;
  };
  "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["WishlistLoadRouteResponse"];
    responseCode: 200;
  };
  "addProductOnWishlist post /customer/wishlist/add/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** List product id */
      productIds?: string[];
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "addCustomizedProductToCart post /customized-products/add-to-cart": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["SwagCustomizedProductsAddToCartRequest"];
    response: never;
    responseCode: 204;
  };
  "customizedProductConfigurationShare post /customized-products/configuration/create-share": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["SwagCustomizedProductsCreateConfigurationShareRequest"];
    response: components["schemas"]["SwagCustomizedProductsConfigurationShareResponse"];
    responseCode: 200;
  };
  "reorderCustomizedProduct post /customized-products/reorder/{orderId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Id of the order to repeat. */
      orderId: string;
    };
    response: never;
    responseCode: 204;
  };
  "uploadCustomizedProductCustomerFile post /customized-products/upload": {
    contentType: "multipart/form-data";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["SwagCustomizedProductsUploadRequest"];
    response: components["schemas"]["SwagCustomizedProductsUploadResponse"];
    responseCode: 200;
  };
  "downloadGet get /document/download/{documentId}/{deepLinkCode}":
    | {
        contentType?: "application/json";
        accept: "application/pdf";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        query?: {
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          email?: string;
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          zipcode?: string;
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        response: Blob;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "application/xml";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        query?: {
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          email?: string;
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          zipcode?: string;
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        response: string;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "text/html";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        query?: {
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          email?: string;
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          zipcode?: string;
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        response: string;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        query?: {
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          email?: string;
          /** Required for guest orders to verify the user; ignored for orders with logged-in user. */
          zipcode?: string;
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        response: never;
        responseCode: 204;
      };
  "download post /document/download/{documentId}/{deepLinkCode}":
    | {
        contentType?: "application/json";
        accept: "application/pdf";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        body?: {
          email?: string;
          zipcode?: string;
        };
        response: Blob;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "application/xml";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        body?: {
          email?: string;
          zipcode?: string;
        };
        response: string;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept: "text/html";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        body?: {
          email?: string;
          zipcode?: string;
        };
        response: string;
        responseCode: 200;
      }
    | {
        contentType?: "application/json";
        accept?: "application/json";
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          deepLinkCode: string;
          documentId: string;
        };
        body?: {
          email?: string;
          zipcode?: string;
        };
        response: never;
        responseCode: 204;
      };
  "dsrAccountUpdateDefaultInfo post /dsr/account/update-default-info": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "attendeeRespondInvitation patch /dsr/appointment/{appointmentId}/attendee/respond-invitation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "getSharingShoppingList get /dsr/appointment/{appointmentId}/shopping-lists": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** The appointment id you are joining */
      appointmentId: string;
    };
    response: {
      /**
       * The api alias of the API
       * @default dsr.appointment.load-shopping-lists
       */
      apiAlias?: string;
      /**
       * @example {
       *       "apiAlias": "dsr.appointment.load-shopping-lists",
       *       "data": {
       *         "01938f89c632709ba4d65eb53604bf5b": {
       *           "quantity": "1"
       *         },
       *         "01938f89c8647036a617b7d88e1e24f5": {
       *           "quantity": "1"
       *         },
       *         "01938f8a23d47305b1e289163cea5074": {
       *           "quantity": "1"
       *         }
       *       }
       *     }
       */
      data?: GenericRecord;
    };
    responseCode: 200;
  };
  "dsrReadAppointmentSettings get /dsr/appointment/{presentationPath}/basic-setting": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Presentation path */
      presentationPath: string;
    };
    body?: {
      /** The name of the attendee */
      attendeeName?: string;
      /** Identifier of the current attendee you want log in as */
      currentAttendeeId?: string;
    };
    response: components["schemas"]["JoinAppointmentResponse"];
    responseCode: 200;
  };
  "updateAttendee patch /dsr/appointment/attendee": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["AttendeeProductCollectionLastSeenResponse"];
    responseCode: 200;
  };
  "getPresentationStructure get /dsr/appointment/presentation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["PresentationStructure"];
    responseCode: 200;
  };
  "getSlideData get /dsr/appointment/presentation/{presentationCmsPageId}/slide/{sectionId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Presentation CMS page id for which the data is requested */
      presentationCmsPageId: string;
      /** CMS section id for which the data is requested */
      sectionId: string;
    };
    body: components["schemas"]["Criteria"] & {
      interaction?: boolean;
    };
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "getClientPresentationState get /dsr/appointment/presentation/state": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["ClientPresentationStateResponse"];
    responseCode: 200;
  };
  "createAppointmentRequest post /dsr/appointment/request": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "dsrAutomaticLogin post /dsr/customer/automatic-login": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "dsrGenerateLoginToken post /dsr/customer/generate-login-token": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      /** @default dsr.storefront-login.response */
      apiAlias?: string;
      token?: string;
    };
    responseCode: 200;
  };
  "dsrMigrateVisitorSession post /dsr/customer/migrate-visitor-session": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: never;
    responseCode: 204;
  };
  "dsrLoadCustomerWishlistProductIds post /dsr/customer/wishlist-product-ids": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      /** @default array_struct */
      apiAlias?: string;
      wishlistProductIds?: string[];
    };
    responseCode: 200;
  };
  "addInteraction post /dsr/interaction": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["CreateInteractionRequestBody"];
    response: never;
    responseCode: 200;
  };
  "dsrProductListing post /dsr/product-listing": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      productId: string;
    };
    response: components["schemas"]["ProductPageResult"];
    responseCode: 200;
  };
  "resolveQuickviewPage get /dsr/quickview/{productId}/{cmsPageLayoutId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      layoutName: string;
    };
    response: components["schemas"]["CmsPage"];
    responseCode: 200;
  };
  "readEmployees get /employee": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bEmployee"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readEmployeesPOST post /employee": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bEmployee"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readB2bEmployee get /employee/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the employee to be read */
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "getEmployeeContextsGet get /employee/context": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["EmployeeAvailableContextsResponse"];
    responseCode: 200;
  };
  "getEmployeeContexts post /employee/context": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["EmployeeAvailableContextsResponse"];
    responseCode: 200;
  };
  "cancelEmployeeContext post /employee/context/cancel": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: never;
    responseCode: 204;
  };
  "switchEmployeeContext post /employee/context/switch": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Identifier of the employee identity (membership) to activate. */
      employeeId: string;
      /** When present, sets (true) or clears (false) this context as the account default. */
      setDefault?: boolean;
    };
    response: {
      /** Define the URL which browser will be redirected to */
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "createEmployee post /employee/create": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "handlePaymentMethodGet get /handle-payment": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
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
  "handlePaymentMethod post /handle-payment": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      isPayPalExpressCheckout?: boolean;
      paypalOrderId?: string;
    };
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
  "readLandingPageGet get /landing-page/{landingPageId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of the landing page. */
      landingPageId: string;
    };
    response: components["schemas"]["LandingPage"];
    responseCode: 200;
  };
  "readLandingPage post /landing-page/{landingPageId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "readLanguagesGet get /language": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements: components["schemas"]["Language"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readLanguages post /language": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["Language"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "renderLegalGuaranteeNotice get /legal-guarantee-notice": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      link: string | null;
      svg: string | null;
    };
    responseCode: 200;
  };
  "readMediaGet get /media": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
      /** Identifier (UUID) of the media entity to be fetched. */
      "ids[]": string[];
    };
    response: components["schemas"]["Media"][];
    responseCode: 200;
  };
  "readMedia post /media": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Identifier (UUID) of the media entity to be fetched. */
      ids: string[];
    };
    response: components["schemas"]["Media"][];
    responseCode: 200;
  };
  "readNavigationGet get /navigation/{activeId}/{rootId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the NoneFieldsCriteria schema (see #/components/schemas/NoneFieldsCriteria). */
      _criteria?: components["parameters"]["CompressedNoneFieldsCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Return the categories as a tree or as a flat list. */
      buildTree?: GenericRecord[];
      /** Determines the depth of fetched navigation levels. */
      depth?: number;
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of the active category in the navigation tree (if not used, just set to the same as rootId). */
      activeId: string | components["schemas"]["NavigationType"];
      /** Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree. */
      rootId: string | components["schemas"]["NavigationType"];
    };
    response: components["schemas"]["NavigationRouteResponse"];
    responseCode: 200;
  };
  "readNavigation post /navigation/{activeId}/{rootId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the active category in the navigation tree (if not used, just set to the same as rootId). */
      activeId: string | components["schemas"]["NavigationType"];
      /** Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree. */
      rootId: string | components["schemas"]["NavigationType"];
    };
    body: components["schemas"]["NoneFieldsCriteria"] & {
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Email hash parameter from the link in the confirmation mail */
      em: string;
      /** Hash parameter from link the in the confirmation mail */
      hash: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "subscribeToNewsletter post /newsletter/subscribe": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** City */
      city?: string;
      /** Custom field data that should be added to the subscription. */
      customFields?: CustomFields | null;
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
      zipCode?: string;
    };
    response: {
      status: components["schemas"]["NewsletterStatus"];
      /** Indicates whether the subscribe request was successful. */
      success: boolean;
    };
    responseCode: 200;
  };
  "unsubscribeToNewsletter post /newsletter/unsubscribe": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Email address that should be removed from the mailing lists. */
      email: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "readOrder post /order": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["NoneFieldsCriteria"] & {
      /** Check if the payment method of the order is still changeable. */
      checkPromotion?: boolean;
      /**
       * Format: email
       * The email address of the customer. Pass this value to allow for guest user authentification. Not required, if a user (guest or not) is already logged in.
       */
      email?: string;
      /** Pass the deepLinkCode criteria filter to allow for guest user authentification. Not required, if a user (guest or not) is already logged in. */
      filter?: {
        /** @enum {string} */
        field: "deepLinkCode";
        /** @enum {string} */
        type: "equals";
        value: string;
      }[];
      /** If set and when handling a guest order, a context token will be returned in the response header with a logged-in session. */
      login?: boolean;
      /** The zip/postal code of the billing address of the customer. Pass this value to allow for guest user authentification. Not required, if a user (guest or not) is already logged in. */
      zipcode?: string;
    };
    response: components["schemas"]["OrderRouteResponse"];
    responseCode: 200;
  };
  "createOrderReturn post /order/{orderId}/return": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the order */
      orderId: string;
    };
    body: {
      includesShippingCosts?: boolean;
      internalComment?: string;
      /** A list of order line items to return. */
      lineItems: {
        internalComment?: string;
        orderLineItemId: string;
        quantity: number;
        reasonId?: string;
      }[];
    };
    response: components["schemas"]["OrderReturn"];
    responseCode: 200;
  };
  "orderDownloadFile get /order/download/{orderId}/{downloadId}": {
    contentType?: "application/json";
    accept: "application/octet-stream";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** The identifier of the order to be canceled. */
      orderId: string;
    };
    response: components["schemas"]["StateMachineState"];
    responseCode: 200;
  };
  "createOrganizationUnit post /organization-unit": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Identifier (UUID) of the addresses for billing. */
      billingAddressIds: string[];
      /** Identifier (UUID) of the default billing address */
      defaultBillingAddressId: string;
      /** Identifier (UUID) of the default shipping address */
      defaultShippingAddressId: string;
      /** Identifier (UUID) of employees. */
      employeeIds?: string[];
      /** Organization unit name */
      name: string;
      /** Identifier (UUID) of the parent organization unit, to create this unit as a sub-organization. Optional; can only be set on creation and is immutable afterwards. */
      parentId?: string;
      /** Identifier (UUID) of the payment methods. */
      paymentMethodIds: string[];
      /** Identifier (UUID) of the addresses for shipping. */
      shippingAddressIds: string[];
      /** Identifier (UUID) of the shipping methods. */
      shippingMethodIds: string[];
      /** Stable, human-readable technical identifier of the organization unit. Optional. */
      technicalName?: string;
    };
    response: {
      id: string;
    };
    responseCode: 201;
  };
  "removeOrganizationUnits delete /organization-unit": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** Organization Unit ids */
      ids: string[];
    };
    response: never;
    responseCode: 204;
  };
  "readOrganizationUnit post /organization-unit/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the Organization Unit to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bComponentsOrganization"];
    responseCode: 200;
  };
  "updateOrganizationUnit patch /organization-unit/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the Organization Unit to be fetched */
      id: string;
    };
    body: {
      /** Identifier (UUID) of the addresses for billing. */
      billingAddressIds?: string[];
      /** Identifier (UUID) of the default billing address */
      defaultBillingAddressId?: string;
      /** Identifier (UUID) of the default shipping address */
      defaultShippingAddressId?: string;
      /** Identifier (UUID) of employees. */
      employeeIds?: string[];
      /** Organization unit name */
      name?: string;
      /** Identifier (UUID) of the payment methods. */
      paymentMethodIds?: string[];
      /** Identifier (UUID) of the addresses for shipping. */
      shippingAddressIds?: string[];
      /** Identifier (UUID) of the shipping methods. */
      shippingMethodIds?: string[];
      /** Stable, human-readable technical identifier of the organization unit. Optional. */
      technicalName?: string;
    };
    response: {
      id: string;
    };
    responseCode: 201;
  };
  "readOrganizationUnits post /organization-units": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsOrganization"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readPaymentMethodGet get /payment-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
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
  "readPaymentMethod post /payment-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Cancel URL for the order experience context */
      cancelUrl?: string;
      /** Use an existing order id to create PayPal order */
      orderId?: string;
      /**
       * The PayPal product that should be used
       * @default ppcp
       * @enum {string}
       */
      product?: "acdc" | "applepay" | "googlepay" | "ppcp" | "spb" | "venmo";
      /** Return URL for the order experience context */
      returnUrl?: string;
    };
    response: {
      token: string;
    };
    responseCode: 200;
  };
  "createPayPalExpressOrder post /paypal/express/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: never;
    responseCode: 200;
  };
  "payPalCreateOrder post /paypal/express/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      token: string;
    };
    responseCode: 200;
  };
  "preparePayPalExpressCheckout post /paypal/express/prepare-checkout": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** ID of the paypal order */
      token?: string;
    };
    response: {
      redirectUrl?: string;
    };
    responseCode: 200;
  };
  "payPalPrepare post /paypal/express/prepare-checkout": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      token: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
  "handlePayPalExpressShippingCallback post /paypal/express/shipping-callback/{salesChannelId}/{token}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: components["schemas"]["paypal_v2_order_shipping_callback"];
    response: components["schemas"]["paypal_v2_order"];
    responseCode: 200;
  };
  "setPaymentMethodEligibility post /paypal/payment-method-eligibility": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      token?: string;
    };
    responseCode: 200;
  };
  "paypalVaultClear post /paypal/vault/clear": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the pending order to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["B2bComponentsPendingOrder"];
    responseCode: 200;
  };
  "approvePendingOrder post /pending-order/{id}/approve": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "fetchPendingOrderPaymentMethods post /pending-order/{id}/payment-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the pending order to be fetched */
      id: string;
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
  "requestOrderApproval post /pending-orders/request": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: components["schemas"]["B2bComponentsPendingOrder"];
    responseCode: 200;
  };
  "readPermissions get /permission": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "addPermission post /permission": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Optional dependencies for the new permission */
      dependencies?: string[];
      /** Group of the new permission */
      group?: string;
      /** Name of the new permission */
      name?: string;
    };
    response: {
      elements?: components["schemas"]["B2bPermission"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readProductGet get /product": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements: components["schemas"]["Product"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readProduct post /product": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Access Key */
      accessKey: string;
      /** File Name */
      fileName: string;
    };
    response: never;
    responseCode: 200;
  };
  "readProductListingGet get /product-listing/{categoryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Determines if the response must contain a SeoUrl entity for a product entity */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Resets all aggregations in the criteria. This parameter is a flag, the value has no effect. */
      "no-aggregations"?: components["parameters"]["noAggregations"];
      /** If this flag is set, no products are fetched. Sorting and associations are also ignored. This parameter is a flag, the value has no effect. */
      "only-aggregations"?: components["parameters"]["onlyAggregations"];
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of a category. */
      categoryId: string;
    };
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "readProductListing post /product-listing/{categoryId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Determines if the response must contain a SeoUrl entity for a product entity */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** The page number to fetch. */
      p?: number;
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
  "readProductDetailGet get /product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the NoneFieldsCriteria schema (see #/components/schemas/NoneFieldsCriteria). */
      _criteria?: components["parameters"]["CompressedNoneFieldsCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Instructs Shopware to skip loading the CMS page data */
      skipCmsPage?: boolean;
      /** Instructs Shopware to skip loading the configurator data */
      skipConfigurator?: boolean;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: components["schemas"]["ProductDetailResponse"];
    responseCode: 200;
  };
  "readProductDetail post /product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Instructs Shopware to skip loading the CMS page data */
      skipCmsPage?: boolean;
      /** Instructs Shopware to skip loading the configurator data */
      skipConfigurator?: boolean;
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    body?: components["schemas"]["NoneFieldsCriteria"];
    response: components["schemas"]["ProductDetailResponse"];
    responseCode: 200;
  };
  "readProductCrossSellingsGet get /product/{productId}/cross-selling": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: components["schemas"]["CrossSellingElementCollection"];
    responseCode: 200;
  };
  "readProductCrossSellings post /product/{productId}/cross-selling": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: components["schemas"]["CrossSellingElementCollection"];
    responseCode: 200;
  };
  "searchProductVariantIdsGet get /product/{productId}/find-variant": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
      /** The options parameter for the variant to find. Array of option IDs. */
      "options[]": string[];
      /** The id of the option group that has been switched. */
      switchedGroup?: string;
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: components["schemas"]["FindProductVariantRouteResponse"];
    responseCode: 200;
  };
  "searchProductVariantIds post /product/{productId}/find-variant": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    body: {
      options:
        | string[]
        | {
            [key: string]: string;
          };
      /** The id of the option group that has been switched. */
      switchedGroup?: string;
    };
    response: components["schemas"]["FindProductVariantRouteResponse"];
    responseCode: 200;
  };
  "renderGaranLabel get /product/{productId}/garan-label": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Product ID */
      productId: string;
    };
    response: {
      svg: string | null;
    };
    responseCode: 200;
  };
  "saveProductReview post /product/{productId}/review": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "readProductReviewsGet get /product/{productId}/reviews": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** Identifier of the product. */
      productId: string;
    };
    response: {
      elements?: components["schemas"]["ProductReview"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readProductReviews post /product/{productId}/reviews": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "readProductsPurchaseLimit get /product/purchase-limit": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
      /** List of product IDs to fetch quantity limits for. */
      "ids[]": string[];
    };
    response: components["schemas"]["ProductPurchaseLimit"][];
    responseCode: 200;
  };
  "getQuote get /quote/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to be fetched */
      id: string;
    };
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "readQuote post /quote/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"];
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "deleteDraftQuote delete /quote/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the draft quote to be deleted */
      id: string;
    };
    response: never;
    responseCode: 204;
  };
  "removeMessageInQuote delete /quote/{id}/comment/{commentId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the comment to delete */
      commentId: string;
      /** Identifier of the quote */
      id: string;
    };
    body: {
      /** Draft version identifier of the quote currently shown in storefront */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "editMessageInQuote patch /quote/{id}/comment/{commentId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the comment to edit */
      commentId: string;
      /** Identifier of the quote */
      id: string;
    };
    body: {
      /** Updated comment content */
      comment: string;
      /** Identifier of the related line item history entry */
      lineItemHistoryId: string;
      /** Draft version identifier of the quote currently shown in storefront */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "replyMessageInQuote post /quote/{id}/comment/reply": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote */
      id: string;
    };
    body: {
      /** Reply content */
      comment: string;
      /** Identifier of the line item history entry being replied to */
      lineItemHistoryId: string;
      /** Draft version identifier of the quote currently shown in storefront */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "switchPaymentOrShippingMethod post /quote/{id}/configure": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to be reinvited */
      id: string;
    };
    body: {
      /** Message content */
      comment: string;
      /** Identifier of the quote line item that owns the new comment */
      lineItemId: string;
      /** Draft version identifier of the quote currently shown in storefront */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "createDraftQuoteVersion post /quote/{id}/draft-version": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to create a draft version for */
      id: string;
    };
    response: {
      versionId?: string;
    };
    responseCode: 200;
  };
  "deleteDraftQuoteVersion delete /quote/{id}/draft-version": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote whose current draft version should be deleted */
      id: string;
    };
    body: {
      /** Draft version identifier to delete. This must be set to the versionId returned by POST /quote/{id}/draft-version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "saveDraftQuoteVersion post /quote/{id}/draft-version/save": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose current draft version should be merged into live */
      id: string;
    };
    body: {
      /** Draft version identifier to merge. This must be set to the versionId returned by POST /quote/{id}/draft-version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "markQuoteHistoryAsSeen post /quote/{id}/history/read": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose history entries will be marked as seen */
      id: string;
    };
    body?: {
      /** Optional quote comment identifiers to mark as seen for the quoteLineItemId. When omitted or empty, all unread comments for the quoteLineItemId are marked as seen. */
      commentIds?: string[];
      /** Optional quote history identifiers to mark as seen. When omitted or empty, all unread quote history entries are marked as seen. */
      historyIds?: string[];
      /** Optional quote line item history identifiers to mark as seen. When omitted or empty, all unread history entries for the quoteLineItemId are marked as seen. */
      lineItemHistoryIds?: string[];
      /** Optional quote line item identifier whose line item history entries should be marked as seen */
      quoteLineItemId?: string;
    };
    response: {
      /** Number of unread quote comments remaining after the update when quoteLineItemId is provided */
      countUnReadComment?: number;
      /** Number of unread history entries remaining after the update */
      countUnReadHistory: number;
    };
    responseCode: 200;
  };
  "readQuoteLineItemHistory post /quote/{id}/line-item-history-listing": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose line item history should be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"] & {
      /** Optional draft version identifier used to load quote line item history */
      versionId?: string;
    };
    response: {
      elements?: components["schemas"]["QuoteLineItemHistory"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readQuoteLineItems post /quote/{id}/line-item-listing": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose line items should be fetched */
      id: string;
    };
    body?: components["schemas"]["Criteria"] & {
      /** Optional draft version identifier used to load quote line items */
      versionId?: string;
    };
    response: {
      elements?: components["schemas"]["QuoteLineItem"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "addQuoteLineItem post /quote/{id}/line-item/add": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to be updated */
      id: string;
    };
    body: {
      /** Identifier of the product to add */
      productId: string;
      /** Quantity to add */
      quantity?: number;
      /** Identifier of the quote version to modify. Must not be the live or snapshot version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "replaceQuoteNotificationEmployees post /quote/{id}/notification-employees": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose employee notification recipients should be updated */
      id: string;
    };
    body:
      | {
          /** Employee identifiers to remove from quote notification recipients. */
          deletedEmployeeIds?: string[];
          /** Employee identifiers to add as quote notification recipients. */
          selectedEmployeeIds?: string[];
        }
      | unknown
      | unknown;
    response: never;
    responseCode: 204;
  };
  "createOrderFromQuote post /quote/{id}/order": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
  "markMessagesAsReadInQuote post /quote/{id}/read-message": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote whose messages will be marked as read */
      id: string;
    };
    body: {
      /** Draft version identifier of the quote currently shown in storefront */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "requestChangeQuote post /quote/{id}/request-change": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to send message */
      id: string;
    };
    body?: {
      /** Message content */
      comment?: string;
    };
    response: never;
    responseCode: 204;
  };
  "sendDraftQuoteRequest post /quote/{id}/send-request": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the draft quote to be sent */
      id: string;
    };
    response: never;
    responseCode: 204;
  };
  "readQuoteDocuments post /quote/{quoteId}/documents": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote to fetch documents for */
      quoteId: string;
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["QuoteDocument"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "editQuoteLineItem post /quote/{quoteId}/line-item/{lineItemId}/edit": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote line item to be updated */
      lineItemId: string;
      /** Identifier of the quote to be updated */
      quoteId: string;
    };
    body: {
      /** New quantity of the line item */
      quantity?: number;
      /** Requested price of the line item. Send 0 to reset it. */
      requestedPrice?: number;
      /** Identifier of the quote version to modify. Must not be the live or snapshot version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "patchEditQuoteLineItem patch /quote/{quoteId}/line-item/{lineItemId}/edit": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote line item to be updated */
      lineItemId: string;
      /** Identifier of the quote to be updated */
      quoteId: string;
    };
    body: {
      /** New quantity of the line item */
      quantity?: number;
      /** Requested price of the line item. Send 0 to reset it. */
      requestedPrice?: number;
      /** Identifier of the quote version to modify. Must not be the live or snapshot version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "removeQuoteLineItem post /quote/{quoteId}/line-item/{lineItemId}/remove": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote line item to remove */
      lineItemId: string;
      /** Identifier of the quote to be updated */
      quoteId: string;
    };
    body: {
      /** Identifier of the quote version to modify. Must not be the live or snapshot version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "deleteQuoteLineItem delete /quote/{quoteId}/line-item/{lineItemId}/remove": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the quote line item to remove */
      lineItemId: string;
      /** Identifier of the quote to be updated */
      quoteId: string;
    };
    body: {
      /** Identifier of the quote version to modify. Must not be the live or snapshot version. */
      versionId: string;
    };
    response: never;
    responseCode: 204;
  };
  "searchQuoteProductsGet get /quote/{quoteId}/product-search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Search term used by the core product search route */
      search?: string;
      /** Optional draft version identifier used to check quote line items in the current storefront edit draft */
      versionId?: string;
    };
    pathParams: {
      /** Identifier of the quote used to annotate the product search result */
      quoteId: string;
    };
    response: {
      elements?: (components["schemas"]["Product"] & {
        extensions?: {
          quoteLineItem?: {
            /** @example cart_order_id */
            apiAlias?: string;
            id?: string;
          };
        };
      })[];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "searchQuoteProducts post /quote/{quoteId}/product-search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the quote used to annotate the product search result */
      quoteId: string;
    };
    body?: components["schemas"]["Criteria"] & {
      /** Optional draft version identifier used to check quote line items in the current storefront edit draft */
      draftVersionId?: string;
    };
    response: {
      elements?: (components["schemas"]["Product"] & {
        extensions?: {
          quoteLineItem?: {
            /** @example cart_order_id */
            apiAlias?: string;
            id?: string;
          };
        };
      })[];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "downloadQuoteDocument post /quote/document/download/{documentId}/{deepLinkCode}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Deep link code of the quote document */
      deepLinkCode: string;
      /** Identifier of the quote document to be reinvited */
      documentId: string;
    };
    response: never;
    responseCode: 200;
  };
  "requestQuote post /quote/request": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Message content */
      comment?: string;
    };
    response: components["schemas"]["Quote"];
    responseCode: 200;
  };
  "readQuotes post /quotes": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["Quote"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "sendRevocationRequestMail post /revocation-request-form": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Type of the content management page. */
      cmsPageType?: string;
      /** The message of the revocation request form. */
      comment?: string;
      /** The number of the contract. */
      contractNumber: string;
      /** Email address. */
      email: string;
      /** Entity name for slot config. */
      entityName?: string;
      /** First name. This field may be required depending on the system settings. */
      firstName?: string;
      /** Last name. This field may be required depending on the system settings. */
      lastName?: string;
      /**
       * Identifier of the navigation page. Can be used to override the configuration.
       *     Take a look at the settings of a category containing a revocation form in the administration.
       */
      navigationId?: string;
      /** Identifier of the cms element. */
      slotId?: string;
    };
    response: never;
    responseCode: 200;
  };
  "readRoles get /role": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      elements?: components["schemas"]["B2bComponentsRole"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readRolesPOST post /role": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsRole"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readRole get /role/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** Id of the roleId to be set as default */
      id?: string;
    };
    response: never;
    responseCode: 204;
  };
  "readSalutationGet get /salutation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements?: components["schemas"]["Salutation"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readSalutation post /salutation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
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
        headers?: {
          /** Instructs Shopware to return the response in the given language. */
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          /** Dynamic hook which used to build the hook name */
          hook: string;
        };
        response: never;
        responseCode: 204;
      };
  "searchPageGet get /search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Resets all aggregations in the criteria. This parameter is a flag, the value has no effect. */
      "no-aggregations"?: components["parameters"]["noAggregations"];
      /** If this flag is set, no products are fetched. Sorting and associations are also ignored. This parameter is a flag, the value has no effect. */
      "only-aggregations"?: components["parameters"]["onlyAggregations"];
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search?: string;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "searchPage post /search": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean;
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** The page number to fetch. */
      p?: number;
    };
    body: {
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search?: string;
    } & components["schemas"]["ProductListingCriteria"] &
      components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "searchSuggestGet get /search-suggest": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query: {
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings. */
      limit?: number;
      /** Filter by manufacturers. List of manufacturer identifiers separated by a `|`. */
      manufacturer?: string;
      /** Filters by a maximum product price. Has to be higher than the `min-price` filter. */
      "max-price"?: number;
      /** Filters by a minimum product price. Has to be lower than the `max-price` filter. */
      "min-price"?: number;
      /** Resets all aggregations in the criteria. This parameter is a flag, the value has no effect. */
      "no-aggregations"?: components["parameters"]["noAggregations"];
      /** If this flag is set, no products are fetched. Sorting and associations are also ignored. This parameter is a flag, the value has no effect. */
      "only-aggregations"?: components["parameters"]["onlyAggregations"];
      /** Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results. */
      order?: string;
      /** Search result page */
      p?: number;
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** Filters products by their properties. List of property identifiers separated by a `|`. */
      properties?: string;
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Filter products with a minimum average rating. */
      rating?: number;
      /** By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect. */
      "reduce-aggregations"?: string | null;
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search: string;
      /** Filters products that are marked as shipping-free. */
      "shipping-free"?: boolean;
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "searchSuggest post /search-suggest": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** The page number to fetch. */
      p?: number;
    };
    body: {
      /** Using the search parameter, the server performs a text search on all records based on their data model and weighting as defined in the entity definition using the SearchRanking flag. */
      search: string;
    } & components["schemas"]["ProductListingCriteria"] &
      components["schemas"]["ProductListingFlags"];
    response: components["schemas"]["ProductListingResult"];
    responseCode: 200;
  };
  "readSeoUrlGet get /seo-url": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      elements: components["schemas"]["SeoUrl"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readSeoUrl post /seo-url": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["SeoUrl"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readShippingCostsByCart get /shipping-cost/cart": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    response: {
      deliveryDate: {
        /** Format: date-time */
        earliest?: string;
        /** Format: date-time */
        latest?: string;
      };
      shippingCost: components["schemas"]["CalculatedPrice"];
      shippingMethod: components["schemas"]["ShippingMethod"];
    }[];
    responseCode: 200;
  };
  "readShippingCostByProduct get /shipping-cost/product/{productId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    pathParams: {
      /** The product identifier. */
      productId: string;
    };
    response: {
      deliveryDate: {
        /** Format: date-time */
        earliest?: string;
        /** Format: date-time */
        latest?: string;
      };
      shippingCost: components["schemas"]["CalculatedPrice"];
      shippingMethod: components["schemas"]["ShippingMethod"];
    }[];
    responseCode: 200;
  };
  "readShippingMethodGet get /shipping-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Compressed and encoded criteria object. Format: base64url(gzip(json_encode(criteria))). This parameter allows passing complex criteria as a single encoded string instead of multiple query parameters. The criteria object should be JSON-encoded, then gzipped, and finally base64url-encoded. The criteria object structure is defined in the Criteria schema (see #/components/schemas/Criteria). */
      _criteria?: components["parameters"]["CompressedCriteria"];
      "aggregations[]"?: components["parameters"]["criteriaAggregations"];
      associations?: components["parameters"]["criteriaAssociations"];
      /** Specify the fields that should be excluded from the response for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Note that the exclude fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      excludes?: components["parameters"]["criteriaExcludes"];
      /** Fields which should be returned in the search result. */
      "fields[]"?: components["parameters"]["criteriaFields"];
      /** List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter) */
      "filter[]"?: components["parameters"]["criteriaFilter"];
      /** Perform groupings over certain fields */
      "grouping[]"?: components["parameters"]["criteriaGrouping"];
      /** List of ids to search for */
      "ids[]"?: components["parameters"]["criteriaIds"];
      /** Specify the fields that should be returned for the given entities. Object key needs to be the entity name, and the list of fields needs to be the value. Fields will not be included, if they are also specified in the excludes. Note that the include fields will only be stripped on the API-Level, consider using the `fields` parameter for performance reasons. */
      includes?: components["parameters"]["criteriaIncludes"];
      /** Number of items per result page */
      limit?: components["parameters"]["criteriaLimit"];
      /** Search result page */
      page?: components["parameters"]["criteriaPage"];
      /** Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter) */
      "post-filter[]"?: components["parameters"]["criteriaPostFilter"];
      /** The query string to search for */
      query?: components["parameters"]["criteriaQuery"];
      /** Sorting in the search result. */
      "sort[]"?: components["parameters"]["criteriaSort"];
      /** Search term */
      term?: components["parameters"]["criteriaTerm"];
      "total-count-mode"?: components["parameters"]["criteriaTotalCountMode"];
    };
    response: {
      /** aggregation result */
      aggregations?: GenericRecord;
      elements: components["schemas"]["ShippingMethod"][];
      /** Total amount */
      total?: number;
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readShippingMethod post /shipping-method": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Controls whether API search information is included in the response. Default is 1 (enabled), will be 0 (disabled) in the next major version. */
      "sw-include-search-info"?: "0" | "1";
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
  "getShopSettings get /shop-settings": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: {
      /** @constant */
      apiAlias: "shop_settings";
      /** Cart and checkout settings (core.cart) */
      cart: {
        /** @constant */
        apiAlias: "shop_settings_cart";
        /** Whether the checkout confirm page shows a tax column instead of the unit price */
        columnTaxInsteadUnitPrice: boolean;
        /** Whether order refunds are enabled */
        enableOrderRefunds: boolean;
        /** Maximum number of products that can be added to the cart per minute through the API */
        lineItemAddLimit: number;
        /** Whether guest customers are automatically logged out after order completion */
        logoutGuestAfterCheckout: boolean;
        /** Maximum selectable quantity per line item */
        maxQuantity: number;
        /** Whether the offcanvas cart should open automatically after adding a product. If disabled, only a success message is supposed to be shown */
        openOffcanvasAfterAddToCart: boolean;
        /** Whether the customer comment field is shown on the checkout confirm page */
        showCustomerComment: boolean;
        /** Whether the delivery time is shown in the cart */
        showDeliveryTime: boolean;
        /** Whether the subtotal column is shown in the cart */
        showSubtotal: boolean;
        /** Whether customers are required to agree to the terms and conditions via a checkbox in the checkout */
        showTosCheckbox: boolean;
        /** Whether the wishlist feature is enabled */
        wishlistEnabled: boolean;
      };
      /** Form field settings (core.basicInformation), used by the contact form and the online revocation request form */
      contactForm: {
        /** @constant */
        apiAlias: "shop_settings_contact_form";
        /** Whether the first name field has to be filled in to submit the form */
        firstNameFieldRequired: boolean;
        /** Whether the last name field has to be filled in to submit the form */
        lastNameFieldRequired: boolean;
        /** Whether the phone number field has to be filled in to submit the form */
        phoneNumberFieldRequired: boolean;
      };
      /** Shop identity and meta defaults (core.basicInformation) */
      general: {
        /** @constant */
        apiAlias: "shop_settings_general";
        /** Whether the "isFamilyFriendly" meta tag for search engines is set */
        familyFriendly: boolean;
        /** Name displayed as the author of the website in search results or on social media (meta author tag) */
        metaAuthor: string;
        /**
         * Default content of the robots meta tag, can be overridden per CMS page
         * @default index,follow
         */
        metaRobots: string;
        /** Name of the shop */
        shopName: string;
        /** Whether the "Revoke a contract" link is shown in the page footer */
        showRevocationButton: boolean;
      };
      /** Product listing, search and review settings (core.listing) */
      listing: {
        /** Translation snippet key whose content is displayed after every list price. Empty string when nothing should be displayed */
        afterListPriceSnippetKey: string;
        /** Whether buy buttons are displayed beneath every product in listings. If disabled, only detail buttons are supposed to be shown */
        allowBuyInListing: boolean;
        /** @constant */
        apiAlias: "shop_settings_listing";
        /** Whether videos configured as product media covers are played automatically in listings */
        autoplayVideoInListing: boolean;
        /** Translation snippet key whose content is displayed before every list price. Empty string when nothing should be displayed */
        beforeListPriceSnippetKey: string;
        /** Whether filter options without results are disabled instead of hidden */
        disableEmptyFilterOptions: boolean;
        /** Whether the best matching variant is previewed in search results and filtered listings */
        findBestVariant: boolean;
        /** Whether clearance sale products are hidden from listings as soon as their stock depletes to 0 */
        hideCloseoutProductsWhenOutOfStock: boolean;
        /** Number of days after the release date during which a product is marked as new */
        markAsNew: number;
        /** Number of products displayed per page in product listings and search results */
        productsPerPage: number;
        /** Number of reviews displayed per page on a product page */
        reviewsPerPage: number;
        /** Whether product reviews are shown */
        showReview: boolean;
        /** Whether variant options are displayed underneath the product name in search suggestion results */
        showVariantOptionInSearchSuggestionResult: boolean;
      };
      /** Login, registration and address form settings (core.loginRegistration) */
      loginRegistration: {
        /** Whether the additional address line 1 is required */
        additionalAddressField1Required: boolean;
        /** Whether the additional address line 2 is required */
        additionalAddressField2Required: boolean;
        /**
         * Arrangement of the address fields City, ZIP and State. Empty string when not configured, which equals the default arrangement (city-zip-state)
         * @enum {string}
         */
        addressInputFieldArrangement:
          | "city-zip-state"
          | "zip-city-state"
          | "city-state-zip"
          | "";
        /** Whether customers may delete their own account from the account profile page */
        allowCustomerDeletion: boolean;
        /** @constant */
        apiAlias: "shop_settings_login_registration";
        /** Whether the birthday field is required */
        birthdayFieldRequired: boolean;
        /** Whether the account creation option is pre-selected in the checkout registration form. If inactive, the customer purchases as a guest by default */
        createCustomerAccountDefault: boolean;
        /** Whether double opt-in is required for guest orders */
        doubleOptInGuestOrder: boolean;
        /** Whether double opt-in is required for new customer registrations. The account is inactive until the emailed confirmation link is opened */
        doubleOptInRegistration: boolean;
        /** Minimum password length on customer sign-up, also applies to password change and recovery */
        passwordMinLength: number;
        /** Whether the phone number field is required */
        phoneNumberFieldRequired: boolean;
        /** Whether the privacy policy has to be acknowledged via a checkbox on registration and other forms */
        requireDataProtectionCheckbox: boolean;
        /** Whether the email address has to be entered twice to avoid input errors */
        requireEmailConfirmation: boolean;
        /** Whether the password has to be entered twice to avoid input errors */
        requirePasswordConfirmation: boolean;
        /** Whether the selection between a private and a commercial (company) account is shown */
        showAccountTypeSelection: boolean;
        /** Whether the additional address line 1 is shown in address forms */
        showAdditionalAddressField1: boolean;
        /** Whether the additional address line 2 is shown in address forms */
        showAdditionalAddressField2: boolean;
        /** Whether the birthday field is shown in the registration form */
        showBirthdayField: boolean;
        /** Whether the phone number field is shown in registration and address forms */
        showPhoneNumberField: boolean;
        /** Whether the salutation field is shown in registration and address forms */
        showSalutation: boolean;
        /** Whether the title field is shown in registration and address forms */
        showTitleField: boolean;
      };
      /** Newsletter settings (core.newsletter) */
      newsletter: {
        /** @constant */
        apiAlias: "shop_settings_newsletter";
        /** Whether double opt-in is required for newsletter subscriptions */
        doubleOptIn: boolean;
        /** Whether double opt-in is also required for newsletter subscriptions of registered customers */
        doubleOptInRegistered: boolean;
      };
    };
    responseCode: 200;
  };
  "createShoppingList post /shopping-list": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    response: {
      id: string;
    };
    responseCode: 201;
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body?: components["schemas"]["Criteria"];
    response: {
      elements?: components["schemas"]["B2bComponentsShoppingList"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "addShoppingListsToCart post /shopping-lists/add-to-cart": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
      "sw-language-id"?: components["parameters"]["swLanguageId"];
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
          "sw-language-id"?: components["parameters"]["swLanguageId"];
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
          "sw-language-id"?: components["parameters"]["swLanguageId"];
        };
        pathParams: {
          /** The path to the sitemap file */
          filePath: string;
        };
        response: Blob;
        responseCode: 200;
      };
  "readSnippets get /snippet": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    query?: {
      /** Comma-separated list of language ids to fetch multiple languages in one request. Every id must be assigned to the sales channel. Defaults to the context language of the `sw-language-id` header. */
      languageIds?: string;
      /** Comma-separated list of namespace prefixes to limit the result, e.g. `checkout,account.login`. Prefixes match whole key segments, a trailing dot is optional: `checkout` matches `checkout.cart.title` but not `checkoutConfirm.title`. At most 50 distinct prefixes are allowed per request. */
      prefixes?: string;
    };
    response: {
      /** @constant */
      apiAlias: "snippet_set_result_list";
      sets: components["schemas"]["SnippetSetResult"][];
    };
    responseCode: 200;
  };
  "auth post /sso/auth/{providerId}": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    pathParams: {
      /** Identifier of the SSO provider used to authenticate */
      providerId: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 204;
  };
  "readCustomProductsTemplates post /swag_customized_products_template": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SwagCustomizedProductsEntitySearchResult"];
    responseCode: 200;
  };
  "readCustomProductsTemplateConfigurations post /swag_customized_products_template_configuration": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SwagCustomizedProductsEntitySearchResult"];
    responseCode: 200;
  };
  "readCustomProductsTemplateOptions post /swag_customized_products_template_option": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SwagCustomizedProductsEntitySearchResult"];
    responseCode: 200;
  };
  "readCustomProductsTemplateOptionValues post /swag_customized_products_template_option_value": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    response: components["schemas"]["SwagCustomizedProductsEntitySearchResult"];
    responseCode: 200;
  };
  "sendCustomFormMail post /swag/cms-extensions/form": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: components["parameters"]["swLanguageId"];
    };
    body: {
      /** The form id this mailing is for */
      formId: string;
    } & {
      [key: string]: string | number | boolean;
    };
    response: {
      /** @constant */
      apiAlias: "custom_form_result";
      /** The configured form success message. */
      successMessage: string;
    };
    responseCode: 200;
  };
};
