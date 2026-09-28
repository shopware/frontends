import { useCacheableRead } from "#imports";

const { invokeRead } = useCacheableRead();
const criteria = {};

async function fetchCountries() {
  const result = await invokeRead("readCountry post /country", {
    body: criteria,
  });
  return result.data;
}
