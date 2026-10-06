"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { InputField } from "@/components/form/InputField";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";

import {
  emptyDeepLinkCredentials,
  parseDeepLinkCredentials,
  validateDeepLinkCredentials,
} from "../deepLinkSchema";
import { readDeepLinkOrder } from "../ordersApi";
import type {
  DeepLinkCredentials,
  DeepLinkOrderResult,
  OrderDetails,
} from "../ordersApi";
import { useOrderDetails } from "../useOrderDetails";
import { OrderBackLink } from "./OrderBackLink";
import { OrderDetailSkeleton } from "./OrderDetailSkeleton";
import { orderTitle } from "./OrderDetailsPageContent";
import { OrderDetailView } from "./OrderDetailView";
import { DocumentUnknownIcon } from "./OrderIcons";

type Phase =
  | { name: "loading" }
  | { name: "auth"; notFound: boolean }
  | { name: "notFound" }
  | { name: "failed"; messages: string[] }
  | { name: "ready"; details: OrderDetails; focusHeading: boolean };

type Field = keyof DeepLinkCredentials;

export type DeepLinkOrderPageContentProps = {
  params: Promise<{ deepCode: string }>;
};

export function DeepLinkOrderPageContent({
  params,
}: DeepLinkOrderPageContentProps) {
  const { deepCode } = use(params);
  return <DeepLinkOrder key={deepCode} deepLinkCode={deepCode} />;
}

function NotFound() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <DocumentUnknownIcon className="mb-4 size-16 text-surface-on-surface-variant" />
      <h1 className="mb-2 text-xl font-semibold text-surface-on-surface">
        {t("account.messages.orderSuccessNoOrder")}
      </h1>
      <p className="max-w-md text-sm text-surface-on-surface-variant">
        {t("account.order.authOrderText")}
      </p>
    </div>
  );
}

function DeepLinkOrder({ deepLinkCode }: { deepLinkCode: string }) {
  const session = useSession();
  const { refreshSession } = useSessionActions();
  const getClient = useShopwareClient();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const started = useRef(false);
  const focusResult = useRef(false);

  const lookup = useCallback(
    async (credentials: DeepLinkCredentials | null): Promise<void> => {
      if (credentials !== null) focusResult.current = true;
      let result: DeepLinkOrderResult;
      try {
        const client = await getClient();
        result = await readDeepLinkOrder(
          client,
          { deepLinkCode, credentials },
          t,
        );
      } catch (error) {
        console.error("[Account] reading the order failed", error);
        result = {
          status: "failed",
          messages: resolveApiErrorMessages(error, t),
        };
      }

      const focusHeading = focusResult.current;
      focusResult.current = false;

      switch (result.status) {
        case "found":
          setPhase({ name: "ready", details: result.details, focusHeading });
          if (credentials) void refreshSession();
          return;
        case "notFound":
          setPhase(
            credentials
              ? { name: "auth", notFound: true }
              : { name: "notFound" },
          );
          return;
        case "authRequired":
          setPhase({ name: "auth", notFound: credentials !== null });
          return;
        case "wrongCredentials":
          notify({
            type: "error",
            message: t("account.messages.orderWrongData"),
          });
          setPhase({ name: "auth", notFound: false });
          return;
        case "failed":
          if (credentials) {
            for (const message of result.messages) {
              notify({ type: "error", message });
            }
            setPhase({ name: "auth", notFound: false });
          } else {
            setPhase({ name: "failed", messages: result.messages });
          }
          return;
      }
    },
    [deepLinkCode, getClient, notify, refreshSession, t],
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void lookup(null);
  }, [lookup]);

  function retry() {
    focusResult.current = true;
    setPhase({ name: "loading" });
    void lookup(null);
  }

  function renderBody() {
    switch (phase.name) {
      case "loading":
        return <OrderDetailSkeleton />;
      case "notFound":
        return <NotFound />;
      case "failed":
        return (
          <div role="alert" className="py-8 text-center text-sm">
            <p className="text-surface-on-surface-variant">
              {phase.messages[0] ?? t("messages.error")}
            </p>
            <button
              type="button"
              className="mt-3 text-surface-on-surface underline"
              onClick={retry}
            >
              {t("listing.retry")}
            </button>
          </div>
        );
      case "auth":
        return (
          <>
            <div role="alert">{phase.notFound ? <NotFound /> : null}</div>
            <DeepLinkAuthForm
              headingLevel={phase.notFound ? 2 : 1}
              onSubmit={lookup}
            />
          </>
        );
      case "ready":
        return (
          <DeepLinkOrderView
            details={phase.details}
            focusHeading={phase.focusHeading}
          />
        );
    }
  }

  return (
    <div className="mx-auto my-8 w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      {session.isLoggedIn ? (
        <div className="mb-5">
          <OrderBackLink label={t("account.order.backToList")} />
        </div>
      ) : null}
      {renderBody()}
    </div>
  );
}

