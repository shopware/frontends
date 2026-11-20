import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures";

type ToolProduct = {
  productId: string;
  name: string;
  price: number;
  /** Set when a volume or variant price is lower. The price filters use it. */
  priceFrom?: number;
};

type ToolCart = {
  items: { productId: string; quantity: number }[];
  warnings?: string[];
  error?: string;
};

const TOOL_NAMES = [
  "add_to_cart",
  "browse_category",
  "get_cart",
  "get_product",
  "go_to_checkout",
  "search_products",
  "update_cart_item",
];

// Chrome's advice for one tool answer, in characters.
const ANSWER_BUDGET = 1500;

// WebMCP is a Chrome origin trial. The feature flag turns it on for the test.
test.use({ launchOptions: { args: ["--enable-features=WebMCP"] } });

/**
 * Calls a page tool the way a browser agent does and parses its result.
 * With `cancelAfter` the caller gives up after that many milliseconds.
 */
async function callTool(
  page: Page,
  name: string,
  input: Record<string, unknown> = {},
  { cancelAfter }: { cancelAfter?: number } = {},
) {
  const result = await page.evaluate(
    async ([toolName, toolInput, giveUpAfter]) => {
      const { modelContext } = document as unknown as {
        modelContext: {
          getTools(): Promise<{ name: string }[]>;
          executeTool(
            tool: unknown,
            input: unknown,
            options: { signal?: AbortSignal },
          ): Promise<string>;
        };
      };
      const tools = await modelContext.getTools();
      const tool = tools.find((item) => item.name === toolName);
      if (!tool) throw new Error(`The page has no ${toolName} tool.`);
      if (giveUpAfter === null) {
        return modelContext.executeTool(tool, toolInput, {});
      }
      const signal = AbortSignal.timeout(giveUpAfter);
      return modelContext
        .executeTool(tool, toolInput, { signal })
        .catch((error: Error) => {
          if (error.name === "TimeoutError") return '{"cancelled":true}';
          throw error;
        });
    },
    [name, input, cancelAfter ?? null] as const,
  );
  expect(result.length, `${name} answer size`).toBeLessThanOrEqual(
    ANSWER_BUDGET,
  );
  return JSON.parse(result);
}

function toolNames(page: Page) {
  return (
    page
      .evaluate(async () => {
        const { modelContext } = document as unknown as {
          modelContext?: { getTools(): Promise<{ name: string }[]> };
        };
        const tools = (await modelContext?.getTools()) ?? [];
        return tools.map(({ name }) => name).sort();
      })
      // The dev server reloads the page once after a code change.
      .catch(() => [] as string[])
  );
}

/** The tools are listed before the page hydrates. A call waits for the page. */
async function waitForTools(page: Page) {
  await expect
    .poll(() => toolNames(page), { timeout: 30000 })
    .toEqual(TOOL_NAMES);
}

/** Holds matching requests until the returned function is called. */
async function hold(page: Page, url: string) {
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(url, async (route) => {
    await held;
    await route.continue().catch(() => {});
  });
  return release;
}

/** Finds a category with products, the way an agent reads the shop menu. */
async function browseFirstCategory(page: Page) {
  const menu = await page.getByTestId("header-navigation-link").allInnerTexts();
  for (const category of menu.map((name) => name.trim())) {
    const result = await callTool(page, "browse_category", { category });
    if (result.products?.length) {
      return { category, products: result.products as ToolProduct[] };
    }
  }
  throw new Error(`No category in the menu has products: ${menu.join(", ")}`);
}

