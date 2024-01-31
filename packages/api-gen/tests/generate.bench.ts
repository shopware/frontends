import { describe, bench } from "vitest";
import { generate } from "../src/commands/generate";

describe("api-gen - generate", () => {
  bench("[api-gen][generate] - generate schema command", async () => {
    await generate({
      cwd: __dirname,
      filename: "testSchema.json",
    });
  });
});
