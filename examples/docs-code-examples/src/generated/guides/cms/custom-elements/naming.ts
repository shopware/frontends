type CmsElementRegistration = {
  name: string;
};

declare const Shopware: {
  Service(service: "cmsService"): {
    registerCmsElement(config: CmsElementRegistration): void;
  };
};

Shopware.Service("cmsService").registerCmsElement({
  name: "dailymotion",
});
