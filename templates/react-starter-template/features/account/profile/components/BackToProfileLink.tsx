import Link from "next/link";

const t = {
  account: {
    back: "Back",
  },
};

export function BackToProfileLink() {
  return (
    <Link
      href="/account/profile"
      className="inline-flex items-center gap-1 text-sm text-brand-primary"
    >
      <span aria-hidden="true">&lt;</span>
      {t.account.back}
    </Link>
  );
}
