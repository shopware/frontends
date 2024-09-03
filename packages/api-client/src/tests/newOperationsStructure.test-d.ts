import { describe, it, assertType, expectTypeOf } from "vitest";
import { createAPIClient } from "../createAPIClient";

type operations = {
  "myCustomOperation post /my/custom/operation":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        body: { bodyId: string };
        response: { responseId: string };
        responseCode: 200;
      }
    | {
        contentType: "application/xml";
        accept?: "application/json";
        body: {
          xmlBodyId: string;
        };
        response: { responseId: string };
        responseCode: 200;
      };
};

describe("createApiClient type checks", () => {
  const apiInstance = createAPIClient<operations>({
    baseURL: "",
    accessToken: "",
  });

  it(`should make sure that defaut types are not resolving to "any"`, async () => {
    const result = await apiInstance.invoke(
      "myCustomOperation post /my/custom/operation",
      {
        body: {
          bodyId: "123",
        },
      },
    );
    assertType<typeof result>({
      status: 200,
      data: {
        responseId: "string",
        // @ts-expect-error should not allow random property, and prevent `any` type
        notExisting: "notExisting",
      },
    });
    expectTypeOf(result).toEqualTypeOf<{
      status: 200;
      data: {
        responseId: string;
      };
    }>();
  });

  it("should not allow empty params when body param is required", async () => {
    await apiInstance.invoke(
      "myCustomOperation post /my/custom/operation",
      // @ts-expect-error should not allow empty params
      {},
    );
    // @ts-expect-error should not allow empty params
    await apiInstance.invoke("myCustomOperation post /my/custom/operation");

    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      // @ts-expect-error should not allow empty body param
      body: {},
    });
  });

  it("should require body param in request", async () => {
    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      body: {
        bodyId: "123",
      },
    });

    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      contentType: "application/json",
      body: {
        bodyId: "123",
      },
    });
  });

  it("should allow requests without headers", async () => {
    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      body: {
        bodyId: "123",
      },
    });
  });

  it("should not allow query params when not defined", async () => {
    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      body: {
        bodyId: "123",
      },
      // @ts-expect-error should not allow query params
      query: {
        someParam: "value",
      },
    });
  });

  it("should expect different body type when header is present", async () => {
    await apiInstance.invoke("myCustomOperation post /my/custom/operation", {
      contentType: "application/xml",
      body: {
        // @ts-expect-error should not allow json body when xml header is present
        bodyId: "123",
        xmlBodyId: "456",
      },
    });
  });
});
