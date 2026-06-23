import { flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useSetup } from "../_test";
import Salutations from "../mocks/Salutations";
import { useSalutations } from "./useSalutations";

describe("useSalutations", () => {
  it("should init value on init", async () => {
    const { vm, injections } = useSetup(useSalutations, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            elements: Salutations,
          },
        }),
      },
    });
    await flushPromises();

    expect(injections.apiClient.invoke).toBeCalledTimes(1);
    expect(vm.getSalutations).toStrictEqual(Salutations);
  });

  it("should return empty array if no salutations", async () => {
    const { vm } = useSetup(useSalutations, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            elements: null,
          },
        }),
      },
    });

    expect(vm.getSalutations).toStrictEqual([]);
  });

  it("uses the cacheable GET variant when cacheableReads is enabled", async () => {
    const { vm, injections } = useSetup(useSalutations, {
      shopware: { cacheableReads: true },
      apiClient: {
        invoke: vi.fn().mockResolvedValue({ data: { elements: Salutations } }),
      },
    } as Parameters<typeof useSetup>[1]);
    await vm.fetchSalutations();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readSalutationGet get /salutation",
    );
  });

  it("should not fetch when swSalutations already populated", async () => {
    const preloadedSalutations = ref(Salutations);
    const { vm, injections } = useSetup(useSalutations, {
      apiClient: { invoke: vi.fn() },
      swSalutations: preloadedSalutations,
    } as Parameters<typeof useSetup>[1]);
    await flushPromises();

    expect(injections.apiClient.invoke).not.toHaveBeenCalled();
    expect(vm.getSalutations).toStrictEqual(Salutations);
  });
});
