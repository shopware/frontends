import { describe, expect, it } from "vitest";
import { useSetup } from "./_test";
import { useDefaultOrderAssociations } from "./useDefaultOrderAssociations";

describe("useDefaultOrderAssociations", () => {
  it("returns default associations object", async () => {
    const { vm } = useSetup(() => useDefaultOrderAssociations());

    expect(vm).toMatchInlineSnapshot(`
      {
        "associations": {
          "addresses": {},
          "deliveries": {
            "associations": {
              "shippingMethod": {},
              "shippingOrderAddress": {},
              "stateMachineState": {},
            },
          },
          "lineItems": {
            "associations": {
              "cover": {},
              "downloads": {
                "associations": {
                  "media": {},
                },
              },
            },
          },
          "stateMachineState": {},
          "transactions": {
            "associations": {
              "paymentMethod": {},
              "stateMachineState": {},
            },
          },
        },
        "checkPromotion": true,
      }
    `);
  });
});
