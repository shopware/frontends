import { stripLocale } from "@/i18n/config";

export type AccountMenuLink = { href: string; labelKey: string };

export const ACCOUNT_MENU_LINKS: readonly AccountMenuLink[] = [
  { href: "/account", labelKey: "account.menu.overview" },
  { href: "/account/profile", labelKey: "account.menu.yourProfile" },
  { href: "/account/address", labelKey: "account.menu.addresses" },
  { href: "/account/order", labelKey: "account.menu.orders" },
];

function withoutTrailingSlash(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isCurrentAccountPage(
  pathname: string | null,
  href: string,
): boolean {
  return (
    pathname !== null &&
    withoutTrailingSlash(stripLocale(pathname).pathname) === href
  );
}
