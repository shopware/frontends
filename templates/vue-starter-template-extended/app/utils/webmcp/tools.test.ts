import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { webMcpLabels, webMcpTools } from "./tools";

type Schema = { properties?: Record<string, { description?: string }> };

describe("webMcpTools", () => {
  it("stays inside Chrome's character budgets", () => {
    for (const tool of webMcpTools) {
      expect(tool.name.length).toBeLessThanOrEqual(30);
      expect(tool.description.length).toBeLessThanOrEqual(500);
      const { properties = {} } = tool.inputSchema as Schema;
      for (const [name, { description = "" }] of Object.entries(properties)) {
        expect(name.length).toBeLessThanOrEqual(30);
        expect(description.length).toBeLessThanOrEqual(150);
      }
    }
  });

  it("marks only the tools that change nothing as read-only", () => {
    const readOnly = webMcpTools
      .filter((tool) => "annotations" in tool && tool.annotations.readOnlyHint)
      .map(({ name }) => name);
    expect(readOnly).toEqual(["get_product", "get_cart"]);
  });

  it("declares the answer shape of the tools whose ids feed later calls", () => {
    const withShape = webMcpTools.filter((tool) => "outputSchema" in tool);
    expect(withShape.map(({ name }) => name)).toEqual([
      "search_products",
      "browse_category",
      "get_cart",
    ]);
    for (const tool of withShape) {
      expect(tool.outputSchema.anyOf).toContainEqual({ required: ["error"] });
    }
  });
});

describe("webMcpLabels", () => {
  it("uses the English tool titles by default", () => {
    const labels = webMcpLabels("en-GB");
    expect(labels.assistant).toBe("Assistant");
    for (const { name, title } of webMcpTools) expect(labels[name]).toBe(title);
    expect(webMcpLabels("")).toEqual(labels);
    expect(webMcpLabels("fr-FR")).toEqual(labels);
  });

  it("has every tool title in each language the shop ships", () => {
    const languages = readdirSync(
      new URL("../../../../vue-starter-template/i18n/", import.meta.url),
      { withFileTypes: true },
    )
      .map((entry) => (entry.isDirectory() ? entry.name : ""))
      .filter((name) => /^[a-z]{2}-[A-Z]{2}$/.test(name))
      .filter((name) => !name.startsWith("en"));
    expect(languages).toEqual(expect.arrayContaining(["de-DE", "pl-PL"]));
    for (const language of languages) {
      const labels = webMcpLabels(language);
      expect(labels.assistant).not.toBe("Assistant");
      for (const { name, title } of webMcpTools) {
        expect(labels[name]).toBeTruthy();
        expect(labels[name]).not.toBe(title);
      }
    }
    expect(webMcpLabels("DE").add_to_cart).toBe("Zum Warenkorb hinzufügen");
  });
});
