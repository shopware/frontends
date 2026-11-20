import "server-only";
import { getTranslatedProperty } from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export type CustomerGroupRegistration = {
  id: string;
  title: string;
  introduction: string | null;
  companyOnly: boolean;
  metaDescription: string | null;
};

export function toCustomerGroupRegistration(
  group: Schemas["CustomerGroup"],
): CustomerGroupRegistration {
  return {
    id: group.id,
    title:
      getTranslatedProperty(group, "registrationTitle") ||
      getTranslatedProperty(group, "name"),
    introduction:
      getTranslatedProperty(group, "registrationIntroduction") || null,
    companyOnly:
      group.translated?.registrationOnlyCompanyRegistration ??
      group.registrationOnlyCompanyRegistration ??
      false,
    metaDescription:
      getTranslatedProperty(group, "registrationSeoMetaDescription") || null,
  };
}

export async function readCustomerGroupRegistration(
  customerGroupId: string,
  languageId: string | null,
): Promise<CustomerGroupRegistration> {
  "use cache";
  cacheLife("seo");
  cacheTag(
    ...languageCacheTags(`sw:customer-group:${customerGroupId}`, languageId),
  );

  const { data } = await createShopwareClient({ languageId }).invoke(
    "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}",
    { pathParams: { customerGroupId } },
  );

  return toCustomerGroupRegistration(data);
}
