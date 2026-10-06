import "server-only";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

export type ProfileReferences = {
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
};

export async function loadProfileReferences(): Promise<ProfileReferences> {
  try {
    return {
      salutations: await readSalutations(),
      salutationsUnavailable: false,
    };
  } catch (error) {
    console.error("[Profile] reading salutations failed", error);
    return { salutations: [], salutationsUnavailable: true };
  }
}
