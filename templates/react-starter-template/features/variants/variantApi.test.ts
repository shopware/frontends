import { encodeForQuery } from "@shopware/api-client/helpers";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { apiClientError } from "@/features/session/session.fixture";

import {
  FIND_VARIANT,
  READ_SEO_URL,
  VARIANT_NOT_FOUND,
  findProductVariant,
  findVariantQuery,
  variantSeoUrlCriteria,
} from "./variantApi";

const OPTIONS = { "group-color": "option-blue", "group-size": "option-large" };

const INPUT = {
  productId: "variant-red-large",
  parentId: "parent-1",
  options: OPTIONS,
  switchedGroup: "group-color",
};

function shop(
  answers: {
    find?: () => unknown;
    seo?: () => unknown;
  } = {},
) {
  const answer: FakeAnswer = (operation) => {
    if (operation === FIND_VARIANT) {
      return answers.find
        ? answers.find()
        : { variantId: "variant-blue-large", options: OPTIONS };
    }
    if (operation === READ_SEO_URL) {
      return answers.seo
        ? answers.seo()
        : { elements: [{ seoPathInfo: "Shirt/SW10001.2" }] };
    }
    throw new Error(`Unexpected operation ${operation}`);
  };
  const fake = fakeClient(answer);
  return { ...fake, getClient: async () => fake.client };
}

