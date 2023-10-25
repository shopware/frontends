import { describe, expect, it, vi } from "vitest";
import { useNavigationSearch } from "./useNavigationSearch";
import { shallowMount } from "@vue/test-utils";
import * as apiExports from "@shopware-pwa/api-client";

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
const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const { resolvePath } = useNavigationSearch();
    return { resolvePath };
  },
};

const getMockProvide = () => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {},
        },
      },
    },
  },
});

describe("useNavigationSearch", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(apiExports, "getSeoUrl").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve({
        elements: [mockedResponse],
      });
    });
  });

  it("resolvePath", async () => {
    expect(await wrapper.vm.resolvePath("/test")).toStrictEqual(mockedResponse);
    expect(await wrapper.vm.resolvePath("/landingPage/test")).toStrictEqual(
      mockedResponse,
    );
    expect(await wrapper.vm.resolvePath("/")).toStrictEqual({
      routeName: "frontend.navigation.page",
      foreignKey: undefined,
    });
  });
});
