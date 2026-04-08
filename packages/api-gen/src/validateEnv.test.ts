import { describe, expect, it } from "vitest";
import { validateAdminEnvVars } from "./validateEnv";

describe("validateAdminEnvVars", () => {
  it("should pass when both CLIENT_ID and CLIENT_SECRET are set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_ID: "my-integration",
      SHOPWARE_ADMIN_CLIENT_SECRET: "my-secret",
    });
    expect(result).toEqual([]);
  });

  it("should require CLIENT_ID when only CLIENT_SECRET is set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_SECRET: "my-secret",
    });
    expect(result).toEqual(["SHOPWARE_ADMIN_CLIENT_ID"]);
  });

  it("should require CLIENT_SECRET when only CLIENT_ID is set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_ID: "my-integration",
    });
    expect(result).toEqual(["SHOPWARE_ADMIN_CLIENT_SECRET"]);
  });

  it("should pass when username and password are set (password flow)", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_USERNAME: "admin",
      SHOPWARE_ADMIN_PASSWORD: "shopware",
    });
    expect(result).toEqual([]);
  });

  it("should require password when only username is set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_USERNAME: "admin",
    });
    expect(result).toEqual(["SHOPWARE_ADMIN_PASSWORD"]);
  });

  it("should require username when only password is set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_PASSWORD: "shopware",
    });
    expect(result).toEqual(["SHOPWARE_ADMIN_USERNAME"]);
  });

  it("should require both username and password when nothing is set", () => {
    const result = validateAdminEnvVars({});
    expect(result).toEqual([
      "SHOPWARE_ADMIN_USERNAME",
      "SHOPWARE_ADMIN_PASSWORD",
    ]);
  });

  it("should treat empty CLIENT_ID as unset and fall back to password flow", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_ID: "",
      SHOPWARE_ADMIN_USERNAME: "admin",
      SHOPWARE_ADMIN_PASSWORD: "shopware",
    });
    expect(result).toEqual([]);
  });

  it("should treat whitespace-only CLIENT_ID as unset", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_ID: "  ",
    });
    expect(result).toEqual([
      "SHOPWARE_ADMIN_USERNAME",
      "SHOPWARE_ADMIN_PASSWORD",
    ]);
  });

  it("should treat empty CLIENT_SECRET as unset and fall back to password flow", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_SECRET: "",
      SHOPWARE_ADMIN_USERNAME: "admin",
      SHOPWARE_ADMIN_PASSWORD: "shopware",
    });
    expect(result).toEqual([]);
  });

  it("should prefer client_credentials flow when both flows have vars set", () => {
    const result = validateAdminEnvVars({
      SHOPWARE_ADMIN_CLIENT_ID: "my-integration",
      SHOPWARE_ADMIN_CLIENT_SECRET: "my-secret",
      SHOPWARE_ADMIN_USERNAME: "admin",
      SHOPWARE_ADMIN_PASSWORD: "shopware",
    });
    expect(result).toEqual([]);
  });
});
