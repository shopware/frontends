---
"@shopware/composables": minor
---

Let the CMS tree lookups follow a changing `content`, and fix `resolveCmsComponent().isResolved`

**`useCmsSection` and `useCmsBlock` accept a `ref` or a getter.** Both took a plain object and closed over it, so `getPositionContent()` and `getSlotContent()` kept reading the tree captured at setup: a component receiving a new `content` prop had to remount to see it, and calling the function again did not help. Both now accept `MaybeRefOrGetter` and resolve it with `toValue()` on every call.

Passing a plain object still works exactly as before, so nothing has to change. To benefit, pass a getter and read the lookups through a `computed`:

```ts
const { getSlotContent } = useCmsBlock(() => props.content);
const leftContent = computed(() => getSlotContent("left"));
```

The returned `section` and `block` are still the value read when the composable was called, so they do not follow a replacement — use the source you passed in when you need that.

**`resolveCmsComponent().isResolved` now means resolved.** It compared the resolved value with `content.type`, while Vue's `resolveComponent` returns the *component name* when nothing is registered — two strings that never match, so `isResolved` was `true` even when nothing resolved, and code guarding a fallback with `!isResolved` never ran. It is now derived from `resolvedComponent !== undefined`. Check `resolvedComponent` directly if you want the component itself.

Note what is not fixed here: `getSlotContent()` still returns `undefined` at runtime for a slot the block does not carry, while its return type promises a value. The signature stays as it is because correcting it would be a breaking type change; the JSDoc now says so, and callers should keep guarding on the result.
