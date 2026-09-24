import { ref } from "vue";

import { getPayPal } from "./snippet-context";

const divContainer = ref<HTMLElement>();

// client only
getPayPal().Buttons({/** configuration skipped */}).render(divContainer.value!);
// this script will mount the component in element `divContainer`
