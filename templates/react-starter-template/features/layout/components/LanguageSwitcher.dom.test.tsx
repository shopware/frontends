import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiClient } from "#shopware";
import { SessionProvider } from "@/features/session/components/SessionProvider";
import { ShopwareLanguagesProvider } from "@/features/session/components/ShopwareLanguagesContext";
import { salesChannelContext } from "@/features/session/session.fixture";
import { toStorefrontSession } from "@/features/session/sessionFromContext";
import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import type {
  LanguageOption,
  SalesChannelLanguages,
} from "@/platform/shopware/reads/languageOptions";
import { withI18n } from "@/test/i18n";
import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { LanguageSwitcher } from "./LanguageSwitcher";

const READ_SEO_URL = "readSeoUrlGet get /seo-url";

const shopLanguages: LanguageOption[] = [
  { id: "language-en", code: "en-GB" },
  { id: "language-de", code: "de-DE" },
  { id: "language-pl", code: "pl-PL" },
];

const demoLanguages: LanguageOption[] = [{ id: "language-us", code: "en-US" }];

const furniturePaths: Record<string, string> = {
  "language-en": "Furniture/",
  "language-de": "Moebel/",
  "language-pl": "Meble/",
};

type Invoke = (operation: string, params?: unknown) => Promise<unknown>;

type LoadLanguages = () => Promise<SalesChannelLanguages>;

async function answerSeoUrl(operation: string, params?: unknown) {
  if (operation !== READ_SEO_URL) {
    throw new Error(`Unexpected operation ${operation}`);
  }
  const languageId =
    (params as { headers: Record<string, string> }).headers["sw-language-id"] ??
    "";
  const seoPathInfo = furniturePaths[languageId];
  return {
    data: {
      elements: seoPathInfo
        ? [
            {
              routeName: "frontend.navigation.page",
              foreignKey: "category-furniture",
              seoPathInfo,
            },
          ]
        : [],
    },
    status: 200,
  };
}

const invoke = vi.fn<Invoke>(answerSeoUrl);
const assign = vi.fn<(url: string | URL) => void>();

let mounted: Mounted | undefined;

beforeEach(() => {
  vi.stubEnv("__NEXT_MANUAL_TRAILING_SLASH", "true");
  invoke.mockReset();
  invoke.mockImplementation(answerSeoUrl);
  assign.mockReset();
  vi.spyOn(window.location, "assign").mockImplementation(assign);
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

async function setup({
  locale = "en-GB",
  languages = shopLanguages,
  load = vi.fn<LoadLanguages>(async () => {
    throw new Error("Unexpected language read");
  }),
  url = "/Furniture/?order=price-asc#reviews",
}: {
  locale?: Locale;
  languages?: LanguageOption[];
  load?: LoadLanguages;
  url?: string;
} = {}) {
  window.history.replaceState(null, "", url);
  const client = { invoke } as unknown as ApiClient;
  mounted = await mount(
    withI18n(
      <ShopwareClientProvider getClient={async () => client}>
        <SessionProvider session={toStorefrontSession(salesChannelContext())}>
          <ShopwareLanguagesProvider languages={languages} load={load}>
            <LanguageSwitcher />
            <a href="https://shop.test/elsewhere" data-testid="outside">
              Elsewhere
            </a>
          </ShopwareLanguagesProvider>
        </SessionProvider>
      </ShopwareClientProvider>,
      locale,
    ),
  );
  const { container } = mounted;
  const button = container.querySelector("button");
  const outside = container.querySelector<HTMLAnchorElement>(
    '[data-testid="outside"]',
  );
  if (!button || !outside) throw new Error("The switcher is missing.");
  const link = (code: Locale) => {
    const element = container.querySelector<HTMLAnchorElement>(
      `ul a[hreflang="${code}"]`,
    );
    if (!element) throw new Error(`The ${code} link is missing.`);
    return element;
  };
  return {
    container,
    button,
    outside,
    load,
    links: () => Array.from(container.querySelectorAll("ul a")),
    link,
    status: () => container.querySelector("output")?.textContent,
  };
}

async function click(element: Element, init: MouseEventInit = {}) {
  let followed = true;
  await interact(() => {
    followed = element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        button: 0,
        ...init,
      }),
    );
  });
  return followed;
}

