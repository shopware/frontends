import { debounce } from "./debounce";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
/**
 * @jest-environment jsdom
 */
describe("Shopware helpers - debounce", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });
  it("should invoke passed function in default timeout", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func);
    debouncedFunc();
    expect(func).not.toBeCalled();
    vi.runAllTimers();
    expect(func).toHaveBeenCalledTimes(1);
  });
  it("should invoke debounce two times and clear the previous invocation", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);
    debouncedFunc();
    expect(func).not.toBeCalled();
    debouncedFunc();
    vi.runOnlyPendingTimers();
    expect(func).toHaveBeenCalledTimes(1);
  });
});
