export type LtRangeFilter = {
  lt: string | number;
};

/**
 * @alpha
 */
export type GtRangeFilter = {
  gt: string | number;
};

/**
 * @alpha
 */
export type LteRangeFilter = {
  lte: string | number;
};

/**
 * @alpha
 */
export type GteRangeFilter = {
  gte: string | number;
};

/**
 * @alpha
 */
export type LtGtRangeFilter = {
  lt: string | number;
  gt: string | number;
};

/**
 * @alpha
 */
export type LtGteRangeFilter = {
  lt: string | number;
  gte: string | number;
};

/**
 * @alpha
 */
export type LteGtRangeFilter = {
  lte: string | number;
  gt: string | number;
};

/**
 * @alpha
 */
export type LteGteRangeFilter = {
  lte: string | number;
  gte: string | number;
};
