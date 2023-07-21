import { getDocumentDownload } from "../documentService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("DocumentService - getDocumentDownload", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });

  it("should return document file", async () => {
    mockedGet.mockResolvedValueOnce({ data: { data: {} } });
    const result = await getDocumentDownload({
      documentId: "123",
      deepLinkCode: "456",
    });
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(`/store-api/document/download/123/456`, {
      responseType: "blob",
    });
    expect(result).toMatchObject({});
  });
});
