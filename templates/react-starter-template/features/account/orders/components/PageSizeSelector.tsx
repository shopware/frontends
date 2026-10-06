"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { ChevronDownIcon } from "@/components/icons";
import { INPUT_CLASS } from "@/components/input";

const t = {
  search: {
    perPage: "Per Page:",
  },
};

export type PageSizeSelectorProps = {
  id: string;
  value: number;
  options: readonly number[];
  onChange: (size: number) => void;
  disabled?: boolean;
  className?: string;
};

export function PageSizeSelector({
  id,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <label htmlFor={id} className="text-sm text-surface-on-surface">
        {t.search.perPage}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cx(INPUT_CLASS, "appearance-none px-3 pr-8")}
          value={String(value)}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {options.map((size) => (
            <option key={size} value={String(size)}>
              {size}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-surface-on-surface-variant" />
      </div>
    </div>
  );
}
