import { describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { useLandingSearch } from "./useLandingSearch";
import { shallowMount } from "@vue/test-utils";
import LandingPageMock from "./mocks/LandingPage";

const Component = defineComponent({
  template: "<div/>",
  props: {},
  setup() {
    const { search } = useLandingSearch();
    return {
      search,
    };
  },
});

const getMockProvide = () => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {},
        },
      },
      apiClient: { invoke: () => LandingPageMock },
    },
  },
});

describe("useLandingSearch", () => {
  const wrapper = shallowMount(Component, getMockProvide());
  it("mergeWishlistProducts", async () => {
    expect(await wrapper.vm.search("test")).toStrictEqual(LandingPageMock);
  });
});
