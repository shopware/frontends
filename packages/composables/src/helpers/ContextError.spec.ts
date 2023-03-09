import { describe, expect, it } from "vitest";
import ContextError from "./ContextError";

describe("contextError", () => {
  it("should ContextError have been thrown with its own message", async () => {
    expect(() => {
      throw new ContextError("Error", "test");
    }).throw("Error test");

    expect(() => {
      throw new ContextError("Error", "test");
    }).toThrowError();
  });

  it("should ContextError have been thrown", async () => {
    expect(() => {
      throw new ContextError("Error");
    }).toThrowError();
  });
});
