import { describe, expect, it } from "vitest";
import { useMedia } from "./useMedia";
import { useSetup } from "../_test";

describe("useMedia", () => {
  it("should call api endpoint for fetching media", async () => {
    const { vm, injections } = useSetup(useMedia);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    vm.fetchMedia(["test"]);

    expect(injections.apiClient.invoke).toBeCalledWith(
      expect.stringContaining("readMedia"),
      expect.objectContaining({ body: { ids: ["test"] } }),
    );
  });
});
