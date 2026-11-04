import { WebMcpToolError } from "../../types";
import { toCartSummary } from "../projections";
import { defineLocalTool } from "../tool";
import { findProduct } from "./getProduct";

const LINE_ITEM_ID = {
  type: "string",
  description: "Line item id from get_cart.",
  minLength: 1,
  maxLength: 64,
} as const;

export const getCart = defineLocalTool({
  name: "get_cart",
  title: "Show the cart",
  description:
    "Use when the shopper asks what is in their cart, the total, or which promotion codes apply. Returns line items with ids needed by update_cart_item.",
  params: { properties: {} },
  annotations: { readOnlyHint: true },
  minimumMode: "read_only",
  async execute(_input, context, apiClient) {
    const { data } = await apiClient.invoke("readCart get /checkout/cart", {
      fetchOptions: { signal: context.signal },
    });
    return { data: toCartSummary(data) };
  },
});

export const addToCart = defineLocalTool({
  name: "add_to_cart",
  title: "Add a product to the cart",
  description:
    "Use when the shopper asks to add, put or buy a product. Give productId or productNumber; without either, adds the product page the shopper is looking at. Returns the updated cart.",
  params: {
    properties: {
      productId: {
        type: "string",
        description: "Product id (32 hex characters) from search_products.",
        maxLength: 32,
        pattern: "^[0-9a-f]{32}$",
      },
      productNumber: {
        type: "string",
        description: "The shop's product number, e.g. SW10001.",
        minLength: 1,
        maxLength: 64,
      },
      quantity: {
        type: "integer",
        description: "How many to add. Default 1.",
        minimum: 1,
        maximum: 99,
      },
    },
  },
  minimumMode: "shopping",
  async execute(input, context, apiClient) {
    const product = await findProduct(
      apiClient,
      {
        productId:
          (input.productId as string | undefined) ??
          (input.productNumber ? undefined : context.pageContext.productId),
        productNumber: input.productNumber as string | undefined,
      },
      context.signal,
    );
    const { data } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: {
          items: [
            {
              id: product.id,
              referencedId: product.id,
              quantity: (input.quantity as number | undefined) ?? 1,
              type: "product",
            },
          ],
        },
        fetchOptions: { signal: context.signal },
      },
    );
    return { data: toCartSummary(data), cartChanged: true };
  },
});

export const updateCartItem = defineLocalTool({
  name: "update_cart_item",
  title: "Change a cart line quantity",
  description:
    "Use when the shopper asks to change how many of a cart line they want, or to remove it. Quantity 0 removes the line. Needs the lineItemId from get_cart.",
  params: {
    properties: {
      lineItemId: LINE_ITEM_ID,
      quantity: {
        type: "integer",
        description: "New quantity. 0 removes the line.",
        minimum: 0,
        maximum: 99,
      },
    },
    required: ["lineItemId", "quantity"],
  },
  minimumMode: "shopping",
  async execute(input, context, apiClient) {
    const id = input.lineItemId as string;
    const quantity = input.quantity as number;
    const { data } =
      quantity === 0
        ? await apiClient.invoke(
            "removeLineItem post /checkout/cart/line-item/delete",
            {
              body: { ids: [id] },
              fetchOptions: { signal: context.signal },
            },
          )
        : await apiClient.invoke(
            "updateLineItem patch /checkout/cart/line-item",
            {
              body: { items: [{ id, quantity }] },
              fetchOptions: { signal: context.signal },
            },
          );
    return { data: toCartSummary(data), cartChanged: true };
  },
});

export const applyPromotionCode = defineLocalTool({
  name: "apply_promotion_code",
  title: "Apply a promotion code",
  description:
    "Use when the shopper gives a voucher, coupon or promotion code to redeem. Reports whether the code applied and the updated cart.",
  params: {
    properties: {
      code: {
        type: "string",
        description: "The promotion code as the shopper typed it.",
        minLength: 1,
        maxLength: 64,
      },
    },
    required: ["code"],
  },
  minimumMode: "shopping",
  async execute(input, context, apiClient) {
    const code = input.code as string;
    const { data } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: { items: [{ referencedId: code, type: "promotion" }] },
        fetchOptions: { signal: context.signal },
      },
    );
    const cart = toCartSummary(data);
    const applied = cart.promotionCodes.includes(code);
    if (!applied && cart.errors.length === 0) {
      throw new WebMcpToolError(
        `Promotion code ${code} was not applied`,
        "failed",
      );
    }
    return { data: { applied, cart }, cartChanged: true };
  },
});
