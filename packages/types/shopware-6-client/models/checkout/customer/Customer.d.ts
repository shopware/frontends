import type { Schemas } from "#shopware";
import { CustomFields } from "../../common/CustomField";
import { ProductReview } from "../../content/product/ProductReview";
import { Tag } from "../../system/tag/Tag";
import { OrderCustomer } from "../order/OrderCustomer";
import { PaymentMethod } from "../payment/PaymentMethod";
import { Promotion } from "../promotion/Promotion";
import { BillingAddress } from "./BillingAddress";
import { CustomerAddress } from "./CustomerAddress";
import { CustomerGroup } from "./CustomerGroup";
import { ShippingAddress } from "./ShippingAddress";

/**
 * @deprecated use {@link Schemas['Customer']} from "#shopware" import instead
 */
export type Customer = Schemas["Customer"];
// export type Customer = {
//   id: string;
//   groupId: string;
//   defaultPaymentMethodId: string;
//   salesChannelId: string;
//   languageId: string;
//   lastPaymentMethodId: string | null;
//   defaultBillingAddressId: string | null;
//   defaultShippingAddressId: string | null;
//   customerNumber: number;
//   salutationId: string | null;
//   firstName: string;
//   lastName: string;
//   company: string | null;
//   email: string;
//   title: string | null;
//   active: boolean;
//   guest: boolean;
//   firstLogin: Date | null;
//   lastLogin: Date | null;
//   newsletter: boolean;
//   birthday: Date;
//   lastOrderDate: Date;
//   orderCount: number;
//   createdAt: Date;
//   updatedAt: Date | string | null;
//   group: CustomerGroup;
//   defaultPaymentMethod: PaymentMethod;
//   defaultBillingAddress: BillingAddress;
//   defaultShippingAddress: ShippingAddress;
//   activeBillingAddress: BillingAddress;
//   activeShippingAddress: ShippingAddress;
//   addresses: Array<CustomerAddress>;
//   orderCustomers: Array<OrderCustomer> | null;
//   autoIncrement: number;
//   tags: Tag[] | null;
//   promotions: Promotion[] | null;
//   customFields: CustomFields;
//   productReviews: ProductReview[];
//   doubleOptInConfirmDate: null | string;
//   doubleOptInEmailSentDate: string;
//   doubleOptInRegistration: boolean;
// };
