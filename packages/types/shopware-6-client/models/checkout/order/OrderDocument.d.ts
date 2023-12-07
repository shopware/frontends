import type { Schemas } from "#shopware";

/**
 * @deprecated use {@link Schemas["Document"]} from "#shopware" import instead
 */
export type OrderDocument = Schemas["Document"];
// export type OrderDocument = {
//   id: string;
//   deepLinkCode: string;
//   sent: boolean;
//   config: {
//     name: string;
//     title: string;
//   };
//   orderId: string;
//   fileType: string;
//   createdAt: Date;
//   updatedAt: Date | string | null;
// };
