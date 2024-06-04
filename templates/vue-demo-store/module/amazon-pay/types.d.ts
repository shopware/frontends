export type AmazonPayModuleOptions = {
  moduleOptions: {
    storeId: string;
    publicKeyId: string;
    merchantId: string;
    privateKeyPath: string;
    region: "DE" | "UK" | "US";
    merchantId: string;
    sandbox: boolean;
    algorithm?: "AMZN-PAY-RSASSA-PSS-V2";
  };
};

declare module "nuxt/schema" {
  interface NuxtOptions {
    amazonPay?: AmazonPayModuleOptions["moduleOptions"];
  }
}
