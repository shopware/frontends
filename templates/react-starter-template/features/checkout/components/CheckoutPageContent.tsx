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
import { useRequestLogin } from "@/features/account/components/LoginModal";
import { useCartLoadNotices } from "@/features/cart/components/useCartLoadNotices";
import { useCartRefresh } from "@/features/cart/components/useCartRefresh";
import { useCart } from "@/features/cart/useCart";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import { activeCheckoutAddresses } from "../checkoutAddresses";
import type { AddressKind } from "../checkoutAddresses";
import {
  createOrder,
  getPaymentMethods,
  getShippingMethods,
  isAmbiguousOrderFailure,
  setContextAddress,
  setPaymentMethod,
  setShippingMethod,
  toOrderBody,
  updateCustomerDetails,
} from "../checkoutApi";
import type { CheckoutClient } from "../checkoutApi";
import {
  emptyCheckoutAddressValues,
  emptyCheckoutValues,
  toCheckoutAddressFields,
  toCheckoutRegistration,
  validateCheckout,
  validateCheckoutAddress,
} from "../checkoutSchema";
import type {
  CheckoutAddressField,
  CheckoutAddressValues,
  CheckoutField,
  CheckoutValues,
} from "../checkoutSchema";
import type { CheckoutSettings } from "../checkoutSettings";
import {
  emptyCheckoutTerms,
  hasDigitalLineItem,
  validateCheckoutTerms,
} from "../checkoutTerms";
import type {
  CheckoutTermsField,
  CheckoutTermsRequirements,
  CheckoutTermsValues,
} from "../checkoutTerms";
import { CheckoutAddresses } from "./CheckoutAddresses";
import type { PendingAddressChange } from "./CheckoutAddresses";
import { CheckoutSignInPrompt } from "./CheckoutSignInPrompt";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { CheckoutTerms } from "./CheckoutTerms";
import { CustomerAddress } from "./CustomerAddress";
import { CustomerBaseInfo } from "./CustomerBaseInfo";
import { CustomerComment } from "./CustomerComment";
import { DifferentShippingAddress } from "./DifferentShippingAddress";
import { PaymentMethods } from "./PaymentMethods";
import { ShippingMethods } from "./ShippingMethods";
import { StepHeader } from "./StepHeader";
import { SummaryBox } from "./SummaryBox";

const OVERLAY_CLASS =
  "absolute inset-0 z-10 cursor-wait bg-surface-surface/70 backdrop-blur-[1px]";

type Touched<Field extends string> = Partial<Record<Field, boolean>>;

type MethodKind = "shipping" | "payment";

export type CheckoutPageContentProps = {
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  settings: CheckoutSettings;
};

function visibleErrors<Field extends string>(
  errors: Partial<Record<Field, string>>,
  touched: Touched<Field>,
  submitted: boolean,
): Partial<Record<Field, string>> {
  const visible: Partial<Record<Field, string>> = {};
  for (const field of Object.keys(errors) as Field[]) {
    if (submitted || touched[field]) visible[field] = errors[field];
  }
  return visible;
}

function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}

