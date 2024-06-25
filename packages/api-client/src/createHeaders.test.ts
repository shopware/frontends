import { describe, expect, it } from "vitest";
import { createHeaders } from "./defaultHeaders";

describe("createHeaders", () => {
  it("should create initial headers proxy", async () => {
    const headers = createHeaders({});
    expect(headers).toEqual({ "Content-Type": "application/json" });
  });

  it("should create proxi with initial data", async () => {
    const headers = createHeaders({ "Content-Type": "text/plain" });
    expect(headers).toEqual({ "Content-Type": "text/plain" });
  });

  it('should not allow to override "apply" method', async () => {
    const headers = createHeaders({});
    expect(() => {
      // @ts-expect-error should not allow to override apply method
      headers.apply = () => {};
    }).toThrowErrorMatchingInlineSnapshot(
      "[Error: Cannot override apply method]",
    );
  });

  it("should delete header if value is nullish", async () => {
    const headers = createHeaders({ "Content-Type": "text/plain" });
    headers.apply({ "Content-Type": "" });
    expect(headers).toEqual({});
  });
});
