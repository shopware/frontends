/**
 * Merge local API type overrides onto a base operations or schemas map.
 *
 * Override keys replace the matching base key instead of intersecting with it,
 * so a redefined operation body does not collapse to `never`. New keys are
 * added. An empty override is a no-op.
 *
 * Use this from `shopware.d.ts` so override-only projects can keep the types
 * shipped with `@shopware/api-client` and a small `*.overrides.ts` file, without
 * committing a generated `storeApiTypes.d.ts`. That is what lets StackBlitz
 * examples typecheck after `npm install` with no generate step.
 */
export type WithApiOverrides<Base, Override> = [keyof Override] extends [never]
  ? Base
  : Omit<Base, Extract<keyof Override, keyof Base>> & Override;
