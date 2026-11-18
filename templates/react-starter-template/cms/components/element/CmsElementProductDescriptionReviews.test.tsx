import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementProductDescriptionReviews as CmsElementProductDescriptionReviewsContent } from "../../types";
import { CmsElementProductDescriptionReviews } from "./CmsElementProductDescriptionReviews";
import type { CmsElementProductDescriptionReviewsTabsProps } from "./CmsElementProductDescriptionReviewsTabs";

const island = vi.hoisted(() => ({
  props: [] as CmsElementProductDescriptionReviewsTabsProps[],
}));

vi.mock("./CmsElementProductDescriptionReviewsTabs", () => ({
  CmsElementProductDescriptionReviewsTabs: (
    props: CmsElementProductDescriptionReviewsTabsProps,
  ) => {
    island.props.push(props);
    return null;
  },
}));

function product(overrides: Partial<Schemas["Product"]> = {}) {
  return {
    id: "variant-1",
    parentId: "parent-1",
    translated: { description: "<p>Oak chair</p>" },
    ...overrides,
  } as Schemas["Product"];
}

function review(
  overrides: Partial<Schemas["ProductReview"]> = {},
): Schemas["ProductReview"] {
  return {
    id: "review-1",
    productId: "variant-1",
    salesChannelId: "sales-channel-1",
    languageId: "language-1",
    title: "Solid chair",
    content: "Sturdy and comfortable for long working days at the desk.",
    points: 4,
    status: true,
    ...overrides,
  };
}

function content(
  data: Partial<CmsElementProductDescriptionReviewsContent["data"]>,
): CmsElementProductDescriptionReviewsContent {
  return {
    id: "slot-reviews",
    apiAlias: "cms_slot",
    type: "product-description-reviews",
    slot: "content",
    blockId: "block-reviews",
    config: {},
    data: {
      productId: "variant-1",
      ratingSuccess: false,
      apiAlias: "cms_product_description_reviews",
      ...data,
    },
  } as unknown as CmsElementProductDescriptionReviewsContent;
}

const registry = createCmsRegistry({});

async function render(
  slot: CmsElementProductDescriptionReviewsContent,
  isLoggedIn = false,
): Promise<CmsElementProductDescriptionReviewsTabsProps> {
  const ctx = createCmsContext({ registry, locale: "de-DE", isLoggedIn });
  await renderToHtml(
    <CmsElementProductDescriptionReviews content={slot} ctx={ctx} />,
  );
  const props = island.props.at(-1);
  if (!props) throw new Error("The reviews island did not render");
  return props;
}

beforeEach(() => {
  island.props = [];
});

describe("CmsElementProductDescriptionReviews", () => {
  it("reads the reviews of the parent and saves under the variant", async () => {
    const props = await render(
      content({
        product: product(),
        reviews: { elements: [review(), review({ id: "review-2" })] },
      }),
      true,
    );

    expect(props).toMatchObject({
      productId: "variant-1",
      reviewsProductId: "parent-1",
      initialReviewCount: 2,
      isLoggedIn: true,
      locale: "de-DE",
    });
  });

  it("reads the reviews of the product itself when it has no parent", async () => {
    const props = await render(
      content({
        product: product({ id: "product-1", parentId: undefined }),
        reviews: { elements: [] },
      }),
    );

    expect(props.productId).toBe("product-1");
    expect(props.reviewsProductId).toBe("product-1");
    expect(props.initialReviewCount).toBe(0);
  });

  it.each([
    ["null", null],
    ["missing", undefined],
  ])(
    "reads nothing when the slot's reviews are %s because reviews are off",
    async (_, reviews) => {
      const props = await render(content({ product: product(), reviews }));

      expect(props.productId).toBe("variant-1");
      expect(props.reviewsProductId).toBeUndefined();
      expect(props.initialReviewCount).toBe(0);
    },
  );

  it("renders the slot's reviews on the server as the first list", async () => {
    const props = await render(
      content({
        product: product(),
        reviews: { elements: [review({ title: "Solid chair" })] },
      }),
    );

    const html = await renderToHtml(props.reviews);

    expect(html).toContain("Solid chair");
    expect(html).not.toContain("Your review has not been approved yet");
  });

  it("renders no list and no product id without a product", async () => {
    const props = await render(content({ reviews: { elements: [] } }));

    expect(props.productId).toBeUndefined();
    expect(props.reviewsProductId).toBeUndefined();
    expect(props.reviews).toBeNull();
  });
});
