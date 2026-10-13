import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { apiClientError } from "@/features/session/session.fixture";

import {
  addWishlistProduct,
  hasApiErrorCode,
  readWishlistIds,
  readWishlistPage,
  removeWishlistProduct,
} from "./wishlistApi";
import type { WishlistClient } from "./wishlistApi";

const READ = "readCustomerWishlist post /customer/wishlist";
const ADD = "addProductOnWishlist post /customer/wishlist/add/{productId}";
const DELETE =
  "deleteProductOnWishlist delete /customer/wishlist/delete/{productId}";

type Invocation = { operation: string; params: unknown };

function product(id: string): Schemas["Product"] {
  return { id, name: `Product ${id}` } as Schemas["Product"];
}

function client(answer: (operation: string) => unknown) {
  const invocations: Invocation[] = [];
  const fake = {
    invoke: async (operation: string, params?: unknown) => {
      invocations.push({ operation, params });
      return { data: await answer(operation), status: 200 };
    },
  } as unknown as WishlistClient;
  return { fake, invocations };
}

function failing(error: unknown) {
  return client(() => {
    throw error;
  });
}

const notFound = apiClientError(
  [{ code: "CHECKOUT__WISHLIST_NOT_FOUND", status: "404" }],
  404,
);

describe("hasApiErrorCode", () => {
  it("finds the code among the API errors", () => {
    expect(hasApiErrorCode(notFound, "CHECKOUT__WISHLIST_NOT_FOUND")).toBe(
      true,
    );
    expect(hasApiErrorCode(notFound, "OTHER")).toBe(false);
  });

  it("is false for errors that are not API errors", () => {
    expect(
      hasApiErrorCode(new Error("x"), "CHECKOUT__WISHLIST_NOT_FOUND"),
    ).toBe(false);
  });
});

describe("readWishlistIds", () => {
  it("reads up to 100 ids with an exact total and only the id field", async () => {
    const { fake, invocations } = client(() => ({
      products: { elements: [product("a"), product("b")], total: 7 },
    }));

    await expect(readWishlistIds(fake)).resolves.toEqual({
      productIds: ["a", "b"],
      total: 7,
    });
    expect(invocations).toEqual([
      {
        operation: READ,
        params: {
          body: {
            limit: 100,
            includes: { product: ["id"] },
            "total-count-mode": "exact",
          },
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
  });

  it("treats a customer without a wishlist as an empty one", async () => {
    await expect(readWishlistIds(failing(notFound).fake)).resolves.toEqual({
      productIds: [],
      total: 0,
    });
  });

  it("passes other errors on", async () => {
    const disabled = apiClientError(
      [{ code: "CHECKOUT__WISHLIST_IS_NOT_ACTIVATED", status: "403" }],
      403,
    );

    await expect(readWishlistIds(failing(disabled).fake)).rejects.toBe(
      disabled,
    );
  });
});

describe("readWishlistPage", () => {
  it("reads one page with SEO URLs and an exact total", async () => {
    const { fake, invocations } = client(() => ({
      products: { elements: [product("a")], total: 16 },
    }));

    await expect(
      readWishlistPage(fake, { page: 2, limit: 15 }),
    ).resolves.toEqual({ elements: [product("a")], total: 16 });
    expect(invocations[0]?.params).toEqual({
      body: {
        page: 2,
        limit: 15,
        associations: { seoUrls: {} },
        "total-count-mode": "exact",
      },
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
  });

  it("reads an empty page when the response has no products", async () => {
    const { fake } = client(() => ({}));

    await expect(
      readWishlistPage(fake, { page: 1, limit: 15 }),
    ).resolves.toEqual({ elements: [], total: 0 });
  });
});

describe("addWishlistProduct", () => {
  it("adds the product by its id", async () => {
    const { fake, invocations } = client(() => ({ success: true }));

    await expect(addWishlistProduct(fake, "a")).resolves.toBe("changed");
    expect(invocations).toEqual([
      { operation: ADD, params: { pathParams: { productId: "a" } } },
    ]);
  });

  it("reports a product that is already on the wishlist as unchanged", async () => {
    const duplicate = apiClientError(
      [{ code: "CHECKOUT__DUPLICATE_WISHLIST_PRODUCT", status: "400" }],
      400,
    );

    await expect(
      addWishlistProduct(failing(duplicate).fake, "a"),
    ).resolves.toBe("unchanged");
  });

  it("passes other errors on", async () => {
    const loggedOut = apiClientError(
      [{ code: "FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN", status: "403" }],
      403,
    );

    await expect(addWishlistProduct(failing(loggedOut).fake, "a")).rejects.toBe(
      loggedOut,
    );
  });
});

describe("removeWishlistProduct", () => {
  it("removes the product by its id", async () => {
    const { fake, invocations } = client(() => ({ success: true }));

    await expect(removeWishlistProduct(fake, "a")).resolves.toBe("changed");
    expect(invocations).toEqual([
      { operation: DELETE, params: { pathParams: { productId: "a" } } },
    ]);
  });

  it.each([
    "CHECKOUT__WISHLIST_PRODUCT_NOT_FOUND",
    "CHECKOUT__WISHLIST_NOT_FOUND",
  ])("reports %s as unchanged", async (code) => {
    const missing = apiClientError([{ code, status: "404" }], 404);

    await expect(
      removeWishlistProduct(failing(missing).fake, "a"),
    ).resolves.toBe("unchanged");
  });

  it("passes other errors on", async () => {
    const failure = new Error("network down");

    await expect(
      removeWishlistProduct(failing(failure).fake, "a"),
    ).rejects.toBe(failure);
  });
});
