import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { split } from "../src/commands/split";

const TEST_OUTPUT_DIR = resolve(__dirname, "test-output-split");

describe("split command", () => {
  beforeAll(() => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterAll(() => {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  it("should split schema by tags", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "tags");
    await split({
      outputDir,
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      splitBy: "tags",
    });

    const tag1File = resolve(outputDir, "tag1.json");
    const tag2File = resolve(outputDir, "tag2.json");

    expect(existsSync(tag1File)).toBe(true);
    expect(existsSync(tag2File)).toBe(true);

    const tag1Content = JSON.parse(readFileSync(tag1File, "utf-8"));
    const tag2Content = JSON.parse(readFileSync(tag2File, "utf-8"));

    expect(Object.keys(tag1Content.paths).sort()).toEqual(
      ["/path1", "/path3"].sort(),
    );
    expect(tag1Content.components.schemas).toHaveProperty("UsedComponent");
    expect(tag1Content.components.schemas).not.toHaveProperty(
      "UnusedComponent",
    );
    expect(Object.keys(tag2Content.paths).sort()).toEqual(
      ["/path2", "/path3"].sort(),
    );
  });

  it("should split schema by paths", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "paths");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      splitBy: "paths",
      outputDir,
    });

    const path1File = resolve(outputDir, "path1.json");
    const path2File = resolve(outputDir, "path2.json");
    const path3File = resolve(outputDir, "path3.json");

    expect(existsSync(path1File)).toBe(true);
    expect(existsSync(path2File)).toBe(true);
    expect(existsSync(path3File)).toBe(true);

    const path1Content = JSON.parse(readFileSync(path1File, "utf-8"));
    expect(path1Content.paths).toHaveProperty("/path1");
    expect(path1Content.paths["/path1"]).toHaveProperty("get");
    expect(path1Content.paths["/path1"]).not.toHaveProperty("post");
  });

  it("should filter by a single tag", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "tags-filtered");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      filterBy: "Tag1",
      splitBy: "tags",
      outputDir,
    });

    const tag1File = resolve(outputDir, "tag1.json");
    const tag2File = resolve(outputDir, "tag2.json");

    expect(existsSync(tag1File)).toBe(true);
    expect(existsSync(tag2File)).toBe(false);
  });

  it("should filter by a single tag case-insensitive", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "tags-case-insensitive");
    await split({
      outputDir,
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      filterBy: "tAg1",
      splitBy: "tags",
    });

    const tag1File = resolve(outputDir, "tag1.json");
    const tag2File = resolve(outputDir, "tag2.json");

    expect(existsSync(tag1File)).toBe(true);
    expect(existsSync(tag2File)).toBe(false);
  });

  it("should throw an error for invalid --list option", async () => {
    await expect(
      split({
        schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
        list: "invalid" as "tags" | "paths",
      }),
    ).rejects.toThrow("Invalid list option: invalid");
  });

  it("should throw an error for invalid --splitBy option", async () => {
    await expect(
      split({
        schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
        splitBy: "invalid" as "tags" | "paths",
      }),
    ).rejects.toThrow("Invalid splitBy option: invalid");
  });

  it("should throw an error if schemaFile is missing", async () => {
    await expect(
      split({
        schemaFile: "",
        splitBy: "tags",
      }),
    ).rejects.toThrow("Schema file not found: ");
  });

  it("should list all tags in lowercase and comma-separated", async () => {
    const spy = vi.spyOn(console, "log");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      list: "tags",
    });
    expect(spy).toHaveBeenCalledWith('"tag1", "tag2"');
    spy.mockRestore();
  });

  it("should list all paths in a comma-separated line", async () => {
    const spy = vi.spyOn(console, "log");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      list: "paths",
    });
    expect(spy).toHaveBeenCalledWith('"/path1", "/path2", "/path3"');
    spy.mockRestore();
  });

  it("should use default options for splitBy and outputDir", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "defaults");
    rmSync(outputDir, { recursive: true, force: true });
    mkdirSync(outputDir, { recursive: true });
    const originalCwd = process.cwd();
    process.chdir(outputDir);

    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      filterBy: "tag1",
    });

    const tag1File = resolve(outputDir, "tag1.json");
    expect(existsSync(tag1File)).toBe(true);
    const tag2File = resolve(outputDir, "tag2.json");
    expect(existsSync(tag2File)).toBe(false);
    process.chdir(originalCwd);
  });

  it("should show verbose linting output", async () => {
    const spy = vi.spyOn(console, "error");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      verboseLinting: true,
      outputDir: resolve(TEST_OUTPUT_DIR, "verbose"),
    });
    expect(spy).toHaveBeenCalledWith("Details:", expect.any(Array));
    spy.mockRestore();
  });

  it("should filter by a single path", async () => {
    const outputDir = resolve(TEST_OUTPUT_DIR, "paths-single");
    await split({
      schemaFile: resolve(__dirname, "api-types/splitTestSchema.json"),
      filterBy: "/path1",
      splitBy: "paths",
      outputDir,
    });

    const path1File = resolve(outputDir, "path1.json");
    const path2File = resolve(outputDir, "path2.json");

    expect(existsSync(path1File)).toBe(true);
    expect(existsSync(path2File)).toBe(false);
  });
});
