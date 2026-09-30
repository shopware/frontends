import type { Page } from "@playwright/test";

export type StoreApi = { endpoint: string; accessKey: string };

/** Learns endpoint and access key from traffic, so config is not duplicated. */
export function captureStoreApi(page: Page) {
  const captured: { value?: StoreApi } = {};

  page.on("request", (request) => {
    if (captured.value || !request.url().includes("/store-api/")) return;
    const accessKey = request.headers()["sw-access-key"];
    if (!accessKey) return;
    captured.value = {
      endpoint: `${request.url().split("/store-api/")[0]}/store-api`,
      accessKey,
    };
  });

  return captured;
}
