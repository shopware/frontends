import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { test as base } from "@playwright/test";

export const NETWORK_LOG = "diagnostics/network-failures.jsonl";

type Entry = Record<string, unknown>;

/**
 * Records storefront 5xx and failed store-api calls. Nitro does not log either,
 * so without this a backend stall reaches CI as an anonymous locator timeout
 * and there is nothing to hand to whoever owns the backend.
 */
export const test = base.extend<{ networkDiagnostics: void }>({
  networkDiagnostics: [
    async ({ page }, use, testInfo) => {
      const record = (entry: Entry) => {
        try {
          mkdirSync(dirname(NETWORK_LOG), { recursive: true });
          appendFileSync(
            NETWORK_LOG,
            `${JSON.stringify({ test: testInfo.titlePath.join(" > "), ...entry })}\n`,
          );
        } catch {
          // Diagnostics must never fail a test.
        }
      };

      page.on("requestfailed", (request) => {
        if (!request.url().includes("/store-api/")) return;
        record({
          kind: "store-api-no-response",
          url: request.url(),
          method: request.method(),
          failure: request.failure()?.errorText ?? null,
        });
      });

      page.on("response", async (response) => {
        if (response.status() < 500) return;
        const url = response.url();

        if (url.includes("/store-api/")) {
          record({ kind: "store-api-5xx", url, status: response.status() });
          return;
        }
        if (response.request().resourceType() !== "document") return;

        // The upstream cause is only in the rendered error page, never in a log.
        let cause: string | null = null;
        try {
          cause =
            (await response.text()).match(
              /\[(?:GET|POST|PUT|DELETE)\][^<"]{0,200}/,
            )?.[0] ?? null;
        } catch {
          cause = null;
        }
        record({
          kind: "storefront-5xx",
          url,
          status: response.status(),
          cause,
        });
      });

      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
