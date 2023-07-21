/**
 * @beta
 */
export type EntityResult<ENTITY extends string, ELEMENTS_ENTITY_TYPE> = {
  entity: ENTITY;
  total: number;
  aggregations: unknown[];
  page: number;
  limit: null | number;
  elements: ELEMENTS_ENTITY_TYPE extends unknown[]
    ? ELEMENTS_ENTITY_TYPE
    : ELEMENTS_ENTITY_TYPE[];
  apiAlias: string;
};
