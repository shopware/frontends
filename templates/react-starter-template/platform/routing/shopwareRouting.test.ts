import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClientError } from "@/features/session/session.fixture";
import { createShopwareClient } from "@/platform/shopware/client";

vi.mock("server-only", () => ({}));
vi.mock("@/platform/shopware/client", () => ({
  createShopwareClient: vi.fn(),
}));

const MAINTENANCE = apiClientError(
  [{ code: "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE", status: "503" }],
  503,
);

const invoke = vi.fn();

async function loadRouting() {
  vi.resetModules();
  return import("./shopwareRouting");
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("shopwareRouting", () => {
  it("looks SEO paths up with a client in the locale's language", async () => {
    invoke.mockResolvedValue({ data: { elements: [] } });
    const { seoResolver } = await loadRouting();

    await seoResolver.resolve("/Meble/", "language-pl");

    expect(createShopwareClient).toHaveBeenCalledWith({
      languageId: "language-pl",
    });
    expect(invoke.mock.calls[0]?.[0]).toBe("readSeoUrlGet get /seo-url");
  });

  it("maps the locale to the language read from the Store API", async () => {
    invoke.mockResolvedValue({
      data: {
        elements: [{ id: "language-pl", translationCode: { code: "pl-PL" } }],
      },
    });
    const { resolveProxyLanguageId } = await loadRouting();

    await expect(resolveProxyLanguageId("pl-PL")).resolves.toEqual({
      status: "resolved",
      languageId: "language-pl",
    });
    expect(invoke.mock.calls[0]?.[0]).toBe("readLanguagesGet get /language");
  });

  it("probes the context and recognises maintenance", async () => {
    invoke.mockRejectedValue(MAINTENANCE);
    const { maintenanceMonitor } = await loadRouting();

    await expect(maintenanceMonitor.isActive()).resolves.toBe(true);
    expect(invoke.mock.calls[0]?.[0]).toBe("readContext get /context");
  });

  it("treats other probe failures as open", async () => {
    invoke.mockRejectedValue(new Error("offline"));
    const { maintenanceMonitor } = await loadRouting();

    await expect(maintenanceMonitor.isActive()).resolves.toBe(false);
  });

  it("lets a live lookup that hits maintenance switch the monitor on", async () => {
    invoke.mockImplementation(async (operation: string) => {
      if (operation === "readContext get /context") return { data: {} };
      throw MAINTENANCE;
    });
    const { maintenanceMonitor, seoResolver } = await loadRouting();
    await expect(maintenanceMonitor.isActive()).resolves.toBe(false);

    await expect(seoResolver.resolve("/Meble/", null)).resolves.toEqual({
      type: "maintenance",
    });

    await expect(maintenanceMonitor.isActive()).resolves.toBe(true);
  });
});
