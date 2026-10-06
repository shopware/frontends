import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { LoginData } from "@/features/account/profile/components/LoginData";
import { PersonalDataForm } from "@/features/account/profile/components/PersonalDataForm";
import { PersonalDataFormSkeleton } from "@/features/account/profile/components/PersonalDataFormSkeleton";
import { loadProfileReferences } from "@/features/account/profile/profileReferences";

export const instant = false;

const t = {
  account: {
    profile: {
      header: "Your profile",
      subHeader: "Check your personal data.",
      personalDataSectionHeader: "Personal data",
      loginDataSectionHeader: "Login data",
    },
  },
};

export const metadata: Metadata = {
  title: t.account.profile.header,
};

async function PersonalDataSection() {
  await connection();
  const references = await loadProfileReferences();
  return <PersonalDataForm {...references} />;
}

export default function ProfilePage() {
  const copy = t.account.profile;
  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={copy.header}
        subtitle={copy.subHeader}
      />
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={copy.personalDataSectionHeader}
        />
        <Suspense fallback={<PersonalDataFormSkeleton />}>
          <PersonalDataSection />
        </Suspense>
      </div>
      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={copy.loginDataSectionHeader}
        />
        <LoginData />
      </div>
    </div>
  );
}
