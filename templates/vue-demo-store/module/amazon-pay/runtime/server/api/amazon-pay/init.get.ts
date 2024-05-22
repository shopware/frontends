// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import uuidv4 from "uuid/v4";
import * as path from "node:path";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const STORE_ID =
    "amzn1.application-oa2-client.53f60bb5f0744519acecb0765d37a9da";

  const PUBLIC_KEY_ID = "AH4AOD5PWJCYBIAQKLNPBP77";
  const filePath = path.join(process.cwd(), "server", "private.pem");

  const config = {
    publicKeyId: PUBLIC_KEY_ID,
    privateKey: fs.readFileSync(filePath, { encoding: "utf8" }),
    region: "DE",
    sandbox: true,
    algorithm: "AMZN-PAY-RSASSA-PSS-V2",
  };

  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: "https://frontends-demo.vercel.app",
    },
    storeId: STORE_ID,
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
  };

  const headers = {
    "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
  };

  const testPayClient = new Client.WebStoreClient(config);
  const response = testPayClient.createCheckoutSession(payload, headers);

  return response
    .then(function (result) {
      const payload2 = {
        webCheckoutDetails: {
          checkoutReviewReturnUrl: "https://frontends-demo.vercel.app",
        },
        storeId: STORE_ID,
        scopes: ["name", "email", "phoneNumber", "billingAddress"],
      };
      const signature = testPayClient.generateButtonSignature(
        payload2,
        //headers,
      );
      //return result.data;
      console.warn("step 2", result.data);
      return {
        result: {
          signature,
          payloadJSON: JSON.stringify(payload),
          algorithm: "AMZN-PAY-RSASSA-PSS-V2",
          publicKeyId: PUBLIC_KEY_ID,
        },
      };
    })
    .catch((err) => {
      return { error: err };
    });
});
