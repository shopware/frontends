import { Media } from "../media/Media";
import { CmsPage } from "../cms/CmsPage";
import { Product } from "../product/Product";
import { Entity } from "../../common/Entity";
import { Tag } from "../../system/tag/Tag";
import { CategoryTranslation } from "./CategoryTranslation";
import { CustomFields } from "../../common/CustomField";

/**
 * Source: https://github.com/shopware/platform/blob/master/src/Core/Content/Category/CategoryDefinition.php#L50
 *
 * @beta
 */
export type CategoryType = "page" | "link" | "folder";

/**
 * @beta
 */
export type Category = Entity & {
  parentId: string | null;
  autoIncrement: number;
  mediaId: string | null;
  name: string | null;
  breadcrumb: string[];
  level: number;
  active: boolean;
  childCount: number;
  displayNestedProducts: boolean;
  parent: Category | null;
  children: Category[] | null;
  translations: CategoryTranslation[] | null;
  media: Media | null;
  products: Product[] | null;
  nestedProducts: Product[] | null;
  afterCategoryId: string | null;
  customFields: CustomFields;
  tags: Tag[] | null;
  cmsPageId: string | null;
  cmsPage: CmsPage | null;
  slotConfig: [] | null;
  externalLink: string | null;
  linkNewTab: boolean;
  visible: boolean;
  type: CategoryType;
  description: string;
  id: string;
  parentVersionId: string;
  childrenCount: number;
  afterCategoryVersionId: string;
  path?: string;
  route?: {
    path?: string;
  };
  seoUrls: {
    apiAlias: string;
    pathInfo: string;
    seoPathInfo: string;
  }[];
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  translated: {
    name: string;
    breadcrumb: string[];
    description: string;
    externalLink: string;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string | null;
    customFields: CustomFields;
  };
  linkType: "product" | "category" | "landing_page" | string;
  internalLink: string | null;
};
