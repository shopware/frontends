/**
 * Merge local API type overrides onto a base operations or schemas map.
 *
 * Override keys replace the matching base key instead of intersecting with it,
 * so a redefined operation body does not collapse to `never`. New keys are
 * added. An empty override is a no-op.
 *
 * @example
 * import type { WithApiOverrides } from "@shopware/api-client";
 * import type { operations as StoreOperations } from "@shopware/api-client/store-api-types";
 *
 * type operations = WithApiOverrides<
 *   StoreOperations,
 *   import("./api-types/storeApiTypes.overrides").operations
 * >;
 */
export type WithApiOverrides<Base, Override> = [keyof Override] extends [never]
  ? Base
  : Omit<Base, Extract<keyof Override, keyof Base>> & Override;