function statesOf(countries: CountryOption[], countryId: string) {
  return countries.find((country) => country.id === countryId)?.states ?? [];
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
  settings,
}: CheckoutPageContentProps) {
  const router = useRouter();
  const session = useSession();
  const { register, refreshSession, retrySession } = useSessionActions();
  const { notify } = useCmsActions();
  const getClient = useShopwareClient();
  const requestLogin = useRequestLogin();
  const cart = useCart();
  useCartLoadNotices();
  const refreshCart = useCartRefresh();
  const t = useTranslations();
  const localePath = useLocalePath();

  const [values, setValues] = useState<CheckoutValues>(emptyCheckoutValues);
  const [createAccount, setCreateAccount] = useState(false);
  const [touched, setTouched] = useState<Touched<CheckoutField>>({});
  const [differentShipping, setDifferentShipping] = useState(false);
  const [shippingValues, setShippingValues] = useState<CheckoutAddressValues>(
    emptyCheckoutAddressValues,
  );
  const [shippingTouched, setShippingTouched] = useState<
    Touched<CheckoutAddressField>
  >({});
  const [terms, setTerms] = useState<CheckoutTermsValues>(emptyCheckoutTerms);
  const [customerComment, setCustomerComment] = useState("");
  const [pendingAddress, setPendingAddress] =
    useState<PendingAddressChange | null>(null);
  const [addressUnconfirmed, setAddressUnconfirmed] = useState(false);
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
  const [headingFocusRequest, setHeadingFocusRequest] = useState(0);
  const placingOrder = useRef(false);
  const changingAddress = useRef(false);
  const registered = useRef(false);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const createdShippingAddress = useRef<{
    customerId: string;
    address: Schemas["CustomerAddress"];
  } | null>(null);
  const methodChanges = useRef<Record<MethodKind, number>>({
    shipping: 0,
    payment: 0,
  });
  const formRef = useRef<HTMLDivElement>(null);

  const context = session.context;
  const customer = context?.customer ?? null;
  const isUserSession = session.isLoggedIn || session.isGuestSession;
  const showCustomerForm = !isUserSession || registeredDuringCheckout;
  const showSignIn = !session.isLoggedIn && !registeredDuringCheckout;
  const selectedShippingMethod =
    pendingShippingMethod ?? context?.shippingMethod?.id ?? null;
  const selectedPaymentMethod =
    pendingPaymentMethod ?? context?.paymentMethod?.id ?? null;
  const canPlaceOrder = Boolean(
    selectedShippingMethod && selectedPaymentMethod,
  );

  if (addressUnconfirmed && session.status === "ready") {
    setAddressUnconfirmed(false);
  }

  const errors = validateCheckout(
    values,
    {
      createAccount,
      countryHasStates: statesOf(countries, values.countryId).length > 0,
      passwordMinLength: settings.passwordMinLength,
    },
    t,
  );
  const fieldErrors = visibleErrors(errors, touched, submitted);
  const shippingErrors =
    showCustomerForm && differentShipping
      ? validateCheckoutAddress(
          shippingValues,
          {
            countryHasStates:
              statesOf(countries, shippingValues.countryId).length > 0,
          },
          t,
        )
      : {};
  const shippingFieldErrors = visibleErrors(
    shippingErrors,
    shippingTouched,
    submitted,
  );
  const termsRequirements: CheckoutTermsRequirements = {
    revocation: hasDigitalLineItem(cart.lineItems),
    dataProtection: showCustomerForm && settings.requireDataProtectionCheckbox,
  };
  const termsErrors = validateCheckoutTerms(terms, termsRequirements, t);

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
    if (headingFocusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>("#checkout-step-1-heading")
      ?.focus();
  }, [headingFocusRequest]);

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

  const setShippingField = useCallback(
    (field: CheckoutAddressField, value: string) => {
      setShippingValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const touchShippingField = useCallback((field: CheckoutAddressField) => {
    setShippingTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }, []);

  const handleShippingCountryChange = useCallback((countryId: string) => {
    setShippingValues((current) =>
      current.countryId === countryId
        ? current
        : { ...current, countryId, countryStateId: "" },
    );
  }, []);

  const setTerm = useCallback((field: CheckoutTermsField, checked: boolean) => {
    setTerms((current) => ({ ...current, [field]: checked }));
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

  function notifyContextChangeError(error: unknown) {
    for (const message of resolveApiErrorMessages(error, t)) {
      notify({ type: "error", message });
    }
  }

  async function refreshAfterContextChange() {
    await Promise.allSettled([refreshSession(), refreshCart()]);
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
      await refreshAfterContextChange();
    } catch (error) {
      notifyContextChangeError(error);
    } finally {
      if (methodChanges.current[kind] === change) setPending(null);
    }
  }

  async function changeAddress(
    kind: AddressKind,
    addressId: string,
  ): Promise<boolean> {
    if (changingAddress.current) return false;
    changingAddress.current = true;
    setPendingAddress({ kind, id: addressId });
    try {
      await setContextAddress(await getClient(), kind, addressId);
      await refreshAfterContextChange();
      const next = await retrySession();
      await reloadMethods();
      const confirmed =
        next.status === "ready" &&
        activeCheckoutAddresses(next.context?.customer ?? {})[kind]?.id ===
          addressId;
      setAddressUnconfirmed(!confirmed);
      if (!confirmed) {
        notifyPersistentError(t("checkout.addresses.changeUnconfirmed"));
      }
      return confirmed;
    } catch (error) {
      notifyContextChangeError(error);
      return false;
    } finally {
      changingAddress.current = false;
      setPendingAddress(null);
    }
  }

  async function handleSignIn() {
    if (!(await requestLogin())) return;
    setHeadingFocusRequest((count) => count + 1);
    await reloadMethods();
  }

  async function registerCustomer(): Promise<boolean> {
    setRegisteredDuringCheckout(true);
    const result = await register(
      toCheckoutRegistration(values, {
        createAccount,
        acceptedDataProtection:
          termsRequirements.dataProtection && terms.dataProtection,
        shippingAddress: differentShipping ? shippingValues : null,
      }),
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
    const customerId = currentCustomer?.id ?? null;
    const created = createdShippingAddress.current;
    try {
      await updateCustomerDetails(await getClient(), {
        customer: currentCustomer,
        address: toCheckoutAddressFields(values),
        shippingAddress: differentShipping
          ? toCheckoutAddressFields(shippingValues)
          : null,
        createdShippingAddress:
          created && created.customerId === customerId ? created.address : null,
        onShippingAddressCreated: (address) => {
          if (customerId) {
            createdShippingAddress.current = { customerId, address };
          }
        },
      });
    } catch (error) {
      notifyApiError(error);
      return false;
    }
    await Promise.all([refreshSession(), refreshCart()]);
    await reloadMethods();
    return true;
  }

  async function handlePlaceOrder(event: MouseEvent<HTMLButtonElement>) {
    if (placingOrder.current || changingAddress.current) return;
    const trigger = event.currentTarget;
    const formShown = showCustomerForm;

    setSubmitted(true);
    if (
      hasErrors(termsErrors) ||
      (formShown && (hasErrors(errors) || hasErrors(shippingErrors)))
    ) {
      setFocusRequest((count) => count + 1);
      return;
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
        order = await createOrder(
          client,
          toOrderBody(settings.showCustomerComment ? customerComment : ""),
        );
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
            <StepHeader step={1} label={t("account.yourAddress")}>
              {showSignIn ? (
                <CheckoutSignInPrompt
                  className="mb-4"
                  onSignIn={() => {
                    void handleSignIn();
                  }}
                />
              ) : null}
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
                  <DifferentShippingAddress
                    checked={differentShipping}
                    onCheckedChange={setDifferentShipping}
                    values={shippingValues}
                    errors={shippingFieldErrors}
                    countries={countries}
                    countriesUnavailable={countriesUnavailable}
                    onFieldChange={setShippingField}
                    onFieldBlur={touchShippingField}
                    onCountryChange={handleShippingCountryChange}
                  />
                </div>
              ) : customer ? (
                <CheckoutAddresses
                  key={customer.id}
                  customer={customer}
                  pending={pendingAddress}
                  canAddAddress={session.isLoggedIn}
                  onSelect={changeAddress}
                />
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
            {settings.showCustomerComment ? (
              <CustomerComment
                className="mb-10"
                value={customerComment}
                onChange={setCustomerComment}
              />
            ) : null}
            <CheckoutTerms
              values={terms}
              errors={submitted ? termsErrors : {}}
              requirements={termsRequirements}
              legalLinks={settings.legalLinks}
              onChange={setTerm}
            />
            <BaseButton
              data-testid="checkout-place-order-button"
              loading={isPlacingOrder}
              disabled={
                (isUserSession && !canPlaceOrder) ||
                pendingAddress !== null ||
                addressUnconfirmed
              }
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
