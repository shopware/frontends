import { computed } from "vue";
import { useHead } from "#imports";
import type { Schemas } from "#shopware";
import { findFirstCmsImageUrl } from "../helpers/cms/findFirstCmsImageUrl";
import { useTypedAppConfig } from "./useTypedAppConfig";

/**
 * Preloads the first image found in CMS sections (background or element).
 * This is typically the LCP (Largest Contentful Paint) candidate.
 *
 * Injects a `<link rel="preload" as="image">` in the `<head>` during SSR,
 * allowing the browser to fetch the image before parsing CSS.
 */
export function useLcpImagePreload(sections: Schemas["CmsSection"][]) {
  const appConfig = useTypedAppConfig();
  const isEnabled = Boolean(appConfig.lcpImagePreload);

  const lcpImageHref = computed(() =>
    isEnabled
      ? findFirstCmsImageUrl(sections, {
          format: appConfig.backgroundImage?.format,
          quality: appConfig.backgroundImage?.quality,
        })
      : undefined,
  );

  useHead(
    computed(() =>
      lcpImageHref.value
        ? {
            link: [
              {
                rel: "preload",
                as: "image",
                fetchpriority: "high",
                href: lcpImageHref.value,
              },
            ],
          }
        : {},
    ),
  );
}
