import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { useCmsActions } from "@/cms/client";
import type { CmsActionResult } from "@/cms/client";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { errorMessages } from "@/features/session/errorMessages";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import {
  apiClientError,
  salesChannelContext,
} from "@/features/session/session.fixture";
import type { SessionActionResult } from "@/features/session/types";
import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { NOT_WIRED_MESSAGES } from "../notWired";
import { StorefrontProviders } from "./StorefrontProviders";

const browser = vi.hoisted(() => ({
  invoke: vi.fn<(operation: string, params?: unknown) => Promise<unknown>>(),
}));

vi.mock("@/features/session/browserClient", () => ({
  CONTEXT_TOKEN_COOKIE: "sw-context-token",
  loadPublicConfig: async (): Promise<PublicShopwareConfig> => ({
    publicEndpoint: "https://shop.test/store-api/",
    accessToken: "SWSCTEST",
    devStorefrontUrl: null,
  }),
  createBrowserClient: () =>
    ({ invoke: browser.invoke }) as unknown as ApiClient,
}));

const TOAST = '[data-testid="notification-element-message"]';

let mounted: Mounted | undefined;

beforeEach(() => {
  browser.invoke.mockReset();
  browser.invoke.mockImplementation(async (operation) => {
    if (operation === "readContext get /context") {
      return { data: salesChannelContext(null), status: 200 };
    }
    throw apiClientError(
      [{ code: "0", detail: "No matching customer for the email found." }],
      401,
    );
  });
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

function SessionConsumer({
  onResult,
}: {
  onResult: (result: SessionActionResult) => void;
}) {
  const session = useSession();
  const { login } = useSessionActions();
  return (
    <>
      <output data-testid="session-status">{session.status}</output>
      <output data-testid="session-logged-in">
        {String(session.isLoggedIn)}
      </output>
      <button
        type="button"
        data-testid="call-login"
        onClick={() => {
          void login({
            username: "jane@example.com",
            password: "wrong",
          }).then(onResult);
        }}
      >
        login
      </button>
    </>
  );
}

describe("StorefrontProviders session", () => {
  it("reads the Shopware session in the browser", async () => {
    mounted = await mount(
      <StorefrontProviders>
        <SessionConsumer onResult={() => {}} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await vi.waitFor(() =>
      expect(
        query(container, '[data-testid="session-status"]').textContent,
      ).toBe("ready"),
    );
    expect(
      query(container, '[data-testid="session-logged-in"]').textContent,
    ).toBe("false");
    expect(browser.invoke).toHaveBeenCalledWith("readContext get /context", {
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    });
    expect(queryAll(container, TOAST)).toHaveLength(0);
  });

  it("leaves a failed login to the form and shows no toast", async () => {
    const results: SessionActionResult[] = [];
    mounted = await mount(
      <StorefrontProviders>
        <SessionConsumer onResult={(result) => results.push(result)} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await interact(() =>
      query<HTMLButtonElement>(container, '[data-testid="call-login"]').click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    const message = errorMessages.errors.login_no_matching_customer_internal;
    expect(results[0]).toEqual({ ok: false, message, messages: [message] });
    expect(queryAll(container, TOAST)).toHaveLength(0);
  });
});

function AddToCartConsumer({
  onResult,
}: {
  onResult: (result: CmsActionResult) => void;
}) {
  const actions = useCmsActions();
  return (
    <button
      type="button"
      data-testid="call-add-to-cart"
      onClick={() => {
        void actions
          .addToCart({ productId: "product-1", quantity: 1 })
          .then((result) => {
            if (!result.ok && result.message) {
              actions.notify({ type: "error", message: result.message });
            }
            onResult(result);
          });
      }}
    >
      add to cart
    </button>
  );
}

describe("StorefrontProviders CMS stubs", () => {
  it("returns the not-wired message for the island to show once", async () => {
    const results: CmsActionResult[] = [];
    mounted = await mount(
      <StorefrontProviders>
        <AddToCartConsumer onResult={(result) => results.push(result)} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="call-add-to-cart"]',
      ).click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({
      ok: false,
      message: NOT_WIRED_MESSAGES.cart,
    });
    const toasts = queryAll<HTMLParagraphElement>(container, TOAST);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toBe(NOT_WIRED_MESSAGES.cart);
  });
});
