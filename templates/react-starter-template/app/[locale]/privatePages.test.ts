import { describe, expect, it, vi } from "vitest";

import * as checkoutLayout from "./(checkout)/layout";
import * as memberLayout from "./(shop)/account/(member)/layout";
import { generateMetadata as recoverMetadata } from "./(shop)/account/recover/page";
import { generateMetadata as resetPasswordMetadata } from "./(shop)/account/recover/password/page";
import { generateMetadata as successMetadata } from "./(shop)/checkout/success/[id]/page";
import { generateMetadata as paidMetadata } from "./(shop)/checkout/success/[id]/paid/page";
import { generateMetadata as unpaidMetadata } from "./(shop)/checkout/success/[id]/unpaid/page";
import { generateMetadata as wishlistMetadata } from "./(shop)/wishlist/page";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const PRIVATE = { index: false, follow: true };

function params(locale: string) {
  return Promise.resolve({ locale, id: "order-1" });
}

describe("personal pages stay out of search indexes", () => {
  it("marks the checkout and account layouts noindex, follow", () => {
    expect(checkoutLayout.metadata).toEqual({ robots: PRIVATE });
    expect(memberLayout.metadata).toEqual({ robots: PRIVATE });
  });

  it.each([
    ["the order success page", successMetadata],
    ["the paid page", paidMetadata],
    ["the unpaid page", unpaidMetadata],
    ["the wishlist", wishlistMetadata],
    ["the password recovery page", recoverMetadata],
  ])("marks %s noindex, follow", async (_, generateMetadata) => {
    const metadata = await generateMetadata({ params: params("en-GB") });

    expect(metadata.robots).toEqual(PRIVATE);
    expect(metadata.title).toBeTruthy();
  });

  it("keeps the password reset link out of indexes, links and referrers", async () => {
    const metadata = await resetPasswordMetadata({ params: params("en-GB") });

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.referrer).toBe("no-referrer");
    expect(metadata.title).toBeTruthy();
  });
});
