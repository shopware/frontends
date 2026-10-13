import { describe, expect, it } from "vitest";

import InternalNotFoundPage from "./page";

describe("InternalNotFoundPage", () => {
  it("renders the not-found boundary with a 404 status", () => {
    let thrown: unknown;
    try {
      InternalNotFoundPage();
    } catch (error) {
      thrown = error;
    }

    expect((thrown as { digest?: string }).digest).toBe(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
  });
});
