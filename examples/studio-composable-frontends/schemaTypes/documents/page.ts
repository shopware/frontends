import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// A page is composed by the editor from an ordered list of section blocks
// (the Page Builder). The Nuxt frontend renders each block by its `_type`.
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageBuilder",
      title: "Page builder",
      type: "array",
      of: [
        defineArrayMember({ type: "hero" }),
        defineArrayMember({ type: "featuredProducts" }),
        defineArrayMember({ type: "richText" }),
        defineArrayMember({ type: "banner" }),
        defineArrayMember({ type: "gallery" }),
      ],
    }),
  ],
});
