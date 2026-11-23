import { describe, expect, it } from "vitest";

import {
  getInitialVariantSelection,
  getVariantHref,
  orderVariantSelection,
} from "./variantOptionGroups";
import type { SwVariantOptionGroup } from "./variantOptionGroups";

const optionGroups: SwVariantOptionGroup[] = [
  {
    id: "group-color",
    name: "Color",
    options: [
      { id: "option-red", name: "Red" },
      { id: "option-blue", name: "Blue" },
    ],
  },
  {
    id: "group-size",
    name: "Size",
    options: [
      { id: "option-small", name: "S" },
      { id: "option-large", name: "L" },
    ],
  },
];

describe("getInitialVariantSelection", () => {
  it("maps each option id to its group and drops ids of no group", () => {
    expect(
      getInitialVariantSelection(optionGroups, [
        "option-large",
        "option-unknown",
        "option-red",
      ]),
    ).toEqual({ "group-size": "option-large", "group-color": "option-red" });
    expect(getInitialVariantSelection(optionGroups, [])).toEqual({});
  });
});

describe("orderVariantSelection", () => {
  it("lists the selection in configurator group order", () => {
    const ordered = orderVariantSelection(optionGroups, {
      "group-size": "option-large",
      "group-color": "option-blue",
    });

    expect(Object.entries(ordered)).toEqual([
      ["group-color", "option-blue"],
      ["group-size", "option-large"],
    ]);
  });

  it("skips groups without a choice and keys of no group", () => {
    expect(
      Object.entries(
        orderVariantSelection(optionGroups, {
          "group-material": "option-cotton",
          "group-size": "option-small",
        }),
      ),
    ).toEqual([["group-size", "option-small"]]);
  });
});

describe("getVariantHref", () => {
  it("prefixes the variant's internal path with the locale", () => {
    expect(
      getVariantHref(
        { productId: "variant-1", url: "/Shirt/SW10001.2" },
        "de-DE",
      ),
    ).toBe("/de-DE/Shirt/SW10001.2");
    expect(
      getVariantHref({ productId: "variant-1", url: "/Shirt/SW10001.2" }, ""),
    ).toBe("/Shirt/SW10001.2");
  });

  it("opens the technical path without a url", () => {
    expect(getVariantHref({ productId: "variant-1" }, "de-DE")).toBe(
      "/de-DE/detail/variant-1",
    );
    expect(getVariantHref({ productId: "variant-1" }, "")).toBe(
      "/detail/variant-1",
    );
  });

  it.each([
    ["an absolute URL", "https://evil.example/Shirt"],
    ["a protocol-relative URL", "//evil.example/Shirt"],
    ["a backslash", "/\\evil.example/Shirt"],
    ["a control character", "/Shirt\u0007/SW10001.2"],
    ["no leading slash", "javascript:alert(1)"],
    ["an empty url", ""],
  ])("opens the technical path for %s", (_name, url) => {
    expect(getVariantHref({ productId: "variant-1", url }, "")).toBe(
      "/detail/variant-1",
    );
  });
});
