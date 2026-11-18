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
    if (settled.current || status !== "ready") return;
    settled.current = true;
    if (!isLoggedIn) return;
    router.replace(resolveRedirectFromSearch(window.location.search));
  }, [status, isLoggedIn, router]);

  useEffect(
    () => () => {
      settled.current = false;
    },
    [],
  );

  return null;
}
