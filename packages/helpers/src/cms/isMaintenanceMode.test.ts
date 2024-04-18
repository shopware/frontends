import { describe, expect, it } from "vitest";
import { isMaintenanceMode } from "./index";

describe("isMaintenanceMode", () => {
  it("should return true", () => {
    expect(
      isMaintenanceMode([
        {
          status: "503",
          code: "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE",
          title: "Service Unavailable",
          detail: "The sales channel is in maintenance mode.",
          meta: { parameters: [] },
        },
      ]),
    ).toBe(true);
  });

  it("should return false", () => {
    expect(
      isMaintenanceMode([
        {
          status: "404",
          code: "test",
          title: "Not Found",
        },
      ]),
    ).toBe(false);
  });
});
