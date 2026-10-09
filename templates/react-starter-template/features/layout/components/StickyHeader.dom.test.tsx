import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { STICKY_HEADER_HEIGHT_PROPERTY, StickyHeader } from "./StickyHeader";

type FakeObserver = {
  callback: ResizeObserverCallback;
  observed: Element[];
  disconnected: boolean;
};

const observers: FakeObserver[] = [];

class FakeResizeObserver {
  private readonly state: FakeObserver;

  constructor(callback: ResizeObserverCallback) {
    this.state = { callback, observed: [], disconnected: false };
    observers.push(this.state);
  }

  observe(target: Element) {
    this.state.observed.push(target);
  }

  unobserve() {}

  disconnect() {
    this.state.disconnected = true;
  }
}

function rootHeight() {
  return document.documentElement.style.getPropertyValue(
    STICKY_HEADER_HEIGHT_PROPERTY,
  );
}

let mounted: Mounted | undefined;

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.documentElement.style.removeProperty(STICKY_HEADER_HEIGHT_PROPERTY);
});

async function setup() {
  mounted = await mount(
    <StickyHeader className="lg:sticky lg:top-0">
      <p>Inside</p>
    </StickyHeader>,
  );
  return query<HTMLElement>(mounted.container, "header");
}

describe("StickyHeader", () => {
  it("renders a marked header landmark around its children", async () => {
    const header = await setup();

    expect(header.className).toBe("lg:sticky lg:top-0");
    expect(header.hasAttribute("data-sticky-header")).toBe(true);
    expect(header.textContent).toBe("Inside");
  });

  it("publishes the measured header height on the root element on every resize", async () => {
    const header = await setup();
    const rect = vi.spyOn(header, "getBoundingClientRect");
    const [observer] = observers;

    expect(observers).toHaveLength(1);
    expect(observer?.observed).toEqual([header]);

    rect.mockReturnValue({ height: 181 } as DOMRect);
    await interact(() =>
      observer?.callback([], observer as unknown as ResizeObserver),
    );
    expect(rootHeight()).toBe("181px");

    rect.mockReturnValue({ height: 229.5 } as DOMRect);
    await interact(() =>
      observer?.callback([], observer as unknown as ResizeObserver),
    );
    expect(rootHeight()).toBe("229.5px");
  });

  it("stops observing and clears the height once the header unmounts", async () => {
    const header = await setup();
    vi.spyOn(header, "getBoundingClientRect").mockReturnValue({
      height: 181,
    } as DOMRect);
    const [observer] = observers;
    await interact(() =>
      observer?.callback([], observer as unknown as ResizeObserver),
    );

    await mounted?.unmount();
    mounted = undefined;

    expect(observer?.disconnected).toBe(true);
    expect(rootHeight()).toBe("");
  });

  it("leaves the root element alone without ResizeObserver support", async () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const header = await setup();

    expect(header.hasAttribute("data-sticky-header")).toBe(true);
    expect(observers).toHaveLength(0);
    expect(rootHeight()).toBe("");
  });
});
