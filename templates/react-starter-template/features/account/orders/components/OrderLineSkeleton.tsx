import { cx } from "@shopware/cms-base-layer-react/client";

const BAR = "rounded bg-surface-on-surface/10";

const COLUMNS = [0, 1, 2, 3];

export function OrderLineSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse border border-outline-outline p-4",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-outline-outline pb-2">
        <div className={cx("h-6 w-40", BAR)} />
        <div className={cx("h-7 w-24", BAR)} />
      </div>

      <div className="mt-4 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column}>
            <div className="border-b border-outline-outline-variant p-4">
              <div className={cx("h-6 w-2/3", BAR)} />
            </div>
            <div className="p-4">
              <div className={cx("h-6 w-1/2", BAR)} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-2">
        <div className={cx("h-5 w-28", BAR)} />
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <div className={cx("h-5 w-20", BAR)} />
          <div className={cx("h-5 w-16", BAR)} />
        </div>
        <div className="flex justify-between">
          <div className={cx("h-5 w-24", BAR)} />
          <div className={cx("h-5 w-16", BAR)} />
        </div>
        <div className="mt-2 flex justify-between border-t border-outline-outline-variant pt-2">
          <div className={cx("h-6 w-16", BAR)} />
          <div className={cx("h-6 w-20", BAR)} />
        </div>
      </div>
    </div>
  );
}
