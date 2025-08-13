import account from "./account.json";
import checkout from "./checkout.json";
import loginForm from "./loginForm.json";
import validations from "./validations.json";
import form from "./form.json";

export default {
  ...checkout,
  ...validations,
  ...loginForm,
  ...account,
  ...form
};
