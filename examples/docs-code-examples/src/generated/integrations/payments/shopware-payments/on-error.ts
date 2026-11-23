import type { ShopwarePaymentsError } from "./snippet-context";

function onError(error: ShopwarePaymentsError) {
  const setupFailed =
    error.code === "NOT_ELIGIBLE" ||
    error.code === "UNSUPPORTED_CAPABILITY" ||
    error.step === "init" ||
    error.step === "script_load" ||
    error.step === "setup";

  if (setupFailed) {
    console.error(
      "ShopwarePayments setup failed",
      error.code,
      error.correlationId,
    );
    return;
  }

  console.error(
    "ShopwarePayments could not finish the payment session",
    error.code,
    error.step,
    error.correlationId,
  );
}

export { onError };
