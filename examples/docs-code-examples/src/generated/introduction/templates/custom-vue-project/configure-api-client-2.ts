export type ShopwareFrontendsOptions = {
  endpoint: string;
  accessToken: string;
  shopwareApiClient?: {
    timeout: number;
  };
};
