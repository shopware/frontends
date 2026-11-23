import { act, useCallback, useEffect, useMemo, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { anonymousSession } from "@/features/session/anonymousSession";
import { SessionActionsProvider } from "@/features/session/components/SessionActionsContext";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { ShopwareCurrenciesProvider } from "@/features/session/components/ShopwareCurrenciesContext";
import type { CurrencyOption } from "@/features/session/currencyOptions";
import { salesChannelContext } from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import type {
  SessionActionResult,
  StorefrontSession,
} from "@/features/session/types";
import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { interact, mount, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { CurrencySwitcher } from "./CurrencySwitcher";

const refresh = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const BUTTON = '[data-testid="currency-switcher-button"]';
const OPTION = '[data-testid="currency-switcher-option"]';

const shopCurrencies: CurrencyOption[] = [
  { id: "currency-eur", isoCode: "EUR", label: "EUR (€)" },
  { id: "currency-usd", isoCode: "USD", label: "USD ($)" },
  { id: "currency-chf", isoCode: "CHF", label: "CHF" },
];

const symbols: Record<string, string> = {
  "currency-eur": "€",
  "currency-usd": "$",
  "currency-chf": "",
};

function sessionIn(currencyId: string): StorefrontSession {
  return toStorefrontSession({
    ...salesChannelContext(null),
    currency: {
      id: currencyId,
      isoCode: currencyId.replace("currency-", "").toUpperCase(),
      symbol: symbols[currencyId] ?? "",
    },
  } as Schemas["SalesChannelContext"]);
}

type LoadCurrencies = () => Promise<CurrencyOption[]>;
type SetCurrency = (currencyId: string) => Promise<SessionActionResult>;

const harness: {
  setSession: ((session: StorefrontSession) => void) | null;
  latest: StorefrontSession | null;
} = { setSession: null, latest: null };

function Harness({
  initialSession,
  load,
  setCurrency,
}: {
  initialSession: StorefrontSession;
  load: LoadCurrencies;
  setCurrency: SetCurrency;
}) {
  const [session, setSession] = useState(initialSession);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  useEffect(() => {
    harness.setSession = setSession;
  }, []);
  const loadCurrencies = useCallback(async () => {
    const loaded = await load();
    setCurrencies(loaded);
    return loaded;
  }, [load]);
  const actions = useMemo(
    () => ({
      setCurrency,
      retrySession: async () => harness.latest ?? initialSession,
    }),
    [setCurrency, initialSession],
  );
  return (
    <SessionProvider session={session}>
      <SessionActionsProvider actions={actions}>
        <ShopwareCurrenciesProvider
          currencies={currencies}
          load={loadCurrencies}
        >
          <CurrencySwitcher />
          <a href="https://shop.test/elsewhere" data-testid="outside">
            Elsewhere
          </a>
        </ShopwareCurrenciesProvider>
      </SessionActionsProvider>
    </SessionProvider>
  );
}

function switchedSession(currencyId: string): SessionActionResult {
  harness.latest = sessionIn(currencyId);
  harness.setSession?.(harness.latest);
  return { ok: true };
}

let mounted: Mounted | undefined;

beforeEach(() => {
  refresh.mockReset();
  harness.setSession = null;
  harness.latest = null;
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

function flush() {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

async function setup({
  session = sessionIn("currency-eur"),
  load = vi.fn<LoadCurrencies>(async () => shopCurrencies),
  setCurrency = vi.fn<SetCurrency>(async (currencyId) =>
    switchedSession(currencyId),
  ),
  locale = "en-GB",
}: {
  session?: StorefrontSession;
  load?: LoadCurrencies;
  setCurrency?: SetCurrency;
  locale?: Locale;
} = {}) {
  mounted = await mount(
    withI18n(
      <Harness
        initialSession={session}
        load={load}
        setCurrency={setCurrency}
      />,
      locale,
    ),
  );
  await flush();
  const { container } = mounted;
  const outside = container.querySelector<HTMLAnchorElement>(
    '[data-testid="outside"]',
  );
  if (!outside) throw new Error("The outside link is missing.");
  const button = () => container.querySelector<HTMLButtonElement>(BUTTON);
  const options = () => queryAll<HTMLButtonElement>(container, OPTION);
  const option = (label: string) => {
    const element = options().find((item) => item.textContent === label);
    if (!element) throw new Error(`The ${label} option is missing.`);
    return element;
  };
  const opened = async () => {
    const toggle = button();
    if (!toggle) throw new Error("The switcher is missing.");
    await interact(() => toggle.click());
    return toggle;
  };
  return {
    container,
    outside,
    load,
    setCurrency,
    button,
    options,
    option,
    opened,
    status: () => container.querySelector("output")?.textContent,
  };
}

function pressEscape() {
  return interact(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });
}

describe("CurrencySwitcher", () => {
  it("reads the currencies once the session is known and names the current one", async () => {
    const load = vi.fn<LoadCurrencies>(async () => shopCurrencies);
    const { button } = await setup({ session: anonymousSession, load });

    expect(load).not.toHaveBeenCalled();
    expect(button()).toBeNull();

    await interact(() => harness.setSession?.(sessionIn("currency-eur")));
    await flush();

    expect(load).toHaveBeenCalledOnce();
    const toggle = button();
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(toggle?.textContent).toBe("Change currency: EUR (€)");
    expect(toggle?.querySelector(".sr-only")?.textContent).toBe(
      "Change currency: ",
    );
  });

  it("stays hidden for a sales channel with fewer than two currencies", async () => {
    const { button, container } = await setup({
      load: async () => [shopCurrencies[0] as CurrencyOption],
    });

    expect(button()).toBeNull();
    expect(container.querySelector("output")).toBeNull();
  });

  it("stays hidden and logs when the currencies cannot be read", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const failure = new TypeError("Failed to fetch");
    const { button } = await setup({
      load: async () => {
        throw failure;
      },
    });

    expect(button()).toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      "[Currency] reading the currencies failed",
      failure,
    );
  });

  it("lists every currency in a right-aligned list with the current one marked", async () => {
    const { opened, options, container } = await setup({
      session: sessionIn("currency-usd"),
    });

    const toggle = await opened();

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent).toBe("Change currency: USD ($)");
    const list = container.querySelector("ul");
    expect(list?.id).toBe(toggle.getAttribute("aria-controls"));
    expect(list?.className).toContain("right-0");
    expect(list?.className).toContain("bg-shell-sand");
    expect(container.querySelector("select")).toBeNull();
    expect(
      options().map((item) => [
        item.tagName,
        item.getAttribute("type"),
        item.textContent,
        item.getAttribute("aria-current"),
      ]),
    ).toEqual([
      ["BUTTON", "button", "EUR (€)", null],
      ["BUTTON", "button", "USD ($)", "true"],
      ["BUTTON", "button", "CHF", null],
    ]);
  });

  it("switches the session currency, announces it while pending, then closes, returns focus and refreshes the route", async () => {
    const gate = Promise.withResolvers<void>();
    const setCurrency = vi.fn<SetCurrency>(async (currencyId) => {
      await gate.promise;
      return switchedSession(currencyId);
    });
    const { opened, option, options, button, status } = await setup({
      setCurrency,
    });
    const toggle = await opened();
    const dollar = option("USD ($)");
    await interact(() => dollar.focus());

    await interact(() => dollar.click());

    expect(setCurrency).toHaveBeenCalledExactlyOnceWith("currency-usd");
    expect(toggle.getAttribute("aria-busy")).toBe("true");
    expect(dollar.getAttribute("aria-busy")).toBe("true");
    expect(option("CHF").hasAttribute("aria-busy")).toBe(false);
    expect(options().map((item) => item.getAttribute("aria-disabled"))).toEqual(
      ["true", "true", "true"],
    );
    expect(status()).toBe("Switching the currency to USD ($)…");

    await interact(() => option("CHF").click());
    await interact(() => dollar.click());
    expect(setCurrency).toHaveBeenCalledOnce();
    expect(refresh).not.toHaveBeenCalled();

    await act(async () => {
      gate.resolve();
    });

    expect(options()).toHaveLength(0);
    expect(button()?.getAttribute("aria-expanded")).toBe("false");
    expect(button()?.hasAttribute("aria-busy")).toBe(false);
    expect(button()?.textContent).toBe("Change currency: USD ($)");
    expect(document.activeElement).toBe(button());
    expect(status()).toBe("Currency changed to USD ($).");
    expect(refresh).toHaveBeenCalledOnce();

    await interact(() => button()?.click());
    expect(status()).toBe("");
  });

  it("reloads the page when the session still holds the old currency after the switch", async () => {
    const reload = vi
      .spyOn(window.location, "reload")
      .mockImplementation(() => {});
    const setCurrency = vi.fn<SetCurrency>(async () => ({ ok: true }));
    const { opened, option } = await setup({ setCurrency });
    await opened();

    await interact(() => option("USD ($)").click());
    await flush();

    expect(reload).toHaveBeenCalledOnce();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("reads the currencies again when the tab becomes visible after a failed read", async () => {
    const load = vi
      .fn<LoadCurrencies>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(shopCurrencies);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { button } = await setup({ load });
    await flush();
    expect(button()).toBeNull();

    await interact(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await flush();

    expect(load).toHaveBeenCalledTimes(2);
    expect(button()).not.toBeNull();
  });

  it("keeps the list open without refreshing when the switch fails", async () => {
    const setCurrency = vi.fn<SetCurrency>(async () => ({
      ok: false,
      message: "Currency not available.",
    }));
    const { opened, option, options, button, status, container } = await setup({
      setCurrency,
    });
    const toggle = await opened();

    await interact(() => option("CHF").click());

    expect(setCurrency).toHaveBeenCalledExactlyOnceWith("currency-chf");
    expect(options()).toHaveLength(3);
    expect(toggle.hasAttribute("aria-busy")).toBe(false);
    expect(options().some((item) => item.hasAttribute("aria-disabled"))).toBe(
      false,
    );
    expect(status()).toBe("");
    expect(button()?.textContent).toBe("Change currency: EUR (€)");
    expect(container.textContent).not.toContain("Currency not available.");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("closes on Escape and returns focus to the button", async () => {
    const { opened, option, options } = await setup();
    const toggle = await opened();
    await interact(() => option("CHF").focus());

    await pressEscape();

    expect(options()).toHaveLength(0);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });

  it("leaves focus where it is when Escape is pressed outside the switcher", async () => {
    const { opened, options, outside } = await setup();
    await opened();
    await interact(() => outside.focus());

    await pressEscape();

    expect(options()).toHaveLength(0);
    expect(document.activeElement).toBe(outside);
  });

  it("closes once focus or a mousedown leaves the switcher", async () => {
    const { opened, option, options, outside } = await setup();
    const toggle = await opened();
    await interact(() => toggle.focus());
    await interact(() => option("CHF").focus());
    await interact(() => {
      option("CHF").dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });
    expect(options()).toHaveLength(3);

    await interact(() => outside.focus());
    expect(options()).toHaveLength(0);

    await opened();
    await interact(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });
    expect(options()).toHaveLength(0);
  });

  it("closes without a switch when the current currency is chosen", async () => {
    const { opened, option, options, setCurrency } = await setup();
    const toggle = await opened();
    const euro = option("EUR (€)");
    await interact(() => euro.focus());

    await interact(() => euro.click());

    expect(setCurrency).not.toHaveBeenCalled();
    expect(options()).toHaveLength(0);
    expect(document.activeElement).toBe(toggle);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("keeps a switch running when the list is closed and leaves focus alone once it lands", async () => {
    const gate = Promise.withResolvers<void>();
    const { opened, option, outside, button, status } = await setup({
      setCurrency: async (currencyId) => {
        await gate.promise;
        return switchedSession(currencyId);
      },
    });
    await opened();
    await interact(() => option("USD ($)").focus());
    await interact(() => option("USD ($)").click());
    await interact(() => outside.focus());

    expect(button()?.getAttribute("aria-expanded")).toBe("false");
    expect(button()?.getAttribute("aria-busy")).toBe("true");
    expect(status()).toBe("Switching the currency to USD ($)…");

    await act(async () => {
      gate.resolve();
    });

    expect(button()?.hasAttribute("aria-busy")).toBe(false);
    expect(button()?.textContent).toBe("Change currency: USD ($)");
    expect(document.activeElement).toBe(outside);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("never refreshes the route once it is unmounted", async () => {
    const gate = Promise.withResolvers<void>();
    const { opened, option } = await setup({
      setCurrency: async () => {
        await gate.promise;
        return { ok: true };
      },
    });
    await opened();
    await interact(() => option("USD ($)").click());

    await mounted?.unmount();
    mounted = undefined;
    await act(async () => {
      gate.resolve();
    });

    expect(refresh).not.toHaveBeenCalled();
  });

  it("speaks the page locale", async () => {
    const gate = Promise.withResolvers<void>();
    const { opened, option, button, status } = await setup({
      locale: "pl-PL",
      setCurrency: async (currencyId) => {
        await gate.promise;
        return switchedSession(currencyId);
      },
    });

    expect(button()?.textContent).toBe("Zmień walutę: EUR (€)");

    await opened();
    await interact(() => option("USD ($)").click());

    expect(status()).toBe("Zmiana waluty na USD ($)…");

    await act(async () => {
      gate.resolve();
    });
  });
});
