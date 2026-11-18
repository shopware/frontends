import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  CallExpression,
  Expression,
  NoSubstitutionTemplateLiteral,
  Node,
  PropertyAssignment,
  SourceFile,
  StringLiteral,
} from "typescript/unstable/ast";
import {
  isCallExpression,
  isConditionalExpression,
  isExportDeclaration,
  isExternalModuleReference,
  isIdentifier,
  isImportDeclaration,
  isLiteralTypeNode,
  isNoSubstitutionTemplateLiteral,
  isParenthesizedExpression,
  isPropertyAssignment,
  isStringLiteral,
} from "typescript/unstable/ast/is";
import { API } from "typescript/unstable/sync";
import { describe, expect, it } from "vitest";

import { locales } from "./config";
import { getMessages } from "./messages";
import { createTranslator, hasTranslation } from "./translate";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const I18N_DIR = join(ROOT, "i18n");
const SOURCE_DIRS = ["app", "features", "components", "platform", "i18n"];
const ROOT_FILES = ["proxy.ts"];
const SKIPPED_FILE = /\.(test|fixture)\.tsx?$|\.d\.ts$/;
const TRANSLATE_CALLEES = new Set(["t", "translate"]);
const TRANSLATOR_FACTORIES = new Set(["getTranslator", "useTranslations"]);
const KEY_SHAPE = /^[A-Za-z][\w-]*(\.[\w-]+)+$/;
const REACT_AREAS = [
  "core",
  "layout",
  "account",
  "checkout",
  "search",
  "variants",
  "forms",
  "emailLinks",
  "recovery",
  "cart",
  "checkoutExtras",
  "accountExtras",
];
const PLACEHOLDER = /\{\s*(\w+)\s*\}/g;

type KeyUse = { key: string; at: string; fromCall: boolean };

function sourceFiles(): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return /\.tsx?$/.test(entry.name) && !SKIPPED_FILE.test(entry.name)
        ? [path]
        : [];
    });
  return [
    ...SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir))),
    ...ROOT_FILES.map((file) => join(ROOT, file)),
  ];
}

function literalTexts(node: Expression): string[] {
  if (isStringLiteral(node) || isNoSubstitutionTemplateLiteral(node)) {
    return [node.text];
  }
  if (isParenthesizedExpression(node)) return literalTexts(node.expression);
  if (isConditionalExpression(node)) {
    return [...literalTexts(node.whenTrue), ...literalTexts(node.whenFalse)];
  }
  return [];
}

function isTranslateCall(node: CallExpression): boolean {
  const callee = node.expression;
  if (isIdentifier(callee)) return TRANSLATE_CALLEES.has(callee.text);
  return (
    isCallExpression(callee) &&
    isIdentifier(callee.expression) &&
    TRANSLATOR_FACTORIES.has(callee.expression.text)
  );
}

function isKeyProperty(
  node: Node,
  source: SourceFile,
): node is PropertyAssignment & {
  initializer: StringLiteral | NoSubstitutionTemplateLiteral;
} {
  return (
    isPropertyAssignment(node) &&
    node.name.getText(source).endsWith("Key") &&
    (isStringLiteral(node.initializer) ||
      isNoSubstitutionTemplateLiteral(node.initializer)) &&
    KEY_SHAPE.test(node.initializer.text)
  );
}

function isModuleSpecifier(node: Node): boolean {
  const { parent } = node;
  return (
    isImportDeclaration(parent) ||
    isExportDeclaration(parent) ||
    isExternalModuleReference(parent) ||
    isLiteralTypeNode(parent)
  );
}

