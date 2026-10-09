"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

import type { Schemas } from "#shopware";
import { LocaleLink } from "@/components/LocaleLink";
import { useCart } from "@/features/cart/useCart";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import {
  createOrder,
  getPaymentMethods,
  getShippingMethods,
  isAmbiguousOrderFailure,
  setPaymentMethod,
  setShippingMethod,
  updateCustomerDetails,
} from "../checkoutApi";
import type { CheckoutClient } from "../checkoutApi";
import {
  emptyCheckoutValues,
  toBillingAddressFields,
  toCheckoutRegistration,
  validateCheckout,
} from "../checkoutSchema";
import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutValues,
} from "../checkoutSchema";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { CustomerAddress } from "./CustomerAddress";
import { CustomerAddressChosen } from "./CustomerAddressChosen";
import { CustomerBaseInfo } from "./CustomerBaseInfo";
import { PaymentMethods } from "./PaymentMethods";
import { ShippingMethods } from "./ShippingMethods";
import { StepHeader } from "./StepHeader";
import { SummaryBox } from "./SummaryBox";

const OVERLAY_CLASS =
  "absolute inset-0 z-10 cursor-wait bg-surface-surface/70 backdrop-blur-[1px]";

type Touched = Partial<Record<CheckoutField, boolean>>;

type MethodKind = "shipping" | "payment";

export type CheckoutPageContentProps = {
  countries: CountryOption[];
  countriesUnavailable?: boolean;
};

function visibleErrors(
  errors: CheckoutErrors,
  touched: Touched,
  submitted: boolean,
): CheckoutErrors {
  const visible: CheckoutErrors = {};
  for (const field of Object.keys(errors) as CheckoutField[]) {
    if (submitted || touched[field]) visible[field] = errors[field];
  }
  return visible;
}

type CheckoutMethods = {
  shipping: Schemas["ShippingMethod"][] | null;
  payment: Schemas["PaymentMethod"][] | null;
};

async function readCheckoutMethods(
  getClient: () => Promise<CheckoutClient>,
): Promise<CheckoutMethods> {
  let client: CheckoutClient;
  try {
    client = await getClient();
  } catch (error) {
    console.error("[Checkout] the Store API client is not available", error);
    return { shipping: null, payment: null };
  }
  const [shipping, payment] = await Promise.allSettled([
    getShippingMethods(client),
    getPaymentMethods(client),
  ]);
  if (shipping.status === "rejected") {
    console.error(
      "[Checkout] reading shipping methods failed",
      shipping.reason,
    );
  }
  if (payment.status === "rejected") {
    console.error("[Checkout] reading payment methods failed", payment.reason);
  }
  return {
    shipping: shipping.status === "fulfilled" ? shipping.value : null,
    payment: payment.status === "fulfilled" ? payment.value : null,
  };
}

function RetryAlert({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations();
  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center gap-6 px-4 py-20"
    >
      <p className="text-lg text-surface-on-surface">{t("messages.error")}</p>
      <BaseButton variant="secondary" onClick={onRetry}>
        {t("listing.retry")}
      </BaseButton>
    </div>
  );
}

