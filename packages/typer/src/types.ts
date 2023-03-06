import type { TsDoxClass, TsDoxProperty } from "ts-dox/lib/runtime";

export type Metadata = TsDoxClass;
export type Property = TsDoxProperty;

/**
 * Output table row for property
 */
export type PropertyMdTableRow = {
  /**
   * Property key
   */
  key: string;
  /**
   * Property type
   */
  type: string;
  /**
   * Property description
   */
  description: string;
};
