import type { Schemas, operations } from "#shopware";

type SeoUrlBody = operations["readSeoUrl post /seo-url"]["body"];
type SeoUrlResponse = operations["readSeoUrl post /seo-url"]["response"];
type CachedSeoUrlResponse =
  operations["readSeoUrlGet get /seo-url"]["response"];
type LandingPageBody =
  operations["readLandingPage post /landing-page/{landingPageId}"]["body"];
type SeoUrl = Schemas["SeoUrl"];
type LandingPage = Schemas["LandingPage"];
