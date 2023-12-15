import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type Category = {
  id: z.string | undefined;
  versionId: z.string | undefined;
  parentId: z.string | undefined;
  parentVersionId?: string | undefined;
  afterCategoryId?: string | undefined;
  afterCategoryVersionId?: string | undefined;
  mediaId?: string | undefined;
  displayNestedProducts: boolean;
  breadcrumb?: Array<unknown> | undefined;
  level?: number | undefined;
  path?: string | undefined;
  childCount?: number | undefined;
  type: string;
  productAssignmentType: string;
  visible?: boolean | undefined;
  active?: boolean | undefined;
  cmsPageIdSwitched?: boolean | undefined;
  visibleChildCount?: number | undefined;
  name: string;
  customFields?: {} | undefined;
  linkType?: string | undefined;
  internalLink?: string | undefined;
  externalLink?: string | undefined;
  linkNewTab?: boolean | undefined;
  description?: string | undefined;
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string | undefined;
  cmsPageId?: string | undefined;
  cmsPageVersionId?: string | undefined;
  customEntityTypeId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  parent?: Category | undefined;
  children?: Category | undefined;
  media?: Media | undefined;
  cmsPage?: CmsPage | undefined;
  seoUrls?: SeoUrl | undefined;
};
type Media = {
  id?: string | undefined;
  mimeType?: string | undefined;
  fileExtension?: string | undefined;
  uploadedAt?: string | undefined;
  fileName?: string | undefined;
  fileSize?: number | undefined;
  metaData?: {} | undefined;
  alt?: string | undefined;
  title?: string | undefined;
  url?: string | undefined;
  hasFile?: boolean | undefined;
  private?: boolean | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  extensions?:
    | Partial<{
        mediaAiTag: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  thumbnails?: MediaThumbnail | undefined;
};
type MediaThumbnail = {
  id?: string | undefined;
  mediaId: string;
  width: number;
  height: number;
  url?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type SeoUrl = {
  id?: string | undefined;
  salesChannelId?: string | undefined;
  languageId: string;
  foreignKey: string;
  routeName: string;
  pathInfo: string;
  seoPathInfo: string;
  isCanonical?: boolean | undefined;
  isModified?: boolean | undefined;
  isDeleted?: boolean | undefined;
  url?: string | undefined;
  customFields?: {} | undefined;
  isValid?: boolean | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type CmsBlock = {
  id?: string | undefined;
  position: number;
  type: string;
  name?: string | undefined;
  sectionPosition?: string | undefined;
  marginTop?: string | undefined;
  marginBottom?: string | undefined;
  marginLeft?: string | undefined;
  marginRight?: string | undefined;
  backgroundColor?: string | undefined;
  backgroundMediaId?: string | undefined;
  backgroundMediaMode?: string | undefined;
  cssClass?: string | undefined;
  visibility?:
    | Partial<{
        mobile: boolean;
        desktop: boolean;
        tablet: boolean;
      }>
    | undefined;
  sectionId: string;
  customFields?: {} | undefined;
  versionId?: string | undefined;
  cmsSectionVersionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  extensions?:
    | Partial<{
        swagCmsExtensionsQuickview: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
        swagCmsExtensionsBlockRule: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  backgroundMedia?: Media | undefined;
  slots?: CmsSlot | undefined;
};
type CmsPage = {
  id?: string | undefined;
  versionId?: string | undefined;
  name?: string | undefined;
  type: string;
  entity?: string | undefined;
  cssClass?: string | undefined;
  config?:
    | Partial<{
        backgroundColor: string;
      }>
    | undefined;
  previewMediaId?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  extensions?:
    | Partial<{
        swagCmsExtensionsScrollNavigationPageSettings: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  sections?: CmsSection | undefined;
  previewMedia?: Media | undefined;
  landingPages?: LandingPage | undefined;
};
type CmsSection = {
  id?: string | undefined;
  position: number;
  type: string;
  name?: string | undefined;
  sizingMode?: string | undefined;
  mobileBehavior?: string | undefined;
  backgroundColor?: string | undefined;
  backgroundMediaId?: string | undefined;
  backgroundMediaMode?: string | undefined;
  cssClass?: string | undefined;
  pageId: string;
  visibility?:
    | Partial<{
        mobile: boolean;
        desktop: boolean;
        tablet: boolean;
      }>
    | undefined;
  customFields?: {} | undefined;
  cmsPageVersionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  extensions?:
    | Partial<{
        swagCmsExtensionsScrollNavigation: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  page?: CmsPage | undefined;
  backgroundMedia?: Media | undefined;
  blocks?: CmsBlock | undefined;
};
type CmsSlot = {
  id?: string | undefined;
  versionId?: string | undefined;
  type: string;
  slot: string;
  locked?: boolean | undefined;
  config?: {} | undefined;
  customFields?: {} | undefined;
  data?: {} | undefined;
  blockId: string;
  fieldConfig?: {} | undefined;
  cmsBlockVersionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  block?: CmsBlock | undefined;
};
type Document = {
  id?: string | undefined;
  documentTypeId: string;
  fileType: string;
  referencedDocumentId?: string | undefined;
  orderId: string;
  documentMediaFileId?: string | undefined;
  orderVersionId?: string | undefined;
  config: {};
  sent?: boolean | undefined;
  static?: boolean | undefined;
  deepLinkCode: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  documentType?: DocumentType | undefined;
  order?: Order | undefined;
  referencedDocument?: Document | undefined;
  dependentDocuments?: Document | undefined;
  documentMediaFile?: Media | undefined;
};
type DocumentType = {
  id?: string | undefined;
  name: string;
  technicalName: string;
  createdAt: string;
  updatedAt?: string | undefined;
  customFields?: {} | undefined;
  translated?: {} | undefined;
};
type StateMachineState = {
  id?: string | undefined;
  technicalName: string;
  name: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type OrderCustomer = {
  id?: string | undefined;
  versionId?: string | undefined;
  email: string;
  salutationId: string;
  firstName: string;
  lastName: string;
  company?: string | undefined;
  title?: string | undefined;
  vatIds?: Array<string> | undefined;
  customerNumber?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  salutation?: Salutation | undefined;
};
type Salutation = {
  id?: string | undefined;
  salutationKey: string;
  displayName: string;
  letterName: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type Currency = {
  id?: string | undefined;
  factor: number;
  symbol: string;
  isoCode: string;
  shortName: string;
  name: string;
  position?: number | undefined;
  isSystemDefault?: boolean | undefined;
  taxFreeFrom?: number | undefined;
  customFields?: {} | undefined;
  itemRounding: Partial<{
    decimals: number;
    interval: number;
    roundForNet: boolean;
  }>;
  totalRounding: Partial<{
    decimals: number;
    interval: number;
    roundForNet: boolean;
  }>;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type Locale = {
  id?: string | undefined;
  code: string;
  name: string;
  territory: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type OrderAddress = {
  id?: string | undefined;
  versionId?: string | undefined;
  countryId: string;
  countryStateId?: string | undefined;
  firstName: string;
  lastName: string;
  street: string;
  zipcode?: string | undefined;
  city: string;
  company?: string | undefined;
  department?: string | undefined;
  title?: string | undefined;
  vatId?: string | undefined;
  phoneNumber?: string | undefined;
  additionalAddressLine1?: string | undefined;
  additionalAddressLine2?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  country?: Country | undefined;
  countryState?: CountryState | undefined;
  salutation?: Salutation | undefined;
};
type Country = {
  id?: string | undefined;
  name: string;
  iso?: string | undefined;
  position?: number | undefined;
  active?: boolean | undefined;
  shippingAvailable?: boolean | undefined;
  iso3?: string | undefined;
  displayStateInRegistration?: boolean | undefined;
  forceStateInRegistration?: boolean | undefined;
  checkVatIdPattern?: boolean | undefined;
  vatIdRequired?: boolean | undefined;
  vatIdPattern?: string | undefined;
  customFields?: {} | undefined;
  customerTax?:
    | {
        enabled: boolean;
        currencyId: string;
        amount: number;
      }
    | undefined;
  companyTax?:
    | {
        enabled: boolean;
        currencyId: string;
        amount: number;
      }
    | undefined;
  postalCodeRequired?: boolean | undefined;
  checkPostalCodePattern?: boolean | undefined;
  checkAdvancedPostalCodePattern?: boolean | undefined;
  advancedPostalCodePattern?: string | undefined;
  addressFormat: {};
  defaultPostalCodePattern?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  states?: CountryState | undefined;
};
type CountryState = {
  id?: string | undefined;
  countryId: string;
  shortCode: string;
  name: string;
  position?: number | undefined;
  active?: boolean | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type OrderDelivery = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderId: string;
  orderVersionId?: string | undefined;
  shippingOrderAddressId: string;
  shippingOrderAddressVersionId?: string | undefined;
  shippingMethodId: string;
  stateId: string;
  trackingCodes: Array<string>;
  shippingDateEarliest: string;
  shippingDateLatest: string;
  shippingCosts?:
    | {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: {} | undefined;
        taxRules?: {} | undefined;
        referencePrice?: {} | undefined;
        listPrice?:
          | Partial<{
              price: number;
              discount: number;
              percentage: number;
            }>
          | undefined;
        regulationPrice?:
          | Partial<{
              price: number;
            }>
          | undefined;
      }
    | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  stateMachineState?: StateMachineState | undefined;
  shippingOrderAddress?: OrderAddress | undefined;
  shippingMethod?: ShippingMethod | undefined;
  positions?: OrderDeliveryPosition | undefined;
};
type ShippingMethod = {
  id?: string | undefined;
  name: string;
  active?: boolean | undefined;
  position?: number | undefined;
  customFields?: {} | undefined;
  mediaId?: string | undefined;
  deliveryTimeId: string;
  taxType: string;
  description?: string | undefined;
  trackingUrl?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  deliveryTime?: DeliveryTime | undefined;
  availabilityRule?: Rule | undefined;
  prices?: ShippingMethodPrice | undefined;
  media?: Media | undefined;
  tags?: Tag | undefined;
  tax?: Tax | undefined;
};
type DeliveryTime = {
  id?: string | undefined;
  name: string;
  min: number;
  max: number;
  unit: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type Rule = {
  id?: string | undefined;
  name: string;
  description?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  extensions?:
    | Partial<{
        warehouseGroup: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Array<
            Partial<{
              type: string;
              id: string;
            }>
          >;
        }>;
      }>
    | undefined;
};
type ShippingMethodPrice = {
  id?: string | undefined;
  shippingMethodId: string;
  ruleId?: string | undefined;
  calculation?: number | undefined;
  calculationRuleId?: string | undefined;
  quantityStart?: number | undefined;
  quantityEnd?: number | undefined;
  currencyPrice?: {} | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type Tag = {
  id?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type Tax = {
  id?: string | undefined;
  taxRate: number;
  name: string;
  position: number;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type OrderDeliveryPosition = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderDeliveryId: string;
  orderDeliveryVersionId?: string | undefined;
  orderLineItemId: string;
  orderLineItemVersionId?: string | undefined;
  price?:
    | {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: {} | undefined;
        taxRules?: {} | undefined;
        referencePrice?: {} | undefined;
        listPrice?:
          | Partial<{
              price: number;
              discount: number;
              percentage: number;
            }>
          | undefined;
        regulationPrice?:
          | Partial<{
              price: number;
            }>
          | undefined;
      }
    | undefined;
  unitPrice?: number | undefined;
  totalPrice?: number | undefined;
  quantity?: number | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type PaymentMethod = {
  id?: string | undefined;
  name: string;
  distinguishableName?: string | undefined;
  description?: string | undefined;
  position?: number | undefined;
  active?: boolean | undefined;
  afterOrderEnabled?: boolean | undefined;
  customFields?: {} | undefined;
  mediaId?: string | undefined;
  synchronous?: boolean | undefined;
  asynchronous?: boolean | undefined;
  prepared?: boolean | undefined;
  refundable?: boolean | undefined;
  shortName?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  media?: Media | undefined;
};
type LandingPage = {
  id?: string | undefined;
  versionId?: string | undefined;
  active?: boolean | undefined;
  name: string;
  customFields?: {} | undefined;
  slotConfig?: {} | undefined;
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string | undefined;
  url: string;
  cmsPageId?: string | undefined;
  cmsPageVersionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  cmsPage?: CmsPage | undefined;
  seoUrls?: SeoUrl | undefined;
};
type Language = {
  id?: string | undefined;
  parentId?: string | undefined;
  localeId: string;
  translationCodeId?: string | undefined;
  name: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  parent?: Language | undefined;
  locale?: Locale | undefined;
  translationCode?: Locale | undefined;
  children?: Language | undefined;
};
type Order = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderNumber?: string | undefined;
  billingAddressId: string;
  billingAddressVersionId?: string | undefined;
  currencyId: string;
  languageId: string;
  salesChannelId: string;
  orderDateTime: string;
  orderDate?: string | undefined;
  price?:
    | {
        netPrice: number;
        totalPrice: number;
        calculatedTaxes?: {} | undefined;
        taxRules?: {} | undefined;
        positionPrice: number;
        rawTotal: number;
        taxStatus: string;
      }
    | undefined;
  amountTotal?: number | undefined;
  amountNet?: number | undefined;
  positionPrice?: number | undefined;
  taxStatus?: string | undefined;
  shippingCosts?:
    | {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: {} | undefined;
        taxRules?: {} | undefined;
        referencePrice?: {} | undefined;
        listPrice?:
          | Partial<{
              price: number;
              discount: number;
              percentage: number;
            }>
          | undefined;
        regulationPrice?:
          | Partial<{
              price: number;
            }>
          | undefined;
      }
    | undefined;
  shippingTotal?: number | undefined;
  currencyFactor: number;
  deepLinkCode?: string | undefined;
  affiliateCode?: string | undefined;
  campaignCode?: string | undefined;
  customerComment?: string | undefined;
  customFields?: {} | undefined;
  createdById?: string | undefined;
  updatedById?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  extensions?:
    | Partial<{
        returns: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Array<
            Partial<{
              type: string;
              id: string;
            }>
          >;
        }>;
      }>
    | undefined;
  stateMachineState?: StateMachineState | undefined;
  orderCustomer?: OrderCustomer | undefined;
  currency?: Currency | undefined;
  language?: Language | undefined;
  addresses?: OrderAddress | undefined;
  billingAddress?: OrderAddress | undefined;
  deliveries?: OrderDelivery | undefined;
  lineItems?: OrderLineItem | undefined;
  transactions?: OrderTransaction | undefined;
  documents?: Document | undefined;
  tags?: Tag | undefined;
};
type OrderLineItem = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderId: string;
  orderVersionId?: string | undefined;
  productId?: string | undefined;
  productVersionId?: string | undefined;
  parentId?: string | undefined;
  parentVersionId?: string | undefined;
  coverId?: string | undefined;
  identifier: string;
  referencedId?: string | undefined;
  quantity: number;
  label: string;
  payload?: {} | undefined;
  good?: boolean | undefined;
  removable?: boolean | undefined;
  stackable?: boolean | undefined;
  position: number;
  states: Array<string>;
  priceDefinition?: {} | undefined;
  unitPrice?: number | undefined;
  totalPrice?: number | undefined;
  description?: string | undefined;
  type?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  extensions?:
    | Partial<{
        returns: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Array<
            Partial<{
              type: string;
              id: string;
            }>
          >;
        }>;
        state: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  cover?: Media | undefined;
  orderDeliveryPositions?: OrderDeliveryPosition | undefined;
  downloads?: OrderLineItemDownload | undefined;
  parent?: OrderLineItem | undefined;
  children: OrderLineItem;
};
type OrderLineItemDownload = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderLineItemId: string;
  orderLineItemVersionId?: string | undefined;
  mediaId: string;
  position: number;
  accessGranted: boolean;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  orderLineItem?: OrderLineItem | undefined;
  media?: Media | undefined;
};
type OrderTransaction = {
  id?: string | undefined;
  versionId?: string | undefined;
  orderId: string;
  orderVersionId?: string | undefined;
  paymentMethodId: string;
  amount: {
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    calculatedTaxes?: {} | undefined;
    taxRules?: {} | undefined;
    referencePrice?: {} | undefined;
    listPrice?:
      | Partial<{
          price: number;
          discount: number;
          percentage: number;
        }>
      | undefined;
    regulationPrice?:
      | Partial<{
          price: number;
        }>
      | undefined;
  };
  stateId: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  stateMachineState?: StateMachineState | undefined;
  paymentMethod?: PaymentMethod | undefined;
  captures?: OrderTransactionCapture | undefined;
};
type OrderTransactionCapture = {
  id?: string | undefined;
  orderTransactionId: string;
  orderTransactionVersionId?: string | undefined;
  stateId: string;
  externalReference?: string | undefined;
  amount: {
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    calculatedTaxes?: {} | undefined;
    taxRules?: {} | undefined;
    referencePrice?: {} | undefined;
    listPrice?:
      | Partial<{
          price: number;
          discount: number;
          percentage: number;
        }>
      | undefined;
    regulationPrice?:
      | Partial<{
          price: number;
        }>
      | undefined;
  };
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  stateMachineState?: StateMachineState | undefined;
  transaction?: OrderTransaction | undefined;
  refunds?: OrderTransactionCaptureRefund | undefined;
};
type OrderTransactionCaptureRefund = {
  id?: string | undefined;
  captureId: string;
  stateId: string;
  externalReference?: string | undefined;
  reason?: string | undefined;
  amount: {
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    calculatedTaxes?: {} | undefined;
    taxRules?: {} | undefined;
    referencePrice?: {} | undefined;
    listPrice?:
      | Partial<{
          price: number;
          discount: number;
          percentage: number;
        }>
      | undefined;
    regulationPrice?:
      | Partial<{
          price: number;
        }>
      | undefined;
  };
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  stateMachineState?: StateMachineState | undefined;
  transactionCapture?: OrderTransactionCapture | undefined;
  positions?: OrderTransactionCaptureRefundPosition | undefined;
};
type OrderTransactionCaptureRefundPosition = {
  id?: string | undefined;
  refundId: string;
  orderLineItemId: string;
  orderLineItemVersionId?: string | undefined;
  externalReference?: string | undefined;
  reason?: string | undefined;
  quantity?: number | undefined;
  amount: {
    unitPrice: number;
    totalPrice: number;
    quantity: number;
    calculatedTaxes?: {} | undefined;
    taxRules?: {} | undefined;
    referencePrice?: {} | undefined;
    listPrice?:
      | Partial<{
          price: number;
          discount: number;
          percentage: number;
        }>
      | undefined;
    regulationPrice?:
      | Partial<{
          price: number;
        }>
      | undefined;
  };
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  orderLineItem?: OrderLineItem | undefined;
  orderTransactionCaptureRefund?: OrderTransactionCaptureRefund | undefined;
};
type Product = {
  id?: string | undefined;
  versionId?: string | undefined;
  parentId?: string | undefined;
  parentVersionId?: string | undefined;
  manufacturerId?: string | undefined;
  productManufacturerVersionId?: string | undefined;
  unitId?: string | undefined;
  taxId: string;
  coverId?: string | undefined;
  productMediaVersionId?: string | undefined;
  deliveryTimeId?: string | undefined;
  canonicalProductId?: string | undefined;
  cmsPageId?: string | undefined;
  cmsPageVersionId?: string | undefined;
  productNumber: string;
  stock: number;
  restockTime?: number | undefined;
  active?: boolean | undefined;
  availableStock?: number | undefined;
  available?: boolean | undefined;
  isCloseout?: boolean | undefined;
  displayGroup?: string | undefined;
  manufacturerNumber?: string | undefined;
  ean?: string | undefined;
  purchaseSteps?: number | undefined;
  maxPurchase?: number | undefined;
  minPurchase?: number | undefined;
  purchaseUnit?: number | undefined;
  referenceUnit?: number | undefined;
  shippingFree?: boolean | undefined;
  markAsTopseller?: boolean | undefined;
  weight?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  length?: number | undefined;
  releaseDate?: string | undefined;
  ratingAverage?: number | undefined;
  categoryTree?: Array<string> | undefined;
  propertyIds?: Array<string> | undefined;
  optionIds?: Array<string> | undefined;
  streamIds?: Array<string> | undefined;
  categoryIds?: Array<string> | undefined;
  childCount?: number | undefined;
  sales?: number | undefined;
  states?: Array<string> | undefined;
  metaDescription?: string | undefined;
  name: string;
  keywords?: string | undefined;
  description?: string | undefined;
  metaTitle?: string | undefined;
  packUnit?: string | undefined;
  packUnitPlural?: string | undefined;
  customFields?: {} | undefined;
  calculatedPrice?: {} | undefined;
  calculatedPrices?: Array<unknown> | undefined;
  calculatedMaxPurchase?: number | undefined;
  calculatedCheapestPrice?: {} | undefined;
  isNew?: boolean | undefined;
  sortedProperties?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  extensions?:
    | Partial<{
        reviewSummaries: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Array<
            Partial<{
              type: string;
              id: string;
            }>
          >;
        }>;
        swagCustomizedProductsTemplate: Partial<{
          links: Partial<{
            related: string;
          }>;
          data: Partial<{
            type: string;
            id: string;
          }>;
        }>;
      }>
    | undefined;
  downloads?: ProductDownload | undefined;
  parent?: Product | undefined;
  children?: Product | undefined;
  deliveryTime?: DeliveryTime | undefined;
  tax?: Tax | undefined;
  manufacturer?: ProductManufacturer | undefined;
  unit?: Unit | undefined;
  cover?: ProductMedia | undefined;
  cmsPage?: CmsPage | undefined;
  canonicalProduct?: Product | undefined;
  media?: ProductMedia | undefined;
  crossSellings?: ProductCrossSelling | undefined;
  configuratorSettings?: ProductConfiguratorSetting | undefined;
  productReviews?: ProductReview | undefined;
  mainCategories?: MainCategory | undefined;
  seoUrls?: SeoUrl | undefined;
  options?: PropertyGroupOption | undefined;
  properties?: PropertyGroupOption | undefined;
  categories?: Category | undefined;
  streams?: ProductStream | undefined;
  categoriesRo?: Category | undefined;
  seoCategory?: Category | undefined;
};
type ProductManufacturer = {
  id?: string | undefined;
  versionId?: string | undefined;
  mediaId?: string | undefined;
  link?: string | undefined;
  name: string;
  description?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  media?: Media | undefined;
};
type Unit = {
  id?: string | undefined;
  shortCode: string;
  name: string;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type ProductMedia = {
  id?: string | undefined;
  versionId?: string | undefined;
  productId: string;
  productVersionId?: string | undefined;
  mediaId: string;
  position?: number | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  media?: Media | undefined;
};
type ProductCrossSelling = {
  id?: string | undefined;
  name: string;
  position: number;
  sortBy?: string | undefined;
  sortDirection?: string | undefined;
  type: string;
  active?: boolean | undefined;
  limit?: number | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type ProductConfiguratorSetting = {
  id?: string | undefined;
  versionId?: string | undefined;
  productId: string;
  productVersionId?: string | undefined;
  mediaId?: string | undefined;
  optionId: string;
  position?: number | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  media?: Media | undefined;
  option?: PropertyGroupOption | undefined;
};
type ProductReview = {
  id?: string | undefined;
  productId: string;
  productVersionId?: string | undefined;
  salesChannelId: string;
  languageId: string;
  title: string;
  content: string;
  points?: number | undefined;
  status?: boolean | undefined;
  comment?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type MainCategory = {
  id?: string | undefined;
  productId: string;
  productVersionId?: string | undefined;
  categoryId: string;
  categoryVersionId?: string | undefined;
  salesChannelId: string;
  createdAt: string;
  updatedAt?: string | undefined;
};
type ProductStream = {
  id?: string | undefined;
  name: string;
  description?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
};
type ProductDownload = {
  id?: string | undefined;
  versionId?: string | undefined;
  productId: string;
  productVersionId?: string | undefined;
  mediaId: string;
  position?: number | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  product?: Product | undefined;
  media?: Media | undefined;
};
type PropertyGroup = {
  id?: string | undefined;
  name: string;
  description?: string | undefined;
  displayType: string;
  sortingType: string;
  filterable?: boolean | undefined;
  visibleOnProductDetailPage?: boolean | undefined;
  position?: number | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  options?: PropertyGroupOption | undefined;
};
type PropertyGroupOption = {
  id?: string | undefined;
  groupId: string;
  name: string;
  position?: number | undefined;
  colorHexCode?: string | undefined;
  mediaId?: string | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  media?: Media | undefined;
  group?: PropertyGroup | undefined;
};
type SalesChannel = {
  id?: string | undefined;
  languageId: string;
  customerGroupId: string;
  currencyId: string;
  paymentMethodId: string;
  shippingMethodId: string;
  countryId: string;
  navigationCategoryId: string;
  navigationCategoryVersionId?: string | undefined;
  navigationCategoryDepth?: number | undefined;
  footerCategoryId?: string | undefined;
  footerCategoryVersionId?: string | undefined;
  serviceCategoryId?: string | undefined;
  serviceCategoryVersionId?: string | undefined;
  mailHeaderFooterId?: string | undefined;
  hreflangDefaultDomainId?: string | undefined;
  name: string;
  shortName?: string | undefined;
  taxCalculationType?: string | undefined;
  configuration?: {} | undefined;
  active?: boolean | undefined;
  hreflangActive?: boolean | undefined;
  maintenance?: boolean | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  language?: Language | undefined;
  currency?: Currency | undefined;
  paymentMethod?: PaymentMethod | undefined;
  shippingMethod?: ShippingMethod | undefined;
  country?: Country | undefined;
  domains?: SalesChannelDomain | undefined;
  navigationCategory?: Category | undefined;
  footerCategory?: Category | undefined;
  serviceCategory?: Category | undefined;
  hreflangDefaultDomain?: SalesChannelDomain | undefined;
};
type SalesChannelDomain = {
  id?: string | undefined;
  url: string;
  salesChannelId: string;
  languageId: string;
  currencyId: string;
  snippetSetId: string;
  hreflangUseOnlyLocale?: boolean | undefined;
  customFields?: {} | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  language?: Language | undefined;
  currency?: Currency | undefined;
  salesChannelDefaultHreflang?: SalesChannel | undefined;
};
type SwagCustomizedProductsTemplate = {
  id?: string | undefined;
  versionId?: string | undefined;
  parentVersionId?: string | undefined;
  internalName: string;
  displayName: string;
  description?: string | undefined;
  active?: boolean | undefined;
  stepByStep?: boolean | undefined;
  confirmInput?: boolean | undefined;
  optionsAutoCollapse?: boolean | undefined;
  decisionTree?: {} | undefined;
  mediaId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  media?: Media | undefined;
  options?: SwagCustomizedProductsTemplateOption | undefined;
  products?: Product | undefined;
  exclusions?: SwagCustomizedProductsTemplateExclusion | undefined;
  configurations?: SwagCustomizedProductsTemplateConfiguration | undefined;
};
type SwagCustomizedProductsTemplateConfigurationShare = {
  id?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
};
type SwagCustomizedProductsTemplateConfiguration = {
  id?: string | undefined;
  versionId?: string | undefined;
  templateVersionId?: string | undefined;
  hash: string;
  configuration: {};
  templateId: string;
  createdAt: string;
  updatedAt?: string | undefined;
  template?: SwagCustomizedProductsTemplate | undefined;
  templateConfigurationShares?:
    | SwagCustomizedProductsTemplateConfigurationShare
    | undefined;
};
type SwagCustomizedProductsTemplateExclusion = {
  id?: string | undefined;
  versionId?: string | undefined;
  name: string;
  templateId: string;
  templateVersionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  conditions?: SwagCustomizedProductsTemplateExclusionCondition | undefined;
  template?: SwagCustomizedProductsTemplate | undefined;
};
type SwagCustomizedProductsTemplateExclusionCondition = {
  id?: string | undefined;
  versionId?: string | undefined;
  templateExclusionId: string;
  templateExclusionVersionId?: string | undefined;
  templateOptionId: string;
  templateOptionVersionId?: string | undefined;
  templateExclusionOperatorId: string;
  createdAt: string;
  updatedAt?: string | undefined;
  templateExclusion?: SwagCustomizedProductsTemplateExclusion | undefined;
  templateOption?: SwagCustomizedProductsTemplateOption | undefined;
  templateExclusionOperator?:
    | SwagCustomizedProductsTemplateExclusionOperator
    | undefined;
  templateOptionValues?: SwagCustomizedProductsTemplateOptionValue | undefined;
};
type SwagCustomizedProductsTemplateExclusionOperator = {
  id?: string | undefined;
  operator: string;
  templateOptionType: string;
  label: string;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  templateExclusionConditions?:
    | SwagCustomizedProductsTemplateExclusionCondition
    | undefined;
};
type SwagCustomizedProductsTemplateOption = {
  id?: string | undefined;
  templateVersionId?: string | undefined;
  type: string;
  displayName: string;
  description?: string | undefined;
  placeholder?: string | undefined;
  typeProperties?: {} | undefined;
  itemNumber?: string | undefined;
  required?: boolean | undefined;
  oneTimeSurcharge?: boolean | undefined;
  relativeSurcharge?: boolean | undefined;
  advancedSurcharge?: boolean | undefined;
  position?: number | undefined;
  price?: {} | undefined;
  calculatedPrice?: {} | undefined;
  percentageSurcharge?: number | undefined;
  templateId: string;
  taxId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  prices?: SwagCustomizedProductsTemplateOptionPrice | undefined;
  values?: SwagCustomizedProductsTemplateOptionValue | undefined;
  templateExclusionConditions?:
    | SwagCustomizedProductsTemplateExclusionCondition
    | undefined;
  template?: SwagCustomizedProductsTemplate | undefined;
  tax?: Tax | undefined;
};
type SwagCustomizedProductsTemplateOptionPrice = {
  id?: string | undefined;
  versionId?: string | undefined;
  templateOptionId: string;
  templateOptionVersionId?: string | undefined;
  price?: {} | undefined;
  percentageSurcharge?: number | undefined;
  ruleId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  templateOption?: SwagCustomizedProductsTemplateOption | undefined;
  rule?: Rule | undefined;
};
type SwagCustomizedProductsTemplateOptionValue = {
  id?: string | undefined;
  versionId?: string | undefined;
  templateOptionId: string;
  templateOptionVersionId?: string | undefined;
  value?: {} | undefined;
  displayName: string;
  itemNumber?: string | undefined;
  default?: boolean | undefined;
  oneTimeSurcharge?: boolean | undefined;
  relativeSurcharge?: boolean | undefined;
  advancedSurcharge?: boolean | undefined;
  position: number;
  price?: {} | undefined;
  percentageSurcharge?: number | undefined;
  taxId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  translated?: {} | undefined;
  prices?: SwagCustomizedProductsTemplateOptionValuePrice | undefined;
  templateOption?: SwagCustomizedProductsTemplateOption | undefined;
  tax?: Tax | undefined;
  templateExclusionConditions?:
    | SwagCustomizedProductsTemplateExclusionCondition
    | undefined;
};
type SwagCustomizedProductsTemplateOptionValuePrice = {
  id?: string | undefined;
  versionId?: string | undefined;
  templateOptionValueId: string;
  templateOptionValueVersionId?: string | undefined;
  price?: {} | undefined;
  percentageSurcharge?: number | undefined;
  ruleId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  templateOptionValue?: SwagCustomizedProductsTemplateOptionValue | undefined;
  rule?: Rule | undefined;
};

const Criteria = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    filter: z.array(
      z
        .object({ type: z.string(), field: z.string(), value: z.string() })
        .passthrough(),
    ),
    sort: z.array(
      z
        .object({
          field: z.string(),
          order: z.string().optional(),
          naturalSorting: z.boolean().optional(),
        })
        .passthrough(),
    ),
    "post-filter": z.array(
      z
        .object({ type: z.string(), field: z.string(), value: z.string() })
        .passthrough(),
    ),
    associations: z.object({}).partial().passthrough(),
    aggregations: z.array(
      z
        .object({ name: z.string(), type: z.string(), field: z.string() })
        .passthrough(),
    ),
    grouping: z.array(z.string()),
    fields: z.array(z.string()),
    "total-count-mode": z.union([z.literal(0), z.literal(1), z.literal(2)]),
  })
  .partial()
  .passthrough();
const readCategoryList_Body = Criteria;
const MediaThumbnail = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    mediaId: z.string().regex(/^[0-9a-f]{32}$/),
    width: z.number().int(),
    height: z.number().int(),
    url: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Media = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    mimeType: z.string().optional(),
    fileExtension: z.string().optional(),
    uploadedAt: z.string().datetime({ offset: true }).optional(),
    fileName: z.string().optional(),
    fileSize: z.number().int().optional(),
    metaData: z.object({}).partial().passthrough().optional(),
    alt: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
    hasFile: z.boolean().optional(),
    private: z.boolean().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
    extensions: z
      .object({
        mediaAiTag: z
          .object({
            links: z.object({ related: z.string() }).partial().passthrough(),
            data: z
              .object({
                type: z.string(),
                id: z.string().regex(/^[0-9a-f]{32}$/),
              })
              .partial()
              .passthrough(),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough()
      .optional(),
    thumbnails: MediaThumbnail.optional(),
  })
  .passthrough();
const CmsSlot: z.ZodType<CmsSlot> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      type: z.string(),
      slot: z.string(),
      locked: z.boolean().optional(),
      config: z.object({}).partial().passthrough().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      data: z.object({}).partial().passthrough().optional(),
      blockId: z.string().regex(/^[0-9a-f]{32}$/),
      fieldConfig: z.object({}).partial().passthrough().optional(),
      cmsBlockVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      block: CmsBlock.optional(),
    })
    .passthrough(),
);
const CmsBlock: z.ZodType<CmsBlock> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      position: z.number().int(),
      type: z.string(),
      name: z.string().optional(),
      sectionPosition: z.string().optional(),
      marginTop: z.string().optional(),
      marginBottom: z.string().optional(),
      marginLeft: z.string().optional(),
      marginRight: z.string().optional(),
      backgroundColor: z.string().optional(),
      backgroundMediaId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      backgroundMediaMode: z.string().optional(),
      cssClass: z.string().optional(),
      visibility: z
        .object({
          mobile: z.boolean(),
          desktop: z.boolean(),
          tablet: z.boolean(),
        })
        .partial()
        .passthrough()
        .optional(),
      sectionId: z.string().regex(/^[0-9a-f]{32}$/),
      customFields: z.object({}).partial().passthrough().optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      cmsSectionVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      extensions: z
        .object({
          swagCmsExtensionsQuickview: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
          swagCmsExtensionsBlockRule: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      backgroundMedia: Media.optional(),
      slots: CmsSlot.optional(),
    })
    .passthrough(),
);
const CmsSection: z.ZodType<CmsSection> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      position: z.number().int(),
      type: z.string(),
      name: z.string().optional(),
      sizingMode: z.string().optional(),
      mobileBehavior: z.string().optional(),
      backgroundColor: z.string().optional(),
      backgroundMediaId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      backgroundMediaMode: z.string().optional(),
      cssClass: z.string().optional(),
      pageId: z.string().regex(/^[0-9a-f]{32}$/),
      visibility: z
        .object({
          mobile: z.boolean(),
          desktop: z.boolean(),
          tablet: z.boolean(),
        })
        .partial()
        .passthrough()
        .optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      cmsPageVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      extensions: z
        .object({
          swagCmsExtensionsScrollNavigation: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      page: CmsPage.optional(),
      backgroundMedia: Media.optional(),
      blocks: CmsBlock.optional(),
    })
    .passthrough(),
);
const SeoUrl = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    salesChannelId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    languageId: z.string().regex(/^[0-9a-f]{32}$/),
    foreignKey: z.string().regex(/^[0-9a-f]{32}$/),
    routeName: z.string(),
    pathInfo: z.string(),
    seoPathInfo: z.string(),
    isCanonical: z.boolean().optional(),
    isModified: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    url: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    isValid: z.boolean().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const LandingPage: z.ZodType<LandingPage> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      active: z.boolean().optional(),
      name: z.string(),
      customFields: z.object({}).partial().passthrough().optional(),
      slotConfig: z.object({}).partial().passthrough().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      url: z.string(),
      cmsPageId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      cmsPageVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      cmsPage: CmsPage.optional(),
      seoUrls: SeoUrl.optional(),
    })
    .passthrough(),
);
const CmsPage: z.ZodType<CmsPage> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      name: z.string().optional(),
      type: z.string(),
      entity: z.string().optional(),
      cssClass: z.string().optional(),
      config: z
        .object({ backgroundColor: z.string() })
        .partial()
        .passthrough()
        .optional(),
      previewMediaId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      extensions: z
        .object({
          swagCmsExtensionsScrollNavigationPageSettings: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      sections: CmsSection.optional(),
      previewMedia: Media.optional(),
      landingPages: LandingPage.optional(),
    })
    .passthrough(),
);
const Category: z.ZodType<Category> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      afterCategoryId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      afterCategoryVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      mediaId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      displayNestedProducts: z.boolean(),
      breadcrumb: z.array(z.unknown()).optional(),
      level: z.number().int().optional(),
      path: z.string().optional(),
      childCount: z.number().int().optional(),
      type: z.string(),
      productAssignmentType: z.string(),
      visible: z.boolean().optional(),
      active: z.boolean().optional(),
      cmsPageIdSwitched: z.boolean().optional(),
      visibleChildCount: z.number().int().optional(),
      name: z.string(),
      customFields: z.object({}).partial().passthrough().optional(),
      linkType: z.string().optional(),
      internalLink: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      externalLink: z.string().optional(),
      linkNewTab: z.boolean().optional(),
      description: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      cmsPageId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      cmsPageVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      customEntityTypeId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      parent: Category.optional(),
      children: Category.optional(),
      media: Media.optional(),
      cmsPage: CmsPage.optional(),
      seoUrls: SeoUrl.optional(),
    })
    .passthrough(),
);
const Struct = z.object({ apiAlias: z.string() }).partial().passthrough();
const EntitySearchResult = Struct.and(
  z
    .object({
      entity: z.string(),
      total: z.number().int(),
      aggregations: z.array(z.object({}).partial().passthrough()),
      page: z.number().int(),
      limit: z.number().int(),
    })
    .partial()
    .passthrough(),
);
const ProductListingCriteria = Criteria.and(
  z
    .object({
      order: z.string(),
      limit: z.number().int().gte(0),
      p: z.number().int().default(1),
      manufacturer: z.string(),
      "min-price": z.number().int().gte(0),
      "max-price": z.number().int().gte(0),
      rating: z.number().int(),
      "shipping-free": z.boolean(),
      properties: z.string(),
      "manufacturer-filter": z.boolean().default(true),
      "price-filter": z.boolean().default(true),
      "rating-filter": z.boolean().default(true),
      "shipping-free-filter": z.boolean().default(true),
      "property-filter": z.boolean().default(true),
      "property-whitelist": z.string(),
      "reduce-aggregations": z.string().nullable(),
    })
    .partial()
    .passthrough(),
);
const readCategory_Body = Criteria.and(ProductListingCriteria);
const meta = z.object({}).partial().passthrough();
const link = z.union([
  z.string(),
  z.object({ href: z.string(), meta: meta.optional() }).passthrough(),
]);
const links = z.record(link);
const error = z
  .object({
    id: z.string(),
    links: links,
    status: z.string(),
    code: z.string(),
    title: z.string(),
    detail: z.string(),
    source: z
      .object({ pointer: z.string(), parameter: z.string() })
      .partial()
      .passthrough(),
    meta: meta,
  })
  .partial();
