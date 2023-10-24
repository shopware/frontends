import { ref, computed, unref, inject } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { Product, PropertyGroup } from "@shopware-pwa/types";
import { useProduct, useShopwareContext } from ".";
import { invokePost, getProductEndpoint } from "@shopware-pwa/api-client";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

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
  }): Promise<Product | undefined>;

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
  getOptionGroups: ComputedRef<PropertyGroup[]>;
};

/**
 * Composable to change product variant.
 * @public
 * @category Product
 */
export function useProductConfigurator(): UseProductConfiguratorReturn {
  const { apiInstance } = useShopwareContext();

  const { configurator, product } = useProduct();

  const selected = ref({} as any);
  const isLoadingOptions = ref(!!product.value.options?.length);
  const parentProductId = computed(() => product.value?.parentId);
  const getOptionGroups = computed<PropertyGroup[]>(() => {
    return configurator.value || [];
  });

  const findGroupCodeForOption = (optionId: string) => {
    const group = getOptionGroups.value.find((optionGroup) => {
      const optionFound = optionGroup.options?.find((option: any) => {
        return option.id === optionId;
      });
      return !!optionFound;
    });

    return getTranslatedProperty(group, "name");
  };

  // create a group -> optionId map
  product.value.optionIds?.forEach((optionId: string) => {
    const optionGroupCode = findGroupCodeForOption(optionId);
    if (optionGroupCode) {
      selected.value[optionGroupCode] = optionId;
    }
  });

  async function findVariantForSelectedOptions(options?: {
    [code: string]: string;
  }): Promise<Product | undefined> {
    const filter = [
      {
        type: "equals",
        field: "parentId",
        value: parentProductId.value,
      },
      ...Object.values(options || selected.value).map((id) => ({
        type: "equals",
        field: "optionIds",
        value: id,
      })),
    ];
    try {
      /* istanbul ignore next */
      if (apiInstance) {
        apiInstance.defaults.headers.common["sw-include-seo-urls"] = "true";
      }
      const response = await invokePost(
        {
          address: getProductEndpoint(),
          payload: {
            limit: 1,
            filter,
            includes: {
              product: ["id", "translated", "productNumber", "seoUrls"],
              seo_url: ["seoPathInfo"],
            },
            associations: {
              seoUrls: {},
            },
          },
        },
        apiInstance,
      );
      return (response as { data?: { elements?: Array<Product> } })?.data
        ?.elements?.[0]; // return first matching product
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
    getSelectedOptions: selected,
  };
}
