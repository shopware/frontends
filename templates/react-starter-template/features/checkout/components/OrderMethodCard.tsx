"use client";

import { useContentLang } from "@/i18n/ContentLanguageProvider";

export function OrderMethodCard({
  label,
  title,
  description,
}: {
  label: string;
  title?: string;
  description?: string;
}) {
  const contentLang = useContentLang();
  return (
    <div>
      <h3 className="mb-3 leading-normal font-bold text-surface-on-surface">
        {label}
      </h3>
      <div className="min-h-18 border border-outline-outline p-4">
        <div
          className="text-base leading-normal text-surface-on-surface"
          lang={contentLang}
        >
          {title}
        </div>
        {description ? (
          <div className="mt-0.5 text-sm leading-[21px] text-surface-on-surface-variant">
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
