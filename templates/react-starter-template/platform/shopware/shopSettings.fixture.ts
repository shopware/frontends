import { TEMPLATE_SHOP_SETTINGS } from "@/site/shopSettings";

import type {
  CartSettings,
  LoginRegistrationSettings,
  ShopSettings,
  ShopSettingsResponse,
} from "./shopSettings";

type ResponseOverrides = {
  [
    Group in keyof ShopSettingsResponse
  ]?: ShopSettingsResponse[Group] extends object
    ? Partial<ShopSettingsResponse[Group]>
    : never;
};

export function shopSettingsResponse(
  overrides: ResponseOverrides = {},
): ShopSettingsResponse {
  return {
    apiAlias: "shop_settings",
    general: {
      shopName: "Demostore",
      metaAuthor: "",
      metaRobots: "",
      familyFriendly: false,
      showRevocationButton: false,
      apiAlias: "shop_settings_general",
      ...overrides.general,
    },
    contactForm: {
      firstNameFieldRequired: true,
      lastNameFieldRequired: true,
      phoneNumberFieldRequired: true,
      apiAlias: "shop_settings_contact_form",
      ...overrides.contactForm,
    },
    loginRegistration: {
      passwordMinLength: 8,
      createCustomerAccountDefault: false,
      showSalutation: true,
      showTitleField: false,
      requireEmailConfirmation: false,
      requirePasswordConfirmation: false,
      doubleOptInRegistration: false,
      doubleOptInGuestOrder: false,
      showPhoneNumberField: false,
      phoneNumberFieldRequired: false,
      showBirthdayField: false,
      birthdayFieldRequired: false,
      showAccountTypeSelection: true,
      showAdditionalAddressField1: false,
      additionalAddressField1Required: false,
      showAdditionalAddressField2: false,
      additionalAddressField2Required: false,
      addressInputFieldArrangement: "zip-city-state",
      allowCustomerDeletion: false,
      requireDataProtectionCheckbox: false,
      apiAlias: "shop_settings_login_registration",
      ...overrides.loginRegistration,
    },
    cart: {
      maxQuantity: 100,
      lineItemAddLimit: 0,
      showDeliveryTime: true,
      showSubtotal: true,
      columnTaxInsteadUnitPrice: true,
      showCustomerComment: true,
      showTosCheckbox: false,
      openOffcanvasAfterAddToCart: true,
      wishlistEnabled: true,
      logoutGuestAfterCheckout: false,
      enableOrderRefunds: false,
      apiAlias: "shop_settings_cart",
      ...overrides.cart,
    },
    listing: {
      productsPerPage: 15,
      allowBuyInListing: true,
      showReview: true,
      reviewsPerPage: 10,
      disableEmptyFilterOptions: true,
      markAsNew: 30,
      hideCloseoutProductsWhenOutOfStock: true,
      showVariantOptionInSearchSuggestionResult: false,
      findBestVariant: false,
      autoplayVideoInListing: false,
      beforeListPriceSnippetKey: "",
      afterListPriceSnippetKey: "",
      apiAlias: "shop_settings_listing",
      ...overrides.listing,
    },
    newsletter: {
      doubleOptIn: false,
      doubleOptInRegistered: false,
      apiAlias: "shop_settings_newsletter",
      ...overrides.newsletter,
    },
  };
}

export function shopSettings(
  overrides: {
    loginRegistration?: Partial<LoginRegistrationSettings>;
    cart?: Partial<CartSettings>;
  } = {},
): ShopSettings {
  return {
    loginRegistration: {
      ...TEMPLATE_SHOP_SETTINGS.loginRegistration,
      ...overrides.loginRegistration,
    },
    cart: { ...TEMPLATE_SHOP_SETTINGS.cart, ...overrides.cart },
  };
}
