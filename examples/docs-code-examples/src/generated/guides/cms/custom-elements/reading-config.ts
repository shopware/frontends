type CmsElementRegistration = {
  name: string;
  defaultConfig: {
    dailyUrl: {
      source: "static";
      value: string;
    };
  };
};

declare const Shopware: {
  Service(service: "cmsService"): {
    registerCmsElement(config: CmsElementRegistration): void;
  };
};

Shopware.Service("cmsService").registerCmsElement({
  name: "dailymotion",
  defaultConfig: {
    dailyUrl: {
      source: "static",
      value: "",
    },
  },
});
