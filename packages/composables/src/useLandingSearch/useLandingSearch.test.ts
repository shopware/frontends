import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { cmsAssociations } from "../cms/cmsAssociations";
import LandingPageMock from "../mocks/LandingPage";
import { useLandingSearch } from "./useLandingSearch";

describe("useLandingSearch", () => {
  it("mergeWishlistProducts", async () => {
    const { vm, injections } = useSetup(useLandingSearch);
    injections.apiClient.invoke.mockResolvedValue({ data: LandingPageMock });

    const result = vm.search("test");

    expect(injections.apiClient.invoke).toBeCalledWith(
      expect.stringContaining("readLandingPage"),
      expect.objectContaining({ pathParams: { landingPageId: "test" } }),
    );
    await expect(result).resolves.toStrictEqual(LandingPageMock);

    vm.search("test", { withCmsAssociations: true });

    expect(injections.apiClient.invoke).toBeCalledWith(
      expect.stringContaining("readLandingPage"),
      expect.objectContaining({
        pathParams: { landingPageId: "test" },
        body: { associations: cmsAssociations },
      }),
    );
  });
});
