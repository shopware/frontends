import type { CmsBlockAppRenderer } from "@shopware/composables";
import { pascalCase } from "scule";

type AppRendererSlot = CmsBlockAppRenderer["slots"][number];

export type AppRendererLayout = {
  appBlockName: string;
  componentName?: string;
  grid?: string;
  slots: AppRendererSlot[];
};

const SLOT_INDEX = /-(\d+)$/;

function getSlotIndex(slot: AppRendererSlot): number {
  const match = SLOT_INDEX.exec(slot.slot ?? "");

  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export function getAppRendererLayout(
  block: CmsBlockAppRenderer,
): AppRendererLayout {
  const appBlockName = block.customFields?.appBlockName ?? "";

  return {
    appBlockName,
    componentName: appBlockName
      ? pascalCase(`CmsBlockAppRenderer-${appBlockName}`)
      : undefined,
    grid: block.customFields?.slotLayout?.grid || undefined,
    // The Store API returns slots unsorted, their `-{index}` suffix keeps the declared order
    slots: [...(block.slots ?? [])].sort(
      (a, b) => getSlotIndex(a) - getSlotIndex(b),
    ),
  };
}
