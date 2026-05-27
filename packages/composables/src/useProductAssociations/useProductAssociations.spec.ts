import { describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";
import { useSetup } from "../_test";
import mockedCrossSelling from "../mocks/CrossSellingResponse";
import mockedProduct from "../mocks/Product";
import { useProductAssociations } from "./useProductAssociations";

describe("useProductAssociations", () => {
  console.error = vi.fn();

  it("productAssociations should be empty", () => {
    const { vm } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
        },
      ),
    );

    expect(vm.productAssociations).toStrictEqual([]);
    expect(vm.isLoading).toBe(false);
  });

  it("load productAssociations - GET - Error", async () => {
    const { vm, injections } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
        },
      ),
    );
    injections.apiClient.invoke.mockRejectedValue("PROBLEM");

    await vm.loadAssociations({
      searchParams: {},
    });
    expect(vm.productAssociations).toStrictEqual([]);
    expect(console.error).toBeCalledWith(
      "[useProductAssociations][loadAssociations][error]:",
      "PROBLEM",
    );
  });

  it("load productAssociations - POST", async () => {
    const { vm, injections } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
        },
      ),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: mockedCrossSelling });

    await vm.loadAssociations({
      method: "post",
      searchParams: {
        associations: {
          media: {},
          cover: {
            associations: {
              media: {},
            },
          },
        },
      },
    });

    expect(vm.productAssociations).toStrictEqual(mockedCrossSelling);
  });

  it("load productAssociations - POST - no search params", async () => {
    const { vm, injections } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
        },
      ),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: mockedCrossSelling });

    await vm.loadAssociations({
      method: "post",
      searchParams: {},
    });

    expect(vm.productAssociations).toStrictEqual(mockedCrossSelling);
  });

  it("sends sw-include-seo-urls header when includeSeoUrls is true", async () => {
    const { vm, injections } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
          includeSeoUrls: true,
        },
      ),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: mockedCrossSelling });

    await vm.loadAssociations({
      method: "post",
      searchParams: {},
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductCrossSellings"),
      expect.objectContaining({
        headers: {
          "sw-include-seo-urls": true,
        },
      }),
    );
  });

  it("omits sw-include-seo-urls header when includeSeoUrls is not set", async () => {
    const { vm, injections } = useSetup(() =>
      useProductAssociations(
        computed(() => mockedProduct),
        {
          associationContext: "cross-selling",
        },
      ),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: mockedCrossSelling });

    await vm.loadAssociations({
      method: "post",
      searchParams: {},
    });

    const invokeOptions = injections.apiClient.invoke.mock.calls[0]?.[1];
    expect(invokeOptions).not.toHaveProperty("headers");
  });

  it("init without product should throw an error", () => {
    expect(() =>
      useSetup(() =>
        useProductAssociations(
          // @ts-expect-error if API returns null we want to be prepared for it
          ref(null),
          {
            associationContext: "cross-selling",
          },
        ),
      ),
    ).toThrowError("[useProductAssociations]: Product is not provided.");
  });
});
