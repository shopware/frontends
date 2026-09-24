import { createOrder, getPayPal, onApprove } from "./snippet-context";

const cardFields = getPayPal().CardFields({
  createOrder: () => createOrder("acdc"),
  onApprove: (data) => onApprove({ orderID: data.orderID }),
  onError: (error) => {
    console.error(error);
  },
  style: {/** some custom styling */},
});

const nameField = cardFields.NameField({
  placeholder: "Card holder name",
});
nameField.render("#acdc-name-field-container");

const numberField = cardFields.NumberField({
  placeholder: "Card number",
});
numberField.render("#acdc-number-field-container");

const cvvField = cardFields.CVVField({
  placeholder: "Security code (CVV)",
});
cvvField.render("#acdc-cvv-field-container");

const expiryField = cardFields.ExpiryField({
  placeholder: "Expiration date (MM/YY)",
});
expiryField.render("#acdc-expiry-field-container");
