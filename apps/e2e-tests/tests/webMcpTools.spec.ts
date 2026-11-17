import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures";

type ToolProduct = {
  productId: string;
  name: string;
  price: number;
  url: string;
};

type ToolCart = {
  items: { lineItemId: string; productId: string; quantity: number }[];
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

// WebMCP is a Chrome origin trial. The feature flag turns it on for the test.
test.use({ launchOptions: { args: ["--enable-features=WebMCP"] } });

/** Calls a page tool the way a browser agent does and parses its result. */
async function callTool(
  page: Page,
  name: string,
  input: Record<string, unknown> = {},
) {
  const result = await page.evaluate(
    async ([toolName, toolInput]) => {
      const { modelContext } = document as unknown as {
        modelContext: {
          getTools(): Promise<{ name: string }[]>;
          executeTool(tool: unknown, input: unknown): Promise<string>;
        };
      };
      const tools = await modelContext.getTools();
      const tool = tools.find((item) => item.name === toolName);
      if (!tool) throw new Error(`The page has no ${toolName} tool.`);
      return modelContext.executeTool(tool, toolInput);
    },
    [name, input] as const,
  );
  return JSON.parse(result);
}

function toolNames(page: Page) {
  return page.evaluate(async () => {
    const { modelContext } = document as unknown as {
      modelContext?: { getTools(): Promise<{ name: string }[]> };
    };
    const tools = (await modelContext?.getTools()) ?? [];
    return tools.map(({ name }) => name).sort();
  });
}

async function waitForTools(page: Page) {
  await expect
    .poll(() => toolNames(page), { timeout: 30000 })
    .toEqual(TOOL_NAMES);
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
  test.setTimeout(120000);

  test.beforeEach(async ({ page, homePage }) => {
    await homePage.visitMainPage();
    await waitForTools(page);
  });

  test("an agent shops and the page shows every step", async ({ page }) => {
    await test.step("bad input comes back as an error the agent can read", async () => {
      expect(
        await callTool(page, "add_to_cart", { productId: "nope" }),
      ).toEqual({ error: expect.stringContaining("productId") });
      expect(
        await callTool(page, "update_cart_item", {
          lineItemId: "nope",
          quantity: -1,
        }),
      ).toEqual({ error: expect.stringContaining("quantity") });
      expect(
        await callTool(page, "browse_category", { category: "nope" }),
      ).toEqual({ error: expect.stringContaining("The shop menu has:") });
      expect(await callTool(page, "get_product")).toEqual({
        error: expect.stringContaining("product page"),
      });
      expect(await callTool(page, "go_to_checkout")).toEqual({
        error: "The cart is empty.",
      });
    });

    let { category, products } = await browseFirstCategory(page);

    await test.step("the category page shows what the tool returns", async () => {
      const prices = products.map(({ price }) => price).sort((a, b) => a - b);
      const maxPrice = prices[Math.floor(prices.length / 2)];
      const result = await callTool(page, "browse_category", {
        category,
        maxPrice,
      });
      products = result.products;

      expect(products.length).toBeGreaterThan(0);
      for (const { price } of products) {
        expect(price).toBeLessThanOrEqual(maxPrice);
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
    let stock = 0;

    await test.step("search_products shows the results page", async () => {
      const result = await callTool(page, "search_products", {
        query: product.name,
      });

      expect(
        result.products.map(({ productId }: ToolProduct) => productId),
      ).toContain(product.productId);
      await expect(page).toHaveURL(/\/search\?search=/);
      await expect(page.getByTestId("search-results-container")).toContainText(
        product.name,
      );
    });

    await test.step("get_product reads the product on screen", async () => {
      await page
        .locator(
          `[data-testid="product-box-product-name-link"][href="${product.url}"]`,
        )
        .first()
        .click();
      await page.waitForURL(`**${product.url}`);
      await waitForTools(page);

      const result = await callTool(page, "get_product");
      expect(result.productId).toBe(product.productId);
      stock = result.stock;
    });

    await test.step("parallel add_to_cart calls both land", async () => {
      const results: ToolCart[] = await Promise.all([
        callTool(page, "add_to_cart", {
          productId: product.productId,
          quantity: 2,
        }),
        callTool(page, "add_to_cart", { productId: other.productId }),
      ]);
      for (const result of results) expect(result.error).toBeUndefined();
      const cart: ToolCart = await callTool(page, "get_cart");

      expect(cart.items).toContainEqual(
        expect.objectContaining({ productId: product.productId }),
      );
      expect(cart.items).toContainEqual(
        expect.objectContaining({ productId: other.productId }),
      );
      await expect(page.getByTestId("notification-container")).toContainText(
        product.name,
      );
    });

    await test.step("update_cart_item reports a cart warning, then clears it", async () => {
      const cart: ToolCart = await callTool(page, "get_cart");
      const line = cart.items.find(
        ({ productId }) => productId === product.productId,
      );
      const tooMany: ToolCart = await callTool(page, "update_cart_item", {
        lineItemId: line?.lineItemId,
        quantity: stock + 1,
      });

      expect(tooMany.warnings?.length).toBeGreaterThan(0);
      await expect(page.getByTestId("notification-container")).toContainText(
        tooMany.warnings?.[0] ?? "",
      );

      const updated: ToolCart = await callTool(page, "update_cart_item", {
        lineItemId: line?.lineItemId,
        quantity: 1,
      });
      expect(updated.warnings).toEqual([]);
      expect(updated.items).toContainEqual(
        expect.objectContaining({ productId: product.productId, quantity: 1 }),
      );
    });

    await test.step("go_to_checkout hands over and the tools go away", async () => {
      const result = await callTool(page, "go_to_checkout");

      expect(result.url).toMatch(/\/checkout$/);
      await expect(page).toHaveURL(/\/checkout$/);
      await expect.poll(() => toolNames(page)).toEqual([]);
    });

    await test.step("the tools work again after leaving checkout", async () => {
      await page.goBack();
      await waitForTools(page);

      const result = await callTool(page, "browse_category", { category });
      expect(result.error).toBeUndefined();
      expect(result.products?.length).toBeGreaterThan(0);
    });
  });
});
