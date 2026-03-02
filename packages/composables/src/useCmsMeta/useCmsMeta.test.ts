import { describe, expect, it } from "vitest";
import type { Schemas } from "#shopware";
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

  it("should return empty meta when no keywords, description or title", () => {
    const entity = {
      translated: {},
      name: "Entity Name",
    } as Schemas["Category"];
    const { vm } = useSetup(() => useCmsMeta(entity));

    expect(vm.title).toEqual("Entity Name");
    expect(vm.meta).toEqual([]);
  });

  it("should return partial meta when only some fields present", () => {
    const entity = {
      translated: {
        metaDescription: "Only description",
      },
      name: "Entity Name",
    } as Schemas["Category"];
    const { vm } = useSetup(() => useCmsMeta(entity));

    expect(vm.meta).toEqual([
      { name: "description", content: "Only description" },
    ]);
  });
});
