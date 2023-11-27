import type { RequestParameters } from "#shopware";

/**
 *
 * docs: https://shopware.stoplight.io/docs/store-api/storeapi.json/paths/~1account~1register/post
 *
 * @deprecated use {@link RequestParameters<'register'>} from "#shopware" import instead
 */
export type CustomerRegistrationParams = RequestParameters<"register">;
// export type CustomerRegistrationParams = {
//   salutationId: string;
//   firstName: string;
//   lastName: string;
//   /**
//    * Password for the customer. Required, unless `guest` is `true`
//    */
//   password?: string;
//   /**
//    * If set, will create a guest customer. Guest customers can re-use an email address and don't need a password.
//    */
//   guest?: boolean;
//   email: string;
//   title?: string;
//   birthdayYear?: number;
//   birthdayMonth?: number;
//   birthdayDay?: number;
//   billingAddress: Partial<BillingAddress> /** TODO: replace Partial with correct optional fields in BillingAddress */;
//   shippingAddress?: ShippingAddress;
// };
