import fs from "node:fs";
import * as path from "node:path";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import { defineEventHandler, readValidatedBody } from "h3";
import { z } from "zod";
import { createError, useRuntimeConfig } from "#imports";

// import {
//   defineEventHandler,
//   readValidatedBody,
// } from "#imports";
import { createAdminAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/admin-api-types";

const paySchema = z.object({
  orderId: z.string(),
  transactionId: z.string(),
  amazonCheckoutSessionId: z.string().uuid(),
  chargeAmount: z.object({
    amount: z.string(),
    currencyCode: z.string(),
  }),
});

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const adminApiClient = createAdminAPIClient<operations>({
    baseURL: runtimeConfig.amazonPay?.shopwareAdminApi.endpoint,

    credentials: {
      grant_type: "client_credentials",
      ...runtimeConfig.amazonPay?.shopwareAdminApi.credentials,
    },
  });

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

  const payload = {
    chargeAmount: parsedBody.data.chargeAmount,
  };

  const aPayClient = new Client.WebStoreClient(config);

  try {
    const response = await aPayClient.completeCheckoutSession(
      parsedBody.data.amazonCheckoutSessionId,
      payload,
    );

    if (response.data.statusDetails.state !== "Completed") {
      throw new Error("Payment not completed");
    }

    await adminApiClient.invoke(
      "orderTransactionStateTransition post /_action/order_transaction/{orderTransactionId}/state/{transition}",
      {
        pathParams: {
          orderTransactionId: parsedBody.data.transactionId,
          transition: "paid",
        },
        body: {
          sendMail: true,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.warn("complete the order: error", error);

    return {
      error,
    };
  }
});
