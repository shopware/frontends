import { getStoreNavigation } from "../navigationService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("NavigationService - getStoreNavigation", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should return navigation elements for given navigation ids", async () => {
    mockedPost.mockResolvedValueOnce({
      data: [
        {
          id: "footer-navigation",
        },
      ],
    });
    const result = await getStoreNavigation({
      requestActiveId: "footer-navigation",
      requestRootId: "footer-navigation",
      depth: 5,
      buildTree: false,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/navigation/footer-navigation/footer-navigation",
      { buildTree: false, depth: 5 }
    );
    expect(result).toStrictEqual([{ id: "footer-navigation" }]);
  });
});
