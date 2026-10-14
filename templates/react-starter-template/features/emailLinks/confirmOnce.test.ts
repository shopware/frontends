import { describe, expect, it, vi } from "vitest";

import { createConfirmOnce } from "./confirmOnce";

type Result = { status: string };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((settle, fail) => {
    resolve = settle;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe("createConfirmOnce", () => {
  it("shares one call between concurrent callers of the same key", async () => {
    const once = createConfirmOnce<Result>();
    const answer = deferred<Result>();
    const confirm = vi.fn(() => answer.promise);

    const first = once.run("hash-1", confirm);
    const second = once.run("hash-1", confirm);
    answer.resolve({ status: "confirmed" });

    expect(await first).toEqual({ status: "confirmed" });
    expect(await second).toBe(await first);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it.each(["confirmed", "alreadyConfirmed", "invalidLink"])(
    "replays a %s result without calling again",
    async (status) => {
      const once = createConfirmOnce<Result>();
      const confirm = vi.fn(async () => ({ status }));

      const first = await once.run("hash-1", confirm);

      await expect(once.run("hash-1", confirm)).resolves.toBe(first);
      expect(confirm).toHaveBeenCalledTimes(1);
    },
  );

  it("forgets a failed result, so the next run calls again", async () => {
    const once = createConfirmOnce<Result>();
    const confirm = vi
      .fn<() => Promise<Result>>()
      .mockResolvedValueOnce({ status: "failed" })
      .mockResolvedValueOnce({ status: "confirmed" });

    await expect(once.run("hash-1", confirm)).resolves.toEqual({
      status: "failed",
    });
    await expect(once.run("hash-1", confirm)).resolves.toEqual({
      status: "confirmed",
    });
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it("forgets a rejection and passes it on", async () => {
    const once = createConfirmOnce<Result>();
    const confirm = vi
      .fn<() => Promise<Result>>()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ status: "confirmed" });

    await expect(once.run("hash-1", confirm)).rejects.toThrow("boom");
    await expect(once.run("hash-1", confirm)).resolves.toEqual({
      status: "confirmed",
    });
  });

  it("keeps keys apart", async () => {
    const once = createConfirmOnce<Result>();
    const confirm = vi.fn(async () => ({ status: "confirmed" }));

    await once.run("hash-1", confirm);
    await once.run("hash-2", confirm);

    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it("starts over after clear", async () => {
    const once = createConfirmOnce<Result>();
    const confirm = vi.fn(async () => ({ status: "confirmed" }));

    await once.run("hash-1", confirm);
    once.clear();
    await once.run("hash-1", confirm);

    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it("does not let a call from before clear forget a newer one", async () => {
    const once = createConfirmOnce<Result>();
    const stale = deferred<Result>();
    const confirm = vi
      .fn<() => Promise<Result>>()
      .mockReturnValueOnce(stale.promise)
      .mockResolvedValue({ status: "confirmed" });

    const old = once.run("hash-1", confirm);
    once.clear();
    const fresh = await once.run("hash-1", confirm);
    stale.resolve({ status: "failed" });
    await old;

    await expect(once.run("hash-1", confirm)).resolves.toBe(fresh);
    expect(confirm).toHaveBeenCalledTimes(2);
  });
});
