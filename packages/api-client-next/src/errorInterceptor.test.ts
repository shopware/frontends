import { describe, expect, it } from "vitest";
import { ApiError, ApiClientError, errorInterceptor } from "./errorInterceptor";
import { FetchResponse } from "ofetch";

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
       - [Internal Server Error] Empty ids provided in criteria]
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
});
