import { type Page, expect } from "@playwright/test";

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

export async function defaultCountryName(
  page: Page,
  storeApi: { value?: StoreApi },
) {
  if (!storeApi.value) {
    throw new Error(
      "No store-api request carried an access key yet, so the default country cannot be looked up.",
    );
  }

  const { endpoint, accessKey } = storeApi.value;
  let name: string | undefined;
  await expect(async () => {
    const contextToken = (await page.context().cookies()).find(
      (cookie) => cookie.name === "sw-context-token",
    )?.value;
    const response = await page.request.get(`${endpoint}/context`, {
      headers: {
        "sw-access-key": accessKey,
        ...(contextToken ? { "sw-context-token": contextToken } : {}),
      },
    });
    expect(
      response.ok(),
      `Context lookup failed with ${response.status()}: ${(await response.text()).slice(0, 200)}`,
    ).toBe(true);

    const context = (await response.json()) as {
      shippingLocation?: {
        country?: { name?: string; translated?: { name?: string } };
      };
    };
    const country = context.shippingLocation?.country;
    name = country?.translated?.name || country?.name;
    expect(name, "The session context names no shipping country.").toBeTruthy();
  }).toPass({ intervals: [1_000, 2_000, 5_000], timeout: 30_000 });

  return name as string;
}
