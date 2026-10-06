"use client";

import Link from "next/link";

import { useCustomer } from "@/features/account/customer/useCustomer";

import { EnvelopeIcon, KeyIcon } from "./ProfileIcons";

const t = {
  account: {
    profile: {
      changeEmailButton: "Change email address",
      changePasswordButton: "Change password",
    },
  },
};

const LINK_CLASS =
  "inline-flex h-6 w-fit items-center gap-1 border-b border-brand-primary leading-none text-brand-primary transition-all duration-200 hover:border-transparent";

export function LoginData() {
  const { customer } = useCustomer();

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="grow" data-testid="account-login-data-email">
        {customer?.email ?? ""}
      </div>
      <Link href="/account/profile/change-email" className={LINK_CLASS}>
        <EnvelopeIcon className="size-4" />
        {t.account.profile.changeEmailButton}
      </Link>
      <Link href="/account/profile/change-password" className={LINK_CLASS}>
        <KeyIcon className="size-4" />
        {t.account.profile.changePasswordButton}
      </Link>
    </div>
  );
}
