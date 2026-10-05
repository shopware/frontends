"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { resolveRedirectFromSearch } from "@/features/account/redirect";
import { useSession } from "@/features/session/components/SessionProvider";

export function LoggedInRedirect() {
  const { status, isLoggedIn } = useSession();
  const router = useRouter();
  const settled = useRef(false);

  useEffect(() => {
    if (settled.current || status === "loading") return;
    settled.current = true;
    if (status !== "ready" || !isLoggedIn) return;
    router.replace(resolveRedirectFromSearch(window.location.search));
  }, [status, isLoggedIn, router]);

  return null;
}
