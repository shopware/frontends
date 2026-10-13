import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { imitateCustomer, parseImitationForm } from "./imitateCustomer";
import type { ImitationClient, ImitationCredentials } from "./imitateCustomer";
import { READ_TIMEOUT_MS } from "./readTimeout";
import { apiClientError } from "./session.fixture";

vi.mock("server-only", () => ({}));

const credentials: ImitationCredentials = {
  token: "imitation-token",
  customerId: "customer-1",
  userId: "user-1",
};

function form(fields: Record<string, string | Blob>): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

function fakeClient(
  invoke: (headers: Record<string, string | undefined>) => Promise<unknown>,
) {
  const defaultHeaders: Record<string, string | undefined> = {};
  const spy = vi.fn(async () => invoke(defaultHeaders));
  const client = {
    invoke: spy,
    defaultHeaders,
  } as unknown as ImitationClient;
  return { client, invoke: spy };
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseImitationForm", () => {
  it("reads the three fields of the Administration form", () => {
    expect(parseImitationForm(form({ ...credentials }))).toEqual(credentials);
  });

  it("refuses a missing form, a missing or blank field and a file", () => {
    expect(parseImitationForm(null)).toBeNull();
    expect(
      parseImitationForm(form({ token: "t", customerId: "c" })),
    ).toBeNull();
    expect(
      parseImitationForm(form({ ...credentials, customerId: " " })),
    ).toBeNull();
    expect(
      parseImitationForm(
        form({ ...credentials, token: new File(["t"], "token.txt") }),
      ),
    ).toBeNull();
  });
});

describe("imitateCustomer", () => {
  it("posts the credentials with the read timeout and returns the adopted context token", async () => {
    const { client, invoke } = fakeClient(async (headers) => {
      headers["sw-context-token"] = "customer-context";
      return { data: { redirectUrl: null }, status: 200 };
    });

    await expect(imitateCustomer(client, credentials)).resolves.toBe(
      "customer-context",
    );
    expect(invoke).toHaveBeenCalledExactlyOnceWith(
      "imitateCustomerLogin post /account/login/imitate-customer",
      { body: credentials, fetchOptions: { timeout: READ_TIMEOUT_MS } },
    );
  });

  it("returns null and logs only the status and codes of a refusal", async () => {
    const { client } = fakeClient(async () => {
      throw apiClientError(
        [
          {
            code: "CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN",
            detail: 'The token "imitation-token" is invalid.',
            meta: { parameters: { token: "imitation-token" } },
          },
        ],
        400,
      );
    });

    await expect(imitateCustomer(client, credentials)).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Imitation] the Store API refused the customer imitation",
      { status: 400, codes: ["CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN"] },
    );
  });

  it("logs only the error name of a network failure", async () => {
    const { client } = fakeClient(async () => {
      throw new TypeError("fetch failed for imitation-token");
    });

    await expect(imitateCustomer(client, credentials)).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Imitation] the Store API refused the customer imitation",
      { name: "TypeError" },
    );
  });

  it("returns null when the answer carried no context token", async () => {
    const { client } = fakeClient(async () => ({ data: {}, status: 200 }));

    await expect(imitateCustomer(client, credentials)).resolves.toBeNull();
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Imitation] the Store API answered without a new context token",
    );
  });
});