const failure = z.object({
  meta: meta.optional(),
  links: links.optional(),
  errors: z.array(error),
});
const SalesChannelContext = Struct.and(
  z
    .object({
      token: z.string(),
      currentCustomerGroup: z
        .object({ name: z.string(), displayGross: z.boolean() })
        .partial()
        .passthrough(),
      fallbackCustomerGroup: z
        .object({ name: z.string(), displayGross: z.boolean() })
        .partial()
        .passthrough(),
      currency: z
        .object({
          isoCode: z.string(),
          factor: z.number().int(),
          symbol: z.string(),
          shortName: z.string(),
          name: z.string(),
          position: z.number().int(),
          decimalPrecision: z.number().int(),
          isSystemDefault: z.boolean(),
        })
        .partial()
        .passthrough(),
      salesChannel: z
        .object({
          typeId: z.string(),
          languageId: z.string(),
          currencyId: z.string(),
          paymentMethodId: z.string(),
          shippingMethodId: z.string(),
          countryId: z.string(),
          navigationCategoryId: z.string(),
          navigationCategoryDepth: z.number().int(),
          footerCategoryId: z.string(),
          serviceCategoryId: z.string(),
          name: z.string(),
          shortName: z.string(),
          accessKey: z.string(),
          active: z.boolean(),
          maintenance: z.boolean(),
          maintenanceIpWhitelist: z.string(),
          mailHeaderFooterId: z.string(),
          customerGroupId: z.string(),
          hreflangActive: z.boolean(),
          hreflangDefaultDomainId: z.string(),
          analyticsId: z.string(),
        })
        .partial()
        .passthrough(),
      taxRules: z.array(
        z
          .object({ taxRate: z.number(), name: z.string() })
          .partial()
          .passthrough(),
      ),
      customer: z
        .object({
          groupId: z.string(),
          defaultPaymentMethodId: z.string(),
          salesChannelId: z.string(),
          languageId: z.string(),
          lastPaymentMethodId: z.string(),
          defaultBillingAddressId: z.string(),
          defaultShippingAddressId: z.string(),
          customerNumber: z.string(),
          salutationId: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          company: z.string(),
          password: z.string(),
          email: z.string(),
          title: z.string(),
          affiliateCode: z.string(),
          campaignCode: z.string(),
          active: z.boolean(),
          doubleOptInRegistration: z.boolean(),
          doubleOptInEmailSentDate: z.string().datetime({ offset: true }),
          doubleOptInConfirmDate: z.string().datetime({ offset: true }),
          hash: z.string(),
          guest: z.boolean(),
          firstLogin: z.string().datetime({ offset: true }),
          lastLogin: z.string().datetime({ offset: true }),
          newsletter: z.boolean(),
          birthday: z.string().datetime({ offset: true }),
          lastOrderDate: z.string().datetime({ offset: true }),
          orderCount: z.number().int(),
          legacyEncoder: z.string(),
          legacyPassword: z.string(),
          autoIncrement: z.number().int(),
          remoteAddress: z.string(),
        })
        .partial()
        .passthrough(),
      paymentMethod: z
        .object({
          pluginId: z.string(),
          handlerIdentifier: z.string(),
          name: z.string(),
          description: z.string(),
          position: z.number().int(),
          active: z.boolean(),
          availabilityRuleId: z.string(),
          mediaId: z.string(),
          formattedHandlerIdentifier: z.string(),
        })
        .partial()
        .passthrough(),
      shippingMethod: z
        .object({
          name: z.string(),
          active: z.boolean(),
          description: z.string(),
          trackingUrl: z.string(),
          deliveryTimeId: z.string(),
          availabilityRuleId: z.string(),
          mediaId: z.string(),
        })
        .partial()
        .passthrough(),
      context: z
        .object({
          versionId: z.string(),
          currencyId: z.string(),
          currencyFactor: z.number().int(),
          currencyPrecision: z.number().int(),
          scope: z.string(),
          source: z.string(),
          taxState: z.string(),
          useCache: z.boolean(),
        })
        .partial()
        .passthrough(),
    })
    .partial()
    .passthrough(),
);
const updateContext_Body = z
  .object({
    currencyId: z.string().regex(/^[0-9a-f]{32}$/),
    languageId: z.string().regex(/^[0-9a-f]{32}$/),
    billingAddressId: z.string().regex(/^[0-9a-f]{32}$/),
    shippingAddressId: z.string().regex(/^[0-9a-f]{32}$/),
    paymentMethodId: z.string().regex(/^[0-9a-f]{32}$/),
    shippingMethodId: z.string().regex(/^[0-9a-f]{32}$/),
    countryId: z.string().regex(/^[0-9a-f]{32}$/),
    countryStateId: z.string().regex(/^[0-9a-f]{32}$/),
  })
  .partial()
  .passthrough();
