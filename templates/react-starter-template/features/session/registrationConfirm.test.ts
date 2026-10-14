import { afterEach, describe, expect, it, vi } from "vitest";

import { timeoutError } from "@/features/checkout/checkoutTestDoubles";

import {
  classifyRegistrationConfirmError,
  isGuestCustomer,
  logRegistrationConfirmFailure,
} from "./registrationConfirm";
import { apiClientError, apiClientErrorWithBody } from "./session.fixture";

const HASH = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("classifyRegistrationConfirmError", () => {
  it("treats a link that was already used as already confirmed", () => {
    expect(
      classifyRegistrationConfirmError(
        apiClientError(
          [
            {
              code: "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED",
              detail: 'The customer with the id "c-1" is already confirmed.',
            },
          ],
          412,
        ),
      ),
    ).toBe("alreadyConfirmed");
  });

  it.each([
    [
      "an unknown hash",
      apiClientError(
        [
          {
            code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
            detail: `No matching customer for the hash "${HASH}" was found.`,
          },
        ],
        404,
      ),
    ],
    [
      "a missing hash",
      apiClientError([{ code: "CHECKOUT__NO_HASH_PROVIDED" }], 404),
    ],
    [
      "an email hash that does not match",
      apiClientError(
        [{ code: "VIOLATION::NOT_EQUAL_ERROR", source: { pointer: "/em" } }],
        400,
      ),
    ],
    [
      "a customer without double opt-in",
      apiClientError(
        [
          {
            code: "VIOLATION::NOT_TRUE_ERROR",
            source: { pointer: "/doubleOptInRegistration" },
          },
        ],
        400,
      ),
    ],
  ])("treats %s as an invalid link", (_, error) => {
    expect(classifyRegistrationConfirmError(error)).toBe("invalidLink");
  });

  it.each([
    ["a server error", apiClientError([{ code: "FRAMEWORK__ERROR" }], 500)],
    ["an HTML gateway page", apiClientErrorWithBody("<html>502</html>", 502)],
    ["a network failure", new TypeError("Failed to fetch")],
    ["a timeout", timeoutError()],
    ["nothing", undefined],
  ])("treats %s as a failure that can be retried", (_, error) => {
    expect(classifyRegistrationConfirmError(error)).toBe("failed");
  });
});

describe("isGuestCustomer", () => {
  it.each([
    [{ guest: true }, true],
    [{ guest: false }, false],
    [{}, false],
    [undefined, false],
    [null, false],
    ["", false],
  ])("reads %j as guest: %s", (data, guest) => {
    expect(isGuestCustomer(data)).toBe(guest);
  });
});

describe("logRegistrationConfirmFailure", () => {
  it("logs the status and the codes, never the detail that holds the hash", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    logRegistrationConfirmFailure(
      apiClientError(
        [
          {
            code: "CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH",
            detail: `No matching customer for the hash "${HASH}" was found.`,
          },
        ],
        503,
      ),
    );

    expect(consoleError).toHaveBeenCalledExactlyOnceWith(
      "[Session] confirming the registration failed",
      { status: 503, codes: ["CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH"] },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(HASH);
  });
});
