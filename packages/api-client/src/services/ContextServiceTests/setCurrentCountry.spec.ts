import { defaultInstance } from "../../apiService";
import { setCurrentCountry } from "../contextService";
import { update } from "../..";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - setCurrentCountry", () => {
  const newLanguageId = "28bbf3f6e79145ba8ffc91c409690ab8";
  const contextToken = "NWDdcRTTWoPk4Ngv13z5NDMMsDFRb9W6";

  const mockedPatch = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      patch: mockedPatch,
    } as any;
  });

  describe("with contextToken given", () => {
    beforeEach(() => {
      update({ contextToken });
    });

    it("should return context token", async () => {
      mockedPatch.mockResolvedValueOnce({
        data: { "sw-context-token": contextToken },
      });

      const result = await setCurrentCountry(newLanguageId);

      expect(mockedPatch).toBeCalledTimes(1);
      expect(mockedPatch).toBeCalledWith("/store-api/context", {
        languageId: newLanguageId,
      });

      expect(result.contextToken).toEqual(contextToken);
    });
  });

  describe("without contextToken given", () => {
    beforeEach(() => {
      update({ contextToken: undefined });
    });

    it("should return context token", async () => {
      mockedPatch.mockResolvedValueOnce({
        data: { "sw-context-token": contextToken },
      });

      const result = await setCurrentCountry(newLanguageId);

      expect(mockedPatch).toBeCalledTimes(1);
      expect(mockedPatch).toBeCalledWith("/store-api/context", {
        languageId: "28bbf3f6e79145ba8ffc91c409690ab8",
      });

      expect(result.contextToken).toEqual(contextToken);
    });
  });
});
