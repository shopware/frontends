import { beforeEach, describe, expect, it, vi } from "vitest";

import { getOptionsFromNode, isSafeUrl } from "./getOptionsFromNode";
import type { NodeObject } from "./getOptionsFromNode";

describe("getOptionsFromNode", () => {
  const consoleErrorSpy = vi.spyOn(console, "error");
  const urlResolverMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy.mockImplementation(() => {});
    urlResolverMock.mockImplementation((url) => `resolved-url${url}`);
  });

  it("should return empty object if node is undefined", () => {
    const options = getOptionsFromNode(
      undefined as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should return options object with style, classNames, and align", () => {
    const node = {
      attrs: {
        style: "color: red",
        class: "my-class",
        align: "center",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      style: "color: red",
      class: "my-class",
      align: "center",
      attrs: {},
    });
  });

  it("should return options object without style, classNames, and align if they are not present in node.attrs", () => {
    const node = {
      attrs: {},
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should return empty object when no attrs in node", () => {
    const node = {
      attrs: undefined,
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options).toEqual({
      attrs: {},
    });
  });

  it("should resolve URL if attrs.href exists", () => {
    const node = {
      attrs: {
        href: "/path/to/page",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs.href).toEqual("resolved-url/path/to/page");
  });

  it('should add additional attrs to "attrs" object', () => {
    const node = {
      attrs: {
        href: "/path/to/page",
        "data-test": "test",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs.href).toEqual("resolved-url/path/to/page");
    expect(options.attrs["data-test"]).toEqual("test");
  });

  it("should show console error if something went wrong", () => {
    const node = {
      attrs: {
        href: "/path/to/page",
      },
    };

    const consoleErrorSpy = vi.spyOn(console, "error");

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      undefined as unknown as (url: string) => string,
    );

    expect(options).toEqual({
      attrs: {},
    });
    expect(consoleErrorSpy).toBeCalled();
  });

  it("decodes entities in attribute values so Vue escapes them only once", () => {
    const node = {
      attrs: {
        href: "/x?a=1&amp;b=2",
        title: "Tom &amp; Jerry",
        class: "a&#x20;b",
        style: "font-family:&quot;Inter&quot;",
      },
    };

    const options = getOptionsFromNode(
      node as unknown as NodeObject,
      (url) => url,
    );

    expect(options.attrs.href).toBe("/x?a=1&b=2");
    expect(options.attrs.title).toBe("Tom & Jerry");
    expect(options.class).toBe("a b");
    expect(options.style).toBe('font-family:"Inter"');
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "javascript&colon;alert(1)",
    "java&Tab;script:alert(1)",
    "java&NewLine;script:alert(1)",
    "java&#9;script:alert(1)",
    "java&#x0A;script:alert(1)",
    "&#x20;&#x01;javascript:alert(1)",
    "&#106;avascript&#58;alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
  ])("drops an unsafe href after decoding (%s)", (href) => {
    const options = getOptionsFromNode(
      { attrs: { href } } as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs).not.toHaveProperty("href");
    expect(urlResolverMock).not.toHaveBeenCalled();
  });

  it("drops unsafe URLs in other URL attributes", () => {
    const options = getOptionsFromNode(
      {
        attrs: {
          src: "javascript&colon;alert(1)",
          poster: "java&Tab;script:alert(1)",
          alt: "kept",
        },
      } as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs).toEqual({ alt: "kept" });
  });

  it("keeps a raster data: image in src", () => {
    const src = "data:image/png;base64,iVBORw0KGgo=";
    const options = getOptionsFromNode(
      { attrs: { src } } as unknown as NodeObject,
      urlResolverMock,
    );

    expect(options.attrs.src).toBe(src);
  });

  it("isSafeUrl accepts ordinary URLs", () => {
    for (const url of [
      "/path",
      "https://example.com/?a=1&b=2",
      "mailto:a@b.c",
      "tel:+123",
      "#anchor",
      "relative/javascript:x",
    ]) {
      expect(isSafeUrl(url)).toBe(true);
    }
  });
});
