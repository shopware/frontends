import { useSalutations } from "./useSalutations";
import { describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import Salutations from "./mocks/Salutations";
import { useSetup } from "./_test";

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
});
