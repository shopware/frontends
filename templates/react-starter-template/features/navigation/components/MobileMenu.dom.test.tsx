import { afterEach, describe, expect, it } from "vitest";

import { interact, mount, query } from "@/test/mount";
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
