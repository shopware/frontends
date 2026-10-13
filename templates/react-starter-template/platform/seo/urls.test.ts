import { describe, expect, it } from "vitest";

import { absoluteUrl, pageQuery, seoPathFrom, technicalPath } from "./urls";

describe("seoPathFrom", () => {
  it("uses the first SEO URL with one leading slash and keeps its trailing slash", () => {
    expect(seoPathFrom([{ seoPathInfo: "Clothing/" }])).toBe("/Clothing/");
    expect(seoPathFrom([{}, { seoPathInfo: "/x" }])).toBe("/x");
    expect(seoPathFrom([{ seoPathInfo: "" }])).toBe("/");
    expect(seoPathFrom([])).toBeNull();
    expect(seoPathFrom(undefined)).toBeNull();
  });
});

describe("technicalPath", () => {
  it("builds the Shopware technical path", () => {
    expect(technicalPath("frontend.navigation.page", "a")).toBe(
      "/navigation/a",
    );
    expect(technicalPath("frontend.detail.page", "b")).toBe("/detail/b");
    expect(technicalPath("frontend.landing.page", "c")).toBe("/landingPage/c");
  });
});

describe("pageQuery", () => {
  it.each([
    ["2", "?p=2"],
    ["1", ""],
    ["0", ""],
    ["abc", ""],
    ["2.5", ""],
    [["3", "4"], "?p=3"],
    [undefined, ""],
  ])("%s gives %s", (page, query) => {
    expect(pageQuery(page)).toBe(query);
  });
});

describe("absoluteUrl", () => {
  it("joins the path onto the site and encodes it", () => {
    const site = new URL("https://shop.test");
    expect(absoluteUrl("/pl-PL/Möbel/?p=2", site)).toBe(
      "https://shop.test/pl-PL/M%C3%B6bel/?p=2",
    );
    expect(absoluteUrl("/x", null)).toBeNull();
  });
});
