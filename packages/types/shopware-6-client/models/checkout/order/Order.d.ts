import type { Schemas } from "#shopware";
import type { CustomFields } from "../../common/CustomField";
import { Language } from "../../framework/language/Language";
import { Currency } from "../../system/currency/Currency";
import { SalesChannel } from "../../system/sales-channel/SalesChannel";
import { StateMachineState } from "../../system/state-machine/StateMachineState";
import { Tag } from "../../system/tag/Tag";
import { CustomerAddress } from "../customer/CustomerAddress";
import { Delivery } from "../delivery/Delivery";
import { OrderDocument } from "./OrderDocument";
import { OrderLineItem } from "./OrderLineItem";
import { OrderTransaction } from "./OrderTransaction";

interface CalculatedTax {
  tax: number;
  taxRate: number;
  price: number;
  extensions: any[];
}
interface TaxRule {
  taxRate: number;
  percentage: number;
  extensions: any[];
}
interface Price {
  netPrice: number;
  totalPrice: number;
  calculatedTaxes: CalculatedTax[];
  taxRules: TaxRule[];
  positionPrice: number;
  taxStatus: string;
  extensions: any[];
}

interface ShippingCost {
  unitPrice: number;
  quantity: number;
  calculatedTaxes: CalculatedTax[];
  taxRules: TaxRule[];
  referencePrice: number | null;
  listPrice: number | null;
  extensions: any[];
}

interface OrderCustomer {
  email: string;
  orderId: string;
  salutationId: string;
  firstName: string;
  lastName: string;
  title: null;
  company: null;
  customerNumber: number;
  customerId: string;
  customer: null;
  salutation: null;
  order: null;
  customFields: CustomFields;
  remoteAddress: string;
  _uniqueIdentifier: string;
  versionId: string;
  translated: [];
  createdAt: Date;
  updatedAt: Date | string | null;
  extensions: unknown;
  id: string;
  orderVersionId: string;
}

/**
 * @deprecated use Schemas['Order'] from "#shopware" import instead
 */
export type Order = Schemas["Order"];

// {
//   orderNumber: number;
//   currencyId: string;
//   currencyFactor: number;
//   salesChannelId: string;
//   billingAddressId: string;
//   orderDateTime: Date;
//   orderDate: Date;
//   price: Price;
//   amountTotal: number;
//   amountNet: number;
//   positionPrice: number;
//   taxStatus: string;
//   shippingCosts: ShippingCost;
//   shippingTotal: number;
//   orderCustomer: OrderCustomer;
//   currency: Currency | null;
//   languageId: string;
//   language: Language | null;
//   salesChannel: SalesChannel | null;
//   addresses: CustomerAddress[];
//   deliveries: Delivery[];
//   lineItems: OrderLineItem[] | null;
//   transactions: OrderTransaction[] | null;
//   deepLinkCode: string;
//   stateMachineState: StateMachineState;
//   stateId: string;
//   customFields: CustomFields;
//   documents: OrderDocument[];
//   tags: Tag[] | null;
//   affiliateCode: string | null;
//   campaignCode?: string;
//   _uniqueIdentifier: string;
//   versionId: string;
//   translated: any[];
//   createdAt: Date;
//   updatedAt: Date | string | null;
//   extensions: unknown;
//   id: string;
//   billingAddressVersionId: string;
// };
