import { describe, expect, it } from "vitest";
import { type ApiGenConfig, getApiTypeConfig } from "./jsonOverrideUtils";

describe("getApiTypeConfig", () => {
  it("should return empty object when config is null", () => {
    const result = getApiTypeConfig(null, "store");
    expect(result).toEqual({});
  });

  it("should return empty object when config has no relevant properties", () => {
    const config: ApiGenConfig = {};
    const result = getApiTypeConfig(config, "store");
    expect(result).toEqual({
      rules: undefined,
      patches: undefined,
    });
  });

  describe("store-api config", () => {
    it("should return store-api specific config when available", () => {
      const config: ApiGenConfig = {
        "store-api": {
          rules: ["COMPONENTS_API_ALIAS"],
          patches: ["custom-patch.json"],
        },
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["custom-patch.json"],
      });
    });

    it("should fallback to root-level config when store-api is not defined", () => {
      const config: ApiGenConfig = {
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
      });
    });

    it("should prefer store-api config over root-level config", () => {
      const config: ApiGenConfig = {
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
        "store-api": {
          rules: ["COMPONENTS_API_ALIAS"],
          patches: ["store-specific-patch.json"],
        },
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["store-specific-patch.json"],
      });
    });

    it("should fallback to root-level patches when store-api patches is not defined", () => {
      const config: ApiGenConfig = {
        patches: "root-patch.json",
        "store-api": {
          rules: ["COMPONENTS_API_ALIAS"],
        },
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
      });
    });

    it("should fallback to root-level rules when store-api rules is not defined", () => {
      const config: ApiGenConfig = {
        rules: ["COMPONENTS_API_ALIAS"],
        "store-api": {
          patches: ["store-patch.json"],
        },
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["store-patch.json"],
      });
    });
  });

  describe("admin-api config", () => {
    it("should return admin-api specific config when available", () => {
      const config: ApiGenConfig = {
        "admin-api": {
          rules: ["COMPONENTS_API_ALIAS"],
          patches: ["admin-patch.json"],
        },
      };
      const result = getApiTypeConfig(config, "admin");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["admin-patch.json"],
      });
    });

    it("should fallback to root-level config when admin-api is not defined", () => {
      const config: ApiGenConfig = {
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
      };
      const result = getApiTypeConfig(config, "admin");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
      });
    });

    it("should prefer admin-api config over root-level config", () => {
      const config: ApiGenConfig = {
        rules: ["COMPONENTS_API_ALIAS"],
        patches: "root-patch.json",
        "admin-api": {
          rules: ["COMPONENTS_API_ALIAS"],
          patches: ["admin-specific-patch.json"],
        },
      };
      const result = getApiTypeConfig(config, "admin");
      expect(result).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["admin-specific-patch.json"],
      });
    });
  });

  describe("mixed config scenarios", () => {
    it("should correctly separate store and admin configs", () => {
      const config: ApiGenConfig = {
        "store-api": {
          rules: ["COMPONENTS_API_ALIAS"],
          patches: ["store-patch.json"],
        },
        "admin-api": {
          patches: ["admin-patch.json"],
        },
      };

      const storeResult = getApiTypeConfig(config, "store");
      const adminResult = getApiTypeConfig(config, "admin");

      expect(storeResult).toEqual({
        rules: ["COMPONENTS_API_ALIAS"],
        patches: ["store-patch.json"],
      });
      expect(adminResult).toEqual({
        rules: undefined,
        patches: ["admin-patch.json"],
      });
    });

    it("should handle array of patches", () => {
      const config: ApiGenConfig = {
        "store-api": {
          patches: [
            "storeApiSchema.overrides.json",
            "storeApiSchema.b2b.overrides.json",
          ],
        },
      };
      const result = getApiTypeConfig(config, "store");
      expect(result).toEqual({
        rules: undefined,
        patches: [
          "storeApiSchema.overrides.json",
          "storeApiSchema.b2b.overrides.json",
        ],
      });
    });
  });
});
