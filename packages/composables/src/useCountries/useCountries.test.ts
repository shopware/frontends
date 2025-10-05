import { describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import CountryMock from "../mocks/Country";
import { useCountries } from "./useCountries";

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

    expect(
      vm.getStatesForCountry(CountryMock.elements?.[0]?.id as string),
    ).toStrictEqual(CountryMock.elements?.[0]?.states);

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

    expect(
      vm.getStatesForCountry(CountryMock.elements?.[0]?.id as string),
    ).toStrictEqual(null);
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

  it("useCountries flow - getCountriesOptions", async () => {
    const { vm } = await useSetup(useCountries, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: CountryMock,
        }),
      },
    });

    await vm.fetchCountries();

    expect(vm.getCountriesOptions).toStrictEqual([
      {
        value: "16bb0446bf094f5d8bebf450652abafc",
        label: "Sweden",
      },
      {
        value: "184eb596425f4d56aa9ed8af9c3dc8d1",
        label: "Ireland",
      },
      {
        value: "20513996f80f4d00b5ebedc51a2deae2",
        label: "Australia",
      },
    ]);
  });

  it("useCountries flow - getCountriesOptions - empty array", async () => {
    const { vm } = await useSetup(useCountries, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({
          data: {
            elements: null,
          },
        }),
      },
    });

    expect(vm.getCountriesOptions).toStrictEqual([]);
  });
});
