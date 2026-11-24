import { Activity, useLayoutEffect, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { deferred, interact, mount, query } from "../../__fixtures__/dom";
import type { Mounted } from "../../__fixtures__/dom";
import { CmsActionsProvider } from "../../actions/CmsActionsContext";
import type {
  CmsActions,
  CmsFindVariantInput,
  CmsFindVariantResult,
  CmsVariantResult,
} from "../../actions/CmsActionsContext";
import { SwVariantConfiguratorOptions } from "./SwVariantConfiguratorOptions";
import type { SwVariantOptionGroup } from "./variantOptionGroups";

const navigation = vi.hoisted(() => ({
  go: null as ((href: string) => void) | null,
}));

const router = vi.hoisted(() => ({
  replace: vi.fn<(href: string, options?: { scroll?: boolean }) => void>(
    (href) => {
      navigation.go?.(href);
    },
  ),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

const MESSAGES = {
  hint: "Selecting an option loads the matching variant.",
  loading: "Loading the selected variant…",
  unavailable:
    "This combination is not available. Your previous selection has been restored.",
  failed: "The selected variant could not be loaded. Please try again.",
};

const optionGroups: SwVariantOptionGroup[] = [
  {
    id: "group-color",
    name: "Color",
    options: [
      { id: "option-red", name: "Red" },
      { id: "option-blue", name: "Blue" },
    ],
  },
  {
    id: "group-size",
    name: "Size",
    options: [
      { id: "option-small", name: "Small" },
      { id: "option-large", name: "Large" },
    ],
  },
];

type Page = { productId: string; optionIds: string[] };

const RED_LARGE: Page = {
  productId: "variant-red-large",
  optionIds: ["option-large", "option-red"],
};
const BLUE_LARGE: Page = {
  productId: "variant-blue-large",
  optionIds: ["option-blue", "option-large"],
};
const BLUE_SMALL: Page = {
  productId: "variant-blue-small",
  optionIds: ["option-blue", "option-small"],
};

const PAGES: Record<string, Page> = {
  "/de-DE/Shirt/SW10001.2": BLUE_LARGE,
  "/de-DE/detail/variant-blue-large": BLUE_LARGE,
};

const BLUE_LARGE_VARIANT: CmsVariantResult = {
  productId: BLUE_LARGE.productId,
  url: "/Shirt/SW10001.2",
};

type NavigationMode = "remount" | "inPlace" | "none";

type StorefrontProps = {
  mode: NavigationMode;
  page: Page;
  hidden?: boolean;
  allowRedirect?: boolean;
  onChange?: (variant: CmsVariantResult | null) => void;
};

function ProductPage({
  page,
  allowRedirect,
  onChange,
}: Pick<StorefrontProps, "page" | "allowRedirect" | "onChange">) {
  return (
    <div data-page={page.productId}>
      <SwVariantConfiguratorOptions
        productId={page.productId}
        parentId="parent-1"
        optionIds={page.optionIds}
        optionGroups={optionGroups}
        urlPrefix="de-DE"
        allowRedirect={allowRedirect}
        onChange={onChange}
      />
    </div>
  );
}

function Storefront({
  mode,
  page,
  hidden = false,
  allowRedirect,
  onChange,
}: StorefrontProps) {
  const [href, setHref] = useState<string | null>(null);
  useLayoutEffect(() => {
    navigation.go = mode === "none" ? null : setHref;
    return () => {
      navigation.go = null;
    };
  }, [mode]);
  const target = href ? PAGES[href] : undefined;
  const pageProps = { allowRedirect, onChange };
  return (
    <>
      <button type="button" data-testid="elsewhere">
        elsewhere
      </button>
      {mode === "inPlace" ? (
        <ProductPage page={target ?? page} {...pageProps} />
      ) : (
        <>
          <Activity mode={target || hidden ? "hidden" : "visible"}>
            <ProductPage page={page} {...pageProps} />
          </Activity>
          {target ? <ProductPage page={target} {...pageProps} /> : null}
        </>
      )}
    </>
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  router.replace.mockClear();
  router.push.mockClear();
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  navigation.go = null;
  vi.restoreAllMocks();
});

type Lookup = ReturnType<typeof deferred<CmsFindVariantResult>>;

async function setup(
  props: Partial<StorefrontProps> & {
    findVariant?: CmsActions["findVariant"];
  } = {},
) {
  const lookups: Lookup[] = [];
  const findVariant = vi.fn<CmsActions["findVariant"]>(
    props.findVariant ??
      (() => {
        const lookup = deferred<CmsFindVariantResult>();
        lookups.push(lookup);
        return lookup.promise;
      }),
  );
  const storefrontProps: StorefrontProps = {
    mode: "remount",
    page: RED_LARGE,
    ...props,
  };
  const render = (next: Partial<StorefrontProps> = {}) => (
    <CmsActionsProvider actions={{ findVariant }}>
      <Storefront {...storefrontProps} {...next} />
    </CmsActionsProvider>
  );
  mounted = await mount(render());
  const { rerender } = mounted;
  return {
    findVariant,
    lookups,
    rerender: (next: Partial<StorefrontProps>) => rerender(render(next)),
    answer: (result: CmsFindVariantResult, index = lookups.length - 1) =>
      interact(() => lookups[index]?.resolve(result)),
  };
}

function pageRoot(productId: string): HTMLElement {
  return query<HTMLElement>(document.body, `[data-page="${productId}"]`);
}

function configurator(productId = RED_LARGE.productId): HTMLElement {
  return query<HTMLElement>(pageRoot(productId), ":scope > div");
}

function radio(
  optionId: string,
  productId = RED_LARGE.productId,
): HTMLInputElement {
  return query<HTMLInputElement>(
    pageRoot(productId),
    `input[type="radio"][value="${optionId}"]`,
  );
}

function label(optionId: string, productId = RED_LARGE.productId) {
  const element = radio(optionId, productId).closest("label");
  if (!element) throw new Error(`No label wraps ${optionId}`);
  return element;
}

function statusOf(productId = RED_LARGE.productId): HTMLOutputElement {
  return query<HTMLOutputElement>(
    pageRoot(productId),
    '[data-testid="product-variant-status"]',
  );
}

function optionsBlock(productId = RED_LARGE.productId): HTMLElement {
  return query<HTMLElement>(
    configurator(productId),
    ":scope > div:has(fieldset)",
  );
}

function isBusy(productId = RED_LARGE.productId): boolean {
  return (
    optionsBlock(productId).getAttribute("aria-busy") === "true" &&
    pageRoot(productId).querySelector('[data-testid="loading"]') !== null
  );
}

function isIdle(productId = RED_LARGE.productId): boolean {
  return (
    !optionsBlock(productId).hasAttribute("aria-busy") &&
    pageRoot(productId).querySelector('[data-testid="loading"]') === null
  );
}

function checked(productId = RED_LARGE.productId): string[] {
  return Array.from(
    pageRoot(productId).querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    ),
  )
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function choose(optionId: string, productId = RED_LARGE.productId) {
  return interact(() => {
    const input = radio(optionId, productId);
    input.focus();
    input.click();
  });
}

function lookupInput(
  findVariant: Mock<CmsActions["findVariant"]>,
  index = 0,
): CmsFindVariantInput {
  const input = findVariant.mock.calls[index]?.[0];
  if (!input) throw new Error(`findVariant call ${index} is missing`);
  return input;
}

describe("SwVariantConfiguratorOptions", () => {
  it("asks for the selection in group order with the switched group and shows the lookup while it runs", async () => {
    const shop = await setup({ mode: "none" });

    await interact(() => label("option-blue").click());

    const input = lookupInput(shop.findVariant);
    expect(input).toMatchObject({
      productId: "variant-red-large",
      parentId: "parent-1",
      options: { "group-color": "option-blue", "group-size": "option-large" },
      switchedGroup: "group-color",
    });
    expect(Object.keys(input.options)).toEqual(["group-color", "group-size"]);
    expect(input.signal).toBeInstanceOf(AbortSignal);
    expect(input.signal?.aborted).toBe(false);
    expect(isBusy()).toBe(true);
    expect(checked()).toEqual(["option-blue", "option-large"]);
    expect(label("option-blue").className).toContain("border-brand-primary");
    expect(label("option-red").className).not.toContain("border-brand-primary");
    expect(radio("option-red").disabled).toBe(false);
    expect(statusOf().textContent).toBe(MESSAGES.loading);
    expect(statusOf().className).toBe("sr-only");
    expect(statusOf().closest("[aria-busy]")).toBeNull();
  });

  it("describes every option group with the hint and leaves the status empty", async () => {
    await setup();

    const hint = query<HTMLElement>(pageRoot(RED_LARGE.productId), "p.sr-only");
    const fieldsets = pageRoot(RED_LARGE.productId).querySelectorAll(
      "fieldset",
    );

    expect(hint.textContent).toBe(MESSAGES.hint);
    expect(fieldsets).toHaveLength(2);
    for (const fieldset of fieldsets) {
      expect(fieldset.getAttribute("aria-describedby")).toBe(hint.id);
    }
    expect(statusOf().textContent).toBe("");
    expect(isIdle()).toBe(true);
  });

  it("opens the variant's path under the locale prefix with replace and without scrolling", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/de-DE/Shirt/SW10001.2", {
      scroll: false,
    });
    expect(router.push).not.toHaveBeenCalled();
  });

  it("opens the technical path of a variant without a url", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({
      ok: true,
      variant: { productId: "variant-blue-large" },
    });

    expect(router.replace).toHaveBeenCalledWith(
      "/de-DE/detail/variant-blue-large",
      { scroll: false },
    );
  });

  it("mounts the variant page fresh, resets the hidden one and puts focus back on the chosen option", async () => {
    const shop = await setup({ mode: "remount" });

    await choose("option-blue");
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(pageRoot(RED_LARGE.productId).style.display).toBe("none");
    expect(document.activeElement).toBe(
      radio("option-blue", BLUE_LARGE.productId),
    );
    expect(checked(BLUE_LARGE.productId)).toEqual([
      "option-blue",
      "option-large",
    ]);
    expect(isIdle(BLUE_LARGE.productId)).toBe(true);
    expect(statusOf(BLUE_LARGE.productId).textContent).toBe("");
    expect(isIdle(RED_LARGE.productId)).toBe(true);
    expect(checked(RED_LARGE.productId)).toEqual([
      "option-red",
      "option-large",
    ]);
    expect(statusOf(RED_LARGE.productId).textContent).toBe("");
  });

  it("leaves the focus alone when the customer moved it elsewhere meanwhile", async () => {
    const shop = await setup({ mode: "remount" });
    const elsewhere = query<HTMLButtonElement>(
      document.body,
      '[data-testid="elsewhere"]',
    );

    await choose("option-blue");
    elsewhere.focus();
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(document.activeElement).toBe(elsewhere);
  });

  it("updates in place when the page keeps the island and restores lost focus", async () => {
    const shop = await setup({ mode: "inPlace" });

    await choose("option-blue");
    radio("option-blue").blur();
    expect(document.activeElement).toBe(document.body);
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(checked(BLUE_LARGE.productId)).toEqual([
      "option-blue",
      "option-large",
    ]);
    expect(isIdle(BLUE_LARGE.productId)).toBe(true);
    expect(statusOf(BLUE_LARGE.productId).textContent).toBe("");
    expect(document.activeElement).toBe(
      radio("option-blue", BLUE_LARGE.productId),
    );
  });

  it("resets when the navigation ends without replacing the island", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(isIdle()).toBe(true);
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe("");

    radio("option-blue").blur();
    await shop.rerender({ page: BLUE_LARGE });

    expect(document.activeElement).toBe(document.body);
  });

  it("rolls back and says so when the combination is unavailable", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({ ok: false, notFound: true });

    expect(router.replace).not.toHaveBeenCalled();
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(label("option-red").className).toContain("border-brand-primary");
    expect(statusOf().textContent).toBe(MESSAGES.unavailable);
    expect(statusOf().className).toContain("text-states-error");
    expect(statusOf().className).not.toContain("sr-only");
    expect(isIdle()).toBe(true);
  });

  it("rolls back with the failure message when the lookup fails", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({ ok: false });

    expect(router.replace).not.toHaveBeenCalled();
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe(MESSAGES.failed);
    expect(isIdle()).toBe(true);
  });

  it("treats a rejected lookup as a failure", async () => {
    await setup({
      mode: "none",
      findVariant: () => Promise.reject(new Error("offline")),
    });

    await choose("option-blue");

    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe(MESSAGES.failed);
    expect(isIdle()).toBe(true);
  });

  it("clears the message on the next choice", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({ ok: false, notFound: true });
    await choose("option-small");

    expect(statusOf().textContent).toBe(MESSAGES.loading);
    expect(statusOf().className).toBe("sr-only");
  });

  it("lets only the latest of two quick changes navigate", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await choose("option-small");

    const first = lookupInput(shop.findVariant, 0);
    const second = lookupInput(shop.findVariant, 1);
    expect(first.signal?.aborted).toBe(true);
    expect(second.signal?.aborted).toBe(false);
    expect(second.options).toEqual({
      "group-color": "option-blue",
      "group-size": "option-small",
    });
    expect(second.switchedGroup).toBe("group-size");

    await shop.answer(
      { ok: true, variant: { productId: "variant-blue-small" } },
      1,
    );
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT }, 0);

    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith(
      "/de-DE/detail/variant-blue-small",
      { scroll: false },
    );
  });

  it("ignores an answer for a product the page no longer shows", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    const { signal } = lookupInput(shop.findVariant);
    await shop.rerender({ page: BLUE_SMALL });
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(signal?.aborted).toBe(true);
    expect(router.replace).not.toHaveBeenCalled();
    expect(checked(BLUE_SMALL.productId)).toEqual([
      "option-blue",
      "option-small",
    ]);
    expect(isIdle(BLUE_SMALL.productId)).toBe(true);
  });

  it("drops the lookup when the page is hidden and comes back reset", async () => {
    const shop = await setup({ mode: "remount" });

    await choose("option-blue");
    const { signal } = lookupInput(shop.findVariant);
    await shop.rerender({ hidden: true });

    expect(signal?.aborted).toBe(true);

    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });
    await shop.rerender({ hidden: false });

    expect(router.replace).not.toHaveBeenCalled();
    expect(isIdle()).toBe(true);
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe("");
  });

  it("aborts the lookup and never navigates after an unmount", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    const { signal } = lookupInput(shop.findVariant);
    await mounted?.unmount();
    mounted = undefined;
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(signal?.aborted).toBe(true);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("stays on the product when the lookup answers the product itself", async () => {
    const shop = await setup({ mode: "none" });

    await choose("option-blue");
    await shop.answer({
      ok: true,
      variant: { productId: RED_LARGE.productId, url: "/Shirt/SW10001.1" },
    });

    expect(router.replace).not.toHaveBeenCalled();
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe("");
    expect(isIdle()).toBe(true);
  });

  it("reports to onChange instead of navigating when redirects are off", async () => {
    const onChange = vi.fn();
    const shop = await setup({ mode: "none", allowRedirect: false, onChange });

    await choose("option-blue");
    await shop.answer({ ok: true, variant: BLUE_LARGE_VARIANT });

    expect(onChange).toHaveBeenCalledWith(BLUE_LARGE_VARIANT);
    expect(router.replace).not.toHaveBeenCalled();
    expect(checked()).toEqual(["option-blue", "option-large"]);
    expect(statusOf().textContent).toBe("");
    expect(isIdle()).toBe(true);

    await choose("option-small");
    await shop.answer({ ok: false, notFound: true });

    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(statusOf().textContent).toBe(MESSAGES.unavailable);
  });

  it("shows the failure and warns once without a provider", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mounted = await mount(<ProductPage page={RED_LARGE} />);

    await choose("option-blue");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(statusOf().textContent).toBe(MESSAGES.failed);
    expect(checked()).toEqual(["option-red", "option-large"]);
    expect(router.replace).not.toHaveBeenCalled();
  });
});
