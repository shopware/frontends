import { afterEach, describe, expect, it, vi } from "vitest";

import { getMessages } from "./messages";
import { createTranslator, hasTranslation } from "./translate";
import type { Translate } from "./translate";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const messages = {
  greeting: "Hello {name}!",
  spaced: "Hello { name }!",
  order: "Order #{0} from {1}",
  counter: "{n} items, {count} in total",
  nested: { deeper: { leaf: "Leaf" } },
  plural2: "item | items",
  plural3: "zero-or-few | few | many",
  pluralCount: "{count} result | {count} results",
  "flat.key": "Flat key",
};

describe("createTranslator messages", () => {
  const t = createTranslator("en-GB", messages);

  it("resolves dotted paths in the nested messages", () => {
    expect(t("nested.deeper.leaf")).toBe("Leaf");
  });

  it("falls back to a flat key that contains dots", () => {
    expect(t("flat.key")).toBe("Flat key");
  });

  it("fills named parameters, also with spaces inside the braces", () => {
    expect(t("greeting", { name: "Jane" })).toBe("Hello Jane!");
    expect(t("spaced", { name: "Jane" })).toBe("Hello Jane!");
  });

  it("renders a missing, null or undefined named parameter as empty, like vue-i18n", () => {
    expect(t("greeting")).toBe("Hello !");
    expect(t("greeting", { name: null })).toBe("Hello !");
    expect(t("greeting", { name: undefined })).toBe("Hello !");
  });

  it("fills list parameters from an array", () => {
    expect(t("order", ["10042", "Berlin"])).toBe("Order #10042 from Berlin");
  });

  it("formats numbers as strings", () => {
    expect(t("greeting", { name: 42 })).toBe("Hello 42!");
    expect(t("order", [7, 8])).toBe("Order #7 from 8");
  });

  it("exposes the count as {n} and {count} unless they are given as params", () => {
    expect(t("counter", {}, 3)).toBe("3 items, 3 in total");
    expect(t("counter", { n: "few", count: 9 }, 3)).toBe(
      "few items, 9 in total",
    );
    expect(t("counter", ["x"], 4)).toBe("4 items, 4 in total");
  });

  it("does not treat inherited object keys as messages", () => {
    expect(hasTranslation(t, "constructor")).toBe(false);
    expect(hasTranslation(t, "nested.constructor")).toBe(false);
    expect(hasTranslation(t, "greeting.length")).toBe(false);
  });

  it("does not resolve a namespace as a message", () => {
    expect(hasTranslation(t, "nested.deeper")).toBe(false);
    expect(t("nested.deeper")).toBe("nested.deeper");
  });
});

describe("createTranslator plurals", () => {
  it("uses the last form when no count is given", () => {
    const t = createTranslator("en-GB", messages);
    expect(t("plural2")).toBe("items");
    expect(t("plural3")).toBe("many");
  });

  it.each([
    [0, "results"],
    [1, "result"],
    [2, "results"],
    [5, "results"],
    [22, "results"],
  ])("selects the English form for %i", (count, expected) => {
    const t = createTranslator("en-GB", getMessages("en-GB"));
    expect(t("search.result", undefined, count)).toBe(expected);
  });

  it.each([
    [0, "Ergebnisse"],
    [1, "Ergebnis"],
    [2, "Ergebnisse"],
    [5, "Ergebnisse"],
    [22, "Ergebnisse"],
  ])("selects the German form for %i", (count, expected) => {
    const t = createTranslator("de-DE", getMessages("de-DE"));
    expect(t("search.result", undefined, count)).toBe(expected);
  });

  it.each([
    [0, "wyników"],
    [1, "wynik"],
    [2, "wyniki"],
    [4, "wyniki"],
    [5, "wyników"],
    [12, "wyników"],
    [22, "wyniki"],
    [25, "wyników"],
  ])(
    "selects the Polish form for %i with Intl.PluralRules",
    (count, expected) => {
      const t = createTranslator("pl-PL", getMessages("pl-PL"));
      expect(t("search.result", undefined, count)).toBe(expected);
    },
  );

  it("maps two forms to one and other in every locale", () => {
    const t = createTranslator("pl-PL", messages);
    expect(t("plural2", undefined, 1)).toBe("item");
    expect(t("plural2", undefined, 2)).toBe("items");
    expect(t("plural2", undefined, 5)).toBe("items");
  });

  it("interpolates the count into the selected form", () => {
    const t = createTranslator("en-GB", messages);
    expect(t("pluralCount", undefined, 1)).toBe("1 result");
    expect(t("pluralCount", undefined, 0)).toBe("0 results");
  });
});

describe("createTranslator fallback", () => {
  it("falls back to the en-GB message for a key the locale does not have", () => {
    const t = createTranslator("pl-PL", { search: { result: "wynik" } });
    expect(t("loginForm.submitButtonLabel")).toBe("Sign in");
    expect(t("search.result")).toBe("wynik");
  });

  it("returns the key for a message that en-GB lacks too", () => {
    const t = createTranslator("de-DE", getMessages("de-DE"));
    expect(t("does.not.exist")).toBe("does.not.exist");
  });

  it("warns once per missing key in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslator("en-GB", {});

    t("missing.development.key");
    t("missing.development.key");
    createTranslator("pl-PL", {})("missing.development.key");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      '[i18n] No message for "missing.development.key" in en-GB.',
    );
  });

  it("does not warn outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createTranslator("en-GB", {})("missing.production.key");

    expect(warn).not.toHaveBeenCalled();
  });
});

describe("hasTranslation", () => {
  it("checks the locale messages and the en-GB fallback without warning", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = createTranslator("pl-PL", { only: { polish: "tak" } });

    expect(hasTranslation(t, "only.polish")).toBe(true);
    expect(hasTranslation(t, "errors.message-default")).toBe(true);
    expect(hasTranslation(t, "errors.0")).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("compares the result with the key for a translator it did not create", () => {
    const t: Translate = (key) => (key === "known" ? "Known" : key);

    expect(hasTranslation(t, "known")).toBe(true);
    expect(hasTranslation(t, "unknown")).toBe(false);
  });
});

describe("createTranslator fallback plural rules", () => {
  afterEach(() => {
    vi.doUnmock("./en-GB/en-GB");
    vi.resetModules();
  });

  it("uses the English plural rules for an English fallback message", async () => {
    vi.resetModules();
    vi.doMock("./en-GB/en-GB", () => ({ default: { tri: "a | b | c" } }));
    const { createTranslator: createWithFallback } =
      await import("./translate");
    const t = createWithFallback("pl-PL", {});

    expect(t("tri", undefined, 1)).toBe("a");
    expect(t("tri", undefined, 2)).toBe("c");
    expect(t("tri", undefined, 22)).toBe("c");
  });
});
