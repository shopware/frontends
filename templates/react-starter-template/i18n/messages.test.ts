import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import { locales } from "./config";
import type { Locale } from "./config";
import { deepMerge, mergeMessageFiles } from "./merge";
import { getMessages } from "./messages";

const I18N_DIR = fileURLToPath(new URL(".", import.meta.url));

const VUE_FILE_ORDER = [
  "checkout",
  "validations",
  "loginForm",
  "account",
  "form",
  "errors",
  "layout",
  "listing",
  "wishlist",
  "product",
  "search",
  "cart",
  "newsletter",
];

const REACT_AREAS = ["core", "layout", "account", "checkout"];

function readJson(...segments: string[]): Record<string, unknown> {
  return JSON.parse(readFileSync(join(I18N_DIR, ...segments), "utf8"));
}

function leafKeys(tree: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? leafKeys(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe("deepMerge", () => {
  it("merges nested trees and lets the override win on leaves", () => {
    expect(
      deepMerge(
        { a: { b: "base", c: "kept" }, d: "base" },
        { a: { b: "override", e: "added" }, f: "added" },
      ),
    ).toEqual({
      a: { b: "override", c: "kept", e: "added" },
      d: "base",
      f: "added",
    });
  });

  it("replaces a leaf with a tree and a tree with a leaf", () => {
    expect(
      deepMerge({ a: "leaf", b: { c: "x" } }, { a: { c: "y" }, b: "z" }),
    ).toEqual({ a: { c: "y" }, b: "z" });
  });

  it("does not change its inputs", () => {
    const base = { a: { b: "base" } };
    const override = { a: { c: "override" } };

    deepMerge(base, override);

    expect(base).toEqual({ a: { b: "base" } });
    expect(override).toEqual({ a: { c: "override" } });
  });

  it("merges files in order, later files winning", () => {
    expect(
      mergeMessageFiles([{ a: { b: "1" } }, { a: { b: "2", c: "3" } }, {}]),
    ).toEqual({ a: { b: "2", c: "3" } });
  });
});

describe("getMessages", () => {
  it.each(locales)(
    "holds the Vue %s files merged in the order of the Vue en-GB.ts, then the react files",
    (locale: Locale) => {
      const vue = mergeMessageFiles(
        VUE_FILE_ORDER.map((name) => readJson(locale, `${name}.json`)),
      );
      const react = mergeMessageFiles(
        REACT_AREAS.map((name) => readJson(locale, "react", `${name}.json`)),
      );
      const own = deepMerge(vue, react);
      const expected =
        locale === "en-GB"
          ? own
          : deepMerge(getMessages("en-GB") as Record<string, unknown>, own);

      expect(getMessages(locale)).toEqual(expected);
    },
  );

  it("ships exactly the 13 Vue files and the four react area files per locale", () => {
    for (const locale of locales) {
      expect(
        readdirSync(join(I18N_DIR, locale))
          .filter((name) => name.endsWith(".json"))
          .sort(),
      ).toEqual(VUE_FILE_ORDER.map((name) => `${name}.json`).sort());
      expect(readdirSync(join(I18N_DIR, locale, "react")).sort()).toEqual(
        REACT_AREAS.map((name) => `${name}.json`).sort(),
      );
    }
  });

  it("returns the same object on every call", () => {
    expect(getMessages("pl-PL")).toBe(getMessages("pl-PL"));
  });

  it("translates the Vue keys per locale", () => {
    expect(getMessages("en-GB")).toMatchObject({
      loginForm: { submitButtonLabel: "Sign in" },
    });
    expect(getMessages("de-DE")).toMatchObject({
      loginForm: { submitButtonLabel: "Anmelden" },
    });
    expect(getMessages("pl-PL")).toMatchObject({
      loginForm: { submitButtonLabel: "Zaloguj się" },
    });
  });

  it("falls back to en-GB for keys a locale lacks", () => {
    const english = getMessages("en-GB") as {
      errors: Record<string, string>;
    };
    for (const locale of ["pl-PL", "de-DE"] as const) {
      const localized = getMessages(locale) as {
        errors: Record<string, string>;
      };
      expect(readJson(locale, "errors.json")).not.toHaveProperty([
        "errors",
        "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE",
      ]);
      expect(localized.errors["VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE"]).toBe(
        english.errors["VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE"],
      );
    }
  });

  it("gives every locale every en-GB key", () => {
    const english = leafKeys(getMessages("en-GB"));
    for (const locale of locales) {
      expect(leafKeys(getMessages(locale))).toEqual(
        expect.arrayContaining(english),
      );
    }
  });

  it("lets a react area file override a Vue key and add new ones", async () => {
    vi.resetModules();
    vi.doMock("./en-GB/react/core.json", () => ({
      default: {
        loginForm: { submitButtonLabel: "Log in" },
        react: { only: "React only" },
      },
    }));
    const { getMessages: getMockedMessages } = await import("./messages");

    expect(getMockedMessages("en-GB")).toMatchObject({
      loginForm: {
        submitButtonLabel: "Log in",
        passwordLabel: "Password",
      },
      react: { only: "React only" },
    });
    expect(getMockedMessages("pl-PL")).toMatchObject({
      loginForm: { submitButtonLabel: "Zaloguj się" },
      react: { only: "React only" },
    });

    vi.doUnmock("./en-GB/react/core.json");
    vi.resetModules();
  });
});
