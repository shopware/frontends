import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementImageGallery as CmsElementImageGalleryContent } from "../../types";
import { CmsElementImageGallery } from "./CmsElementImageGallery";

function createGallery(
  config: Record<string, { source: string; value: unknown }> = {},
  items: unknown[] = [
    {
      url: null,
      newTab: false,
      apiAlias: "cms_image_slider_item",
      media: {
        id: "media-1",
        url: "https://cdn.example.com/one.jpg",
        alt: "First image",
        thumbnails: [
          { width: 400, url: "https://cdn.example.com/one-400.jpg" },
        ],
      },
    },
    {
      url: null,
      newTab: false,
      apiAlias: "cms_image_slider_item",
      media: {
        id: "media-2",
        url: "https://cdn.example.com/two.glb",
        fileExtension: "glb",
      },
    },
  ],
) {
  return {
    id: "slot-gallery",
    apiAlias: "cms_slot",
    type: "image-gallery",
    slot: "left",
    config,
    data: { apiAlias: "cms_image_slider", sliderItems: items },
  } as unknown as CmsElementImageGalleryContent;
}

const ctx = createCmsContext({ registry: createCmsRegistry() });

describe("CmsElementImageGallery", () => {
  it("renders the first image, both navigation controls and the layout props", async () => {
    const html = await renderToHtml(
      <CmsElementImageGallery
        content={createGallery()}
        ctx={ctx}
        className="custom"
        style={{ marginTop: 8 }}
      />,
    );

    expect(html).toContain("mx-auto custom");
    expect(html).toContain("margin-top:8px");
    expect(html).toContain("min-height:500px");
    expect(html).toContain('alt="First image"');
    expect(html).toContain("one-400.jpg 400w");
    expect(html).not.toContain(">3D<");
    expect(html).toContain('aria-label="Previous image"');
    expect(html).toContain('aria-label="Next image"');
    expect(html).toContain('aria-label="Go to image 2"');
    expect(html).toContain("absolute bottom-4 left-1/2");
  });

  it("honours the navigation and minHeight config", async () => {
    const html = await renderToHtml(
      <CmsElementImageGallery
        content={createGallery({
          minHeight: { source: "static", value: "300px" },
          navigationArrows: { source: "static", value: "none" },
          navigationDots: { source: "static", value: "outside" },
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("min-height:300px");
    expect(html).not.toContain('aria-label="Previous image"');
    expect(html).toContain("gap-2 mt-4");
  });

  it("renders the placeholder when there are no slides", async () => {
    const html = await renderToHtml(
      <CmsElementImageGallery content={createGallery({}, [])} ctx={ctx} />,
    );

    expect(html).toContain('alt="Placeholder image"');
    expect(html).toContain("data:image/svg+xml;base64,");
    expect(html).not.toContain('aria-label="Go to image 1"');
  });
});
