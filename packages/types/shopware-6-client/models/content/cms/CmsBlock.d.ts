import type { CustomFields } from "../../common/CustomField";
import type { Media } from "../media/Media";
import type {
  BackgroundMediaMode,
  CmsSection,
  CmsSlot,
  CmsVisibility,
  MobileBehavior,
  SizingMode,
} from "./CmsPage";
/**
 * @public
 */
export type CmsBlock = {
  apiAlias: "cms_block";
  createdAt: string;
  customFields: CustomFields;
  extensions: unknown;
  id: string;
  locked: true;
  marginBottom: string | null;
  marginLeft: string | null;
  marginRight: string | null;
  marginTop: string | null;
  name: string;
  position: number;
  section: CmsSection | null;
  sectionId: string;
  sectionPosition: unknown;
  slots: CmsSlot[];
  translated: unknown;
  type: string;
  updatedAt: Date | string | null;
  versionId: string | null;
  _uniqueIdentifier: string;
  sizingMode: SizingMode;
  mobileBehavior: MobileBehavior;
  backgroundColor: string | null;
  backgroundMediaId: string | null;
  backgroundMedia?: Media;
  backgroundMediaMode: BackgroundMediaMode;
  cssClass: string | null;
  visibility: {
    [key in CmsVisibility]: boolean;
  };
};
