import { describe, expect, it } from "vitest";

import { getTextElementContent } from "./getTextElementContent";

const element = (
  source: "static" | "mapped",
  value: string,
  data: { content: string | null } | null,
) => ({ config: { content: { source, value } }, data });

describe("getTextElementContent", () => {
  it("renders the content the backend resolved", () => {
    expect(
      getTextElementContent(
        element("static", "<p>{{ category.name }}</p>", {
          content: "<p>Clothing</p>",
        }),
      ),
    ).toBe("<p>Clothing</p>");
    expect(
      getTextElementContent(
        element("mapped", "category.name", { content: "Clothing" }),
      ),
    ).toBe("Clothing");
  });

  it("does not fall back to the unsanitized config when the backend sanitized the content away", () => {
    expect(
      getTextElementContent(
        element("static", "<script>alert(1)</script>", { content: "" }),
      ),
    ).toBe("");
  });

  it("does not render a placeholder that resolved to nothing", () => {
    expect(
      getTextElementContent(
        element("static", "{{ category.description }}", { content: "" }),
      ),
    ).toBe("");
    expect(
      getTextElementContent(
        element("static", "{{ category.description }}", { content: null }),
      ),
    ).toBe("");
  });

  it("does not render a mapping path", () => {
    expect(
      getTextElementContent(
        element("mapped", "category.name", { content: null }),
      ),
    ).toBe("");
    expect(
      getTextElementContent(
        element("mapped", "category.customFields", {
          content: "category.customFields",
        }),
      ),
    ).toBe("");
  });

  it("renders static config for an element without data", () => {
    expect(getTextElementContent(element("static", "<p>Hi</p>", null))).toBe(
      "<p>Hi</p>",
    );
    expect(
      getTextElementContent(element("mapped", "category.name", null)),
    ).toBe("");
  });

  it("renders nothing for a missing element or config", () => {
    expect(getTextElementContent(undefined)).toBe("");
    expect(getTextElementContent({ config: null, data: null })).toBe("");
    expect(getTextElementContent({ data: { content: "<p>x</p>" } })).toBe(
      "<p>x</p>",
    );
  });
});
