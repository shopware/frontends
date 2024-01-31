import { describe, bench, vi } from "vitest";
import { generate } from "../src/commands/generate";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import testSchema from "./testSchema.json";

vi.mock("node:fs", async () => {
  return {
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});
vi.mocked(writeFileSync).mockReturnValue();
vi.mocked(existsSync).mockReturnValue(true);
vi.mocked(readFileSync).mockReturnValue(JSON.stringify(testSchema));

describe("api-gen - generate", () => {
  bench("[api-gen][generate] - generate schema command", async () => {
    await generate({
      cwd: __dirname,
      filename: "testSchema.json",
    });
  });
});
