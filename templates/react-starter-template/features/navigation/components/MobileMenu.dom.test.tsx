import { afterEach, describe, expect, it } from "vitest";

import { buildNavigationTree } from "@/features/navigation/navigationTree";
import { withI18n } from "@/test/i18n";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import type { NavigationNode } from "../navigationTree";
import { MobileMenu } from "./MobileMenu";

const tree: NavigationNode[] = [
  {
    id: "clothing",
    name: "Clothing",
    href: "/Clothing/",
    newTab: false,
    children: [
      {
        id: "men",
        name: "Men",
        href: "/Clothing/Men/",
        newTab: false,
        children: [],
      },
    ],
  },
  {
    id: "food",
    name: "Food",
    href: "/Food/",
    newTab: false,
    children: [],
  },
];

const BURGER = 'button[aria-label="Open menu"]';
const DRAWER = '[data-testid="sidebar-left"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function openMenu() {
  mounted = await mount(<MobileMenu tree={tree} />);
  const { container } = mounted;
  const burger = query<HTMLButtonElement>(container, BURGER);
  await interact(() => burger.click());
  return { container, burger };
}

describe("MobileMenu in the browser", () => {
  it("labels the drawer in Polish and keeps the prefixed category links under the pl-PL provider", async () => {
    const polishTree = buildNavigationTree(
      [
        {
          id: "clothing",
          type: "page",
          name: "Odzież",
          translated: { name: "Odzież" },
          seoUrls: [{ seoPathInfo: "Clothing/" }],
          children: [
            {
              id: "men",
              type: "page",
              name: "Mężczyźni",
              translated: { name: "Mężczyźni" },
              seoUrls: [{ seoPathInfo: "Clothing/Men/" }],
              children: [],
            },
          ],
        },
      ] as unknown as Parameters<typeof buildNavigationTree>[0],
      "pl-PL",
    );
    mounted = await mount(withI18n(<MobileMenu tree={polishTree} />, "pl-PL"));
    const { container } = mounted;
    const burger = query<HTMLButtonElement>(
      container,
      'button[aria-label="Otwórz menu"]',
    );

    await interact(() => burger.click());

    const drawer = query<HTMLDialogElement>(container, DRAWER);
    expect(drawer.getAttribute("aria-label")).toBe("Panel boczny");
    expect(
      query<HTMLButtonElement>(drawer, 'button:not([tabindex="-1"])')
        .textContent,
    ).toBe("Zamknij menu");
    expect(query<HTMLAnchorElement>(drawer, "a").getAttribute("href")).toMatch(
      /^\/pl-PL\/Clothing\/?$/,
    );
    const toggle = query<HTMLButtonElement>(
      drawer,
      'button[aria-label="Pokaż podkategorie"]',
    );

    await interact(() => toggle.click());

    expect(toggle.getAttribute("aria-label")).toBe("Ukryj podkategorie");
  });

  it("opens a modal drawer, locks the page scroll and focuses the close button", async () => {
    const { container, burger } = await openMenu();

    const drawer = query<HTMLDialogElement>(container, DRAWER);
    expect(drawer.open).toBe(true);
    expect(drawer.getAttribute("aria-label")).toBe("Sidebar");
    expect(query(drawer, "nav").getAttribute("aria-label")).toBe(
      "Main navigation",
    );
    expect(drawer.id).toBe(burger.getAttribute("aria-controls"));
    expect(burger.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(drawer.textContent).toContain("Clothing");
    expect(drawer.textContent).toContain("Food");
    expect(drawer.textContent).not.toContain("Men");

    const close = query<HTMLButtonElement>(
      drawer,
      'button:not([tabindex="-1"])',
    );
    expect(close.textContent).toBe("Close menu");
    expect(document.activeElement).toBe(close);
  });

  it("puts the close button on an ink strip above white rows with sand subcategories", async () => {
    const { container } = await openMenu();
    const drawer = query<HTMLDialogElement>(container, DRAWER);
    const close = query<HTMLButtonElement>(
      drawer,
      'button:not([tabindex="-1"])',
    );

    expect(close.parentElement?.className).toContain("bg-shell-ink");
    expect(close.className).toContain("focus-visible:outline-shell-accent");
    expect(query<HTMLImageElement>(drawer, "img").getAttribute("alt")).toBe("");
    const rows = queryAll<HTMLLIElement>(drawer, "nav > ul > li");
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.className).toContain("border-b border-shell-line");
    }

    const toggle = query<HTMLButtonElement>(
      drawer,
      'button[aria-label="Show subcategories"]',
    );
    await interact(() => toggle.click());

    const sublist = document.getElementById(
      toggle.getAttribute("aria-controls") ?? "",
    );
    expect(sublist?.className).toContain("bg-shell-sand");
  });

  it("expands and collapses a subcategory list from its toggle", async () => {
    const { container } = await openMenu();
    const toggle = query<HTMLButtonElement>(
      container,
      'button[aria-label="Show subcategories"]',
    );
    const sublistId = toggle.getAttribute("aria-controls") ?? "";
    expect(sublistId).not.toBe("");
    expect(document.getElementById(sublistId)).toBeNull();

    await interact(() => toggle.click());

    const sublist = document.getElementById(sublistId);
    expect(sublist?.tagName).toBe("UL");
    expect(sublist?.textContent).toContain("Men");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Hide subcategories");

    await interact(() => toggle.click());

    expect(document.getElementById(sublistId)).toBeNull();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape, restores the scroll and returns focus to the burger", async () => {
    const { container, burger } = await openMenu();
    const cancel = new Event("cancel", { cancelable: true });

    await interact(() => query(container, DRAWER).dispatchEvent(cancel));

    expect(cancel.defaultPrevented).toBe(true);
    expect(container.querySelector(DRAWER)).toBeNull();
    expect(burger.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(burger);
  });

  it("closes from the backdrop but not from a click inside the panel", async () => {
    const { container, burger } = await openMenu();
    const drawer = query<HTMLDialogElement>(container, DRAWER);

    await interact(() => query<HTMLElement>(drawer, "nav").click());
    expect(container.querySelector(DRAWER)).not.toBeNull();

    await interact(() =>
      query<HTMLButtonElement>(
        drawer,
        'button[aria-label="Close menu"][tabindex="-1"]',
      ).click(),
    );

    expect(container.querySelector(DRAWER)).toBeNull();
    expect(document.activeElement).toBe(burger);
  });

  it("closes after a link is followed", async () => {
    const { container, burger } = await openMenu();
    const link = [...container.querySelectorAll("a")].find(
      (anchor) => anchor.textContent === "Food",
    );
    if (!link) throw new Error("No Food link");
    link.addEventListener("click", (event) => event.preventDefault());

    await interact(() => link.click());

    expect(container.querySelector(DRAWER)).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(burger);
  });

  it("restores the scroll lock when unmounted while open", async () => {
    await openMenu();
    expect(document.body.style.overflow).toBe("hidden");

    await mounted?.unmount();
    mounted = undefined;

    expect(document.body.style.overflow).toBe("");
  });
});
