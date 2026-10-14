import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { act, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import type { FakeAnswer } from "@/features/checkout/checkout.fixture";
import {
  ShopwareClientHarness,
  deferred,
} from "@/features/checkout/checkoutTestDoubles";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { apiClientError } from "@/features/session/session.fixture";
import type { Locale } from "@/i18n/config";
import { ContentLanguageProvider } from "@/i18n/ContentLanguageProvider";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  pressKey,
  query,
  queryAll,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { suggestProduct, suggestResult } from "../search.fixture";
import { HeaderSearch } from "./HeaderSearch";

const { push, route } = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  let pathname = "/";
  return {
    push: vi.fn(),
    route: {
      get: () => pathname,
      set(next: string) {
        pathname = next;
        for (const listener of listeners) listener();
      },
      subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    },
  };
});

vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    useRouter: () => ({ push }),
    usePathname: () =>
      useSyncExternalStore(route.subscribe, route.get, route.get),
  };
});

const SUGGEST = "searchSuggestGet get /search-suggest";
const INPUT = '[data-testid="header-search-input"]';
const BOX = '[data-testid="layout-search-result-box"]';
const LINK = '[data-testid="layout-search-suggest-link"]';
const MORE = '[data-testid="layout-search-result-box-more-link"]';
const NO_RESULT = '[data-testid="layout-search-result-box-no-result"]';
const UNAVAILABLE = "Suggestions are unavailable right now.";

type SuggestParams = {
  query: { search: string };
  fetchOptions: { signal?: AbortSignal };
};

function answerWith(result = suggestResult()): FakeAnswer {
  return () => ({ elements: result.products, total: result.total });
}

type Pending = ReturnType<typeof deferred<unknown>>;

function abortableAnswer(answers: Map<string, Pending>): FakeAnswer {
  return (_, params) => {
    const { query: suggestQuery, fetchOptions } = params as SuggestParams;
    const pending = deferred<unknown>();
    fetchOptions.signal?.addEventListener("abort", () =>
      pending.reject(new DOMException("Aborted", "AbortError")),
    );
    answers.set(suggestQuery.search, pending);
    return pending.promise;
  };
}

