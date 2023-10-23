import account from "./account.json";
import form from "./form.json";
import changePassword from "./changePassword.json";
import recoveryPassword from "./recoveryPassword.json";
import checkout from "./checkout.json";
import general from "./general.json";
import cart from "./cart.json";
import listing from "./listing.json";
import product from "./product.json";
import newsletter from "./newsletter.json";
import validations from "./validations.json";
import errors from "./errors.json";

export default {
  ...account,
  ...form,
  ...changePassword,
  ...recoveryPassword,
  ...checkout,
  ...general,
  ...cart,
  ...listing,
  ...product,
  ...newsletter,
  ...validations,
  ...errors,
};
