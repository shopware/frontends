import { encodeForQuery } from "@shopware/api-client/helpers";

const criteria = { associations: { states: {} } };
const encoded = encodeForQuery(criteria); // gzip + base64url string, safe in a URL / cache key
