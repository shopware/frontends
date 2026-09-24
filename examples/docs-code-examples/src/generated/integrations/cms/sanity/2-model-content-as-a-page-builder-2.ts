// studio/schemaTypes/documents/page.ts
defineField({
  name: "pageBuilder",
  type: "array",
  of: [
    { type: "hero" },
    { type: "featuredProducts" },
    { type: "richText" },
    { type: "banner" },
    { type: "gallery" },
  ],
});
