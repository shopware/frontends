import { CmsPage } from "../cms/CmsPage";
import { SeoUrl } from "../navigation/Navigation";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type LandingPage = {
  active: boolean;
  translations: null | unknown;
  cmsPage: null | CmsPage;
  cmsPageId: string;
  name: string;
  metaTitle: null | string;
  metaDescription: null | string;
  keywords: null | string;
  url: string;
  slotConfig: null | unknown[];
  seoUrls: null | SeoUrl[];
  _uniqueIdentifier: string;
  versionId: string;
  translated: {
    name: string;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string | null;
  };
  createdAt: string;
  updatedAt: null | string;
  extensions: unknown;
  id: string;
  customFields: CustomFields;
  cmsPageVersionId: string;
  apiAlias: "landing_page";
};
