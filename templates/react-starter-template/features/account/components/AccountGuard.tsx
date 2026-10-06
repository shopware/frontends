"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import { takeLogoutIntent } from "./useAccountLogout";

const LOGIN_PATH = "/account/login";

const PLACEHOLDER = "rounded bg-surface-surface-container";

export function AccountGuardSkeleton() {
  const t = useTranslations();
  return (
    <div
      aria-busy="true"
      data-testid="account-guard-skeleton"
      className="animate-pulse"
    >
      <output className="sr-only">{t("form.loading")}</output>
      <div className="mb-14 flex flex-col gap-2">
        <div className={`h-15 w-2/3 max-w-md ${PLACEHOLDER}`} />
        <div className={`h-6 w-full max-w-xl ${PLACEHOLDER}`} />
      </div>
      {[0, 1].map((section) => (
        <div key={section} className="mb-10">
          <div className="mb-4 border-b border-outline-outline-variant pb-2">
            <div className={`h-6 w-40 ${PLACEHOLDER}`} />
          </div>
          <div className="flex flex-col gap-2">
            <div className={`h-6 w-48 ${PLACEHOLDER}`} />
            <div className={`h-6 w-64 ${PLACEHOLDER}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccountGuard({ children }: { children: ReactNode }) {
  const { status, isLoggedIn } = useSession();
  const { retrySession } = useSessionActions();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const localePath = useLocalePath();
  const router = useRouter();
  const admitted = useRef(false);
  const redirected = useRef(false);

  useEffect(() => {
    takeLogoutIntent();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (isLoggedIn) {
      admitted.current = true;
      redirected.current = false;
      return;
    }
    const loggedOutHere = admitted.current && takeLogoutIntent();
    admitted.current = false;
    if (loggedOutHere) {
      redirected.current = true;
      return;
    }

    let active = true;
    const redirect = () => {
      if (!active || redirected.current) return;
      redirected.current = true;
      notify({ type: "info", message: t("account.messages.loginRequired") });
      const { pathname, search } = window.location;
      router.replace(
        `${localePath(LOGIN_PATH)}?redirect=${encodeURIComponent(`${pathname}${search}`)}`,
      );
    };

    if (status === "ready") {
      redirect();
    } else {
      retrySession().then((session) => {
        if (!session.isLoggedIn) redirect();
      }, redirect);
    }

    return () => {
      active = false;
    };
  }, [status, isLoggedIn, notify, retrySession, router, t, localePath]);

  if (status === "loading" || !isLoggedIn) return <AccountGuardSkeleton />;
  return children;
}
