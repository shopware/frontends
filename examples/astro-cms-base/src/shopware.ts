import { createAPIClient } from "@shopware/api-client";

// Shopware API configuration
// Change these values to match your Shopware instance
export const SHOPWARE_ENDPOINT =
  "https://demo-frontends.shopware.store/store-api";
export const SHOPWARE_ACCESS_TOKEN = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

// Create and export API client instance
export const apiClient = createAPIClient({
  baseURL: SHOPWARE_ENDPOINT,
  accessToken: SHOPWARE_ACCESS_TOKEN,
});

// Context token for session management
export let contextToken = "";

// Set context token from response
export function setContextToken(token: string) {
  contextToken = token;
}
