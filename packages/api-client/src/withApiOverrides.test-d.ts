import { describe, expectTypeOf, it } from "vitest";

import type { WithApiOverrides } from "./withApiOverrides";

describe("WithApiOverrides", () => {
  type Base = {
    keep: { a: string };
    replace: { a: string };
  };

  type Override = {
    replace: { b: number };
    add: { c: boolean };
  };

  type Merged = WithApiOverrides<Base, Override>;

  it("keeps untouched keys from the base map", () => {
    expectTypeOf({ a: "x" } as Merged["keep"]).toEqualTypeOf<{ a: string }>({
      a: "x",
    });
  });

  it("replaces overridden keys instead of intersecting them", () => {
    expectTypeOf({ b: 1 } as Merged["replace"]).toEqualTypeOf<{ b: number }>({
      b: 1,
    });
  });

  it("adds keys that only exist on the override", () => {
    expectTypeOf({ c: true } as Merged["add"]).toEqualTypeOf<{ c: boolean }>({
      c: true,
    });
  });

  it("is a no-op with an empty override", () => {
    type NoOverride = Record<never, never>;
    expectTypeOf({
      keep: { a: "x" },
      replace: { a: "x" },
    } as WithApiOverrides<Base, NoOverride>).toEqualTypeOf<Base>({
      keep: { a: "x" },
      replace: { a: "x" },
    });
  });
});
