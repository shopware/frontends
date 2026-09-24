import { getPayPal } from "./snippet-context";

const paypal = getPayPal();
const divContainer = "#paypal-button-container";

// client only
paypal.Buttons({}).render(divContainer);
// this script will mount the component in element `divContainer`
