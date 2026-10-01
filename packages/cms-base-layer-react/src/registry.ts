import { createElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { pascalCase } from "scule";

import type { Schemas } from "#shopware";

import type { CmsContext } from "./context";

export type CmsSectionContent = Schemas["CmsSection"];
export type CmsBlockContent = Schemas["CmsBlock"];
export type CmsSlotContent = Schemas["CmsSlot"];
export type CmsContent = CmsSectionContent | CmsBlockContent | CmsSlotContent;

export type CmsKind = "section" | "block" | "element";

export type CmsComponentProps<CONTENT> = {
  content: CONTENT;
  ctx: CmsContext;
  className?: string;
  style?: CSSProperties;
};

export type CmsComponent<CONTENT> = (
  props: CmsComponentProps<CONTENT>,
) => ReactNode | Promise<ReactNode>;

export type CmsRegistry = {
  sections: Record<string, CmsComponent<never>>;
  blocks: Record<string, CmsComponent<never>>;
  elements: Record<string, CmsComponent<never>>;
};

export type CmsRegistryInput = Partial<CmsRegistry>;

export function createCmsRegistry(input: CmsRegistryInput = {}): CmsRegistry {
  return {
    sections: { ...input.sections },
    blocks: { ...input.blocks },
    elements: { ...input.elements },
  };
}

export function mergeCmsRegistries(
  base: CmsRegistryInput,
  ...overrides: CmsRegistryInput[]
): CmsRegistry {
  return overrides.reduce<CmsRegistry>(
    (merged, override) => ({
      sections: { ...merged.sections, ...override.sections },
      blocks: { ...merged.blocks, ...override.blocks },
      elements: { ...merged.elements, ...override.elements },
    }),
    createCmsRegistry(base),
  );
}

export function getCmsKind(content: CmsContent): CmsKind {
  if (content.apiAlias === "cms_section") return "section";
  if (content.apiAlias === "cms_block") return "block";
  return "element";
}

const KIND_LABELS: Record<CmsKind, string> = {
  section: "Section",
  block: "Block",
  element: "Element",
};

export function getCmsComponentName(content: CmsContent): string {
  return pascalCase(
    `Cms-${KIND_LABELS[getCmsKind(content)]}-${content.type ?? ""}`,
  );
}

export function getCmsRegistryKey(content: CmsContent): keyof CmsRegistry {
  const kind = getCmsKind(content);
  if (kind === "section") return "sections";
  if (kind === "block") return "blocks";
  return "elements";
}

export function resolveCmsComponent<CONTENT extends CmsContent>(
  registry: CmsRegistry,
  content: CONTENT,
): CmsComponent<CONTENT> | undefined {
  const component = content.type
    ? registry[getCmsRegistryKey(content)][content.type]
    : undefined;
  return component as CmsComponent<CONTENT> | undefined;
}

export function createCmsElement<CONTENT extends CmsContent>(
  registry: CmsRegistry,
  props: CmsComponentProps<CONTENT> & { key?: string },
): ReactElement | null {
  const component = resolveCmsComponent(registry, props.content);
  if (!component) return null;
  return createElement(component, props);
}
