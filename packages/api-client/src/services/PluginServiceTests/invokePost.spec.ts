import { defaultInstance } from "../../apiService";
import { invokePost, invokeGet } from "../pluginService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("PluginService - invokePost", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should call contextInstance.invoke.post method with provided payload", async () => {
    mockedPost.mockResolvedValueOnce({ data: { success: true } });

    const result = await invokePost({
      address: "/some/post/endpoint",
      payload: {
        some: "payload",
      },
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/some/post/endpoint", {
      some: "payload",
    });
    expect(result.data.success).toEqual(true);
  });
});
describe("PluginService - invokeGet", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should call contextInstance.invoke.get method with provided resource", async () => {
    mockedGet.mockResolvedValueOnce({ data: { success: true } });

    const result = await invokeGet({
      address: "/some/get/endpoint",
    });
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/some/get/endpoint");
    expect(result.data.success).toEqual(true);
  });
});
