import { describe, expect, it } from "vitest";
import { createApp } from "vue";
import { useInternationalization } from "./useInternationalization";

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

describe("useInternationalization", () => {
  global.window = Object.create(window);
  const url = "http://frontend.test";
  Object.defineProperty(window, "location", {
    value: {
      origin: url,
    },
  });
  const { getStorefrontUrl } = useInternationalization();

  it("should be defined", () => {
    expect(useInternationalization).toBeDefined();
  });

  it("should return storefrontUrl", () => {
    expect(getStorefrontUrl()).toBe(url);
  });
});
