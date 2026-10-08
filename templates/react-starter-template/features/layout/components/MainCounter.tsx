import { cx } from "@shopware/cms-base-layer-react/client";

export function MainCounter({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "block size-[18px] rounded-full bg-shell-accent text-center text-xs leading-[18px] font-bold text-shell-on-accent",
        className,
      )}
    >
      {count}
    </span>
  );
}
