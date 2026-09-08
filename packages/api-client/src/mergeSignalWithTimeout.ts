import type { FetchOptions } from "ofetch";

/**
 * `setTimeout` truncates anything above a signed 32-bit integer and fires
 * almost immediately instead, so a larger timeout is capped rather than
 * silently turned into "now".
 */
const MAX_TIMEOUT = 2_147_483_647;

const NOOP = () => {};

/**
 * `setTimeout` coerces its delay, so a value arriving as a string - a timeout
 * read from the environment, for example - keeps working. A timeout that
 * cannot be waited for, so anything that is not a finite positive number once
 * coerced, is treated as no timeout at all. The realistic source is a computed
 * budget such as `deadline - Date.now()` that has already run out.
 */
function normalizeTimeout(value: unknown): number | undefined {
  const milliseconds = Number(value);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return undefined;
  }
  return Math.min(Math.ceil(milliseconds), MAX_TIMEOUT);
}

function timeoutError(): Error {
  return new DOMException(
    "The operation was aborted due to timeout",
    "TimeoutError",
  );
}

/**
 * Resolves the effective timeout for one request and, when the caller also
 * passed a `signal`, combines the two so whichever fires first aborts the
 * request. `fetchOptions` is updated in place and the returned function
 * releases the timer, so the caller must invoke it in a `finally`.
 *
 * ofetch 1.5.1 only arms its own timer when no `signal` is set, which is why a
 * per-request `signal` used to switch the timeout off.
 *
 * TODO: remove this module once the client moves to ofetch 2.0+, which
 * combines `signal` and `timeout` itself - https://github.com/unjs/ofetch/pull/508
 */
export function mergeSignalWithTimeout(
  fetchOptions: FetchOptions<"json">,
  clientTimeout: number | undefined,
): () => void {
  const timeout = normalizeTimeout(fetchOptions.timeout ?? clientTimeout);
  // written back on every path, so an unusable or oversized value behaves the
  // same whether or not the caller passed a signal
  fetchOptions.timeout = timeout;

  if (
    !fetchOptions.signal ||
    timeout === undefined ||
    typeof AbortSignal.any !== "function"
  ) {
    return NOOP;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(timeoutError()), timeout);

  fetchOptions.signal = AbortSignal.any([
    fetchOptions.signal,
    controller.signal,
  ]);
  // the merged signal is now the only timer; leaving `timeout` in place would
  // let ofetch arm a second one as soon as it stops skipping that branch
  fetchOptions.timeout = undefined;

  return () => clearTimeout(timer);
}
