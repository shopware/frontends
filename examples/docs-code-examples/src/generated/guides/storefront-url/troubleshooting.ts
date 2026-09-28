const config = {
  public: {
    shopware: {
      devStorefrontUrl: "",
    },
  },
};

export const requestBody = {
  // reads runtimeConfig, where the value really is "" - `??` does not catch an empty string
  storefrontUrl: config.public.shopware.devStorefrontUrl ?? "",
};