function silenceErrors() {
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("findVariantQuery", () => {
  it("keys every option by its group in the given order and adds the switched group", () => {
    const query = findVariantQuery(OPTIONS, "group-size");

    expect(Object.entries(query)).toEqual([
      ["options[group-color]", "option-blue"],
      ["options[group-size]", "option-large"],
      ["switchedGroup", "group-size"],
    ]);
  });

  it("leaves the switched group out when there is none", () => {
    expect(
      Object.keys(findVariantQuery({ "group-size": "option-small" })),
    ).toEqual(["options[group-size]"]);
  });
});

describe("findProductVariant", () => {
  it("finds the variant under the parent, then reads its canonical SEO path", async () => {
    const { getClient, invocations } = shop();
    const controller = new AbortController();

    await expect(
      findProductVariant(getClient, { ...INPUT, signal: controller.signal }),
    ).resolves.toEqual({
      ok: true,
      variant: { productId: "variant-blue-large", url: "/Shirt/SW10001.2" },
    });

    expect(invocations).toEqual([
      {
        operation: FIND_VARIANT,
        params: {
          pathParams: { productId: "parent-1" },
          query: findVariantQuery(OPTIONS, "group-color"),
          fetchOptions: { timeout: READ_TIMEOUT_MS, signal: controller.signal },
        },
      },
      {
        operation: READ_SEO_URL,
        params: {
          query: {
            _criteria: encodeForQuery(
              variantSeoUrlCriteria("variant-blue-large"),
            ),
          },
          fetchOptions: { timeout: READ_TIMEOUT_MS, signal: controller.signal },
        },
      },
    ]);
  });

  it("asks for the canonical detail-page URL of the variant only", () => {
    expect(variantSeoUrlCriteria("variant-blue-large")).toEqual({
      filter: [
        { type: "equals", field: "routeName", value: "frontend.detail.page" },
        { type: "equals", field: "foreignKey", value: "variant-blue-large" },
      ],
      includes: { seo_url: ["seoPathInfo"] },
      limit: 1,
    });
  });

  it("searches under the product itself when it has no parent", async () => {
    const { getClient, calls } = shop();

    await findProductVariant(getClient, {
      productId: "parent-1",
      options: OPTIONS,
    });

    expect(calls(FIND_VARIANT)[0]?.params).toMatchObject({
      pathParams: { productId: "parent-1" },
    });
  });

  it("also reads the variant id from the documented foundCombination wrapper", async () => {
    const { getClient } = shop({
      find: () => ({ foundCombination: { variantId: "variant-blue-small" } }),
    });

    await expect(findProductVariant(getClient, INPUT)).resolves.toMatchObject({
      ok: true,
      variant: { productId: "variant-blue-small" },
    });
  });

  it("reports an unavailable combination as not found without reading an SEO URL or logging", async () => {
    const consoleError = silenceErrors();
    const { getClient, operations } = shop({
      find: () => {
        throw apiClientError(
          [{ code: VARIANT_NOT_FOUND, status: "404", detail: "Not found" }],
          404,
        );
      },
    });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: false,
      notFound: true,
    });

    expect(operations()).toEqual([FIND_VARIANT]);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it.each([
    [
      "a 404 with another code",
      () => apiClientError([{ code: "FRAMEWORK__NOT_FOUND" }], 404),
    ],
    [
      "a 400",
      () => apiClientError([{ code: "PRODUCT_INVALID_OPTIONS_PARAMETER" }]),
    ],
    ["a 500", () => apiClientError([], 500)],
    ["a network error", () => new TypeError("fetch failed")],
  ])("resolves %s as a logged failure", async (_name, failure) => {
    const consoleError = silenceErrors();
    const error = failure();
    const { getClient, operations } = shop({
      find: () => {
        throw error;
      },
    });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: false,
    });

    expect(operations()).toEqual([FIND_VARIANT]);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "[Variants] finding the variant failed",
      error,
    );
  });

  it("treats an answer without a variant id as a failure", async () => {
    const consoleError = silenceErrors();
    const { getClient, operations } = shop({ find: () => ({}) });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: false,
    });

    expect(operations()).toEqual([FIND_VARIANT]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it("returns the variant without a url when the SEO read fails", async () => {
    const consoleError = silenceErrors();
    const failure = apiClientError([], 500);
    const { getClient } = shop({
      seo: () => {
        throw failure;
      },
    });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: true,
      variant: { productId: "variant-blue-large" },
    });

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "[Variants] reading the SEO URL of the variant failed",
      failure,
    );
  });

  it.each([
    ["no SEO URL", { elements: [] }],
    ["an empty path", { elements: [{ seoPathInfo: "" }] }],
    ["a backslash", { elements: [{ seoPathInfo: "\\evil.example/Shirt" }] }],
    ["a control character", { elements: [{ seoPathInfo: "Shirt\u0007" }] }],
  ])("returns the variant without a url for %s", async (_name, seo) => {
    const consoleError = silenceErrors();
    const { getClient } = shop({ seo: () => seo });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: true,
      variant: { productId: "variant-blue-large" },
    });

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("keeps a single leading slash on the SEO path", async () => {
    const { getClient } = shop({
      seo: () => ({ elements: [{ seoPathInfo: "/Shirt/SW10001.2/" }] }),
    });

    await expect(findProductVariant(getClient, INPUT)).resolves.toEqual({
      ok: true,
      variant: { productId: "variant-blue-large", url: "/Shirt/SW10001.2/" },
    });
  });

  it("resolves an aborted lookup as cancelled without logging", async () => {
    const consoleError = silenceErrors();
    const controller = new AbortController();
    const { getClient } = shop({
      find: () => {
        controller.abort();
        throw new DOMException("The operation was aborted.", "AbortError");
      },
    });

    await expect(
      findProductVariant(getClient, { ...INPUT, signal: controller.signal }),
    ).resolves.toEqual({ ok: false, cancelled: true });

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("resolves a lookup aborted during the SEO read as cancelled without logging", async () => {
    const consoleError = silenceErrors();
    const controller = new AbortController();
    const { getClient } = shop({
      seo: () => {
        controller.abort();
        throw new DOMException("The operation was aborted.", "AbortError");
      },
    });

    await expect(
      findProductVariant(getClient, { ...INPUT, signal: controller.signal }),
    ).resolves.toEqual({ ok: false, cancelled: true });

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("resolves a client that cannot be created as a logged failure", async () => {
    const consoleError = silenceErrors();
    const failure = new Error("[Shopware] No browser client is provided.");

    await expect(
      findProductVariant(() => Promise.reject(failure), INPUT),
    ).resolves.toEqual({ ok: false });

    expect(consoleError).toHaveBeenCalledWith(
      "[Variants] finding the variant failed",
      failure,
    );
  });

  it("never sends an empty selection, which would match any variant", async () => {
    const { getClient, invocations } = shop();

    await expect(
      findProductVariant(getClient, { productId: "parent-1", options: {} }),
    ).resolves.toEqual({ ok: false, notFound: true });

    expect(invocations).toEqual([]);
  });
});
