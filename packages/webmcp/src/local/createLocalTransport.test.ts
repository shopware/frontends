import { describe, expect, it, vi } from "vitest";

import { createLocalTransport, localTools } from "./createLocalTransport";
import type { StoreApiClient } from "./tool";

const product = {
  id: "a".repeat(32),
  productNumber: "SW10001",
  name: "Plain name",
  translated: {
    name: "<b>Fancy</b> name",
    description: "<p>Long &nbsp; text</p>",
  },
  calculatedPrice: {
    unitPrice: 12.5,
    totalPrice: 12.5,
    listPrice: { price: 15 },
  },
  stock: 3,
  isCloseout: true,
  seoUrls: [{ seoPathInfo: "fancy-name/SW10001" }],
  parentId: "b".repeat(32),
  options: [
    {
      name: "Red",
      translated: { name: "Red" },
      group: { translated: { name: "Colour" } },
    },
  ],
};

const cart = {
  lineItems: [
    {
      id: "line-1",
      type: "product",
      referencedId: product.id,
      label: "Fancy name",
      quantity: 2,
      price: { totalPrice: 25 },
    },
    { id: "line-2", type: "promotion", referencedId: "SAVE10", quantity: 1 },
  ],
  price: { totalPrice: 22.5 },
  errors: {
    "promotion-discount-added-SAVE10": { message: "Discount SAVE10 added" },
  },
};

function fakeClient(responses: Record<string, unknown> = {}) {
  const invoke = vi.fn(async (path: string) => {
    if (path in responses) return { data: responses[path] };
    throw new Error(`unexpected invoke ${path}`);
  });
  return { invoke } as unknown as StoreApiClient & { invoke: typeof invoke };
}

const context = { pageContext: {} };

