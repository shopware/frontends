export type ErrorStep =
  | "init"
  | "script_load"
  | "setup"
  | "submit"
  | "approve"
  | null;

export class ShopwarePaymentsError extends Error {
  code: string;
  step: ErrorStep;
  correlationId?: string;

  constructor(code: string, step: ErrorStep, message: string) {
    super(message);
    this.name = "ShopwarePaymentsError";
    this.code = code;
    this.step = step;
  }
}

export interface InitOptions {
  storefrontUrl: string;
  salesChannelId: string;
  storeApi: {
    accessKey: string;
    contextToken: string;
  };
  currencyCode: string;
  shopId?: string;
}

export interface ApprovalResult {
  providerOrderId: string;
  paymentResult: {
    status: string;
  };
  contextToken?: string;
}

export interface CartCheckout {
  cart: object;
  salesChannelContext: object;
  returnUrl?: string;
}

export interface PlacedOrderCheckout {
  order: object;
  returnUrl?: string;
}

export type CheckoutPayload = CartCheckout | PlacedOrderCheckout;

export interface SurfaceHandlers {
  onClick?: () => boolean | void | Promise<boolean | void>;
  onApprove: (result: ApprovalResult) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onError: (error: ShopwarePaymentsError) => void;
}

export interface HandlePaymentOptions {
  orderId: string;
  providerOrderId: string;
  contextToken?: string;
  finishUrl?: string;
  errorUrl?: string;
}

export interface HandlePaymentResult {
  redirectUrl?: string | null;
}

export interface CardFieldValidation {
  isValid: boolean;
  isEmpty: boolean;
  isPotentiallyValid: boolean;
}

export interface CardFieldsValidationState {
  number: CardFieldValidation;
  expiry: CardFieldValidation;
  cvv: CardFieldValidation;
  isComplete: boolean;
}

export interface CardFieldsHandle {
  submit(): Promise<void>;
}

export type PayLaterMessageLocation =
  | "product-details"
  | "cart"
  | "mini-cart"
  | "login"
  | "footer";

export interface MessagesHandle {
  update(options: { amount: string }): void;
}

export interface ShopwarePaymentsClient {
  buttons(
    options: SurfaceHandlers & {
      funding: "paypal" | "paylater";
      element: HTMLElement;
      checkout: CheckoutPayload;
    },
  ): Promise<void>;
  applePay(
    options: SurfaceHandlers & {
      element: HTMLElement;
      checkout: CheckoutPayload;
    },
  ): Promise<void>;
  googlePay(
    options: SurfaceHandlers & {
      element: HTMLElement;
      checkout: CheckoutPayload;
    },
  ): Promise<void>;
  cardFields(options: {
    elements: {
      number: HTMLElement;
      expiry: HTMLElement;
      cvv: HTMLElement;
    };
    checkout: CheckoutPayload;
    onApprove: (result: ApprovalResult) => void | Promise<void>;
    onError: (error: ShopwarePaymentsError) => void;
    onCancel?: () => void | Promise<void>;
    onValidationChange?: (state: CardFieldsValidationState) => void;
    onBeforeSubmit?: () => boolean | void | Promise<boolean | void>;
  }): Promise<CardFieldsHandle>;
  messages(options: {
    element: HTMLElement;
    location: PayLaterMessageLocation;
    amount: string;
  }): Promise<MessagesHandle | null>;
  handlePayment(options: HandlePaymentOptions): Promise<HandlePaymentResult>;
}

export interface ShopwarePaymentsLibrary {
  VERSION: string;
  init(options: InitOptions): Promise<ShopwarePaymentsClient>;
  ShopwarePaymentsError: typeof ShopwarePaymentsError;
}

declare global {
  interface Window {
    ShopwarePayments: ShopwarePaymentsLibrary;
  }
}

export function requireElement(selector: string): HTMLElement {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(
      `Add a ${selector} element before rendering this payment method`,
    );
  }

  return element;
}
