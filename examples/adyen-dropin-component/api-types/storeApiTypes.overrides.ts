import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {
  AdyenPaymentMethod: {
    /**
     * The unique payment method code.
     */
    type: string;
    /**
     * The displayable name of this payment method.
     */
    name: string;
    /**
     * All input details to be provided to complete the payment with this payment method.
     */
    details?: object;
    /**
     * Configuration props as set by the merchant in the CA and received in the PM object in the /paymentMethods response
     */
    configuration?: object;
    /**
     * Brand for the selected gift card. For example: plastix, hmclub.
     */
    brand?: string;
    /**
     * List of possible brands. For example: visa, mc.
     */
    brands?: string[];
    /**
     * The funding source of the payment method.
     */
    fundingSource?: "debit" | "credit";
    /**
     * The group where this payment method belongs to.
     */
    group?: {
      /**
       * The name of the group.
       */
      name: string;
      /**
       * Echo data to be used if the payment method is displayed as part of this group.
       */
      paymentMethodData: string;
      /**
       * The unique code of the group.
       */
      type: string;
    };
  };
  StoredPaymentMethod: Schemas["AdyenPaymentMethod"] & {
    /**
     * The supported shopper interactions for this stored payment method.
     */
    supportedShopperInteractions: string[];
    /**
     * A unique identifier of this stored payment method.
     * Mapped from 'storedPaymentMethod.id'
     */
    storedPaymentMethodId?: string;
    id: string;
  };
};

export type operations = {
  "readAdyenPaymentStatus post /adyen/payment-status": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      orderId: string;
    };
    response: never;
    responseCode: 204;
  };
  "readAdyenConfiguration post /adyen/payment-status": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      orderId: string;
    };
    response: {
      paymentMethods: components["schemas"]["AdyenPaymentMethod"][];
      storedPaymentMethods: components["schemas"]["StoredPaymentMethod"][];
    };
    responseCode: 200;
  };
};
