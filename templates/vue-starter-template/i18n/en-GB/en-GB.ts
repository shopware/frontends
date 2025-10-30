import account from "./account.json";
import checkout from "./checkout.json";
import errors from "./errors.json";
import form from "./form.json";
import layout from "./layout.json";
import loginForm from "./loginForm.json";
import product from "./product.json";
import validations from "./validations.json";
import wishlist from "./wishlist.json";

export default {
  ...checkout,
  ...validations,
  ...loginForm,
  ...account,
  ...form,
  ...errors,
  ...layout,
  ...wishlist,
  ...product,
};
