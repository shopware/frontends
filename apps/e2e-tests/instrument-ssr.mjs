// Records Store API calls made during SSR, which Playwright cannot see.
// Test-only: loaded with NODE_OPTIONS=--import, never by the app itself.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LOG = process.env.SSR_NETWORK_LOG;
if (LOG) {
  const original = globalThis.fetch;

  // Buffered: a synchronous write per call would add blocking I/O to the very
  // latency being measured. Flushed on a timer and on exit.
  const buffer = [];

  const flush = () => {
    if (buffer.length === 0) return;
    const lines = buffer.splice(0, buffer.length).join("");
    try {
      mkdirSync(dirname(LOG), { recursive: true });
      appendFileSync(LOG, lines);
    } catch {
      // Diagnostics must never break the server.
    }
  };

  const timer = setInterval(flush, 2000);
  timer.unref?.();
  for (const signal of ["exit", "SIGINT", "SIGTERM"]) {
    process.once(signal, flush);
  }

  const write = (entry) => {
    buffer.push(
      `${JSON.stringify({ at: new Date().toISOString(), side: "ssr", ...entry })}\n`,
    );
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
        // A late render looks like a broken one, so measure latency too.
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
