---
head:
  - - meta
    - name: og:title
      content: "Overwriting and extending composables"
  - - meta
    - name: og:description
      content: "See how to overwrite and extend core composables to make the logic work for every usecase"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Overwrite%20Composables.png"
---

# Overwrite and extend composables

:::warning Join the discussion
Currently we have open RFC for this topic - join the discussion and share your thoughts - https://github.com/shopware/frontends/discussions/44
:::

Designed architecture allows you to replace and overwrite almost any part of the composables package in order to achieve highly customized solution.

In order to extend or overwrite the logic of the composables, you need to create a new file in the `composables` folder with the same name as the one you want to overwrite. For example, if you want to overwrite the logic of the `useAddToCart` composable, you need to create a new file called `useAddToCart.ts` in the `composables` folder.

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/composables/overwriting-composables/example.ts" code lang="ts" no-name -->

```ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { Ref } from "#imports";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);
  return {
    ...coreFunctionality,
  };
}
```

<!-- /automd -->

this is our base for extending and overwriting the logic of the `useAddToCart` composable.
At this point you can:

- extend logic of the composable
- extend logic of specific method
- overwrite the whole method
- replace the whole composable

:::warning Overwriting the whole composable
If you want to overwrite the whole composable, you need to make sure that you are the same interface as the original one or that you are completly aware of the consequences of the change. This can lead to breaking changes in your application so be careful.
:::

## Extending the logic of the composable

Let's say we want additional method to be available in the `useAddToCart` composable.
This case is not problematic, as the existing API is not changing. Let's try to have additional computed property which returns quantity of the product in the cart.

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/composables/overwriting-composables/extending-the-logic-of-the-composable.ts" code lang="ts" no-name -->

```ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { Ref, computed, useCart } from "#imports";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);
  const { cartItems } = useCart();

  const getQuantityInCart = computed(() => {
    return cartItems.value.find(
      (item: LineItem) => item.referencedId === product.value?.id,
    )?.quantity;
  });

  return {
    ...coreFunctionality,
    getQuantityInCart,
  };
}
```

<!-- /automd -->

You can achieve the same effect by creating a new composable as well and write additional logic, this might be a better solution if you want to keep the logic of the original composable untouched.

## Extending the logic of the specific method

This might be especially useful for high customization. Let's say we want to add analytics after the product is added to the cart.

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/composables/overwriting-composables/extending-the-logic-of-the-specific-method.ts" code lang="ts" no-name -->

```ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { Ref } from "#imports";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    const result = await coreFunctionality.addToCart(quantity);
    // here we can call analytics, we have access to product, added quantity and result of the core addToCart method
    return result; // going back to the original method, result can also be modified by you
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
```

<!-- /automd -->

That kind of customisation is extremly powerful and can be used to achieve almost any kind of customisation. It replaces the need od interceprots for methods as you have full control over the place where intercepted logic is called and what are the results of that logic.

## Overwriting the whole method

Sometimes you want to completly replace original logic, maybe you want to call a different API endpoint or need another order of the things.

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/composables/overwriting-composables/overwriting-the-whole-method.ts" code lang="ts" no-name -->

```ts
import { useAddToCart as coreUseAddToCart } from "@shopware/composables";

// composables/useAddToCart.ts
import { Ref } from "#imports";

export function useAddToCart(product: Ref<Product>) {
  const coreFunctionality = coreUseAddToCart(product);

  const addToCart = async (quantity: number) => {
    // your own logic withoout core functionality. Mind to return the same interface as the original one and change it only if you know what you're doing
  };

  return {
    ...coreFunctionality,
    addToCart,
  };
}
```

<!-- /automd -->

## Replacing the whole composable

If you need to replace whole composable logic you can do this by not invoking core composable at all. This is the most radical way of customisation as you need to make sure that you are returning the same interface as the original one. A lot of things might break if you are not aware of the consequences of the change.

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/composables/overwriting-composables/replacing-the-whole-composable.ts" code lang="ts" no-name -->

```ts
// composables/useAddToCart.ts

import { Ref, useAddToCart } from "#imports";

export function useAddToCart(product: Ref<Product>) {
  // your own implementation
}
```

<!-- /automd -->