function ControlledSearch({
  initial,
  autoFocus,
}: {
  initial: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(initial);
  return (
    <HeaderSearch
      value={value}
      onValueChange={setValue}
      autoFocus={autoFocus}
    />
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  push.mockReset();
  route.set("/");
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function setup({
  answer = answerWith(),
  locale,
  initial = "",
  autoFocus,
  contentLang,
}: {
  answer?: FakeAnswer;
  locale?: Locale;
  initial?: string;
  autoFocus?: boolean;
  contentLang?: string;
} = {}) {
  const shopware = fakeClient(answer);
  const notify = vi.fn();
  mounted = await mount(
    withI18n(
      <CmsActionsProvider actions={{ notify }}>
        <ShopwareClientHarness client={shopware.client}>
          <ContentLanguageProvider lang={contentLang}>
            <ControlledSearch initial={initial} autoFocus={autoFocus} />
            <button type="button" data-testid="outside">
              Outside
            </button>
          </ContentLanguageProvider>
        </ShopwareClientHarness>
      </CmsActionsProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  return {
    container,
    notify,
    shopware,
    input: query<HTMLInputElement>(container, INPUT),
    form: query<HTMLFormElement>(container, "form"),
    output: query<HTMLOutputElement>(container, "output"),
    outside: query<HTMLButtonElement>(container, '[data-testid="outside"]'),
    box: () => container.querySelector<HTMLElement>(BOX),
    links: () => queryAll<HTMLAnchorElement>(container, LINK),
    more: () => container.querySelector<HTMLAnchorElement>(MORE),
    searches: () =>
      shopware
        .calls(SUGGEST)
        .map(({ params }) => (params as SuggestParams).query.search),
    signals: () =>
      shopware
        .calls(SUGGEST)
        .map(({ params }) => (params as SuggestParams).fetchOptions.signal),
  };
}

async function settle(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
    for (let turn = 0; turn < 10; turn += 1) await Promise.resolve();
  });
}

async function type(input: HTMLInputElement, value: string) {
  await interact(() => setInputValue(input, value));
}

async function typeAndAnswer(input: HTMLInputElement, value: string) {
  await type(input, value);
  await settle(300);
}

describe("HeaderSearch suggestions", () => {
  it("asks for nothing and shows no box below three characters", async () => {
    const { input, box, searches } = await setup();

    await type(input, "sh");
    await type(input, "   ");
    await type(input, "  s  ");
    await settle(1000);

    expect(searches()).toEqual([]);
    expect(box()).toBeNull();
    expect(input.hasAttribute("aria-controls")).toBe(false);
  });

  it("opens the box at three characters and asks once, 300 ms after the last input", async () => {
    const { input, box, searches } = await setup();

    await type(input, "shi");
    expect(box()).not.toBeNull();
    expect(input.getAttribute("aria-controls")).toBe(box()?.id);
    expect(box()?.querySelector('[aria-hidden="true"].animate-spin')).not.toBe(
      null,
    );

    await settle(200);
    await type(input, "shirt");
    await settle(299);
    expect(searches()).toEqual([]);

    await settle(1);
    expect(searches()).toEqual(["shirt"]);
  });

  it("asks with the trimmed term and does not ask again for the same term", async () => {
    const { input, searches } = await setup();

    await typeAndAnswer(input, "  linen   shirt ");
    await typeAndAnswer(input, "linen shirt  ");

    expect(searches()).toEqual(["linen shirt"]);
  });

  it("links every suggestion to its SEO URL with image, name, price and units", async () => {
    const plain = suggestProduct();
    const tiered = suggestProduct({
      id: "product-2",
      name: "Wool Shirt",
      calculatedPrices: [
        { unitPrice: 30, totalPrice: 30, quantity: 9 },
        { unitPrice: 25, totalPrice: 25, quantity: 10 },
      ],
    } as Partial<Schemas["Product"]>);
    const unit = suggestProduct({
      id: "product-3",
      name: "Shirt Starch",
      cover: undefined,
      purchaseUnit: 0.5,
      calculatedPrice: {
        unitPrice: 5,
        totalPrice: 5,
        referencePrice: { price: 10, referenceUnit: 1, unitName: "Litre" },
      },
    } as unknown as Partial<Schemas["Product"]>);
    const { input, links } = await setup({
      answer: answerWith(suggestResult({ products: [plain, tiered, unit] })),
      contentLang: "en-US",
    });

    await typeAndAnswer(input, "shirt");

    const [first, second, third] = links();
    expect(first?.getAttribute("href")).toBe("/Linen-Shirt/product-1");
    expect(
      first
        ?.querySelector('[data-testid="layout-search-suggest-image"]')
        ?.getAttribute("src"),
    ).toBe("https://cdn.test/product-1-280.jpg");
    const name = first?.querySelector(
      '[data-testid="layout-search-suggest-name"]',
    );
    expect(name?.textContent).toBe("Linen Shirt");
    expect(name?.getAttribute("lang")).toBe("en-US");
    expect(
      first?.querySelector('[data-testid="layout-search-suggest-price"]')
        ?.textContent,
    ).toBe("€19.99");

    expect(
      second?.querySelector('[data-testid="layout-search-suggest-price"]')
        ?.textContent,
    ).toBe("From €25.00");

    expect(
      third?.querySelector('[data-testid="layout-search-suggest-image"]'),
    ).toBeNull();
    expect(
      third?.querySelector('[data-testid="layout-search-suggest-units"]')
        ?.textContent,
    ).toBe("(€10.00 / 1 Litre)");
    expect(
      first?.querySelector('[data-testid="layout-search-suggest-units"]'),
    ).toBeNull();
  });

  it("prefixes the suggestion links under the pl-PL locale", async () => {
    const { input, links, more } = await setup({ locale: "pl-PL" });

    await typeAndAnswer(input, "shirt");

    expect(links()[0]?.getAttribute("href")).toBe(
      "/pl-PL/Linen-Shirt/product-1",
    );
    expect(more()?.getAttribute("href")).toBe("/pl-PL/search?search=shirt");
    expect(more()?.textContent).toBe("zobacz wszystkie 2 wyniki");
  });

  it("shows at most ten suggestions and links to all results", async () => {
    const products = Array.from({ length: 12 }, (_, index) =>
      suggestProduct({ id: `product-${index}`, name: `Shirt ${index}` }),
    );
    const { input, links, more, output } = await setup({
      answer: answerWith({ products, total: 12 }),
    });

    await typeAndAnswer(input, "shirt");

    expect(links()).toHaveLength(10);
    expect(more()?.textContent).toBe("see all 12 results");
    expect(more()?.getAttribute("href")).toBe("/search?search=shirt");
    expect(output.textContent).toBe("12 products found");
  });

  it("says see 1 result for a single hit", async () => {
    const { input, more, output } = await setup({
      answer: answerWith(suggestResult({ products: [suggestProduct()] })),
    });

    await typeAndAnswer(input, "linen");

    expect(more()?.textContent).toBe("see 1 result");
    expect(output.textContent).toBe("1 product found");
  });

  it("announces the Polish plural forms of the count", async () => {
    const { input, output } = await setup({
      locale: "pl-PL",
      answer: answerWith({ products: [], total: 5 }),
    });

    await typeAndAnswer(input, "shirt");

    expect(output.textContent).toBe("Znaleziono 5 produktów");
  });

  it("says no products found without a more link when nothing matches", async () => {
    const { container, input, more, output, links } = await setup({
      answer: answerWith({ products: [], total: 0 }),
    });

    await typeAndAnswer(input, "xyzzy");

    expect(query(container, NO_RESULT).textContent).toBe("No products found");
    expect(more()).toBeNull();
    expect(links()).toEqual([]);
    expect(output.textContent).toBe("No products found");
  });

  it("shows a failed read in the box and logs it without a toast", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = apiClientError([{ code: "FRAMEWORK__INVALID_CRITERIA" }]);
    const { input, box, output, notify } = await setup({
      answer: () => {
        throw failure;
      },
    });

    await typeAndAnswer(input, "shirt");

    expect(box()?.textContent).toBe("Suggestions are unavailable right now.");
    expect(output.textContent).toBe("Suggestions are unavailable right now.");
    expect(error).toHaveBeenCalledWith(
      "[Search] reading the suggestions failed",
      apiFailureSummary(failure),
    );
    expect(notify).not.toHaveBeenCalled();
  });

  it("keeps the last suggestions while the next term loads and ignores an answer that was overtaken", async () => {
    const answers = new Map<string, ReturnType<typeof deferred<unknown>>>();
    const { input, links, searches, shopware } = await setup({
      answer: (_, params) => {
        const pending = deferred<unknown>();
        answers.set((params as SuggestParams).query.search, pending);
        return pending.promise;
      },
    });

    await typeAndAnswer(input, "shirt");
    await typeAndAnswer(input, "shirts");
    expect(searches()).toEqual(["shirt", "shirts"]);
    const [first, second] = shopware
      .calls(SUGGEST)
      .map(({ params }) => (params as SuggestParams).fetchOptions.signal);
    expect(first?.aborted).toBe(true);
    expect(second?.aborted).toBe(false);

    answers.get("shirts")?.resolve({
      elements: [suggestProduct({ id: "product-9", name: "Shirts Pack" })],
      total: 1,
    });
    await settle();
    expect(links().map((link) => link.textContent)).toEqual([
      expect.stringContaining("Shirts Pack"),
    ]);

    await typeAndAnswer(input, "shirtsx");
    expect(links().map((link) => link.textContent)).toEqual([
      expect.stringContaining("Shirts Pack"),
    ]);

    answers.get("shirt")?.resolve({
      elements: [suggestProduct({ name: "Stale Shirt" })],
      total: 1,
    });
    await settle();
    expect(links().map((link) => link.textContent)).toEqual([
      expect.stringContaining("Shirts Pack"),
    ]);
  });
});

describe("HeaderSearch aborted suggestions", () => {
  it("ignores the abort of a request that a newer term overtook", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const answers = new Map<string, Pending>();
    const { input, box, links, output, searches, signals } = await setup({
      answer: abortableAnswer(answers),
    });

    await typeAndAnswer(input, "shirt");
    await type(input, "shirts");
    await settle();

    expect(signals().map((signal) => signal?.aborted)).toEqual([true]);
    expect(box()?.textContent).not.toContain(UNAVAILABLE);
    expect(output.textContent).toBe("");

    await settle(300);
    expect(searches()).toEqual(["shirt", "shirts"]);
    expect(box()?.textContent).not.toContain(UNAVAILABLE);

    answers.get("shirts")?.resolve({
      elements: [suggestProduct({ id: "product-9", name: "Shirts Pack" })],
      total: 1,
    });
    await settle();

    expect(links().map((link) => link.textContent)).toEqual([
      expect.stringContaining("Shirts Pack"),
    ]);
    expect(output.textContent).toBe("1 product found");
    expect(error).not.toHaveBeenCalled();
  });

  it("ignores the abort when the term drops below three characters and asks again for a searchable term", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const answers = new Map<string, Pending>();
    const { input, box, links, output, searches, signals } = await setup({
      answer: abortableAnswer(answers),
    });

    await typeAndAnswer(input, "shirt");
    await type(input, "sh");
    await settle();

    expect(signals().map((signal) => signal?.aborted)).toEqual([true]);
    expect(box()).toBeNull();
    expect(output.textContent).toBe("");

    await type(input, "shirt");
    expect(box()?.textContent).not.toContain(UNAVAILABLE);
    expect(output.textContent).toBe("");

    await settle(300);
    expect(searches()).toEqual(["shirt", "shirt"]);
    answers.get("shirt")?.resolve({
      elements: [suggestProduct()],
      total: 1,
    });
    await settle();

    expect(links()).toHaveLength(1);
    expect(output.textContent).toBe("1 product found");
    expect(error).not.toHaveBeenCalled();
  });
});

