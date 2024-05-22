// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import uuidv4 from "uuid/v4";
import * as path from "node:path";

import { z } from "zod";

const paySchema = z.object({
  sessionId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const parsedBody = await readValidatedBody(event, (body) =>
    paySchema.safeParse(body),
  );

  // return {
  //   result: {},
  // };

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      stack: "",
      data: parsedBody.error.issues,
    });
  }

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
      checkoutResultReturnUrl: "https://frontends-demo.vercel.app",
    },
    paymentDetails: {
      paymentIntent: "AuthorizeWithCapture",
      canHandlePendingAuthorization: false,
      softDescriptor: "Descriptor",
      chargeAmount: {
        amount: "1",
        currencyCode: "EUR",
      },
    },
    merchantMetadata: {
      merchantReferenceId: "Merchant reference ID",
      merchantStoreName: "Merchant store name",
      noteToBuyer: "Note to buyer",
      customInformation: "Custom information",
    },
  };

  const testPayClient = new Client.WebStoreClient(config);
  const response = await testPayClient.updateCheckoutSession(
    parsedBody.data.sessionId,
    payload,
  );

  return {
    result: response.data,
  };
});
