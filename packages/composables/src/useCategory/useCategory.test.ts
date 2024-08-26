import { describe, expect, it } from "vitest";
import { useCategory } from "./useCategory";
import { useSetup } from "../_test";
import { ref } from "vue";
import type { Schemas } from "#shopware";

describe("useCategory", () => {
  it("empty category init", () => {
    const { vm } = useSetup(() =>
      useCategory(ref({ id: "1" } as Schemas["Category"])),
    );
    expect(vm.category).toStrictEqual({ id: "1" });
  });
});
