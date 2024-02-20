import { describe, it, assertType } from "vitest";
import { createAPIClient } from "..";
import type { operations, operationPaths } from "../../api-types";

describe("createApiClient type checks", () => {
  it(`should make sure that defaut types are not resulving to "any"`, async () => {
    const apiInstance = createAPIClient<operations, operationPaths>({
      baseURL: "",
      accessToken: "",
    });
    const result = await apiInstance.invoke("readContext get /context");
    assertType<typeof result>({
      // @ts-expect-error should not allow random property, and prevent `any` type
      notExisting: "notExisting",
    });
  });
});
