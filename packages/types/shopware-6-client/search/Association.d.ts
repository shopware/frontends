/**
 * @deprecated use {@link Schemas["Criteria"]} from "#shopware" import instead
 */
export type ShopwareAssociation = {
  [name: string]: {
    associations?: ShopwareAssociation;
    sort?:
      | {
          field: string;
          order: string;
          naturalSorting: boolean;
        }[]
      | string;
  };
};
