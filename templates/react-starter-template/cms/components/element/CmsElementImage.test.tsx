import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type {
  CmsElementImage as CmsElementImageContent,
  CmsElementManufacturerLogo as CmsElementManufacturerLogoContent,
} from "../../types";
import { CmsElementImage } from "./CmsElementImage";
import { CmsElementManufacturerLogo } from "./CmsElementManufacturerLogo";

const media = {
  id: "media-1",
  apiAlias: "media",
  url: "https://cdn/image.jpg",
  fileExtension: "jpg",
  mimeType: "image/jpeg",
  title: "Media title",
  translated: { alt: "", title: "Media title", url: "https://cdn/image.jpg" },
  thumbnails: [
    { width: 400, url: "https://cdn/image_400.jpg" },
    { width: 800, url: "https://cdn/image_800.jpg" },
  ],
} as unknown as Schemas["Media"];

function imageSlot(
  overrides: {
    data?: Partial<CmsElementImageContent["data"]>;
    config?: Partial<CmsElementImageContent["config"]>;
  } = {},
): CmsElementImageContent {
  return {
    id: "slot-1",
    apiAlias: "cms_slot",
    type: "image",
    slot: "image",
    blockId: "block-1",
    config: {
      displayMode: { source: "static", value: "standard" },
      ...overrides.config,
    },
    data: {
      mediaId: "media-1",
      url: "",
      newTab: false,
      apiAlias: "cms_image",
      media,
      ...overrides.data,
    },
  } as unknown as CmsElementImageContent;
}

const ctx = createCmsContext({
  registry: createCmsRegistry(),
  urlPrefix: "de-DE",
});

describe("CmsElementImage", () => {
  it("renders a div with the responsive image when there is no link", async () => {
    const html = await renderToHtml(
      <CmsElementImage content={imageSlot()} ctx={ctx} className="mt-2" />,
    );

    expect(html).toContain(
      '<div class="cms-element-image self-stretch relative mt-2"',
    );
    expect(html).toContain('src="https://cdn/image.jpg"');
    expect(html).toContain("https://cdn/image_400.jpg 400w");
    expect(html).toContain(`sizes="${ctx.imageSizes}"`);
    expect(html).toContain('class="w-full object-contain"');
    expect(html).not.toContain("aria-label");
  });

  it("wraps a linked image in a prefixed anchor with a fallback aria-label", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({ data: { url: "/landing", newTab: true } })}
        ctx={ctx}
      />,
    );

    expect(html).toContain("<a ");
    expect(html).toContain('href="/de-DE/landing"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('aria-label="Media title"');
  });

  it("uses the translated fallback label when the media has no alt or title", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({
          data: {
            url: "https://example.com",
            media: { ...media, title: undefined } as Schemas["Media"],
          },
        })}
        ctx={{
          ...ctx,
          translations: { cms: { image: { linkWithoutLabel: "Mehr" } } },
        }}
      />,
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('aria-label="Mehr"');
  });

  it("applies cover classes and the min height", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({
          config: {
            displayMode: { source: "static", value: "cover" },
            minHeight: { source: "static", value: "300px" },
          },
        })}
        ctx={ctx}
        style={{ marginTop: "4px" }}
      />,
    );

    expect(html).toContain('style="min-height:300px;margin-top:4px"');
    expect(html).toContain(
      'class="w-full h-full absolute left-0 top-0 object-cover"',
    );
  });

  it("renders gallery mode with a centered, contained image", async () => {
    const html = await renderToHtml(
      <CmsElementImage content={imageSlot()} ctx={ctx} imageGallery />,
    );

    expect(html).toContain(
      'class="cms-element-image self-stretch relative flex justify-center items-center"',
    );
    expect(html).toContain('class="w-4/5 object-contain"');
  });

  it("renders a video element for video media", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({
          data: {
            media: {
              ...media,
              url: "https://cdn/clip.mp4",
              mimeType: "video/mp4",
            } as Schemas["Media"],
          },
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain(
      '<video controls="" class="w-full h-full object-contain"',
    );
    expect(html).toContain(
      '<source src="https://cdn/clip.mp4" type="video/mp4"',
    );
    expect(html).toContain("Your browser does not support the video tag.");
  });

  it("renders the static placeholder for spatial media", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({
          data: {
            media: {
              ...media,
              url: "https://cdn/model.glb",
              fileExtension: "glb",
            } as Schemas["Media"],
          },
        })}
        ctx={ctx}
      />,
    );

    expect(html).toContain('id="icons-default-placeholder"');
    expect(html).not.toContain("<img");
  });

  it("renders nothing without a media url", async () => {
    const html = await renderToHtml(
      <CmsElementImage
        content={imageSlot({
          data: { media: { ...media, url: "" } as Schemas["Media"] },
        })}
        ctx={ctx}
      />,
    );

    expect(html).toBe("");
  });
});

describe("CmsElementManufacturerLogo", () => {
  it("renders through CmsElementImage and keeps the layout props", async () => {
    const html = await renderToHtml(
      <CmsElementManufacturerLogo
        content={
          {
            ...imageSlot(),
            type: "manufacturer-logo",
          } as unknown as CmsElementManufacturerLogoContent
        }
        ctx={ctx}
        className="hidden"
      />,
    );

    expect(html).toContain(
      '<div class="cms-element-image self-stretch relative hidden"',
    );
    expect(html).toContain("<img");
  });
});
