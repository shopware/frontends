import { describe, expect, it, vi } from "vitest";
import { useLandingSearch } from "./useLandingSearch";
import { shallowMount } from "@vue/test-utils";
import * as apiExports from "@shopware-pwa/api-client";
import LandingPageMock from "./mocks/LandingPage";

const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const { search } = useLandingSearch();
    return {
      search,
    };
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

describe("useLandingSearch", () => {
  const wrapper = shallowMount(Component, getMockProvide());

  vi.spyOn(apiExports, "getLandingPage").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(LandingPageMock);
    });
  });

  it("mergeWishlistProducts", async () => {
    expect(await wrapper.vm.search({ navigationId: "test" })).toStrictEqual(
      LandingPageMock,
    );
  });
});
