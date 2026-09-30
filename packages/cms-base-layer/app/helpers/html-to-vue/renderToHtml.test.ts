import { describe, expect, it } from "vitest";
import { h } from "vue";

import { renderHtml } from "./renderToHtml";

describe("renderHtml", () => {
  const resolveUrl = (url: string) => url;

  const render = (
    html: string,
    config: Parameters<typeof renderHtml>[1] = {},
  ) => renderHtml(html, config, h, null, resolveUrl);

  it("wraps the content in a plain div by default", () => {
    const vnode = render("<p>content</p>");

    expect(vnode.type).toBe("div");
    expect(vnode.props?.class).toBeUndefined();
  });

  it("applies container.class to the wrapper element", () => {
    const vnode = render("<h1>headline</h1>", {
      container: { type: "div", class: "cms-element-text" },
    });

    expect(vnode.props?.class).toBe("cms-element-text");
  });

  it("honours a custom container type", () => {
    const vnode = render("<p>content</p>", {
      container: { type: "section", class: "cms-element-text" },
    });

    expect(vnode.type).toBe("section");
  });

  it("does not leak container.class into later renders", () => {
    render("<p>scoped</p>", {
      container: { type: "div", class: "cms-element-text" },
    });

    const vnode = render("<p>unscoped</p>");

    expect(vnode.props?.class).toBeUndefined();
  });

  it("keeps rendering the parsed children next to the container class", () => {
    const vnode = render("<h2>headline</h2>", {
      container: { type: "div", class: "cms-element-text" },
    });

    expect(Array.isArray(vnode.children)).toBe(true);
    expect((vnode.children as { type: string }[])[0]?.type).toBe("h2");
  });
});
