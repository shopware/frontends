import type { RegistrationConfirmResult } from "@/features/session/registrationConfirm";

import type { NewsletterConfirmResult } from "./newsletterConfirm";

export type ConfirmOnce<R> = {
  run(key: string, confirm: () => Promise<R>): Promise<R>;
  clear(): void;
};

export function createConfirmOnce<
  R extends { status: string },
>(): ConfirmOnce<R> {
  const runs = new Map<string, Promise<R>>();
  return {
    run(key, confirm) {
      const known = runs.get(key);
      if (known) return known;
      const pending = confirm().then(
        (result) => {
          if (result.status === "failed" && runs.get(key) === pending) {
            runs.delete(key);
          }
          return result;
        },
        (error: unknown) => {
          if (runs.get(key) === pending) runs.delete(key);
          throw error;
        },
      );
      runs.set(key, pending);
      return pending;
    },
    clear() {
      runs.clear();
    },
  };
}

export const registrationConfirmations =
  createConfirmOnce<RegistrationConfirmResult>();

export const newsletterConfirmations =
  createConfirmOnce<NewsletterConfirmResult>();
