import type { Product } from "../models/content/product/Product";
import type { PropertyGroup } from "../models/content/property/PropertyGroup";

/**
 * @beta
 */
export type ProductResponse = {
  product: Product;
  configurator: PropertyGroup[];
};
