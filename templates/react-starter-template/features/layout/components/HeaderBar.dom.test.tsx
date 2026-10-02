import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { HeaderBar } from "./HeaderBar";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup() {
  mounted = await mount(
    <CmsActionsProvider actions={{ notify: vi.fn() }}>
      <HeaderBar menu={null} />
    </CmsActionsProvider>,
  );
  return mounted.container;
}

describe("HeaderBar in the browser", () => {
  it("focuses the search input when the mobile search opens", async () => {
    const container = await setup();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Search"]',
      ).click(),
    );

    const input = query<HTMLInputElement>(
      container,
      '[data-testid="header-search-input"]',
    );
    expect(document.activeElement).toBe(input);
    expect(container.querySelector('button[aria-label="Search"]')).toBeNull();
  });

  it("returns focus to the search button when the mobile search closes", async () => {
    const container = await setup();

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        'button[aria-label="Search"]',
      ).click(),
    );
    const close = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Close",
    );
    expect(close).toBeDefined();

    await interact(() => close?.click());

    const search = query<HTMLButtonElement>(
      container,
      'button[aria-label="Search"]',
    );
    expect(document.activeElement).toBe(search);
    expect(
      [...container.querySelectorAll("button")].some(
        (button) => button.textContent === "Close",
      ),
    ).toBe(false);
  });
});
