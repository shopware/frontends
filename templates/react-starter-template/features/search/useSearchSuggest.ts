"use client";

import { useCallback, useRef, useState } from "react";

import { apiFailureSummary } from "@/features/session/apiErrors";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { readSearchSuggest } from "./searchSuggestApi";
import type { SearchSuggestResult } from "./searchSuggestApi";
import { SUGGEST_DEBOUNCE_MS, isSearchable } from "./searchTerm";

export type SearchSuggestState =
  | { status: "idle" }
  | { status: "loading"; term: string; previous: SearchSuggestResult | null }
  | { status: "ready"; term: string; result: SearchSuggestResult }
  | { status: "error"; term: string };

export type SearchSuggestRequestOptions = { immediate?: boolean };

const IDLE: SearchSuggestState = { status: "idle" };

function lastResult(state: SearchSuggestState): SearchSuggestResult | null {
  if (state.status === "ready") return state.result;
  if (state.status === "loading") return state.previous;
  return null;
}

export function useSearchSuggest(): {
  state: SearchSuggestState;
  request(term: string, options?: SearchSuggestRequestOptions): void;
} {
  const getClient = useShopwareClient();
  const [state, setState] = useState<SearchSuggestState>(IDLE);
  const stateRef = useRef<SearchSuggestState>(IDLE);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);

  const update = useCallback((next: SearchSuggestState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const cancel = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    controller.current?.abort();
    controller.current = null;
    sequence.current += 1;
  }, []);

  const run = useCallback(
    (term: string) => {
      timer.current = null;
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      sequence.current += 1;
      const id = sequence.current;
      void (async () => {
        try {
          const client = await getClient();
          const result = await readSearchSuggest(client, term, current.signal);
          if (id !== sequence.current) return;
          controller.current = null;
          update({ status: "ready", term, result });
        } catch (error) {
          if (id !== sequence.current) return;
          controller.current = null;
          console.error(
            "[Search] reading the suggestions failed",
            apiFailureSummary(error),
          );
          update({ status: "error", term });
        }
      })();
    },
    [getClient, update],
  );

  const request = useCallback(
    (term: string, options: SearchSuggestRequestOptions = {}) => {
      if (!isSearchable(term)) {
        cancel();
        if (stateRef.current.status !== "idle") update(IDLE);
        return;
      }
      const current = stateRef.current;
      if (current.status === "ready" && current.term === term) return;
      if (current.status === "loading" && current.term === term) {
        if (!options.immediate || timer.current === null) return;
        clearTimeout(timer.current);
        run(term);
        return;
      }
      cancel();
      update({ status: "loading", term, previous: lastResult(current) });
      if (options.immediate) {
        run(term);
        return;
      }
      timer.current = setTimeout(() => run(term), SUGGEST_DEBOUNCE_MS);
    },
    [cancel, run, update],
  );

  return { state, request };
}
