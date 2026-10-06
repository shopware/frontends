"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState, useTransition } from "react";

import type { Schemas } from "#shopware";
import { useCustomer } from "@/features/account/customer/useCustomer";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import {
  readCustomerAddress,
  updateCustomerAddress,
  updatedAddressBody,
} from "../addressApi";
import { addressValuesFrom, toAddressBody } from "../addressSchema";
import type { AddressValues } from "../addressSchema";
import { SECONDARY_BUTTON_CLASS } from "./addressButtonClasses";
import { ADDRESS_LIST_PATH, AddressForm } from "./AddressForm";
import type { AddressFormProps } from "./AddressForm";
import { AddressFormSkeleton } from "./AddressSkeletons";

const t = {
  account: {
    back: "Back",
    address: {
      notFound: "Address not found",
      edit: {
        successMessage: "Address has been successfully updated.",
      },
    },
  },
  listing: {
    error: "Something went wrong while loading results.",
    retry: "Try again",
  },
};

type AddressLoad =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "ready"; address: Schemas["CustomerAddress"] };

type AddressReferenceProps = Omit<
  AddressFormProps,
  "onSubmit" | "initialValues" | "busy"
>;

export type EditAddressContentProps = AddressReferenceProps & {
  params: Promise<{ id: string }>;
};

export function EditAddressContent({
  params,
  ...references
}: EditAddressContentProps) {
  const { id } = use(params);
  return <EditAddress key={id} addressId={id} {...references} />;
}

function EditAddress({
  addressId,
  ...references
}: AddressReferenceProps & { addressId: string }) {
  const router = useRouter();
  const getClient = useShopwareClient();
  const { notify } = useCmsActions();
  const { refresh: refreshCustomer } = useCustomer();
  const { refreshSession } = useSessionActions();
  const [load, setLoad] = useState<AddressLoad>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [navigating, startNavigation] = useTransition();
  const [saved, setSaved] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    let active = true;
    async function read() {
      try {
        const client = await getClient();
        const address = await readCustomerAddress(client, addressId);
        if (!active) return;
        setLoad(
          address ? { status: "ready", address } : { status: "not-found" },
        );
      } catch (error) {
        console.error("[Address] reading the address failed", error);
        if (active) setLoad({ status: "error" });
      }
    }
    void read();
    return () => {
      active = false;
    };
  }, [getClient, addressId, attempt]);

  function retry() {
    setLoad({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  function notifyErrors(error: unknown) {
    for (const message of resolveApiErrorMessages(error)) {
      notify({ type: "error", message });
    }
  }

  async function handleSubmit(values: AddressValues) {
    if (savedRef.current) return;
    if (load.status !== "ready" || !load.address.id) {
      notify({ type: "error", message: t.account.address.notFound });
      return;
    }
    const { address } = load;
    try {
      const client = await getClient();
      await updateCustomerAddress(
        client,
        address.id,
        updatedAddressBody(address, toAddressBody(values)),
      );
    } catch (error) {
      notifyErrors(error);
      return;
    }
    savedRef.current = true;
    setSaved(true);
    notify({
      type: "success",
      message: t.account.address.edit.successMessage,
    });
    void Promise.all([refreshCustomer(), refreshSession()]);
    startNavigation(() => {
      router.push(ADDRESS_LIST_PATH);
    });
  }

  if (load.status === "loading") return <AddressFormSkeleton />;

  if (load.status === "not-found") {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-4 text-surface-on-surface"
      >
        <p>{t.account.address.notFound}</p>
        <Link href={ADDRESS_LIST_PATH} className={SECONDARY_BUTTON_CLASS}>
          {t.account.back}
        </Link>
      </div>
    );
  }

  if (load.status === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 text-surface-on-surface"
      >
        <p>{t.listing.error}</p>
        <BaseButton variant="secondary" size="small" onClick={retry}>
          {t.listing.retry}
        </BaseButton>
      </div>
    );
  }

  return (
    <AddressForm
      {...references}
      initialValues={addressValuesFrom(load.address)}
      busy={saved || navigating}
      onSubmit={handleSubmit}
    />
  );
}
