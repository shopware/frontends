import { afterEach, describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import {
  SessionActionsProvider,
  notImplementedSessionActions,
  useSessionActions,
} from "./SessionActionsContext";
import type { SessionActions } from "./SessionActionsContext";

const ACTION_NAMES: (keyof SessionActions)[] = ["login", "register", "logout"];

function WiredActions() {
  const actions = useSessionActions();
  const wired = ACTION_NAMES.filter(
    (name) => actions[name] !== notImplementedSessionActions[name],
  );
  return <p data-testid="wired-actions">{wired.join(",") || "none"}</p>;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SessionActionsProvider", () => {
  it("merges the given actions over the stubs", async () => {
    const login = vi.fn(async () => ({ ok: true }));

    const html = await renderToHtml(
      <SessionActionsProvider actions={{ login }}>
        <WiredActions />
      </SessionActionsProvider>,
    );

    expect(html).toContain('<p data-testid="wired-actions">login</p>');
  });

  it("keeps every given action and only fills in the missing ones", async () => {
    const login = vi.fn(async () => ({ ok: true }));
    const logout = vi.fn(async () => ({ ok: true }));

    const html = await renderToHtml(
      <SessionActionsProvider actions={{ login, logout }}>
        <WiredActions />
      </SessionActionsProvider>,
    );

    expect(html).toContain('<p data-testid="wired-actions">login,logout</p>');
  });

  it("falls back to the stubs for a consumer without a provider", async () => {
    const html = await renderToHtml(<WiredActions />);

    expect(html).toContain('<p data-testid="wired-actions">none</p>');
  });
});

describe("notImplementedSessionActions", () => {
  it("resolves { ok: false } and warns once per call", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      notImplementedSessionActions.login({
        username: "jane@example.com",
        password: "secret",
      }),
    ).resolves.toEqual({ ok: false });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('"login"');

    await expect(notImplementedSessionActions.logout()).resolves.toEqual({
      ok: false,
    });
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[1]?.[0]).toContain('"logout"');
  });
});
