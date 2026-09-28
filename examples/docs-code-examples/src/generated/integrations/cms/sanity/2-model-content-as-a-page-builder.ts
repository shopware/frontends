// studio/schemaTypes/objects/featuredProducts.ts
import { defineField, defineType } from "sanity";

export const featuredProducts = defineType({
  name: "featuredProducts",
  title: "Featured products",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "productIds",
      title: "Shopware product IDs",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
