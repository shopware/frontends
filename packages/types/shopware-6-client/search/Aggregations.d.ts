/**
 * @beta
 */
export type AggregationFilterEntity = {
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
  translations: any | null;
  productConfiguratorSettings: any | null;
  productProperties: any | null;
  productOptions: any | null;
  media: any | null;
  customFields: any | null;
  _uniqueIdentifier: string;
  versionId: null;
  translated: {
    name: string;
    position: number;
    customFields: [];
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

export type EntitiesAggregation<ENTITY_TYPE> = {
  entities: ENTITY_TYPE[];
};

export type MaxAggregation = {
  max: number;
  apiAlias: string;
};

export type PriceAggregation = {
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