const ContextTokenResponse = z
  .object({ contextToken: z.string() })
  .partial()
  .passthrough();
const Currency = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    factor: z.number(),
    symbol: z.string(),
    isoCode: z.string(),
    shortName: z.string(),
    name: z.string(),
    position: z.number().int().optional(),
    isSystemDefault: z.boolean().optional(),
    taxFreeFrom: z.number().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    itemRounding: z
      .object({
        decimals: z.number().int(),
        interval: z.number(),
        roundForNet: z.boolean(),
      })
      .partial()
      .passthrough(),
    totalRounding: z
      .object({
        decimals: z.number().int(),
        interval: z.number(),
        roundForNet: z.boolean(),
      })
      .partial()
      .passthrough(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const handlePaymentMethod_Body = z
  .object({
    orderId: z.string(),
    finishUrl: z.string().optional(),
    errorUrl: z.string().optional(),
  })
  .passthrough();
const Locale = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    code: z.string(),
    name: z.string(),
    territory: z.string(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const Language: z.ZodType<Language> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      localeId: z.string().regex(/^[0-9a-f]{32}$/),
      translationCodeId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      name: z.string(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      parent: Language.optional(),
      locale: Locale.optional(),
      translationCode: Locale.optional(),
      children: Language.optional(),
    })
    .passthrough(),
);
const readNavigation_Body = Criteria.and(
  z
    .object({ depth: z.unknown(), buildTree: z.unknown() })
    .partial()
    .passthrough(),
);
const NavigationRouteResponse = z.array(Category);
const readPaymentMethod_Body = Criteria.and(
  z.object({ onlyAvailable: z.boolean() }).partial().passthrough(),
);
const PaymentMethod = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    distinguishableName: z.string().optional(),
    description: z.string().optional(),
    position: z.number().int().optional(),
    active: z.boolean().optional(),
    afterOrderEnabled: z.boolean().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    mediaId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    synchronous: z.boolean().optional(),
    asynchronous: z.boolean().optional(),
    prepared: z.boolean().optional(),
    refundable: z.boolean().optional(),
    shortName: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
    media: Media.optional(),
  })
  .passthrough();
