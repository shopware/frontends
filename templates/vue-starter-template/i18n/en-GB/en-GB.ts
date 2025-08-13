import account from "./account.json";
import checkout from "./checkout.json";
import validations from "./validations.json";
import form from "./form.json";

export default {
  ...checkout,
  ...validations,
  ...account,
  ...form
};
