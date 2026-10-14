"use client";

import { BaseButton, cx } from "@shopware/cms-base-layer-react/client";
import { getTranslatedProperty } from "@shopware/helpers";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import type { Schemas } from "#shopware";
import { LocaleLink } from "@/components/LocaleLink";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import { activeCheckoutAddresses, addressSummary } from "../checkoutAddresses";
import type { AddressKind } from "../checkoutAddresses";
import { useCheckoutAddresses } from "../useCheckoutAddresses";
import type { CheckoutAddressList } from "../useCheckoutAddresses";
import { CustomerAddressChosen } from "./CustomerAddressChosen";

const TOGGLE_CLASS =
  "inline-flex items-center gap-1 rounded-sm text-sm text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden";

const RADIO_CLASS =
  "mt-1 size-4 shrink-0 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

export type PendingAddressChange = { kind: AddressKind; id: string };

export type CheckoutAddressesProps = {
  customer: Schemas["Customer"];
  pending: PendingAddressChange | null;
  canAddAddress: boolean;
  onSelect: (kind: AddressKind, addressId: string) => Promise<boolean>;
};

function AddressLines({ address }: { address: Schemas["CustomerAddress"] }) {
  const contentLang = useContentLang();
  const countryName = address.country
    ? getTranslatedProperty(address.country, "name")
    : "";
  return (
    <span className="flex flex-col text-base leading-normal text-surface-on-surface">
      <span>
        {address.firstName} {address.lastName}
      </span>
      <span>{address.street}</span>
      <span>
        {address.zipcode} {address.city}
      </span>
      {countryName ? <span lang={contentLang}>{countryName}</span> : null}
    </span>
  );
}

type AddressChoiceProps = {
  kind: AddressKind;
  address: Schemas["CustomerAddress"] | null;
  sameAsShipping: boolean;
  list: CheckoutAddressList;
  pending: PendingAddressChange | null;
  canAddAddress: boolean;
  onSelect: (kind: AddressKind, addressId: string) => Promise<boolean>;
};

function AddressChoice({
  kind,
  address,
  sameAsShipping,
  list,
  pending,
  canAddAddress,
  onSelect,
}: AddressChoiceProps) {
  const t = useTranslations();
  const localePath = useLocalePath();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { load } = list;
  const headingId = `checkout-${kind}-address-heading`;
  const optionsId = `checkout-${kind}-address-options`;
  const busy = pending?.kind === kind;
  const activeId = address?.id ?? null;
  const checkedId = busy ? pending.id : (selectedId ?? activeId);
  const addAddressHref = `/account/address/new?redirect=${encodeURIComponent(localePath("/checkout"))}`;

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  function close() {
    setOpen(false);
    setSelectedId(null);
    toggleRef.current?.focus();
  }

  function toggle() {
    setOpen(!open);
    setSelectedId(null);
    setAnnouncement("");
  }

  async function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !checkedId) return;
    if (checkedId === activeId) {
      close();
      return;
    }
    const chosen = list.addresses.find((option) => option.id === checkedId);
    if (!(await onSelect(kind, checkedId))) return;
    close();
    if (chosen) {
      setAnnouncement(
        t(
          kind === "shipping"
            ? "checkout.addresses.shippingChanged"
            : "checkout.addresses.billingChanged",
          { address: addressSummary(chosen) },
        ),
      );
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      data-testid={`checkout-active-${kind}-address`}
    >
      <h3
        id={headingId}
        className="mb-3 leading-normal font-bold text-surface-on-surface"
      >
        {t(
          kind === "shipping"
            ? "checkout.shippingAddressLabel"
            : "checkout.billingAddressLabel",
        )}
      </h3>
      {sameAsShipping ? (
        <p className="text-sm text-surface-on-surface">
          {t("checkout.addresses.sameAsShipping")}
        </p>
      ) : address ? (
        <CustomerAddressChosen address={address} />
      ) : null}
      <div className="mt-2">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={optionsId}
          data-testid={`checkout-change-${kind}-address-button`}
          className={TOGGLE_CLASS}
          onClick={toggle}
        >
          {t(
            kind === "shipping"
              ? "checkout.addresses.changeShipping"
              : "checkout.addresses.changeBilling",
          )}
        </button>
      </div>
      <div id={optionsId} hidden={!open} className="mt-4">
        {list.status === "error" ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 text-sm text-surface-on-surface"
          >
            <p>{t("checkout.addresses.loadError")}</p>
            <BaseButton variant="secondary" size="small" onClick={list.load}>
              {t("listing.retry")}
            </BaseButton>
          </div>
        ) : list.status === "ready" ? (
          <form
            onSubmit={(event) => {
              void commit(event);
            }}
          >
            <fieldset aria-busy={busy || undefined} className="min-w-0">
              <legend className="sr-only">
                {t(
                  kind === "shipping"
                    ? "checkout.addresses.chooseShipping"
                    : "checkout.addresses.chooseBilling",
                )}
              </legend>
              <ul className="flex flex-col gap-3">
                {list.addresses.map((option) => (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-outline-outline-variant p-4 has-checked:border-brand-primary">
                      <input
                        type="radio"
                        name={`${kind}-address`}
                        value={option.id}
                        checked={checkedId === option.id}
                        onChange={() => {
                          if (!pending) setSelectedId(option.id);
                        }}
                        data-testid={`checkout-${kind}-address-${option.id}`}
                        className={RADIO_CLASS}
                      />
                      <AddressLines address={option} />
                    </label>
                  </li>
                ))}
              </ul>
              <BaseButton
                type="submit"
                variant="secondary"
                size="small"
                className="mt-4"
                data-testid={`checkout-use-${kind}-address-button`}
              >
                {t("checkout.addresses.useAddress")}
              </BaseButton>
            </fieldset>
          </form>
        ) : (
          <output className="block text-sm text-surface-on-surface">
            {t("form.loading")}
          </output>
        )}
        {canAddAddress ? (
          <LocaleLink
            href={addAddressHref}
            data-testid={`checkout-add-${kind}-address-link`}
            className={cx(TOGGLE_CLASS, "mt-4")}
          >
            {t("account.address.addAddressButton")}
          </LocaleLink>
        ) : null}
      </div>
      <output className="sr-only">{announcement}</output>
    </section>
  );
}

export function CheckoutAddresses({
  customer,
  pending,
  canAddAddress,
  onSelect,
}: CheckoutAddressesProps) {
  const list = useCheckoutAddresses();
  const active = activeCheckoutAddresses(customer);
  return (
    <div className="flex flex-col gap-8">
      <AddressChoice
        kind="shipping"
        address={active.shipping}
        sameAsShipping={false}
        list={list}
        pending={pending}
        canAddAddress={canAddAddress}
        onSelect={onSelect}
      />
      <AddressChoice
        kind="billing"
        address={active.billing}
        sameAsShipping={active.sameAddress}
        list={list}
        pending={pending}
        canAddAddress={canAddAddress}
        onSelect={onSelect}
      />
    </div>
  );
}
