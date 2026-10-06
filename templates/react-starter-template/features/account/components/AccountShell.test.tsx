import { describe, expect, it, vi } from "vitest";

import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { AccountShell } from "./AccountShell";

const route = vi.hoisted(() => ({ pathname: "/account/profile" }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => route.pathname,
}));

function render() {
  return renderToHtml(
    <SessionProvider session={anonymousSession}>
      <AccountShell>
        <p data-testid="account-content">Customer data</p>
      </AccountShell>
    </SessionProvider>,
  );
}

describe("AccountShell", () => {
  it("renders the account navigation with its heading and links", async () => {
    const html = await render();

    expect(html).toMatch(
      /<nav aria-label="Account navigation" class="hidden flex-col gap-3 text-nowrap md:flex">/,
    );
    expect(html).toContain(
      '<h2 class="text-base leading-normal font-bold text-brand-primary">Your account</h2>',
    );
    for (const href of [
      "/account",
      "/account/profile",
      "/account/address",
      "/account/order",
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
    const profileLink = html.match(/<a[^>]*href="\/account\/profile"[^>]*>/);
    expect(profileLink?.[0]).toContain('aria-current="page"');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toContain(">Logout</button>");
  });

  it("lays out the navigation next to the content column", async () => {
    const html = await render();

    expect(html).toMatch(
      /^<div class="container mx-auto mt-5 flex w-full max-w-screen-2xl gap-20 px-4 md:mt-20">/,
    );
    expect(html).toContain('<div class="w-full min-w-0">');
  });

  it("renders the busy skeleton instead of the page before the session is known", async () => {
    const html = await render();

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-testid="account-guard-skeleton"');
    expect(html).not.toContain("Customer data");
  });
});

describe("AccountShell in German", () => {
  it("renders the German navigation with prefixed links and the current page marked", async () => {
    route.pathname = "/de-DE/account/profile";

    const html = await renderToHtml(
      withI18n(
        <SessionProvider session={anonymousSession}>
          <AccountShell>
            <p data-testid="account-content">Customer data</p>
          </AccountShell>
        </SessionProvider>,
        "de-DE",
      ),
    );
    route.pathname = "/account/profile";

    expect(html).toContain('aria-label="Kontonavigation"');
    const profileLink = html.match(
      /<a[^>]*href="\/de-DE\/account\/profile"[^>]*>/,
    );
    expect(profileLink?.[0]).toContain('aria-current="page"');
    expect(html).toContain('href="/de-DE/account/order"');
  });
});
