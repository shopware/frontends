# useContext

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>

Context helper composable to provide and inject data.
It takes `injectionName` to inject the context. If no context is provided, it will create a new one and provide it.
If `context` is provided in params, it will create new context, use param as value and provide it.
If `replace` is provided, it will replace the existing context with the new value.





## Types


```ts
export function useContext<T>(
  injectionName: string,
  params?: {
    context?: Ref<T> | T;
    replace?: T;
  },
) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useContext/useContext.ts#L14" target="_blank">source code</a>




<div data-placeholder="dynamic-markdown"></div>
