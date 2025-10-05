import { assertType, describe, expectTypeOf, it } from "vitest";
import type { Schemas } from "../../api-types/storeApiTypes";

type Associations = Schemas["Association"];

describe("Criteria type", () => {
  it("Associations", () => {
    // allow empty object
    assertType<Associations>({});

    // allow undefined
    assertType<Schemas["Criteria"]["associations"]>(undefined);

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
