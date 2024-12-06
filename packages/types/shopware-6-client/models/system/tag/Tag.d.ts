import type { Order } from "../../checkout/order/Order";
import type { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import type { Category } from "../../content/category/Category";
import type { Media } from "../../content/media/Media";
import type { NewsletterRecipient } from "../../content/newsletter/NewsletterRecipient";
import type { Product } from "../../content/product/Product";

/**
 * @public
 */
export type Tag = {
  name: string;
  products: Product[] | null;
  media: Media[] | null;
  categories: Category[] | null;
  orders: Order[] | null;
  shippingMethods: ShippingMethod[] | null;
  newsletterRecipients: NewsletterRecipient[] | null;
};
