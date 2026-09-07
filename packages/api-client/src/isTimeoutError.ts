function isNamedTimeoutError(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { name?: unknown }).name === "TimeoutError"
  );
}

/**
 * Whether a request failed because `fetchOptions.timeout` ran out.
 * Such a request never reaches the API, so it rejects with a plain
 * `FetchError` without an HTTP status and carries the timeout as its `cause`.
 */
export function isTimeoutError(error: unknown): boolean {
  return (
    isNamedTimeoutError(error) ||
    (typeof error === "object" &&
      error !== null &&
      isNamedTimeoutError((error as { cause?: unknown }).cause))
  );
}
