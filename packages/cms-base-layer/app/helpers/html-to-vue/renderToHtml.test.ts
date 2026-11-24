import { decodeHTML } from "entities";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";

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

  it("passes the attributes of a tag as flat props", () => {
    const vnode = render(
      '<table><tr><td colspan="2" id="total" class="sum" style="color:red">1</td></tr></table>',
    );
    const table = (vnode.children as { children: unknown[] }[])[0];
    const row = table?.children[0] as { children: unknown[] };
    const cell = row.children[0] as { props: Record<string, unknown> };

    expect(cell.props).toEqual({
      colspan: "2",
      id: "total",
      class: "sum",
      style: "color:red",
    });
  });

  it("keeps rendering the parsed children next to the container class", () => {
    const vnode = render("<h2>headline</h2>", {
      container: { type: "div", class: "cms-element-text" },
    });

    expect(Array.isArray(vnode.children)).toBe(true);
    expect((vnode.children as { type: string }[])[0]?.type).toBe("h2");
  });

  describe("SSR escaping", () => {
    // Mirrors CmsElementText.vue: text nodes are entity-decoded before Vue
    // renders them, attributes are decoded by getOptionsFromNode.
    const renderSsr = async (html: string) => {
      const Component = defineComponent({
        setup: () => () =>
          renderHtml(
            html,
            {
              container: { type: "div", class: "cms-element-text" },
              textTransformer: (text: string) => decodeHTML(text),
            },
            h,
            null,
            resolveUrl,
          ),
      });
      const markup = await renderToString(h(Component));
      const container = document.createElement("div");
      container.innerHTML = markup;
      return { markup, container };
    };

    it("renders entity-escaped markup in a text slot as text, not as a script element", async () => {
      const { markup, container } = await renderSsr(
        "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
      );

      expect(markup).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(markup).not.toContain("<script");
      expect(container.querySelector("script")).toBeNull();
      expect(container.querySelector("p")?.textContent).toBe(
        "<script>alert(1)</script>",
      );
    });

    it("escapes an ampersand in an href exactly once", async () => {
      const { markup, container } = await renderSsr(
        '<p><a href="/x?a=1&amp;b=2">link</a></p>',
      );

      expect(markup).toContain('href="/x?a=1&amp;b=2"');
      expect(markup).not.toContain("&amp;amp;");
      expect(container.querySelector("a")?.getAttribute("href")).toBe(
        "/x?a=1&b=2",
      );
    });

    it.each([
      "javascript&colon;alert(1)",
      "java&Tab;script:alert(1)",
      "java&NewLine;script:alert(1)",
      "&#106;avascript:alert(1)",
      "&#x6A;avascript&#x3A;alert(1)",
    ])("drops an href that decodes to javascript: (%s)", async (href) => {
      const { container } = await renderSsr(
        `<p><a href="${href}">link</a></p>`,
      );

      expect(container.querySelector("a")?.hasAttribute("href")).toBe(false);
    });
  });
});
