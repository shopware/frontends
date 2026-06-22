import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "subheading", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Hero",
      subtitle: subtitle ? `Hero · ${subtitle}` : "Hero",
      media: media ?? StarIcon,
    }),
  },
});
