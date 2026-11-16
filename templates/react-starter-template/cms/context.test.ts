import { describe, expect, it } from "vitest";

import { createCmsContext, toClientContext } from "./context";
import { createCmsRegistry } from "./registry";

describe("createCmsContext", () => {
  it("fills in defaults and keeps the registry", () => {
    const registry = createCmsRegistry();
    const ctx = createCmsContext({ registry });

    expect(ctx.registry).toBe(registry);
    expect(ctx.urlPrefix).toBe("");
    expect(ctx.locale).toBe("en-GB");
    expect(ctx.currencyCode).toBe("EUR");
    expect(ctx.taxState).toBe("gross");
    expect(ctx.navigationCategoryId).toBeUndefined();
    expect(ctx.isLoggedIn).toBe(false);
    expect(ctx.isProductSearch).toBe(false);
    expect(ctx.slotCount).toBe(1);
    expect(ctx.imageSizes).toBe("(max-width: 768px) 100vw, 100vw");
    expect(ctx.config.imagePlaceholder.color).toBe("#543B95");
    expect(ctx.config.backgroundImage).toEqual({ format: "webp", quality: 90 });
    expect(ctx.translations).toEqual({});
  });

  it("merges a partial config over the defaults", () => {
    const ctx = createCmsContext({
      registry: createCmsRegistry(),
      config: {
        imagePlaceholder: { color: "#000000" },
        imageSizes: { 2: "50vw" },
      },
    });

    expect(ctx.config.imagePlaceholder.color).toBe("#000000");
    expect(ctx.config.imageSizes[2]).toBe("50vw");
    expect(ctx.config.imageSizes[1]).toBe("(max-width: 768px) 100vw, 100vw");
    expect(ctx.config.lcpImagePreload).toBe(false);
  });
});

describe("toClientContext", () => {
  it("drops everything a client component cannot receive", () => {
    const ctx = createCmsContext({
      registry: createCmsRegistry(),
      urlPrefix: "de-DE",
      product: { id: "p1" } as never,
      listing: { elements: [] } as never,
    });
    const client = toClientContext({ ...ctx, sectionLayout: "sidebar" });

    expect(client).not.toHaveProperty("registry");
    expect(client).not.toHaveProperty("product");
    expect(client).not.toHaveProperty("listing");
    expect(client.urlPrefix).toBe("de-DE");
    expect(client.sectionLayout).toBe("sidebar");
    expect(JSON.parse(JSON.stringify(client))).toEqual(client);
  });
});