describe("HeaderSearch submit", () => {
  it("goes to the search page on Enter and closes the box", async () => {
    const { input, form, box } = await setup();

    await typeAndAnswer(input, "  linen shirt ");
    await interact(() => submitForm(form));

    expect(push).toHaveBeenCalledExactlyOnceWith(
      "/search?search=linen%20shirt",
    );
    expect(box()).toBeNull();
    expect(input.value).toBe("  linen shirt ");
  });

  it("goes to the prefixed search page under de-DE", async () => {
    const { input, form } = await setup({ locale: "de-DE" });

    await type(input, "Hemd");
    await interact(() => submitForm(form));

    expect(push).toHaveBeenCalledExactlyOnceWith("/de-DE/search?search=Hemd");
    expect(input.placeholder).toBe("Produkte suchen");
  });

  it("does nothing on Enter below three characters", async () => {
    const { input, form } = await setup();

    await interact(() => submitForm(form));
    await type(input, "sh ");
    await interact(() => submitForm(form));

    expect(push).not.toHaveBeenCalled();
  });
});

describe("HeaderSearch closing and keyboard", () => {
  it("closes on Escape, keeps the text and focus, and lets a second Escape through", async () => {
    const { input, box } = await setup();
    await typeAndAnswer(input, "shirt");
    await interact(() => input.focus());

    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    await interact(() => input.dispatchEvent(escape));

    expect(escape.defaultPrevented).toBe(true);
    expect(box()).toBeNull();
    expect(input.value).toBe("shirt");
    expect(document.activeElement).toBe(input);

    const second = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    await interact(() => input.dispatchEvent(second));
    expect(second.defaultPrevented).toBe(false);
  });

  it("moves through the links with the arrow keys and back to the input", async () => {
    const { input, links, more } = await setup();
    await typeAndAnswer(input, "shirt");
    await interact(() => input.focus());
    const [first, second] = links();

    await interact(() => pressKey(input, "ArrowDown"));
    expect(document.activeElement).toBe(first);

    await interact(() => pressKey(first as HTMLElement, "ArrowDown"));
    expect(document.activeElement).toBe(second);

    await interact(() => pressKey(second as HTMLElement, "ArrowDown"));
    expect(document.activeElement).toBe(more());

    await interact(() => pressKey(more() as HTMLElement, "ArrowDown"));
    expect(document.activeElement).toBe(more());

    await interact(() => pressKey(more() as HTMLElement, "ArrowUp"));
    expect(document.activeElement).toBe(second);

    await interact(() => pressKey(second as HTMLElement, "ArrowUp"));
    await interact(() => pressKey(first as HTMLElement, "ArrowUp"));
    expect(document.activeElement).toBe(input);
  });

  it("offers no stale suggestion as a focus target while the next term loads", async () => {
    const { input, links, box } = await setup();
    await typeAndAnswer(input, "shirt");
    await interact(() => input.focus());

    await type(input, "shirts");
    const list = query<HTMLUListElement>(box() as HTMLElement, "ul");
    expect(links()).toHaveLength(2);
    expect(list.hasAttribute("inert")).toBe(true);

    await interact(() => pressKey(input, "ArrowDown"));
    expect(document.activeElement).toBe(input);

    await settle(300);
    expect(list.hasAttribute("inert")).toBe(false);

    await interact(() => pressKey(input, "ArrowDown"));
    expect(document.activeElement).toBe(links()[0]);
  });

  it("closes from a link on Escape and puts focus back on the input", async () => {
    const { input, links, box } = await setup();
    await typeAndAnswer(input, "shirt");
    const [first] = links();
    await interact(() => first?.focus());

    await interact(() => pressKey(first as HTMLElement, "Escape"));

    expect(box()).toBeNull();
    expect(document.activeElement).toBe(input);
  });

  it("closes on a mousedown outside but not inside", async () => {
    const { input, box, outside } = await setup();
    await typeAndAnswer(input, "shirt");

    await interact(() =>
      box()?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );
    expect(box()).not.toBeNull();

    await interact(() =>
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );
    expect(box()).toBeNull();
  });

  it("closes when focus moves to a control outside, not into the box or nowhere", async () => {
    const { input, links, box, outside } = await setup();
    await typeAndAnswer(input, "shirt");
    const [first] = links();

    await interact(() =>
      input.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: first }),
      ),
    );
    await interact(() =>
      input.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: null }),
      ),
    );
    expect(box()).not.toBeNull();

    await interact(() =>
      first?.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
      ),
    );
    expect(box()).toBeNull();
  });

  it("closes when a suggestion is followed and when the route changes", async () => {
    const { input, links, box } = await setup();
    const stopNavigation = (event: Event) => event.preventDefault();
    document.addEventListener("click", stopNavigation, { capture: true });

    try {
      await typeAndAnswer(input, "shirt");
      await interact(() => links()[0]?.click());
      expect(box()).toBeNull();

      await type(input, "shirts");
      expect(box()).not.toBeNull();
      await interact(() => route.set("/Linen-Shirt/product-1"));
      expect(box()).toBeNull();
    } finally {
      document.removeEventListener("click", stopNavigation, { capture: true });
    }
  });

  it("stops listening once the box is closed", async () => {
    const { input, outside } = await setup();
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");

    await typeAndAnswer(input, "shirt");
    const handler = add.mock.calls.find(([kind]) => kind === "mousedown")?.[1];
    expect(handler).toBeDefined();

    await interact(() =>
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );

    expect(remove).toHaveBeenCalledWith("mousedown", handler);
  });
});

describe("HeaderSearch focus", () => {
  it("takes focus on mount when asked to", async () => {
    const { input } = await setup({ autoFocus: true });

    expect(document.activeElement).toBe(input);
  });

  it("leaves focus alone by default", async () => {
    const { input } = await setup();

    expect(document.activeElement).not.toBe(input);
  });

  it("asks at once when it takes focus with a long enough term", async () => {
    const { searches, box } = await setup({
      initial: "shirt",
      autoFocus: true,
    });
    await settle();

    expect(searches()).toEqual(["shirt"]);
    expect(box()).not.toBeNull();
  });

  it("reopens the box with the answer it has when focused again", async () => {
    const { input, outside, box, links, searches } = await setup();
    await typeAndAnswer(input, "shirt");
    await interact(() =>
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
    );
    expect(box()).toBeNull();

    await interact(() => input.focus());
    await settle(300);

    expect(box()).not.toBeNull();
    expect(links()).toHaveLength(2);
    expect(searches()).toEqual(["shirt"]);
  });
});
