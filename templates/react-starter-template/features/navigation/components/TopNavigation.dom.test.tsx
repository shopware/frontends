import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount, pressKey, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import type { NavigationNode } from "../navigationTree";
import { TopNavigation } from "./TopNavigation";

const route = vi.hoisted(() => ({ pathname: "/Clothing" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

function node(overrides: Partial<NavigationNode>): NavigationNode {
  return {
    id: "node",
    name: "Node",
    href: "/node/",
    external: false,
    children: [],
    ...overrides,
  };
}

const tree: NavigationNode[] = [
  node({
    id: "clothing",
    name: "Clothing",
    href: "/Clothing/",
    children: [
      node({
        id: "men",
        name: "Men",
        href: "/Clothing/Men/",
        children: [node({ id: "shirts", name: "Shirts" })],
      }),
    ],
  }),
  node({ id: "food", name: "Food", href: "/Food/" }),
];

function Harness() {
  const [, setTick] = useState(0);
  return (
    <>
      <button
        type="button"
        data-testid="rerender"
        aria-label="Rerender"
        onClick={() => setTick((tick) => tick + 1)}
      />
      <TopNavigation tree={tree} />
    </>
  );
}

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  route.pathname = "/Clothing";
});

function menuitems(container: ParentNode): HTMLAnchorElement[] {
  return queryAll<HTMLAnchorElement>(container, 'a[role="menuitem"]');
}

function labels(container: ParentNode): string[] {
  return menuitems(container).map((item) => item.textContent ?? "");
}

function trigger(container: ParentNode, name: string): HTMLAnchorElement {
  const item = menuitems(container).find((it) => it.textContent === name);
  if (!item) throw new Error(`No menuitem "${name}"`);
  return item;
}

async function setup() {
  mounted = await mount(<Harness />);
  return mounted.container;
}

describe("TopNavigation in the browser", () => {
  it("opens the flyout on focus and places its links right after the trigger", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");
    expect(labels(container)).toEqual(["Clothing", "Food"]);

    await interact(() => clothing.focus());

    expect(clothing.getAttribute("aria-expanded")).toBe("true");
    expect(labels(container)).toEqual(["Clothing", "Men", "Shirts", "Food"]);
    const flyout = query(container, 'a[role="menuitem"] + div');
    expect(flyout.textContent).toContain("Men");
  });

  it("switches to the focused trigger and renders no flyout for a leaf node", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");
    const food = trigger(container, "Food");

    await interact(() => clothing.focus());
    await interact(() => food.focus());

    expect(clothing.getAttribute("aria-expanded")).toBe("false");
    expect(food.hasAttribute("aria-expanded")).toBe(false);
    expect(labels(container)).toEqual(["Clothing", "Food"]);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");

    await interact(() => clothing.focus());
    await interact(() => trigger(container, "Men").focus());
    expect(document.activeElement?.textContent).toBe("Men");

    await interact(() => pressKey(document, "Escape"));

    expect(clothing.getAttribute("aria-expanded")).toBe("false");
    expect(labels(container)).toEqual(["Clothing", "Food"]);
    expect(document.activeElement).toBe(clothing);
  });

  it("closes when focus leaves the navigation", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");
    const outside = document.createElement("button");
    document.body.append(outside);

    await interact(() => clothing.focus());
    await interact(() => outside.focus());

    expect(clothing.getAttribute("aria-expanded")).toBe("false");
    expect(labels(container)).toEqual(["Clothing", "Food"]);
    outside.remove();
  });

  it("closes when focus is lost to the document without a hovered pointer", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");

    await interact(() => clothing.focus());
    await interact(() => clothing.blur());

    expect(clothing.getAttribute("aria-expanded")).toBe("false");
    expect(labels(container)).toEqual(["Clothing", "Food"]);
  });

  it("reads as closed after a route change", async () => {
    const container = await setup();
    const clothing = trigger(container, "Clothing");

    await interact(() => clothing.focus());
    expect(clothing.getAttribute("aria-expanded")).toBe("true");

    route.pathname = "/Food";
    await interact(() =>
      query<HTMLButtonElement>(container, '[data-testid="rerender"]').click(),
    );

    expect(clothing.getAttribute("aria-expanded")).toBe("false");
    expect(labels(container)).toEqual(["Clothing", "Food"]);
    expect(trigger(container, "Food").getAttribute("aria-current")).toBe(
      "page",
    );
  });
});
