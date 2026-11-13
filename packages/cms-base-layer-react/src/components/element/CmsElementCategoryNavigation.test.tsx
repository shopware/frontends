import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementCategoryNavigation as CmsElementCategoryNavigationContent } from "../../types";
import { toCategoryNavigationItems } from "../shared/categoryNavigation";
import { SwCategoryNavigation } from "../shared/SwCategoryNavigation";
import { CmsElementCategoryNavigation } from "./CmsElementCategoryNavigation";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} {...props}>
      {children as never}
    </a>
  ),
}));

const content = {
  id: "slot-category-navigation",
  apiAlias: "cms_slot",
  type: "category-navigation",
  slot: "content",
  blockId: "block-category-navigation",
  config: {},
} as unknown as CmsElementCategoryNavigationContent;

function category(overrides: Record<string, unknown>): Schemas["Category"] {
  return {
    type: "page",
    translated: {},
    children: [],
    ...overrides,
  } as unknown as Schemas["Category"];
}

const clothing = category({
  id: "clothing",
  name: "Clothing",
  path: "|root|",
  seoUrls: [{ seoPathInfo: "Clothing/" }],
});

const navigation = [
  category({
    id: "men",
    name: "Men",
    path: "|root|clothing|",
    seoUrls: [{ seoPathInfo: "Clothing/Men/" }],
    children: [
      category({
        id: "shirts",
        name: "Shirts",
        path: "|root|clothing|men|",
        seoUrls: [{ seoPathInfo: "Clothing/Men/Shirts/" }],
      }),
    ],
  }),
  category({
    id: "women",
    name: "Women",
    path: "|root|clothing|",
    seoUrls: [{ seoPathInfo: "Clothing/Women/" }],
  }),
  category({
    id: "shopware",
    name: "Shopware",
    type: "link",
    externalLink: "https://shopware.com",
  }),
];

function render(ctxOverrides: Record<string, unknown> = {}) {
  const ctx = createCmsContext({
    registry: createCmsRegistry(),
    urlPrefix: "de-DE",
    category: clothing,
    navigation,
    ...ctxOverrides,
  });
  return renderToHtml(
    <CmsElementCategoryNavigation
      content={content}
      ctx={ctx}
      className="custom-class"
      style={{ marginTop: "10px" }}
    />,
  );
}

describe("CmsElementCategoryNavigation", () => {
  it("renders nothing without a navigation tree", async () => {
    const html = await renderToHtml(
      <CmsElementCategoryNavigation
        content={content}
        ctx={createCmsContext({ registry: createCmsRegistry() })}
      />,
    );

    expect(html).toBe("");
  });

  it("renders the subcategories of the current category as the top level", async () => {
    const html = await render();

    expect(html).toContain(
      'class="self-stretch inline-flex flex-col justify-start items-start gap-3 custom-class"',
    );
    expect(html).toContain("margin-top:10px");
    expect(html).not.toContain('href="/de-DE/Clothing/"');
    expect(html).toContain(
      '<a href="/de-DE/Clothing/Men/" class="flex-1 justify-start text-surface-on-surface text-base leading-normal font-bold">',
    );
    expect(html).toContain('href="/de-DE/Clothing/Women/"');
  });

  it("keeps every level collapsed until toggled", async () => {
    const html = await render();

    expect(html).toContain('aria-label="Expand"');
    expect(html).not.toContain('aria-label="Collapse"');
    expect(html).not.toContain('href="/de-DE/Clothing/Men/Shirts/"');
  });

  it("renders external links as anchors opening in a new tab", async () => {
    const html = await render();

    expect(html).toContain('href="https://shopware.com"');
    expect(html).toContain('target="_blank"');
  });

  it("marks the active category bold on nested levels", async () => {
    const html = await renderToHtml(
      <SwCategoryNavigation
        level={1}
        elements={toCategoryNavigationItems(navigation, "de-DE")}
        activeCategoryId="men"
      />,
    );

    expect(html).toContain(
      '<a href="/de-DE/Clothing/Men/" class="justify-start text-surface-on-surface text-base leading-normal font-bold">',
    );
    expect(html).toContain(
      '<a href="/de-DE/Clothing/Women/" class="justify-start text-surface-on-surface text-base leading-normal font-normal">',
    );
  });
});
