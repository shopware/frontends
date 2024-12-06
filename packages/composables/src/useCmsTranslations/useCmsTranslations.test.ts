import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { useCmsTranslations } from "./useCmsTranslations";

describe("useCmsTranslations", () => {
  it("injection", async () => {
    const { vm } = await useSetup(useCmsTranslations);
    expect(vm).toEqual({});
  });
});
