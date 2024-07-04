# Shared composables

Using composable in a component can be imagined as copying all the code from that into that component, without the actual need to do so. This way we can reuse logic in a clean way. We need to remember, that every computed property/state is then replicated, so if we have multiple components using specific composable - we duplicate that in memory.

Sometimes we want only one instance of a specific composable to be shared between all components. This is where shared composables come in. They are just regular composables, but there is always one instance in the system.

Example:
`useCart` is composable which contains cart information, like items inside, count or totalPrice details. We want to use it in multiple components, but we don't want to duplicate the data in memory. This is a perfect use case for shared composable.

## How do I know which one is shared and what should I do with that?

We're adding information that the composable is shared into the description with a link to this documentation page.
There is no need to do anything with this information. The only difference is in [overwriting](./overwriting-composables.html)

## Overwrite/extend shared composable

Typically you extend shared composable by using the same core composable. In the case of shared composables you need to take `useXXFunction` to extend it.

Example:

```ts
import { useCartFunction } from "@shopware-pwa/composables-next";
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
```
