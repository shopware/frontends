import { Media } from "../models/content/media/Media";
import { CustomField } from "../../common/CustomField";

/**
 * @beta
 */
export type AggregationFilterEntity = {
  id: string;
  name: string;
  displayType: string;
  sortingType: string;
  description: string | null;
  position: number;
  options: AggregationFilterEntityOption[];
};

/**
 * @beta
 */
export type AggregationFilterEntityOption = {
  groupId: string;
  name: string;
  position: number;
  colorHexCode: string | null;
  mediaId: string | null;
  group: string;
  translations: unknown | null;
  productConfiguratorSettings: unknown | null;
  productProperties: unknown | null;
  productOptions: unknown | null;
  media: Media | null;
  customFields: unknown | null;
  _uniqueIdentifier: string;
  versionId: null;
  translated: {
    name: string;
    position: number;
    customFields: CustomField[] | null;
  };
  createdAt: Date;
  updatedAt: null;
  extensions: {
    foreignKeys: {
      apiAlias: string;
    };
  };
  id: string;
  apiAlias: string;
};

export type AggregationProductListingEntities = {
  apiAlias: string;
  name?: string;
  colorHexCode?: string;
  createdAt: Date;
  customFields: CustomField[];
  description: string;
  extensions: unknown;
  id: string;
  link: string | null;
  media: Media | null;
  translated: {
    customFields: CustomField[];
    description: string;
    name: string;
  };
  translations: unknown;
  updatedAll: Date | null;
  versionId: string;
  _uniqueIdentifier: string;
};

export type EntitiesAggregation<ENTITY_TYPE> = {
  id: string;
  name: string;
  entities: ENTITY_TYPE[];
};

export type MaxAggregation = {
  id: string;
  name: string;
  max: number;
  apiAlias: string;
};

export type PriceAggregation = {
  id: string;
  name: string;
  min: number;
  max: number;
  avg: number;
  sum: number;
  apiAlias: string;
};

/**
 * @public
 */
export type Aggregations = {
  manufacturer: EntitiesAggregation<AggregationFilterEntity>;
  price: PriceAggregation;
  "shipping-free": MaxAggregation;
  rating: MaxAggregation;
  properties: EntitiesAggregation<AggregationFilterEntity>;
};
