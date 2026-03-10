import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { phpDto } from "../../src/commands/phpDto";

function collectPhpFiles(dir: string, base?: string): string[] {
  const root = base ?? dir;
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectPhpFiles(fullPath, root));
    } else if (entry.endsWith(".php")) {
      results.push(relative(root, fullPath));
    }
  }
  return results;
}

const TEST_OUTPUT_DIR = resolve(__dirname, "test-output-phpDto");
const TEST_CONFIG_DIR = resolve(__dirname, "test-output-phpDto-configs");
const FIXTURE_SCHEMA = resolve(__dirname, "fixtures/simpleSchema.json");

let configCounter = 0;
function writeConfig(overrides: Record<string, unknown> = {}): string {
  mkdirSync(TEST_CONFIG_DIR, { recursive: true });
  const configPath = resolve(TEST_CONFIG_DIR, `config-${configCounter++}.json`);
  const config = { schemaUrl: "http://unused.test/schema.json", ...overrides };
  writeFileSync(configPath, JSON.stringify(config), "utf-8");
  return configPath;
}

describe("phpDto command", () => {
  beforeAll(() => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
  });

  it("generate: creates PHP files in output directory with DTO/ for components", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    expect(existsSync(outputDir)).toBe(true);

    const files = collectPhpFiles(outputDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain("DTO/CartDTO.php");
    expect(files).toContain("SendContactMailRequestDTO.php");

    const cartContent = readFileSync(
      resolve(outputDir, "DTO/CartDTO.php"),
      "utf-8",
    );
    expect(cartContent).toContain("class CartDTO");
    expect(cartContent).toContain("<?php declare(strict_types=1);");
  });

  it("generate: with namespace adds namespace to files", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate-ns");
    const configPath = writeConfig({
      outputDir,
      namespace: "App\\DTO",
    });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    const cartContent = readFileSync(
      resolve(outputDir, "DTO/CartDTO.php"),
      "utf-8",
    );
    expect(cartContent).toContain("namespace App\\DTO\\DTO;");
  });

  it("generate: cleans output directory on re-run", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate-clean");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    writeFileSync(resolve(outputDir, "StaleDTO.php"), "<?php // stale");

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    expect(existsSync(resolve(outputDir, "StaleDTO.php"))).toBe(false);
  });

  it("check: succeeds when files match", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-pass");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await phpDto({
      action: "check",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("check: fails when files are missing", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-missing");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    rmSync(resolve(outputDir, "DTO/CartDTO.php"));

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        config: configPath,
        schemaFile: FIXTURE_SCHEMA,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("check: fails when content differs", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-diff");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    writeFileSync(resolve(outputDir, "DTO/CartDTO.php"), "<?php // modified");

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        config: configPath,
        schemaFile: FIXTURE_SCHEMA,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("check: fails when extra files exist", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-extra");
    const configPath = writeConfig({ outputDir });

    await phpDto({
      action: "generate",
      config: configPath,
      schemaFile: FIXTURE_SCHEMA,
    });

    writeFileSync(resolve(outputDir, "ExtraDTO.php"), "<?php // extra");

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        config: configPath,
        schemaFile: FIXTURE_SCHEMA,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("throws when schema file does not exist", async () => {
    const configPath = writeConfig();

    await expect(
      phpDto({
        action: "generate",
        config: configPath,
        schemaFile: "/nonexistent/schema.json",
      }),
    ).rejects.toThrow("Schema file not found");
  });

  it("throws when config file does not exist", async () => {
    await expect(
      phpDto({
        action: "generate",
        config: "/nonexistent/config.json",
        schemaFile: FIXTURE_SCHEMA,
      }),
    ).rejects.toThrow("Config file not found");
  });

  describe("name handling", () => {
    const INVALID_SCHEMA = resolve(__dirname, "fixtures/invalidNames.json");

    it("default: converts hyphenated names to PascalCase", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-pascal");
      const configPath = writeConfig({ outputDir });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: INVALID_SCHEMA,
      });

      const files = collectPhpFiles(outputDir);
      expect(files).toContain("DTO/SimpleProductDTO.php");
      expect(files).toContain("ApiInfoRequestDTO.php");
      expect(files).not.toContain("DTO/Simple-ProductDTO.php");
      expect(files).not.toContain("Api-infoRequestDTO.php");

      const content = readFileSync(
        resolve(outputDir, "DTO/SimpleProductDTO.php"),
        "utf-8",
      );
      expect(content).toContain("class SimpleProductDTO");
    });

    it("default: uppercases lowercase names in both file and class", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-lowercase");
      const configPath = writeConfig({ outputDir });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: INVALID_SCHEMA,
      });

      const files = collectPhpFiles(outputDir);
      expect(files).toContain("DTO/ErrorDTO.php");
      expect(files).not.toContain("DTO/errorDTO.php");

      const content = readFileSync(
        resolve(outputDir, "DTO/ErrorDTO.php"),
        "utf-8",
      );
      expect(content).toContain("class ErrorDTO");
      expect(content).not.toContain("class errorDTO");
    });

    it("default: updates $ref type references to renamed DTOs", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-pascal-refs");
      const configPath = writeConfig({ outputDir });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: INVALID_SCHEMA,
      });

      const content = readFileSync(
        resolve(outputDir, "DTO/ErrorResponseDTO.php"),
        "utf-8",
      );
      expect(content).toContain("class ErrorResponseDTO");
      expect(content).toContain("@var list<ErrorDTO>");
      expect(content).not.toContain("errorDTO");
    });

    it("rawNames: throws listing invalid class names", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-error");
      const configPath = writeConfig({ outputDir });

      await expect(
        phpDto({
          action: "generate",
          config: configPath,
          schemaFile: INVALID_SCHEMA,
          rawNames: true,
        }),
      ).rejects.toThrow("Invalid PHP class names found");
    });

    it("rawNames: includes all invalid names in error message", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-error-list");
      const configPath = writeConfig({ outputDir });

      try {
        await phpDto({
          action: "generate",
          config: configPath,
          schemaFile: INVALID_SCHEMA,
          rawNames: true,
        });
        expect.unreachable("should have thrown");
      } catch (err) {
        const message = (err as Error).message;
        expect(message).toContain("Simple-ProductDTO");
        expect(message).toContain("Api-infoRequestDTO");
        expect(message).toContain("--rawNames");
      }
    });

    it("rawNames: passes for schemas with valid names", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "name-error-valid");
      const configPath = writeConfig({ outputDir });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: FIXTURE_SCHEMA,
        rawNames: true,
      });

      expect(existsSync(outputDir)).toBe(true);
    });
  });

  describe("tag filtering", () => {
    const TAG_SCHEMA = resolve(__dirname, "fixtures/tagSchema.json");

    it("generates only DTOs for the specified tag and its dependencies", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "tag-cart");
      const configPath = writeConfig({ outputDir, tag: "Cart" });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: TAG_SCHEMA,
      });

      const files = collectPhpFiles(outputDir);

      expect(files).toContain("DTO/CartDTO.php");
      expect(files).toContain("DTO/LineItemDTO.php");
      expect(files).toContain("DTO/ProductDTO.php");
      expect(files).toContain("DTO/MediaDTO.php");
      expect(files).toContain("AddLineItemRequestDTO.php");

      expect(files).not.toContain("DTO/CategoryDTO.php");
      expect(files).not.toContain("ReadCategoriesResponseDTO.php");
    });

    it("without tag generates all DTOs", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "tag-none");
      const configPath = writeConfig({ outputDir });

      await phpDto({
        action: "generate",
        config: configPath,
        schemaFile: TAG_SCHEMA,
      });

      const files = collectPhpFiles(outputDir);

      expect(files).toContain("DTO/CartDTO.php");
      expect(files).toContain("DTO/CategoryDTO.php");
      expect(files).toContain("DTO/ProductDTO.php");
      expect(files).toContain("ReadCategoriesResponseDTO.php");
    });

    it("with non-matching tag produces no DTOs", async () => {
      const outputDir = resolve(TEST_OUTPUT_DIR, "tag-empty");
      const configPath = writeConfig({
        outputDir,
        tag: "NonExistent",
      });

      await expect(
        phpDto({
          action: "generate",
          config: configPath,
          schemaFile: TAG_SCHEMA,
        }),
      ).resolves.toBeUndefined();
    });
  });
});
