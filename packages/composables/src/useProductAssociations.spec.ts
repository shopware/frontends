import { describe, expect, it, vi } from "vitest";
import { useProductAssociations } from "./useProductAssociations";
import { computed, ref } from "vue";
import mockedProduct from "./mocks/Product";
import mockedCrossSelling from "./mocks/CrossSellingResponse";
import { useSetup } from "./_test";

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
