import { useCartFunction } from "@shopware/composables";
import { createSharedComposable } from "@vueuse/core";

function myUseCart() {
  const coreCartFunctions = useCartFunction();

  // extend the core functions
  const myCustomFunction = () => {
    // do something
  };

  return {
    ...coreCartFunctions,
    myCustomFunction,
  };
}

export const useCart = createSharedComposable(myUseCart); // or skip `createSharedComposable` if you don't want it to be a shared composable anymore
