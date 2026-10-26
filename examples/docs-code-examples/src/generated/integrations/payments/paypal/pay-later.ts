import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const divContainer = ref<HTMLElement>();

getPayPal()
  .Buttons({
    fundingSource: "paylater",
    createOrder: () => createOrder("paylater"),
    onApprove,

    // ...
  })
  .render(divContainer.value!);
