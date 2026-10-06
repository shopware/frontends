import { cx } from "@shopware/cms-base-layer-react/client";
import type { Ref } from "react";

const HEADING_CLASS =
  "font-serif text-[40px] leading-15 text-surface-on-surface";

const FOCUSABLE_HEADING_CLASS = `${HEADING_CLASS} focus:outline-hidden`;

export function AccountPageHeader({
  title,
  subtitle,
  className,
  headingRef,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <h1
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className={headingRef ? FOCUSABLE_HEADING_CLASS : HEADING_CLASS}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="self-stretch text-surface-on-surface">{subtitle}</p>
      ) : null}
    </div>
  );
}
