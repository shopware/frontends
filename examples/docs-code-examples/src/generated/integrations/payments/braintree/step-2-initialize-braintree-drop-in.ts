import dropin from "braintree-web-drop-in";

import { clientToken } from "./snippet-context";

const instance = await dropin.create({
  authorization: clientToken,
  container: "#dropin-container",
  dataCollector: true, // Required for deviceData (fraud detection)
  card: {
    cardholderName: {
      required: true,
    },
  },
});
