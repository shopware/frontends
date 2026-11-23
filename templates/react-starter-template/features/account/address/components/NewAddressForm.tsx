"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState, useTransition } from "react";

import { useCmsActions } from "@/cms/client";
import { resolveRedirectFromSearch } from "@/features/account/redirect";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import { resolveApiErrorMessages } from "@/platform/shopware/apiErrors";

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
  const [formKey, setFormKey] = useState(0);
  const savedRef = useRef(false);

  useLayoutEffect(
    () => () => {
      if (!savedRef.current) return;
      savedRef.current = false;
      setSaved(false);
      setFormKey((key) => key + 1);
    },
    [],
  );

  async function handleSubmit(values: AddressValues) {
    if (savedRef.current) return;
    try {
      const client = await getClient();
      await createCustomerAddress(
        client,
        toAddressBody(values, props.settings),
      );
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
    const target = resolveRedirectFromSearch(
      window.location.search,
      null,
      ADDRESS_LIST_PATH,
    );
    startNavigation(() => {
      router.push(localePath(target));
    });
  }

  return (
    <AddressForm
      key={formKey}
      {...props}
      busy={saved || navigating}
      onSubmit={handleSubmit}
    />
  );
}
