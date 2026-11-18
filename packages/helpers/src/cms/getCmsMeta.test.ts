import { describe, expect, it } from "vitest";

import { getCmsMeta } from "./getCmsMeta";

describe("getCmsMeta", () => {
  it("prefers translated values", () => {
    expect(
      getCmsMeta({
        name: "Name",
        metaTitle: "Meta title",
        translated: {
          name: "Translated name",
          metaTitle: "Translated meta title",
          metaDescription: "Translated description",
          keywords: "translated, keywords",
        },
      }),
    ).toEqual({
      title: "Translated name",
      metaTitle: "Translated meta title",
      metaDescription: "Translated description",
      keywords: "translated, keywords",
    });
  });

  it("falls back to untranslated values", () => {
    expect(
      getCmsMeta({
        name: "Name",
        metaDescription: "Description",
        translated: {},
      }),
    ).toEqual({
      title: "Name",
      metaTitle: "",
      metaDescription: "Description",
      keywords: "",
    });
  });

  it("returns empty strings when nothing is set", () => {
    expect(getCmsMeta({})).toEqual({
      title: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    });
  });
});