test.describe("WebMCP agent tools", { tag: "@webmcp" }, () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "WebMCP runs in Chromium only.",
  );
  test.setTimeout(180000);

  test("an agent shops and the page shows every step", async ({
    page,
    homePage,
  }) => {
    await test.step("the tools are listed before the page hydrates, and an early call waits", async () => {
      const release = await hold(page, "**/store-api/context");
      await homePage.visitMainPage();
      await waitForTools(page);

      const early = callTool(page, "get_cart");
      const state = await Promise.race([
        early.then(() => "answered"),
        page.waitForTimeout(1000).then(() => "waiting"),
      ]);
      expect(state).toBe("waiting");

      release();
      expect((await early).items).toEqual([]);
    });

    const menu = await page
      .getByTestId("header-navigation-link")
      .allInnerTexts();

    await test.step("bad input comes back as an error the agent can act on", async () => {
      expect(
        await callTool(page, "add_to_cart", { productId: "nope" }),
      ).toEqual({ error: expect.stringContaining("productId") });
      expect(
        await callTool(page, "update_cart_item", {
          productId: "0".repeat(32),
          quantity: -1,
        }),
      ).toEqual({ error: expect.stringContaining("quantity") });
      expect(
        await callTool(page, "browse_category", { category: "nope" }),
      ).toEqual({
        error: expect.stringContaining("category"),
        categories: expect.arrayContaining([menu[0].trim()]),
      });
      expect(await callTool(page, "get_product")).toEqual({
        error: expect.stringContaining("product page"),
      });
      expect(await callTool(page, "go_to_checkout")).toEqual({
        error: expect.stringContaining("The cart is empty"),
      });
    });

    let { category, products } = await browseFirstCategory(page);

    await test.step("the category page shows what the tool returns", async () => {
      const prices = products
        .map(({ price, priceFrom }) => priceFrom ?? price)
        .sort((a, b) => a - b);
      const maxPrice = prices[Math.floor(prices.length / 2)];
      const result = await callTool(page, "browse_category", {
        category,
        maxPrice,
      });
      products = result.products;

      expect(result.hint ?? "").not.toContain("not on screen");
      if (result.total > products.length) {
        expect(result.hint).toContain(
          `Showing ${products.length} of ${result.total}`,
        );
      }
      expect(products.length).toBeGreaterThan(0);
      for (const { price, priceFrom } of products) {
        expect(priceFrom ?? price).toBeLessThanOrEqual(maxPrice);
      }
      await expect(page).toHaveURL(new RegExp(`max-price=${maxPrice}`));
      await expect(page.getByTestId("loading")).toHaveCount(0);
      await expect
        .poll(async () =>
          (
            await page
              .getByTestId("product-box-product-name-link")
              .allInnerTexts()
          ).slice(0, products.length),
        )
        .toEqual(products.map(({ name }) => name));
    });

    expect(products.length).toBeGreaterThan(1);
    const [product, other] = products;

    await test.step("search_products shows the results page, and a call cancelled behind it does not run", async () => {
      const release = await hold(page, "**/store-api/search**");
      const search = callTool(page, "search_products", {
        query: product.name,
      });
      expect(
        await callTool(
          page,
          "add_to_cart",
          { productId: other.productId },
          { cancelAfter: 200 },
        ),
      ).toEqual({ cancelled: true });
      release();
      const result = await search;

      expect(
        result.products.map(({ productId }: ToolProduct) => productId),
      ).toContain(product.productId);
      await expect(page).toHaveURL(/\/search\?search=/);
      await expect(page.getByTestId("search-results-container")).toContainText(
        product.name,
      );
      expect((await callTool(page, "get_cart")).items).toEqual([]);
    });

    await test.step("get_product reads the product on screen", async () => {
      const link = page
        .getByTestId("product-box-product-name-link")
        .filter({ hasText: product.name })
        .first();
      const href = await link.getAttribute("href");
      await link.click();
      await page.waitForURL(`**${href}`);
      await waitForTools(page);

      const result = await callTool(page, "get_product");
      expect(result.productId).toBe(product.productId);
      expect(result.url).toBe(href);
      expect(result.stock).toEqual(expect.any(Number));
      await expect(page.getByTestId("agent-activity")).toHaveText(
        "Assistant: Get product details",
      );
    });

    await test.step("parallel add_to_cart calls both land, also with a quantity sent as text", async () => {
      const results: ToolCart[] = await Promise.all([
        callTool(page, "add_to_cart", {
          productId: product.productId,
          quantity: "2",
        }),
        callTool(page, "add_to_cart", { productId: other.productId }),
      ]);
      for (const result of results) expect(result.error).toBeUndefined();
      const cart: ToolCart = await callTool(page, "get_cart");

      expect(cart.items).toContainEqual(
        expect.objectContaining({ productId: product.productId, quantity: 2 }),
      );
      expect(cart.items).toContainEqual(
        expect.objectContaining({ productId: other.productId, quantity: 1 }),
      );
      await expect(page.getByTestId("notification-container")).toContainText(
        product.name,
      );
    });

    await test.step("update_cart_item reports a cart warning, then clears it", async () => {
      // More than any shop sells in one order.
      const tooMany: ToolCart = await callTool(page, "update_cart_item", {
        productId: product.productId,
        quantity: 1_000_000,
      });

      expect(tooMany.warnings?.length).toBeGreaterThan(0);
      await expect(page.getByTestId("notification-container")).toContainText(
        tooMany.warnings?.[0] ?? "",
      );

      const updated: ToolCart = await callTool(page, "update_cart_item", {
        productId: product.productId,
        quantity: 1,
      });
      expect(updated.warnings).toEqual([]);
      expect(updated.items).toContainEqual(
        expect.objectContaining({ productId: product.productId, quantity: 1 }),
      );
    });

    await test.step("go_to_checkout works right after a page load and the tools go away", async () => {
      const release = await hold(page, "**/store-api/checkout/cart");
      await page.reload();
      await waitForTools(page);

      const checkout = callTool(page, "go_to_checkout");
      await page.waitForTimeout(1000);
      release();

      expect((await checkout).url).toMatch(/\/checkout$/);
      await expect(page).toHaveURL(/\/checkout$/);
      await expect.poll(() => toolNames(page)).toEqual([]);
    });

    await test.step("the tools work again after leaving checkout", async () => {
      await page.goBack();
      await waitForTools(page);

      const cart: ToolCart = await callTool(page, "update_cart_item", {
        productId: other.productId,
        quantity: 0,
      });
      const inCart = cart.items.map(({ productId }) => productId);
      expect(inCart).toContain(product.productId);
      expect(inCart).not.toContain(other.productId);
    });

    await test.step("a search does not move a shopper who opened a product meanwhile", async () => {
      await callTool(page, "search_products", { query: other.name });
      const release = await hold(page, "**/store-api/search**");
      const search = callTool(page, "search_products", {
        query: product.name,
      });
      const link = page
        .getByTestId("product-box-product-name-link")
        .filter({ hasText: other.name })
        .first();
      const href = await link.getAttribute("href");
      await link.click();
      await page.waitForURL(`**${href}`);
      release();

      expect((await search).hint).toContain("not on screen");
      await page.waitForTimeout(1000);
      expect(new URL(page.url()).pathname).toBe(href);
    });

    await test.step("a cart change waits for the page's first cart read", async () => {
      // The server reads the cart before the add, and that old answer lands last.
      let readDone = () => {};
      const read = new Promise<void>((resolve) => {
        readDone = resolve;
      });
      let landed = () => {};
      const late = new Promise<void>((resolve) => {
        landed = resolve;
      });
      let first = true;
      await page.route("**/store-api/checkout/cart", async (route) => {
        if (route.request().method() !== "GET" || !first) {
          await route.continue();
          return;
        }
        first = false;
        const response = await route.fetch();
        readDone();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.fulfill({ response }).catch(() => {});
        landed();
      });
      await page.route(
        "**/store-api/checkout/cart/line-item",
        async (route) => {
          await read;
          await route.continue();
        },
      );
      await page.reload();
      await waitForTools(page);

      await callTool(page, "add_to_cart", { productId: other.productId });
      await late;
      const cart: ToolCart = await callTool(page, "update_cart_item", {
        productId: other.productId,
        quantity: 0,
      });
      expect(cart.error).toBeUndefined();
      await page.unroute("**/store-api/checkout/cart");
      await page.unroute("**/store-api/checkout/cart/line-item");
    });

    await test.step("a call that is still running does not move a shopper who opened checkout", async () => {
      const release = await hold(page, "**/store-api/search**");
      const search = callTool(page, "search_products", {
        query: product.name,
      });
      await page.getByTestId("header-mini-cart-button").click();
      await page.getByTestId("checkout-cart-link").click();
      await expect(page).toHaveURL(/\/checkout$/);
      release();

      expect(await search).toEqual({
        error: expect.stringContaining("left this page"),
      });
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/checkout$/);
    });
  });
});
