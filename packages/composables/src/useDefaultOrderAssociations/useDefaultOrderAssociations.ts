import type { Schemas } from "#shopware";

/**
 * Returns default order associations. You can override this composable in your project.
 * @public
 * @category Order
 */
export function useDefaultOrderAssociations(): Schemas["Criteria"]["associations"] {
  const orderAssociations = {
    stateMachineState: {},
    lineItems: {
      associations: {
        cover: {},
        downloads: {
          associations: {
            media: {},
          },
        },
      },
    },
    addresses: {},
    deliveries: {
      associations: {
        shippingMethod: {},
        shippingOrderAddress: {},
        stateMachineState: {},
      },
    },
    transactions: {
      associations: {
        paymentMethod: {},
        stateMachineState: {},
      },
    },
  };

  return orderAssociations;
}
