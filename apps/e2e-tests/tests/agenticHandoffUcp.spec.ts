import type { APIRequestContext, BrowserContext } from "@playwright/test";

import { expect, test } from "../fixtures";

/**
 * The full agent journey against a Shopware with the agentic-commerce plugin:
 * an agent builds a cart and a checkout over UCP (MCP), through the
 * storefront's proxy, and the buyer continues it in the browser. Skips
 * where the shop has no UCP behind the proxy, like the public demo backend.
 */

const MCP_PATH = "/ucp/mcp?toolsets=other";
const CONTINUE_URL = /\/checkout\/continue\/([A-Za-z0-9]{32})$/;
const CONTINUE_BUTTON = { name: "Continue with this cart" };
const SIGNED_IN =
  '[data-testid="header-account-button"][data-logged-in="true"]';

type JsonRpc = {
  result?: {
    structuredContent?: unknown;
    content?: { text?: string }[];
    isError?: boolean;
  };
  error?: { message?: string };
};
type Product = { id: string; variants?: { id: string }[] };
type SearchResult = { data?: { products?: Product[] } };
type CartResult = {
  data?: { id: string; line_items?: { item?: { title?: string } }[] };
};
type Checkout = { continue_url?: string };
type CheckoutResult = Checkout & { data?: Checkout };

/** One MCP session on the shop's UCP endpoint, reached like an agent does. */
class UcpAgent {
  private sessionId?: string;
  private nextId = 0;

  constructor(
    private readonly request: APIRequestContext,
    private readonly origin: string,
  ) {}

  async connect() {
    await this.rpc("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "frontends-e2e", version: "0" },
    });
  }

  async call<T>(name: string, args: Record<string, unknown>): Promise<T> {
    const { result, error } = await this.rpc("tools/call", {
      name,
      arguments: args,
    });
    expect(error, `${name}: ${error?.message}`).toBeUndefined();
    const payload =
      result?.structuredContent ??
      JSON.parse(result?.content?.[0]?.text ?? "null");
    expect(
      result?.isError,
      `${name} failed: ${JSON.stringify(payload).slice(0, 300)}`,
    ).toBeFalsy();
    return payload as T;
  }

  private async rpc(method: string, params: unknown): Promise<JsonRpc> {
    const response = await this.request.post(MCP_PATH, {
      headers: {
        Accept: "application/json, text/event-stream",
        "UCP-Agent": `frontends-e2e; profile="${this.origin}/.well-known/ucp"`,
        "mcp-protocol-version": "2025-03-26",
        ...(this.sessionId ? { "mcp-session-id": this.sessionId } : {}),
      },
      data: { jsonrpc: "2.0", id: ++this.nextId, method, params },
    });
    const body = await response.text();
    expect(
      response.ok(),
      `${method} answered ${response.status()}: ${body.slice(0, 300)}`,
    ).toBe(true);
    this.sessionId ??= response.headers()["mcp-session-id"];
    // Streamable HTTP may answer as SSE. The JSON sits after the last "data:".
    const json = body.trimStart().startsWith("{")
      ? body
      : (body
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .pop()
          ?.slice(5) ?? "");
    return JSON.parse(json) as JsonRpc;
  }
}

/** Lets an agent build a cart and a checkout, and returns the buyer's link. */
async function agentCheckout(request: APIRequestContext, origin: string) {
  const agent = new UcpAgent(request, new URL(origin).origin);
  await agent.connect();

  let product: Product | undefined;
  // Shopware wants at least two characters in a search term.
  for (const query of ["ab", "en", "on"]) {
    const found = await agent.call<SearchResult>("search_catalog", {
      query,
      limit: 5,
    });
    product = found.data?.products?.[0];
    if (product) break;
  }
  expect(product, "the catalog search found no product").toBeTruthy();

  const cart = await agent.call<CartResult>("create_cart", {
    dryRun: false,
    payload: {
      line_items: [
        {
          item: { id: product?.variants?.[0]?.id ?? product?.id },
          quantity: 1,
        },
      ],
    },
  });
  const title = cart.data?.line_items?.[0]?.item?.title ?? "";
  expect(cart.data?.id, "create_cart returned no cart").toBeTruthy();
  expect(title, "the cart line has no title").toBeTruthy();

  const created = await agent.call<CheckoutResult>("create_checkout", {
    dryRun: false,
    payload: { cart_id: cart.data?.id, line_items: [] },
  });
  const continueUrl = (created.data ?? created).continue_url ?? "";
  const token = CONTINUE_URL.exec(continueUrl)?.[1];
  expect(token, `unexpected continue_url ${continueUrl}`).toBeTruthy();

  return { path: `/checkout/continue/${token}`, token, title };
}

