import { createAPIClient } from "@shopware/api-client";
import { isMaintenanceMode } from "@shopware/helpers";
import Cookies from "js-cookie";

import { createError } from "#imports";

const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api/";
const shopwareAccessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

const apiClient = createAPIClient({
  baseURL: shopwareEndpoint,
  accessToken: shopwareAccessToken,
  contextToken: Cookies.get("sw-context-token"),
});

apiClient.hook("onResponseError", (response) => {
  const payload = response._data as { errors?: [{ code?: string }] };
  const error = isMaintenanceMode(
    payload.errors ?? ([{}] as [{ code?: string }]),
  );
  if (error) {
    throw createError({
      statusCode: 503,
      statusMessage: "MAINTENANCE_MODE",
    });
  }
});
