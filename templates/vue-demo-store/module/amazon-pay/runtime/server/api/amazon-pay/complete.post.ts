// @ts-nocheck
import fs from "node:fs";
import Client from "@amazonpay/amazon-pay-api-sdk-nodejs";
import * as path from "node:path";

import { createAdminAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
  components,
} from "@shopware/api-client/admin-api-types";
import Cookies from "js-cookie";

export const adminApiClient = createAdminAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/api",

  credentials: {
    grant_type: "client_credentials",
    client_id: "SWIABTJARHBSTLD5SGS0BVVOZG",
    client_secret: "QUhPMHlPbE1XVnc2eG5XN1NCRDhBRU55TEhWV05qQm50MEowTXU",
  },
});

import { z } from "zod";

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
    region: "eu",
    sandbox: true,
    algorithm: "AMZN-PAY-RSASSA-PSS-V2",
  };

  const payload = {
    chargeAmount: parsedBody.data.chargeAmount,
  };

  const testPayClient = new Client.WebStoreClient(config);

  try {
    const response = await testPayClient.completeCheckoutSession(
      parsedBody.data.amazonCheckoutSessionId,
      payload,
    );
    console.warn("completecheckoutsession response", response);

    console.warn("parsedBody.data", parsedBody.data);

    if (response.data.statusDetails.state !== "Completed") {
      throw new Error("Payment not completed");
    }

    await adminApiClient.invoke(
      "orderTransactionStateTransition post /_action/order_transaction/{orderTransactionId}/state/{transition}",
      {
        orderTransactionId: parsedBody.data.transactionId,
        transition: "paid",
        sendMail: true,
      },
    );
    return response.data;
  } catch (error) {
    console.warn("error complete", error);
  }

  return {};
});