const confirmNewsletter_Body = z
  .object({ hash: z.string(), em: z.string() })
  .passthrough();
const subscribeToNewsletter_Body = z
  .object({
    email: z.string(),
    option: z.unknown(),
    storefrontUrl: z.string(),
    salutationId: z.unknown().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    tags: z.string().optional(),
    languageId: z.unknown().optional(),
    customFields: z.string().optional(),
  })
  .passthrough();
const CountryState = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    countryId: z.string().regex(/^[0-9a-f]{32}$/),
    shortCode: z.string(),
    name: z.string(),
    position: z.number().int().optional(),
    active: z.boolean().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const Country = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    iso: z.string().optional(),
    position: z.number().int().optional(),
    active: z.boolean().optional(),
    shippingAvailable: z.boolean().optional(),
    iso3: z.string().optional(),
    displayStateInRegistration: z.boolean().optional(),
    forceStateInRegistration: z.boolean().optional(),
    checkVatIdPattern: z.boolean().optional(),
    vatIdRequired: z.boolean().optional(),
    vatIdPattern: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    customerTax: z
      .object({
        enabled: z.boolean(),
        currencyId: z.string(),
        amount: z.number(),
      })
      .passthrough()
      .optional(),
    companyTax: z
      .object({
        enabled: z.boolean(),
        currencyId: z.string(),
        amount: z.number(),
      })
      .passthrough()
      .optional(),
    postalCodeRequired: z.boolean().optional(),
    checkPostalCodePattern: z.boolean().optional(),
    checkAdvancedPostalCodePattern: z.boolean().optional(),
    advancedPostalCodePattern: z.string().optional(),
    addressFormat: z.object({}).partial().passthrough(),
    defaultPostalCodePattern: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
    states: CountryState.optional(),
  })
  .passthrough();
const sendContactMail_Body = z
  .object({
    salutationId: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string(),
    phone: z.string().optional(),
    subject: z.string(),
    comment: z.string(),
    navigationId: z.string().optional(),
    slotId: z.string().optional(),
    cmsPageType: z.string().optional(),
    entityName: z.string().optional(),
  })
  .passthrough();
const CustomerGroup = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    displayGross: z.boolean().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    registrationActive: z.boolean().optional(),
    registrationTitle: z.string().optional(),
    registrationIntroduction: z.string().optional(),
    registrationOnlyCompanyRegistration: z.boolean().optional(),
    registrationSeoMetaDescription: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const readCms_Body = z
  .object({ slots: z.string() })
  .partial()
  .passthrough()
  .and(ProductListingCriteria);
const Salutation = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    salutationKey: z.string(),
    displayName: z.string(),
    letterName: z.string(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const DocumentType = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    technicalName: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const StateMachineState = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    technicalName: z.string(),
    name: z.string(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const OrderCustomer = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    email: z.string(),
    salutationId: z.string().regex(/^[0-9a-f]{32}$/),
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    title: z.string().optional(),
    vatIds: z.array(z.string()).optional(),
    customerNumber: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    salutation: Salutation.optional(),
  })
  .passthrough();
