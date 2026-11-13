import type { Schemas } from "#shopware";

import type { ElementConfig } from "../types";

type ArrayElement<ARRAY extends readonly unknown[]> =
  ARRAY extends readonly (infer ELEMENT)[] ? ELEMENT : never;

export function getSlotContent<BLOCK extends Schemas["CmsBlock"]>(
  block: BLOCK,
  slotName: ArrayElement<BLOCK["slots"]>["slot"],
): ArrayElement<BLOCK["slots"]> | undefined {
  return block.slots.find((slot) => slot.slot === slotName) as
    | ArrayElement<BLOCK["slots"]>
    | undefined;
}

export function getPositionContent<SECTION extends Schemas["CmsSection"]>(
  section: SECTION,
  position: ArrayElement<SECTION["blocks"]>["sectionPosition"],
): Array<Schemas["CmsBlock"]> {
  return section.blocks.filter((block) => block.sectionPosition === position);
}

export function getConfigValue<
  ELEMENT extends Omit<Schemas["CmsSlot"], "config"> & {
    config: Record<string, ElementConfig<unknown> | undefined>;
  },
  KEY extends keyof ELEMENT["config"],
>(
  element: ELEMENT,
  key: KEY,
): NonNullable<ELEMENT["config"][KEY]>["value"] | undefined {
  const config = element?.config as
    | Record<string, ElementConfig<unknown> | undefined>
    | undefined;
  const entry = config?.[key as string];
  if (!entry || entry.source === "mapped") return undefined;
  return entry.value as NonNullable<ELEMENT["config"][KEY]>["value"];
}
