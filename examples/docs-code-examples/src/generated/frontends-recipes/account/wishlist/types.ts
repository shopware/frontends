import type { Schemas, operations } from "#shopware";

type WishlistCriteria =
  operations["readCustomerWishlist post /customer/wishlist"]["body"];
type WishlistResponse =
  operations["readCustomerWishlist post /customer/wishlist"]["response"];
type Criteria = Schemas["Criteria"];
type Product = Schemas["Product"];