const OrderAddress = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    countryId: z.string().regex(/^[0-9a-f]{32}$/),
    countryStateId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    firstName: z.string(),
    lastName: z.string(),
    street: z.string(),
    zipcode: z.string().optional(),
    city: z.string(),
    company: z.string().optional(),
    department: z.string().optional(),
    title: z.string().optional(),
    vatId: z.string().optional(),
    phoneNumber: z.string().optional(),
    additionalAddressLine1: z.string().optional(),
    additionalAddressLine2: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    country: Country.optional(),
    countryState: CountryState.optional(),
    salutation: Salutation.optional(),
  })
  .passthrough();
const DeliveryTime = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    min: z.number().int(),
    max: z.number().int(),
    unit: z.string(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const Rule = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    description: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    extensions: z
      .object({
        warehouseGroup: z
          .object({
            links: z.object({ related: z.string() }).partial().passthrough(),
            data: z.array(
              z
                .object({ type: z.string(), id: z.string() })
                .partial()
                .passthrough(),
            ),
          })
          .partial()
          .passthrough(),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const ShippingMethodPrice = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    shippingMethodId: z.string().regex(/^[0-9a-f]{32}$/),
    ruleId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    calculation: z.number().int().optional(),
    calculationRuleId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    quantityStart: z.number().optional(),
    quantityEnd: z.number().optional(),
    currencyPrice: z.object({}).partial().passthrough().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Tag = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Tax = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    taxRate: z.number(),
    name: z.string(),
    position: z.number().int(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const ShippingMethod = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    active: z.boolean().optional(),
    position: z.number().int().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    mediaId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    deliveryTimeId: z.string().regex(/^[0-9a-f]{32}$/),
    taxType: z.string(),
    description: z.string().optional(),
    trackingUrl: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
    deliveryTime: DeliveryTime.optional(),
    availabilityRule: Rule.optional(),
    prices: ShippingMethodPrice.optional(),
    media: Media.optional(),
    tags: Tag.optional(),
    tax: Tax.optional(),
  })
  .passthrough();
const OrderDeliveryPosition = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    orderDeliveryId: z.string().regex(/^[0-9a-f]{32}$/),
    orderDeliveryVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    orderLineItemId: z.string().regex(/^[0-9a-f]{32}$/),
    orderLineItemVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    price: z
      .object({
        unitPrice: z.number(),
        totalPrice: z.number(),
        quantity: z.number().int(),
        calculatedTaxes: z.object({}).partial().passthrough().optional(),
        taxRules: z.object({}).partial().passthrough().optional(),
        referencePrice: z.object({}).partial().passthrough().optional(),
        listPrice: z
          .object({
            price: z.number(),
            discount: z.number(),
            percentage: z.number(),
          })
          .partial()
          .passthrough()
          .optional(),
        regulationPrice: z
          .object({ price: z.number() })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    quantity: z.number().int().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const OrderDelivery = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    orderId: z.string().regex(/^[0-9a-f]{32}$/),
    orderVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    shippingOrderAddressId: z.string().regex(/^[0-9a-f]{32}$/),
    shippingOrderAddressVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    shippingMethodId: z.string().regex(/^[0-9a-f]{32}$/),
    stateId: z.string().regex(/^[0-9a-f]{32}$/),
    trackingCodes: z.array(z.string()),
    shippingDateEarliest: z.string().datetime({ offset: true }),
    shippingDateLatest: z.string().datetime({ offset: true }),
    shippingCosts: z
      .object({
        unitPrice: z.number(),
        totalPrice: z.number(),
        quantity: z.number().int(),
        calculatedTaxes: z.object({}).partial().passthrough().optional(),
        taxRules: z.object({}).partial().passthrough().optional(),
        referencePrice: z.object({}).partial().passthrough().optional(),
        listPrice: z
          .object({
            price: z.number(),
            discount: z.number(),
            percentage: z.number(),
          })
          .partial()
          .passthrough()
          .optional(),
        regulationPrice: z
          .object({ price: z.number() })
          .partial()
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    stateMachineState: StateMachineState.optional(),
    shippingOrderAddress: OrderAddress.optional(),
    shippingMethod: ShippingMethod.optional(),
    positions: OrderDeliveryPosition.optional(),
  })
  .passthrough();
const OrderLineItemDownload: z.ZodType<OrderLineItemDownload> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderLineItemId: z.string().regex(/^[0-9a-f]{32}$/),
      orderLineItemVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      mediaId: z.string().regex(/^[0-9a-f]{32}$/),
      position: z.number().int(),
      accessGranted: z.boolean(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      orderLineItem: OrderLineItem.optional(),
      media: Media.optional(),
    })
    .passthrough(),
);
const OrderLineItem: z.ZodType<OrderLineItem> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderId: z.string().regex(/^[0-9a-f]{32}$/),
      orderVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      coverId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      identifier: z.string(),
      referencedId: z.string().optional(),
      quantity: z.number().int(),
      label: z.string(),
      payload: z.object({}).partial().passthrough().optional(),
      good: z.boolean().optional(),
      removable: z.boolean().optional(),
      stackable: z.boolean().optional(),
      position: z.number().int(),
      states: z.array(z.string()),
      priceDefinition: z.object({}).partial().passthrough().optional(),
      unitPrice: z.number().optional(),
      totalPrice: z.number().optional(),
      description: z.string().optional(),
      type: z.string().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      extensions: z
        .object({
          returns: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z.array(
                z
                  .object({ type: z.string(), id: z.string() })
                  .partial()
                  .passthrough(),
              ),
            })
            .partial()
            .passthrough(),
          state: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      cover: Media.optional(),
      orderDeliveryPositions: OrderDeliveryPosition.optional(),
      downloads: OrderLineItemDownload.optional(),
      parent: OrderLineItem.optional(),
      children: OrderLineItem,
    })
    .passthrough(),
);
const OrderTransactionCaptureRefundPosition: z.ZodType<OrderTransactionCaptureRefundPosition> =
  z.lazy(() =>
    z
      .object({
        id: z
          .string()
          .regex(/^[0-9a-f]{32}$/)
          .optional(),
        refundId: z.string().regex(/^[0-9a-f]{32}$/),
        orderLineItemId: z.string().regex(/^[0-9a-f]{32}$/),
        orderLineItemVersionId: z
          .string()
          .regex(/^[0-9a-f]{32}$/)
          .optional(),
        externalReference: z.string().optional(),
        reason: z.string().optional(),
        quantity: z.number().int().optional(),
        amount: z
          .object({
            unitPrice: z.number(),
            totalPrice: z.number(),
            quantity: z.number().int(),
            calculatedTaxes: z.object({}).partial().passthrough().optional(),
            taxRules: z.object({}).partial().passthrough().optional(),
            referencePrice: z.object({}).partial().passthrough().optional(),
            listPrice: z
              .object({
                price: z.number(),
                discount: z.number(),
                percentage: z.number(),
              })
              .partial()
              .passthrough()
              .optional(),
            regulationPrice: z
              .object({ price: z.number() })
              .partial()
              .passthrough()
              .optional(),
          })
          .passthrough(),
        customFields: z.object({}).partial().passthrough().optional(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }).optional(),
        orderLineItem: OrderLineItem.optional(),
        orderTransactionCaptureRefund: OrderTransactionCaptureRefund.optional(),
      })
      .passthrough(),
  );
const OrderTransactionCaptureRefund: z.ZodType<OrderTransactionCaptureRefund> =
  z.lazy(() =>
    z
      .object({
        id: z
          .string()
          .regex(/^[0-9a-f]{32}$/)
          .optional(),
        captureId: z.string().regex(/^[0-9a-f]{32}$/),
        stateId: z.string().regex(/^[0-9a-f]{32}$/),
        externalReference: z.string().optional(),
        reason: z.string().optional(),
        amount: z
          .object({
            unitPrice: z.number(),
            totalPrice: z.number(),
            quantity: z.number().int(),
            calculatedTaxes: z.object({}).partial().passthrough().optional(),
            taxRules: z.object({}).partial().passthrough().optional(),
            referencePrice: z.object({}).partial().passthrough().optional(),
            listPrice: z
              .object({
                price: z.number(),
                discount: z.number(),
                percentage: z.number(),
              })
              .partial()
              .passthrough()
              .optional(),
            regulationPrice: z
              .object({ price: z.number() })
              .partial()
              .passthrough()
              .optional(),
          })
          .passthrough(),
        customFields: z.object({}).partial().passthrough().optional(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }).optional(),
        stateMachineState: StateMachineState.optional(),
        transactionCapture: OrderTransactionCapture.optional(),
        positions: OrderTransactionCaptureRefundPosition.optional(),
      })
      .passthrough(),
  );
const OrderTransactionCapture: z.ZodType<OrderTransactionCapture> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderTransactionId: z.string().regex(/^[0-9a-f]{32}$/),
      orderTransactionVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      stateId: z.string().regex(/^[0-9a-f]{32}$/),
      externalReference: z.string().optional(),
      amount: z
        .object({
          unitPrice: z.number(),
          totalPrice: z.number(),
          quantity: z.number().int(),
          calculatedTaxes: z.object({}).partial().passthrough().optional(),
          taxRules: z.object({}).partial().passthrough().optional(),
          referencePrice: z.object({}).partial().passthrough().optional(),
          listPrice: z
            .object({
              price: z.number(),
              discount: z.number(),
              percentage: z.number(),
            })
            .partial()
            .passthrough()
            .optional(),
          regulationPrice: z
            .object({ price: z.number() })
            .partial()
            .passthrough()
            .optional(),
        })
        .passthrough(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      stateMachineState: StateMachineState.optional(),
      transaction: OrderTransaction.optional(),
      refunds: OrderTransactionCaptureRefund.optional(),
    })
    .passthrough(),
);
const OrderTransaction: z.ZodType<OrderTransaction> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderId: z.string().regex(/^[0-9a-f]{32}$/),
      orderVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      paymentMethodId: z.string().regex(/^[0-9a-f]{32}$/),
      amount: z
        .object({
          unitPrice: z.number(),
          totalPrice: z.number(),
          quantity: z.number().int(),
          calculatedTaxes: z.object({}).partial().passthrough().optional(),
          taxRules: z.object({}).partial().passthrough().optional(),
          referencePrice: z.object({}).partial().passthrough().optional(),
          listPrice: z
            .object({
              price: z.number(),
              discount: z.number(),
              percentage: z.number(),
            })
            .partial()
            .passthrough()
            .optional(),
          regulationPrice: z
            .object({ price: z.number() })
            .partial()
            .passthrough()
            .optional(),
        })
        .passthrough(),
      stateId: z.string().regex(/^[0-9a-f]{32}$/),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      stateMachineState: StateMachineState.optional(),
      paymentMethod: PaymentMethod.optional(),
      captures: OrderTransactionCapture.optional(),
    })
    .passthrough(),
);
const Order: z.ZodType<Order> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderNumber: z.string().optional(),
      billingAddressId: z.string().regex(/^[0-9a-f]{32}$/),
      billingAddressVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      currencyId: z.string().regex(/^[0-9a-f]{32}$/),
      languageId: z.string().regex(/^[0-9a-f]{32}$/),
      salesChannelId: z.string().regex(/^[0-9a-f]{32}$/),
      orderDateTime: z.string().datetime({ offset: true }),
      orderDate: z.string().optional(),
      price: z
        .object({
          netPrice: z.number(),
          totalPrice: z.number(),
          calculatedTaxes: z.object({}).partial().passthrough().optional(),
          taxRules: z.object({}).partial().passthrough().optional(),
          positionPrice: z.number(),
          rawTotal: z.number(),
          taxStatus: z.string(),
        })
        .passthrough()
        .optional(),
      amountTotal: z.number().optional(),
      amountNet: z.number().optional(),
      positionPrice: z.number().optional(),
      taxStatus: z.string().optional(),
      shippingCosts: z
        .object({
          unitPrice: z.number(),
          totalPrice: z.number(),
          quantity: z.number().int(),
          calculatedTaxes: z.object({}).partial().passthrough().optional(),
          taxRules: z.object({}).partial().passthrough().optional(),
          referencePrice: z.object({}).partial().passthrough().optional(),
          listPrice: z
            .object({
              price: z.number(),
              discount: z.number(),
              percentage: z.number(),
            })
            .partial()
            .passthrough()
            .optional(),
          regulationPrice: z
            .object({ price: z.number() })
            .partial()
            .passthrough()
            .optional(),
        })
        .passthrough()
        .optional(),
      shippingTotal: z.number().optional(),
      currencyFactor: z.number(),
      deepLinkCode: z.string().optional(),
      affiliateCode: z.string().optional(),
      campaignCode: z.string().optional(),
      customerComment: z.string().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdById: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      updatedById: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      extensions: z
        .object({
          returns: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z.array(
                z
                  .object({ type: z.string(), id: z.string() })
                  .partial()
                  .passthrough(),
              ),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      stateMachineState: StateMachineState.optional(),
      orderCustomer: OrderCustomer.optional(),
      currency: Currency.optional(),
      language: Language.optional(),
      addresses: OrderAddress.optional(),
      billingAddress: OrderAddress.optional(),
      deliveries: OrderDelivery.optional(),
      lineItems: OrderLineItem.optional(),
      transactions: OrderTransaction.optional(),
      documents: Document.optional(),
      tags: Tag.optional(),
    })
    .passthrough(),
);
const Document: z.ZodType<Document> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      documentTypeId: z.string().regex(/^[0-9a-f]{32}$/),
      fileType: z.string(),
      referencedDocumentId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderId: z.string().regex(/^[0-9a-f]{32}$/),
      documentMediaFileId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      orderVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      config: z.object({}).partial().passthrough(),
      sent: z.boolean().optional(),
      static: z.boolean().optional(),
      deepLinkCode: z.string(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      documentType: DocumentType.optional(),
      order: Order.optional(),
      referencedDocument: Document.optional(),
      dependentDocuments: Document.optional(),
      documentMediaFile: Media.optional(),
    })
    .passthrough(),
);
const changeProfile_Body = z
  .object({
    salutationId: z.string(),
    title: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    birthdayDay: z.number().int().optional(),
    birthdayMonth: z.number().int().optional(),
    birthdayYear: z.number().int().optional(),
  })
  .passthrough();
