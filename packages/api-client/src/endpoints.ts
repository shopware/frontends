// category

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCategoryEndpoint = () => `/store-api/category`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCategoryDetailsEndpoint = (categoryId: string) =>
  `/store-api/category/${categoryId}`;

// landing-page
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getLandingPageDetailsEndpoint = (landingPageId: string) =>
  `/store-api/landing-page/${landingPageId}`;

// product-listing

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getProductListingEndpoint = (categoryId: string) =>
  `/store-api/product-listing/${categoryId}`;

// product

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getProductEndpoint = () => `/store-api/product`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getProductDetailsEndpoint = (productId: string) =>
  `/store-api/product/${productId}`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getProductCrossSellingEndpoint = (productId: string) =>
    `/store-api/product/${productId}/cross-selling`;

// product-reviews

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getProductReviewsEndpoint = (productId: string) =>
  `/store-api/product/${productId}/reviews`;

// search

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getSuggestSearchEndpoint = () => `/store-api/search-suggest`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getSearchEndpoint = () => `/store-api/search`;

// customer
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerAddAddressEndpoint = () => `/store-api/account/address`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerAddressEndpoint = (addressId?: string) =>
  addressId
    ? `/store-api/account/address/${addressId}`
    : "/store-api/account/list-address";

const getCustomerDefaultAddressEndpoint = (type: string, addressId: string) =>
  `/store-api/account/address/default-${type}/${addressId}`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultBillingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("billing", addressId);

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultShippingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("shipping", addressId);

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerEndpoint = () => `/store-api/account/customer`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerRegisterEndpoint = () => `/store-api/account/register`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerDetailsUpdateEndpoint = () =>
  `/store-api/account/change-profile`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerLoginEndpoint = () => `/store-api/account/login`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerLogoutEndpoint = () => `/store-api/account/logout`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerOrderEndpoint = () => `/store-api/order`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerUpdateEmailEndpoint = () =>
  `/store-api/account/change-email`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePasswordEndpoint = () =>
  `/store-api/account/change-password`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerResetPasswordEndpoint = () =>
  `/store-api/account/recovery-password`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getConfirmPasswordResetEndpoint = () =>
  `/store-api/account/recovery-password-confirm`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerAccountConfirmEndpoint = () =>
  `/store-api/account/register-confirm`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePaymentMethodEndpoint = (
  paymentMethodId: string,
) => `/store-api/account/change-payment-method/${paymentMethodId}`;

// checkout

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCheckoutCartEndpoint = () => `/store-api/checkout/cart`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCheckoutCartLineItemEndpoint = () =>
  `/store-api/checkout/cart/line-item`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCheckoutOrderEndpoint = () => `/store-api/checkout/order`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getCancelOrderEndpoint = () => `/store-api/order/state/cancel`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getChangeOrderPaymentMethodEndpoint = () =>
  `/store-api/order/payment`;

// context

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextEndpoint = () => `/store-api/context`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextCurrencyEndpoint = () => `/store-api/currency`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextLanguageEndpoint = () => `/store-api/language`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextCountryEndpoint = () => `/store-api/country`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextPaymentMethodEndpoint = () =>
  `/store-api/payment-method`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextShippingMethodEndpoint = () =>
  `/store-api/shipping-method`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContextSalutationEndpoint = () => `/store-api/salutation`;

// newsletter

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getNewsletterSubscribeEndpoint = () => `/newsletter/subscribe`; // replace with `/store-api/v4/newsletter/subscribe`, consider using `/store-api/v4/newsletter/confirm`

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getNewsletterUnsubscribeEndpoint = () => `/newsletter/unsubscribe`; // replace with `/store-api/v4/newsletter/unsubscribe`

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getNewsletterRecipientEndpoint = () =>
  `/store-api/account/newsletter-recipient`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getPageResolverEndpoint = () => `/store-api/pwa/page`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getSeoUrlEndpoint = () => "/store-api/seo-url";

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getStoreNavigationEndpoint = (
  requestActiveId: string,
  requestRootId: string,
) => `/store-api/navigation/${requestActiveId}/${requestRootId}`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getContactFormEndpoint = () => `/store-api/contact-form`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const handlePaymentEndpoint = () => `/store-api/handle-payment`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterSubscribeEndpoint = () =>
  `/store-api/newsletter/subscribe`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterConfirmEndpoint = () =>
  `/store-api/newsletter/confirm`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterUnsubscribeEndpoint = () =>
  `/store-api/newsletter/unsubscribe`;

/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getGetWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getAddWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/add/${productId}`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getRemoveWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/delete/${productId}`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getMergeWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist/merge`;
/**
 * @nolink
 * @nolink
 * @category Endpoints
 * @public
 */
export const getDocumentDownloadEndpoint = (
  documentId: string,
  deepLinkCode: string,
) => `/store-api/document/download/${documentId}/${deepLinkCode}`;
/**
 * @nolink
 * @category Endpoints
 * @public
 */
export const getOrderDownloadsEndpoint = (
  orderId: string,
  downloadId: string,
) => `/store-api/order/download/${orderId}/${downloadId}`;
/**
 * @public
 */
export const getSitemapEndpoint = () => `/store-api/sitemap`;

/**
 * @nolink
 * @category Endpoints
 * @public
 * @param {string} pageId
 * @returns {string}
 */
export const getCmsEndpoint = (pageId: string) => `/store-api/cms/${pageId}`;
