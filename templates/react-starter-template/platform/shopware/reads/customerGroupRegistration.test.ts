import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { apiClientError } from "@/features/session/session.fixture";

import { createShopwareClient } from "../client";
import {
  readCustomerGroupRegistration,
  toCustomerGroupRegistration,
} from "./customerGroupRegistration";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

const OPERATION =
  "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}";

function customerGroup(
  overrides: Partial<Schemas["CustomerGroup"]> = {},
): Schemas["CustomerGroup"] {
  return {
    id: "group-b2b",
    name: "Merchants",
    registrationActive: true,
    registrationTitle: "Merchant registration",
    registrationIntroduction: "<p>Register as a merchant.</p>",
    registrationOnlyCompanyRegistration: false,
    registrationSeoMetaDescription: "Become a merchant",
    translated: {
      name: "Händler",
      registrationTitle: "Händlerregistrierung",
      registrationIntroduction: "<p>Als Händler registrieren.</p>",
      registrationOnlyCompanyRegistration: true,
      registrationSeoMetaDescription: "Werden Sie Händler",
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("toCustomerGroupRegistration", () => {
  it("uses the translated registration fields", () => {
    expect(toCustomerGroupRegistration(customerGroup())).toEqual({
      id: "group-b2b",
      title: "Händlerregistrierung",
      introduction: "<p>Als Händler registrieren.</p>",
      companyOnly: true,
      metaDescription: "Werden Sie Händler",
    });
  });

  it("falls back to the untranslated fields", () => {
    expect(
      toCustomerGroupRegistration(
        customerGroup({
          registrationOnlyCompanyRegistration: true,
          translated: {
            name: "",
            registrationTitle: "",
            registrationIntroduction: "",
            registrationSeoMetaDescription: "",
          },
        }),
      ),
    ).toEqual({
      id: "group-b2b",
      title: "Merchant registration",
      introduction: "<p>Register as a merchant.</p>",
      companyOnly: true,
      metaDescription: "Become a merchant",
    });
  });

  it("titles the page with the group name when no registration title is set", () => {
    expect(
      toCustomerGroupRegistration(
        customerGroup({
          registrationTitle: undefined,
          translated: {
            name: "Händler",
            registrationTitle: "",
            registrationIntroduction: "",
            registrationSeoMetaDescription: "",
          },
        }),
      ).title,
    ).toBe("Händler");
  });

  it("returns null for an empty introduction and meta description and allows private accounts without the flag", () => {
    expect(
      toCustomerGroupRegistration({
        id: "group-plain",
        name: "Plain",
        translated: {
          name: "Plain",
          registrationTitle: "Plain registration",
          registrationIntroduction: "",
          registrationSeoMetaDescription: "",
        },
      }),
    ).toEqual({
      id: "group-plain",
      title: "Plain registration",
      introduction: null,
      companyOnly: false,
      metaDescription: null,
    });
  });
});

describe("readCustomerGroupRegistration", () => {
  it("reads the GET registration config in the page language and caches it for an hour", async () => {
    invoke.mockResolvedValue({ data: customerGroup(), status: 200 });

    await expect(
      readCustomerGroupRegistration("group-b2b", "language-de"),
    ).resolves.toMatchObject({
      id: "group-b2b",
      title: "Händlerregistrierung",
      companyOnly: true,
    });

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: "language-de",
    });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(OPERATION, {
      pathParams: { customerGroupId: "group-b2b" },
    });
    expect(cacheLife).toHaveBeenCalledExactlyOnceWith("seo");
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith(
      "sw:customer-group:group-b2b",
      "sw:customer-group:group-b2b:language-de",
    );
  });

  it("tags only the group without a language id", async () => {
    invoke.mockResolvedValue({ data: customerGroup(), status: 200 });

    await readCustomerGroupRegistration("group-b2b", null);

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: null,
    });
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith(
      "sw:customer-group:group-b2b",
    );
  });

  it("lets a 404 for an inactive or foreign group reach the caller", async () => {
    const notFound = apiClientError(
      [{ code: "CUSTOMER_GROUP_REGISTRATION_NOT_FOUND" }],
      404,
    );
    invoke.mockRejectedValue(notFound);

    await expect(readCustomerGroupRegistration("missing", null)).rejects.toBe(
      notFound,
    );
  });
});
