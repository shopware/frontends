import { describe, it, expect } from "vitest";
import parserPrescriber from "./parserPrescriber";

describe("parserPrescriber", () => {
  it('should return undefined when key is "$ref" and value is "_DELETE_"', () => {
    const result = parserPrescriber("$ref", "_DELETE_");
    expect(result).toBeUndefined();
  });

  it('should return the value when key is not "$ref"', () => {
    const result = parserPrescriber("someKey", "someValue");
    expect(result).toBe("someValue");
  });

  it('should return the value when value is not "_DELETE_"', () => {
    const result = parserPrescriber("$ref", "someOtherValue");
    expect(result).toBe("someOtherValue");
  });

  it('should return the value when key is not "$ref" and value is "_DELETE_"', () => {
    const result = parserPrescriber("someKey", "_DELETE_");
    expect(result).toBe("_DELETE_");
  });
});
