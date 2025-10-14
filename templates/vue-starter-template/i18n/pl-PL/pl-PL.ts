import account from "./account.json";
import checkout from "./checkout.json";
import errors from "./errors.json";
import form from "./form.json";
import layout from "./layout.json";
import loginForm from "./loginForm.json";
import validations from "./validations.json";

export default {
  ...checkout,
  ...validations,
  ...loginForm,
  ...account,
  ...form,
  ...errors,
  ...layout,
};
