function isNamedTimeoutError(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { name?: unknown }).name === "TimeoutError"
  );
}

/**
 * Whether a request failed because `fetchOptions.timeout` ran out, so the
 * client did not receive the complete response in time. The rejected error has
 * no HTTP status and names the timeout itself or in its `cause`. The request
 * may already have reached the API and been processed, so the server-side
 * outcome is unknown; do not retry a mutation without checking.
 */
export function isTimeoutError(error: unknown): boolean {
  return (
    isNamedTimeoutError(error) ||
    (typeof error === "object" &&
      error !== null &&
      isNamedTimeoutError((error as { cause?: unknown }).cause))
  );
}
