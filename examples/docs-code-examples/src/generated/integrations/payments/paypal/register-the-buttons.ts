import { ref } from "vue";

import { getPayPal } from "./snippet-context";

const divContainer = ref<HTMLElement>();
const buttonOptions = {}; // Add your PayPal button configuration here.

// client only
getPayPal().Buttons(buttonOptions).render(divContainer.value!);
// this script will mount the component in element `divContainer`