async function sessionToken(context: BrowserContext) {
  const cookies = await context.cookies();
  return cookies.find((cookie) => cookie.name === "sw-context-token")?.value;
}

test.describe("Agent checkout handoff over UCP", { tag: "@frontends" }, () => {
  let ucp = false;

  test.beforeAll(async ({ request }) => {
    const profile = await request.get("/.well-known/ucp");
    ucp = profile.status() === 200;
  });

  test.beforeEach(({ baseURL }, testInfo) => {
    test.skip(!ucp, `no UCP behind the proxy on ${baseURL}`);
    // Three MCP calls plus a browser journey do not fit the default.
    testInfo.setTimeout(120_000);
  });

  test("a fresh browser takes over the agent's cart after confirming", async ({
    page,
    request,
    baseURL,
  }) => {
    const { path, token, title } = await agentCheckout(request, baseURL ?? "");

    await page.goto(path);
    await expect(page.getByRole("button", CONTINUE_BUTTON)).toBeVisible();
    expect(await sessionToken(page.context())).not.toBe(token);

    await page.getByRole("button", CONTINUE_BUTTON).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText(title).first()).toBeVisible();
    expect(await sessionToken(page.context())).toBe(token);

    // The link stays valid. Opening it again changes nothing.
    await page.goto(path);
    await page.getByRole("button", CONTINUE_BUTTON).click();
    await expect(page).toHaveURL(/\/checkout$/);
    expect(await sessionToken(page.context())).toBe(token);
  });

  test("a shopper with a cart is told, and can keep it", async ({
    page,
    request,
    baseURL,
  }) => {
    const origin = baseURL ?? "";
    const own = await agentCheckout(request, origin);
    await page.goto(own.path);
    await page.getByRole("button", CONTINUE_BUTTON).click();
    await expect(page).toHaveURL(/\/checkout$/);

    const other = await agentCheckout(request, origin);
    await page.goto(other.path);
    await expect(
      page.getByText("It replaces the cart you have in this browser."),
    ).toBeVisible();
    await page.getByRole("link", { name: "Keep my cart" }).click();
    await expect(page).toHaveURL(/\/checkout\/cart$/);
    await expect(page.getByText(own.title).first()).toBeVisible();
    expect(await sessionToken(page.context())).toBe(own.token);
  });

  test("a signed-in customer is told, and is signed out after confirming", async ({
    page,
    request,
    baseURL,
    customer,
    homePage,
    loginForm,
    storeApi,
  }) => {
    await homePage.visitMainPage();
    await homePage.clickOnSignIn();
    await loginForm.login(customer.email, customer.password);
    await expect(page.locator(SIGNED_IN)).toHaveCount(1, { timeout: 30_000 });

    const { path, token, title } = await agentCheckout(request, baseURL ?? "");
    await page.goto(path);
    await expect(
      page.getByText("It replaces your current cart and signs you out."),
    ).toBeVisible();

    await page.getByRole("button", CONTINUE_BUTTON).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText(title).first()).toBeVisible();
    expect(await sessionToken(page.context())).toBe(token);

    // The agent's session holds no customer.
    const { endpoint, accessKey } = storeApi.value ?? {};
    expect(endpoint, "the Store API endpoint was not captured").toBeTruthy();
    const context = await page.request.get(`${endpoint}/context`, {
      headers: { "sw-access-key": accessKey ?? "", "sw-context-token": token },
    });
    expect(context.ok()).toBe(true);
    expect(
      ((await context.json()) as { customer?: unknown }).customer,
    ).toBeFalsy();
  });
});