describe("createLocalTransport", () => {
  it("advertises a valid, bounded contract", async () => {
    const { tools } = await createLocalTransport({
      apiClient: fakeClient(),
      mode: "shopping",
    }).listTools();

    expect(tools.map((tool) => tool.name)).toEqual([
      "search_products",
      "get_product",
      "get_cart",
      "add_to_cart",
      "update_cart_item",
      "apply_promotion_code",
      "start_checkout",
    ]);
    for (const tool of tools) {
      expect(tool.name).toMatch(/^[a-z][a-z0-9_]{2,29}$/);
      expect(tool.description.length).toBeLessThanOrEqual(500);
      const properties = tool.inputSchema.properties as Record<
        string,
        {
          description: string;
          type: string;
          maxLength?: number;
          maximum?: number;
        }
      >;
      for (const param of Object.values(properties)) {
        expect(param.description.length).toBeLessThanOrEqual(150);
        expect(
          param.type === "string" ? param.maxLength : param.maximum,
        ).toBeDefined();
      }
      if (tool.minimumMode === "shopping") {
        expect(tool.annotations?.readOnlyHint).not.toBe(true);
      }
    }
  });

  it("filters tools by mode and refuses hidden tools on execute", async () => {
    const readOnly = createLocalTransport({
      apiClient: fakeClient(),
      mode: "read_only",
    });
    const { tools } = await readOnly.listTools();
    expect(tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
    await expect(
      readOnly.callTool("add_to_cart", {}, context),
    ).rejects.toMatchObject({
      code: "write_in_read_only",
    });

    const off = createLocalTransport({ apiClient: fakeClient() });
    expect((await off.listTools()).tools).toEqual([]);
    await expect(off.callTool("get_cart", {}, context)).rejects.toMatchObject({
      code: "disabled",
    });
    await expect(off.callTool("nope", {}, context)).rejects.toMatchObject({
      code: "tool_not_found",
    });
  });

  it("search_products returns compact cards", async () => {
    const apiClient = fakeClient({
      "searchPage post /search": { total: 1, elements: [product] },
    });
    const transport = createLocalTransport({ apiClient, mode: "read_only" });

    const result = await transport.callTool(
      "search_products",
      { query: "  fancy ", limit: "3" },
      context,
    );

    expect(apiClient.invoke).toHaveBeenCalledWith(
      "searchPage post /search",
      expect.objectContaining({
        body: expect.objectContaining({ search: "fancy", limit: 3 }),
      }),
    );
    expect(result.data).toEqual({
      total: 1,
      products: [
        {
          id: product.id,
          productNumber: "SW10001",
          name: "Fancy name",
          price: 12.5,
          listPrice: 15,
          available: true,
          url: "/fancy-name/SW10001",
        },
      ],
    });
  });

  it("search_products validates its input", async () => {
    const transport = createLocalTransport({
      apiClient: fakeClient(),
      mode: "read_only",
    });
    await expect(
      transport.callTool("search_products", {}, context),
    ).rejects.toMatchObject({ code: "invalid_input" });
    await expect(
      transport.callTool("search_products", { query: "x", limit: 50 }, context),
    ).rejects.toMatchObject({ code: "invalid_input" });
  });

  it("get_product defaults to the product page the shopper is on", async () => {
    const apiClient = fakeClient({
      "readProductDetail post /product/{productId}": { product },
    });
    const transport = createLocalTransport({ apiClient, mode: "read_only" });

    const result = await transport.callTool(
      "get_product",
      {},
      { pageContext: { productId: product.id } },
    );

    expect(apiClient.invoke).toHaveBeenCalledWith(
      "readProductDetail post /product/{productId}",
      expect.objectContaining({ pathParams: { productId: product.id } }),
    );
    expect(result.data).toMatchObject({
      name: "Fancy name",
      description: "Long text",
      options: ["Colour: Red"],
      isVariant: true,
    });
  });

  it("get_product resolves a product number and fails when none matches", async () => {
    const apiClient = fakeClient({
      "readProduct post /product": { elements: [] },
    });
    const transport = createLocalTransport({ apiClient, mode: "read_only" });

    await expect(
      transport.callTool("get_product", { productNumber: "SW1" }, context),
    ).rejects.toThrow("No product with number SW1");
    await expect(
      transport.callTool("get_product", {}, context),
    ).rejects.toMatchObject({
      code: "invalid_input",
    });
  });

  it("get_cart projects items, promotions and errors without the token", async () => {
    const apiClient = fakeClient({
      "readCart get /checkout/cart": { ...cart, token: "secret" },
    });
    const transport = createLocalTransport({ apiClient, mode: "read_only" });

    const result = await transport.callTool("get_cart", {}, context);

    expect(result.data).toEqual({
      items: [
        {
          lineItemId: "line-1",
          productId: product.id,
          name: "Fancy name",
          quantity: 2,
          type: "product",
          total: 25,
        },
      ],
      itemCount: 2,
      total: 22.5,
      promotionCodes: ["SAVE10"],
      errors: ["Discount SAVE10 added"],
    });
    expect(JSON.stringify(result.data)).not.toContain("secret");
  });

  it("add_to_cart adds the current product and flags the cart as changed", async () => {
    const apiClient = fakeClient({
      "readProductDetail post /product/{productId}": { product },
      "addLineItem post /checkout/cart/line-item": cart,
    });
    const transport = createLocalTransport({ apiClient, mode: "shopping" });

    const result = await transport.callTool(
      "add_to_cart",
      { quantity: 2 },
      { pageContext: { productId: product.id } },
    );

    expect(apiClient.invoke).toHaveBeenCalledWith(
      "addLineItem post /checkout/cart/line-item",
      expect.objectContaining({
        body: {
          items: [
            {
              id: product.id,
              referencedId: product.id,
              quantity: 2,
              type: "product",
            },
          ],
        },
      }),
    );
    expect(result.cartChanged).toBe(true);
  });

  it("update_cart_item removes the line on quantity 0", async () => {
    const apiClient = fakeClient({
      "removeLineItem post /checkout/cart/line-item/delete": cart,
      "updateLineItem patch /checkout/cart/line-item": cart,
    });
    const transport = createLocalTransport({ apiClient, mode: "shopping" });

    await transport.callTool(
      "update_cart_item",
      { lineItemId: "line-1", quantity: 0 },
      context,
    );
    await transport.callTool(
      "update_cart_item",
      { lineItemId: "line-1", quantity: 3 },
      context,
    );

    expect(apiClient.invoke).toHaveBeenNthCalledWith(
      1,
      "removeLineItem post /checkout/cart/line-item/delete",
      expect.objectContaining({ body: { ids: ["line-1"] } }),
    );
    expect(apiClient.invoke).toHaveBeenNthCalledWith(
      2,
      "updateLineItem patch /checkout/cart/line-item",
      expect.objectContaining({
        body: { items: [{ id: "line-1", quantity: 3 }] },
      }),
    );
  });

  it("apply_promotion_code reports whether the code applied", async () => {
    const apiClient = fakeClient({
      "addLineItem post /checkout/cart/line-item": cart,
    });
    const transport = createLocalTransport({ apiClient, mode: "shopping" });

    const applied = await transport.callTool(
      "apply_promotion_code",
      { code: "SAVE10" },
      context,
    );
    expect(applied.data).toMatchObject({ applied: true });

    const emptyCart = fakeClient({
      "addLineItem post /checkout/cart/line-item": {
        lineItems: [],
        errors: {},
      },
    });
    await expect(
      createLocalTransport({ apiClient: emptyCart, mode: "shopping" }).callTool(
        "apply_promotion_code",
        { code: "NOPE" },
        context,
      ),
    ).rejects.toThrow("NOPE was not applied");
  });

  it("start_checkout reports the next step and never writes", async () => {
    const guest = fakeClient({
      "readCart get /checkout/cart": cart,
      "readContext get /context": { customer: null },
    });
    const transport = createLocalTransport({
      apiClient: guest,
      mode: "shopping",
    });

    const result = await transport.callTool("start_checkout", {}, context);
    expect(result.data).toMatchObject({ status: "customer_details_needed" });
    expect(result.next).toEqual({ target: "checkout.register" });
    expect(result.cartChanged).toBeUndefined();

    const loggedIn = fakeClient({
      "readCart get /checkout/cart": cart,
      "readContext get /context": { customer: { id: "c1" } },
    });
    const ready = await createLocalTransport({
      apiClient: loggedIn,
      mode: "shopping",
    }).callTool("start_checkout", {}, context);
    expect(ready.next).toEqual({ target: "checkout.confirm" });

    const empty = fakeClient({
      "readCart get /checkout/cart": { lineItems: [] },
      "readContext get /context": { customer: null },
    });
    await expect(
      createLocalTransport({ apiClient: empty, mode: "shopping" }).callTool(
        "start_checkout",
        {},
        context,
      ),
    ).rejects.toThrow("The cart is empty");
  });

  it("accepts a custom tool set", async () => {
    const transport = createLocalTransport({
      apiClient: fakeClient(),
      mode: "read_only",
      tools: [localTools[2]!],
    });
    expect(
      (await transport.listTools()).tools.map((tool) => tool.name),
    ).toEqual(["get_cart"]);
  });
});
