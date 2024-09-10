import { describe, expect, it } from "vitest";
import { useNavigationContext } from "./useNavigationContext";
import { useSetup } from "../_test";
import { ref } from "vue";

describe("useNavigationContext", () => {
  it("notification flow", async () => {
    const { vm } = useSetup(() =>
      useNavigationContext(
        ref({
          createdAt: "2020-08-06T06:26:52.576+00:00",
          foreignKey: "7e117859f69b4ee08947e1ae4fce1f69",
          id: "dd38c5ed443544e28818e967809c8914",
          isCanonical: true,
          isDeleted: false,
          isModified: false,
          languageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
          pathInfo: "/detail/7e117859f69b4ee08947e1ae4fce1f69",
          routeName: "frontend.detail.page",
          updatedAt: "2022-08-03T08:07:04.512+00:00",
          salesChannelId: "98432def39fc4624b33213a56b8c944d",
          seoPathInfo: "Cigar-Special-40/SW10044",
        }),
      ),
    );

    expect(vm.foreignKey).toBe("7e117859f69b4ee08947e1ae4fce1f69");
    expect(vm.routeName).toBe("frontend.detail.page");
  });

  it("should return empty string if no foreignKey", async () => {
    const { vm } = useSetup(() =>
      useNavigationContext(
        ref({
          createdAt: "2020-08-06T06:26:52.576+00:00",
          foreignKey: "",
          id: "dd38c5ed443544e28818e967809c8914",
          languageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
          pathInfo: "/detail/7e117859f69b4ee08947e1ae4fce1f69",
          routeName: "frontend.detail.page",
          seoPathInfo: "Cigar-Special-40/SW10044",
        }),
      ),
    );

    expect(vm.foreignKey).toBe("");
  });
});
