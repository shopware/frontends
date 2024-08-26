import type { Schemas } from "#shopware";

export type UseDefaultOrderAssociationsReturn = Schemas["Criteria"] & {
  checkPromotion?: boolean;
};

/**
 * Returns default order associations. You can override this composable in your project.
 * @public
 */
export function useDefaultOrderAssociations(): UseDefaultOrderAssociationsReturn {
  const orderAssociations: Schemas["Criteria"] & { checkPromotion?: boolean } =
    {
      associations: {
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
      },
      checkPromotion: true,
    };

  return orderAssociations;
}
