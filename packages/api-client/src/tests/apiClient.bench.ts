import { test } from "vitest";

import { createAPIClient, createAdminAPIClient } from "..";

test("apiClient benchmarks", async ({ bench }) => {
  await bench.compare(
    bench("[api-client][createAPIClient] - creating client", async () => {
      createAPIClient({
        baseURL: "https://example.com",
        accessToken: "123",
      });
    }),
    bench("[api-client][createAdminAPIClient] - creating client", async () => {
      createAdminAPIClient({
        baseURL: "https://example.com",
      });
    }),
  );
});
