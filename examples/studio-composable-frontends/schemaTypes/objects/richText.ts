import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Rich text" }),
  },
});
