"use client";

import { isTimeoutError } from "@shopware/api-client";
import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { getShippingMethodDeliveryTime } from "@shopware/helpers";
import { useEffect, useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { cartResultMessages } from "@/features/cart/components/useLineItemActions";
import { useCart } from "@/features/cart/useCart";
import { getPaymentMethods } from "@/features/checkout/checkoutApi";
import { OrderAddress } from "@/features/checkout/components/OrderAddress";
import { formatOrderDate } from "@/features/checkout/components/OrderConfirmation";
import { OrderMethodCard } from "@/features/checkout/components/OrderMethodCard";
import { OrderStatus } from "@/features/checkout/components/OrderStatus";
import {
  getOrderBillingAddress,
  getOrderPaymentMethod,
  getOrderShippingAddress,
  getOrderShippingMethod,
  getOrderTotals,
} from "@/features/checkout/orderDetails";
import {
  parsePaymentUrl,
  redirectToPayment,
} from "@/features/checkout/paymentRedirect";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocale, useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import {
  documentFileName,
  handleOrderPayment,
  isOrderPaymentChangeable,
  orderPaymentReturnUrls,
  readOrderDocument,
  readOrderDownload,
  reorderItems,
  setOrderPaymentMethod,
} from "../ordersApi";
import type { OrderDetails } from "../ordersApi";
import { saveBlob } from "../saveBlob";
import { ChangePaymentModal } from "./ChangePaymentModal";
import type { PaymentMethodsLoad } from "./ChangePaymentModal";
import { OrderDetailLineItems } from "./OrderDetailLineItems";
import { OrderDocuments } from "./OrderDocuments";
import { OrderPriceSummary } from "./OrderPriceSummary";

const CART_PATH = "/checkout/cart";

function methodName(
  method: Schemas["PaymentMethod"] | Schemas["ShippingMethod"] | null,
): string | undefined {
  return method?.translated?.name || method?.name;
}

export type OrderDetailViewProps = {
  details: OrderDetails;
  onReload: () => Promise<void>;
};

export function OrderDetailView({ details, onReload }: OrderDetailViewProps) {
  const { order } = details;
  const getClient = useShopwareClient();
  const { notify } = useCmsActions();
  const { addProduct } = useCart();
  const t = useTranslations();
  const locale = useLocale();
  const localePath = useLocalePath();
  const [modalOpen, setModalOpen] = useState(false);
  const [methods, setMethods] = useState<PaymentMethodsLoad>({
    status: "loading",
  });
  const [changing, setChanging] = useState(false);
  const [reordering, setReordering] = useState(false);
  const changingRef = useRef(false);
  const reorderingRef = useRef(false);
  const methodsRequest = useRef(0);
  const onReloadRef = useRef(onReload);

  useEffect(() => {
    onReloadRef.current = onReload;
  });

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      changingRef.current = false;
      setChanging(false);
      methodsRequest.current += 1;
      setModalOpen(false);
      void onReloadRef.current();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const shippingAddress = getOrderShippingAddress(order);
  const billingAddress = getOrderBillingAddress(order);
  const shippingMethod = getOrderShippingMethod(order);
  const paymentMethod = getOrderPaymentMethod(order);
  const { subtotal, shippingCosts, total } = getOrderTotals(order);
  const deliveryTime = shippingMethod
    ? getShippingMethodDeliveryTime(shippingMethod)
    : undefined;
  const paymentChangeable = isOrderPaymentChangeable(details);
  const repeatItems = reorderItems(order);
  const orderDate = order.orderDate
    ? formatOrderDate(order.orderDate, locale)
    : "";

  function notifyErrors(error: unknown) {
    for (const message of resolveApiErrorMessages(error, t)) {
      notify({ type: "error", message });
    }
  }

  async function loadPaymentMethods() {
    const request = ++methodsRequest.current;
    setMethods({ status: "loading" });
    try {
      const client = await getClient();
      const available = await getPaymentMethods(client);
      if (request !== methodsRequest.current) return;
      setMethods({ status: "ready", methods: available });
    } catch (error) {
      if (request !== methodsRequest.current) return;
      console.error("[Account] reading the payment methods failed", error);
      setMethods({ status: "error" });
    }
  }

  function openModal() {
    setModalOpen(true);
    void loadPaymentMethods();
  }

  function closeModal() {
    methodsRequest.current += 1;
    setModalOpen(false);
  }

  async function changePaymentMethod(paymentMethodId: string) {
    if (changingRef.current) return;
    const returnUrls = orderPaymentReturnUrls(
      window.location.origin,
      order.id,
      localePath,
    );
    if (!returnUrls) {
      notify({ type: "error", message: t("messages.error") });
      return;
    }
    changingRef.current = true;
    setChanging(true);
    let redirecting = false;
    try {
      const client = await getClient();
      try {
        await setOrderPaymentMethod(client, {
          orderId: order.id,
          paymentMethodId,
        });
      } catch (error) {
        console.error("[Account] changing the payment method failed", error);
        notifyErrors(error);
        if (isTimeoutError(error)) void onReload();
        return;
      }

      let paymentUrl: string | null = null;
      let paymentFailed = false;
      try {
        const { redirectUrl } = await handleOrderPayment(client, {
          orderId: order.id,
          ...returnUrls,
        });
        paymentUrl = parsePaymentUrl(redirectUrl);
      } catch (error) {
        console.error("[Account] handling the payment failed", error);
        paymentFailed = true;
        notifyErrors(error);
      }

      if (paymentUrl) {
        redirecting = true;
        redirectToPayment(paymentUrl);
        return;
      }
      if (!paymentFailed) {
        notify({
          type: "success",
          message: t("account.messages.paymentMethodChanged"),
        });
      }
      closeModal();
      await onReload();
    } catch (error) {
      console.error("[Account] changing the payment method failed", error);
      notifyErrors(error);
    } finally {
      if (!redirecting) {
        changingRef.current = false;
        setChanging(false);
      }
    }
  }

  async function repeatOrder() {
    if (reorderingRef.current || repeatItems.length === 0) return;
    reorderingRef.current = true;
    setReordering(true);
    try {
      const messages = new Set<string>();
      let added = false;
      for (const item of repeatItems) {
        const result = await addProduct(item);
        if (result.ok) added = true;
        for (const message of cartResultMessages(result, t))
          messages.add(message);
      }
      for (const message of messages) notify({ type: "error", message });
      if (added) {
        notify({
          type: "success",
          message: t("account.messages.productsAdded"),
          action: { label: t("product.viewCart"), href: localePath(CART_PATH) },
        });
      }
    } finally {
      reorderingRef.current = false;
      setReordering(false);
    }
  }

  async function downloadFile(downloadId: string, fileName: string) {
    try {
      const client = await getClient();
      const file = await readOrderDownload(client, {
        orderId: order.id,
        downloadId,
      });
      saveBlob(file, fileName);
    } catch (error) {
      console.error("[Account] downloading the file failed", error);
      notifyErrors(error);
    }
  }

  async function downloadDocument(document: Schemas["Document"]) {
    try {
      const client = await getClient();
      const file = await readOrderDocument(client, {
        documentId: document.id,
        deepLinkCode: document.deepLinkCode,
      });
      saveBlob(file, documentFileName(document));
    } catch (error) {
      console.error("[Account] downloading the document failed", error);
      notifyErrors(error);
    }
  }

  return (
    <div data-testid="account-order-details">
      <div className="mb-6 flex flex-col justify-between sm:flex-row">
        {orderDate ? (
          <p className="text-sm text-surface-on-surface-variant">
            {t("account.orderDetails.placedOn", { d: orderDate })}
          </p>
        ) : (
          <span />
        )}
        {order.stateMachineState ? (
          <div className="mt-4 sm:mt-0">
            <OrderStatus state={order.stateMachineState} />
          </div>
        ) : null}
      </div>

      <OrderDetailLineItems
        lineItems={order.lineItems ?? []}
        onDownload={(downloadId, fileName) => {
          void downloadFile(downloadId, fileName);
        }}
      />

      <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row">
        {shippingAddress ? (
          <OrderAddress
            address={shippingAddress}
            label={t("account.orderDetails.shippingAddress")}
          />
        ) : null}
        {billingAddress ? (
          <OrderAddress
            address={billingAddress}
            label={t("account.orderDetails.billingAddress")}
          />
        ) : null}
        <OrderPriceSummary
          subtotal={subtotal}
          shippingCosts={shippingCosts}
          total={total}
        />
      </div>

      <OrderDocuments
        className="mt-8"
        documents={order.documents ?? []}
        onDownload={(document) => {
          void downloadDocument(document);
        }}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {shippingMethod ? (
          <OrderMethodCard
            label={t("account.orderDetails.shippingMethod")}
            title={methodName(shippingMethod)}
            description={
              deliveryTime
                ? `${t("checkout.takesUpTo")} ${deliveryTime}`
                : undefined
            }
          />
        ) : null}
        {paymentMethod ? (
          <div>
            <OrderMethodCard
              label={t("account.orderDetails.paymentMethod")}
              title={methodName(paymentMethod)}
            />
            {paymentChangeable ? (
              <BaseButton
                size="small"
                className="mt-3"
                aria-haspopup="dialog"
                aria-label={t("account.orderDetails.changePaymentMethod")}
                data-testid="order-change-payment-button"
                onClick={openModal}
              >
                {t("account.orderDetails.change")}
              </BaseButton>
            ) : null}
          </div>
        ) : null}
      </div>

      {repeatItems.length > 0 ? (
        <BaseButton
          className="mt-8"
          variant="outline"
          data-testid="order-repeat-button"
          loading={reordering}
          onClick={() => {
            void repeatOrder();
          }}
        >
          {t("account.order.repeatOrder")}
        </BaseButton>
      ) : null}

      <ChangePaymentModal
        open={modalOpen}
        methods={methods}
        currentPaymentMethodId={paymentMethod?.id ?? null}
        busy={changing}
        onClose={closeModal}
        onConfirm={(paymentMethodId) => {
          void changePaymentMethod(paymentMethodId);
        }}
      />
    </div>
  );
}
