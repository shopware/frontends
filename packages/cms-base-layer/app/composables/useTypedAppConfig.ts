import type { BackgroundImageOptions } from "@shopware/helpers";
import { useAppConfig } from "#imports";

type CmsBaseLayerAppConfig = ReturnType<typeof useAppConfig> & {
  imagePlaceholder?: {
    color?: string;
  };
  backgroundImage?: BackgroundImageOptions;
  imageSizes?: Record<string, string>;
  lcpImagePreload?: boolean;
};

export function useTypedAppConfig() {
  return useAppConfig() as CmsBaseLayerAppConfig;
}
