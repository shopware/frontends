import type { Schemas } from "#shopware";

/**
 * Generate mock content data for testing
 * This simulates the new Content API responses
 */

export function generateMockContentPage(path: string): Schemas["ContentPage"] {
  const [type, id] = path.split("/");

  return {
    apiAlias: "content_page",
    layoutId: `layout-${id}`,
    layoutName: `Mock ${type} Layout`,
    layoutVersion: "1.0.0",
    elements: [
      // Hero Section with Grid
      {
        apiAlias: "content_element",
        id: "hero-grid",
        component: "Sw:Grid",
        properties: {
          columns: 2,
          gap: "large",
          displayMode: "cover",
        },
        slots: {
          left: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-text",
                component: "Sw:Content:Text",
                properties: {
                  title: `Welcome to ${type} ${id}`,
                  content:
                    "<p>This is a mock content page showcasing the new Content API. The layout is fully dynamic and hydrated from the API.</p>",
                  alignment: "left",
                  verticalAlignment: "center",
                },
              },
              {
                apiAlias: "content_element",
                id: "hero-button",
                component: "Sw:Content:Button",
                properties: {
                  text: "Shop Now",
                  url: `/category/${id}`,
                  variant: "primary",
                  size: "large",
                },
              },
            ],
          },
          right: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-image",
                component: "Sw:Content:Image",
                properties: {
                  url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
                  alt: "Hero Image",
                  displayMode: "cover",
                  minHeight: "400px",
                },
              },
            ],
          },
        },
      },
      // Product Grid
      {
        apiAlias: "content_element",
        id: "product-grid",
        component: "Sw:Grid",
        properties: {
          columns: 3,
          gap: "medium",
        },
        slots: {
          col1: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "product-1",
                component: "Sw:Product:Card",
                properties: {
                  product: {
                    id: "product-1",
                    name: "Mock Product 1",
                    description: "A great product for testing",
                    cover: {
                      media: {
                        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                      },
                    },
                    calculatedPrice: {
                      totalPrice: 99.99,
                      currencyId: "EUR",
                    },
                    seoUrls: [{ seoPathInfo: "mock-product-1" }],
                  },
                  displayMode: "standard",
                },
              },
            ],
          },
          col2: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "product-2",
                component: "Sw:Product:Card",
                properties: {
                  product: {
                    id: "product-2",
                    name: "Mock Product 2",
                    description: "Another excellent product",
                    cover: {
                      media: {
                        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                      },
                    },
                    calculatedPrice: {
                      totalPrice: 149.99,
                      currencyId: "EUR",
                    },
                    seoUrls: [{ seoPathInfo: "mock-product-2" }],
                  },
                  displayMode: "standard",
                },
              },
            ],
          },
          col3: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "product-3",
                component: "Sw:Product:Card",
                properties: {
                  product: {
                    id: "product-3",
                    name: "Mock Product 3",
                    description: "The best product ever",
                    cover: {
                      media: {
                        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
                      },
                    },
                    calculatedPrice: {
                      totalPrice: 79.99,
                      currencyId: "EUR",
                      listPrice: {
                        percentage: 20,
                      },
                    },
                    seoUrls: [{ seoPathInfo: "mock-product-3" }],
                  },
                  displayMode: "standard",
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export function generateMockDecomposedPage(
  path: string,
): Schemas["ContentDecomposedPage"] {
  const [type, id] = path.split("/");

  return {
    apiAlias: "content_decomposed_page",
    layoutId: `layout-${id}`,
    layoutName: `Mock ${type} Layout`,
    layoutVersion: "1.0.0",
    skeletons: [
      {
        apiAlias: "content_element",
        id: "hero-grid",
        component: "Sw:Grid",
        properties: {},
        slots: {
          left: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-text",
                component: "Sw:Content:Text",
                properties: {},
              },
            ],
          },
          right: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-image",
                component: "Sw:Content:Image",
                properties: {},
              },
            ],
          },
        },
      },
    ],
    data: {
      "ref-1": 2,
      "ref-2": "large",
      "ref-3": "cover",
      "ref-4": `Welcome to ${type} ${id}`,
      "ref-5": "<p>This is decomposed content with deduplicated data.</p>",
      "ref-6": "left",
      "ref-7": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      "ref-8": "Hero Image",
      "ref-9": "cover",
      "ref-10": "400px",
    },
    assignments: {
      "hero-grid": {
        columns: "ref-1",
        gap: "ref-2",
        displayMode: "ref-3",
      },
      "hero-text": {
        title: "ref-4",
        content: "ref-5",
        alignment: "ref-6",
      },
      "hero-image": {
        url: "ref-7",
        alt: "ref-8",
        displayMode: "ref-9",
        minHeight: "ref-10",
      },
    },
  };
}

export function generateMockSkeletonPage(
  path: string,
): Schemas["ContentSkeletonPage"] {
  const [type, id] = path.split("/");

  return {
    apiAlias: "content_skeleton_page",
    layoutId: `layout-${id}`,
    layoutName: `Mock ${type} Layout`,
    layoutVersion: "1.0.0",
    elements: [
      {
        apiAlias: "content_element",
        id: "hero-grid",
        component: "Sw:Grid",
        properties: {},
        slots: {
          left: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-text",
                component: "Sw:Content:Text",
                properties: {},
              },
              {
                apiAlias: "content_element",
                id: "hero-button",
                component: "Sw:Content:Button",
                properties: {},
              },
            ],
          },
          right: {
            apiAlias: "content_element_slot_content",
            elements: [
              {
                apiAlias: "content_element",
                id: "hero-image",
                component: "Sw:Content:Image",
                properties: {},
              },
            ],
          },
        },
      },
    ],
  };
}

export function generateMockDataPage(path: string): Schemas["ContentDataPage"] {
  const [type, id] = path.split("/");

  return {
    apiAlias: "content_data_page",
    layoutId: `layout-${id}`,
    layoutName: `Mock ${type} Layout`,
    layoutVersion: "1.0.0",
    data: {
      "ref-1": 2,
      "ref-2": "large",
      "ref-3": "cover",
      "ref-4": `Welcome to ${type} ${id}`,
      "ref-5": "<p>This is data-only response for hydration.</p>",
      "ref-6": "left",
      "ref-7": "center",
      "ref-8": "Shop Now",
      "ref-9": `/category/${id}`,
      "ref-10": "primary",
      "ref-11": "large",
      "ref-12": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      "ref-13": "Hero Image",
      "ref-14": "cover",
      "ref-15": "400px",
    },
    assignments: {
      "hero-grid": {
        columns: "ref-1",
        gap: "ref-2",
        displayMode: "ref-3",
      },
      "hero-text": {
        title: "ref-4",
        content: "ref-5",
        alignment: "ref-6",
        verticalAlignment: "ref-7",
      },
      "hero-button": {
        text: "ref-8",
        url: "ref-9",
        variant: "ref-10",
        size: "ref-11",
      },
      "hero-image": {
        url: "ref-12",
        alt: "ref-13",
        displayMode: "ref-14",
        minHeight: "ref-15",
      },
    },
  };
}
