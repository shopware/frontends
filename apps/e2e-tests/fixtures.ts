import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { test as base } from "@playwright/test";
import type { Request } from "@playwright/test";

export const NETWORK_LOG = "diagnostics/network-failures.jsonl";
export const ATTEMPT_LOG = "diagnostics/store-api-attempts.log";

type Entry = Record<string, unknown>;

/**
 * Records storefront 5xx and failed store-api calls. Nitro does not log either,
 * so without this a backend stall reaches CI as an anonymous locator timeout
 * and there is nothing to hand to whoever owns the backend.
 */
export const test = base.extend<{ networkDiagnostics: void }>({
  networkDiagnostics: [
    async ({ page }, use, testInfo) => {
      // Playwright closes the context while requests are still in flight, and
      // Chromium reports those as ERR_FAILED rather than ERR_ABORTED. Counting
      // them would attribute our own teardown to the backend.
      let tearingDown = false;

      // Anchors a failure to the backend's own request id and node, which is
      // what infra needs to find it in their logs. A failed call has no
      // response of its own, so the nearest success before it is the anchor.
      let lastOk: Record<string, unknown> | null = null;

      const record = (entry: Entry) => {
        try {
          mkdirSync(dirname(NETWORK_LOG), { recursive: true });
          appendFileSync(
            NETWORK_LOG,
            `${JSON.stringify({
              at: new Date().toISOString(),
              test: testInfo.titlePath.join(" > "),
              ...entry,
            })}\n`,
          );
        } catch {
          // Diagnostics must never fail a test.
        }
      };

      // How long a call ran before it died separates a timeout somewhere in the
      // chain from a connection dropped at once, e.g. a reused dead keep-alive.
      const startedAt = new Map<Request, number>();
      page.on("request", (request) => {
        if (request.url().includes("/store-api/")) {
          startedAt.set(request, Date.now());
        }
      });

      page.on("requestfailed", (request) => {
        if (!request.url().includes("/store-api/")) return;
        const started = startedAt.get(request);
        startedAt.delete(request);
        record({
          kind: "store-api-no-response",
          url: request.url(),
          method: request.method(),
          failure: request.failure()?.errorText ?? null,
          ms: started ? Date.now() - started : null,
          precededBy: lastOk,
          duringTeardown: tearingDown,
        });
      });

      // Failures alone give no denominator, and 44 bad calls out of 200 and out
      // of 5000 are different problems. Counted on the spot rather than at
      // teardown: Playwright kills the worker after a failure, so a tally
      // flushed at the end would lose exactly the tests that failed most.
      page.on("requestfinished", (request) => startedAt.delete(request));

      // A failed fetch during client side navigation renders Nuxt's error page
      // without any HTTP response, so the status handler below never sees it.
      // Read it off the DOM instead, or the worst failures stay uncounted.
      const seenErrorPages = new Set<string>();
      const recordErrorPage = async () => {
        try {
          const error = await page.evaluate(() => {
            const status = Number(
              document.querySelector("h1")?.textContent?.trim(),
            );
            if (!Number.isInteger(status) || status < 400 || status > 599) {
              return null;
            }
            const message =
              document.querySelector("h2")?.textContent?.trim() ?? null;
            const cause =
              (document.body?.innerText ?? "").match(
                /\[(?:GET|POST|PUT|PATCH|DELETE)\][^\n]{0,200}/,
              )?.[0] ?? null;
            // Nuxt's error page always pairs the status with a status text,
            // so the presence of both is the signal. Requiring the word
            // "error" missed "429 Too Many Requests" entirely, which is the
            // one that actually breaks tests.
            if (!message && !cause) return null;
            return { status, message, cause };
          });
          if (!error) return;

          const key = `${error.status}|${error.cause ?? error.message}`;
          if (seenErrorPages.has(key)) return;
          seenErrorPages.add(key);
          record({ kind: "storefront-error-page", url: page.url(), ...error });
        } catch {
          // Page already closed or mid navigation.
        }
      };

      page.on("framenavigated", (frame) => {
        if (frame === page.mainFrame()) void recordErrorPage();
      });

      page.on("response", async (response) => {
        const status = response.status();

        if (response.url().includes("/store-api/")) {
          // Which node answered. If failures cluster around one address, that
          // narrows it from "the backend" to a specific instance.
          const peer = await response.serverAddr().catch(() => null);
          const at = new Date().toISOString();
          const traceId = response.headers()["x-trace-id"] ?? null;
          if (status < 400) {
            lastOk = { at, traceId, node: peer?.ipAddress ?? null };
          }
          try {
            mkdirSync(dirname(ATTEMPT_LOG), { recursive: true });
            appendFileSync(ATTEMPT_LOG, `${peer?.ipAddress ?? "unknown"}\n`);
          } catch {
            // Diagnostics must never fail a test.
          }
        }
        if (status < 400) return;
        const url = response.url();

        if (url.includes("/store-api/")) {
          // 4xx too: the Store API rate limit answers 429 and is shared across
          // endpoints, so a run can be throttled without a single 5xx. The
          // trace id is what the backend correlates against its own logs.
          record({
            kind:
              status === 429 ? "store-api-throttled" : `store-api-${status}`,
            url,
            status,
            traceId: response.headers()["x-trace-id"] ?? null,
            node:
              (await response.serverAddr().catch(() => null))?.ipAddress ??
              null,
            rateLimit: response.headers()["x-rate-limit-limit"] ?? null,
            rateLimitRemaining:
              response.headers()["x-rate-limit-remaining"] ?? null,
          });
          return;
        }
        if (status < 500) return;
        if (response.request().resourceType() !== "document") return;

        // The upstream cause is only in the rendered error page, never in a log.
        let cause: string | null = null;
        try {
          cause =
            (await response.text()).match(
              /\[(?:GET|POST|PUT|PATCH|DELETE)\][^<"]{0,200}/,
            )?.[0] ?? null;
        } catch {
          cause = null;
        }
        record({
          kind: "storefront-5xx",
          url,
          status,
          cause,
        });
      });

      await use();
      tearingDown = true;

      // Last look: a client rendered error is usually still on screen when the
      // test gives up.
      await recordErrorPage();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
