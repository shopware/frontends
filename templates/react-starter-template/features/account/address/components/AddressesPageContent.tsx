"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { BaseButton, useCmsActions } from "@/cms/client";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { useCustomer } from "@/features/account/customer/useCustomer";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";
import { resolveApiErrorMessages } from "@/platform/shopware/apiErrors";

import {
  deleteCustomerAddress,
  listCustomerAddresses,
  setDefaultBillingAddress,
  setDefaultShippingAddress,
} from "../addressApi";
import { AddressDataSection } from "./AddressDataSection";
import { AddressDataSkeleton, AddressListSkeleton } from "./AddressSkeletons";
import { AddressTile } from "./AddressTile";
import type { DefaultAddressKind } from "./AddressTile";

type AddressList =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; addresses: Schemas["CustomerAddress"][] };

function withId(ids: ReadonlySet<string>, id: string): ReadonlySet<string> {
  return new Set(ids).add(id);
}

function withoutId(ids: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(ids);
  next.delete(id);
  return next;
}

function withoutKey<T>(
  record: Readonly<Record<string, T>>,
  key: string,
): Readonly<Record<string, T>> {
  const next = { ...record };
  delete next[key];
  return next;
}

type PendingFocus = {
  trigger: Element | null;
  index: number;
  settled: boolean;
};

function DefaultAddress({
  address,
  loading,
}: {
  address: Schemas["CustomerAddress"] | null | undefined;
  loading: boolean;
}) {
  if (address) return <AddressDataSection address={address} />;
  if (loading) return <AddressDataSkeleton />;
  return null;
}

