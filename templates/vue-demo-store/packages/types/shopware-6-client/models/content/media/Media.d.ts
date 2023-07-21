import { MediaType } from "./MediaType";
import { MediaTranslation } from "./MediaTranslation";
import { Category } from "../category/Category";
import { ProductMedia } from "../product/ProductMedia";
import { MediaThumbnail } from "./MediaThumbnail";
import { MediaFolder } from "./MediaFolder";
import { PropertyGroupOption } from "../property/PropertyGroupOption";
import { MailTemplateMedia } from "../mail-template/MailTemplateMedia";
import { Tag } from "../../system/tag/Tag";
import { DocumentBaseConfig } from "../../checkout/document/DocumentBaseConfig";
import { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import { PaymentMethod } from "../../checkout/payment/PaymentMethod";
import { CmsBlock } from "../cms/CmsBlock";
import { Document } from "../../checkout/document/Document";
import { ProductManufacturer } from "../product/ProductManufacturer";
import { OrderLineItem } from "../../checkout/order/OrderLineItem";
import { CustomField } from "../../common/CustomField";
import { Customer } from "../../checkout/customer/Customer";

/**
 * @public
 */
export type Media = {
  mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | string;
  fileExtension: "jpg" | "png" | "gif" | "webp" | string;
  fileSize: number;
  title: null | string;
  metaData: {
    hash: string;
    type: number;
    width: number;
    height: number;
  };
  uploadedAt: string;
  alt: null | string;
  url: string;
  fileName: string;
  translations: null | MediaTranslation[];
  thumbnails: MediaThumbnail[];
  hasFile: boolean;
  private: boolean;
  _uniqueIdentifier: string;
  versionId: null | string;
  translated: {
    alt: null | string;
    title: null | string;
    customFields: unknown;
  };
  createdAt: string;
  updatedAt: null | string;
  extensions: unknown;
  id: string;
  customFields: null | unknown;
  apiAlias: "media";
};
