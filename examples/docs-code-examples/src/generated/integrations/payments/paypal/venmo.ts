import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const divContainer = ref<HTMLElement>();

getPayPal()
  .Buttons({
    fundingSource: "venmo",
    createOrder: () => createOrder("venmo"),
    onApprove,

    // ...
  })
  .render(divContainer.value!);
