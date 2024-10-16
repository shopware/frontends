import { describe, it, expect, vi } from "vitest";
import jsonParse from "./jsonParser";
import json5 from "json5";
import * as prescribe from "./parserPrescriber";

vi.spyOn(json5, "parse");
const prescribeSpy = vi.spyOn(prescribe, "default");
vi.mock("json5", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("json5")>()),
    parse: function () {},
  };
});

describe("jsonParse", () => {
  it("should call json5.parse with the correct arguments", () => {
    const someJsonFileContent = `{"project":"shopware"}`;
    jsonParse(someJsonFileContent);
    expect(json5.parse).toHaveBeenCalledWith(
      someJsonFileContent,
      expect.any(Function),
    );
    expect(prescribeSpy).toBeCalledWith("project", "shopware");
  });
});
