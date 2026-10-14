import {
  renderRichText,
  richTextClassName,
} from "@shopware/cms-base-layer-react";

import { LoggedInRedirect } from "@/features/account/components/LoggedInRedirect";
import { RegistrationForm } from "@/features/account/components/RegistrationForm";
import { loadRegistrationReferences } from "@/features/account/registrationReferences";
import { localePrefix } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { notFoundOn404 } from "@/platform/shopware/errors";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import { readCustomerGroupRegistration } from "@/platform/shopware/reads/customerGroupRegistration";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";

export type CustomerGroupRegistrationPageProps = {
  customerGroupId: string;
  locale: Locale;
  languageId: string | null;
};

export async function CustomerGroupRegistrationPage({
  customerGroupId,
  locale,
  languageId,
}: CustomerGroupRegistrationPageProps) {
  const [group, countryOptions, references, { contentLang }] =
    await Promise.all([
      readCustomerGroupRegistration(customerGroupId, languageId).catch(
        notFoundOn404,
      ),
      loadCountryOptions(locale, "CustomerGroupRegistration"),
      loadRegistrationReferences(locale),
      resolveContentLanguage(locale),
    ]);

  return (
    <div className="mx-auto my-10 w-full max-w-screen-2xl px-4 md:my-20">
      <LoggedInRedirect fallback="/account" />
      <h1
        lang={contentLang}
        className="mb-6 text-center text-2xl leading-none font-extrabold tracking-tight text-surface-on-surface md:text-3xl lg:text-5xl"
      >
        {group.title}
      </h1>
      {group.introduction ? (
        <div
          lang={contentLang}
          data-testid="customer-group-registration-introduction"
          className={richTextClassName(
            "mb-10 text-lg text-surface-on-surface-variant lg:text-xl",
          )}
        >
          {renderRichText(group.introduction, {
            urlPrefix: localePrefix(locale),
          })}
        </div>
      ) : null}
      <RegistrationForm
        {...countryOptions}
        {...references}
        companyOnly={group.companyOnly}
        requestedGroupId={group.id}
      />
    </div>
  );
}
