# Example: Modal and Teleport

This example shows you how to use a Modal with [Teleport](https://vuejs.org/guide/built-ins/teleport.html) in a [Nuxt 3](https://nuxt.com/docs/getting-started/introduction) and [Vue 3](https://vuejs.org/guide/introduction.html) application.

To have a single source of throuth we still using [inject](https://vuejs.org/api/composition-api-dependency-injection.html#inject) and [provide](https://vuejs.org/api/composition-api-dependency-injection.html#inject) to know if modal is opened or closed.

## Known Issues

You should wrapp the **Teleport** in **ClientOnly** because otherwise you can have problems with Server-Side-Rendering (SSR) [Error: `Child not found or undefined.`].

```
<ClientOnly>
    <Teleport to="#modal-content" :disabled="!modal.visible">
        <p>Hello from the home page!</p>
    </Teleport>
</ClientOnly>
```
