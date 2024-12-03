declare module "@vue/runtime-core" {
  export type GlobalComponents = {
    CmsGenericBlock: typeof import("./components/cms/CmsGenericBlock.vue")["default"];
    CmsGenericElement: typeof import("./components/cms/CmsGenericElement.vue")["default"];
  };

  declare interface AllowedComponentProps {
    dataTestid?: string;
  }
}

export type {};
