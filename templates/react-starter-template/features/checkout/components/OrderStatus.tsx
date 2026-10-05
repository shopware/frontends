import { cx } from "@shopware/cms-base-layer-react/client";

import type { Schemas } from "#shopware";

const STATUS_CLASSES: Record<string, string> = {
  completed: "bg-states-success-container text-states-on-success-container",
  open: "bg-states-warning-container text-states-on-warning-container",
  in_progress: "bg-states-warning-container text-states-on-warning-container",
  cancelled: "bg-states-error-container text-states-on-error-container",
};

const DEFAULT_STATUS_CLASS =
  "bg-surface-surface-container text-surface-on-surface-variant";

export type OrderStatusState = Pick<
  Schemas["StateMachineState"],
  "name" | "technicalName"
> & { translated?: { name?: string } };

export function OrderStatus({ state }: { state: OrderStatusState }) {
  const name = state.translated?.name || state.name || state.technicalName;
  return (
    <span
      className={cx(
        "inline-flex rounded px-2 py-1 text-xs leading-5 font-semibold",
        STATUS_CLASSES[state.technicalName] ?? DEFAULT_STATUS_CLASS,
      )}
      data-testid="order-status"
    >
      {name}
    </span>
  );
}
