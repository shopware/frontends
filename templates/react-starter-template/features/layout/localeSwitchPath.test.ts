import { gunzipSync } from "node:zlib";

import { afterEach, describe, expect, it, vi } from "vitest";

import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

import { pathForLocale, resolveLocaleSwitchPath } from "./localeSwitchPath";
import type { LocaleSwitch } from "./localeSwitchPath";

const READ_SEO_URL = "readSeoUrlGet get /seo-url";

type SeoUrlParams = {
  headers: Record<string, string>;
  query: { _criteria: string };
  fetchOptions: { timeout: number; signal?: AbortSignal };
};

type SeoUrlAnswer = (
  languageId: string,
  criteria: { filter: Record<string, unknown>[]; limit: number },
) => Promise<
  { seoPathInfo?: string; routeName?: string; foreignKey?: string }[]
>;

function location(pathname: string, search = "", hash = "") {
  return { pathname, search, hash };
}

function decodeCriteria(encoded: string) {
  return JSON.parse(gunzipSync(Buffer.from(encoded, "base64url")).toString());
}

function seoBackend(answer: SeoUrlAnswer) {
  const invoke = vi.fn(async (operation: string, params: SeoUrlParams) => {
    if (operation !== READ_SEO_URL) {
      throw new Error(`Unexpected operation ${operation}`);
    }
    const elements = await answer(
      params.headers["sw-language-id"] ?? "",
      decodeCriteria(params.query._criteria),
    );
    return { data: { elements }, status: 200 };
  });
  const getClient = vi.fn(async () => ({ invoke }) as never);
  return { invoke, getClient };
}

const englishToGerman: LocaleSwitch = {
  locale: "de-DE",
  fromLanguageId: "language-en",
  toLanguageId: "language-de",
};

