import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: "heading", media: "images.0" },
    prepare: ({ title, media }) => ({
      title: title || "Gallery",
      subtitle: "Gallery",
      media,
    }),
  },
});
