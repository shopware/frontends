import type { Metadata } from "next";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { BackToProfileLink } from "@/features/account/profile/components/BackToProfileLink";
import { ChangePasswordForm } from "@/features/account/profile/components/ChangePasswordForm";

export const instant = false;

const t = {
  account: {
    changePassword: {
      header: "Change password",
      subHeader: "Enter new password",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.changePassword.header,
};

export default function ChangePasswordPage() {
  const copy = t.account.changePassword;
  return (
    <div className="mb-10">
      <BackToProfileLink />
      <AccountPageHeader className="mb-14" title={copy.header} />
      <AccountSectionHeader className="mb-8" title={copy.subHeader} />
      <ChangePasswordForm />
    </div>
  );
}
