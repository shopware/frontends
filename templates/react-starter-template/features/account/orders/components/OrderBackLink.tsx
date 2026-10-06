import Link from "next/link";

import { ChevronLeftIcon } from "./OrderIcons";

export const ORDERS_PATH = "/account/order";

export function OrderBackLink({ label }: { label: string }) {
  return (
    <Link
      href={ORDERS_PATH}
      className="inline-flex flex-row items-center gap-1 text-sm text-surface-on-surface hover:text-brand-primary"
    >
      <ChevronLeftIcon className="size-5" />
      {label}
    </Link>
  );
}
