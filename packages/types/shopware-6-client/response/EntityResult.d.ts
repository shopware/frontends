/**
 * @beta
 */
export type EntityResult<ENTITY, ENTITY_TYPE> = {
  entity: ENTITY;
  total: number;
  aggregations: unknown[];
  page: number;
  limit: null | number;
  elements: ENTITY_TYPE;
  apiAlias: string;
};
