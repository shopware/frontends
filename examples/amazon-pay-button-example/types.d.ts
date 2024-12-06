declare module "@amazonpay/amazon-pay-api-sdk-nodejs" {
  export class WebStoreClient {
    constructor(config: unknown);
    completeCheckoutSession(
      sessionId: string,
      payload: {
        chargeAmount: {
          amount: string;
          currencyCode: string;
        };
      },
    ): Promise<unknown>;

    getCheckoutSession(sessionId: string): Promise<{ data: unknown }>;
    createCheckoutSession(payload: unknown, headers: unknown): Promise<unknown>;
    generateButtonSignature(payload: unknown): string;
    updateCheckoutSession(
      sessionId: string,
      payload: unknown,
    ): Promise<unknown>;
  }
}

declare module "uuid/v4" {
  export default function (): string;
}
