import { page } from "./documents/page";
import { banner } from "./objects/banner";
import { featuredProducts } from "./objects/featuredProducts";
import { gallery } from "./objects/gallery";
import { hero } from "./objects/hero";
import { richText } from "./objects/richText";

// Block types (objects) come first so the page document can reference them.
export const schemaTypes = [
  hero,
  featuredProducts,
  richText,
  banner,
  gallery,
  page,
];
