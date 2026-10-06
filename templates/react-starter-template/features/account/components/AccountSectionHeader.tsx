import { cx } from "@shopware/cms-base-layer-react/client";

export function AccountSectionHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cx("border-b border-outline-outline pb-2", className)}>
      <h2 className="font-bold text-surface-on-surface">{title}</h2>
    </div>
  );
}