function collectKeyUses(namespaces: Set<string>): KeyUse[] {
  const uses: KeyUse[] = [];
  const api = new API({ cwd: ROOT });
  try {
    const tsconfig = join(ROOT, "tsconfig.json");
    const { program } = api
      .updateSnapshot({ openProjects: [tsconfig] })
      .getProject(tsconfig)!;
    for (const file of sourceFiles()) {
      const source = program.getSourceFile(file);
      if (!source)
        throw new Error(`${relative(ROOT, file)} is not in the program`);
      const at = (node: Node) =>
        `${relative(ROOT, file)}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`;
      const visit = (node: Node) => {
        if (
          isCallExpression(node) &&
          isTranslateCall(node) &&
          node.arguments[0]
        ) {
          for (const key of literalTexts(node.arguments[0])) {
            uses.push({ key, at: at(node), fromCall: true });
          }
        } else if (isKeyProperty(node, source)) {
          uses.push({
            key: node.initializer.text,
            at: at(node),
            fromCall: false,
          });
        } else if (
          (isStringLiteral(node) || isNoSubstitutionTemplateLiteral(node)) &&
          !isModuleSpecifier(node) &&
          KEY_SHAPE.test(node.text) &&
          namespaces.has(node.text.split(".", 1)[0] ?? "")
        ) {
          uses.push({ key: node.text, at: at(node), fromCall: false });
        }
        node.forEachChild(visit);
      };
      visit(source);
    }
  } finally {
    api.close();
  }
  return uses;
}

function readJson(...segments: string[]): Record<string, unknown> {
  return JSON.parse(readFileSync(join(I18N_DIR, ...segments), "utf8"));
}

function leaves(
  tree: Record<string, unknown>,
  prefix = "",
): Array<[string, unknown]> {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? leaves(value as Record<string, unknown>, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value] as [string, unknown]],
  );
}

function placeholders(message: string): string[] {
  return [...new Set([...message.matchAll(PLACEHOLDER)].map((m) => m[1]))]
    .filter((name): name is string => name !== undefined)
    .sort();
}

describe("message keys used in code", () => {
  const english = getMessages("en-GB");
  const uses = collectKeyUses(new Set(Object.keys(english)));

  it("finds the translate calls of the template", () => {
    expect(uses.filter(({ fromCall }) => fromCall).length).toBeGreaterThan(300);
    expect(uses.map(({ key }) => key)).toEqual(
      expect.arrayContaining([
        "account.menu.overview",
        "search.suggest.status",
        "account.address.edit.header",
        "checkout.orderUnpaid",
        "layout.ariaLabels.mainContent",
        "cms.noLayout.category",
      ]),
    );
  });

  it("resolves every literal key to an en-GB message", () => {
    const translate = createTranslator("en-GB", english);
    const missing = new Set(
      uses
        .filter(({ key }) => !hasTranslation(translate, key))
        .map(({ key, at }) => `${at} ${key}`),
    );

    expect([...missing]).toEqual([]);
  });
});

describe("merged catalogs", () => {
  const english = new Map(leaves(getMessages("en-GB")));

  it.each(locales)(
    "keeps the en-GB placeholders in every %s message",
    (locale) => {
      for (const [key, message] of leaves(getMessages(locale))) {
        expect(placeholders(String(message)), `${locale} ${key}`).toEqual(
          placeholders(String(english.get(key))),
        );
      }
    },
  );
});

describe.each(REACT_AREAS)("react/%s.json", (area) => {
  const english = new Map(leaves(readJson("en-GB", "react", `${area}.json`)));

  it.each(locales)("has exactly the en-GB keys in %s", (locale) => {
    const localized = new Map(
      leaves(readJson(locale, "react", `${area}.json`)),
    );

    expect([...localized.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it.each(locales)(
    "holds non-empty messages with the en-GB placeholders in %s",
    (locale) => {
      const localized = leaves(readJson(locale, "react", `${area}.json`));
      for (const [key, message] of localized) {
        expect(typeof message, `${locale} ${key}`).toBe("string");
        expect((message as string).trim(), `${locale} ${key}`).not.toBe("");
        expect(placeholders(message as string), `${locale} ${key}`).toEqual(
          placeholders(String(english.get(key))),
        );
      }
    },
  );
});
