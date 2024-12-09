import type { Salutation } from "../../system/salutation/Salutation";
import type { Customer } from "../customer/Customer";
import type { Order } from "./Order";

/**
 * @public
 */
export type OrderCustomer = {
  email: string;
  orderId: string;
  salutationId: string;
  firstName: string;
  lastName: string;
  title: string | null;
  company: string | null;
  customerNumber: string | null;
  customerId: string;
  customer: Customer | null;
  salutation: Salutation | null;
  order: Order | null;
};
