import type {
  OnApproveData,
  PayPalCardFieldsComponent,
  PayPalCardFieldsStateObject,
  PayPalNamespace,
} from "@paypal/paypal-js";

export type PayPalProduct =
  | "paylater"
  | "acdc"
  | "applepay"
  | "googlepay"
  | "venmo";

type PayPalApiResponse = {
  data: {
    redirectUrl: string;
    token: string;
  };
};

type PayPalAlternativeNamespace = PayPalNamespace & {
  Buttons: NonNullable<PayPalNamespace["Buttons"]>;
  CardFields: NonNullable<PayPalNamespace["CardFields"]>;
  Googlepay: () => {
    config: () => Promise<{
      isEligible: boolean;
      apiVersion: number;
      apiVersionMinor: number;
      allowedPaymentMethods: google.payments.api.PaymentMethodSpecification[];
      merchantInfo: google.payments.api.MerchantInfo;
      countryCode: string;
    }>;
    confirmOrder: (payload: {
      orderId: string;
      paymentMethodData: google.payments.api.PaymentMethodData;
    }) => Promise<{ status: "APPROVED" | "PAYER_ACTION_REQUIRED" | string }>;
    initiatePayerAction: (payload: { orderId: string }) => Promise<void>;
  };
  Applepay: () => {
    config: () => Promise<{
      isEligible: boolean;
      countryCode: string;
      merchantCapabilities: ApplePayJS.ApplePayMerchantCapability[];
      supportedNetworks: string[];
      currencyCode: string;
    }>;
    validateMerchant: (payload: {
      validationUrl: string;
    }) => Promise<{ merchantSession: unknown }>;
    confirmOrder: (payload: {
      orderId: string;
      token: unknown;
      billingContact: ApplePayJS.ApplePayPaymentContact;
    }) => Promise<void>;
  };
};

const fieldState = {
  isFocused: false,
  isEmpty: false,
  isValid: true,
  isPotentiallyValid: true,
};

export const cardFields = {
  async getState(): Promise<PayPalCardFieldsStateObject> {
    return {
      cards: [],
      isFormValid: true,
      errors: [],
      fields: {
        cardCvvField: fieldState,
        cardNumberField: fieldState,
        cardNameField: fieldState,
        cardExpiryField: fieldState,
      },
    };
  },
  async submit() {},
} satisfies Pick<PayPalCardFieldsComponent, "getState" | "submit">;

export const cardFieldElements: Partial<
  Record<keyof PayPalCardFieldsStateObject["fields"], { focus: () => void }>
> = {};

export const paypalMethod = { value: "paypal-payment-method-id" };

export const apiClient = {
  async invoke(_route: string, _payload?: unknown): Promise<PayPalApiResponse> {
    return {
      data: {
        redirectUrl: "https://example.com/payment/finalize",
        token: "paypal-order-token",
      },
    };
  },
};

export function getPayPal() {
  if (!window.paypal) {
    throw new Error("PayPal SDK is not loaded");
  }

  return window.paypal as unknown as PayPalAlternativeNamespace;
}

export async function setPaymentMethod(_paymentMethodId: string) {}

export async function addToCart() {}

export async function createOrder(_product?: PayPalProduct) {
  return "paypal-order-id";
}

export async function onApprove(_data: OnApproveData) {}
