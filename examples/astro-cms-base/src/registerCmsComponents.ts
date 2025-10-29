import type { App } from "vue";
import { defineAsyncComponent } from "vue";

export function registerCmsComponents(app: App) {
  // Import components from cms-base-layer source
  // The package is a Nuxt layer, so we access component source files directly

  // Sections
  app.component(
    "CmsSectionDefault",
    defineAsyncComponent(
      () =>
        import(
          "@shopware/cms-base-layer/components/public/cms/section/CmsSectionDefault.vue"
        ),
    ),
  );

  app.component(
    "CmsSectionSidebar",
    defineAsyncComponent(
      () =>
        import(
          "@shopware/cms-base-layer/components/public/cms/section/CmsSectionSidebar.vue"
        ),
    ),
  );

  // Generic resolvers
  app.component(
    "CmsGenericBlock",
    defineAsyncComponent(
      () =>
        import(
          "@shopware/cms-base-layer/components/public/cms/block/CmsGenericBlock.vue"
        ),
    ),
  );

  app.component(
    "CmsGenericElement",
    defineAsyncComponent(
      () =>
        import(
          "@shopware/cms-base-layer/components/public/cms/element/CmsGenericElement.vue"
        ),
    ),
  );

  // Register common blocks
  const commonBlocks = [
    "CmsBlockText",
    "CmsBlockImage",
    "CmsBlockImageText",
    "CmsBlockProductListing",
  ];

  commonBlocks.forEach((name) => {
    app.component(
      name,
      defineAsyncComponent(
        () =>
          import(
            `@shopware/cms-base-layer/components/public/cms/block/${name}.vue`
          ),
      ),
    );
  });

  // Register common elements
  const commonElements = [
    "CmsElementText",
    "CmsElementImage",
    "CmsElementProductListing",
  ];

  commonElements.forEach((name) => {
    app.component(
      name,
      defineAsyncComponent(
        () =>
          import(
            `@shopware/cms-base-layer/components/public/cms/element/${name}.vue`
          ),
      ),
    );
  });
}