export function CheckoutPageContent({
  countries,
  countriesUnavailable = false,
}: CheckoutPageContentProps) {
  const router = useRouter();
  const session = useSession();
  const { register, refreshSession, retrySession } = useSessionActions();
  const { notify } = useCmsActions();
  const getClient = useShopwareClient();
  const cart = useCart();
  const t = useTranslations();
  const localePath = useLocalePath();

  const [values, setValues] = useState<CheckoutValues>(emptyCheckoutValues);
  const [createAccount, setCreateAccount] = useState(false);
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [registeredDuringCheckout, setRegisteredDuringCheckout] =
    useState(false);
  const [shippingMethods, setShippingMethods] = useState<
    Schemas["ShippingMethod"][]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    Schemas["PaymentMethod"][]
  >([]);
  const [pendingShippingMethod, setPendingShippingMethod] = useState<
    string | null
  >(null);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<
    string | null
  >(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const placingOrder = useRef(false);
  const registered = useRef(false);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const methodChanges = useRef<Record<MethodKind, number>>({
    shipping: 0,
    payment: 0,
  });
  const formRef = useRef<HTMLDivElement>(null);

  const context = session.context;
  const customer = context?.customer ?? null;
  const chosenAddress =
    customer?.defaultBillingAddress ?? customer?.activeBillingAddress ?? null;
  const isUserSession = session.isLoggedIn || session.isGuestSession;
  const showCustomerForm = !isUserSession || registeredDuringCheckout;
  const selectedShippingMethod =
    pendingShippingMethod ?? context?.shippingMethod?.id ?? null;
  const selectedPaymentMethod =
    pendingPaymentMethod ?? context?.paymentMethod?.id ?? null;
  const canPlaceOrder = Boolean(
    selectedShippingMethod && selectedPaymentMethod,
  );

  const states =
    countries.find((country) => country.id === values.countryId)?.states ?? [];
  const errors = validateCheckout(
    values,
    { createAccount, countryHasStates: states.length > 0 },
    t,
  );
  const fieldErrors = visibleErrors(errors, touched, submitted);

  useEffect(() => {
    let active = true;
    async function load() {
      const methods = await readCheckoutMethods(getClient);
      if (!active) return;
      if (methods.shipping) setShippingMethods(methods.shipping);
      if (methods.payment) setPaymentMethods(methods.payment);
    }
    void load();
    return () => {
      active = false;
    };
  }, [getClient]);

  async function reloadMethods() {
    const methods = await readCheckoutMethods(getClient);
    if (methods.shipping) setShippingMethods(methods.shipping);
    if (methods.payment) setPaymentMethods(methods.payment);
  }

  useEffect(() => {
    if (isUserSession) registered.current = false;
  }, [isUserSession]);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  useEffect(() => {
    if (isPlacingOrder) return;
    const target = restoreFocusTo.current;
    restoreFocusTo.current = null;
    if (target?.isConnected) target.focus();
  }, [isPlacingOrder]);

  const setField = useCallback((field: CheckoutField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const touchField = useCallback((field: CheckoutField) => {
    setTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }, []);

  const handleCountryChange = useCallback((countryId: string) => {
    setValues((current) =>
      current.countryId === countryId
        ? current
        : { ...current, countryId, countryStateId: "" },
    );
  }, []);

  function handleCreateAccountChange(next: boolean) {
    setCreateAccount(next);
    if (next) return;
    setValues((current) => ({ ...current, password: "" }));
    setTouched((current) => ({ ...current, password: false }));
  }

  function notifyPersistentError(message: string) {
    notify({ type: "error", message, timeout: 0 });
  }

  function notifyApiError(error: unknown) {
    for (const message of resolveApiErrorMessages(error, t)) {
      notifyPersistentError(message);
    }
  }

  async function changeMethod(kind: MethodKind, id: string) {
    const setPending =
      kind === "shipping" ? setPendingShippingMethod : setPendingPaymentMethod;
    methodChanges.current[kind] += 1;
    const change = methodChanges.current[kind];
    setPending(id);
    try {
      const client = await getClient();
      if (kind === "shipping") {
        await setShippingMethod(client, id);
      } else {
        await setPaymentMethod(client, id);
      }
      await Promise.allSettled([refreshSession(), cart.refresh()]);
    } catch (error) {
      for (const message of resolveApiErrorMessages(error, t)) {
        notify({ type: "error", message });
      }
    } finally {
      if (methodChanges.current[kind] === change) setPending(null);
    }
  }

  async function registerCustomer(): Promise<boolean> {
    setRegisteredDuringCheckout(true);
    const result = await register(
      toCheckoutRegistration(values, createAccount),
    );
    if (!result.ok || result.doubleOptIn) {
      setRegisteredDuringCheckout(false);
      if (result.ok) {
        notify({
          type: "info",
          message: t("account.messages.signUpSuccess"),
          timeout: 0,
        });
      }
      return false;
    }
    registered.current = true;
    await reloadMethods();
    return true;
  }

  async function saveCustomerDetails(): Promise<boolean> {
    let currentCustomer = customer;
    if (!isUserSession) {
      if (!registered.current) return registerCustomer();
      const next = await retrySession();
      if (!next.isLoggedIn && !next.isGuestSession) {
        notifyPersistentError(t("messages.error"));
        return false;
      }
      currentCustomer = next.context?.customer ?? null;
    }
    try {
      await updateCustomerDetails(await getClient(), {
        customer: currentCustomer,
        address: toBillingAddressFields(values),
      });
    } catch (error) {
      notifyApiError(error);
      return false;
    }
    await Promise.all([refreshSession(), cart.refresh()]);
    await reloadMethods();
    return true;
  }

  async function handlePlaceOrder(event: MouseEvent<HTMLButtonElement>) {
    if (placingOrder.current) return;
    const trigger = event.currentTarget;
    const formShown = showCustomerForm;

    if (formShown) {
      setSubmitted(true);
      if (Object.keys(errors).length > 0) {
        setFocusRequest((count) => count + 1);
        return;
      }
    }

    if (!canPlaceOrder) {
      notifyPersistentError(t("messages.error"));
      return;
    }

    placingOrder.current = true;
    setIsPlacingOrder(true);
    let placed = false;
    try {
      if (formShown && !(await saveCustomerDetails())) {
        restoreFocusTo.current = trigger;
        return;
      }

      const client = await getClient();
      let order: Schemas["Order"];
      try {
        order = await createOrder(client);
      } catch (error) {
        if (isAmbiguousOrderFailure(error)) {
          notifyPersistentError(t("errors.order-timeout"));
        } else {
          notifyApiError(error);
        }
        void cart.refresh();
        restoreFocusTo.current = trigger;
        return;
      }

      placed = true;
      setOrderPlaced(true);
      router.push(
        localePath(`/checkout/success/${encodeURIComponent(order.id)}`),
      );
      void refreshSession();
      void cart.refresh();
    } catch (error) {
      console.error("[Checkout] placing the order failed", error);
      notifyApiError(error);
      restoreFocusTo.current = trigger;
    } finally {
      if (!placed) {
        placingOrder.current = false;
        setIsPlacingOrder(false);
      }
    }
  }

  if (!orderPlaced) {
    if (
      session.status === "loading" ||
      (!cart.cart && cart.status === "loading")
    ) {
      return <CheckoutSkeleton />;
    }

    if (session.status === "error" && !session.context && !isPlacingOrder) {
      return (
        <RetryAlert
          onRetry={() => {
            void retrySession();
          }}
        />
      );
    }

    if (!cart.cart && cart.status === "error") {
      return (
        <RetryAlert
          onRetry={() => {
            void cart.refresh();
          }}
        />
      );
    }

    if (cart.isEmpty) {
      return (
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center px-4 py-20">
          <h1 className="mb-6 text-lg text-surface-on-surface">
            {t("cart.emptyCartLabel")}
          </h1>
          <LocaleLink
            href="/"
            className="rounded-md bg-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-on-primary"
          >
            {t("cart.continueShopping")}
          </LocaleLink>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4">
      <h1 className="my-10 font-serif text-[40px] leading-tight text-surface-on-surface md:my-20">
        {t("checkout.title")}
      </h1>

      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
        <div className="relative w-full lg:w-1/2">
          {isPlacingOrder ? (
            <div
              className={`${OVERLAY_CLASS} flex items-center justify-center`}
            >
              <output
                className="flex flex-col items-center gap-3"
                aria-label={t("checkout.placingOrder")}
              >
                <span
                  className="size-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-surface-on-surface">
                  {t("checkout.placingOrder")}
                </span>
              </output>
            </div>
          ) : null}
          <div ref={formRef} inert={isPlacingOrder}>
            <StepHeader step={1} label={t("checkout.shippingAddressLabel")}>
              {showCustomerForm ? (
                <div className="flex flex-col">
                  <CustomerBaseInfo
                    className="mb-4"
                    email={values.email}
                    password={values.password}
                    createAccount={createAccount}
                    errors={fieldErrors}
                    onFieldChange={setField}
                    onFieldBlur={touchField}
                    onCreateAccountChange={handleCreateAccountChange}
                  />
                  <CustomerAddress
                    className="mb-4"
                    values={values}
                    errors={fieldErrors}
                    countries={countries}
                    countriesUnavailable={countriesUnavailable}
                    onFieldChange={setField}
                    onFieldBlur={touchField}
                    onCountryChange={handleCountryChange}
                  />
                </div>
              ) : chosenAddress ? (
                <CustomerAddressChosen address={chosenAddress} />
              ) : null}
            </StepHeader>
            <StepHeader step={2} label={t("checkout.steps.shipping")}>
              <ShippingMethods
                legend={t("checkout.steps.shipping")}
                shippingMethods={shippingMethods}
                selectedShippingMethod={selectedShippingMethod}
                onChange={(id) => {
                  void changeMethod("shipping", id);
                }}
              />
            </StepHeader>
            <StepHeader step={3} label={t("checkout.steps.payment")}>
              <PaymentMethods
                legend={t("checkout.steps.payment")}
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                onChange={(id) => {
                  void changeMethod("payment", id);
                }}
              />
            </StepHeader>
            <BaseButton
              data-testid="checkout-place-order-button"
              loading={isPlacingOrder}
              disabled={isUserSession && !canPlaceOrder}
              onClick={(event) => {
                void handlePlaceOrder(event);
              }}
            >
              {isPlacingOrder
                ? t("checkout.placingOrder")
                : t("checkout.placeOrderButton")}
            </BaseButton>
          </div>
        </div>
        <div className="relative w-full lg:w-1/2" inert={isPlacingOrder}>
          {isPlacingOrder ? (
            <div className={OVERLAY_CLASS} aria-hidden="true" />
          ) : null}
          {cart.cart ? <SummaryBox /> : null}
        </div>
      </div>
    </div>
  );
}
