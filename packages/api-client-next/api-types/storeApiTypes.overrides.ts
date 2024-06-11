import { components as mainComponents } from "./storeApiTypes";

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
  Cart: {
    /** An affiliate tracking code */
    affiliateCode?: string | null;
    /** A campaign tracking code */
    campaignCode?: string | null;
    /** A comment that can be added to the cart. */
    customerComment?: string | null;
    deliveries?: components["schemas"]["CartDelivery"][];
    /** A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers. */
    errors?:
      | components["schemas"]["CartError"][]
      | Record<
          // TODO: [OpenAPI][Cart] - errors should be defined properly, sometimes it's an object?
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
    price: components["schemas"]["CalculatedPrice"]; // TODO: [OpenAPI][Cart] - price should be required
    /** Context token identifying the cart and the user session */
    token?: string;
    /** A list of all payment transactions associated with the current cart. */
    transactions?: {
      amount?: components["schemas"]["CalculatedPrice"];
      paymentMethodId?: string;
    }[];
  };
  Category: {
    active?: boolean;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    /** @enum {string} */
    apiAlias: "category"; // TODO: [OpenAPI][Category] - apiAlias should be required
    breadcrumb: string[]; // TODO: [OpenAPI][Category] - breadcrumb should be required
    /** Format: int64 */
    childCount: number;
    children: components["schemas"]["Category"][]; // TODO: [OpenAPI][Category] - children should be empty array not null if no children
    cmsPage?: components["schemas"]["CmsPage"];
    cmsPageId?: string;
    /** Runtime field, cannot be used as part of the criteria. */
    cmsPageIdSwitched?: boolean;
    cmsPageVersionId?: string;
    /** Format: date-time */
    createdAt: string;
    customEntityTypeId?: string;
    customFields?: Record<string, never>;
    description?: string;
    displayNestedProducts: boolean;
    externalLink?: string;
    id: string;
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
    translated: {
      afterCategoryId?: string;
      afterCategoryVersionId?: string;
      breadcrumb: string[]; // TODO: [OpenAPI][Category] - breadcrumb should be translated?
      apiAlias?: string;
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
  Criteria: {
    aggregations?: components["schemas"]["Aggregations"];
    /** Associations to include. For more information, see [Search Queries > Associations](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#associations) */
    associations?: GenericRecord; // TODO: [OpenAPI][Criteria] - associations should be defined properly, it's not an array and not nested "Criteria"
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
    includes?: components["schemas"]["Include"];
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
    /** List of queries to restrict the search result. For more information, see [Search Queries > Query](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#query) */
    query?: string; // components["schemas"]["Query"][]; TODO: [OpenAPI][Criteria] - query is probably only string
    /** Sorting in the search result. */
    sort?: components["schemas"]["Sort"][];
    /** Search term */
    term?: string;
    "total-count-mode"?: components["schemas"]["TotalCountMode"];
  };
  Product: {
    active?: boolean;
    /** @enum {string} */
    apiAlias: "product";
    available?: boolean;
    /** Format: int64 */
    availableStock?: number;
    calculatedCheapestPrice?: {
      // TODO: [OpenAPI][Product] - calculatedCheapestPrice should be defined as a separate entity
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
    customFields?: Record<string, never>;
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
    seoCategory: components["schemas"]["Category"];
    seoUrls?: components["schemas"]["SeoUrl"][];
    shippingFree?: boolean;
    sortedProperties?: Record<string, never>;
    states?: readonly string[];
    /** Format: int64 */
    stock: number;
    streamIds?: readonly string[];
    streams?: components["schemas"]["ProductStream"][];
    tagIds?: readonly string[];
    tags?: components["schemas"]["Tag"][];
    tax?: components["schemas"]["Tax"];
    taxId: string;
    translated: {
      // TODO: [OpenAPI][Product] - translated should be required
      apiAlias?: string;
      canonicalProductId?: string;
      canonicalProductVersionId?: string;
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
    variantListingConfig?: {
      displayParent?: boolean;
    } | null;
    versionId?: string;
    /** Format: float */
    weight?: number;
    /** Format: float */
    width?: number;
  };
  ProductJsonApi: components["schemas"]["resource"] & {
    active?: boolean;
    available?: boolean;
    /** Format: int64 */
    availableStock?: number;
    calculatedCheapestPrice?: Record<string, never>;
    /**
     * Format: int64
     * Runtime field, cannot be used as part of the criteria.
     */
    calculatedMaxPurchase?: number;
    calculatedPrice?: Record<string, never>;
    calculatedPrices?: Record<string, never>[];
    canonicalProductId?: string;
    canonicalProductVersionId?: string;
    categoryIds?: readonly string[];
    categoryTree?: readonly string[];
    /** Format: int64 */
    childCount?: number;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    coverId?: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: Record<string, never>;
    deliveryTimeId?: string;
    description?: string;
    displayGroup?: string;
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
    // TODO: [OpenAPI][ProductJsonApi] - add options definition
    options: Array<{
      group: string;
      option: string;
      translated: {
        [key: string]: string;
      };
    }>;
    name: string;
    optionIds?: readonly string[];
    packUnit?: string;
    packUnitPlural?: string;
    parentId?: string;
    parentVersionId?: string;
    productManufacturerVersionId?: string;
    productMediaVersionId?: string;
    productNumber: string;
    propertyIds?: readonly string[];
    /** Format: int64 */
    purchaseSteps?: number;
    /** Format: float */
    purchaseUnit?: number;
    /** Format: float */
    ratingAverage?: number;
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
    sales?: number;
    shippingFree?: boolean;
    sortedProperties?: Record<string, never>;
    states?: readonly string[];
    /** Format: int64 */
    stock: number;
    streamIds?: readonly string[];
    tagIds?: readonly string[];
    taxId: string;
    translated?: {
      canonicalProductId?: string;
      canonicalProductVersionId?: string;
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
    unitId?: string;
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
    /** Format: float */
    weight?: number;
    /** Format: float */
    width?: number;
  };
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
    listPrice: components["schemas"]["ListPrice"] | null;
    netPrice: number; // TODO: [OpenAPI][CalculatedPrice] - netPrice should be added to definition
    quantity: number;
    positionPrice: number; // TODO: [OpenAPI][CalculatedPrice] - positionPrice should be added to definition
    rawTotal: number; // TODO: [OpenAPI][CalculatedPrice] - rawTotal should be added to definition
    referencePrice: components["schemas"]["ReferencePrice"] | null;
    regulationPrice: {
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
    taxStatus: "net" | "tax-free"; // TODO: [OpenAPI][CalculatedPrice] - taxStatus should be defined and properly typed
    totalPrice: number;
    unitPrice: number;
    /** Format: ^[0-9a-f]{32}$ */
    variantId?: string | null;
  };
  DeliveryInformation: {
    /** @enum {string} */
    apiAlias?: "cart_delivery_information";
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
    stock: number; // TODO: [OpenAPI][DeliveryInformation] - stock should be required
    weight?: number;
    width?: number;
  };
  LineItem: {
    children?: components["schemas"]["LineItem"][];
    cover?: components["schemas"]["ProductMedia"];
    dataContextHash?: string;
    dataTimestamp?: string;
    deliveryInformation: components["schemas"]["DeliveryInformation"]; // TODO: [OpenAPI][LineItem] - deliveryInformation should be required
    description?: string;
    good?: boolean;
    id: string;
    label?: string;
    modified?: boolean;
    modifiedByApp?: boolean;
    payload: components["schemas"]["ProductJsonApi"]; // TODO: [OpenAPI][LineItem] - payload should be required
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
      listPrice?: components["schemas"]["ListPrice"] | null;
      quantity: number;
      referencePrice?: components["schemas"]["ReferencePrice"] | null;
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
    priceDefinition?: components["schemas"]["PriceDefinition"];
    quantity: number; // TODO: [OpenAPI][LineItem] - quantity should be required
    quantityInformation?: {
      maxPurchase?: number;
      minPurchase?: number;
      purchaseSteps?: number;
    };
    referencedId?: string;
    removable?: boolean;
    stackable?: boolean;
    states: ("is-physical" | "is-download")[]; // TODO: [OpenAPI][LineItem] - states should be required
    type: components["schemas"]["LineItemType"];
    uniqueIdentifier?: string;
  };
  ProductMedia: {
    /** Format: date-time */
    createdAt: string;
    customFields?: Record<string, never>;
    id: string;
    media?: components["schemas"]["Media"];
    mediaId: string;
    /** Format: int64 */
    position?: number;
    productId: string;
    productVersionId?: string;
    thumbnails?: components["schemas"]["MediaThumbnail"][]; // TODO: [OpenAPI][ProductMedia] - thumbnails should probably be defined as an array
    /** Format: date-time */
    updatedAt?: string;
    versionId?: string;
  };
  Media: {
    alt?: string;
    /** @enum {string} */
    apiAlias: "media";
    config?: Record<string, never>;
    /** Format: date-time */
    createdAt: string;
    customFields?: Record<string, never>;
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
    fileExtension: string;
    fileName: string;
    /** Format: int64 */
    fileSize?: number;
    /** Runtime field, cannot be used as part of the criteria. */
    hasFile: boolean;
    id: string;
    // TODO: [OpenAPI][Media] metaData field should be defined properly
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
    translated?: {
      alt?: string;
      apiAlias?: string;
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
    url: string;
  };
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
    customFields?: Record<string, never>;
    deepLinkCode?: string;
    deliveries?: components["schemas"]["OrderDelivery"][];
    documents: components["schemas"]["Document"][];
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
    id: string;
    language?: components["schemas"]["Language"];
    languageId: string;
    lineItems?: components["schemas"]["OrderLineItem"][];
    orderCustomer?: components["schemas"]["OrderCustomer"];
    orderDate: string;
    /** Format: date-time */
    orderDateTime: string;
    orderNumber?: string;
    /** Format: float */
    positionPrice?: number;
    price: components["schemas"]["CalculatedPrice"]; // TODO: [OpenAPI][Order] - price should be required and point to calculated price
    salesChannelId: string;
    shippingCosts?: {
      calculatedTaxes?: Record<string, never>;
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
      referencePrice?: Record<string, never>;
      regulationPrice?: {
        /** Format: float */
        price?: number;
      };
      taxRules?: Record<string, never>;
      /** Format: float */
      totalPrice: number;
      /** Format: float */
      unitPrice: number;
    };
    /** Format: float */
    shippingTotal?: number;
    source?: string;
    stateMachineState: components["schemas"]["StateMachineState"];
    tags?: components["schemas"]["Tag"][];
    taxStatus?: string;
    transactions?: components["schemas"]["OrderTransaction"][];
    /** Format: date-time */
    updatedAt?: string;
    updatedById?: string;
    versionId?: string;
  };
  OrderRouteResponse: {
    orders: {
      elements: components["schemas"]["Order"][]; // TODO: [OpenAPI][OrderRouteResponse] - there should be elements field defined for search result
    } & components["schemas"]["EntitySearchResult"];
    /** The key-value pairs contain the uuid of the order as key and a boolean as value, indicating that the payment method can still be changed. */
    paymentChangeable?: {
      [key: string]: boolean;
    };
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
        apiAlias?: string;
        key?: string;
        label?: string;
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
  ProductReview: {
    comment?: string;
    content: string;
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    customerId?: string; // TODO: [OpenAPI][ProductReview] customerId field should be defined
    externalUser?: string; // TODO: [OpenAPI][ProductReview] externalUser field should be defined
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
    updatedAt?: string;
  };
  // /** Added since version: 6.0.0.0 */
  PropertyGroupOption: {
    colorHexCode?: string;
    /** Format: date-time */
    createdAt: string;
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
    // TODO: [OpenAPI][PropertyGroupOption] translated field should be defined properly
    translated: {
      colorHexCode?: string;
      groupId?: string;
      mediaId?: string;
      name?: string;
      option?: string;
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
    paymentMethod?: components["schemas"]["PaymentMethod"];
    /** Information about the current sales channel */
    salesChannel: components["schemas"]["SalesChannel"]; // TODO: [OpenAPI][SalesChannelContext] - salesChannel should be required and points to entity
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
  Quote: {
    /** Format: float */
    amountNet?: number;
    /** Format: float */
    amountTotal?: number;
    comments?: components["schemas"]["QuoteComment"][];
    /** Format: date-time */
    createdAt: string;
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
    // TODO: [OpenAPI][Quote] - price field should be defined properly
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
    stateMachineState: components["schemas"]["StateMachineState"]; // TODO: [OpenAPI][Quote] stateMachineState field should be defined as required
    /** Format: float */
    subtotalNet?: number;
    taxStatus?: string;
    /** Format: float */
    totalDiscount?: number;
    transactions?: components["schemas"]["QuoteTransaction"][];
    /** Format: date-time */
    updatedAt?: string;
    updatedById?: string;
    userId?: string;
    versionId?: string;
  };
  StateMachineState: {
    /** Format: date-time */
    createdAt: string;
    customFields?: GenericRecord;
    id?: string;
    name: string;
    technicalName: string;
    translated: {
      // TODO: [OpenAPI][StateMachineState] translated field should be defined as required
      name?: string;
      technicalName?: string;
    };
    /** Format: date-time */
    updatedAt?: string;
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
    products: components["schemas"]["ProductListingResult"]; // TODO: [OpenAPI][WishlistLoadRouteResponse] - products response should be defined as required
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
    body: components["schemas"]["CustomerAddressBody"]; // TODO: [OpenAPI][createCustomerAddress] - body should be defined without id on creation
    response: components["schemas"]["CustomerAddress"] &
      components["schemas"]["CustomerAddressRead"];
    responseCode: 200;
  };
  "listAddress post /account/list-address": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][listAddress] - body should be optional
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
      /** Instructs Shopware to try and resolve SEO URLs for the given navigation item */
      "sw-include-seo-urls"?: boolean; // TODO: [OpenAPI][readCategory] - add header to the parameters
    };
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
  "addLineItem post /checkout/cart/line-item": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
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
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readLanguages] - body should be optional
    response: {
      elements: components["schemas"]["Language"][]; // TODO: [OpenAPI][readLanguages] add elements property as required
    } & components["schemas"]["EntitySearchResult"];
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
      documentId: string;
      deepLinkCode: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][download] - body should be optional
    response: components["schemas"]["Document"];
    responseCode: 200;
  };
  "readCustomer post /account/customer": {
    contentType?: "application/json";
    accept?: "application/json";
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readCustomer] - body should be optional
    response: components["schemas"]["Customer"];
    responseCode: 200;
  };
  "readCustomerWishlist post /customer/wishlist": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readCustomerWishlist] - body should be optional
    response: components["schemas"]["WishlistLoadRouteResponse"];
    responseCode: 200;
  };
  "readProduct post /product": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body: components["schemas"]["Criteria"];
    response: {
      elements: components["schemas"]["Product"][]; // TODO: [OpenAPI][readProduct]: add elements property as required
    } & components["schemas"]["EntitySearchResult"];
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
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readProductReviews] - body should be optional
    response: {
      elements?: components["schemas"]["ProductReview"][];
    } & components["schemas"]["EntitySearchResult"];
    responseCode: 200;
  };
  "readSalutation post /salutation": {
    contentType?: "application/json";
    accept?: "application/json";
    headers?: {
      /** Instructs Shopware to return the response in the given language. */
      "sw-language-id"?: string;
    };
    body?: components["schemas"]["Criteria"]; // TODO: [OpenAPI][readSalutation] - body should be optional
    response: {
      elements?: components["schemas"]["Salutation"][];
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
    body: components["schemas"]["Criteria"];
    query?: {
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
  "updateCustomerAddress patch /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Address ID */
      addressId: string;
    };
    body: components["schemas"]["CustomerAddressBody"]; // TODO: [OpenAPI][updateCustomerAddress] - body should be defined without id on update as address exist
    response: components["schemas"]["CustomerAddress"] &
      components["schemas"]["CustomerAddressRead"];
    responseCode: 200;
  };
};
