import { describe, expect, it } from "vitest";
import { getCmsBreadcrumbs } from "./getCmsBreadcrumbs";

describe("getCmsBreadcrumbs", () => {
  it("should return translated name", () => {
    expect(
      getCmsBreadcrumbs({
        translated: {
          name: "translated name",
        },
      }),
    ).toEqual([{ name: "translated name" }]);
  });
});
