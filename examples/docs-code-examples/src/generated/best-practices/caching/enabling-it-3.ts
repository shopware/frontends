import { encodeForQuery } from "@shopware/api-client/helpers";

import { useShopwareContext } from "#imports";

const { apiClient, cacheableReads } = useShopwareContext();
const criteria = {};

const result = cacheableReads
  ? await apiClient.invoke("readCountryGet get /country", {
      query: { _criteria: encodeForQuery(criteria) },
    })
  : await apiClient.invoke("readCountry post /country", {
      body: criteria,
    });
