import { describe, expect, it } from "vitest";
import { useCmsTranslations } from "./useCmsTranslations";
import { useCmsTranslate } from "./useCmsTranslations";
import { useSetup } from "./_test";

describe("useCmsTranslations", () => {
  it("injection", async () => {
    const { vm } = await useSetup(useCmsTranslations);
    expect(vm).toEqual({});
  });
});

describe("useCmsTranslate", () => {
  it("should replace placeholder with param value", async () => {
    const { vm } = await useSetup(useCmsTranslate);
    expect(vm.cmsT("Hello, {name}!", { name: "world" })).toBe("Hello, world!");
  });

  it("should return placeholder if param is missing", async () => {
    const { vm } = await useSetup(useCmsTranslate);
    expect(vm.cmsT("Hello, {name}!", {})).toBe("Hello, {name}!");
  });

  it("should return text without placeholder (params added)", async () => {
    const { vm } = await useSetup(useCmsTranslate);
    expect(vm.cmsT("Hello, world!", { name: "world" })).toBe("Hello, world!");
  });

  it("should return text without placeholder (params missing)", async () => {
    const { vm } = await useSetup(useCmsTranslate);
    expect(vm.cmsT("Hello, world!")).toBe("Hello, world!");
  });
});
