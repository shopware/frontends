"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { useState } from "react";

import { AddressDataSection } from "@/features/account/address/components/AddressDataSection";
import { useCustomer } from "@/features/account/customer/useCustomer";
import { PersonalDataSection } from "@/features/account/personal/components/PersonalDataSection";
import { NewsletterSection } from "@/features/account/profile/components/NewsletterSection";
import { errorMessages } from "@/features/session/errorMessages";

import { AccountPageHeader } from "./AccountPageHeader";
import { AccountSectionHeader } from "./AccountSectionHeader";

const t = {
  "account.overview.header": "Overview",
  "account.overview.subHeader":
    "Directly access your profile information, the default payment method and given addresses.",
  "account.overview.personalDataSectionHeader": "Personal data",
  "account.overview.defaultBillingAddressSectionHeader":
    "Default billing address",
  "account.overview.defaultShippingAddressSectionHeader":
    "Default shipping address",
  "account.overview.newsletter.subscriptionSectionHeader":
    "Newsletter subscription",
  "errors.message-default": errorMessages.errors["message-default"],
  "form.loading": "Loading...",
  "listing.retry": "Try again",
};

const PLACEHOLDER = "rounded bg-surface-surface-container";

export function AccountOverview() {
  const { status, customer, refresh } = useCustomer();
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    setRetrying(true);
    try {
      await refresh();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div>
      <AccountPageHeader
        className="mb-14"
        title={t["account.overview.header"]}
        subtitle={t["account.overview.subHeader"]}
      />
      {status === "loading" ? (
        <AccountOverviewSkeleton />
      ) : customer ? (
        <>
          <div className="mb-10">
            <AccountSectionHeader
              className="mb-4"
              title={t["account.overview.personalDataSectionHeader"]}
            />
            <PersonalDataSection
              customerName={[customer.firstName, customer.lastName]
                .filter(Boolean)
                .join(" ")}
              customerEmail={customer.email}
            />
          </div>

          <div className="mb-10">
            <AccountSectionHeader
              className="mb-4"
              title={t["account.overview.newsletter.subscriptionSectionHeader"]}
            />
            <NewsletterSection email={customer.email} />
          </div>

          <div className="mb-10 block gap-10 md:flex">
            <div className="mb-10 flex-1">
              <AccountSectionHeader
                className="mb-4"
                title={t["account.overview.defaultBillingAddressSectionHeader"]}
              />
              {customer.defaultBillingAddress ? (
                <AddressDataSection address={customer.defaultBillingAddress} />
              ) : null}
            </div>
            <div className="mb-10 flex-1">
              <AccountSectionHeader
                className="mb-4"
                title={
                  t["account.overview.defaultShippingAddressSectionHeader"]
                }
              />
              {customer.defaultShippingAddress ? (
                <AddressDataSection address={customer.defaultShippingAddress} />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="mb-10 flex flex-col items-start gap-4">
          <p role="alert" className="text-surface-on-surface">
            {t["errors.message-default"]}
          </p>
          <BaseButton
            variant="secondary"
            disabled={retrying}
            aria-busy={retrying || undefined}
            onClick={() => {
              void retry();
            }}
          >
            {t["listing.retry"]}
          </BaseButton>
        </div>
      )}
    </div>
  );
}

function AccountOverviewSkeleton() {
  return (
    <div
      aria-busy="true"
      data-testid="account-overview-skeleton"
      className="animate-pulse"
    >
      <output className="sr-only">{t["form.loading"]}</output>
      {[0, 1].map((section) => (
        <div key={section} className="mb-10">
          <div className="mb-4 border-b border-outline-outline-variant pb-2">
            <div className={`h-6 w-40 ${PLACEHOLDER}`} />
          </div>
          <div className="flex flex-col gap-2">
            <div className={`h-6 w-48 ${PLACEHOLDER}`} />
            <div className={`h-6 w-64 ${PLACEHOLDER}`} />
          </div>
        </div>
      ))}
      <div className="mb-10 block gap-10 md:flex">
        {[0, 1].map((column) => (
          <div key={column} className="mb-10 flex-1">
            <div className="mb-4 border-b border-outline-outline-variant pb-2">
              <div className={`h-6 w-48 ${PLACEHOLDER}`} />
            </div>
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className={`h-6 w-40 ${PLACEHOLDER}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
