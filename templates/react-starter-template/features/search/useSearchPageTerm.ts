"use client";

import { useSyncExternalStore } from "react";

import { searchTermFromLocation } from "./searchTerm";

function subscribe(): () => void {
  return () => {};
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
