import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { interact, mount } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { useSearchPageTerm } from "./useSearchPageTerm";

const navigation = new EventTarget();

function Term() {
  return <output>{useSearchPageTerm()}</output>;
}

function navigate(url: string) {
  return interact(() => {
    window.history.pushState(null, "", url);
    navigation.dispatchEvent(new Event("currententrychange"));
  });
}

let mounted: Mounted | undefined;

beforeEach(() => {
  Object.defineProperty(window, "navigation", {
    value: navigation,
    configurable: true,
  });
});

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  Reflect.deleteProperty(window, "navigation");
  window.history.replaceState(null, "", "/");
});

describe("useSearchPageTerm", () => {
  it("follows soft navigation onto, within and away from the search page", async () => {
    mounted = await mount(<Term />);
    const text = () => mounted?.container.textContent;
    expect(text()).toBe("");

    await navigate("/search?search=shirt");
    expect(text()).toBe("shirt");

    await navigate("/search?search=linen%20shirt");
    expect(text()).toBe("linen shirt");

    await navigate("/product-a");
    expect(text()).toBe("");
  });

  it("re-reads the term on a history move without the Navigation API", async () => {
    Reflect.deleteProperty(window, "navigation");
    window.history.replaceState(null, "", "/search?search=shirt");
    mounted = await mount(<Term />);
    await interact(() => {
      window.history.replaceState(null, "", "/search?search=shoes");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(mounted.container.textContent).toBe("shoes");
  });
});
