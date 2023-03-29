// category

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCategoryEndpoint = () => `/store-api/category`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCategoryDetailsEndpoint = (categoryId: string) =>
  `/store-api/category/${categoryId}`;

// landing-page
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getLandingPageDetailsEndpoint = (landingPageId: string) =>
  `/store-api/landing-page/${landingPageId}`;

// product-listing

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getProductListingEndpoint = (categoryId: string) =>
  `/store-api/product-listing/${categoryId}`;

// product

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getProductEndpoint = () => `/store-api/product`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getProductDetailsEndpoint = (productId: string) =>
  `/store-api/product/${productId}`;

// product-reviews

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getProductReviewsEndpoint = (productId: string) =>
  `/store-api/product/${productId}/reviews`;

// search

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getSuggestSearchEndpoint = () => `/store-api/search-suggest`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getSearchEndpoint = () => `/store-api/search`;

// customer
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerAddAddressEndpoint = () => `/store-api/account/address`;

/**
 * {@label NOLINK}
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
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultBillingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("billing", addressId);

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerDefaultShippingAddressEndpoint = (addressId: string) =>
  getCustomerDefaultAddressEndpoint("shipping", addressId);

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerEndpoint = () => `/store-api/account/customer`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerRegisterEndpoint = () => `/store-api/account/register`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerDetailsUpdateEndpoint = () =>
  `/store-api/account/change-profile`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerLoginEndpoint = () => `/store-api/account/login`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerLogoutEndpoint = () => `/store-api/account/logout`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerOrderEndpoint = () => `/store-api/order`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerUpdateEmailEndpoint = () =>
  `/store-api/account/change-email`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePasswordEndpoint = () =>
  `/store-api/account/change-password`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerResetPasswordEndpoint = () =>
  `/store-api/account/recovery-password`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getConfirmPasswordResetEndpoint = () =>
  `/store-api/account/recovery-password-confirm`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerAccountConfirmEndpoint = () =>
  `/store-api/account/register-confirm`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCustomerUpdatePaymentMethodEndpoint = (
  paymentMethodId: string
) => `/store-api/account/change-payment-method/${paymentMethodId}`;

// checkout

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCheckoutCartEndpoint = () => `/store-api/checkout/cart`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCheckoutCartLineItemEndpoint = () =>
  `/store-api/checkout/cart/line-item`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCheckoutOrderEndpoint = () => `/store-api/checkout/order`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getCancelOrderEndpoint = () => `/store-api/order/state/cancel`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getChangeOrderPaymentMethodEndpoint = () =>
  `/store-api/order/payment`;

// context

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextEndpoint = () => `/store-api/context`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextCurrencyEndpoint = () => `/store-api/currency`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextLanguageEndpoint = () => `/store-api/language`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextCountryEndpoint = () => `/store-api/country`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextPaymentMethodEndpoint = () =>
  `/store-api/payment-method`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextShippingMethodEndpoint = () =>
  `/store-api/shipping-method`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContextSalutationEndpoint = () => `/store-api/salutation`;

// newsletter

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getNewsletterSubscribeEndpoint = () => `/newsletter/subscribe`; // replace with `/store-api/v4/newsletter/subscribe`, consider using `/store-api/v4/newsletter/confirm`

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getNewsletterUnsubscribeEndpoint = () => `/newsletter/unsubscribe`; // replace with `/store-api/v4/newsletter/unsubscribe`

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getNewsletterRecipientEndpoint = () =>
  `/store-api/account/newsletter-recipient`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getPageResolverEndpoint = () => `/store-api/pwa/page`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getSeoUrlEndpoint = () => "/store-api/seo-url";

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getStoreNavigationEndpoint = (
  requestActiveId: string,
  requestRootId: string
) => `/store-api/navigation/${requestActiveId}/${requestRootId}`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getContactFormEndpoint = () => `/store-api/contact-form`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const handlePaymentEndpoint = () => `/store-api/handle-payment`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterSubscribeEndpoint = () =>
  `/store-api/newsletter/subscribe`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterConfirmEndpoint = () =>
  `/store-api/newsletter/confirm`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getStoreNewsletterUnsubscribeEndpoint = () =>
  `/store-api/newsletter/unsubscribe`;

/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getGetWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getAddWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/add/${productId}`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getRemoveWishlistProductEndpoint = (productId: string) =>
  `/store-api/customer/wishlist/delete/${productId}`;
/**
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getMergeWishlistProductsEndpoint = () =>
  `/store-api/customer/wishlist/merge`;
/**
 * {@label NOLINK}
 * {@label NOLINK}
 * @category Endpoints
 * @public
 */
export const getDocumentDownloadEndpoint = (
  documentId: string,
  deepLinkCode: string
) => `/store-api/document/download/${documentId}/${deepLinkCode}`;
/**
 * {@label NOLINK}
 * @category Endpoints
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
