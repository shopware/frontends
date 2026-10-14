import { describe, expect, it } from "vitest";

import { fakeClient } from "@/features/checkout/checkout.fixture";
import { apiClientError } from "@/features/session/session.fixture";

import {
  CHECK_HASH,
  RESET_PASSWORD,
  SEND_MAIL,
  VALID_HASH,
  isExpiredAnswer,
  violation,
} from "./recovery.fixture";
import {
  checkRecoveryHash,
  isRecoveryHash,
  readRecoveryHash,
  resetPassword,
  sendRecoveryMail,
} from "./recoveryApi";

describe("readRecoveryHash", () => {
  it("reads and trims the hash of the mail link", () => {
    expect(readRecoveryHash(`?hash=%20${VALID_HASH}%20`)).toBe(VALID_HASH);
    expect(readRecoveryHash(`?foo=1&hash=${VALID_HASH}`)).toBe(VALID_HASH);
  });

  it("gives null without a usable hash", () => {
    expect(readRecoveryHash("")).toBeNull();
    expect(readRecoveryHash("?hash=")).toBeNull();
    expect(readRecoveryHash("?hash=%20%20")).toBeNull();
  });
});

describe("isRecoveryHash", () => {
  it("accepts exactly 32 letters and digits", () => {
    expect(isRecoveryHash(VALID_HASH)).toBe(true);
    expect(isRecoveryHash(VALID_HASH.slice(1))).toBe(false);
    expect(isRecoveryHash(`${VALID_HASH}a`)).toBe(false);
    expect(isRecoveryHash(`${VALID_HASH.slice(1)}-`)).toBe(false);
    expect(isRecoveryHash(`${VALID_HASH.slice(1)} `)).toBe(false);
    expect(isRecoveryHash(null)).toBe(false);
  });
});

describe("sendRecoveryMail", () => {
  it("posts the email and the storefront URL", async () => {
    const shopware = fakeClient(() => ({ success: true }));

    await sendRecoveryMail(shopware.client, {
      email: "jane@example.com",
      storefrontUrl: "https://shop.test/de-DE",
    });

    expect(shopware.invocations).toEqual([
      {
        operation: SEND_MAIL,
        params: {
          body: {
            email: "jane@example.com",
            storefrontUrl: "https://shop.test/de-DE",
          },
        },
      },
    ]);
  });
});

describe("checkRecoveryHash", () => {
  it("posts the hash with the read timeout", async () => {
    const shopware = fakeClient(() => isExpiredAnswer(false));

    await expect(checkRecoveryHash(shopware.client, VALID_HASH)).resolves.toBe(
      "valid",
    );
    expect(shopware.invocations).toEqual([
      {
        operation: CHECK_HASH,
        params: {
          body: { hash: VALID_HASH },
          fetchOptions: { timeout: 10_000 },
        },
      },
    ]);
  });

  it("reads the flat isExpired answer of the backend", async () => {
    const shopware = fakeClient(() => isExpiredAnswer(true));

    await expect(checkRecoveryHash(shopware.client, VALID_HASH)).resolves.toBe(
      "expired",
    );
  });

  it.each([
    [
      "the nested shape of the generated type",
      { data: [{ isExpired: false }] },
    ],
    ["a string flag", { isExpired: "false" }],
    ["an empty body", ""],
    ["null", null],
  ])("throws on %s", async (_, answer) => {
    const shopware = fakeClient(() => answer);

    await expect(
      checkRecoveryHash(shopware.client, VALID_HASH),
    ).rejects.toThrow("isExpired");
  });

  it("treats an unknown or used hash as an invalid link", async () => {
    const shopware = fakeClient(() => {
      throw apiClientError(
        [{ code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH", status: "404" }],
        404,
      );
    });

    await expect(checkRecoveryHash(shopware.client, VALID_HASH)).resolves.toBe(
      "invalid",
    );
  });

  it("treats a rejected hash as an invalid link", async () => {
    const shopware = fakeClient(() => {
      throw apiClientError([
        violation("VIOLATION::NOT_EQUAL_LENGTH_ERROR", "/hash"),
      ]);
    });

    await expect(checkRecoveryHash(shopware.client, VALID_HASH)).resolves.toBe(
      "invalid",
    );
  });

  it.each([
    ["a server error", apiClientError([], 500)],
    [
      "another 404",
      apiClientError([{ code: "FRAMEWORK__ROUTE_NOT_FOUND" }], 404),
    ],
    [
      "a timeout",
      Object.assign(new Error("timeout"), { name: "TimeoutError" }),
    ],
  ])("rethrows %s", async (_, error) => {
    const shopware = fakeClient(() => {
      throw error;
    });

    await expect(checkRecoveryHash(shopware.client, VALID_HASH)).rejects.toBe(
      error,
    );
  });
});

describe("resetPassword", () => {
  it("sends the hash and both passwords exactly as typed", async () => {
    const shopware = fakeClient(() => ({ success: true }));

    await resetPassword(shopware.client, {
      hash: VALID_HASH,
      newPassword: "new secret 1",
      newPasswordConfirm: "new secret 2",
    });

    expect(shopware.invocations).toEqual([
      {
        operation: RESET_PASSWORD,
        params: {
          body: {
            hash: VALID_HASH,
            newPassword: "new secret 1",
            newPasswordConfirm: "new secret 2",
          },
        },
      },
    ]);
  });
});
