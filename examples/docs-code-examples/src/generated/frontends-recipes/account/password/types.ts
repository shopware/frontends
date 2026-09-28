import type { Schemas, operations } from "#shopware";

type RecoveryMailBody =
  operations["sendRecoveryMail post /account/recovery-password"]["body"];
type RecoveryExpiredBody =
  operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["body"];
type RecoveryExpiredResponse =
  operations["getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired"]["response"];
type RecoveryConfirmBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];
type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];
type SuccessResponse = Schemas["SuccessResponse"];