export function AddressesPageContent() {
  const getClient = useShopwareClient();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const { refreshSession } = useSessionActions();
  const {
    status: customerStatus,
    customer,
    refresh: refreshCustomer,
  } = useCustomer();
  const [list, setList] = useState<AddressList>({ status: "loading" });
  const [deletingIds, setDeletingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [pendingDefaults, setPendingDefaults] = useState<
    Readonly<Record<string, DefaultAddressKind>>
  >({});
  const [retrying, setRetrying] = useState(false);
  const requestRef = useRef(0);
  const busyRef = useRef(new Set<string>());
  const listRef = useRef<HTMLDivElement>(null);
  const pendingFocusRef = useRef<PendingFocus | null>(null);

  const readAddresses = useCallback(async (): Promise<AddressList | null> => {
    const request = ++requestRef.current;
    try {
      const client = await getClient();
      const addresses = await listCustomerAddresses(client);
      return request === requestRef.current
        ? { status: "ready", addresses }
        : null;
    } catch (error) {
      console.error("[Address] reading the addresses failed", error);
      return request === requestRef.current ? { status: "error" } : null;
    }
  }, [getClient]);

  const applyAddresses = useCallback((next: AddressList | null) => {
    if (!next) return;
    setList((current) =>
      next.status === "error" && current.status === "ready" ? current : next,
    );
  }, []);

  useEffect(() => {
    void readAddresses().then(applyAddresses);
  }, [readAddresses, applyAddresses]);

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending?.settled) return;
    pendingFocusRef.current = null;
    if (pending.trigger?.isConnected) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    const tiles = listRef.current?.querySelectorAll("[data-address-id]") ?? [];
    const tile = tiles[Math.min(pending.index, tiles.length - 1)];
    tile?.querySelector<HTMLElement>("a, button")?.focus();
  }, [deletingIds, pendingDefaults]);

  function trackFocus(addressId: string): PendingFocus {
    const pending = {
      trigger: document.activeElement,
      index:
        list.status === "ready"
          ? list.addresses.findIndex((address) => address.id === addressId)
          : -1,
      settled: false,
    };
    pendingFocusRef.current = pending;
    return pending;
  }

  async function loadAddresses() {
    applyAddresses(await readAddresses());
  }

  function notifyErrors(error: unknown) {
    for (const message of resolveApiErrorMessages(error, t)) {
      notify({ type: "error", message });
    }
  }

  async function refreshAfterChange() {
    await Promise.all([loadAddresses(), refreshCustomer(), refreshSession()]);
  }

  async function handleDelete(addressId: string) {
    const key = `delete:${addressId}`;
    if (busyRef.current.has(key)) return;
    busyRef.current.add(key);
    setDeletingIds((ids) => withId(ids, addressId));
    const pendingFocus = trackFocus(addressId);
    try {
      const client = await getClient();
      await deleteCustomerAddress(client, addressId);
      notify({
        type: "success",
        message: t("account.address.deleteSuccessMessage"),
      });
      setList((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              addresses: current.addresses.filter(
                (address) => address.id !== addressId,
              ),
            }
          : current,
      );
      await refreshAfterChange();
    } catch (error) {
      notifyErrors(error);
    } finally {
      pendingFocus.settled = true;
      busyRef.current.delete(key);
      setDeletingIds((ids) => withoutId(ids, addressId));
    }
  }

  async function handleSetDefault(kind: DefaultAddressKind, addressId: string) {
    const key = `default:${addressId}`;
    if (busyRef.current.has(key)) return;
    busyRef.current.add(key);
    setPendingDefaults((pending) => ({ ...pending, [addressId]: kind }));
    const pendingFocus = trackFocus(addressId);
    try {
      const client = await getClient();
      if (kind === "billing") {
        await setDefaultBillingAddress(client, addressId);
      } else {
        await setDefaultShippingAddress(client, addressId);
      }
      notify({
        type: "success",
        message:
          kind === "billing"
            ? t("account.address.defaultBillingSuccessMessage")
            : t("account.address.defaultShippingSuccessMessage"),
      });
      await refreshAfterChange();
    } catch (error) {
      notifyErrors(error);
    } finally {
      pendingFocus.settled = true;
      busyRef.current.delete(key);
      setPendingDefaults((pending) => withoutKey(pending, addressId));
    }
  }

  async function retry() {
    if (retrying) return;
    setRetrying(true);
    try {
      await Promise.all([
        list.status === "error" ? loadAddresses() : null,
        customer ? null : refreshCustomer(),
      ]);
    } finally {
      setRetrying(false);
    }
  }

  const customerLoading = !customer && customerStatus === "loading";
  const failed =
    list.status === "error" || (!customer && customerStatus === "error");

  function renderAddresses() {
    if (failed) {
      return (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 text-surface-on-surface"
        >
          <p>{t("listing.error")}</p>
          <BaseButton
            variant="secondary"
            size="small"
            disabled={retrying}
            aria-busy={retrying}
            onClick={() => {
              void retry();
            }}
          >
            {t("listing.retry")}
          </BaseButton>
        </div>
      );
    }
    if (list.status === "loading" || !customer) {
      return <AddressListSkeleton />;
    }
    if (list.addresses.length === 0) {
      return (
        <p className="text-surface-on-surface-variant">{t("listing.empty")}</p>
      );
    }
    return (
      <ul className="flex flex-col gap-10 md:grid md:grid-cols-2">
        {list.addresses.map((address) => (
          <li key={address.id}>
            <AddressTile
              address={address}
              isDeleting={deletingIds.has(address.id)}
              isDefaultBillingAddress={
                address.id === customer.defaultBillingAddressId
              }
              isDefaultShippingAddress={
                address.id === customer.defaultShippingAddressId
              }
              pendingDefault={pendingDefaults[address.id] ?? null}
              onDelete={(id) => {
                void handleDelete(id);
              }}
              onSetAsDefaultBillingAddress={(id) => {
                void handleSetDefault("billing", id);
              }}
              onSetAsDefaultShippingAddress={(id) => {
                void handleSetDefault("shipping", id);
              }}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="mb-10 block gap-10 md:flex">
        <div className="mb-10 flex-1">
          <AccountSectionHeader
            className="mb-4"
            title={t("account.address.defaultBillingAddressSectionHeader")}
          />
          <DefaultAddress
            address={customer?.defaultBillingAddress}
            loading={customerLoading}
          />
        </div>
        <div className="mb-10 flex-1">
          <AccountSectionHeader
            className="mb-4"
            title={t("account.address.defaultShippingAddressSectionHeader")}
          />
          <DefaultAddress
            address={customer?.defaultShippingAddress}
            loading={customerLoading}
          />
        </div>
      </div>

      <div className="mb-10">
        <AccountSectionHeader
          className="mb-4"
          title={t("account.address.availableAddressesSectionHeader")}
        />
        <div ref={listRef} aria-busy={list.status === "loading" || undefined}>
          {renderAddresses()}
        </div>
      </div>
    </>
  );
}
