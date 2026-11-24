import { REGISTRATION_MIN_LENGTHS } from "@/features/account/registrationSchema";
import type { ShopSettings } from "@/platform/shopware/shopSettings";

export const TEMPLATE_SHOP_SETTINGS: ShopSettings = {
  loginRegistration: {
    passwordMinLength: REGISTRATION_MIN_LENGTHS.password,
    requireDataProtectionCheckbox: false,
    showAccountTypeSelection: true,
    showSalutation: false,
    showTitleField: false,
    showBirthdayField: false,
    birthdayFieldRequired: false,
    requireEmailConfirmation: false,
    requirePasswordConfirmation: false,
    showAdditionalAddressField1: false,
    additionalAddressField1Required: false,
    showAdditionalAddressField2: false,
    additionalAddressField2Required: false,
    showPhoneNumberField: false,
    phoneNumberFieldRequired: false,
  },
  cart: {
    enableOrderRefunds: false,
    showCustomerComment: false,
  },
};
