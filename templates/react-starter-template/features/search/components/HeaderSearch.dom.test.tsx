import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NOT_WIRED_MESSAGES } from "@/features/storefront/notWired";
import { interact, mount, pressKey, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { HeaderSearch } from "./HeaderSearch";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup(autoFocus?: boolean) {
  const notify = vi.fn();
  mounted = await mount(
    <CmsActionsProvider actions={{ notify }}>
      <HeaderSearch autoFocus={autoFocus} />
    </CmsActionsProvider>,
  );
  return {
    notify,
    input: query<HTMLInputElement>(
      mounted.container,
      '[data-testid="header-search-input"]',
    ),
  };
}

describe("HeaderSearch in the browser", () => {
  it("reports the mocked search on Enter", async () => {
    const { notify, input } = await setup();
    input.value = "shirt";

    await interact(() => pressKey(input, "Enter"));

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "info",
      message: NOT_WIRED_MESSAGES.search,
    });
  });

  it("ignores Enter on a blank query and other keys", async () => {
    const { notify, input } = await setup();

    await interact(() => pressKey(input, "Enter"));
    input.value = "   ";
    await interact(() => pressKey(input, "Enter"));
    input.value = "shirt";
    await interact(() => pressKey(input, "a"));

    expect(notify).not.toHaveBeenCalled();
  });

  it("takes focus on mount when asked to", async () => {
    const { input } = await setup(true);

    expect(document.activeElement).toBe(input);
  });

  it("leaves focus alone by default", async () => {
    const { input } = await setup();

    expect(document.activeElement).not.toBe(input);
  });
});
