"use client";

import { getSmallestThumbnailUrl } from "@shopware/helpers";
import { Fragment } from "react";

import type { Schemas } from "#shopware";
import { Price } from "@/components/Price";
import {
  ImageIcon,
  TagIcon,
} from "@/features/checkout/components/CheckoutIcons";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";

import { lineItemDownloads } from "../ordersApi";
import { DownloadIcon } from "./OrderIcons";

const HEADER_CELL_CLASS =
  "px-6 py-3 text-left text-xs font-medium tracking-wider text-surface-on-surface-variant uppercase";

const CELL_CLASS =
  "px-6 py-4 text-sm whitespace-nowrap text-surface-on-surface-variant";

function LineItemThumbnail({
  lineItem,
}: {
  lineItem: Schemas["OrderLineItem"];
}) {
  const contentLang = useContentLang();
  if (lineItem.type === "promotion") {
    return <TagIcon className="size-10 text-surface-on-surface" />;
  }
  if (lineItem.type !== "product") return null;
  const coverUrl = getSmallestThumbnailUrl(lineItem.cover);
  if (!coverUrl) {
    return <ImageIcon className="size-10 text-surface-on-surface-variant" />;
  }
  return (
    <img
      className="size-10 object-cover"
      src={coverUrl}
      alt={lineItem.label}
      lang={contentLang}
      loading="lazy"
    />
  );
}

export type OrderDetailLineItemsProps = {
  lineItems: Schemas["OrderLineItem"][];
  onDownload: (downloadId: string, fileName: string) => void;
};

export function OrderDetailLineItems({
  lineItems,
  onDownload,
}: OrderDetailLineItemsProps) {
  const t = useTranslations();
  const contentLang = useContentLang();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-outline-outline-variant">
        <thead className="bg-surface-surface-container-low">
          <tr>
            <th scope="col" className={HEADER_CELL_CLASS}>
              {t("account.orderDetails.itemsHeader.item")}
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              {t("account.orderDetails.itemsHeader.quantity")}
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              {t("account.orderDetails.itemsHeader.price")}
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              {t("account.orderDetails.itemsHeader.total")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-outline-variant bg-surface-surface">
          {lineItems.map((lineItem) => {
            const downloads = lineItemDownloads(lineItem);
            return (
              <Fragment key={lineItem.id}>
                <tr data-testid="order-detail-line-item">
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-surface-on-surface">
                    <div className="flex items-center gap-4">
                      <div className="size-10 shrink-0">
                        <LineItemThumbnail lineItem={lineItem} />
                      </div>
                      <span lang={contentLang}>{lineItem.label}</span>
                      {lineItem.type === "promotion" ? (
                        <span className="-ml-2 rounded-full bg-states-success-container px-2.5 py-0.5 text-xs font-medium text-states-on-success-container">
                          {t("cart.promotion")}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className={CELL_CLASS}>{lineItem.quantity}</td>
                  <td className={CELL_CLASS}>
                    <Price
                      value={lineItem.unitPrice}
                      className="font-normal text-surface-on-surface"
                      data-testid="order-item-unitprice"
                    />
                  </td>
                  <td className={CELL_CLASS}>
                    <Price
                      value={lineItem.totalPrice}
                      className="font-normal text-surface-on-surface"
                      data-testid="order-item-totalprice"
                    />
                  </td>
                </tr>
                {downloads.length > 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3">
                      <ul className="flex flex-col">
                        {downloads.map((download) => (
                          <li key={download.id}>
                            <button
                              type="button"
                              className="flex cursor-pointer gap-2 pb-3 pl-5 text-left text-surface-on-surface hover:text-brand-primary"
                              data-testid="order-item-download"
                              onClick={() =>
                                onDownload(download.id, download.fileName)
                              }
                            >
                              <DownloadIcon className="size-5" />
                              {download.fileName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
