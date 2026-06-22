import { BulbOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const banner = defineType({
  name: "banner",
  title: "Banner / CTA",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Banner",
      subtitle: "Banner / CTA",
    }),
  },
});
