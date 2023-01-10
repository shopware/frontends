import { describe, expect, it, vi } from "vitest";
import { useNewsletter } from "./useNewsletter";
import { shallowMount } from "@vue/test-utils";
import * as apiExports from "@shopware-pwa/api-client";

const url = "http://frontend.test";

const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const { newsletterSubscribe, newsletterUnsubscribe } = useNewsletter();
    return { newsletterSubscribe, newsletterUnsubscribe };
  },
};

const getMockProvide = (mockedUrl: string | undefined) => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {
            endpoint: mockedUrl,
          },
        },
      },
    },
  },
});

describe("useNewsletter", () => {
  const wrapper = shallowMount(Component, getMockProvide(url + "/"));
  const email = "test@testemail.test";
  const newsletterMockData = {
    email: email,
    option: "subscribe" as const,
  };

  vi.spyOn(apiExports, "newsletterSubscribe").mockImplementation(() => {
    return new Promise<void>((resolve) => {
      resolve();
    });
  });

  vi.spyOn(apiExports, "newsletterUnsubscribe").mockImplementation(() => {
    return new Promise<void>((resolve) => {
      resolve();
    });
  });

  it("newsletter subscribe", () => {
    expect(wrapper.vm.newsletterSubscribe(newsletterMockData)).resolves.toEqual(
      undefined
    );
  });

  it("newsletter unsubscribe", () => {
    expect(wrapper.vm.newsletterUnsubscribe(email)).resolves.toEqual(undefined);
  });
});
