import { cx } from "@/cms/client";

export function MainCounter({
  count,
  className,
  testId,
}: {
  count: number;
  className?: string;
  testId?: string;
}) {
  return (
    <span
      data-testid={testId}
      className={cx(
        "block size-[18px] rounded-full bg-states-error text-center text-xs leading-[18px] font-bold text-white",
        className,
      )}
    >
      {count}
    </span>
  );
}
