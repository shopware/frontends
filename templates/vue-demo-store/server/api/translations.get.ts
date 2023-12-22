// import type { Schemas } from "#shopware";
import { createAdminAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
} from "@shopware/api-client/admin-api-types";

// import { LRUCache } from "lru-cache";

// const cache = new LRUCache<string, Schemas["SnippetSet"][]>({
//   max: 10,
// });

export default defineEventHandler(async (handler) => {
  //const query = getQuery(handler);

  setHeader(handler, "Cache-Control", "public, max-age=3600");
  setHeader(handler, "Max-Age", "3600, must-revalidate");

  const cookies = parseCookies(handler);

  const sessionData = () => {
    try {
      return JSON.parse(cookies["api-session"]);
    } catch (error) {
      return {};
    }
  };

  const client = createAdminAPIClient<operations, operationPaths>({
    baseURL: "https://demo-frontends.shopware.store/api",
    clientCredentials: {
      accessKeyId: import.meta.env.NUXT_SHOPWARE_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.NUXT_SHOPWARE_SECRET_ACCESS_KEY,
    },
    sessionData: sessionData(),
    onAuthChange(sessionData) {
      setCookie(handler, "api-session", JSON.stringify(sessionData));
    },
  });

  // if (cache.has(JSON.stringify(query))) {
  //   //return cache.get(JSON.stringify(query));
  // }

  const response = await client.invoke(
    "getSnippetSetList get /snippet-set?limit,page,query",
    {},
  );

  // const response = await client.invoke("getSnippetSet get /snippet-set/{id}", {
  //   id: "018c86ed67857821a7f8f8eddb2305e9",
  // });

  //cache.set(JSON.stringify(query), response.data);

  return response.data;
});
