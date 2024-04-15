import { describe, it } from "vitest";
import { createAPIClient } from "../createApiClient";
import type { operations } from "../../../api-gen/apiTypes";

describe("createApiClient type checks", () => {
  // it(`should make sure that defaut types are not resolving to "any"`, async () => {
  //   const apiInstance = createAPIClient<operations>({
  //     baseURL: "",
  //     accessToken: "",
  //   });
  //   const result = await apiInstance.invoke("readContext get /context");
  //   assertType<typeof result>({
  //     // @ts-expect-error should not allow random property, and prevent `any` type
  //     notExisting: "notExisting",
  //   });
  // });

  it(`should allow not passing params when endpoint does not require "body"`, async () => {
    const apiInstance = createAPIClient<operations>({
      baseURL: "",
      accessToken: "",
    });
    await apiInstance.invoke("readContext get /context");

    // @ts-expect-error should not allow empty params when body param is required
    await apiInstance.invoke("readCms post /cms/{id}");
  });
});
