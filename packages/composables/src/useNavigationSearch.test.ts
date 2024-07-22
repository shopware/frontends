import { describe, expect, it, vi } from "vitest";
import { useNavigationSearch } from "./useNavigationSearch";
import { useSetup } from "./_test";
import { useSessionContext } from "./useSessionContext";
import { ref } from "vue";

vi.mock("./useSessionContext.ts");
const sessionContext = ref();

vi.mocked(useSessionContext).mockReturnValue({
  sessionContext,
} as unknown as ReturnType<typeof useSessionContext>);

const mockedResponse = {
  translated: [],
  createdAt: "2020-08-06T06:26:42.505+00:00",
  updatedAt: "2022-08-03T08:07:03.941+00:00",
  salesChannelId: "98432def39fc4624b33213a56b8c944d",
  languageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
  routeName: "frontend.detail.page",
  foreignKey: "e05e9340aff4484f9009646dfd572df9",
  pathInfo: "/detail/e05e9340aff4484f9009646dfd572df9",
  seoPathInfo: "Fred-3-Burner-Gas-Grill/941044",
  isCanonical: true,
  isModified: false,
  isDeleted: false,
  isValid: null,
  url: null,
  customFields: null,
  id: "59d47f52be96461193a3d6fcf2fe46e6",
  apiAlias: "seo_url",
};

describe("useNavigationSearch", () => {
  it("should resolve path from api response", async () => {
    const { vm, injections } = useSetup(useNavigationSearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        elements: [mockedResponse],
      },
    });

    expect(await vm.resolvePath("/test")).toStrictEqual(mockedResponse);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readSeoUrl"),
      expect.objectContaining({
        body: {
          filter: [
            {
              type: "equals",
              field: "seoPathInfo",
              value: "test",
            },
          ],
        },
      }),
    );
  });
  it("should resolve technical url", async () => {
    const { vm, injections } = useSetup(useNavigationSearch);
    injections.apiClient.invoke.mockResolvedValue({ data: { elements: [] } });

    await vm.resolvePath("/landingPage/test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readSeoUrl"),
      expect.objectContaining({
        body: {
          filter: [
            {
              type: "equals",
              field: "pathInfo",
              value: "/landingPage/test",
            },
          ],
        },
      }),
    );
  });
  it("should not invoke api call for / search ", async () => {
    const { vm, injections } = useSetup(useNavigationSearch);
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        elements: [mockedResponse],
      },
    });

    const result = await vm.resolvePath("/");
    expect(result).toMatchInlineSnapshot(`
      {
        "foreignKey": undefined,
        "routeName": "frontend.navigation.page",
      }
    `);
    expect(injections.apiClient.invoke).not.toHaveBeenCalled();
  });

  it("resolvePath with categoryId", async () => {
    const { vm } = useSetup(useNavigationSearch);
    sessionContext.value = {
      salesChannel: {
        navigationCategoryId: "categoryIdTest",
      },
    };

    expect(await vm.resolvePath("/")).toStrictEqual({
      foreignKey: "categoryIdTest",
      routeName: "frontend.navigation.page",
    });
  });
});
