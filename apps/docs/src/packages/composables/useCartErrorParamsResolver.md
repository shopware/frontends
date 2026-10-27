# useCartErrorParamsResolver

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cart--checkout"><div class="bg-red">Cart & Checkout</div></a>
</div>







## Types


```ts
export function useCartErrorParamsResolver(): UseCartErrorParamsResolver 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCartErrorParamsResolver/useCartErrorParamsResolver.ts#L23" target="_blank">source code</a>



```ts
export type UseCartErrorParamsResolver = {
  resolveCartError: (errorObject: ErrorObjectParam) => {
    params: { [key: string]: string | number | null | undefined } | null;
    messageKey: string;
  };
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCartErrorParamsResolver/useCartErrorParamsResolver.ts#L3" target="_blank">source code</a>

```ts
export type ErrorObjectParam = {
  messageKey: string;
  key: string;
  message?: string;
  code?: number;
  level?: number;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCartErrorParamsResolver/useCartErrorParamsResolver.ts#L10" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
