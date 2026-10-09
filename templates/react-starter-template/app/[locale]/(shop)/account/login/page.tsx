import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { LoggedInRedirect } from "@/features/account/components/LoggedInRedirect";
import { LoginForm } from "@/features/account/components/LoginForm";
import { RegistrationForm } from "@/features/account/components/RegistrationForm";
import { RegistrationFormSkeleton } from "@/features/account/components/RegistrationFormSkeleton";
import { getTranslator, localeFromParams } from "@/i18n/server";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const t = getTranslator(await localeFromParams(params));
  return { title: t("account.loginPageTitle") };
}

async function RegistrationSection({ params }: LoginPageProps) {
  await connection();
  const { countries, countriesUnavailable } = await loadCountryOptions(
    await localeFromParams(params),
    "Registration",
  );

  return (
    <RegistrationForm
      countries={countries}
      countriesUnavailable={countriesUnavailable}
    />
  );
}

export default function LoginPage({ params }: LoginPageProps) {
  return (
    <div className="mx-auto my-10 w-full max-w-screen-2xl px-4 md:my-20">
      <LoggedInRedirect />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">
        <div className="flex w-full flex-col justify-start lg:w-1/2 lg:border-r lg:border-outline-outline-variant lg:pr-16">
          <LoginForm hideSignUp />
        </div>
        <div
          id="registration"
          className="w-full border-t border-outline-outline-variant pt-10 lg:w-1/2 lg:border-t-0 lg:pt-0 lg:pl-16"
        >
          <Suspense fallback={<RegistrationFormSkeleton />}>
            <RegistrationSection params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
