import { describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { salesChannelContext } from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import { renderToHtml } from "@/test/render";

import { useCart } from "../useCart";
import { CartProvider } from "./CartProvider";

function CartStatus() {
  const { status, count } = useCart();
  return <p data-testid="cart">{`${status}:${count}`}</p>;
}

describe("CartProvider on the server", () => {
  it("renders the loading cart without asking for a client", async () => {
    const getClient = vi.fn(async () => ({}) as ApiClient);

    const html = await renderToHtml(
      <ShopwareClientProvider getClient={getClient}>
        <SessionProvider
          session={toStorefrontSession(salesChannelContext(null))}
        >
          <CartProvider>
            <CartStatus />
          </CartProvider>
        </SessionProvider>
      </ShopwareClientProvider>,
    );

    expect(html).toContain('<p data-testid="cart">loading:0</p>');
    expect(getClient).not.toHaveBeenCalled();
  });
});
