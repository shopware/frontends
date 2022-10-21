import { defaultInstance } from "../../apiService";
import { getSessionContext } from "../contextService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("ContextService - getSessionContext", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return sessionContext", async () => {
    mockedGet.mockResolvedValueOnce({ data: { token: "qwerty" } });

    const result = await getSessionContext();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/context");
    expect(result.token).toEqual("qwerty");
  });
});
