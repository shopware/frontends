import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useProduct, useShopwareContext } from "#imports";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

export type UseProductConfiguratorReturn = {
  /**
   * Handler for action when the selected option is changed
   */
  handleChange(
    attribute: string,
    option: string,
    onChangeHandled: () => void,
  ): Promise<void>;

  findVariantForSelectedOptions(options?: {
    [key: string]: string;
  }): Promise<Schemas["Product"] | undefined>;

  /**
   * Indicates if the options are being (re)loaded
   */
  isLoadingOptions: Ref<boolean>;
  /**
   * Object of currently selected options
   */
  getSelectedOptions: ComputedRef<{
    [key: string]: string;
  }>;
  /**
   * All assigned properties which the variant can be made of
   */
  getOptionGroups: ComputedRef<Schemas["PropertyGroup"][]>;
};

/**
 * Composable to change product variant.
 * @public
 * @category Product
 */
export function useProductConfigurator(): UseProductConfiguratorReturn {
  const { apiClient } = useShopwareContext();

  const { configurator, product } = useProduct();

  const selected = ref<{
    [key: string]: string;
  }>({});
  const isLoadingOptions = ref(!!product.value.options?.length);
  const parentProductId = computed(() => product.value?.parentId);
  const getOptionGroups = computed<Schemas["PropertyGroup"][]>(() => {
    return configurator.value || [];
  });

  const findGroupCodeForOption = (optionId: string) => {
    const group = getOptionGroups.value.find((optionGroup) => {
      const optionFound = optionGroup.options?.find((option) => {
        return option.id === optionId;
      });
      return !!optionFound;
    });

    return getTranslatedProperty(group, "name");
  };

  // create a group -> optionId map
  for (const optionId of product.value.optionIds || []) {
    const optionGroupCode = findGroupCodeForOption(optionId);
    if (optionGroupCode) {
      selected.value[optionGroupCode] = optionId;
    }
  }

  async function findVariantForSelectedOptions(options?: {
    [code: string]: string;
  }): Promise<Schemas["Product"] | undefined> {
    const filter: Schemas["Filters"] = [
      {
        type: "equals",
        field: "parentId",
        value: parentProductId.value as string,
      },
      ...Object.values(options || selected.value).map(
        (id) =>
          ({
            type: "equals",
            field: "optionIds",
            value: id as string,
          }) as Schemas["EqualsFilter"],
      ),
    ];
    try {
      const response = await apiClient.invoke("readProduct post /product", {
        body: {
          filter,
          limit: 1,
          includes: {
            product: ["id", "translated", "productNumber", "seoUrls"],
            seo_url: ["seoPathInfo"],
          },
          associations: {
            seoUrls: {},
          },
        },
      });
      return response.data.elements?.[0]; // return first matching product
    } catch (e) {
      console.error("SwProductDetails:findVariantForSelectedOptions", e);
    }
  }

  const handleChange = async (
    group: string,
    option: string,
    onChangeHandled?: () => void,
  ): Promise<void> => {
    selected.value = Object.assign({}, selected.value, {
      [group]: option,
    });
    if (typeof onChangeHandled === "function") {
      // run passed callback
      await onChangeHandled();
    }
  };

  return {
    handleChange,
    findVariantForSelectedOptions,
    isLoadingOptions,
    getOptionGroups,
    getSelectedOptions: computed(() => selected.value),
  };
}
