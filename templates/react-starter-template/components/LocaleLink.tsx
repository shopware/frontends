"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useLocalePath } from "@/i18n/I18nProvider";

export type LocaleLinkProps = ComponentProps<typeof Link>;

export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const localePath = useLocalePath();
  const localizedHref =
    typeof href === "string"
      ? localePath(href)
      : typeof href.pathname === "string"
        ? { ...href, pathname: localePath(href.pathname) }
        : href;
  return <Link {...props} href={localizedHref} />;
}
