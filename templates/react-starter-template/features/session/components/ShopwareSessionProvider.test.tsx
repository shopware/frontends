import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import { useSession } from "./SessionProvider";
import { ShopwareSessionProvider } from "./ShopwareSessionProvider";

const browser = vi.hoisted(() => ({
  loadPublicConfig: vi.fn(),
  createBrowserClient: vi.fn(),
}));

vi.mock("@/features/session/browserClient", () => ({
  CONTEXT_TOKEN_COOKIE: "sw-context-token",
  loadPublicConfig: browser.loadPublicConfig,
  createBrowserClient: browser.createBrowserClient,
}));

function SessionStatus() {
  const { status, isLoggedIn } = useSession();
  return <p data-testid="session">{`${status}:${String(isLoggedIn)}`}</p>;
}

describe("ShopwareSessionProvider on the server", () => {
  it("renders the anonymous loading session without touching the Store API", async () => {
    const html = await renderToHtml(
      <ShopwareSessionProvider notify={() => {}}>
        <SessionStatus />
      </ShopwareSessionProvider>,
    );

    expect(html).toContain('<p data-testid="session">loading:false</p>');
    expect(browser.loadPublicConfig).not.toHaveBeenCalled();
    expect(browser.createBrowserClient).not.toHaveBeenCalled();
  });
});
