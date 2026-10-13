import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { getMessages } from "@/i18n/messages";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";

import { createStorefrontCmsContext } from "./context";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(readSalesChannelContext).mockReset();
  vi.mocked(readSalesChannelContext).mockResolvedValue({
    currency: { isoCode: "PLN" },
    context: { taxState: "gross" },
    salesChannel: { navigationCategoryId: "root" },
  } as unknown as Schemas["SalesChannelContext"]);
});

describe("createStorefrontCmsContext", () => {
  it("reads the context in the page language and localizes the CMS links and labels", async () => {
    const ctx = await createStorefrontCmsContext({
      locale: "pl-PL",
      languageId: "language-pl",
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
    });

    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(
      "language-pl",
    );
    expect(ctx.locale).toBe("pl-PL");
    expect(ctx.urlPrefix).toBe("pl-PL");
    expect(ctx.translations).toBe(getMessages("pl-PL"));
    expect(ctx.currencyCode).toBe("PLN");
    expect(ctx.navigationCategoryId).toBe("root");
  });

  it("keeps the CMS links unprefixed for the default locale", async () => {
    const ctx = await createStorefrontCmsContext({
      locale: "en-GB",
      languageId: null,
      routeName: "frontend.navigation.page",
      foreignKey: "category-1",
    });

    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(null);
    expect(ctx.locale).toBe("en-GB");
    expect(ctx.urlPrefix).toBe("");
    expect(ctx.translations).toBe(getMessages("en-GB"));
  });

  it("reads the context while the navigation is still pending and puts the tree into ctx", async () => {
    const tree = [{ id: "category-1" }] as Schemas["Category"][];
    let resolveNavigation: (value: Schemas["Category"][]) => void = () => {};
    const navigation = new Promise<Schemas["Category"][]>((resolve) => {
      resolveNavigation = resolve;
    });

    const pending = createStorefrontCmsContext({
      locale: "en-GB",
      languageId: null,
      routeName: "frontend.detail.page",
      foreignKey: "product-1",
      navigation,
    });

    expect(readSalesChannelContext).toHaveBeenCalledExactlyOnceWith(null);
    resolveNavigation(tree);
    await expect(pending).resolves.toMatchObject({ navigation: tree });
  });
});
