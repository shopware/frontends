import { describe, expect, it, beforeEach, beforeAll } from "vitest";
import { createAdminAPIClient } from ".";
import { joinURL } from "ufo";
import { listen, type Listener } from "listhen";

import type {
  operationPaths,
  operations,
} from "../admin-api-types/apiTypes-6.5.3.0.d.ts";

import {
  createApp,
  toNodeListener,
  eventHandler,
  getRequestHeaders,
  getRequestURL,
  readBody,
  type App,
} from "h3";

const AccessKeyId = "SWSCBHFSA1GDHWWWDNFKSHLAYW";
const SecretAccessKey = "QmZUb3RtQU1xCalydWc4MHk1ZWkwTHFpUEc2MURUQUhFVFhZRDk";

describe("", () => {
  let app: App;
  let apiClient: ReturnType<
    typeof createAdminAPIClient<operations, operationPaths>
  >;

  let request: {
    url: string | null;
    headers: any;
  } = {
    url: null,
    headers: null,
  };

  let listener: Listener;
  const getURL = (url: string) => joinURL(listener.url, url);

  beforeEach(() => {
    app = createApp({ debug: false });
    apiClient = createAdminAPIClient<operations, operationPaths>({
      baseURL: getURL("/api"),
      clientCredentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
      },
    });
  });

  describe("ofetch", () => {
    beforeAll(async () => {
      const app = createApp({
        async onRequest(event) {
          request.headers = getRequestHeaders(event);
          request.url = getRequestURL(event).toString();
        },
      })
        .use(
          "/api/oauth/token",
          eventHandler(async () => ({
            access_token: "some-token",
            expires_in: 3600,
          })),
        )
        .use(
          "/api/custom-field-set",
          eventHandler((event) => ({})),
        );

      listener = await listen(toNodeListener(app), {});
      request = { headers: null, url: null };
    });

    it("should invoke /api/oauth token internally to authorize beforehand and use the same token to actual request", async () => {
      await apiClient.invoke(
        "getCustomFieldSetList get /custom-field-set?limit,page,query",
        {
          limit: 10,
          page: 1,
        },
      );
      expect(apiClient.getSessionData()).toStrictEqual({
        accessToken: "some-token",
        expirationTime: expect.any(Number),
        refreshToken: undefined,
      });

      expect(request.headers["authorization"]).toBe("Bearer some-token");
      expect(request.url).toBe(
        joinURL(listener.url, "/api/custom-field-set?limit=10&page=1"),
      );
    });
  });
});
