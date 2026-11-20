import { describe, expect, it, vi } from "vitest";

import { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

describe("AccountOverviewPage", () => {
  it("is titled like the Vue overview header in the page locale", async () => {
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "en-GB" }) }),
    ).toEqual({ title: "Overview" });
    expect(
      await generateMetadata({ params: Promise.resolve({ locale: "pl-PL" }) }),
    ).toEqual({ title: "Przegląd" });
  });
});
