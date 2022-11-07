export type EqualsFilter = {
  type: "equals";
  field: string;
  value: string | number;
};

export type EqualsAnyFilter = {
  type: "equalsAny";
  field: string;
  value: string[] | number[];
};

export type ContainsFilter = {
  type: "contains";
  field: string;
  value: string;
};

export type RangeFilter = {
  type: "range";
  field: string;
  parameters: {
    lt?: string | number;
    gt?: string | number;
    lte?: string | number;
    gte?: string | number;
  };
};

export type MultiFilter = {
  type: "multi";
  operator: "AND" | "OR";
  queries: Array<EqualsFilter | EqualsAnyFilter | RangeFilter | MultiFilter>;
};

export type NotFilter = {
  type: "not";
  queries: Array<EqualsFilter | EqualsAnyFilter | RangeFilter | MultiFilter>;
};

export type PrefixFilter = {
  type: "prefix";
  field: string;
  value: string;
};

export type SuffixFilter = {
  type: "prefix";
  field: string;
  value: string;
};
