// category

/**
 * @category Endpoints
 * @public
 */
export const getCategoryEndpoint = () => `/store-api/category`;

/**
 * @category Endpoints
 * @public
 */
export const getCategoryDetailsEndpoint = (categoryId: string) =>
  `/store-api/category/${categoryId}`;

// landing-page
/**
 * @category Endpoints
 * @public
 */
export const getLandingPageDetailsEndpoint = (landingPageId: string) =>
  `/store-api/landing-page/${landingPageId}`;

// product-listing

/**
 * @category Endpoints
 * @public
 */
export const getProductListingEndpoint = (categoryId: string) =>
  `/store-api/product-listing/${categoryId}`;

// product

/**
 * @category Endpoints
 * @public
 */
export const getProductEndpoint = () => `/store-api/product`;

/**
 * @category Endpoints
 * @public
 */
export const getProductDetailsEndpoint = (productId: string) =>
  `/store-api/product/${productId}`;

// product-reviews

/**
 * @category Endpoints
 * @public
 */
export const getProductReviewsEndpoint = (productId: string) =>
  `/store-api/product/${productId}/reviews`;

// search

/**
 * @category Endpoints
 * @public
 */
export const getSuggestSearchEndpoint = () => `/store-api/search-suggest`;

/**
 * @category Endpoints
 * @public
 */
export const getSearchEndpoint = () => `/store-api/search`;

// customer
/**
 * @category Endpoints
 * @public
 */
export const getCustomerAddAddressEndpoint = () => `/store-api/account/address`;

/**
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
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultBillingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("billing", addressId);

/**
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultShippingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("shipping", addressId);

/**
 * @category Endpoints
 * @public
 */
export const getCustomerEndpoint = () => `/store-api/account/customer`;
/**
 * @category Endpoints
 * @public
 */
export const getCustomerRegisterEndpoint = () => `/store-api/account/register`;
/**
 * @category Endpoints
 * @public
 */
export const getCustomerDetailsUpdateEndpoint = () =>
  `/store-api/account/change-profile`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerLoginEndpoint = () => `/store-api/account/login`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerLogoutEndpoint = () => `/store-api/account/logout`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerOrderEndpoint = () => `/store-api/order`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerUpdateEmailEndpoint = () =>
  `/store-api/account/change-email`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePasswordEndpoint = () =>
  `/store-api/account/change-password`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerResetPasswordEndpoint = () =>
  `/store-api/account/recovery-password`;

/**
 * @category Endpoints
 * @public
 */
export const getConfirmPasswordResetEndpoint = () =>
  `/store-api/account/recovery-password-confirm`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerAccountConfirmEndpoint = () =>
  `/store-api/account/register-confirm`;

/**
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePaymentMethodEndpoint = (
  paymentMethodId: string
) => `/store-api/account/change-payment-method/${paymentMethodId}`;

// checkout

/**
 * @category Endpoints
 * @public
 */
export const getCheckoutCartEndpoint = () => `/store-api/checkout/cart`;

/**
 * @category Endpoints
 * @public
 */
export const getCheckoutCartLineItemEndpoint = () =>
  `/store-api/checkout/cart/line-item`;

/**
 * @category Endpoints
 * @public
 */
export const getCheckoutOrderEndpoint = () => `/store-api/checkout/order`;

/**
 * @category Endpoints
 * @public
 */
export const getCancelOrderEndpoint = () => `/store-api/order/state/cancel`;

/**
 * @category Endpoints
 * @public
 */
export const getChangeOrderPaymentMethodEndpoint = () =>
  `/store-api/order/payment`;

// context

/**
 * @category Endpoints
 * @public
 */
export const getContextEndpoint = () => `/store-api/context`;

/**
 * @category Endpoints
 * @public
 */
export const getContextCurrencyEndpoint = () => `/store-api/currency`;

/**
 * @category Endpoints
 * @public
 */
export const getContextLanguageEndpoint = () => `/store-api/language`;

/**
 * @category Endpoints
 * @public
 */
export const getContextCountryEndpoint = () => `/store-api/country`;

/**
 * @category Endpoints
 * @public
 */
export const getContextPaymentMethodEndpoint = () =>
  `/store-api/payment-method`;

/**
 * @category Endpoints
 * @public
 */
export const getContextShippingMethodEndpoint = () =>
  `/store-api/shipping-method`;

/**
 * @category Endpoints
 * @public
 */
export const getContextSalutationEndpoint = () => `/store-api/salutation`;

// newsletter

/**
 * @category Endpoints
 * @public
 */
export const getNewsletterSubscribeEndpoint = () => `/newsletter/subscribe`; // replace with `/store-api/v4/newsletter/subscribe`, consider using `/store-api/v4/newsletter/confirm`

/**
 * @category Endpoints
 * @public
 */
export const getNewsletterUnsubscribeEndpoint = () => `/newsletter/unsubscribe`; // replace with `/store-api/v4/newsletter/unsubscribe`

/**
 * @category Endpoints
 * @public
 */
export const getNewsletterRecipientEndpoint = () =>
  `/store-api/account/newsletter-recipient`;

/**
 * @category Endpoints
 * @public
 */
export const getPageResolverEndpoint = () => `/store-api/pwa/page`;

/**
 * @category Endpoints
 * @public
 */
export const getSeoUrlEndpoint = () => "/store-api/seo-url";

/**
 * @category Endpoints
 * @public
 */
export const getStoreNavigationEndpoint = (
  requestActiveId: string,
  requestRootId: string
) => `/store-api/navigation/${requestActiveId}/${requestRootId}`;

/**
 * @category Endpoints
 * @public
 */
export const getContactFormEndpoint = () => `/store-api/contact-form`;
/**
 * @category Endpoints
 * @public
 */
export const handlePaymentEndpoint = () => `/store-api/handle-payment`;

/**
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterSubscribeEndpoint = () =>
  `/store-api/newsletter/subscribe`;

/**
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterConfirmEndpoint = () =>
  `/store-api/newsletter/confirm`;

/**
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterUnsubscribeEndpoint = () =>
  `/store-api/newsletter/unsubscribe`;

/**
 * @category Endpoints
 * @public
 */
export const getGetWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist`;
/**
 * @category Endpoints
 * @public
 */
export const getAddWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/add/${productId}`;
/**
 * @category Endpoints
 * @public
 */
export const getRemoveWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/delete/${productId}`;
/**
 * @category Endpoints
 * @public
 */
export const getMergeWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist/merge`;
/**
 * @public
 */
export const getDocumentDownloadEndpoint = (
  documentId: string,
  deepLinkCode: string
) => `/store-api/document/download/${documentId}/${deepLinkCode}`;
/**
 * @public
 */
export const getOrderDownloadsEndpoint = (
  orderId: string,
  downloadId: string
) => `/store-api/order/download/${orderId}/${downloadId}`;
/**
 * @public
 */
export const getSitemapEndpoint = () => `/store-api/sitemap`;
