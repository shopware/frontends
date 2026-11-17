import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_FAILURE_MESSAGE,
  getActionFailureMessages,
  notifyActionError,
  notifyActionFailure,
} from "./actionNotifications";

describe("getActionFailureMessages", () => {
  it("translates known error keys with their params", () => {
    expect(
      getActionFailureMessages(
        {
          message: "ignored",
          errors: [
            { messageKey: "product-stock-reached", params: { quantity: 3 } },
          ],
        },
        { messages: { "product-stock-reached": "Only {quantity} left" } },
      ),
    ).toEqual(["Only 3 left"]);
  });

  it("falls back to the result message when no key is translated", () => {
    expect(
      getActionFailureMessages(
        { message: "Cart is locked", errors: [{ messageKey: "unknown-key" }] },
        { messages: {} },
      ),
    ).toEqual(["Cart is locked"]);
  });

  it("never returns an empty list", () => {
    expect(getActionFailureMessages({})).toEqual([DEFAULT_FAILURE_MESSAGE]);
    expect(getActionFailureMessages({}, { fallback: "Nope" })).toEqual([
      "Nope",
    ]);
  });
});

describe("notifyActionFailure", () => {
  it("sends one error notification per message", () => {
    const notify = vi.fn();
    notifyActionFailure(
      { notify },
      { errors: [{ messageKey: "a" }, { messageKey: "b" }] },
      { messages: { a: "First", b: "Second" } },
    );
    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "First" }],
      [{ type: "error", message: "Second" }],
    ]);
  });
});

describe("notifyActionError", () => {
  it("shows the fallback instead of the raw error text", () => {
    const notify = vi.fn();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    notifyActionError({ notify }, new TypeError("Failed to fetch"));
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: DEFAULT_FAILURE_MESSAGE,
    });
    log.mockRestore();
  });
});
