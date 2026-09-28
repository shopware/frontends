const { apiClient } = useShopwareContext();
const { getStorefrontUrl } = useInternationalization();
const employeeId = "employee-id";

await apiClient.invoke("reinviteEmployee post /employee/reinvite/{id}", {
  pathParams: { id: employeeId },
  body: { storefrontUrl: getStorefrontUrl() },
});
