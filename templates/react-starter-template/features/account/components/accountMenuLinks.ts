const t = {
  "account.menu.overview": "Overview",
  "account.menu.yourProfile": "Your profile",
  "account.menu.addresses": "Addresses",
  "account.menu.orders": "Orders",
};

export type AccountMenuLink = { href: string; label: string };

export const ACCOUNT_MENU_LINKS: readonly AccountMenuLink[] = [
  { href: "/account", label: t["account.menu.overview"] },
  { href: "/account/profile", label: t["account.menu.yourProfile"] },
  { href: "/account/address", label: t["account.menu.addresses"] },
  { href: "/account/order", label: t["account.menu.orders"] },
];

function withoutTrailingSlash(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isCurrentAccountPage(
  pathname: string | null,
  href: string,
): boolean {
  return pathname !== null && withoutTrailingSlash(pathname) === href;
}
