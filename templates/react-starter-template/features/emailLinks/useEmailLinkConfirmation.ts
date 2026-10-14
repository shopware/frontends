"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import type { ConfirmOnce } from "./confirmOnce";
import { readEmailLinkParams } from "./emailLinkParams";
import type { EmailLinkParams } from "./emailLinkParams";

export type EmailLinkState<R> =
  | { phase: "pending" }
  | { phase: "settled"; result: R; retrying: boolean };

export type EmailLinkConfirmationOptions<R> = {
  once: ConfirmOnce<R>;
  confirm: (link: EmailLinkParams) => Promise<R>;
  invalid: R;
  failed: R;
  ready?: boolean;
  focusAfterRetry?: RefObject<HTMLElement | null>;
};

export type EmailLinkConfirmation<R> = {
  state: EmailLinkState<R>;
  retry: () => void;
};

const PENDING = { phase: "pending" } as const;

export function useEmailLinkConfirmation<R extends { status: string }>({
  once,
  confirm,
  invalid,
  failed,
  ready = true,
  focusAfterRetry,
}: EmailLinkConfirmationOptions<R>): EmailLinkConfirmation<R> {
  const link = useRef<EmailLinkParams | null | undefined>(undefined);
  const settledAttempt = useRef<number | null>(null);
  const retrying = useRef(false);
  const retryEnding = useRef(false);
  const [state, setState] = useState<EmailLinkState<R>>(PENDING);
  const [armed, setArmed] = useState(ready);
  const [attempt, setAttempt] = useState(0);

  if (ready && !armed) setArmed(true);

  useEffect(() => {
    if (settledAttempt.current === attempt) return;
    if (link.current === undefined) {
      link.current = readEmailLinkParams(window.location.search);
    }
    const current = link.current;
    if (!current) {
      settledAttempt.current = attempt;
      setState({ phase: "settled", result: invalid, retrying: false });
      return;
    }
    if (!armed) return;
    void once
      .run(current.hash, () => confirm(current))
      .catch(() => failed)
      .then((result) => {
        settledAttempt.current = attempt;
        retrying.current = false;
        setState((previous) =>
          previous.phase === "settled" &&
          previous.result === result &&
          !previous.retrying
            ? previous
            : { phase: "settled", result, retrying: false },
        );
      });
  }, [armed, attempt, once, confirm, invalid, failed]);

  useEffect(() => {
    const retryEnded = retryEnding.current;
    retryEnding.current = state.phase === "settled" && state.retrying;
    if (!retryEnded || state.phase !== "settled" || state.retrying) return;
    if (state.result.status === "failed") return;
    const focused = document.activeElement;
    if (focused && focused !== document.body) return;
    focusAfterRetry?.current?.focus();
  }, [state, focusAfterRetry]);

  const retry = useCallback(() => {
    if (retrying.current || !link.current) return;
    retrying.current = true;
    setState((previous) =>
      previous.phase === "settled" ? { ...previous, retrying: true } : previous,
    );
    setAttempt((count) => count + 1);
  }, []);

  return { state, retry };
}
