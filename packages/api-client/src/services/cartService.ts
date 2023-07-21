import {
  getCheckoutCartEndpoint,
  getCheckoutCartLineItemEndpoint,
} from "../endpoints";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import { Cart, ContextTokenResponse, LineItem } from "@shopware-pwa/types";

/**
 * When no sw-context-token given then this method return an empty cart with the new sw-context-token.
 *
 * When sw-context-token given then this method simply returns the current state of the cart.
 *
 * As the purpose of this method is not clear we recommend to use `getCart` method because its behaviour seems to be the same.
 *
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 *
 * @public
 *
 * @category Cart
 */
export async function clearCart(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<ContextTokenResponse> {
  const resp = await contextInstance.invoke.post(getCheckoutCartEndpoint());
  const contextToken = resp.data["sw-context-token"];
  return { contextToken };
}

/**
 * Gets the current cart for the sw-context-token.
 * @throws ClientApiError
 * @public
 *
 * @category Cart
 */
export async function getCart(
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Cart> {
  const resp = await contextInstance.invoke.get(getCheckoutCartEndpoint());

  return resp.data;
}

/**
 * Adds specific quantity of the product to the cart by productId. It creates a new cart line item.
 *
 * Warning: This method does not change the state of the cart in any way if productId already exists in a cart. For changing the quantity use addQuantityToCartLineItem() or changeCartLineItemQuantity() methods.
 *
 * @throws ClientApiError
 * @public
 *
 * @param {string} productId id of the cart line item (usually it's a product id)
 * @param {number} quantity quantity of the product to be added to the cart
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @category Cart
 */
export async function addProductToCart(
  productId: string,
  quantity?: number,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Cart> {
  const qty = quantity || 1;
  const item: Partial<LineItem> = {
    quantity: qty,
    type: "product",
    referencedId: productId,
    id: productId,
  };
  const resp = await contextInstance.invoke.post(
    getCheckoutCartLineItemEndpoint(),
    {
      items: [item],
    },
  );

  return resp.data;
}

/**
 * Changes the current quantity in specific cart line item to given quantity.
 *
 * Example: If current quantity is 3 and you pass 2 as quantity parameter, you will get a new cart's state with quantity 2.
 *
 * @param {string} itemId id of the cart line item
 * @param {number} newQuantity new quantity of the cart line item
 * @param {ShopwareApiInstance} contextInstance instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @public
 *
 * @category Cart
 */
export async function changeCartItemQuantity(
  itemId: string,
  newQuantity = 1,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Cart> {
  const params = {
    items: [
      {
        id: itemId,
        quantity: parseInt(newQuantity.toString(), 10),
      },
    ],
  };
  const resp = await contextInstance.invoke.patch(
    getCheckoutCartLineItemEndpoint(),
    params,
  );

  return resp.data;
}

/**
 * Deletes the cart line item by id.
 *
 * This method may be used for deleting "product" type item lines as well as "promotion" type item lines.
 *
 * @param itemId - id of the cart line item
 * @param contextInstance - instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Cart
 * @public
 */
export async function removeCartItem(
  itemId: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Cart> {
  const resp = await contextInstance.invoke.delete(
    `${getCheckoutCartLineItemEndpoint()}?ids[]=${itemId}`,
  );

  return resp.data;
}

/**
 * Adds new promotion code to the cart by its code.
 *
 * Promotion code is being added as separate cart item line.
 *
 * @param promotionCode - code of the promotion
 * @param contextInstance - instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Cart
 * @public
 */
export async function addPromotionCode(
  promotionCode: string,
  contextInstance: ShopwareApiInstance = defaultInstance,
): Promise<Cart> {
  const item: Partial<LineItem> = {
    type: "promotion",
    referencedId: promotionCode,
  };
  const resp = await contextInstance.invoke.post(
    getCheckoutCartLineItemEndpoint(),
    {
      items: [item],
    },
  );

  return resp.data;
}

/**
 * Adds multiple items to the cart.
 * Accepts every type of cart item.
 *
 * @param items - array of cart items
 * @param contextInstance - instance of the api client (by default it's an Axios instance)
 *
 * @throws ClientApiError
 * @category Cart
 * @public
 */
export async function addCartItems(
  items: Partial<LineItem>[],
  contextInstance: ShopwareApiInstance = defaultInstance,
) {
  const resp = await contextInstance.invoke.post(
    getCheckoutCartLineItemEndpoint(),
    {
      items,
    },
  );

  return resp.data;
}
