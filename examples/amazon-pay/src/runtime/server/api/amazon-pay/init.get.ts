// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import uuidv4 from "uuid/v4";
import * as path from "node:path";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const STORE_ID = runtimeConfig.amazonPay?.storeId;
  const PUBLIC_KEY_ID = runtimeConfig.amazonPay?.publicKeyId;
  const filePath =
    runtimeConfig.amazonPay?.privateKeyPath ||
    path.join(process.cwd(), "server", "private.pem");

  console.error("filePath", filePath);

  const config = {
    publicKeyId: PUBLIC_KEY_ID,
    privateKey: fs.readFileSync(filePath, { encoding: "utf8" }),
    region: runtimeConfig.amazonPay?.region,
    sandbox: runtimeConfig.amazonPay?.sandbox,
    algorithm: runtimeConfig.amazonPay?.algorithm || "AMZN-PAY-RSASSA-PSS-V2",
  };

  console.warn("config", config);

  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: "https://frontends-demo.vercel.app/checkout",
    },
    storeId: STORE_ID,
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
  };

  const headers = {
    "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
  };
  try {
    const aPayClient = new Client.WebStoreClient(config);
    await aPayClient.createCheckoutSession(payload, headers);
    const signature = aPayClient.generateButtonSignature(payload);
    return {
      result: {
        signature,
        payloadJSON: JSON.stringify(payload),
        algorithm: runtimeConfig.amazonPay?.algorithm,
        publicKeyId: PUBLIC_KEY_ID,
      },
    };
  } catch (error) {
    console.warn("error", error);
    return { error };
  }
});
