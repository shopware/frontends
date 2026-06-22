export type AmazonPayClientConfig = {
  publicKeyId?: string;
  privateKey: string;
  region?: string;
  sandbox?: boolean;
  algorithm?: string;
  overrideServiceUrl?: string;
};

export type ChargeAmount = {
  amount: string;
  currencyCode: string;
};

export type AmazonPayResponse<T = unknown> = {
  data: T;
};

export class AmazonPayClient {
  constructor(config: AmazonPayClientConfig);
  apiCall(options: unknown, maxRedirects?: number): Promise<AmazonPayResponse>;
  generateButtonSignature(payload: unknown): string;
  getSignedHeaders(options: unknown): Record<string, string>;
}

export class InStoreClient extends AmazonPayClient {}

export class WebStoreClient extends AmazonPayClient {
  createCheckoutSession(
    payload: unknown,
    headers: unknown,
  ): Promise<AmazonPayResponse>;
  getCheckoutSession(sessionId: string): Promise<AmazonPayResponse>;
  updateCheckoutSession(
    sessionId: string,
    payload: unknown,
    headers?: unknown,
  ): Promise<AmazonPayResponse>;
  completeCheckoutSession(
    sessionId: string,
    payload: {
      chargeAmount: ChargeAmount;
    },
    headers?: unknown,
  ): Promise<AmazonPayResponse>;
}

declare const Client: {
  AmazonPayClient: typeof AmazonPayClient;
  InStoreClient: typeof InStoreClient;
  WebStoreClient: typeof WebStoreClient;
};

export default Client;