const SuccessResponse = z
  .object({ success: z.boolean() })
  .partial()
  .passthrough();
const changeEmail_Body = z
  .object({
    email: z.string(),
    emailConfirmation: z.string(),
    password: z.string(),
  })
  .passthrough();
const changePassword_Body = z
  .object({
    password: z.string(),
    newPassword: z.string(),
    newPasswordConfirm: z.string(),
  })
  .passthrough();
const CustomerAddress = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    customerId: z.string().regex(/^[0-9a-f]{32}$/),
    countryId: z.string().regex(/^[0-9a-f]{32}$/),
    countryStateId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    salutationId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    firstName: z.string(),
    lastName: z.string(),
    zipcode: z.string().optional(),
    city: z.string(),
    company: z.string().optional(),
    street: z.string(),
    department: z.string().optional(),
    title: z.string().optional(),
    phoneNumber: z.string().optional(),
    additionalAddressLine1: z.string().optional(),
    additionalAddressLine2: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    country: Country.optional(),
    countryState: CountryState.optional(),
    salutation: Salutation.optional(),
  })
  .passthrough();
const Customer = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    groupId: z.string().regex(/^[0-9a-f]{32}$/),
    defaultPaymentMethodId: z.string().regex(/^[0-9a-f]{32}$/),
    salesChannelId: z.string().regex(/^[0-9a-f]{32}$/),
    languageId: z.string().regex(/^[0-9a-f]{32}$/),
    lastPaymentMethodId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    defaultBillingAddressId: z.string().regex(/^[0-9a-f]{32}$/),
    defaultShippingAddressId: z.string().regex(/^[0-9a-f]{32}$/),
    customerNumber: z.string(),
    salutationId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    email: z.string(),
    title: z.string().optional(),
    vatIds: z.array(z.string()).optional(),
    affiliateCode: z.string().optional(),
    campaignCode: z.string().optional(),
    active: z.boolean().optional(),
    doubleOptInRegistration: z.boolean().optional(),
    doubleOptInEmailSentDate: z.string().datetime({ offset: true }).optional(),
    doubleOptInConfirmDate: z.string().datetime({ offset: true }).optional(),
    hash: z.string().optional(),
    guest: z.boolean().optional(),
    firstLogin: z.string().datetime({ offset: true }).optional(),
    lastLogin: z.string().datetime({ offset: true }).optional(),
    birthday: z.string().optional(),
    lastOrderDate: z.string().datetime({ offset: true }).optional(),
    orderCount: z.number().int().optional(),
    orderTotalAmount: z.number().optional(),
    reviewCount: z.number().int().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    tagIds: z.array(z.string()).optional(),
    accountType: z.string(),
    createdById: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    updatedById: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    group: CustomerGroup.optional(),
    defaultPaymentMethod: PaymentMethod.optional(),
    language: Language.optional(),
    lastPaymentMethod: PaymentMethod.optional(),
    defaultBillingAddress: CustomerAddress.optional(),
    defaultShippingAddress: CustomerAddress.optional(),
    salutation: Salutation.optional(),
    addresses: CustomerAddress.optional(),
  })
  .passthrough();
const loginCustomer_Body = z
  .object({ username: z.string(), password: z.string() })
  .passthrough();
const register_Body = z
  .object({
    email: z.string(),
    password: z.string(),
    salutationId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    acceptedDataProtection: z.boolean(),
    storefrontUrl: z.string(),
    billingAddress: CustomerAddress,
    shippingAddress: CustomerAddress.optional(),
    accountType: z.string().optional().default("private"),
    guest: z.boolean().optional(),
    birthdayDay: z.number().int().optional(),
    birthdayMonth: z.number().int().optional(),
    birthdayYear: z.number().int().optional(),
    title: z.string().optional(),
    affiliateCode: z.string().optional(),
    campaignCode: z.string().optional(),
  })
  .passthrough();
const recoveryPassword_Body = z
  .object({
    hash: z.string(),
    newPassword: z.string(),
    newPasswordConfirm: z.string(),
  })
  .passthrough();
const sendRecoveryMail_Body = z
  .object({ email: z.string(), storefrontUrl: z.string() })
  .passthrough();
const ProductDownload: z.ZodType<ProductDownload> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productId: z.string().regex(/^[0-9a-f]{32}$/),
      productVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      mediaId: z.string().regex(/^[0-9a-f]{32}$/),
      position: z.number().int().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      product: Product.optional(),
      media: Media.optional(),
    })
    .passthrough(),
);
const ProductManufacturer = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    mediaId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    link: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
    media: Media.optional(),
  })
  .passthrough();
const Unit = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    shortCode: z.string(),
    name: z.string(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const ProductMedia = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    productId: z.string().regex(/^[0-9a-f]{32}$/),
    productVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    mediaId: z.string().regex(/^[0-9a-f]{32}$/),
    position: z.number().int().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    media: Media.optional(),
  })
  .passthrough();
const ProductCrossSelling = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    position: z.number().int(),
    sortBy: z.string().optional(),
    sortDirection: z.string().optional(),
    type: z.string(),
    active: z.boolean().optional(),
    limit: z.number().int().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const PropertyGroup: z.ZodType<PropertyGroup> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      name: z.string(),
      description: z.string().optional(),
      displayType: z.string(),
      sortingType: z.string(),
      filterable: z.boolean().optional(),
      visibleOnProductDetailPage: z.boolean().optional(),
      position: z.number().int().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      options: PropertyGroupOption.optional(),
    })
    .passthrough(),
);
const PropertyGroupOption: z.ZodType<PropertyGroupOption> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      groupId: z.string().regex(/^[0-9a-f]{32}$/),
      name: z.string(),
      position: z.number().int().optional(),
      colorHexCode: z.string().optional(),
      mediaId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      media: Media.optional(),
      group: PropertyGroup.optional(),
    })
    .passthrough(),
);
const ProductConfiguratorSetting = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    versionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    productId: z.string().regex(/^[0-9a-f]{32}$/),
    productVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    mediaId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    optionId: z.string().regex(/^[0-9a-f]{32}$/),
    position: z.number().int().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    media: Media.optional(),
    option: PropertyGroupOption.optional(),
  })
  .passthrough();
const ProductReview = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    productId: z.string().regex(/^[0-9a-f]{32}$/),
    productVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    salesChannelId: z.string().regex(/^[0-9a-f]{32}$/),
    languageId: z.string().regex(/^[0-9a-f]{32}$/),
    title: z.string(),
    content: z.string(),
    points: z.number().optional(),
    status: z.boolean().optional(),
    comment: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const MainCategory = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    productId: z.string().regex(/^[0-9a-f]{32}$/),
    productVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    categoryId: z.string().regex(/^[0-9a-f]{32}$/),
    categoryVersionId: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    salesChannelId: z.string().regex(/^[0-9a-f]{32}$/),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const ProductStream = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-f]{32}$/)
      .optional(),
    name: z.string(),
    description: z.string().optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    translated: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const Product: z.ZodType<Product> = z.lazy(() =>
  z
    .object({
      id: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      versionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      parentVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      manufacturerId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productManufacturerVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      unitId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      taxId: z.string().regex(/^[0-9a-f]{32}$/),
      coverId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productMediaVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      deliveryTimeId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      canonicalProductId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      cmsPageId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      cmsPageVersionId: z
        .string()
        .regex(/^[0-9a-f]{32}$/)
        .optional(),
      productNumber: z.string(),
      stock: z.number().int(),
      restockTime: z.number().int().optional(),
      active: z.boolean().optional(),
      availableStock: z.number().int().optional(),
      available: z.boolean().optional(),
      isCloseout: z.boolean().optional(),
      displayGroup: z.string().optional(),
      manufacturerNumber: z.string().optional(),
      ean: z.string().optional(),
      purchaseSteps: z.number().int().optional(),
      maxPurchase: z.number().int().optional(),
      minPurchase: z.number().int().optional(),
      purchaseUnit: z.number().optional(),
      referenceUnit: z.number().optional(),
      shippingFree: z.boolean().optional(),
      markAsTopseller: z.boolean().optional(),
      weight: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      length: z.number().optional(),
      releaseDate: z.string().datetime({ offset: true }).optional(),
      ratingAverage: z.number().optional(),
      categoryTree: z.array(z.string()).optional(),
      propertyIds: z.array(z.string()).optional(),
      optionIds: z.array(z.string()).optional(),
      streamIds: z.array(z.string()).optional(),
      categoryIds: z.array(z.string()).optional(),
      childCount: z.number().int().optional(),
      sales: z.number().int().optional(),
      states: z.array(z.string()).optional(),
      metaDescription: z.string().optional(),
      name: z.string(),
      keywords: z.string().optional(),
      description: z.string().optional(),
      metaTitle: z.string().optional(),
      packUnit: z.string().optional(),
      packUnitPlural: z.string().optional(),
      customFields: z.object({}).partial().passthrough().optional(),
      calculatedPrice: z.object({}).partial().passthrough().optional(),
      calculatedPrices: z.array(z.unknown()).optional(),
      calculatedMaxPurchase: z.number().int().optional(),
      calculatedCheapestPrice: z.object({}).partial().passthrough().optional(),
      isNew: z.boolean().optional(),
      sortedProperties: z.object({}).partial().passthrough().optional(),
      createdAt: z.string().datetime({ offset: true }),
      updatedAt: z.string().datetime({ offset: true }).optional(),
      translated: z.object({}).partial().passthrough().optional(),
      extensions: z
        .object({
          reviewSummaries: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z.array(
                z
                  .object({ type: z.string(), id: z.string() })
                  .partial()
                  .passthrough(),
              ),
            })
            .partial()
            .passthrough(),
          swagCustomizedProductsTemplate: z
            .object({
              links: z.object({ related: z.string() }).partial().passthrough(),
              data: z
                .object({
                  type: z.string(),
                  id: z.string().regex(/^[0-9a-f]{32}$/),
                })
                .partial()
                .passthrough(),
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
      downloads: ProductDownload.optional(),
      parent: Product.optional(),
      children: Product.optional(),
      deliveryTime: DeliveryTime.optional(),
      tax: Tax.optional(),
      manufacturer: ProductManufacturer.optional(),
      unit: Unit.optional(),
      cover: ProductMedia.optional(),
      cmsPage: CmsPage.optional(),
      canonicalProduct: Product.optional(),
      media: ProductMedia.optional(),
      crossSellings: ProductCrossSelling.optional(),
      configuratorSettings: ProductConfiguratorSetting.optional(),
      productReviews: ProductReview.optional(),
      mainCategories: MainCategory.optional(),
      seoUrls: SeoUrl.optional(),
      options: PropertyGroupOption.optional(),
      properties: PropertyGroupOption.optional(),
      categories: Category.optional(),
      streams: ProductStream.optional(),
      categoriesRo: Category.optional(),
      seoCategory: Category.optional(),
    })
    .passthrough(),
);
const CrossSellingElementCollection = z.array(
  z
    .object({
      crossSelling: z
        .object({
          name: z.string(),
          position: z.number().int(),
          sortBy: z.string(),
          sortDirection: z.string(),
          limit: z.number().int(),
          active: z.boolean(),
          productId: z.string(),
          productStreamId: z.string(),
          type: z.string(),
        })
        .partial()
        .passthrough(),
      products: z.array(Product),
      total: z.number().int(),
    })
    .partial()
    .passthrough(),
);
const ProductDetailResponse = z
  .object({ product: Product, configurator: z.array(PropertyGroup) })
  .partial()
  .passthrough();
const saveProductReview_Body = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    title: z.unknown(),
    content: z.unknown(),
    points: z.unknown(),
  })
  .passthrough();
