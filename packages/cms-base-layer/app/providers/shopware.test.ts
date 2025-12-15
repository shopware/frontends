import type { ImageCTX } from "@nuxt/image";
import { describe, expect, it } from "vitest";
import shopwareProvider from "./shopware";

describe("Shopware Image Provider", () => {
  const provider = shopwareProvider();
  const mockContext: ImageCTX = {
    options: {},
  } as ImageCTX;

  describe("basic functionality", () => {
    it("should return original URL when no modifiers are provided", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg",
        { modifiers: {} },
        mockContext,
      );
      expect(result.url).toBe("https://example.com/image.jpg");
    });

    it("should add width modifier to URL", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe("https://example.com/image.jpg?width=800");
    });

    it("should add height modifier to URL", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg",
        { modifiers: { height: 600 } },
        mockContext,
      );
      expect(result.url).toBe("https://example.com/image.jpg?height=600");
    });

    it("should add multiple modifiers to URL", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg",
        {
          modifiers: {
            width: 800,
            height: 600,
            quality: 90,
            format: "webp",
            fit: "cover",
          },
        },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/image.jpg?width=800&height=600&quality=90&format=webp&fit=cover",
      );
    });
  });

  describe("existing query parameters", () => {
    it("should append modifiers to existing query parameters", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg?ts=123456",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/image.jpg?ts=123456&width=800",
      );
    });

    it("should handle multiple existing query parameters", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg?ts=123456&v=2",
        { modifiers: { width: 800, format: "webp" } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/image.jpg?ts=123456&v=2&width=800&format=webp",
      );
    });
  });

  describe("special characters in URL", () => {
    it("should encode commas in pathname", () => {
      const result = provider.getImage(
        "https://example.com/path/image, test.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/path/image%2C%20test.jpg?width=800",
      );
    });

    it("should encode spaces in pathname", () => {
      const result = provider.getImage(
        "https://example.com/path/image test.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/path/image%20test.jpg?width=800",
      );
    });

    it("should encode special characters in filename", () => {
      const result = provider.getImage(
        "https://cdn.shopware.store/media/ChatGPT Image 2 gru 2025, 14_08_58.png",
        { modifiers: { height: 300, format: "webp" } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://cdn.shopware.store/media/ChatGPT%20Image%202%20gru%202025%2C%2014_08_58.png?height=300&format=webp",
      );
    });

    it("should handle already encoded URLs correctly", () => {
      const result = provider.getImage(
        "https://example.com/path/image%20test.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/path/image%20test.jpg?width=800",
      );
    });

    it("should encode parentheses in pathname", () => {
      const result = provider.getImage(
        "https://example.com/path/image (1).jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/path/image%20(1).jpg?width=800",
      );
    });
  });

  describe("edge cases", () => {
    it("should handle relative URLs gracefully", () => {
      const result = provider.getImage(
        "/media/image.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      // Relative URLs cannot be parsed as URL objects, so they are returned as-is with modifiers
      expect(result.url).toBe("/media/image.jpg?width=800");
    });

    it("should preserve existing query parameters with special characters", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg?ts=123456&key=value",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/image.jpg?ts=123456&key=value&width=800",
      );
    });

    it("should handle URLs with fragments", () => {
      const result = provider.getImage(
        "https://example.com/image.jpg#section",
        { modifiers: { width: 800 } },
        mockContext,
      );
      // Note: URL constructor places hash after query params
      expect(result.url).toBe(
        "https://example.com/image.jpg#section?width=800",
      );
    });

    it("should not double-encode already encoded characters", () => {
      const result = provider.getImage(
        "https://example.com/path/image%2Ctest.jpg",
        { modifiers: { width: 800 } },
        mockContext,
      );
      expect(result.url).toBe(
        "https://example.com/path/image%2Ctest.jpg?width=800",
      );
    });
  });

  describe("Shopware CDN URLs", () => {
    it("should handle Shopware CDN URLs with existing query parameters", () => {
      const result = provider.getImage(
        "https://cdn.shopware.store/a/B/m/pPkDE/media/51/69/bf/1764680961/image.png?width=280&ts=1764680961",
        {
          modifiers: { height: 300, format: "webp", quality: 90, fit: "cover" },
        },
        mockContext,
      );
      expect(result.url).toBe(
        "https://cdn.shopware.store/a/B/m/pPkDE/media/51/69/bf/1764680961/image.png?width=280&ts=1764680961&height=300&quality=90&format=webp&fit=cover",
      );
    });

    it("should properly encode commas in Shopware CDN URLs", () => {
      const result = provider.getImage(
        "https://cdn.shopware.store/a/B/m/pPkDE/media/51/69/bf/1764680961/ChatGPT Image 2 gru 2025, 14_08_58.png?width=280&ts=1764680961",
        {
          modifiers: { height: 300, format: "webp", quality: 90, fit: "cover" },
        },
        mockContext,
      );
      expect(result.url).toBe(
        "https://cdn.shopware.store/a/B/m/pPkDE/media/51/69/bf/1764680961/ChatGPT%20Image%202%20gru%202025%2C%2014_08_58.png?width=280&ts=1764680961&height=300&quality=90&format=webp&fit=cover",
      );
    });
  });
});
