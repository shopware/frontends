// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import * as path from "node:path";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const runtimeConfig = useRuntimeConfig();
  const PUBLIC_KEY_ID = runtimeConfig.amazonPay?.publicKeyId;
  const filePath =
    runtimeConfig.amazonPay?.privateKeyPath ||
    path.join(process.cwd(), "server", "private.pem");

  const config = {
    publicKeyId: PUBLIC_KEY_ID,
    privateKey: fs.readFileSync(filePath, { encoding: "utf8" }),
    region: runtimeConfig.amazonPay?.region,
    sandbox: runtimeConfig.amazonPay?.sandbox,
    algorithm: runtimeConfig.amazonPay?.algorithm || "AMZN-PAY-RSASSA-PSS-V2",
  };
  const aPayClient = new Client.WebStoreClient(config);
  const response = aPayClient.getCheckoutSession(query.checkoutSessionId);

  return response
    .then(function (result) {
      return result.data;
    })
    .catch((error) => {
      return { error };
    });
});
