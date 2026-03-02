import { describe, expect, it } from "vitest";
import { findFirstCmsImageUrl } from "../helpers/cms/findFirstCmsImageUrl";

type Sections = Parameters<typeof findFirstCmsImageUrl>[0];

function makeSection(overrides: Record<string, unknown> = {}) {
  return {
    id: "s1",
    position: 0,
    type: "default",
    sizingMode: "boxed",
    mobileBehavior: "wrap",
    visibility: {},
    ...overrides,
  } as Sections[number];
}

function makeBlock(overrides: Record<string, unknown> = {}) {
  return {
    id: "b1",
    position: 0,
    type: "image",
    sectionPosition: "main",
    marginTop: "0",
    marginBottom: "0",
    marginLeft: "0",
    marginRight: "0",
    visibility: {},
    ...overrides,
  };
}

describe("findFirstCmsImageUrl", () => {
  it("should return undefined for empty sections", () => {
    expect(findFirstCmsImageUrl([])).toBeUndefined();
  });

  it("should return undefined when no images exist", () => {
    const sections = [
      makeSection({ blocks: [makeBlock({ slots: [] })] }),
    ] as Sections;
    expect(findFirstCmsImageUrl(sections)).toBeUndefined();
  });

  it("should find a section background image", () => {
    const sections = [
      makeSection({
        backgroundMedia: {
          url: "https://cdn.example.com/section-bg.jpg",
          metaData: { width: 1920, height: 1080 },
        },
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toContain("cdn.example.com");
    expect(result).toContain("section-bg.jpg");
  });

  it("should find a block background image", () => {
    const sections = [
      makeSection({
        blocks: [
          makeBlock({
            backgroundMedia: {
              url: "https://cdn.example.com/block-bg.jpg",
              metaData: { width: 800, height: 600 },
            },
            slots: [],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toContain("cdn.example.com");
    expect(result).toContain("block-bg.jpg");
  });

  it("should find an image element media URL", () => {
    const sections = [
      makeSection({
        blocks: [
          makeBlock({
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "https://cdn.example.com/element.jpg" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toBe("https://cdn.example.com/element.jpg");
  });

  it("should apply format option to element media URL", () => {
    const sections = [
      makeSection({
        blocks: [
          makeBlock({
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "https://cdn.example.com/element.jpg" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections, { format: "webp" });
    expect(result).toBe("https://cdn.example.com/element.jpg?format=webp");
  });

  it("should apply format and quality options to element media URL", () => {
    const sections = [
      makeSection({
        blocks: [
          makeBlock({
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "https://cdn.example.com/element.jpg" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections, {
      format: "webp",
      quality: 85,
    });
    expect(result).toBe(
      "https://cdn.example.com/element.jpg?format=webp&quality=85",
    );
  });

  it("should prioritize section bg over block bg over element media", () => {
    const sections = [
      makeSection({
        backgroundMedia: {
          url: "https://cdn.example.com/section-bg.jpg",
          metaData: { width: 1920, height: 1080 },
        },
        blocks: [
          makeBlock({
            backgroundMedia: {
              url: "https://cdn.example.com/block-bg.jpg",
              metaData: { width: 800, height: 600 },
            },
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "https://cdn.example.com/element.jpg" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toContain("section-bg.jpg");
  });

  it("should skip sections without blocks and find next image", () => {
    const sections = [
      makeSection({}),
      makeSection({
        blocks: [
          makeBlock({
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "https://cdn.example.com/found.jpg" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toBe("https://cdn.example.com/found.jpg");
  });

  it("should handle invalid element media URLs gracefully", () => {
    const sections = [
      makeSection({
        blocks: [
          makeBlock({
            slots: [
              {
                id: "slot1",
                type: "image",
                slot: "content",
                data: {
                  media: { url: "not a valid url" },
                },
              },
            ],
          }),
        ],
      }),
    ] as Sections;
    const result = findFirstCmsImageUrl(sections);
    expect(result).toBe("not a valid url");
  });
});
