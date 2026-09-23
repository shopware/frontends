import { encodeForQuery } from "@shopware/api-client/helpers";

const { apiClient, cacheableReads } = useShopwareContext();

const result = cacheableReads
  ? await apiClient.invoke("readCountryGet get /country", {
      query: { _criteria: encodeForQuery(criteria) },
    })
  : await apiClient.invoke("readCountry post /country", {
      body: criteria,
    });
