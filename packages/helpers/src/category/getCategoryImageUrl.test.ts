import { describe, expect, it } from "vitest";
import { getCategoryImageUrl } from "./getCategoryImageUrl";

describe("getCategoryImageUrl", () => {
  it("should return an empty string if the category is not provided", () => {
    // @ts-expect-error - intentionally passing undefined
    const imageUrl = getCategoryImageUrl(undefined);
    expect(imageUrl).toEqual("");
  });

  it("should return an empty string if the category does not have a media property", () => {
    const category = { type: "category" };
    const imageUrl = getCategoryImageUrl(category);
    expect(imageUrl).toEqual("");
  });

  it("should return the URL of the category's media if available", () => {
    const category = {
      type: "page",
      media: { url: "https://example.com/image.jpg" },
    };
    const imageUrl = getCategoryImageUrl(category);
    expect(imageUrl).toEqual("https://example.com/image.jpg");
  });

  it("should return empty string if curl is wrong", () => {
    const category = {
      type: "page",
      media: { url: undefined },
    };
    // @ts-expect-error - intentionally passing undefined
    const imageUrl = getCategoryImageUrl(category);
    expect(imageUrl).toEqual("");
  });
});
