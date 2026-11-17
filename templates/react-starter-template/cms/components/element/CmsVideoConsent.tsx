"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { BaseButton } from "../ui/BaseButton";
import { CmsVideoIframe } from "./CmsVideoIframe";

export type CmsVideoConsentCookieName = "youtube-video" | "vimeo-video";

export type CmsVideoConsentProps = {
  cookieName: CmsVideoConsentCookieName;
  videoUrl: string;
  iframeTitle: string;
  privacyNoticeText: string;
  acceptButtonLabel: string;
  children?: ReactNode;
};

const CONSENT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function hasConsent(cookieName: CmsVideoConsentCookieName): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((entry) => entry.startsWith(`${cookieName}=`));
}

function giveConsent(cookieName: CmsVideoConsentCookieName): void {
  document.cookie = `${cookieName}=1; max-age=${CONSENT_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
  for (const listener of listeners) listener();
}

function getServerSnapshot(): boolean {
  return false;
}

export function CmsVideoConsent({
  cookieName,
  videoUrl,
  iframeTitle,
  privacyNoticeText,
  acceptButtonLabel,
  children,
}: CmsVideoConsentProps) {
  const consented = useSyncExternalStore(
    subscribe,
    () => hasConsent(cookieName),
    getServerSnapshot,
  );

  if (consented) {
    return <CmsVideoIframe src={videoUrl} title={iframeTitle} />;
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-surface-surface-variant">
      {children}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="bg-white/90 p-4">
          <p className="mb-4">{privacyNoticeText}</p>
          <BaseButton
            variant="outline"
            size="small"
            onClick={() => giveConsent(cookieName)}
          >
            {acceptButtonLabel}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
