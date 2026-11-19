"use client";

import { useSyncExternalStore } from "react";

import { searchTermFromLocation } from "./searchTerm";

function subscribe(onChange: () => void): () => void {
  const onEntryChange = () => queueMicrotask(onChange);
  window.addEventListener("popstate", onChange);
  window.navigation?.addEventListener("currententrychange", onEntryChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.navigation?.removeEventListener("currententrychange", onEntryChange);
  };
}

function readSearchPageTerm(): string {
  return searchTermFromLocation(window.location);
}

function serverSearchPageTerm(): string {
  return "";
}

export function useSearchPageTerm(): string {
  return useSyncExternalStore(
    subscribe,
    readSearchPageTerm,
    serverSearchPageTerm,
  );
}
