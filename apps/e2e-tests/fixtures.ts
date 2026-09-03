import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { test as base } from "@playwright/test";
import type { Request } from "@playwright/test";

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
        });
      });

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
            // A page titled with a bare 4xx/5xx and nothing error shaped on it
            // would be a false positive, so require one of the two.
            if (!cause && !/error/i.test(message ?? "")) return null;
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
              /\[(?:GET|POST|PUT|PATCH|DELETE)\][^<"]{0,200}/,
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

      // Last look: a client rendered error is usually still on screen when the
      // test gives up.
      await recordErrorPage();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
