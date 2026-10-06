import type { Metadata } from "next";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { BackToProfileLink } from "@/features/account/profile/components/BackToProfileLink";
import { ChangeEmailForm } from "@/features/account/profile/components/ChangeEmailForm";

export const instant = false;

const t = {
  account: {
    changeEmail: {
      header: "Change Email Address",
      subHeader: "Enter new Email Address",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.changeEmail.header,
};

export default function ChangeEmailPage() {
  const copy = t.account.changeEmail;
  return (
    <div className="mb-10">
      <BackToProfileLink />
      <AccountPageHeader className="mb-14" title={copy.header} />
      <AccountSectionHeader className="mb-8" title={copy.subHeader} />
      <ChangeEmailForm />
    </div>
  );
}
