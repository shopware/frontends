import { describe, expect, it } from "vitest";
import { useLandingSearch } from "./useLandingSearch";
import LandingPageMock from "./mocks/LandingPage";
import { useSetup } from "./_test";

describe("useLandingSearch", () => {
  it("mergeWishlistProducts", async () => {
    const { vm, injections } = useSetup(useLandingSearch);
    injections.apiClient.invoke.mockResolvedValue(LandingPageMock);

    const result = vm.search("test");

    expect(injections.apiClient.invoke).toBeCalledWith(
      expect.stringContaining("readLandingPage"),
      expect.objectContaining({ landingPageId: "test" }),
    );
    expect(result).resolves.toStrictEqual(LandingPageMock);
  });
});
