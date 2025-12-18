import { describe, expect, it } from "vitest";
import { encodeForQuery } from "./encodeForQuery";

describe("encodeForQuery", () => {
  it("should encode a simple object", () => {
    const obj = { name: "test", value: 123 };
    const result = encodeForQuery(obj);

    // Result should be a base64url encoded string
    expect(typeof result).toBe("string");
    expect(result).not.toContain("+");
    expect(result).not.toContain("/");
    expect(result).not.toContain("=");
  });

  it("should handle empty object", () => {
    const obj = {};
    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle null value", () => {
    const result = encodeForQuery(null);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle undefined value", () => {
    const result = encodeForQuery(undefined);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle complex nested object", () => {
    const obj = {
      criteria: {
        page: 1,
        limit: 10,
        filter: [
          {
            type: "equals",
            field: "active",
            value: true,
          },
          {
            type: "contains",
            field: "name",
            value: "test",
          },
        ],
        associations: {
          manufacturer: {},
          categories: {
            associations: {
              media: {},
            },
          },
        },
      },
    };

    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Should be base64url encoded
    expect(result).not.toContain("+");
    expect(result).not.toContain("/");
    expect(result).not.toContain("=");
  });

  it("should handle array values", () => {
    const obj = {
      ids: ["id1", "id2", "id3"],
      numbers: [1, 2, 3, 4, 5],
    };

    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle string values", () => {
    const obj = "simple string";
    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle boolean values", () => {
    const result1 = encodeForQuery(true);
    const result2 = encodeForQuery(false);

    expect(typeof result1).toBe("string");
    expect(typeof result2).toBe("string");
    expect(result1).not.toBe(result2);
  });

  it("should handle number values", () => {
    const result = encodeForQuery(12345);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should produce consistent results for same input", () => {
    const obj = { test: "value", number: 42 };
    const result1 = encodeForQuery(obj);
    const result2 = encodeForQuery(obj);

    expect(result1).toBe(result2);
  });

  it("should produce different results for different inputs", () => {
    const obj1 = { test: "value1" };
    const obj2 = { test: "value2" };
    const result1 = encodeForQuery(obj1);
    const result2 = encodeForQuery(obj2);

    expect(result1).not.toBe(result2);
  });

  it("should handle special characters in strings", () => {
    const obj = {
      text: "Special chars: äöü ßÄÖÜ 中文 🚀 @#$%^&*()",
      emoji: "🎉🎊🎈",
    };

    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should compress large objects efficiently", () => {
    // Create a large object with repetitive data that should compress well
    const largeObj = {
      items: Array(100)
        .fill(0)
        .map((_, i) => ({
          id: `item-${i}`,
          name: `Test Item ${i}`,
          description:
            "This is a test item with a long description that repeats many times",
          active: true,
          price: 99.99,
          category: "test-category",
        })),
    };

    const result = encodeForQuery(largeObj);
    const jsonString = JSON.stringify(largeObj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // The compressed result should be significantly smaller than the JSON string
    // Note: This is a rough estimate, actual compression ratio depends on the data
    expect(result.length).toBeLessThan(jsonString.length);
  });

  it("should handle date objects", () => {
    const obj = {
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date(),
    };

    const result = encodeForQuery(obj);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should be base64url compliant", () => {
    const obj = { test: "value with spaces and special chars: +/=" };
    const result = encodeForQuery(obj);

    // Base64url should not contain +, /, or = characters
    expect(result).not.toMatch(/[\+\/=]/);
    // Should only contain URL-safe characters
    expect(result).toMatch(/^[A-Za-z0-9_-]*$/);
  });
});
