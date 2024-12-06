import fs from "node:fs";
import * as path from "node:path";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import { z } from "zod";

import { createError, useRuntimeConfig } from "#imports";

import { defineEventHandler, readValidatedBody } from "h3";

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

  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl:
        runtimeConfig.amazonPay?.webCheckoutDetails.checkoutReviewReturnUrl,
      // url from nuxt.config.ts (amazonPay?.webCheckoutDetails.checkoutResultReturnUrl) + orderId
      checkoutResultReturnUrl:
        runtimeConfig.amazonPay?.webCheckoutDetails.checkoutResultReturnUrl +
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

  const aPayClient = new Client.WebStoreClient(config);
  const response = (await aPayClient.updateCheckoutSession(
    parsedBody.data.sessionId,
    payload,
  )) as { data: unknown };

  return {
    result: response.data,
  };
});
