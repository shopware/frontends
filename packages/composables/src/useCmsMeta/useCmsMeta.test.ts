import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import LandingPageMock from "../mocks/LandingPage";
import { useCmsMeta } from "./useCmsMeta";

describe("composables - useCmsMeta", () => {
  it("should return title and meta tags", () => {
    const { vm } = useSetup(() => useCmsMeta(LandingPageMock));

    expect(vm.title).toEqual("Summer Giveaway");
    expect(vm.meta).toEqual([
      { name: "keywords", content: "Landing page keywords" },
      { name: "description", content: "Landing page description" },
      { name: "title", content: "Landing page title" },
    ]);
  });
});
