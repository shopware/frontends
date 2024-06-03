import { describe, bench, vi } from "vitest";
import { generate } from "../src/commands/generate";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import testSchema from "./api-types/testSchema.json";

vi.mock("node:fs", async () => {
  return {
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});
// TODO: mocking prettier for more acurate tests, but it should be replaced
vi.mock("prettier", async () => {
  return {
    format: vi.fn().mockImplementation((content) => content),
  };
});
vi.mocked(writeFileSync).mockReturnValue();
vi.mocked(existsSync).mockReturnValue(true);
vi.mocked(readFileSync).mockReturnValue(JSON.stringify(testSchema));
const consoleWarnSpy = vi.spyOn(console, "log");
consoleWarnSpy.mockImplementation(() => {});

describe("api-gen - generate", () => {
  bench("[api-gen][generate] - generate schema command", async () => {
    await generate({
      cwd: __dirname,
      filename: "testSchema.json",
      apiType: "store",
      debug: false,
    });
  });
});
