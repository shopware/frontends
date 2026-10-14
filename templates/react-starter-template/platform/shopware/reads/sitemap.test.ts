import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "../client";
import { readSitemapFile, readSitemapFiles } from "./sitemap";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

const FILE_PATH =
  "salesChannel-0123456789abcdef0123456789abcdef-fedcba9876543210fedcba9876543210/0123456789abcdef0123456789abcdef-11111111111111111111111111111111-sitemap-shop-test-1.xml.gz";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("readSitemapFiles", () => {
  it("lists the files of the language and caches the list under the sitemap tags", async () => {
    const files = [
      { filename: `https://shop.test/sitemap/${FILE_PATH}`, created: "x" },
    ];
    invoke.mockResolvedValue({ data: files, status: 200 });

    await expect(readSitemapFiles("l1")).resolves.toEqual(files);

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: "l1",
    });
    expect(invoke).toHaveBeenCalledExactlyOnceWith("readSitemap get /sitemap");
    expect(cacheLife).toHaveBeenCalledExactlyOnceWith("seo");
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith(
      "sw:sitemap",
      "sw:sitemap:l1",
    );
  });

  it("gives no files for an answer that is not a list", async () => {
    invoke.mockResolvedValue({ data: undefined, status: 204 });

    await expect(readSitemapFiles("l1")).resolves.toEqual([]);
  });

  it("lets a failed read throw, so the failure is not cached", async () => {
    invoke.mockRejectedValue(new Error("offline"));

    await expect(readSitemapFiles("l1")).rejects.toThrow("offline");
  });
});

describe("readSitemapFile", () => {
  it("reads the file in its language with the path unencoded and returns its bytes", async () => {
    invoke.mockResolvedValue({
      data: new Blob([new Uint8Array([0x1f, 0x8b, 8])]),
      status: 200,
    });

    const body = await readSitemapFile(FILE_PATH, "l1");

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith({
      languageId: "l1",
    });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(
      "getSitemapFile get /sitemap/{filePath}",
      { accept: "application/gzip", pathParams: { filePath: FILE_PATH } },
    );
    expect(body && [...new Uint8Array(body)]).toEqual([0x1f, 0x8b, 8]);
    expect(cacheLife).not.toHaveBeenCalled();
  });

  it("gives nothing for the 204 of a file that is not the language's", async () => {
    invoke.mockResolvedValue({ data: undefined, status: 204 });

    await expect(readSitemapFile(FILE_PATH, "l1")).resolves.toBeNull();
  });

  it("gives nothing for an answer that is not a file", async () => {
    invoke.mockResolvedValue({ data: { apiAlias: "x" }, status: 200 });

    await expect(readSitemapFile(FILE_PATH, "l1")).resolves.toBeNull();
  });
});
