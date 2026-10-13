"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import { Modal } from "@/components/Modal";
import { useTranslations } from "@/i18n/I18nProvider";

import { LoginForm } from "./LoginForm";

export type RequestLogin = () => Promise<boolean>;

type LoginModalControl = {
  open: boolean;
  requestLogin: RequestLogin;
  settle(loggedIn: boolean): void;
};

const noLoginModal: LoginModalControl = {
  open: false,
  requestLogin: async () => false,
  settle: () => {},
};

const LoginModalContext = createContext<LoginModalControl>(noLoginModal);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pending = useRef<{
    promise: Promise<boolean>;
    resolve: (loggedIn: boolean) => void;
  } | null>(null);

  const settle = useCallback((loggedIn: boolean) => {
    const request = pending.current;
    pending.current = null;
    setOpen(false);
    request?.resolve(loggedIn);
  }, []);

  const requestLogin = useCallback<RequestLogin>(() => {
    if (pending.current) return pending.current.promise;
    let resolve: (loggedIn: boolean) => void = () => {};
    const promise = new Promise<boolean>((settleRequest) => {
      resolve = settleRequest;
    });
    pending.current = { promise, resolve };
    setOpen(true);
    return promise;
  }, []);

  useEffect(() => () => pending.current?.resolve(false), []);

  const control = useMemo(
    () => ({ open, requestLogin, settle }),
    [open, requestLogin, settle],
  );

  return <LoginModalContext value={control}>{children}</LoginModalContext>;
}

export function useRequestLogin(): RequestLogin {
  return useContext(LoginModalContext).requestLogin;
}

function CloseOnNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const openedAt = useRef(pathname);

  useEffect(() => {
    if (pathname !== openedAt.current) onNavigate();
  }, [pathname, onNavigate]);

  return null;
}

export function LoginModal() {
  const t = useTranslations();
  const { open, settle } = useContext(LoginModalContext);
  const close = useCallback(() => settle(false), [settle]);
  const loggedIn = useCallback(() => settle(true), [settle]);

  return (
    <Modal
      open={open}
      title={t("loginForm.header")}
      closeLabel={t("account.loginModal.close")}
      onClose={close}
    >
      <LoginForm idPrefix="login-modal" hideHeading onLoggedIn={loggedIn} />
      <BaseButton variant="ghost" block className="mt-3" onClick={close}>
        {t("account.loginModal.close")}
      </BaseButton>
      <CloseOnNavigation onNavigate={close} />
    </Modal>
  );
}