function DeepLinkOrderView({
  details,
  focusHeading,
}: {
  details: OrderDetails;
  focusHeading: boolean;
}) {
  const t = useTranslations();
  const { state, reload } = useOrderDetails(details.order.id, details);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const current = state.status === "ready" ? state.details : details;

  useEffect(() => {
    if (focusHeading) headingRef.current?.focus();
  }, [focusHeading]);

  return (
    <>
      <AccountPageHeader
        className="mb-14"
        title={orderTitle(t, current.order.orderNumber)}
        headingRef={headingRef}
      />
      <OrderDetailView details={current} onReload={reload} />
    </>
  );
}

function DeepLinkAuthForm({
  headingLevel,
  onSubmit,
}: {
  headingLevel: 1 | 2;
  onSubmit: (credentials: DeepLinkCredentials) => Promise<void>;
}) {
  const t = useTranslations();
  const [values, setValues] = useState<DeepLinkCredentials>(
    emptyDeepLinkCredentials,
  );
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validateDeepLinkCredentials(values, t);
  const errorFor = (field: Field) =>
    submitted || touched[field] ? errors[field] : undefined;
  const setField = (field: Field, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));
  const touch = (field: Field) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setSubmitted(true);
    const credentials = parseDeepLinkCredentials(values, t);
    if (!credentials) {
      setFocusRequest((count) => count + 1);
      return;
    }
    setPending(true);
    try {
      await onSubmit(credentials);
    } finally {
      setPending(false);
    }
  }

  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div>
      <Heading className="mb-2 text-2xl font-bold text-surface-on-surface">
        {t("account.order.authOrderTitle")}
      </Heading>
      <p className="mb-6 text-sm text-surface-on-surface-variant">
        {t("account.order.authOrderText")}
      </p>
      <form
        ref={formRef}
        className="flex max-w-lg flex-col gap-4"
        data-testid="deep-link-order-form"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <InputField
            id="deep-link-email"
            className="flex-1"
            type="email"
            label={t("account.order.emailPlaceholder")}
            placeholder={t("account.order.emailPlaceholder")}
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            onBlur={touch("email")}
            error={errorFor("email")}
          />
          <InputField
            id="deep-link-postal-code"
            className="sm:w-2/5"
            type="text"
            label={t("account.order.postalCodePlaceholder")}
            placeholder={t("account.order.postalCodePlaceholder")}
            autoComplete="postal-code"
            required
            value={values.zipcode}
            onChange={(event) => setField("zipcode", event.target.value)}
            onBlur={touch("zipcode")}
            error={errorFor("zipcode")}
          />
        </div>
        <div>
          <BaseButton
            type="submit"
            data-testid="deep-link-order-submit-button"
            aria-busy={pending}
            aria-disabled={pending || undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            {t("account.order.authOrderButton")}
          </BaseButton>
        </div>
      </form>
    </div>
  );
}
