"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import {
  checkRecoveryHash,
  isRecoveryHash,
  readRecoveryHash,
} from "./recoveryApi";
import { logRecoveryFailure } from "./recoveryErrors";
import type { RecoveryLinkProblem } from "./recoveryErrors";

export type RecoveryHashState =
  | { status: "checking" }
  | { status: "valid"; hash: string }
  | { status: RecoveryLinkProblem }
  | { status: "error" };

export type RecoveryHash = {
  state: RecoveryHashState;
  retry(): void;
  reject(problem: RecoveryLinkProblem): void;
};

const CHECKING: RecoveryHashState = { status: "checking" };

export function useRecoveryHash(): RecoveryHash {
  const getClient = useShopwareClient();
  const hash = useRef<string | null | undefined>(undefined);
  const started = useRef(false);
  const inFlight = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RecoveryHashState>(CHECKING);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (hash.current === undefined) {
      hash.current = readRecoveryHash(window.location.search);
    }
    const current = hash.current;
    if (!isRecoveryHash(current)) {
      setState({ status: "invalid" });
      return;
    }
    inFlight.current = true;
    getClient()
      .then((client) => checkRecoveryHash(client, current))
      .then(
        (status) => {
          setState(status === "valid" ? { status, hash: current } : { status });
        },
        (error: unknown) => {
          logRecoveryFailure("checking the recovery link failed", error);
          setState({ status: "error" });
        },
      )
      .finally(() => {
        inFlight.current = false;
      });
  }, [attempt, getClient]);

  const retry = useCallback(() => {
    if (inFlight.current || !started.current) return;
    started.current = false;
    setState(CHECKING);
    setAttempt((count) => count + 1);
  }, []);

  const reject = useCallback((problem: RecoveryLinkProblem) => {
    setState({ status: problem });
  }, []);

  return { state, retry, reject };
}