function pressEscape() {
  return interact(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });
}

function flush(action: () => void = () => {}) {
  return act(async () => {
    action();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function holdSeoReads() {
  const gate = Promise.withResolvers<void>();
  invoke.mockImplementation(async (operation, params) => {
    await gate.promise;
    return answerSeoUrl(operation, params);
  });
  return () => flush(() => gate.resolve());
}

function languageHeaders(): string[] {
  return invoke.mock.calls
    .map(
      ([, params]) =>
        (params as { headers: Record<string, string> }).headers[
          "sw-language-id"
        ] ?? "",
    )
    .toSorted();
}

describe("LanguageSwitcher", () => {
  it("lists every locale with the current page under it, keeping search and hash", async () => {
    const { button, links } = await setup({
      locale: "pl-PL",
      languages: demoLanguages,
      url: "/pl-PL/Furniture/?order=price-asc#reviews",
    });

    await click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(
      links().map((link) => [
        link.textContent,
        link.getAttribute("href"),
        link.getAttribute("hreflang"),
        link.getAttribute("lang"),
        link.getAttribute("aria-current"),
      ]),
    ).toEqual([
      [
        "English",
        "/Furniture/?order=price-asc#reviews",
        "en-GB",
        "en-GB",
        null,
      ],
      [
        "Polski",
        "/pl-PL/Furniture/?order=price-asc#reviews",
        "pl-PL",
        "pl-PL",
        "true",
      ],
      [
        "Deutsch",
        "/de-DE/Furniture/?order=price-asc#reviews",
        "de-DE",
        "de-DE",
        null,
      ],
    ]);
  });

  it("closes on Escape and returns focus to the button", async () => {
    const { button, link, links } = await setup();
    await click(button);
    await interact(() => link("de-DE").focus());

    await pressEscape();

    expect(links()).toHaveLength(0);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("leaves focus where it is when Escape is pressed outside the switcher", async () => {
    const { button, outside, links } = await setup();
    await click(button);
    await interact(() => outside.focus());
    expect(links()).toHaveLength(3);

    await pressEscape();

    expect(links()).toHaveLength(0);
    expect(document.activeElement).toBe(outside);
  });

  it("closes once focus leaves the switcher and stays open while it moves inside", async () => {
    const { button, outside, link, links } = await setup();
    await click(button);

    await interact(() => button.focus());
    await interact(() => link("de-DE").focus());
    expect(links()).toHaveLength(3);

    await interact(() => outside.focus());

    expect(links()).toHaveLength(0);
    expect(document.activeElement).toBe(outside);
  });

  it("closes on a mousedown outside and stays open on one inside", async () => {
    const { button, link, links } = await setup();
    await click(button);

    await interact(() => {
      link("de-DE").dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });
    expect(links()).toHaveLength(3);

    await interact(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });
    expect(links()).toHaveLength(0);
  });

  it("closes when the browser goes back or forward", async () => {
    const { button, links } = await setup();
    await click(button);

    await interact(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(links()).toHaveLength(0);
  });

  it("loads the chosen locale with a full page load when both read the same Shopware language, like the demo", async () => {
    const { button, link, status } = await setup({ languages: demoLanguages });
    await click(button);
    const german = link("de-DE");

    expect(await click(german)).toBe(false);

    expect(german.getAttribute("href")).toBe(
      "/de-DE/Furniture/?order=price-asc#reviews",
    );
    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/de-DE/Furniture/?order=price-asc#reviews",
    );
    expect(invoke).not.toHaveBeenCalled();
    expect(german.getAttribute("aria-busy")).toBe("true");
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(status()).toBe("Opening the page in Deutsch…");
  });

  it("resolves the catalog page in every other Shopware language when the list opens", async () => {
    const { button, link } = await setup();
    await click(button);
    await flush();

    expect(languageHeaders()).toEqual([
      "language-de",
      "language-en",
      "language-en",
      "language-pl",
    ]);
    expect(link("de-DE").getAttribute("href")).toBe(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
    expect(link("pl-PL").getAttribute("href")).toBe(
      "/pl-PL/Meble/?order=price-asc#reviews",
    );

    expect(await click(link("de-DE"))).toBe(false);

    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
  });

  it("leaves a modified click to the browser with the resolved href", async () => {
    const { button, link, links } = await setup();
    await click(button);
    await flush();
    const german = link("de-DE");

    expect(await click(german, { ctrlKey: true })).toBe(true);

    expect(german.getAttribute("href")).toBe(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
    expect(assign).not.toHaveBeenCalled();
    expect(links()).toHaveLength(3);
  });

  it("waits for a lookup that is still running, shows and announces it, and ignores a repeat click", async () => {
    const release = holdSeoReads();
    const { button, link, links, status } = await setup();
    await click(button);
    const german = link("de-DE");

    expect(await click(german)).toBe(false);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(german.getAttribute("aria-busy")).toBe("true");
    expect(german.getAttribute("aria-disabled")).toBe("true");
    expect(link("pl-PL").hasAttribute("aria-busy")).toBe(false);
    expect(status()).toBe("Opening the page in Deutsch…");
    expect(links()).toHaveLength(3);

    expect(await click(german)).toBe(false);
    expect(assign).not.toHaveBeenCalled();

    await release();

    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
  });

  it("lets a later choice replace one that is still waiting", async () => {
    const release = holdSeoReads();
    const { button, link, status } = await setup();
    await click(button);
    await click(link("de-DE"));

    expect(await click(link("pl-PL"))).toBe(false);

    expect(link("pl-PL").getAttribute("aria-busy")).toBe("true");
    expect(link("de-DE").hasAttribute("aria-busy")).toBe(false);
    expect(status()).toBe("Opening the page in Polski…");

    await release();

    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/pl-PL/Meble/?order=price-asc#reviews",
    );
  });

  it("drops a waiting choice on Escape", async () => {
    const release = holdSeoReads();
    const { button, link, links, status } = await setup();
    await click(button);
    await click(link("de-DE"));

    await pressEscape();

    expect(links()).toHaveLength(0);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    expect(status()).toBe("");

    await release();

    expect(assign).not.toHaveBeenCalled();
  });

  it("drops a waiting choice when the page changes before the lookup answers", async () => {
    const release = holdSeoReads();
    const { button, link, links } = await setup();
    await click(button);
    await click(link("de-DE"));

    window.history.pushState(null, "", "/Chairs/");
    await release();

    expect(assign).not.toHaveBeenCalled();
    expect(links()).toHaveLength(0);
    expect(button.hasAttribute("aria-busy")).toBe(false);
  });

  it("drops a waiting choice when another link on the page is followed", async () => {
    const release = holdSeoReads();
    const { button, link, links, outside } = await setup();
    outside.addEventListener("click", (event) => event.preventDefault());
    await click(button);
    await click(link("de-DE"));

    await click(outside);

    expect(links()).toHaveLength(0);
    expect(button.hasAttribute("aria-busy")).toBe(false);

    await release();

    expect(assign).not.toHaveBeenCalled();
  });

  it("never navigates once it is unmounted", async () => {
    const release = holdSeoReads();
    const { button, link } = await setup();
    await click(button);
    await click(link("de-DE"));

    await mounted?.unmount();
    mounted = undefined;
    await release();

    expect(assign).not.toHaveBeenCalled();
  });

  it("abandons the lookup of a closed list and starts the reopened one from the prefix", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const releaseFirst = holdSeoReads();
    const { button, link } = await setup();
    await click(button);
    await click(button);
    await releaseFirst();

    const releaseSecond = holdSeoReads();
    await click(button);

    expect(link("de-DE").getAttribute("href")).toBe(
      "/de-DE/Furniture/?order=price-asc#reviews",
    );

    await releaseSecond();

    expect(link("de-DE").getAttribute("href")).toBe(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("swaps only the prefix on an account page even with different languages", async () => {
    const { button, link, load } = await setup({ url: "/account/order?p=2" });
    await click(button);
    await flush();
    const polish = link("pl-PL");

    expect(polish.getAttribute("href")).toBe("/pl-PL/account/order?p=2");
    expect(await click(polish)).toBe(false);

    expect(invoke).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledExactlyOnceWith("/pl-PL/account/order?p=2");
  });

  it("closes without navigating when the current language is chosen and puts focus back on the button", async () => {
    const { button, link, links } = await setup();
    await click(button);
    const english = link("en-GB");
    await interact(() => english.focus());

    expect(await click(english)).toBe(false);

    expect(assign).not.toHaveBeenCalled();
    expect(links()).toHaveLength(0);
    expect(document.activeElement).toBe(button);
  });

  it("falls back to the sales channel language for a locale without its own", async () => {
    const { button, link } = await setup({
      languages: [{ id: "language-en", code: "en-GB" }],
    });
    await click(button);
    await flush();

    expect(languageHeaders()).toEqual([
      "language-de",
      "language-de",
      "language-en",
      "language-en",
    ]);

    await click(link("de-DE"));

    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
  });

  it("reads the URL again every time the list opens", async () => {
    const { button, link } = await setup({ languages: demoLanguages });
    window.history.pushState(null, "", "/Chairs/?p=2#top");
    await click(button);
    expect(link("de-DE").getAttribute("href")).toBe("/de-DE/Chairs/?p=2#top");

    await click(button);
    window.history.pushState(null, "", "/account/order?p=3");
    await click(button);
    const polish = link("pl-PL");
    expect(polish.getAttribute("href")).toBe("/pl-PL/account/order?p=3");

    await click(polish);

    expect(invoke).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledExactlyOnceWith("/pl-PL/account/order?p=3");
  });

  it("follows the page the shopper is on when it changed while the list was open", async () => {
    const { button, link } = await setup({ languages: demoLanguages });
    await click(button);

    window.history.pushState(null, "", "/Chairs/");
    await click(link("de-DE"));

    expect(assign).toHaveBeenCalledExactlyOnceWith("/de-DE/Chairs/");
    expect(link("de-DE").getAttribute("href")).toBe("/de-DE/Chairs/");
  });

  it("reads the Shopware languages first when they are not known yet", async () => {
    const load = vi.fn<LoadLanguages>(async () => ({
      languages: shopLanguages,
      defaultLanguageId: "language-en",
    }));
    const { button, link } = await setup({ languages: [], load });
    await click(button);
    await click(link("de-DE"));
    await flush();

    expect(load).toHaveBeenCalledOnce();
    expect(assign).toHaveBeenCalledExactlyOnceWith(
      "/de-DE/Moebel/?order=price-asc#reviews",
    );
  });

  it("goes to the home page of the chosen locale when the Shopware languages cannot be read", async () => {
    const load = vi.fn<LoadLanguages>(async () => {
      throw new TypeError("Failed to fetch");
    });
    const { button, link } = await setup({ languages: [], load });
    await click(button);
    await flush();

    expect(link("de-DE").getAttribute("href")).toBe("/de-DE");

    await click(link("de-DE"));

    expect(invoke).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledExactlyOnceWith("/de-DE");
  });

  it("resets a chosen language when the page comes back from the back-forward cache", async () => {
    const { button, link, links } = await setup({ languages: demoLanguages });
    await click(button);
    await click(link("de-DE"));
    expect(button.getAttribute("aria-busy")).toBe("true");

    await interact(() => {
      window.dispatchEvent(
        Object.assign(new Event("pageshow"), { persisted: true }),
      );
    });

    expect(links()).toHaveLength(0);
    expect(button.hasAttribute("aria-busy")).toBe(false);
  });
});
