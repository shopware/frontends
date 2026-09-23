const { apiClient } = useShopwareContext(); // or use an instance of @shopware/api-client library

const tokenResponse = await apiClient.invoke(
  "generateJWTAppSystemAppServer post /app-system/{name}/generate-token",
  {
    pathParams: {
      name: "MyPaymentApp",
    },
  },
);
