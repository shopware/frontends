import { getOrderDownloads } from "../orderService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("OrderService - getOrderDownloads", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });

  it("should return order file", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: {} } });
    const result = await getOrderDownloads({
      orderId: "123",
      downloadId: "456",
    });
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(`/store-api/order/download/123/456`, {
      responseType: "blob",
    });
    expect(result).toMatchObject({});
  });
});
