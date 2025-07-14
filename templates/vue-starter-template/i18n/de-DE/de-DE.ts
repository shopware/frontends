import account from "./account.json";
import checkout from "./checkout.json";
import validations from "./validations.json";

export default {
  ...checkout,
  ...validations,
  ...account,
};
