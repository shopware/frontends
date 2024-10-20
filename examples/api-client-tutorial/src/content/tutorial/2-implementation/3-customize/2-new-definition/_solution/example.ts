import { createAPIClient } from "@shopware/api-client";
import type { operations } from "./api-types/storeApiTypes";

export async function setupExample() {
  const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";
  const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken: accessToken,
  });

  const promptResult = await apiClient.invoke(
    "sendAskAi post /ai-assistant/prompt",
    {
      body: {
        role: "user",
        content: "Just wanna say Hello world!",
      },
    },
  );

  console.log(promptResult.data.content);
}
