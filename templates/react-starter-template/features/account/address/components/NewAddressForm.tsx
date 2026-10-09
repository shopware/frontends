"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import { createCustomerAddress } from "../addressApi";
import { toAddressBody } from "../addressSchema";
import type { AddressValues } from "../addressSchema";
import { ADDRESS_LIST_PATH, AddressForm } from "./AddressForm";
import type { AddressFormProps } from "./AddressForm";

export type NewAddressFormProps = Omit<
  AddressFormProps,
  "onSubmit" | "initialValues" | "busy"
>;

export function NewAddressForm(props: NewAddressFormProps) {
  const router = useRouter();
  const getClient = useShopwareClient();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const localePath = useLocalePath();
  const [navigating, startNavigation] = useTransition();
  const [saved, setSaved] = useState(false);
  const savedRef = useRef(false);

  async function handleSubmit(values: AddressValues) {
    if (savedRef.current) return;
    try {
      const client = await getClient();
      await createCustomerAddress(client, toAddressBody(values));
    } catch (error) {
      for (const message of resolveApiErrorMessages(error, t)) {
        notify({ type: "error", message });
      }
      return;
    }
    savedRef.current = true;
    setSaved(true);
    notify({
      type: "success",
      message: t("account.address.new.successMessage"),
    });
    startNavigation(() => {
      router.push(localePath(ADDRESS_LIST_PATH));
    });
  }

  return (
    <AddressForm
      {...props}
      busy={saved || navigating}
      onSubmit={handleSubmit}
    />
  );
}
