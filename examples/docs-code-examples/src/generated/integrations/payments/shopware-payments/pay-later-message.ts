import { shopwarePayments } from "./init";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-message");

const messages = await shopwarePayments.messages({
  element,
  location: "product-details",
  amount: "29.99",
});

messages?.update({ amount: "49.99" });