const searchProductVariantIds_Body = z
  .object({
    options: z.array(z.string()),
    switchedGroup: z.string().optional(),
  })
  .passthrough();
const FindProductVariantRouteResponse = z
  .object({
    foundCombination: z
      .object({
        variantId: z.string().regex(/^[0-9a-f]{32}$/),
        options: z.array(z.string()),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Sitemap = Struct.and(
  z
    .object({
      filename: z.string(),
      created: z.string().datetime({ offset: true }),
    })
    .partial()
    .passthrough(),
);
const ProductListingFlags = z
  .object({
    "no-aggregations": z.string().nullable(),
    "only-aggregations": z.string().nullable(),
  })
  .partial()
  .passthrough();
const searchPage_Body = z
  .object({ search: z.string() })
  .passthrough()
  .and(ProductListingCriteria)
  .and(ProductListingFlags);
const ProductListingResult = EntitySearchResult.and(
  z
    .object({
      currentFilters: z
        .object({
          navigationId: z.string(),
          manufacturer: z.array(z.object({}).partial().passthrough()),
          price: z
            .object({ min: z.number().int(), max: z.number().int() })
            .partial()
            .passthrough(),
          rating: z.number().int(),
          "shipping-free": z.boolean(),
          properties: z.array(z.object({}).partial().passthrough()),
        })
        .partial()
        .passthrough(),
      availableSortings: z.array(z.object({}).partial().passthrough()),
      sorting: z.string(),
      elements: z.array(Product),
    })
    .partial()
    .passthrough(),
);
const readProductListing_Body = ProductListingCriteria.and(ProductListingFlags);
const WishlistLoadRouteResponse = z
  .object({
    wishlist: z
      .object({ customerId: z.string(), salesChannelId: z.string() })
      .partial()
      .passthrough(),
    products: z.array(ProductListingResult),
  })
  .partial()
  .passthrough();
const mergeProductOnWishlist_Body = z
  .object({ productIds: z.array(z.string()) })
  .partial()
  .passthrough();
const LineItem = z
  .object({
    id: z.string(),
    referencedId: z.string(),
    label: z.string(),
    quantity: z.number().int(),
    type: z.string(),
    good: z.boolean(),
    description: z.string(),
    removable: z.boolean(),
    stackable: z.boolean(),
    modified: z.boolean(),
  })
  .partial()
  .passthrough();
const Cart = Struct.and(
  z
    .object({
      name: z.string(),
      token: z.string(),
      price: z
        .object({
          netPrice: z.number(),
          totalPrice: z.number(),
          positionPrice: z.number(),
          taxStatus: z.string(),
        })
        .partial()
        .passthrough(),
      lineItems: z.array(LineItem),
      errors: z.array(
        z
          .object({ key: z.string(), level: z.string(), message: z.string() })
          .partial()
          .passthrough(),
      ),
      transactions: z.array(
        z.object({ paymentMethodId: z.string() }).partial().passthrough(),
      ),
      modified: z.boolean(),
      customerComment: z.string(),
      affiliateCode: z.string(),
      campaignCode: z.string(),
    })
    .partial()
    .passthrough(),
);
const CartItems = Struct.and(
  z
    .object({ items: z.array(LineItem) })
    .partial()
    .passthrough(),
);
const createOrder_Body = z
  .object({
    customerComment: z.string(),
    affiliateCode: z.string(),
    campaignCode: z.string(),
  })
  .partial()
  .passthrough();
const readOrder_Body = Criteria.and(
  z.object({ checkPromotion: z.boolean() }).partial().passthrough(),
);
const OrderRouteResponse = z
  .object({
    orders: z.object({}).partial().passthrough(),
    paymentChangeable: z.record(z.boolean()),
  })
  .partial()
  .passthrough();
const orderSetPayment_Body = z
  .object({ paymentMethodId: z.string(), orderId: z.string() })
  .passthrough();
const readLandingPage_Body = Criteria.and(
  z
    .object({ slots: z.string() })
    .partial()
    .passthrough()
    .and(ProductListingCriteria),
);
const searchSuggest_Body = z
  .object({ search: z.string() })
  .passthrough()
  .and(ProductListingFlags);

export const schemas = {
  Criteria,
  readCategoryList_Body,
  MediaThumbnail,
  Media,
  CmsSlot,
  CmsBlock,
  CmsSection,
  SeoUrl,
  LandingPage,
  CmsPage,
  Category,
  Struct,
  EntitySearchResult,
  ProductListingCriteria,
  readCategory_Body,
  meta,
  link,
  links,
  error,
  failure,
  SalesChannelContext,
  updateContext_Body,
  ContextTokenResponse,
  Currency,
  handlePaymentMethod_Body,
  Locale,
  Language,
  readNavigation_Body,
  NavigationRouteResponse,
  readPaymentMethod_Body,
  PaymentMethod,
  confirmNewsletter_Body,
  subscribeToNewsletter_Body,
  CountryState,
  Country,
  sendContactMail_Body,
  CustomerGroup,
  readCms_Body,
  Salutation,
  DocumentType,
  StateMachineState,
  OrderCustomer,
  OrderAddress,
  DeliveryTime,
  Rule,
  ShippingMethodPrice,
  Tag,
  Tax,
  ShippingMethod,
  OrderDeliveryPosition,
  OrderDelivery,
  OrderLineItemDownload,
  OrderLineItem,
  OrderTransactionCaptureRefundPosition,
  OrderTransactionCaptureRefund,
  OrderTransactionCapture,
  OrderTransaction,
  Order,
  Document,
  changeProfile_Body,
  SuccessResponse,
  changeEmail_Body,
  changePassword_Body,
  CustomerAddress,
  Customer,
  loginCustomer_Body,
  register_Body,
  recoveryPassword_Body,
  sendRecoveryMail_Body,
  ProductDownload,
  ProductManufacturer,
  Unit,
  ProductMedia,
  ProductCrossSelling,
  PropertyGroup,
  PropertyGroupOption,
  ProductConfiguratorSetting,
  ProductReview,
  MainCategory,
  ProductStream,
  Product,
  CrossSellingElementCollection,
  ProductDetailResponse,
  saveProductReview_Body,
  searchProductVariantIds_Body,
  FindProductVariantRouteResponse,
  Sitemap,
  ProductListingFlags,
  searchPage_Body,
  ProductListingResult,
  readProductListing_Body,
  WishlistLoadRouteResponse,
  mergeProductOnWishlist_Body,
  LineItem,
  Cart,
  CartItems,
  createOrder_Body,
  readOrder_Body,
  OrderRouteResponse,
  orderSetPayment_Body,
  readLandingPage_Body,
  searchSuggest_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/account/address",
    alias: "createCustomerAddress",
    description: `Creates a new address for a customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CustomerAddress,
      },
    ],
    response: CustomerAddress,
  },
  {
    method: "delete",
    path: "/account/address/:addressId",
    alias: "deleteCustomerAddress",
    description: `Delete an address of customer.

    Only addresses which are not set as default addresses for shipping or billing can be deleted. You can check the current default addresses of your customer using the profile information endpoint and change them using the default address endpoint.

    **A customer must have at least one address (which can be used for shipping and billing).**

    An automatic fallback is not applied.`,
    requestFormat: "json",
    parameters: [
      {
        name: "addressId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Response containing a list of errors, most likely due to the address being in use`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/account/address/:addressId",
    alias: "updateCustomerAddress",
    description: `Modifies an existing address of a customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CustomerAddress,
      },
      {
        name: "addressId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: CustomerAddress,
  },
  {
    method: "patch",
    path: "/account/address/default-billing/:addressId",
    alias: "defaultBillingAddress",
    description: `Updates the default (preselected) billing addresses of a customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "addressId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "patch",
    path: "/account/address/default-shipping/:addressId",
    alias: "defaultShippingAddress",
    description: `Updates the default (preselected) shipping addresses of a customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "addressId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/account/change-email",
    alias: "changeEmail",
    description: `Changes a customer&#x27;s email address to a new email address, using their current password as a validation.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: changeEmail_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/change-language",
    alias: "changeLanguage",
    description: `Changes the language of the logged in customer`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ language: z.string().optional() }).passthrough(),
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/change-password",
    alias: "changePassword",
    description: `Changes a customer&#x27;s password using their current password as a validation.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: changePassword_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/change-payment-method/:paymentMethodId",
    alias: "changePaymentMethod",
    description: `Changes a customer&#x27;s default (preselected) payment method.`,
    requestFormat: "json",
    parameters: [
      {
        name: "paymentMethodId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/change-profile",
    alias: "changeProfile",
    description: `Make changes to a customer&#x27;s account, like changing their name, salutation or title.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: changeProfile_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/customer",
    alias: "readCustomer",
    description: `Returns information about the current customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: Customer,
  },
  {
    method: "delete",
    path: "/account/customer",
    alias: "deleteCustomer",
    description: `Deletes a customer profile along with their addresses, wishlists and associated data. Created orders and their payment/shipping information (addresses) and reviews are not deleted.`,
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/account/customer-recovery-is-expired",
    alias: "getCustomerRecoveryIsExpired",
    description: `This can be used to validate a provided hash has a valid and not expired customer recovery hash.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ hash: z.string() }).passthrough(),
      },
    ],
    response: z.object({ apiAlias: z.string() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/list-address",
    alias: "listAddress",
    description: `Lists all addresses of the current customer and allows filtering them based on a criteria.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z.array(CustomerAddress),
  },
  {
    method: "post",
    path: "/account/login",
    alias: "loginCustomer",
    description: `Logs in customers given their credentials.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: loginCustomer_Body,
      },
    ],
    response: z.object({ contextToken: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 401,
        description: `If credentials are incorrect an error is returned`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/account/logout",
    alias: "logoutCustomer",
    description: `Logs out a customer.`,
    requestFormat: "json",
    response: z.object({ contextToken: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 403,
        description: `Forbidden`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/account/newsletter-recipient",
    alias: "readNewsletterRecipient",
    description: `Perform a filtered search for newsletter recipients.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z.unknown(),
  },
  {
    method: "post",
    path: "/account/recovery-password",
    alias: "sendRecoveryMail",
    description: `This operation is Step 1 of the password reset flow. Make sure to implement Step 2 &quot;Reset password with recovery credentials&quot; in order to allow for the complete flow in your application. Sends a recovery mail containing a link with credentials that allows a customer to reset their password.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: sendRecoveryMail_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/recovery-password-confirm",
    alias: "recoveryPassword",
    description: `This operation is Step 2 of the password reset flow. It is required to conduct Step 1 &quot;Send a password recovery mail&quot; in order to obtain the required credentials for this step.Resets a customer&#x27;s password using credentials from a password recovery mail as a validation.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: recoveryPassword_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/account/register",
    alias: "register",
    description: `Registers a customer. Used both for normal customers and guest customers.See the Guide &quot;Register a customer&quot; for more information on customer registration.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: register_Body,
      },
    ],
    response: Customer,
  },
  {
    method: "post",
    path: "/account/register-confirm",
    alias: "registerConfirm",
    description: `Confirms a customer registration when double opt-in is activated.

Learn more about double opt-in registration in our guide &quot;Register a customer&quot;.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: confirmNewsletter_Body,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `No hash provided`,
        schema: z.void(),
      },
      {
        status: 412,
        description: `The customer has already been confirmed`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/category",
    alias: "readCategoryList",
    description: `Perform a filtered search for categories.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Category) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/category/:navigationId",
    alias: "readCategory",
    description: `This endpoint returns information about the category, as well as a fully resolved (hydrated with mapping values) CMS page, if one is assigned to the category. You can pass slots which should be resolved exclusively.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategory_Body,
      },
      {
        name: "navigationId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
      {
        name: "slots",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: Category,
  },
  {
    method: "get",
    path: "/checkout/cart",
    alias: "readCart",
    description: `Used to fetch the current cart or for creating a new one.`,
    requestFormat: "json",
    parameters: [
      {
        name: "name",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: Cart,
  },
  {
    method: "delete",
    path: "/checkout/cart",
    alias: "deleteCart",
    description: `This route deletes the cart of the customer.`,
    requestFormat: "json",
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/checkout/cart/line-item",
    alias: "addLineItem",
    description: `This route adds items to the cart. An item can be a product or promotion for example. They are referenced by the &#x60;referencedId&#x60;-parameter.

Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#adding-new-items-to-the-cart)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CartItems,
      },
    ],
    response: Cart,
  },
  {
    method: "delete",
    path: "/checkout/cart/line-item",
    alias: "removeLineItem",
    description: `This route removes items from the cart and recalculates it.

Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#deleting-items-in-the-cart)`,
    requestFormat: "json",
    parameters: [
      {
        name: "ids",
        type: "Query",
        schema: z.array(z.string()),
      },
    ],
    response: Cart,
  },
  {
    method: "patch",
    path: "/checkout/cart/line-item",
    alias: "updateLineItem",
    description: `This route updates items in the cart. A typical example is updating the quantity of an item.

Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#updating-items-in-the-cart)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CartItems,
      },
    ],
    response: Cart,
  },
  {
    method: "post",
    path: "/checkout/order",
    alias: "createOrder",
    description: `Creates a new order from the current cart and deletes the cart.

If you are using the [prepared payment flow](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments#2.1-prepare-payment-optional), this endpoint also receives additional transaction details. The exact name of the parameters depends on the implementation of the corresponding *payment handler*.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Contains additional metadata which is stored together with the order. It can also contain payment transaction details.`,
        type: "Body",
        schema: createOrder_Body,
      },
    ],
    response: Order,
  },
  {
    method: "post",
    path: "/cms/:id",
    alias: "readCms",
    description: `Loads a content management page by its identifier and resolve the slot data. This could be media files, product listing and so on.

**Important notice**

The criteria passed with this route also affects the listing, if there is one within the cms page.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCms_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: CmsPage,
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/contact-form",
    alias: "sendContactMail",
    description: `Used for submitting contact forms. Be aware that there can be more required fields, depending on the system settings.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: sendContactMail_Body,
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/context",
    alias: "readContext",
    description: `Fetches the current context. This includes for example the &#x60;customerGroup&#x60;, &#x60;currency&#x60;, &#x60;taxRules&#x60; and many more.`,
    requestFormat: "json",
    response: SalesChannelContext,
  },
  {
    method: "patch",
    path: "/context",
    alias: "updateContext",
    description: `Used for switching the context. A typical example would be changing the language or changing the currency.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: updateContext_Body,
      },
    ],
    response: z.object({ contextToken: z.string() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/country",
    alias: "readCountry",
    description: `Perform a filtered search for countries`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Country) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/country-state/:countryId",
    alias: "readCountryState",
    description: `Perform a filtered search the states for a country`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
      {
        name: "countryId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z
      .object({ elements: z.array(CountryState) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/currency",
    alias: "readCurrency",
    description: `Perform a filtered search for currencies.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Currency) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "get",
    path: "/customer-group-registration/config/:customerGroupId",
    alias: "getCustomerGroupRegistrationInfo",
    requestFormat: "json",
    parameters: [
      {
        name: "customerGroupId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: CustomerGroup,
  },
  {
    method: "post",
    path: "/customer/wishlist",
    alias: "readCustomerWishlist",
    description: `Fetch a customer&#x27;s wishlist. Products on the wishlist can be filtered using a criteria object.

    **Important constraints**

    * Anonymous (not logged-in) customers can not have wishlists.
    * The wishlist feature has to be activated.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: WishlistLoadRouteResponse,
  },
  {
    method: "post",
    path: "/customer/wishlist/add/:productId",
    alias: "addProductOnWishlist",
    description: `Adds a product to a customers wishlist.

    **Important constraints**

    * Anonymous (not logged-in) customers can not have wishlists.
    * The wishlist feature has to be activated.`,
    requestFormat: "json",
    parameters: [
      {
        name: "productId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "delete",
    path: "/customer/wishlist/delete/:productId",
    alias: "deleteProductOnWishlist",
    description: `Removes a product from a customer&#x27;s wishlist.

    **Important constraints**

    * Anonymous (not logged-in) customers can not have wishlists.
    * The wishlist feature has to be activated.`,
    requestFormat: "json",
    parameters: [
      {
        name: "productId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
    errors: [
      {
        status: 404,
        description: `The removal of the product failed. Probably because the product could not be found on the wishlist.`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/customer/wishlist/merge",
    alias: "mergeProductOnWishlist",
    description: `Create a new wishlist for a logged in customer or extend the existing wishlist given a set of products.

    **Important constraints**

    * Anonymous (not logged-in) customers can not have wishlists.
    * A customer can only have a single wishlist.
    * The wishlist feature has to be activated.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: mergeProductOnWishlist_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/document/download/:documentId/:deepLinkCode",
    alias: "download",
    description: `Returns blob file of a generated document to download.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
      {
        name: "documentId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
      {
        name: "deepLinkCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Document,
  },
  {
    method: "post",
    path: "/handle-payment",
    alias: "handlePaymentMethod",
    description: `This generic endpoint is should be called to initiate a payment flow after an order has been created. The details of the payment flow can differ depending on the payment integration and might require calling additional operations or the setup of webhooks.

The endpoint internally calls the payment handler of the payment method currently set for the order.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: handlePaymentMethod_Body,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/landing-page/:landingPageId",
    alias: "readLandingPage",
    description: `Loads a landing page by its identifier and resolves the CMS page.

**Important notice**

The criteria passed with this route also affects the listing, if there is one within the cms page.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readLandingPage_Body,
      },
      {
        name: "landingPageId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: LandingPage,
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/language",
    alias: "readLanguages",
    description: `Perform a filtered search for languages.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Language) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/navigation/:activeId/:rootId",
    alias: "readNavigation",
    description: `This endpoint returns categories that can be used as a page navigation. You can either return them as a tree or as a flat list. You can also control the depth of the tree.

    Instead of passing uuids, you can also use one of the following aliases for the activeId and rootId parameters to get the respective navigations of your sales channel.

     * main-navigation
     * service-navigation
     * footer-navigation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readNavigation_Body,
      },
      {
        name: "sw-include-seo-urls",
        type: "Header",
        schema: z.boolean().optional(),
      },
      {
        name: "activeId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
      {
        name: "rootId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z.array(Category),
  },
  {
    method: "post",
    path: "/newsletter/confirm",
    alias: "confirmNewsletter",
    description: `You have to use the hash from the link sent out via email to confirm the user registration.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: confirmNewsletter_Body,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/newsletter/subscribe",
    alias: "subscribeToNewsletter",
    description: `This route is used to create/remove/confirm a newsletter subscription.

The &#x60;option&#x60; property controls what should happen:
* &#x60;direct&#x60;: The subscription is directly active and does not need a confirmation.
* &#x60;subscribe&#x60;: An email will be send to the provided email addrees containing a link to the /newsletter/confirm route.
The subscription is only successful, if the /newsletter/confirm route is called with the generated hashes.
* &#x60;unsubscribe&#x60;: The email address will be removed from the newsletter subscriptions.
* &#x60;confirmSubscribe&#x60;: Confirmes the newsletter subscription for the provided email address.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: subscribeToNewsletter_Body,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/newsletter/unsubscribe",
    alias: "unsubscribeToNewsletter",
    description: `Removes a newsletter recipient from the mailing lists.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string() }).passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/order",
    alias: "readOrder",
    description: `List orders of a customer.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readOrder_Body,
      },
    ],
    response: OrderRouteResponse,
  },
  {
    method: "get",
    path: "/order/download/:orderId/:downloadId",
    alias: "orderDownloadFile",
    description: `Download a file included in the given order and with the given id. Access must be granted.`,
    requestFormat: "json",
    parameters: [
      {
        name: "orderId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
      {
        name: "downloadId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/order/payment",
    alias: "orderSetPayment",
    description: `Changes the payment method of a specific order. You can use the /order route to find out if the payment method of an order can be changed - take a look at the &#x60;paymentChangeable&#x60;- array in the response.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: orderSetPayment_Body,
      },
    ],
    response: z.object({ success: z.boolean() }).partial().passthrough(),
  },
  {
    method: "post",
    path: "/order/state/cancel",
    alias: "cancelOrder",
    description: `Cancels an order. The order state will be set to &#x27;cancelled&#x27;.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orderId: z.string() }).partial().passthrough(),
      },
    ],
    response: StateMachineState,
  },
  {
    method: "post",
    path: "/payment-method",
    alias: "readPaymentMethod",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readPaymentMethod_Body,
      },
    ],
    response: z
      .object({
        total: z.number().int(),
        aggregations: z.object({}).partial().passthrough(),
        elements: z.array(PaymentMethod),
      })
      .partial()
      .passthrough(),
  },
  {
    method: "post",
    path: "/product",
    alias: "readProduct",
    description: `List products that match the given criteria. For performance ressons a limit should always be set.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Product) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "get",
    path: "/product-export/:accessKey/:fileName",
    alias: "readProductExport",
    requestFormat: "json",
    parameters: [
      {
        name: "accessKey",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "fileName",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/product-listing/:categoryId",
    alias: "readProductListing",
    description: `Fetches a product listing for a specific category. It also provides filters, sortings and property aggregations, analogous to the /search endpoint.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readProductListing_Body,
      },
      {
        name: "categoryId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ProductListingResult,
  },
  {
    method: "post",
    path: "/product/:productId",
    alias: "readProductDetail",
    description: `This route is used to load a single product with the corresponding details. In addition to loading the data, the best variant of the product is determined when a parent id is passed.`,
    requestFormat: "json",
    parameters: [
      {
        name: "productId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ProductDetailResponse,
  },
  {
    method: "post",
    path: "/product/:productId/cross-selling",
    alias: "readProductCrossSellings",
    description: `This route is used to load the cross sellings for a product. A product has several cross selling definitions in which several products are linked. The route returns the cross sellings together with the linked products`,
    requestFormat: "json",
    parameters: [
      {
        name: "productId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: CrossSellingElementCollection,
  },
  {
    method: "post",
    path: "/product/:productId/find-variant",
    alias: "searchProductVariantIds",
    description: `Performs a search for product variants and returns the best matching variant.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: searchProductVariantIds_Body,
      },
      {
        name: "productId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FindProductVariantRouteResponse,
  },
  {
    method: "post",
    path: "/product/:productId/review",
    alias: "saveProductReview",
    description: `Saves a review for a product. Reviews have to be activated in the settings.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: saveProductReview_Body,
      },
      {
        name: "productId",
        type: "Path",
        schema: z.string().regex(/^[0-9a-f]{32}$/),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/product/:productId/reviews",
    alias: "readProductReviews",
    description: `Perform a filtered search for product reviews.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
      {
        name: "productId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ elements: z.array(ProductReview) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/salutation",
    alias: "readSalutation",
    description: `Perform a filtered search for salutations.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(Salutation) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
  },
  {
    method: "post",
    path: "/script/:hook",
    alias: "postScriptStoreApiRoute",
    requestFormat: "json",
    parameters: [
      {
        name: "hook",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/search",
    alias: "searchPage",
    description: `Performs a search for products which can be used to display a product listing.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: searchPage_Body,
      },
    ],
    response: ProductListingResult,
  },
  {
    method: "post",
    path: "/search-suggest",
    alias: "searchSuggest",
    description: `Can be used to implement search previews or suggestion listings, that don’t require any interaction.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: searchSuggest_Body,
      },
    ],
    response: ProductListingResult,
  },
  {
    method: "post",
    path: "/seo-url",
    alias: "readSeoUrl",
    description: `Perform a filtered search for seo urls.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
    ],
    response: z
      .object({ elements: z.array(SeoUrl) })
      .partial()
      .passthrough()
      .and(EntitySearchResult),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: failure,
      },
    ],
  },
  {
    method: "post",
    path: "/shipping-method",
    alias: "readShippingMethod",
    description: `Perform a filtered search for shipping methods.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: readCategoryList_Body.optional(),
      },
      {
        name: "onlyAvailable",
        type: "Query",
        schema: z.boolean().optional(),
      },
    ],
    response: z
      .object({
        total: z.number().int(),
        aggregations: z.object({}).partial().passthrough(),
        elements: z.array(ShippingMethod),
      })
      .partial()
      .passthrough(),
  },
  {
    method: "get",
    path: "/sitemap",
    alias: "readSitemap",
    description: `Fetches a list of compressed sitemap files, which are often used by search engines.`,
    requestFormat: "json",
    response: z.array(Sitemap),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
