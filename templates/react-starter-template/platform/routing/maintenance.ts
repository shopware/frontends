import { isMaintenanceMode } from "@shopware/helpers";

export type WaitUntil = (promise: Promise<unknown>) => void;

export type MaintenanceMonitor = {
  isActive(waitUntil?: WaitUntil): Promise<boolean>;
  report(active: boolean): void;
};

export const MAINTENANCE_CHECK_TTL_MS = 30_000;

export function isMaintenanceError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { status, details } = error as {
    status?: unknown;
    details?: { errors?: unknown };
  };
  const errors = details?.errors;
  return (
    status === 503 &&
    Array.isArray(errors) &&
    isMaintenanceMode(errors as { code?: string }[])
  );
}

export function createMaintenanceMonitor({
  probe,
  now = Date.now,
  ttlMs = MAINTENANCE_CHECK_TTL_MS,
}: {
  probe: () => Promise<boolean>;
  now?: () => number;
  ttlMs?: number;
}): MaintenanceMonitor {
  let known: { active: boolean; checkedAt: number } | null = null;
  let pending: Promise<boolean> | null = null;

  function check(): Promise<boolean> {
    if (!pending) {
      const run = probe()
        .catch(() => false)
        .then((active) => {
          known = { active, checkedAt: now() };
          return active;
        })
        .finally(() => {
          if (pending === run) pending = null;
        });
      pending = run;
    }
    return pending;
  }

  return {
    async isActive(waitUntil) {
      if (!known) return check();
      if (now() - known.checkedAt >= ttlMs) waitUntil?.(check());
      return known.active;
    },
    report(active) {
      known = { active, checkedAt: now() };
    },
  };
}
