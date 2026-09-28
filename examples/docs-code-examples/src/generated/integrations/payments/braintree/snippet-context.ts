export const clientToken = "example-braintree-client-token";

export const instance = {
  async requestPaymentMethod() {
    return {
      nonce: "example-payment-method-nonce",
      deviceData: "example-device-data",
    };
  },
};
