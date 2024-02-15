// import type { Schemas } from "#shopware";
import { createAdminAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
  components,
} from "@shopware/api-client/admin-api-types";

// import { LRUCache } from "lru-cache";

const FALLBACK_LOCALE = "en-GB";

// const cache = new LRUCache<string, components["schemas"]["SnippetSet"][]>({
//   max: 10,
// });

export default defineEventHandler(async (handler) => {
  const query = getQuery(handler);

  const localeParam = query.locale as string;

  if (!localeParam) {
    return sendError(handler, {
      statusCode: 400,
      statusMessage: `Wrong input parameter`,
      fatal: true,
      message: `Locale is not provided`,
      name: "LocaleNotProvided",
    });
  }

  // if (cache.has(localeParam)) {
  //   return cache.get(localeParam);
  // }

  // create an instance of the Shopware API client
  // using client credentials grant type
  const client = createAdminAPIClient<operations, operationPaths>({
    baseURL: `${useRuntimeConfig().public.shopware.shopwareEndpoint.replace("store-api", "api")}`,
    credentials: {
      grant_type: "client_credentials",
      client_id: useRuntimeConfig()?.api_client_id,
      client_secret: useRuntimeConfig()?.api_client_secret,
    },
    // onAuthChange: (auth) => {
    //    auth.accessToken
    //    auth.expirationTime
    // },
    // sessionData: {
    //   accessToken: "",
    //   expirationTime: 600,
    // },
  });

  let snippetSetResponse;

  try {
    // fetch snippetSetId for the given locale to use it in the next request
    snippetSetResponse = await client.invoke(
      "searchSnippetSet post /search/snippet-set",
      {
        filter: [
          {
            type: "equals",
            field: "iso",
            value: localeParam || FALLBACK_LOCALE,
          },
        ],
      },
    );
  } catch (error) {
    console.error("ERROR WHILE FETCHING snippets: ", error);
  }

  if (!snippetSetResponse?.data?.[0]?.id) {
    return sendError(handler, {
      statusCode: 404,
      statusMessage: `Locale "${query.locale}" Not Found`,
      fatal: true,
      message: `Locale "${query.locale}" Not Found`,
      name: "LocaleNotFound",
    });
  }

  // fetch all snippets for the given locale (via snippetSetId)
  const snippetsFound = await client.invoke(
    "searchSnippet post /search/snippet",
    {
      filter: [
        {
          type: "prefix",
          field: "translationKey",
          value: "frontends.",
        },
        {
          type: "equals",
          field: "setId",
          value: snippetSetResponse.data?.[0]?.id,
        },
      ],
    },
  );

  const response = Object.assign(
    {},
    // create an object with keys from translationKey and values from value
    // with removed frontends. prefix
    ...(snippetsFound?.data?.map((snippet) => ({
      [snippet.translationKey.replace("frontends.", "")]: snippet.value,
    })) || []),
  );

  // cache.set(localeParam, response);

  // Consider HTTP Cache for production
  // setHeader(handler, "Cache-Control", "public, max-age=3600");
  // setHeader(handler, "Max-Age", "3600, must-revalidate");

  return response;
});