const furniture = {
  routeName: "frontend.navigation.page",
  foreignKey: "category-furniture",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("pathForLocale", () => {
  it("moves the path, search and hash under a prefixed locale", () => {
    expect(
      pathForLocale(
        location("/Furniture/", "?order=price-asc", "#top"),
        "pl-PL",
      ),
    ).toBe("/pl-PL/Furniture/?order=price-asc#top");
  });

  it("swaps one prefix for another and drops it for the default locale", () => {
    expect(pathForLocale(location("/pl-PL/account/order"), "de-DE")).toBe(
      "/de-DE/account/order",
    );
    expect(pathForLocale(location("/de-DE/checkout/cart"), "en-GB")).toBe(
      "/checkout/cart",
    );
  });

  it("maps the home page of every locale", () => {
    expect(pathForLocale(location("/"), "de-DE")).toBe("/de-DE");
    expect(pathForLocale(location("/pl-PL", "?a=1"), "en-GB")).toBe("/?a=1");
  });
});

describe("resolveLocaleSwitchPath", () => {
  it("looks the page up in the current language and links its SEO URL in the chosen one", async () => {
    const { invoke, getClient } = seoBackend(async (languageId) =>
      languageId === "language-en"
        ? [{ ...furniture, seoPathInfo: "Furniture/" }]
        : [{ ...furniture, seoPathInfo: "Moebel/" }],
    );

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/Furniture/", "?order=price-asc", "#reviews"),
        englishToGerman,
      ),
    ).resolves.toBe("/de-DE/Moebel/?order=price-asc#reviews");

    expect(invoke).toHaveBeenCalledTimes(2);
    const [current, target] = invoke.mock.calls.map(
      ([, params]) => params,
    ) as SeoUrlParams[];
    expect(current?.headers).toEqual({ "sw-language-id": "language-en" });
    expect(decodeCriteria(current?.query._criteria ?? "")).toEqual({
      filter: [
        {
          type: "equalsAny",
          field: "seoPathInfo",
          value: ["Furniture", "Furniture/"],
        },
      ],
      limit: 1,
    });
    expect(current?.fetchOptions).toEqual({ timeout: READ_TIMEOUT_MS });
    expect(target?.headers).toEqual({ "sw-language-id": "language-de" });
    expect(decodeCriteria(target?.query._criteria ?? "")).toEqual({
      filter: [
        { type: "equals", field: "foreignKey", value: "category-furniture" },
        {
          type: "equals",
          field: "routeName",
          value: "frontend.navigation.page",
        },
      ],
      limit: 1,
    });
  });

  it("strips the current prefix and decodes the path before the lookup", async () => {
    const { invoke, getClient } = seoBackend(async (languageId) =>
      languageId === "language-de"
        ? [{ ...furniture, seoPathInfo: "Möbel/Stühle/" }]
        : [{ ...furniture, seoPathInfo: "Furniture/Chairs/" }],
    );

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/de-DE/M%C3%B6bel/St%C3%BChle/"),
        {
          locale: "en-GB",
          fromLanguageId: "language-de",
          toLanguageId: "language-en",
        },
      ),
    ).resolves.toBe("/Furniture/Chairs/");

    const [current] = invoke.mock.calls.map(
      ([, params]) => params,
    ) as SeoUrlParams[];
    expect(
      decodeCriteria(current?.query._criteria ?? "").filter[0].value,
    ).toEqual(["Möbel/Stühle", "Möbel/Stühle/"]);
  });

  it.each([
    ["frontend.navigation.page", "/de-DE/navigation/entity-1"],
    ["frontend.detail.page", "/de-DE/detail/entity-1"],
    ["frontend.landing.page", "/de-DE/landingPage/entity-1"],
  ])(
    "falls back to the technical path of a %s without an SEO URL in the chosen language",
    async (routeName, expected) => {
      const { getClient } = seoBackend(async (languageId) =>
        languageId === "language-en"
          ? [{ routeName, foreignKey: "entity-1", seoPathInfo: "Some/Page" }]
          : [],
      );

      await expect(
        resolveLocaleSwitchPath(
          getClient,
          location("/Some/Page", "?p=2"),
          englishToGerman,
        ),
      ).resolves.toBe(`${expected}?p=2`);
    },
  );

  it("sends a route without a technical path to the home page of the chosen locale", async () => {
    const { getClient } = seoBackend(async (languageId) =>
      languageId === "language-en"
        ? [
            {
              routeName: "frontend.account.customer-group-registration.page",
              foreignKey: "group-1",
              seoPathInfo: "Wholesale/",
            },
          ]
        : [],
    );

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/Wholesale/"),
        englishToGerman,
      ),
    ).resolves.toBe("/de-DE");
  });

  it("keeps the path when the current language has no SEO URL for it", async () => {
    const { invoke, getClient } = seoBackend(async () => []);

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/pl-PL/Missing/", "?a=1"),
        englishToGerman,
      ),
    ).resolves.toBe("/de-DE/Missing/?a=1");
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("logs a failed lookup and sends the visitor to the home page of the chosen locale", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const failure = new TypeError("Failed to fetch");
    const { getClient } = seoBackend(async () => {
      throw failure;
    });

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/Furniture/"),
        englishToGerman,
      ),
    ).resolves.toBe("/de-DE");
    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[MetaNavigation] resolving the page in the chosen language failed",
      failure,
    );
  });

  it("passes the abort signal to every read and keeps the prefix without logging once it is aborted", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const controller = new AbortController();
    const { invoke, getClient } = seoBackend(async () => {
      controller.abort();
      throw new DOMException("The operation was aborted.", "AbortError");
    });

    await expect(
      resolveLocaleSwitchPath(
        getClient,
        location("/Furniture/", "?a=1"),
        englishToGerman,
        controller.signal,
      ),
    ).resolves.toBe("/de-DE/Furniture/?a=1");

    const [current] = invoke.mock.calls.map(
      ([, params]) => params,
    ) as SeoUrlParams[];
    expect(current?.fetchOptions).toEqual({
      timeout: READ_TIMEOUT_MS,
      signal: controller.signal,
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("falls back to the home page when the client cannot be created", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const getClient = vi.fn(async () => {
      throw new Error("config down");
    });

    await expect(
      resolveLocaleSwitchPath(getClient, location("/Furniture/"), {
        ...englishToGerman,
        locale: "en-GB",
      }),
    ).resolves.toBe("/");
  });

  it.each([
    ["/", "/de-DE"],
    ["/pl-PL", "/de-DE"],
    ["/account/order", "/de-DE/account/order"],
    ["/pl-PL/account", "/de-DE/account"],
    ["/checkout", "/de-DE/checkout"],
    ["/checkout/success/order-1/paid", "/de-DE/checkout/success/order-1/paid"],
    ["/navigation/category-1", "/de-DE/navigation/category-1"],
    ["/pl-PL/detail/product-1", "/de-DE/detail/product-1"],
  ])(
    "swaps only the prefix of the app or technical route %s",
    async (pathname, expected) => {
      const { getClient } = seoBackend(async () => {
        throw new Error("Unexpected SEO URL read");
      });

      await expect(
        resolveLocaleSwitchPath(getClient, location(pathname), englishToGerman),
      ).resolves.toBe(expected);
      expect(getClient).not.toHaveBeenCalled();
    },
  );
});
