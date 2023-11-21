import { useCmsMeta } from "./useCmsMeta";
import { describe, expect, it } from "vitest";
import LandingPageMock from "./mocks/LandingPage";

describe("composables - useCmsMeta", () => {
  const entity = LandingPageMock;
  it("should return title and meta tags", () => {
    // @ts-ignore - mock
    const { title, meta } = useCmsMeta(entity);

    expect(title.value).toEqual("Summer Giveaway");
    expect(meta.value).toEqual([
      { name: "keywords", content: "Landing page keywords" },
      { name: "description", content: "Landing page description" },
      { name: "title", content: "Landing page title" },
    ]);
  });
});
