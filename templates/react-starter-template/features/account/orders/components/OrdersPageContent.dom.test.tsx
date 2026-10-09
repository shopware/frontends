import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  deferred,
} from "@/features/checkout/checkoutTestDoubles";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { accountOrder, orderRouteResponse } from "../orders.fixture";
import { OrdersPageContent } from "./OrdersPageContent";

const READ_ORDER = "readOrder post /order";

type ReadOrderParams = { body: { page: number; limit: number } };

function ordersOf(count: number, offset = 0): Schemas["Order"][] {
  return Array.from({ length: count }, (_, index) =>
    accountOrder({
      id: `order-${offset + index + 1}`,
      orderNumber: String(10001 + offset + index),
    }),
  );
}

function pagedAnswer(total: number): FakeAnswer {
  return (_operation, params) => {
    const { page, limit } = (params as ReadOrderParams).body;
    const offset = (page - 1) * limit;
    return orderRouteResponse(
      ordersOf(Math.max(0, Math.min(limit, total - offset)), offset),
      { total },
    );
  };
}

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

async function setup(
  answer: FakeAnswer,
  {
    strict = false,
    locale = "en-GB",
  }: { strict?: boolean; locale?: Locale } = {},
) {
  const shopware = fakeClient(answer);
  const tree = withI18n(
    <ShopwareClientHarness client={shopware.client}>
      <OrdersPageContent />
    </ShopwareClientHarness>,
    locale,
  );
  mounted = await mount(strict ? <StrictMode>{tree}</StrictMode> : tree);
  return { container: mounted.container, shopware };
}

function pages(shopware: ReturnType<typeof fakeClient>) {
  return shopware
    .calls(READ_ORDER)
    .map(({ params }) => (params as ReadOrderParams).body)
    .map(({ page, limit }) => ({ page, limit }));
}

function orderNumbers(container: HTMLElement): string[] {
  return queryAll<HTMLElement>(container, "article h2").map(
    (heading) => heading.textContent ?? "",
  );
}

