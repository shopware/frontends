import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { NavigationPage } from "@/features/cms/components/NavigationPage";
import { buildHomeMetadata } from "@/platform/seo/routeMetadata";
import { readSalesChannelContext } from "@/platform/shopware/reads/context";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { renderToHtml } from "@/test/render";

import HomePage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));
vi.mock("@/features/cms/components/NavigationPage", () => ({
  NavigationPage: vi.fn(() => null),
}));
vi.mock("@/platform/seo/routeMetadata", () => ({
  buildHomeMetadata: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/context", () => ({
  readSalesChannelContext: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

function props(query: Record<string, string> = {}) {
  return {
    params: Promise.resolve({ locale: "pl-PL" }),
    searchParams: Promise.resolve(query),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(resolveLanguageId).mockResolvedValue("language-pl");
  vi.mocked(readSalesChannelContext).mockResolvedValue({
    salesChannel: { navigationCategoryId: "root" },
  } as unknown as Schemas["SalesChannelContext"]);
});

describe("HomePage", () => {
  it("renders the root category with the listing query of the URL", async () => {
    await renderToHtml(
      <HomePage {...props({ p: "2", order: "price-asc", limit: "30" })} />,
    );

    expect(vi.mocked(NavigationPage).mock.calls[0]?.[0]).toEqual({
      navigationId: "root",
      searchParams: { p: "2", order: "price-asc", limit: "30" },
      locale: "pl-PL",
      languageId: "language-pl",
      isHome: true,
    });
  });

  it("builds the home metadata with the listing page", async () => {
    vi.mocked(buildHomeMetadata).mockResolvedValue({ title: "Sklep" });

    await expect(generateMetadata(props({ p: "3" }))).resolves.toEqual({
      title: "Sklep",
    });
    expect(buildHomeMetadata).toHaveBeenCalledExactlyOnceWith({
      locale: "pl-PL",
      languageId: "language-pl",
      page: "3",
    });
  });

  it("falls back to the layout metadata when a read fails", async () => {
    vi.mocked(buildHomeMetadata).mockRejectedValue(new Error("offline"));

    await expect(generateMetadata(props())).resolves.toEqual({});
  });
});
