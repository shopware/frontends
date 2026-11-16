import { describe, expect, it } from "vitest";

import { getCmsComponentName } from "./registry";
import type { CmsContent } from "./registry";
import { defaultCmsRegistry } from "./registry.default";

const KINDS = [
  ["sections", "cms_section"],
  ["blocks", "cms_block"],
  ["elements", "cms_slot"],
] as const;

describe("defaultCmsRegistry", () => {
  it.each(
    KINDS.flatMap(([kind, apiAlias]) =>
      Object.entries(defaultCmsRegistry[kind]).map(
        ([type, component]) => [kind, type, apiAlias, component] as const,
      ),
    ),
  )(
    "%s[%j] is the component named after its type",
    (_kind, type, apiAlias, component) => {
      expect(component.name).toBe(
        getCmsComponentName({ apiAlias, type } as CmsContent),
      );
    },
  );
});
