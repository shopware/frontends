import { assertType, describe, it } from "vitest";
import { createAPIClient } from "../createApiClient";
import type { operations } from "../../../api-gen/apiTypes";
import type { RequestReturnType, RequestParameters } from "../createApiClient";

describe("createApiClient type checks", () => {
  it(`should allow not passing params when endpoint does not require "body"`, async () => {
    const apiInstance = createAPIClient<operations>({
      baseURL: "",
      accessToken: "",
    });
    await apiInstance.invoke("readContext get /context");

    // @ts-expect-error should not allow empty params when body param is required
    await apiInstance.invoke("readCms post /cms/{id}");
  });

  it(`should match RequestReturnType`, async () => {
    const apiInstance = createAPIClient<operations>({
      baseURL: "",
      accessToken: "",
    });

    type ExpectedResponseType = RequestReturnType<
      operations["removeLineItemDeprecated delete /checkout/cart/line-item"]
    >;

    const res = await apiInstance.invoke(
      "removeLineItemDeprecated delete /checkout/cart/line-item",
      {
        query: {
          ids: ["123"],
        },
      },
    );

    assertType<ExpectedResponseType>(res);
  });

  it("should match RequestParams type", async () => {
    const apiInstance = createAPIClient<operations>({
      baseURL: "",
      accessToken: "",
    });

    const params: RequestParameters<
      operations["removeLineItemDeprecated delete /checkout/cart/line-item"]
    > = {
      query: {
        ids: ["123"],
      },
      accept: "application/json",
      contentType: "application/json",
    };

    await apiInstance.invoke(
      "removeLineItemDeprecated delete /checkout/cart/line-item",
      params,
    );
  });
});
