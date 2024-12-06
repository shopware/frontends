import { Customer } from "../../checkout/customer/Customer";
import { Document } from "../../checkout/document/Document";
import { DocumentBaseConfig } from "../../checkout/document/DocumentBaseConfig";
import { OrderLineItem } from "../../checkout/order/OrderLineItem";
import { PaymentMethod } from "../../checkout/payment/PaymentMethod";
import { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import type { CustomFields } from "../../common/CustomField";
import { Tag } from "../../system/tag/Tag";
import { Category } from "../category/Category";
import { CmsBlock } from "../cms/CmsBlock";
import { MailTemplateMedia } from "../mail-template/MailTemplateMedia";
import { ProductManufacturer } from "../product/ProductManufacturer";
import { ProductMedia } from "../product/ProductMedia";
import { PropertyGroupOption } from "../property/PropertyGroupOption";
import { MediaFolder } from "./MediaFolder";
import type { MediaThumbnail } from "./MediaThumbnail";
import type { MediaTranslation } from "./MediaTranslation";
import { MediaType } from "./MediaType";

/**
 * @public
 */
export type Media = {
  mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | string;
  fileExtension: "jpg" | "png" | "gif" | "webp" | string;
  fileSize: number;
  title: null | string;
  metaData?: {
    hash?: string;
    type?: number;
    width?: number;
    height?: number;
  };
  uploadedAt: Date | string | null;
  alt: null | string;
  url: string;
  fileName: string;
  translations: null | MediaTranslation[];
  thumbnails: MediaThumbnail[];
  hasFile: boolean;
  private: boolean;
  _uniqueIdentifier?: string;
  versionId?: null | string;
  translated: {
    alt: null | string;
    title: null | string;
    customFields: CustomFields | null;
  };
  createdAt: string;
  updatedAt: Date | string | null;
  extensions?: unknown;
  id: string;
  customFields: CustomFields | null;
  apiAlias: "media";
};
