import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

import type { CmsVariantResult } from "../../actions/CmsActionsContext";
import { prefixUrl } from "../../helpers/resolveUrl";

export type SwVariantOption = {
  id: string;
  name: string;
};

export type SwVariantOptionGroup = {
  id: string;
  name: string;
  options: SwVariantOption[];
};

export function getVariantOptionGroups(
  groups: Schemas["PropertyGroup"][] | null | undefined,
): SwVariantOptionGroup[] {
  return (groups ?? []).map((group) => ({
    id: group.id,
    name: getTranslatedProperty(group, "name"),
    options: (group.options ?? []).map((option) => ({
      id: option.id,
      name: getTranslatedProperty(option, "name"),
    })),
  }));
}

export function getInitialVariantSelection(
  optionGroups: SwVariantOptionGroup[],
  optionIds: string[],
): Record<string, string> {
  const selected: Record<string, string> = {};
  for (const optionId of optionIds) {
    const group = optionGroups.find((optionGroup) =>
      optionGroup.options.some((option) => option.id === optionId),
    );
    if (group) {
      selected[group.id] = optionId;
    }
  }
  return selected;
}

export function orderVariantSelection(
  optionGroups: SwVariantOptionGroup[],
  selected: Record<string, string>,
): Record<string, string> {
  const ordered: Record<string, string> = {};
  for (const group of optionGroups) {
    const optionId = Object.hasOwn(selected, group.id)
      ? selected[group.id]
      : undefined;
    if (optionId) {
      ordered[group.id] = optionId;
    }
  }
  return ordered;
}

function isSafeInternalPath(url: string): boolean {
  if (!url.startsWith("/") || url.startsWith("//")) return false;
  for (let index = 0; index < url.length; index += 1) {
    const code = url.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f || code === 0x5c) return false;
  }
  return true;
}

export function getVariantHref(
  variant: CmsVariantResult,
  urlPrefix: string,
): string {
  const path =
    variant.url && isSafeInternalPath(variant.url)
      ? variant.url
      : `/detail/${encodeURIComponent(variant.productId)}`;
  return prefixUrl(path, urlPrefix);
}
