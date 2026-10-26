import type { Schemas, operations } from "#shopware";

type ChangeProfileBody =
  operations["changeProfile post /account/change-profile"]["body"];
type ChangeEmailBody =
  operations["changeEmail post /account/change-email"]["body"];
type Customer = Schemas["Customer"];
type Salutation = Schemas["Salutation"];
