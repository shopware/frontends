import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { phpDto } from "../../src/commands/phpDto";

const TEST_OUTPUT_DIR = resolve(__dirname, "test-output-phpDto");
const FIXTURE_SCHEMA = resolve(__dirname, "fixtures/simpleSchema.json");

describe("phpDto command", () => {
  beforeAll(() => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  it("generate: creates PHP files in output directory", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    expect(existsSync(outputDir)).toBe(true);

    const files = readdirSync(outputDir).filter((f) => f.endsWith(".php"));
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain("CartDTO.php");
    expect(files).toContain("SendContactMailRequestDTO.php");

    const cartContent = readFileSync(
      resolve(outputDir, "CartDTO.php"),
      "utf-8",
    );
    expect(cartContent).toContain("class CartDTO");
    expect(cartContent).toContain("<?php declare(strict_types=1);");
  });

  it("generate: with namespace adds namespace to files", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate-ns");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
      namespace: "App\\DTO",
    });

    const cartContent = readFileSync(
      resolve(outputDir, "CartDTO.php"),
      "utf-8",
    );
    expect(cartContent).toContain("namespace App\\DTO;");
  });

  it("generate: cleans output directory on re-run", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "generate-clean");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    writeFileSync(resolve(outputDir, "stale.php"), "<?php // stale");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    expect(existsSync(resolve(outputDir, "stale.php"))).toBe(false);
  });

  it("check: succeeds when files match", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-pass");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await phpDto({
      action: "check",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("check: fails when files are missing", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-missing");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    rmSync(resolve(outputDir, "CartDTO.php"));

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        schemaFile: FIXTURE_SCHEMA,
        outputDir,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("check: fails when content differs", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-diff");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    writeFileSync(resolve(outputDir, "CartDTO.php"), "<?php // modified");

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        schemaFile: FIXTURE_SCHEMA,
        outputDir,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("check: fails when extra files exist", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "check-extra");

    await phpDto({
      action: "generate",
      schemaFile: FIXTURE_SCHEMA,
      outputDir,
    });

    writeFileSync(resolve(outputDir, "ExtraDTO.php"), "<?php // extra");

    const spy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await expect(
      phpDto({
        action: "check",
        schemaFile: FIXTURE_SCHEMA,
        outputDir,
      }),
    ).rejects.toThrow("process.exit called");

    expect(spy).toHaveBeenCalledWith(1);
    spy.mockRestore();
  });

  it("throws when schema file does not exist", async () => {
    await expect(
      phpDto({
        action: "generate",
        schemaFile: "/nonexistent/schema.json",
        outputDir: TEST_OUTPUT_DIR,
      }),
    ).rejects.toThrow("Schema file not found");
  });
});
