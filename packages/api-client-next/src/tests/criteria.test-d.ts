import { describe, expectTypeOf, it, assertType } from "vitest";
import type { Schemas } from "../../api-types/storeApiTypes";

type Criteria = Schemas["Criteria"];

describe("Criteria type", () => {
  it("Associations", () => {
    type Associations = Criteria["associations"];

    // allow empty object
    assertType<Associations>({});

    // allow undefined
    assertType<Associations>(undefined);

    // allow passing config
    expectTypeOf({
      media: {},
    }).toMatchTypeOf<Associations>();

    // allow nested config
    expectTypeOf({
      media: {
        nestedValue: {},
      },
    }).toMatchTypeOf<Associations>();

    // do not allow string values
    expectTypeOf({
      media: "should not be allowed",
    }).not.toEqualTypeOf<Associations>();

    // do not allow number values
    expectTypeOf({
      media: 123,
    }).not.toEqualTypeOf<Associations>();
  });
});
