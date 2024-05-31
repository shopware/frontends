// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import * as path from "node:path";

import { z } from "zod";

const paySchema = z.object({
  sessionId: z.string().uuid(),
  orderNumber: z.string(),
  orderId: z.string(),
  chargeAmount: z.object({
    amount: z.string(),
    currencyCode: z.string(),
  }),
});

export default defineEventHandler(async (event) => {
  const parsedBody = await readValidatedBody(event, (body) =>
    paySchema.safeParse(body),
  );

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
      checkoutReviewReturnUrl: "https://frontends-demo.vercel.app/checkout",
      checkoutResultReturnUrl:
        "https://frontends-demo.vercel.app/checkout/success/" +
        parsedBody.data.orderId,
    },
    paymentDetails: {
      paymentIntent: "AuthorizeWithCapture",
      chargeAmount: parsedBody.data.chargeAmount,
      canHandlePendingAuthorization: false,
    },
    merchantMetadata: {
      merchantReferenceId: parsedBody.data.orderNumber,
      merchantStoreName: "Frontends Demo Store",
      noteToBuyer: "",
      customInformation: "",
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
