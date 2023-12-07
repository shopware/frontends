import { Media } from "../media/Media";
import { CmsPage } from "../cms/CmsPage";
import { Product } from "../product/Product";
import { Entity } from "../../common/Entity";
import { Tag } from "../../system/tag/Tag";
import { CategoryTranslation } from "./CategoryTranslation";
import { CustomFields } from "../../common/CustomField";
import { SeoUrl } from "../navigation/Navigation";
import type { Schemas } from "#shopware";
/**
 * Source: https://github.com/shopware/platform/blob/master/src/Core/Content/Category/CategoryDefinition.php#L50
 *
 * @beta
 */
export type CategoryType = "page" | "link" | "folder";

/**
 * @deprecated use {@link Schemas['Category']} from "#shopware" import instead
 */
export type Category = Schemas["Category"];
// export type Category = Entity & {
//   parentId: string | null;
//   autoIncrement?: number;
//   mediaId: string | null;
//   name: string | null;
//   breadcrumb: string[];
//   level: number;
//   active: boolean;
//   childCount: number;
//   displayNestedProducts: boolean;
//   parent: Category | null;
//   children: Category[] | null;
//   translations: CategoryTranslation[] | null;
//   media: Media | null;
//   products?: Product[] | null;
//   nestedProducts?: Product[] | null;
//   afterCategoryId: string | null;
//   customFields: CustomFields | null;
//   tags?: Tag[] | null;
//   cmsPageId: string | null;
//   cmsPage: CmsPage | null;
//   slotConfig?: [] | null;
//   externalLink: string | null;
//   linkNewTab: boolean | null;
//   visible: boolean;
//   type: CategoryType;
//   description: string | null;
//   id: string;
//   parentVersionId?: string;
//   childrenCount?: number;
//   afterCategoryVersionId?: string;
//   path?: string;
//   route?: {
//     path?: string;
//   };
//   seoUrls: SeoUrl[] | null;
//   metaTitle: string | null;
//   metaDescription: string | null;
//   keywords: string | null;
//   translated: {
//     name: string;
//     breadcrumb: string[];
//     description: string | null;
//     externalLink: string | null;
//     metaTitle: string | null;
//     metaDescription: string | null;
//     keywords: string | null;
//     customFields: CustomFields | null;
//     linkType: string | null;
//     internalLink: string | null;
//     linkNewTab: string | null;
//   };
//   linkType: "product" | "category" | "landing_page" | string | null;
//   internalLink: string | null;
//   extensions?: unknown;
//   visibleChildCount?: number | null;
//   cmsPageIdSwitched?: boolean;
//   productAssignmentType?: string;
//   customEntityTypeId?: string | null;
// };
