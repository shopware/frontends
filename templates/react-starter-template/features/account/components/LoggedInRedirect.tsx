"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { resolveRedirectFromSearch } from "@/features/account/redirect";
import { useSession } from "@/features/session/components/SessionProvider";
import { useLocalePath } from "@/i18n/I18nProvider";

export function LoggedInRedirect() {
  const { status, isLoggedIn } = useSession();
  const router = useRouter();
  const localePath = useLocalePath();
  const settled = useRef(false);

  useEffect(() => {
    if (settled.current || status === "loading") return;
    settled.current = true;
    if (status !== "ready" || !isLoggedIn) return;
    router.replace(
      localePath(resolveRedirectFromSearch(window.location.search)),
    );
  }, [status, isLoggedIn, router, localePath]);

  return null;
}
