import type { Schemas, operations } from "#shopware";

type RegisterBody = operations["register post /account/register"]["body"];
type RegisterPayload = Omit<RegisterBody, "storefrontUrl">;
type RegisterConfirmBody =
  operations["registerConfirm post /account/register-confirm"]["body"];
type Customer = Schemas["Customer"];
type CustomerAddress = Schemas["CustomerAddress"];
