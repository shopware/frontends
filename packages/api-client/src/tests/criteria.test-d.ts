import { assertType, describe, expectTypeOf, it } from "vitest";

import type { Schemas } from "../../api-types/storeApiTypes";

type Associations = Schemas["Associations"];

describe("Criteria type", () => {
  it("Associations", () => {
    // allow empty object
    assertType<Associations>({});

    // allow undefined
    assertType<Schemas["Criteria"]["associations"]>(undefined);

    // allow passing config
    expectTypeOf({
      media: {},
    }).toExtend<Associations>();

    // allow nested config
    expectTypeOf({
      media: {
        associations: {
          nestedValue: {},
        },
      },
    }).toExtend<Associations>();

    // do not allow string values
    expectTypeOf({
      media: "should not be allowed",
    }).not.toExtend<Associations>();

    // do not allow number values
    expectTypeOf({
      media: 123,
    }).not.toExtend<Associations>();
  });
});
