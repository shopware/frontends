import { describe, expect, it } from "vitest";
import { createApp } from "vue";
import { useCms } from "./useCms";

export function withSetup(composable: any) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      // eslint-disable-next-line
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  // return the result and the app instance
  // for testing provide / unmount
  return [result, app];
}

describe("useCms", () => {
  it("should be defined", () => {
    expect(useCms).toBeDefined();
  });

  it("should fail without context", () => {
    expect(() => withSetup(useCms)).toThrowError();
  });
});
