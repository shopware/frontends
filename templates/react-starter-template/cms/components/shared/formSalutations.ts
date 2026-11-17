import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type SwFormSalutation = {
  id: string;
  displayName: string;
};

export function toFormSalutations(data: unknown): SwFormSalutation[] {
  if (!Array.isArray(data)) return [];
  return (data as Schemas["Salutation"][])
    .filter((salutation) => typeof salutation?.id === "string")
    .map((salutation) => ({
      id: salutation.id,
      displayName: getTranslatedProperty(salutation, "displayName"),
    }));
}
