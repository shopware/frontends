import { describe, expect, it } from "vitest";
import { getCmsLayoutConfiguration } from "./getCmsLayoutConfiguration";

type FunctionParams = Parameters<typeof getCmsLayoutConfiguration>;

describe("Shopware helpers - getCmsLayoutConfiguration", () => {
  it("should return default layout configuration if content is null", () => {
    // @ts-expect-error type should be wrong here
    const content: FunctionParams[0] = null;
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: null,
      layoutStyles: {},
    });
  });

  it("should return default layout configuration if content is a CmsSlot", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_slot",
      // other properties of CmsSlot
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: null,
      layoutStyles: {},
    });
  });

  it("should return layout configuration with css classes and layout styles", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_block",
      cssClass: "my-class",
      backgroundColor: "#ffffff",
      backgroundMedia: {
        url: "https://example.com/image.jpg",
      },
      // other properties of CmsBlock or CmsSection
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {
        "my-class": true,
      },
      layoutStyles: {
        backgroundColor: "#ffffff",
        backgroundImage: 'url("https://example.com/image.jpg")',
      },
    });
  });

  it("should return layout configuration for cms_section", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_section",
      cssClass: "my-class",
      backgroundColor: "#ffffff",
      backgroundMedia: {
        url: "https://example.com/image.jpg",
      },
      // other properties of CmsBlock or CmsSection
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {
        "my-class": true,
      },
      layoutStyles: {
        backgroundColor: "#ffffff",
        backgroundImage: 'url("https://example.com/image.jpg")',
      },
    });
  });

  it("should return null image when no backgroundMedia is provided", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_block",
      cssClass: "my-class",
      backgroundColor: "#ffffff",
      backgroundMedia: null,
      // other properties of CmsBlock or CmsSection
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {
        "my-class": true,
      },
      layoutStyles: {
        backgroundColor: "#ffffff",
      },
    });
  });

  it("should return backgroundSize for cms_section", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_section",
      backgroundMediaMode: "cover",
      // other properties of CmsBlock or CmsSection
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {},
      layoutStyles: {
        backgroundSize: "cover",
      },
    });
  });

  it("should return marginBottom for cms_block", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_block",
      marginBottom: "10px",
      // other properties of CmsBlock or CmsSection
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {},
      layoutStyles: {
        marginBottom: "10px",
      },
    });
  });

  it("should add custom class and desktop-hidden class", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_block",
      cssClass: "my-class",
      visibility: {
        mobile: true,
        tablet: true,
        desktop: false,
      },
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {
        "my-class": true,
        "lg:hidden": true,
      },
      layoutStyles: {},
    });
  });

  it("should add sizingMode style", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_section",
      sizingMode: "boxed",
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {},
      layoutStyles: {
        sizingMode: "boxed",
      },
    });
  });

  it("should return all cms_block properties", () => {
    const content: FunctionParams[0] = {
      apiAlias: "cms_block",
      cssClass: "my-class",
      backgroundColor: "#ffffff",
      backgroundMedia: {
        url: "https://example.com/image.jpg",
      },
      backgroundMediaMode: "cover",
      sizingMode: "boxed",
      marginBottom: "10px",
      marginLeft: "10px",
      marginRight: "10px",
      marginTop: "10px",
    };
    const configuration = getCmsLayoutConfiguration(content);
    expect(configuration).toStrictEqual({
      cssClasses: {
        "my-class": true,
      },
      layoutStyles: {
        backgroundColor: "#ffffff",
        backgroundImage: 'url("https://example.com/image.jpg")',
        backgroundSize: "cover",
        sizingMode: "boxed",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
      },
    });
  });
});
