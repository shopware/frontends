import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Stores only Shopware product IDs - live commerce data (price, name, stock,
// media) is resolved by the frontend from the Shopware Store API.
export const featuredProducts = defineType({
  name: "featuredProducts",
  title: "Featured products",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "productIds",
      title: "Shopware product IDs",
      type: "array",
      of: [{ type: "string" }],
      description: "Product IDs from the Shopware Store API.",
    }),
  ],
  preview: {
    select: { title: "heading", products: "productIds" },
    prepare: ({ title, products }) => ({
      title: title || "Featured products",
      subtitle: `${products?.length ?? 0} product(s)`,
    }),
  },
});
