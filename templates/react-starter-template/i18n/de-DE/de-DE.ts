import { mergeMessageFiles } from "../merge";
import account from "./account.json";
import cart from "./cart.json";
import checkout from "./checkout.json";
import errors from "./errors.json";
import form from "./form.json";
import layout from "./layout.json";
import listing from "./listing.json";
import loginForm from "./loginForm.json";
import newsletter from "./newsletter.json";
import product from "./product.json";
import reactAccount from "./react/account.json";
import reactAccountExtras from "./react/accountExtras.json";
import reactCart from "./react/cart.json";
import reactCheckout from "./react/checkout.json";
import reactCheckoutExtras from "./react/checkoutExtras.json";
import reactCore from "./react/core.json";
import reactEmailLinks from "./react/emailLinks.json";
import reactForms from "./react/forms.json";
import reactLayout from "./react/layout.json";
import reactRecovery from "./react/recovery.json";
import reactSearch from "./react/search.json";
import reactVariants from "./react/variants.json";
import search from "./search.json";
import validations from "./validations.json";
import wishlist from "./wishlist.json";

export default mergeMessageFiles([
  checkout,
  validations,
  loginForm,
  account,
  form,
  errors,
  layout,
  listing,
  wishlist,
  product,
  search,
  cart,
  newsletter,
  reactCore,
  reactLayout,
  reactAccount,
  reactCheckout,
  reactSearch,
  reactVariants,
  reactForms,
  reactEmailLinks,
  reactRecovery,
  reactCart,
  reactCheckoutExtras,
  reactAccountExtras,
]);
