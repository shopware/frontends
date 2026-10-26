import type { Schemas, operations } from "#shopware";

type CartResponse = operations["readCart get /checkout/cart"]["response"];
type AddLineItemBody =
  operations["addLineItem post /checkout/cart/line-item"]["body"];
type CartItems = AddLineItemBody["items"];
type Cart = Schemas["Cart"];
type LineItem = Schemas["LineItem"];
type CartError = Schemas["CartError"];
type CartDelivery = Schemas["CartDelivery"];

// Cart["errors"] is a union: either a CartError[] or a keyed map whose values
// carry an extra `code` and a widened `level`. Narrow it yourself when you read
// a raw response; through useCart it is always the map, and getErrorsCodes()
// hands you a CartError[].
type CartErrors = NonNullable<Schemas["Cart"]["errors"]>;
