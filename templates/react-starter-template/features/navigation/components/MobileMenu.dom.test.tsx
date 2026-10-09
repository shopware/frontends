import { afterEach, describe, expect, it } from "vitest";

import { interact, mount, pressKey, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import type { NavigationNode } from "../navigationTree";
import { MobileMenu } from "./MobileMenu";

const tree: NavigationNode[] = [
  {
    id: "clothing",
    name: "Clothing",
    href: "/Clothing/",
    external: false,
    children: [
      {
        id: "men",
        name: "Men",
        href: "/Clothing/Men/",
        external: false,
        children: [],
      },
    ],
  },
  {
    id: "food",
    name: "Food",
    href: "/Food/",
    external: false,
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
  it("opens a modal drawer, locks the page scroll and focuses the close button", async () => {
    const { container, burger } = await openMenu();

    const drawer = query<HTMLDialogElement>(container, DRAWER);
    expect(drawer.getAttribute("aria-modal")).toBe("true");
    expect(drawer.getAttribute("aria-label")).toBe("Sidebar");
    expect(drawer.id).toBe(burger.getAttribute("aria-controls"));
    expect(burger.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(drawer.textContent).toContain("Clothing");
    expect(drawer.textContent).toContain("Food");
    expect(drawer.textContent).not.toContain("Men");

    const close = query<HTMLButtonElement>(drawer, "button");
    expect(close.textContent).toBe("Close menu");
    expect(document.activeElement).toBe(close);
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

    await interact(() => pressKey(document, "Escape"));

    expect(container.querySelector(DRAWER)).toBeNull();
    expect(burger.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(burger);
  });

  it("closes from the backdrop", async () => {
    const { container, burger } = await openMenu();
    const backdrop = query<HTMLButtonElement>(
      container,
      'button[aria-label="Close menu"][tabindex="-1"]',
    );

    await interact(() => backdrop.click());

    expect(container.querySelector(DRAWER)).toBeNull();
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
