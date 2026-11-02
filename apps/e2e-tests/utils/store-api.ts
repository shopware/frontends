import { faker } from "@faker-js/faker";
import { type Page, expect } from "@playwright/test";

import { uniqueEmail, uniquePassword } from "./data-helpers";

export type StoreApi = { endpoint: string; accessKey: string };

const STORE_API_TIMEOUT = 10_000;

export type Customer = { email: string; password: string };

type SessionContext = {
  shippingLocation?: {
    country?: { id?: string; name?: string; translated?: { name?: string } };
  };
  salesChannel?: {
    languageId?: string;
    domains?: { url?: string; languageId?: string }[];
  };
  context?: { languageIdChain?: string[] };
};

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

function requireStoreApi(storeApi: { value?: StoreApi }) {
  if (!storeApi.value) {
    throw new Error(
      "No store-api request carried an access key yet, so the Store API cannot be called.",
    );
  }
  return storeApi.value;
}

async function sessionContext(page: Page, storeApi: { value?: StoreApi }) {
  const { endpoint, accessKey } = requireStoreApi(storeApi);
  let context: SessionContext | undefined;
  await expect(async () => {
    const contextToken = (await page.context().cookies()).find(
      (cookie) => cookie.name === "sw-context-token",
    )?.value;
    const response = await page.request.get(`${endpoint}/context`, {
      headers: {
        "sw-access-key": accessKey,
        ...(contextToken ? { "sw-context-token": contextToken } : {}),
      },
      timeout: STORE_API_TIMEOUT,
    });
    expect(
      response.ok(),
      `Context lookup failed with ${response.status()}: ${(await response.text()).slice(0, 200)}`,
    ).toBe(true);
    context = (await response.json()) as SessionContext;
  }).toPass({ intervals: [1_000, 2_000, 5_000], timeout: 30_000 });

  return context as SessionContext;
}

export async function defaultCountryName(
  page: Page,
  storeApi: { value?: StoreApi },
) {
  const country = (await sessionContext(page, storeApi)).shippingLocation
    ?.country;
  const name = country?.translated?.name || country?.name;
  if (!name) {
    throw new Error("The session context names no shipping country.");
  }
  return name;
}

export async function registerCustomer(
  page: Page,
  storeApi: { value?: StoreApi },
): Promise<Customer> {
  const { endpoint, accessKey } = requireStoreApi(storeApi);
  const context = await sessionContext(page, storeApi);

  const countryId = context.shippingLocation?.country?.id;
  if (!countryId) {
    throw new Error("The session context names no shipping country.");
  }

  const languageId =
    context.context?.languageIdChain?.[0] ?? context.salesChannel?.languageId;
  const domains = (context.salesChannel?.domains ?? []).filter(
    (domain) => domain.url,
  );
  const storefrontUrl =
    (domains.find((domain) => domain.languageId === languageId) ?? domains[0])
      ?.url ?? new URL(page.url()).origin;

  let customer: Customer | undefined;
  let registered: { active?: boolean; doubleOptInRegistration?: boolean } = {};
  await expect(async () => {
    const candidate = { email: uniqueEmail(), password: uniquePassword() };
    const response = await page.request.post(`${endpoint}/account/register`, {
      headers: { "sw-access-key": accessKey },
      timeout: STORE_API_TIMEOUT,
      data: {
        ...candidate,
        firstName: `e2e ${faker.person.firstName()}`,
        lastName: `e2e ${faker.person.lastName()}`,
        storefrontUrl,
        acceptedDataProtection: true,
        billingAddress: {
          street: faker.location.street(),
          zipcode: faker.location.zipCode(),
          city: faker.location.city(),
          countryId,
        },
      },
    });
    expect(
      response.ok(),
      `Registration failed with ${response.status()}: ${(await response.text()).slice(0, 500)}`,
    ).toBe(true);

    registered = (await response.json()) as typeof registered;
    customer = candidate;
  }).toPass({ intervals: [1_000, 2_000, 5_000], timeout: 30_000 });

  if (!registered.active || registered.doubleOptInRegistration) {
    throw new Error(
      "The customer was registered inactive, so it cannot sign in. Is double opt-in enabled for this sales channel?",
    );
  }
  return customer as Customer;
}
