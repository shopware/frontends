declare module "@amazonpay/amazon-pay-api-sdk-nodejs" {
  export class WebStoreClient {
    constructor(config: any);
    completeCheckoutSession(
      sessionId: string,
      payload: {
        chargeAmount: {
          amount: string;
          currencyCode: string;
        };
      },
    ): Promise<any>;

    getCheckoutSession(sessionId: string): Promise<{ data: unknown }>;
    createCheckoutSession(payload: unknown, headers: unknown): Promise<any>;
    generateButtonSignature(payload: unknown): string;
    updateCheckoutSession(sessionId: string, payload: unknown): Promise<any>;
  }
}

declare module "uuid/v4" {
  export default function (): string;
}