describe("OrdersPageContent", () => {
  it("renders the header and the first page of 15 orders", async () => {
    const { container, shopware } = await setup(pagedAnswer(40));

    expect(query(container, "h1").textContent).toBe("Orders");
    expect(container.textContent).toContain(
      "View your current and past orders",
    );
    expect(pages(shopware)).toEqual([{ page: 1, limit: 15 }]);
    expect(orderNumbers(container)).toHaveLength(15);
    expect(orderNumbers(container)[0]).toBe("Order: 10001");
    const nav = query(container, 'nav[aria-label="Pagination"]');
    expect(query(nav, '[aria-current="page"]').getAttribute("aria-label")).toBe(
      "Page 1",
    );
    expect(queryAll(nav, 'button[aria-label^="Page "]')).toHaveLength(3);
  });

  it("reads only the latest request under StrictMode", async () => {
    const first = deferred<unknown>();
    let call = 0;
    const { container, shopware } = await setup(
      () => {
        call += 1;
        return call === 1 ? first.promise : orderRouteResponse(ordersOf(2));
      },
      { strict: true },
    );

    await interact(() => first.resolve(orderRouteResponse(ordersOf(1, 50))));

    expect(pages(shopware)).toEqual([
      { page: 1, limit: 15 },
      { page: 1, limit: 15 },
    ]);
    expect(orderNumbers(container)).toEqual(["Order: 10001", "Order: 10002"]);
  });

  it("keeps the latest page when an earlier page answers late", async () => {
    const second = deferred<unknown>();
    const { container } = await setup((operation, params) =>
      (params as ReadOrderParams).body.page === 2
        ? second.promise
        : pagedAnswer(40)(operation, params),
    );
    const nav = () => query(container, 'nav[aria-label="Pagination"]');

    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 2"]').click(),
    );
    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 3"]').click(),
    );
    await interact(() =>
      second.resolve(pagedAnswer(40)("", { body: { page: 2, limit: 15 } })),
    );

    expect(orderNumbers(container)[0]).toBe("Order: 10031");
    expect(
      query(nav(), '[aria-current="page"]').getAttribute("aria-label"),
    ).toBe("Page 3");
  });

  it("ignores a late failure of an earlier page", async () => {
    const second = deferred<unknown>();
    const { container } = await setup((operation, params) =>
      (params as ReadOrderParams).body.page === 2
        ? second.promise
        : pagedAnswer(40)(operation, params),
    );
    const nav = () => query(container, 'nav[aria-label="Pagination"]');

    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 2"]').click(),
    );
    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 3"]').click(),
    );
    await interact(() => second.reject(new Error("offline")));

    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(orderNumbers(container)[0]).toBe("Order: 10031");
    expect(
      query(nav(), '[aria-current="page"]').getAttribute("aria-label"),
    ).toBe("Page 3");
  });

  it("shows the skeleton while the first page loads", async () => {
    const pending = deferred<unknown>();
    const { container } = await setup(() => pending.promise);

    const loading = query(container, '[data-testid="orders-loading"]');
    expect(loading.getAttribute("aria-busy")).toBe("true");
    expect(query(loading, "output").textContent).toBe("Loading…");

    await interact(() => pending.resolve(orderRouteResponse(ordersOf(1))));

    expect(
      container.querySelector('[data-testid="orders-loading"]'),
    ).toBeNull();
    expect(orderNumbers(container)).toEqual(["Order: 10001"]);
  });

  it("reads the page a pagination button asks for", async () => {
    const { container, shopware } = await setup(pagedAnswer(40));
    const nav = () => query(container, 'nav[aria-label="Pagination"]');

    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 3"]').click(),
    );
    expect(orderNumbers(container)[0]).toBe("Order: 10031");
    expect(orderNumbers(container)).toHaveLength(10);

    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Previous page"]').click(),
    );
    await interact(() =>
      query<HTMLButtonElement>(nav(), '[aria-label="Page 2"]').click(),
    );

    expect(pages(shopware)).toEqual([
      { page: 1, limit: 15 },
      { page: 3, limit: 15 },
      { page: 2, limit: 15 },
    ]);
    expect(
      query(nav(), '[aria-current="page"]').getAttribute("aria-label"),
    ).toBe("Page 2");
    expect(
      query<HTMLButtonElement>(nav(), '[aria-label="Next page"]').disabled,
    ).toBe(false);
  });

  it("keeps the current list busy while the next page loads", async () => {
    let next: ReturnType<typeof deferred<unknown>> | null = null;
    const { container } = await setup((operation, params) => {
      if ((params as ReadOrderParams).body.page === 1) {
        return pagedAnswer(20)(operation, params);
      }
      next = deferred<unknown>();
      return next.promise;
    });

    await interact(() =>
      query<HTMLButtonElement>(container, '[aria-label="Next page"]').click(),
    );

    const busy = query(container, '[aria-busy="true"]');
    expect(busy.querySelectorAll("article")).toHaveLength(15);
    await interact(() =>
      next?.resolve(pagedAnswer(20)("", { body: { page: 2, limit: 15 } })),
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(orderNumbers(container)).toHaveLength(5);
  });

  it("goes back to the first page with the new page size", async () => {
    const { container, shopware } = await setup(pagedAnswer(40));
    await interact(() =>
      query<HTMLButtonElement>(container, '[aria-label="Page 2"]').click(),
    );
    const select = query<HTMLSelectElement>(container, "select");
    expect(
      query<HTMLLabelElement>(container, `label[for="${select.id}"]`)
        .textContent,
    ).toBe("Per Page:");
    expect([...select.options].map((option) => option.value)).toEqual([
      "1",
      "15",
      "30",
      "45",
    ]);

    await interact(() => {
      select.value = "30";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(pages(shopware).at(-1)).toEqual({ page: 1, limit: 30 });
    expect(orderNumbers(container)).toHaveLength(30);
    expect(query<HTMLSelectElement>(container, "select").value).toBe("30");
  });

  it("moves to the last page when the requested one no longer exists", async () => {
    let total = 40;
    const { container, shopware } = await setup((operation, params) =>
      pagedAnswer(total)(operation, params),
    );
    const select = query<HTMLSelectElement>(container, "select");
    await interact(() => {
      select.value = "1";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await interact(() =>
      query<HTMLButtonElement>(container, '[aria-label="Page 40"]').click(),
    );
    total = 20;

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[aria-label="Previous page"]',
      ).click(),
    );

    expect(pages(shopware).slice(-2)).toEqual([
      { page: 39, limit: 1 },
      { page: 20, limit: 1 },
    ]);
    expect(orderNumbers(container)).toEqual(["Order: 10020"]);
    expect(
      query(container, '[aria-current="page"]').getAttribute("aria-label"),
    ).toBe("Page 20");
  });

  it("expands and collapses the products of an order", async () => {
    const { container } = await setup(() =>
      orderRouteResponse([accountOrder({ id: "order-1" })]),
    );
    const toggle = query<HTMLButtonElement>(
      container,
      "article button[aria-expanded]",
    );
    const region = query(
      container,
      `#${CSS.escape(toggle.getAttribute("aria-controls") ?? "")}`,
    );

    expect(toggle.textContent).toBe("See more");
    expect(
      region.querySelectorAll('[data-testid="order-line-item"]'),
    ).toHaveLength(0);

    await interact(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent).toBe("See less");
    const items = region.querySelectorAll('[data-testid="order-line-item"]');
    expect(items).toHaveLength(1);
    expect(items[0]?.textContent).toContain("Aerodynamic Bag");

    await interact(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(
      region.querySelectorAll('[data-testid="order-line-item"]'),
    ).toHaveLength(0);
  });

  it("shows the empty state without pagination", async () => {
    const { container } = await setup(() => orderRouteResponse([]));

    expect(container.textContent).toContain("No results.");
    expect(container.querySelector("nav")).toBeNull();
    expect(container.querySelector("article")).toBeNull();
  });

  it("shows an error with a retry that reads the same page again", async () => {
    let fail = true;
    const { container, shopware } = await setup((operation, params) => {
      if (fail) throw new Error("offline");
      return pagedAnswer(3)(operation, params);
    });

    const alert = query(container, '[role="alert"]');
    expect(alert.textContent).toContain(
      "Something went wrong while loading results.",
    );
    expect(console.error).toHaveBeenCalledWith(
      "[Account] reading the orders failed",
      expect.any(Error),
    );

    fail = false;
    await interact(() => query<HTMLButtonElement>(alert, "button").click());

    expect(pages(shopware)).toEqual([
      { page: 1, limit: 15 },
      { page: 1, limit: 15 },
    ]);
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(orderNumbers(container)).toHaveLength(3);
  });
});

describe("OrdersPageContent in Polish", () => {
  it("renders the Polish header, order labels, pagination and page size label with prefixed links", async () => {
    const { container } = await setup(pagedAnswer(40), { locale: "pl-PL" });

    expect(query(container, "h1").textContent).toBe("Zamówienia");
    expect(orderNumbers(container)[0]).toBe("Zamówienie: 10001");
    expect(query(container, "article h2 a").getAttribute("href")).toBe(
      "/pl-PL/account/order/details/order-1",
    );
    const nav = query(container, 'nav[aria-label="Paginacja"]');
    expect(query(nav, '[aria-current="page"]').getAttribute("aria-label")).toBe(
      "Strona 1",
    );
    expect(container.textContent).toContain("Na stronę:");
  });
});
