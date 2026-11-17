import { describe, expect, it } from "vitest";

import { textBlock, textSlot, defaultSection } from "./__fixtures__/cmsPage";
import {
  createCmsRegistry,
  getCmsComponentName,
  getCmsKind,
  mergeCmsRegistries,
  resolveCmsComponent,
} from "./registry";

const Base = () => null;
const Override = () => null;

describe("getCmsComponentName", () => {
  it("follows the Vue naming rule for every kind", () => {
    expect(getCmsComponentName(defaultSection)).toBe("CmsSectionDefault");
    expect(getCmsComponentName(textBlock)).toBe("CmsBlockText");
    expect(getCmsComponentName(textSlot)).toBe("CmsElementText");
    expect(
      getCmsComponentName({ ...textBlock, type: "image-text-bubble" }),
    ).toBe("CmsBlockImageTextBubble");
  });

  it("derives the kind from the apiAlias", () => {
    expect(getCmsKind(defaultSection)).toBe("section");
    expect(getCmsKind(textBlock)).toBe("block");
    expect(getCmsKind(textSlot)).toBe("element");
  });
});

describe("mergeCmsRegistries", () => {
  it("lets later registries override earlier entries without touching others", () => {
    const base = createCmsRegistry({
      blocks: { text: Base, image: Base },
      elements: { text: Base },
    });
    const merged = mergeCmsRegistries(base, { blocks: { text: Override } });

    expect(merged.blocks.text).toBe(Override);
    expect(merged.blocks.image).toBe(Base);
    expect(merged.elements.text).toBe(Base);
    expect(base.blocks.text).toBe(Base);
  });
});

describe("resolveCmsComponent", () => {
  it("looks the component up by kind and type", () => {
    const registry = createCmsRegistry({
      sections: { default: Base },
      blocks: { text: Override },
      elements: { text: Base },
    });

    expect(resolveCmsComponent(registry, defaultSection)).toBe(Base);
    expect(resolveCmsComponent(registry, textBlock)).toBe(Override);
    expect(resolveCmsComponent(registry, textSlot)).toBe(Base);
    expect(
      resolveCmsComponent(registry, { ...textBlock, type: "missing" }),
    ).toBeUndefined();
  });
});
