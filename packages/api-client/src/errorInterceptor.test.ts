import { describe, expect, it } from "vitest";
import type { ApiError } from "./ApiError";
import { ApiClientError } from "./ApiError";
import type { FetchResponse } from "ofetch";
import { errorInterceptor } from "./errorInterceptor";

describe("errorInterceptor", () => {
  it("should extract different error messages from response to match snapshot", async () => {
    const resp = {
      _data: {
        errors: [
          {
            title: "Constraint violation error",
            detail:
              'The "salutation" entity with id "1b341372add24e318d4aa33564245d67" does not exist.',
            source: {
              pointer: "/salutationId",
            },
          },
          {
            title: "Constraint violation error",
            detail: "The value you selected is not a valid choice.",
            source: {
              pointer: "/storefrontUrl",
            },
          },
          {
            title: "Constraint violation error",
            detail:
              'The "salutation" entity with id "1b341372add24e318d4aa33564245d67" does not exist.',
            source: {
              pointer: "/billingAddress/salutationId",
            },
          },
          {
            code: "0",
            status: "500",
            title: "Internal Server Error",
            detail: "Empty ids provided in criteria",
          },
          {
            code: "0",
            status: "500",
            title: "Internal Server Error",
            detail: undefined,
          },
        ],
      },
    } as unknown as FetchResponse<{
      errors: Array<ApiError>;
    }>;

    await expect(() =>
      errorInterceptor(resp),
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [ApiClientError: Failed request
       - [Constraint violation error][/salutationId] The "salutation" entity with id "1b341372add24e318d4aa33564245d67" does not exist.
       - [Constraint violation error][/storefrontUrl] The value you selected is not a valid choice.
       - [Constraint violation error][/billingAddress/salutationId] The "salutation" entity with id "1b341372add24e318d4aa33564245d67" does not exist.
       - [Internal Server Error] Empty ids provided in criteria
       - [Internal Server Error] No error details provided.]
    `,
    );

    try {
      errorInterceptor(resp);
    } catch (error) {
      expect(error instanceof ApiClientError).toBe(true);

      if (error instanceof ApiClientError) {
        expect(error.details.errors.length).toBe(resp!._data!.errors.length);
      }
    }
  });

  it("should display default error message if no error details are provided", async () => {
    const resp = {
      _data: null,
    } as unknown as FetchResponse<{
      errors: Array<ApiError>;
    }>;

    await expect(() =>
      errorInterceptor(resp),
    ).toThrowErrorMatchingInlineSnapshot(`
        [ApiClientError: Failed request
         - [Unknown error] API did not return errors, but request failed. Please check the network tab.]
      `);

    try {
      errorInterceptor(resp);
    } catch (error) {
      expect(error instanceof ApiClientError).toBe(true);

      if (error instanceof ApiClientError) {
        expect(error.details.errors.length).toEqual(1);
      }
    }
  });

  it("should pass errors with different datatype", async () => {
    const resp = {
      _data: { someOtherFormat: "Not okay" },
    } as unknown as FetchResponse<{
      errors: Array<ApiError>;
    }>;

    await expect(() =>
      errorInterceptor(resp),
    ).toThrowErrorMatchingInlineSnapshot(`[ApiClientError: Failed request]`);

    try {
      errorInterceptor(resp);
    } catch (error) {
      expect(error instanceof ApiClientError).toBe(true);

      if (error instanceof ApiClientError) {
        expect(error.details.errors).toBeUndefined();
        expect(error.details).toMatchInlineSnapshot(`
          {
            "someOtherFormat": "Not okay",
          }
        `);
      }
    }
  });
});
