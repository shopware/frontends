import { describe, it, assertType } from "vitest";
import type { RequestParameters } from "..";

import type { operations } from "../../admin-api-types";

describe("requestParameters type", () => {
  describe("/token request", () => {
    it("password grant type correct fields", () => {
      assertType<RequestParameters<"token", operations>>({
        grant_type: "password",
        client_id: "administration",
        password: "somepassword",
        username: "something",
        scopes: "write",
      });
    });

    it("password grant type should not allow other fields", () => {
      assertType<RequestParameters<"token", operations>>({
        grant_type: "password",
        client_id: "administration",
        password: "somepassword",
        username: "something",
        scopes: "write",
        // @ts-expect-error should not allow this property
        client_secret: "somepassword",
      });
    });

    it("client_cridentials grant type fields", () => {
      assertType<RequestParameters<"token", operations>>({
        grant_type: "client_credentials",
        client_secret: "somepassword",
        client_id: "any other client id",
      });
    });

    it("client_cridentials grant type should not allow other fields", () => {
      assertType<RequestParameters<"token", operations>>({
        grant_type: "client_credentials",
        client_secret: "somepassword",
        client_id: "any other client id",
        // @ts-expect-error should not allow this property
        username: "something",
      });
    });

    it("password grant should not allow another client_id", () => {
      // @ts-expect-error should not allow another client_id
      assertType<RequestParameters<"token", operations>>({
        grant_type: "password",
        client_id: "ANOTHER_CLIENT_ID",
        password: "somepassword",
        username: "something",
        scopes: "write",
      });
    });
  });
});
