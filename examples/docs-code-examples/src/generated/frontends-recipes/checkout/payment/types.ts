import type { Schemas, operations } from "#shopware";

type HandlePaymentBody =
  operations["handlePaymentMethod post /handle-payment"]["body"];
type HandlePaymentResponse =
  operations["handlePaymentMethod post /handle-payment"]["response"];
type SetPaymentBody = operations["orderSetPayment post /order/payment"]["body"];
type OrderTransaction = Schemas["OrderTransaction"];
type StateMachineState = Schemas["StateMachineState"];
type Order = Schemas["Order"];
