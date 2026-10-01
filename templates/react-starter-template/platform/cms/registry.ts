import {
  defaultCmsRegistry,
  mergeCmsRegistries,
} from "@shopware/cms-base-layer-react";

export const cmsRegistry = mergeCmsRegistries(defaultCmsRegistry, {});
