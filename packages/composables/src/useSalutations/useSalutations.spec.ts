import { flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
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
});
