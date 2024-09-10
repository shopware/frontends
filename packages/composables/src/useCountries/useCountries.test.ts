import { describe, expect, it, vi } from "vitest";
import { useCountries } from "./useCountries";
import { useSetup } from "../_test";
import CountryMock from "../mocks/Country";

describe("useCountries", () => {
  it("useCountries flow", async () => {
    const { vm, injections } = await useSetup(useCountries, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: CountryMock,
        }),
      },
    });
    await vm.fetchCountries();

    expect(vm.getStatesForCountry(CountryMock.elements[0].id)).toStrictEqual(
      CountryMock.elements[0].states,
    );

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCountry"),
      expect.objectContaining({}),
    );

    expect(vm.getCountries).toStrictEqual(CountryMock.elements);
  });

  it("useCountries flow - no states", async () => {
    const { vm } = await useSetup(useCountries, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            elements: [
              {
                id: "test123",
              },
            ],
          },
        }),
      },
    });
    await vm.fetchCountries();

    expect(vm.getStatesForCountry(CountryMock.elements[0].id)).toStrictEqual(
      null,
    );
  });

  it("useCountries flow - empty", async () => {
    const { vm } = await useSetup(useCountries, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            elements: null,
          },
        }),
      },
    });
    await vm.fetchCountries();

    expect(vm.getCountries).toStrictEqual([]);
  });
});
