import { test as base } from "@playwright/test";

import config from "../e2e.config";
import { FEATURES, isFeature } from "../utils/e2e-config";

const FLAG_TAG = "@ff:";

export const test = base.extend<{ featureFlags: void }>({
  featureFlags: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      for (const tag of testInfo.tags) {
        if (!tag.startsWith(FLAG_TAG)) continue;
        const flag = tag.slice(FLAG_TAG.length);
        if (!isFeature(flag)) {
          throw new Error(
            `Unknown feature flag tag ${tag}. Known flags: ${FEATURES.join(", ")}.`,
          );
        }
        testInfo.skip(
          config.features?.[flag] === false,
          `feature ${flag} disabled in e2e.config.ts`,
        );
      }
      await use();
    },
    { auto: true },
  ],
});
