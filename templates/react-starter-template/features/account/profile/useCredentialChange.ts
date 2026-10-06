"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { useCustomer } from "@/features/account/customer/useCustomer";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

import type { ProfileClient } from "./profileApi";

export const PROFILE_PATH = "/account/profile";

export type CredentialChangeOptions<Values extends Record<string, string>> = {
  initialValues: Values;
  validate(values: Values, t: Translate): Partial<Record<keyof Values, string>>;
  submit(client: ProfileClient, values: Values): Promise<void>;
  successMessage: string;
};

export function useCredentialChange<Values extends Record<string, string>>({
  initialValues,
  validate,
  submit,
  successMessage,
}: CredentialChangeOptions<Values>) {
  const router = useRouter();
  const getClient = useShopwareClient();
  const { refresh } = useCustomer();
  const { refreshSession } = useSessionActions();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const localePath = useLocalePath();
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, true>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [navigating, startNavigation] = useTransition();
  const [focusRequest, setFocusRequest] = useState(0);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const busy = pending || navigating;
  const errors = validate(values, t);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  function errorFor(field: keyof Values): string | undefined {
    return submitted || touched[field] ? errors[field] : undefined;
  }

  function setField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function touch(field: keyof Values) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || busy) return;
    setSubmitted(true);
    if (Object.keys(validate(values, t)).length) {
      setFocusRequest((count) => count + 1);
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      try {
        await submit(await getClient(), values);
      } catch (error) {
        for (const message of resolveApiErrorMessages(error, t)) {
          notify({ type: "error", message });
        }
        return;
      }
      notify({ type: "success", message: successMessage });
      await Promise.all([refresh(), refreshSession()]);
      if (!mounted.current) return;
      startNavigation(() => {
        router.push(localePath(PROFILE_PATH));
      });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return { values, busy, formRef, errorFor, setField, touch, handleSubmit };
}
