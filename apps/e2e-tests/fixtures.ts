import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { test as base } from "@playwright/test";
import type { Request } from "@playwright/test";

export const NETWORK_LOG = "diagnostics/network-failures.jsonl";
export const ATTEMPT_LOG = "diagnostics/store-api-attempts.log";

type Entry = Record<string, unknown>;

/** Nitro logs neither, so without this a stall is just a locator timeout. */
export const test = base.extend<{ networkDiagnostics: void }>({
  networkDiagnostics: [
    async ({ page }, use, testInfo) => {
      // Chromium reports teardown cancellations as ERR_FAILED, not ERR_ABORTED.
      let tearingDown = false;

      // A failed call has no trace id, so anchor it to the last success.
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

      // Separates a timeout in the chain from a connection dropped at once.
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

      // On the spot, not at teardown: a killed worker loses the worst tests.
      page.on("requestfinished", (request) => startedAt.delete(request));

      // A client-side failure renders an error page with no HTTP response.
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
            // Requiring the word "error" missed "429 Too Many Requests".
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
          // Which node answered, in case failures cluster on one.
          const peer = await response.serverAddr().catch(() => null);
          const at = new Date().toISOString();
          const traceId = response.headers()["x-trace-id"] ?? null;
          // Successes only: a 4xx or 5xx is recorded below as well, and
          // counting it in both would inflate the denominator.
          if (status < 400) {
            lastOk = { at, traceId, node: peer?.ipAddress ?? null };
            try {
              mkdirSync(dirname(ATTEMPT_LOG), { recursive: true });
              appendFileSync(ATTEMPT_LOG, `${peer?.ipAddress ?? "unknown"}\n`);
            } catch {
              // Diagnostics must never fail a test.
            }
          }
        }
        if (status < 400) return;
        const url = response.url();

        if (url.includes("/store-api/")) {
          // 4xx too: the shared rate limit answers 429, never a 5xx.
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

      // A client-rendered error is usually still on screen when a test gives up.
      await recordErrorPage();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
