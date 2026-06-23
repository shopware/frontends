// Bundled demo content so the layout renders out of the box before a real
// Sanity `page` document exists. Live Sanity content always wins (see app.vue).
// The product IDs are real entries from the Shopware demo store, so the
// FeaturedProducts block shows live prices and add-to-cart.
export const sampleHome = {
  title: "Sample home",
  pageBuilder: [
    {
      _key: "hero",
      _type: "hero",
      eyebrow: "Content + Commerce",
      heading: "Editorial that sells.",
      subheading:
        "Sanity composes the page, Shopware powers the cart. This entire layout is a Sanity Page Builder - reorder it without touching code.",
      ctaLabel: "Shop the drop",
      ctaHref: "#featured",
    },
    {
      _key: "featured",
      _type: "featuredProducts",
      heading: "Editor's picks",
      productIds: [
        "019b8af347c97cf9ab48e7697231468c",
        "019b8af55a72711f906bb2088ecd9283",
        "019b8af81b3d72538e64f4e36f232322",
        "019b8af8ca2b73419c2a5146556462fe",
        "019c475749cd72ddab29267538db9204",
        "019c47574ee973208d358d81b3695b77",
      ],
    },
    {
      _key: "story",
      _type: "richText",
      content: [
        {
          _key: "h",
          _type: "block",
          style: "h2",
          markDefs: [],
          children: [
            {
              _key: "h1",
              _type: "span",
              text: "Why content + commerce?",
              marks: [],
            },
          ],
        },
        {
          _key: "p",
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _key: "p1",
              _type: "span",
              text: "Marketing owns the story in Sanity. Catalog, pricing and stock stay in Shopware. The storefront joins them at request time - no duplicated data, no stale prices.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "banner",
      _type: "banner",
      heading: "Build pages, not tickets.",
      text: "Editors compose layouts in Sanity Studio. Developers ship the blocks once.",
      ctaLabel: "Learn the pattern",
      ctaHref: "https://developer.shopware.com/frontends/",
    },
  ],
};
