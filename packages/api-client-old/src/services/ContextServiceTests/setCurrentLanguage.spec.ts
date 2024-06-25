import { defaultInstance } from "../../apiService";
import { setCurrentLanguage } from "../contextService";
import { update } from "../..";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - setCurrentLanguage", () => {
  const mockedPatch = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      patch: mockedPatch,
    } as any;
  });

  describe("with contextToken given", () => {
    beforeEach(() => {
      update({ contextToken: "NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6" });
    });

    it("should return context token", async () => {
      mockedPatch.mockResolvedValueOnce({
        data: { "sw-context-token": "NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6" },
      });

      let newLanguageId = "45f96f681f9d4834b29e9e15df3a7149";

      const result = await setCurrentLanguage(newLanguageId);

      expect(mockedPatch).toBeCalledTimes(1);
      expect(mockedPatch).toBeCalledWith("/store-api/context", {
        languageId: "45f96f681f9d4834b29e9e15df3a7149",
      });

      expect(result.contextToken).toEqual("NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6");
    });
  });

  describe("without contextToken given", () => {
    beforeEach(() => {
      update({ contextToken: undefined });
    });

    it("should return context token", async () => {
      mockedPatch.mockResolvedValueOnce({
        data: { "sw-context-token": "NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6" },
      });

      let newLanguageId = "45f96f681f9d4834b29e9e15df3a7149";

      const result = await setCurrentLanguage(newLanguageId);

      expect(mockedPatch).toBeCalledTimes(1);
      expect(mockedPatch).toBeCalledWith("/store-api/context", {
        languageId: "45f96f681f9d4834b29e9e15df3a7149",
      });

      expect(result.contextToken).toEqual("NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6");
    });
  });
});
