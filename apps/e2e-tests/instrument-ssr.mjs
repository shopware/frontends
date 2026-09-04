// Wraps fetch in the storefront's own Node process, so Store API calls made
// during SSR are recorded too. The Playwright collector only sees the browser,
// and SSR is where a failed call turns into a 500 page.
//
// Test-only: loaded with NODE_OPTIONS=--import, never by the app itself.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LOG = process.env.SSR_NETWORK_LOG;
if (LOG) {
  const original = globalThis.fetch;

  const write = (entry) => {
    try {
      mkdirSync(dirname(LOG), { recursive: true });
      appendFileSync(
        LOG,
        `${JSON.stringify({ at: new Date().toISOString(), side: "ssr", ...entry })}\n`,
      );
    } catch {
      // Diagnostics must never break the server.
    }
  };

  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string" ? input : (input?.url ?? String(input));
    if (!url.includes("/store-api/")) return original(input, init);

    const startedAt = Date.now();
    try {
      const response = await original(input, init);
      if (response.status >= 400) {
        write({
          kind: `store-api-${response.status === 429 ? "throttled" : response.status}`,
          url,
          status: response.status,
          traceId: response.headers.get("x-trace-id"),
          ms: Date.now() - startedAt,
        });
      } else {
        // Latency, not just failures. A page that renders too late looks
        // identical to a broken one from a test's point of view, and without
        // this there is nothing to tell the two apart.
        write({ kind: "store-api-ok", url, ms: Date.now() - startedAt });
      }
      return response;
    } catch (error) {
      write({
        kind: "store-api-no-response",
        url,
        failure: `${error?.name ?? "Error"}: ${error?.message ?? error}`,
        cause: error?.cause ? String(error.cause?.code ?? error.cause) : null,
        ms: Date.now() - startedAt,
      });
      throw error;
    }
  };
}
